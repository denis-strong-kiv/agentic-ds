# Research: Multi-Brand Design Token Platform

**Feature**: `001-multibrand-tokens`
**Date**: 2026-03-02
**Phase**: 0 — Outline & Research

---

## 1. OKLCH Color Scale Generation

### Decision
Use **custom inline OKLCH math** (~80 lines of TypeScript, ~700 bytes gzip) rather than a third-party library.

### Rationale
The constitution prohibits external runtime dependencies. The OKLCH ↔ sRGB pipeline, 11-step
palette generation, gamut clamping, and WCAG contrast ratio calculation are entirely expressible in
~80 lines using established matrix constants. This keeps the Worker bundle at zero extra bytes and
eliminates any npm supply-chain surface.

### Alternatives Considered
- **culori** (tree-shaken, ~3–4 KB gzip): Best third-party option. Pure ESM, V8-compatible,
  excellent OKLCH support. Rejected because the constitution prohibits external runtime deps and
  the custom math covers 100% of the required functionality.
- **chroma.js**: Not ESM-native, not tree-shakeable, weaker OKLCH implementation. Rejected.
- **color.js**: Reference CSS Color 4 implementation; 60–80 KB even tree-shaken. Rejected.

### Algorithm: 11-Step Light + Dark Scale from One Seed

**Light-mode lightness targets (step 1 = lightest):**
```
L = [0.98, 0.95, 0.90, 0.82, 0.72, 0.62, 0.52, 0.42, 0.32, 0.22, 0.12]
```

**Dark-mode lightness targets (step 1 = darkest bg):**
```
L = [0.12, 0.20, 0.28, 0.36, 0.44, 0.54, 0.64, 0.74, 0.84, 0.92, 0.97]
```

**Chroma envelope** (sinusoidal taper toward extremes):
```
C_i = seed.C × sin(L_i × π)
```
This naturally reduces chroma at very light and very dark steps, preventing sRGB gamut clipping.

**Hue**: held constant at `seed.H` for all steps.

**Gamut clamping**: Binary search (20 iterations) reducing C until the resulting sRGB value is
within [0, 1] on all channels.

**Post-processing**: For steps designated as text colors (light mode steps 8–11, dark mode steps
1–4), assert WCAG AA contrast ≥ 4.5:1 against the expected background. If a step fails, shift L
via binary search until it passes.

### Color Space Math (Complete Pipeline)

**OKLCH → sRGB** (for scale output and contrast checking):
1. OKLCH → OKLab: `a = C·cos(H°), b = C·sin(H°)`
2. OKLab → Linear sRGB: inverse M1 + M2 matrices (Björn Ottosson constants)
3. Linear sRGB → gamma sRGB: IEC 61966-2-1 transfer function

**sRGB → OKLCH** (for parsing seed color input):
Reverse pipeline: gamma decode → M1 matrix → cube root → M2 matrix → atan2 for hue.

**WCAG contrast ratio**:
```
Y = 0.2126·R_linear + 0.7152·G_linear + 0.0722·B_linear
ratio = (max(Y1, Y2) + 0.05) / (min(Y1, Y2) + 0.05)
```

### Generated Scale Naming Convention
```
palette.{brand-id}.light.{step}   e.g. palette.acme.light.500
palette.{brand-id}.dark.{step}    e.g. palette.acme.dark.500
```
Steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 (11 steps, Tailwind-compatible naming).

---

## 2. Base UI Component Library

### Decision
**Shoelace (Web Awesome)** — open-source Web Components library with comprehensive three-tier CSS
variable surface.

### Rationale
Shoelace is the only evaluated library where all three tiers of CSS custom properties are explicitly
documented and exposed at the individual component level. Every component declares named `--sl-*`
custom properties for its own visual attributes. The token platform's Cloudflare Worker can serve
a brand's resolved CSS payload, and the browser applies it with zero JavaScript or rebuild step.
Web Components means no framework lock-in — the same Shoelace component works in React, Vue,
Svelte, or vanilla HTML.

### Alternatives Considered

| Library | Score | Gap |
|---|---|---|
| **Shoelace / Web Awesome** | 9/10 | None material |
| Radix UI Themes | 7.5/10 | Typography sizing and motion not CSS variables; React-only |
| Open Props | 8/10 | Primitives only, no components — requires pairing |
| daisyUI | 6/10 | Only semantic colors + 2–3 sizing knobs; no typography/motion CSS vars |
| shadcn/ui | 5/10 | HSL-channel variables (friction); typography/spacing not exposed at runtime |

### Token Delivery Pattern
The Worker serves resolved tokens as a `text/css` response:
```
GET /brands/:id/tokens.css?scheme=light
Content-Type: text/css

:root {
  /* Tier 1: Generated color scale */
  --sl-color-primary-50:  oklch(0.98 0.04 240);
  ...
  /* Tier 2: Semantic aliases */
  --sl-color-primary-500: oklch(0.62 0.18 240);
  /* Tier 3: Component overrides (per-brand) */
  --sl-button-background: var(--sl-color-primary-500);
  /* Non-color primitives */
  --sl-font-sans: "Brand Sans", sans-serif;
  --sl-font-size-medium: 1rem;
  --sl-spacing-medium: 1rem;
  --sl-border-radius-medium: 4px;
}
```
The consumer app loads this via `<link rel="stylesheet">` or dynamic injection.

---

## 3. D1 Schema and KV Caching Strategy

### Decision
- **Pre-compute** OKLCH color scales at brand write time; store as JSON in `brands.color_scale`.
- **5-table D1 schema**: brands, semantic_tokens, component_tokens, brand_token_overrides,
  token_validation_log.
- **KV keys**: `brand:{id}:tokens:{scheme}` (300s TTL) for the hot path.
- **Validation**: synchronous FK checks + async full validation via `ctx.waitUntil()`.

### Rationale
Pre-computing the scale at write time keeps the hot-path token resolution request free of CPU-heavy
OKLCH arithmetic. At 500+ brands with potentially thousands of requests per minute, computing
color scales inline would add 20–50 ms of CPU per D1-miss request. Storing the result in D1 and
caching in KV reduces the hot-path to a single KV read (~1 ms).

The 5-table schema is normalized to the minimum needed for the feature:
- `semantic_tokens` and `component_tokens` hold shared platform-level definitions (no `brand_id`).
- `brand_token_overrides` is intentionally sparse — only rows that differ from shared defaults.
- Resolution is a single two-level JOIN (no recursive SQL needed on the hot path).

### KV Key Structure
```
brand:{id}                     — brand record (60s TTL)
brand:{id}:tokens:light        — resolved CSS token map, light mode (300s TTL)
brand:{id}:tokens:dark         — resolved CSS token map, dark mode (300s TTL)
brand:{id}:overrides           — raw override list for admin (60s TTL)
tokens:semantic                — all semantic token definitions (600s TTL)
tokens:components              — all component token defaults (600s TTL)
brands:list                    — paginated brand index (60s TTL)
brands:ids                     — JSON array of all brand IDs, used for global invalidation
```

### Invalidation Rules
- Brand field updated → delete `brand:{id}`, `brand:{id}:tokens:light`, `brand:{id}:tokens:dark`
- Brand override changed → delete `brand:{id}:tokens:light`, `brand:{id}:tokens:dark`,
  `brand:{id}:overrides`
- Semantic/component token updated → delete `tokens:semantic`/`tokens:components`, then enumerate
  `brands:ids` and delete per-brand token keys for all brands (bulk KV delete, O(n) brands)

### Validation Split
| Check | Sync (before 2xx response) | Async (ctx.waitUntil) |
|---|---|---|
| FK existence (semantic/component ref exists) | ✅ | — |
| Duplicate identifier / override | ✅ | — |
| OKLCH channel range (L, C, H bounds) | ✅ | — |
| Missing required font families | ✅ | — |
| Circular token references | — | ✅ |
| Broken references (scale step out of range) | — | ✅ |
| WCAG AA contrast check (all semantic pairs) | — | ✅ |
| Cross-brand reference integrity | — | ✅ |

---

## 4. Multi-File Source Structure Approval

### Decision
The Worker source is organized across multiple TypeScript files compiled by Wrangler/esbuild into
a single bundle. This is the explicit approval required by the constitution's provision:
"unless a feature amendment explicitly approves additional source files."

### Rationale
The OKLCH engine, three-tier resolution logic, D1 schema helpers, and REST route handlers together
exceed what is maintainable in a single file without losing the constitution's intent (simplicity,
correctness, reviewability). Separating concerns into modules that compile to one bundle achieves
both goals.

### Structure
```
src/
├── index.ts              # fetch handler + URL dispatch (no logic)
├── router.ts             # route pattern matching helpers
├── types.ts              # shared TypeScript interfaces (Env, Brand, Token, etc.)
├── color/
│   └── oklch.ts          # custom OKLCH math, scale generation, WCAG contrast
├── brands/
│   ├── handler.ts        # brand CRUD route handlers
│   └── service.ts        # brand registration, scale generation, KV management
├── tokens/
│   ├── handler.ts        # semantic + component token route handlers
│   ├── resolver.ts       # three-tier token resolution engine
│   └── validator.ts      # async validation (circular refs, contrast, broken refs)
└── db/
    └── schema.ts         # D1 CREATE TABLE statements, migration helper
```

Wrangler bundles all modules into one Worker script. No new `wrangler.toml` bindings are required.

---

## 5. Token Output Format

### Decision
**CSS custom properties** (`text/css`) as the primary output format. JSON (`application/json`)
as a secondary format on the same endpoint via `Accept` header negotiation.

### Rationale
CSS custom properties are the native consumption format for Shoelace and any CSS-based component
library. Serving raw CSS means zero client-side transformation — the browser applies the stylesheet
directly. JSON is provided for tooling integrations (design editors, CI validation, style
dictionary pipelines).

---

## Summary of All Resolved Decisions

| Unknown | Decision | Rationale |
|---|---|---|
| OKLCH library | Custom inline math (~80 lines) | Constitution prohibits external runtime deps |
| UIKit | Shoelace (Web Awesome) | Only library with full three-tier CSS variable surface |
| Token output format | CSS custom properties + JSON secondary | Native browser consumption, zero transformation |
| Scale storage | Pre-compute at write time, store in D1 | Hot-path performance; avoids CPU on every request |
| Scale naming | `palette.{brand}.{light\|dark}.{step}` | Namespaced, collision-free, Tailwind-compatible |
| Validation mode | Sync lightweight + async deep | Workers CPU budget constraints |
| Multi-file source | Approved via this plan | Single-file unmaintainable at this complexity level |

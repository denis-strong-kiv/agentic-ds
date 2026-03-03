# Designer Guide — Multi-Brand Token Platform

This guide explains how the design token platform works from a product designer's perspective:
what controls what visually, how to set up a brand, and what you can observe at each step.

---

## Mental Model

Every visual decision in the UI flows through three layers:

```
Brand seed color
      │
      ▼
┌─────────────────────────────────────────────────┐
│  PRIMITIVE LAYER                                │
│  11-step color scale + spacing, radius,         │
│  motion, elevation                              │
│  (generated automatically from seed color)     │
└────────────────────┬────────────────────────────┘
                     │  named references
                     ▼
┌─────────────────────────────────────────────────┐
│  SEMANTIC LAYER                                 │
│  color.action.primary  →  step 500 (light)      │
│                           step 400 (dark)       │
│  color.surface.default →  step 50  (light)      │
│                           step 950 (dark)       │
│  (shared across all brands)                    │
└────────────────────┬────────────────────────────┘
                     │  aliased to Shoelace properties
                     ▼
┌─────────────────────────────────────────────────┐
│  COMPONENT LAYER                                │
│  button.background.default → --sl-button-*     │
│  input.border.focus        → --sl-input-*      │
│  (shared, with per-brand override capability)  │
└─────────────────────────────────────────────────┘
```

**Key principle**: a brand only defines its seed color, fonts, and optional primitive overrides.
Everything else — the scale, the semantic aliases, the component mappings — is inherited from the
platform's token definitions.

---

## What a Brand Consists Of

| Property | Required | Description |
|---|---|---|
| `id` | yes | URL-safe slug (`acme`, `brand-x`) — immutable after creation |
| `displayName` | yes | Human-readable name shown in UIs |
| `seedColor` | yes | Single OKLCH color that generates the entire scale |
| `fonts.display` | yes | Font for large headings and hero text |
| `fonts.heading` | yes | Font for section headings (H2–H4) |
| `fonts.body` | yes | Font for paragraph text and UI labels |
| `primitives` | no | Overrides for spacing, border radius, motion, elevation |

---

## The Color Scale

The platform generates **11 color stops** from the seed color automatically.

| Step | Lightness range | Intended use |
|---|---|---|
| `50` | ~0.98 (near white) | Page background, canvas |
| `100` | ~0.95 | Subtle tint, card surfaces |
| `200` | ~0.90 | Hover states on light surfaces |
| `300` | ~0.82 | Borders, dividers |
| `400` | ~0.72 | Disabled text, muted icons |
| `500` | **Exact seed** | Primary brand color |
| `600` | ~0.52 | Hover state on primary |
| `700` | ~0.42 | Pressed/active state |
| `800` | ~0.32 | Dark accents |
| `900` | ~0.22 | Near-black text |
| `950` | ~0.12 | Deepest tint, dark mode backgrounds |

The scale is generated in the **OKLCH color space**, which means equal numeric steps produce
perceptually equal jumps in lightness — unlike HSL where steps look uneven. The chroma (color
intensity) follows a sine curve, peaking near the middle of the scale and falling off toward the
lightest and darkest ends, because human perception allows less saturation at extremes.

**Dark mode uses a separate scale** computed from the same seed. Step `500` in dark mode is at a
slightly lower lightness to compensate for screen bloom. Each semantic token independently
references a different step for each mode, so dark-mode inversion is not a simple flip.

### Observing the generated scale

```
GET /brands/{id}/tokens.json?scheme=light

Response:
{
  "palette": {
    "50":  "oklch(0.980 0.0113 240.0)",
    "100": "oklch(0.950 0.0225 240.0)",
    ...
    "500": "oklch(0.620 0.1800 240.0)",   ← exact seed
    ...
    "950": "oklch(0.120 0.0225 240.0)"
  }
}
```

---

## Semantic Tokens — What Controls What

Semantic tokens are the platform-level vocabulary that maps palette steps to intentions. They are
**shared across all brands** — a brand changes their color, not the semantic token definitions.

### Naming convention

```
{category}.{role}.{variant}

color.action.primary      → interactive elements (buttons, links, focus rings)
color.action.secondary    → secondary interactive elements
color.surface.default     → page and panel backgrounds
color.surface.raised      → elevated surfaces (cards, modals)
color.text.primary        → body text
color.text.secondary      → captions, helper text
color.border.default      → dividers, input borders
color.feedback.success    → success states
color.feedback.error      → error/destructive states
color.feedback.warning    → warning states
spacing.content.gap       → standard gap between content blocks
```

### How light/dark refs work

Each semantic token stores two palette step references — one per mode:

```json
{
  "name": "color.action.primary",
  "tier1RefLight": "500",    ← step 500 of the brand's light scale
  "tier1RefDark": "400"      ← step 400 of the brand's dark scale
}
```

When you request the token CSS in dark mode, the platform resolves `color.action.primary` to step
`400` instead of `500`. The brand never needs to know about this — it just provides the seed color
and the scale is generated for both modes.

### Non-color semantic tokens

Semantic tokens can also point to primitive values instead of palette steps:

```json
{
  "name": "spacing.content.gap",
  "primitiveRef": "spacing.base"    ← resolves to the brand's spacing base (default: 1rem)
}
```

This lets brands override spacing globally by changing `primitives.spacing.base`.

---

## Component Tokens — Shoelace CSS Variables

Component tokens are the bridge to the UI kit. Each one maps a semantic token to a specific
Shoelace CSS custom property. The CSS variable name is derived from the component token name:

```
button.background.default  →  --sl-button-background
input.border.focus         →  --sl-input-border-focus
surface.background         →  --sl-surface-background
```

The `.default` suffix is dropped from the CSS variable name.

### What the CSS output looks like

When you request `/brands/acme/tokens.css?scheme=light`, you get a `:root {}` block that
Shoelace reads directly:

```css
:root {
  /* ── Generated color scale ─────────────────────────────── */
  --palette-brand-light-50:  oklch(0.980 0.0113 240.0);
  --palette-brand-light-100: oklch(0.950 0.0225 240.0);
  --palette-brand-light-200: oklch(0.900 0.0450 240.0);
  --palette-brand-light-300: oklch(0.820 0.0788 240.0);
  --palette-brand-light-400: oklch(0.720 0.1136 240.0);
  --palette-brand-light-500: oklch(0.620 0.1800 240.0);  ← exact seed
  --palette-brand-light-600: oklch(0.520 0.1439 240.0);
  --palette-brand-light-700: oklch(0.420 0.1136 240.0);
  --palette-brand-light-800: oklch(0.320 0.0788 240.0);
  --palette-brand-light-900: oklch(0.220 0.0450 240.0);
  --palette-brand-light-950: oklch(0.120 0.0225 240.0);

  /* ── Semantic tokens ───────────────────────────────────── */
  --color-action-primary:  var(--palette-brand-light-500);
  --color-surface-default: var(--palette-brand-light-50);
  --color-text-primary:    var(--palette-brand-light-900);

  /* ── Component tokens ──────────────────────────────────── */
  --sl-button-background:  var(--color-action-primary);
  --sl-input-border-focus: var(--color-action-primary);
  --sl-surface-background: var(--color-surface-default);

  /* ── Typography ────────────────────────────────────────── */
  --sl-font-sans:  "Cal Sans", sans-serif;
  --sl-font-serif: "Inter", serif;
  --sl-font-mono:  ui-monospace, monospace;
  --font-body:     "Inter", sans-serif;

  /* ── Spacing ───────────────────────────────────────────── */
  --sl-spacing-small:  0.5rem;
  --sl-spacing-medium: 1rem;
  --sl-spacing-large:  1.5rem;

  /* ── Border radius ─────────────────────────────────────── */
  --sl-border-radius-small:  2px;
  --sl-border-radius-medium: 6px;   ← brand override (default: 4px)
  --sl-border-radius-large:  8px;

  /* ── Motion ────────────────────────────────────────────── */
  --sl-transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
  --sl-transition-medium: 200ms cubic-bezier(0.4, 0, 0.2, 1);  ← brand override (default: 250ms)
  --sl-transition-slow:   400ms cubic-bezier(0.4, 0, 0.2, 1);

  /* ── Elevation ─────────────────────────────────────────── */
  --sl-shadow-small:  0 1px 2px rgba(0,0,0,0.05);
  --sl-shadow-medium: 0 4px 6px rgba(0,0,0,0.07);
  --sl-shadow-large:  0 10px 15px rgba(0,0,0,0.10);
}
```

The `var()` chain is intentional. The browser resolves it as:
```
--sl-button-background
  → --color-action-primary
    → --palette-brand-light-500
      → oklch(0.620 0.1800 240.0)
```

This means you can override at any tier without touching lower layers.

---

## Platform Defaults (Overridable by Brand)

The following values apply when a brand doesn't specify overrides.

### Spacing scale (in rem)
`0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8`

`spacing.medium` = `1rem` (index 3), `spacing.small` = `0.5rem` (index 1), `spacing.large` = `1.5rem` (index 4)

### Border radius
| Token | Default |
|---|---|
| `borderRadius.sm` | `2px` |
| `borderRadius.md` | `4px` |
| `borderRadius.lg` | `8px` |
| `borderRadius.xl` | `16px` |
| `borderRadius.full` | `9999px` |

### Motion durations
| Token | Default |
|---|---|
| `motion.durationFast` | `150ms` |
| `motion.durationBase` | `250ms` |
| `motion.durationSlow` | `400ms` |

### Easing curves
| Name | Curve | Use |
|---|---|---|
| `easingStandard` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `easingDecelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `easingAccelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving |

### Elevation (box shadows)
| Token | Default |
|---|---|
| `elevation.sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `elevation.md` | `0 4px 6px rgba(0,0,0,0.07)` |
| `elevation.lg` | `0 10px 15px rgba(0,0,0,0.10)` |

---

## Per-Brand Component Overrides

Sometimes a brand needs a specific component to behave differently — for example, Acme's buttons
should use a subdued background instead of the primary action color.

This is handled with an **override** that remaps a component token to a different semantic token,
for that brand only:

```
POST /brands/acme/overrides
{
  "componentToken": "button.background.default",
  "semanticTokenOverride": "color.surface.default"
}
```

After this, `GET /brands/acme/tokens.css?scheme=light` returns:
```css
--sl-button-background: var(--color-surface-default);   ← changed
```

Other brands are unaffected. The override is permanent until deleted:
```
DELETE /brands/acme/overrides/button.background.default
```

---

## Validation — What Gets Checked Automatically

Every time a brand is created or updated, the platform runs three automated checks in the
background and sets `validStatus` to `valid` or `invalid`.

### 1. Broken references
Checks that every semantic token references a real palette step (`50`–`950`) or a real primitive
path. If a semantic token references `tier1RefLight: "550"` (not a valid step), it fails.

### 2. Circular references
Checks that the token graph has no cycles. With the current model (components → semantics →
palette steps), cycles are structurally impossible, but the check is there as a safety net.

### 3. WCAG AA contrast
Pairs text/foreground semantic tokens (names containing `.text` or `.on.`) with background
semantic tokens (names containing `.surface` or `.background`), then checks each pair in both
light and dark mode.

**Threshold**: 4.5:1 (WCAG AA normal text)

A validation failure looks like:
```json
{
  "status": "fail",
  "errors": [
    {
      "code": "CONTRAST_FAIL",
      "foreground": "color.text.primary",
      "background": "color.surface.default",
      "scheme": "dark",
      "actual": 3.8,
      "required": 4.5,
      "message": "WCAG AA contrast failure in dark mode: 3.8:1 < 4.5:1"
    }
  ]
}
```

**How to fix**: Adjust the semantic token's dark-mode step reference to a lighter or darker step.
For example, change `color.text.primary` from `tier1RefDark: "100"` to `tier1RefDark: "50"` to
increase contrast in dark mode.

Tokens with `validStatus: "invalid"` still return their CSS — the platform doesn't block token
delivery — but the validation endpoint makes the failure visible.

---

## Observing a Brand End-to-End

### 1. See the raw palette

```
GET /brands/{id}/tokens.json?scheme=light
```

Look at the `"palette"` key. 11 `oklch()` values from `50` to `950`.

### 2. See semantic resolution

Same response, `"semantic"` key. Shows each semantic token name and its resolved oklch value.

### 3. See component resolution

Same response, `"component"` key. Shows each component token and its resolved value. Overrides
are already applied here.

### 4. See the CSS

```
GET /brands/{id}/tokens.css?scheme=light
GET /brands/{id}/tokens.css?scheme=dark
```

Copy-paste this into a browser devtools stylesheet to preview any Shoelace-based UI with that
brand applied.

### 5. Check validation status

```
GET /brands/{id}/validate
```

Returns `status: "pass"` or `status: "fail"` with a list of errors. Run after updating a brand or
semantic token definitions.

### 6. Compare two brands

Request the same endpoint with different brand IDs and compare `palette.500` values:

```
GET /brands/acme/tokens.json?scheme=light   →  "500": "oklch(0.620 0.1800 240.0)"
GET /brands/globex/tokens.json?scheme=light →  "500": "oklch(0.550 0.2000 30.0)"
```

---

## Applying a Brand to a Page

```html
<head>
  <!-- Light mode tokens — load first so Shoelace inherits them -->
  <link rel="stylesheet"
        href="https://tokens.example.com/brands/acme/tokens.css?scheme=light"
        media="(prefers-color-scheme: light)">

  <!-- Dark mode tokens -->
  <link rel="stylesheet"
        href="https://tokens.example.com/brands/acme/tokens.css?scheme=dark"
        media="(prefers-color-scheme: dark)">

  <!-- Shoelace reads the --sl-* variables defined above -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.x/dist/themes/light.css">
  <script type="module"
          src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.x/dist/shoelace.js">
  </script>
</head>
<body>
  <!-- These components are automatically branded -->
  <sl-button variant="primary">Save</sl-button>
  <sl-input label="Email" type="email"></sl-input>
</body>
```

To switch brands, change the `href`. The entire visual identity of every component updates
without touching markup or component code.

---

## Quick Reference — Endpoints for Designers

| What you want | Request |
|---|---|
| See a brand's full token output | `GET /brands/{id}/tokens.json?scheme=light` |
| Get the CSS to paste into devtools | `GET /brands/{id}/tokens.css?scheme=light` |
| Check if a brand passed validation | `GET /brands/{id}/validate` |
| See all active brands | `GET /brands` |
| See a brand's per-brand overrides | `GET /brands/{id}/overrides` |
| See all semantic token definitions | `GET /tokens/semantic` |
| See all component token mappings | `GET /tokens/components` |

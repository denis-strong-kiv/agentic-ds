# Implementation Plan: Multi-Brand Design Token Platform

**Branch**: `001-multibrand-tokens` | **Date**: 2026-03-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-multibrand-tokens/spec.md`

## Summary

Build a Cloudflare Workers REST API that lets platform operators register brands defined by a single
OKLCH seed color and three font families. The system algorithmically generates an 11-step light/dark
color scale from the seed, stores it in D1, and serves fully-resolved three-tier design tokens
(primitive → semantic → component) as CSS custom properties or JSON. Shoelace (Web Awesome) is the
base UI component library; its `--sl-*` CSS variable surface is the Tier 3 output target. Token
resolution is edge-cached in KV with a 300s TTL; validation (contrast, circular refs, broken refs)
runs asynchronously via `ctx.waitUntil()`.

## Technical Context

**Language/Version**: TypeScript — Cloudflare Workers runtime (V8 isolate, Workers SDK 4.x)
**Primary Dependencies**: Zero external runtime npm deps. Shoelace (Web Awesome) is the consumer-side UIKit — not bundled into the Worker.
**Storage**: D1 (`env.DB`) — brands + tokens + validation log; KV (`env.KV`) — resolved token cache (300s TTL); R2 (`env.BUCKET`) — brand assets (out of scope for this feature)
**Testing**: `GET /db/test` smoke test (per CLAUDE.md); manual end-to-end via `npm run dev` + curl (see quickstart.md)
**Target Platform**: Cloudflare Workers (global edge, V8 isolate)
**Project Type**: Web service — REST API for brand management, token authoring, and token resolution
**Performance Goals**: < 10ms p95 for KV-cached token resolution; < 200ms p95 for D1-miss resolution path
**Constraints**: Single Worker deployment; no external runtime npm deps (OKLCH math is custom inline TypeScript); multi-file source structure approved via this plan; 1MB compressed bundle limit
**Scale/Scope**: 500+ brands; ~200 component tokens; ~100 semantic tokens; SaaS multi-tenant

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Brand Isolation | ✅ PASS | Each brand has its own D1 rows and per-brand KV keys (`brand:{id}:tokens:{scheme}`). The brand key in the request scopes all D1 queries and KV lookups. No cross-brand data is ever fetched in the same query. |
| II. Runtime Configurability | ✅ PASS | Brand registration, updates, and deletions are pure D1 writes — zero redeployment. KV is invalidated on every mutation per the constitution's cache invalidation requirement. |
| III. Simplicity by Default | ✅ PASS | OKLCH math is custom inline (~80 lines), not a library. Resolution is a two-level SQL JOIN. No repository pattern, no DI framework, no abstraction layers beyond the minimum needed. Complexity Tracking entry required for multi-file structure (see below). |
| IV. Single-Deploy Constraint | ✅ PASS | One Cloudflare Worker handles all routes. No per-brand Workers, no separate deployments. |
| No external runtime deps | ✅ PASS | Custom OKLCH math eliminates the only candidate external library (culori). Zero new npm runtime dependencies. |
| Single-file source | ⚠️ JUSTIFIED | Multi-file source required — see Complexity Tracking. |
| Cache invalidation | ✅ PASS | Every mutation endpoint deletes the relevant KV key(s) before returning a response, per constitution requirement. |
| Route ordering | ✅ PASS | More-specific routes (e.g. `/brands/:id/tokens.css`) matched before catch-all patterns. |

**Post-Phase 1 Re-check**: All gates still pass. The data model and contracts introduce no new
violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-multibrand-tokens/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── brand-management.md
│   ├── token-authoring.md
│   └── token-resolution.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── index.ts              # fetch handler entry point — URL dispatch only, no logic
├── router.ts             # URL pattern matching helpers (replaces manual regex in index.ts)
├── types.ts              # Shared TypeScript interfaces: Env, Brand, SemanticToken,
│                         #   ComponentToken, Override, ValidationError, TokenMap
├── color/
│   └── oklch.ts          # Custom OKLCH math: scale generation, gamut clamping,
│                         #   WCAG contrast ratio, sRGB conversion
├── brands/
│   ├── handler.ts        # Brand CRUD route handlers (POST/GET/PUT/DELETE /brands/*)
│   └── service.ts        # Brand business logic: registration, scale generation,
│                         #   KV management, cache invalidation
├── tokens/
│   ├── handler.ts        # Token authoring + resolution route handlers
│   ├── resolver.ts       # Three-tier token resolution engine (component→semantic→primitive)
│   └── validator.ts      # Async validation: circular ref detection, broken refs,
│                         #   WCAG AA contrast checks across both schemes
└── db/
    └── schema.ts         # D1 CREATE TABLE statements + idempotent migration helper
                          #   (invoked by GET /db/test)
```

**Structure Decision**: Multi-file TypeScript compiled by Wrangler/esbuild into a single Worker
bundle. This is the explicit approval required by the constitution. The five concern areas
(color math, brand management, token management, resolution, DB schema) each contain logic
complex enough to be unmaintainable in a single file. The compiled output remains a single
Cloudflare Worker script.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Multi-file source (requires constitution approval) | OKLCH scale generation, three-tier resolution engine, async validation, and 15 REST endpoints together exceed what is reviewable in a single file | Single file would be 800+ lines with no logical separation; the constitution's intent (simplicity, correctness) is better served by modules that compile to one bundle |

---

## Phase 0: Research Summary

All unknowns resolved. See [research.md](research.md) for full findings.

| Unknown | Resolution |
|---|---|
| OKLCH color library | Custom inline math (~80 lines TypeScript). No external deps. |
| UIKit for CSS variable theming | Shoelace (Web Awesome) — only library with full three-tier CSS variable surface. Web Components, no framework lock-in. |
| Token output format | CSS custom properties (`text/css`) primary; JSON (`application/json`) secondary via Accept header. |
| Color scale storage | Pre-computed at brand write time, stored in `brands.color_scale` JSON column. Served via KV cache. |
| Validation strategy | Sync: FK existence, OKLCH range, missing fonts. Async: circular refs, broken refs, WCAG contrast — via `ctx.waitUntil()`. |
| Multi-file approval | Approved via this plan (constitution provision). |

## Phase 1: Design Artifacts

All Phase 1 artifacts generated:

- **[data-model.md](data-model.md)** — D1 schema (5 tables), KV value schemas, hot-path resolution
  query, entity relationships, `valid_status` state transitions
- **[contracts/brand-management.md](contracts/brand-management.md)** — Brand CRUD + override + validation report endpoints
- **[contracts/token-authoring.md](contracts/token-authoring.md)** — Semantic + component token CRUD endpoints
- **[contracts/token-resolution.md](contracts/token-resolution.md)** — CSS + JSON token resolution endpoints, integration guide
- **[quickstart.md](quickstart.md)** — End-to-end validation walkthrough (schema init → brand reg → authoring → resolution → Shoelace integration)

## Route Map (for implementation reference)

All routes must be matched in specificity order (more specific before general):

```
POST   /brands                              brand CRUD
GET    /brands                              paginated list
GET    /brands/:id                          get brand
PUT    /brands/:id                          update brand
DELETE /brands/:id                          delete brand
GET    /brands/:id/validate                 validation report
POST   /brands/:id/overrides               per-brand component override
GET    /brands/:id/overrides               list overrides
DELETE /brands/:id/overrides/:token        remove override

GET    /brands/:id/tokens.css              resolve tokens as CSS     ← BEFORE /:id catch-all
GET    /brands/:id/tokens.json             resolve tokens as JSON    ← BEFORE /:id catch-all

POST   /tokens/semantic                     semantic token CRUD
GET    /tokens/semantic
GET    /tokens/semantic/:name
PUT    /tokens/semantic/:name
DELETE /tokens/semantic/:name

POST   /tokens/components                   component token CRUD
GET    /tokens/components
GET    /tokens/components/:name
PUT    /tokens/components/:name
DELETE /tokens/components/:name

GET    /db/test                             schema init + smoke test
```

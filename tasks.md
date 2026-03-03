# Tasks: Multi-Brand Design Token Platform & Travel Design System

**Input**: `/specs/001-multibrand-tokens/spec.md`, product scoping sessions
**Prerequisites**: spec.md (required), CLAUDE.md (project context)

## Confirmed Stack & Scope

| Decision | Choice |
|----------|--------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript (strict) |
| Primitives | Radix UI Primitives (`@radix-ui/*`) — headless, zero styles, accessibility behavior only |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config) |
| Color System | OKLCH — perceptually uniform, algorithmic scale generation |
| Brand Color Model | 2 seeds (primary + accent) → 8 derived scales; neutralTemperature (warm/cool/neutral); semanticTemperature (warm/cool/neutral); shape (sharp/rounded/pill) |
| Token Pipeline | Code-first JSON → Style Dictionary → CSS custom properties |
| Brands | Multi-brand from day one (50–500+ brands, runtime registration) |
| Platforms | Web (Next.js) + React Native (shared tokens) |
| Verticals | Flights, Hotels, Cars, Activities, Packages |
| i18n | 10+ languages, full RTL support |
| Motion | Moderate — transitions + micro-interactions + skeletons |
| Accessibility | WCAG 2.1 AA |
| Docs | Storybook 9 + usage guidelines + do/don't examples |
| Deploy | Cloudflare Workers (existing infra) |

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Monorepo structure, tooling, and dependency installation

- [X] T001 Initialize monorepo structure using Turborepo at repository root with the following workspaces:
  - `packages/tokens/` — Token definitions, OKLCH engine, Style Dictionary config
  - `packages/ui/` — Custom component library built on Radix UI Primitives
  - `packages/storybook/` — Storybook 9 documentation site
  - `apps/web/` — Next.js 15 travel agency application
  - `apps/api/` — Cloudflare Worker (existing `src/index.ts` moves here)
  - Root `turbo.json` with `build`, `dev`, `lint`, `test`, `storybook` pipelines

- [X] T002 [P] Initialize `apps/web/` — Next.js 15 project with App Router:
  - TypeScript strict mode
  - Tailwind CSS v4 with CSS-first `@theme` configuration
  - `next.config.ts` with Cloudflare-compatible settings
  - ESLint + Prettier config extending workspace root
  - `app/layout.tsx` with brand context provider placeholder

- [X] T003 [P] Initialize `packages/tokens/` — TypeScript library:
  - `tsconfig.json` with `declaration: true` for type exports
  - Style Dictionary v4 as build dependency
  - `src/oklch/` directory for color engine
  - `src/definitions/` directory for token JSON files
  - `src/output/` directory for generated CSS/JSON artifacts
  - Export map in `package.json` for `@travel/tokens`

- [X] T004 [P] Initialize `packages/ui/` — Custom UI kit built on Radix Primitives:
  - Install Radix UI primitive packages as dependencies:
    - `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-select`
    - `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`, `@radix-ui/react-tabs`
    - `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`, `@radix-ui/react-switch`
    - `@radix-ui/react-slider`, `@radix-ui/react-scroll-area`, `@radix-ui/react-accordion`
    - `@radix-ui/react-navigation-menu`, `@radix-ui/react-avatar`, `@radix-ui/react-progress`
    - `@radix-ui/react-separator`, `@radix-ui/react-aspect-ratio`
  - CVA (class-variance-authority) for variant management
  - tailwind-merge + clsx utilities for className composition
  - `cn()` utility helper in `packages/ui/src/utils/cn.ts`
  - `composedVariants()` pattern file in `packages/ui/src/utils/variants.ts` — documents the CVA convention all components will follow
  - Directory structure:
    - `src/components/ui/` — base primitive components (Layer 1, built from Radix)
    - `src/components/travel/` — travel domain components (Layer 2, built from Layer 1)
    - `src/styles/` — global CSS, theme imports
    - `src/utils/` — cn, variants helpers
    - `src/brand/` — BrandProvider, hooks
  - Tailwind CSS v4 config consuming tokens from `@travel/tokens`
  - Export map in `package.json` for `@travel/ui`
  - **No shadcn/ui** — all components are hand-authored from Radix primitives; zero pre-styled defaults

- [X] T005 [P] Initialize `packages/storybook/` — Storybook 9:
  - `npx storybook@latest init` with React + Vite builder
  - Configure to consume `@travel/ui` and `@travel/tokens`
  - Theme switcher addon for light/dark and multi-brand preview
  - Accessibility addon (`@storybook/addon-a11y`)
  - Viewport addon with travel-relevant breakpoints (mobile, tablet, desktop, wide)
  - `.storybook/preview.ts` importing global token CSS

- [X] T006 [P] Configure shared tooling at monorepo root:
  - ESLint flat config with TypeScript, React, accessibility rules
  - Prettier with consistent formatting
  - `.gitignore` updates for monorepo (`dist/`, `.turbo/`, `.next/`)
  - Husky + lint-staged for pre-commit hooks
  - `tsconfig.base.json` shared across all packages

- [X] T007 [P] Configure testing infrastructure:
  - Vitest as workspace-level test runner
  - `vitest.workspace.ts` covering all packages
  - React Testing Library for component tests in `packages/ui/`
  - `@testing-library/jest-dom` matchers

**Checkpoint**: `turbo dev` starts all workspaces; `turbo build` succeeds with no errors

---

## Phase 2: Foundation — OKLCH Token Engine (Blocking Prerequisites)

**Purpose**: Core token infrastructure that ALL user stories and components depend on

**⚠️ CRITICAL**: No user story work or component development can begin until this phase is complete

- [X] T008 Implement OKLCH color engine in `packages/tokens/src/oklch/engine.ts`:
  - `generateColorScale(seed: OKLCHColor, mode: 'light' | 'dark'): ColorScale`
    - Steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
    - Light mode: L curves from 0.97 (step 50) → 0.25 (step 950), chroma modulated per step
    - Dark mode: inverted curve L 0.15 → 0.90; hue preserved (optional perceptual shift)
    - Gamut mapping: clamp to sRGB boundary
  - `deriveFullPalette(config: BrandColorConfig): BrandPalette`
    - **primary scale** — from `primarySeed` directly
    - **accent scale** — from `accentSeed` directly
    - **secondary scale** — blend of both seeds: `hue = avg(primary.hue, accent.hue)`, `chroma = avg * 0.5`
    - **neutral scale** — `neutralTemperature` controls tinting:
      - `warm` → hue from `accentSeed`, chroma 0.010–0.020
      - `cool` → hue from `primarySeed`, chroma 0.008–0.015
      - `neutral` → hue 0, chroma 0 (pure gray)
    - **success scale** — fixed green hue (145), shifted by `semanticTemperature`:
      - `warm` → hue 155; `cool` → hue 135; `neutral` → hue 145
    - **warning scale** — fixed amber hue (85): warm → 75, cool → 95, neutral → 85
    - **error scale** — fixed red hue (25): warm → 15, cool → 35, neutral → 25
    - **info scale** — fixed blue hue (250): warm → 240, cool → 260, neutral → 250
  - `deriveShapeTokens(shape: 'sharp' | 'rounded' | 'pill'): ShapeTokens`
    - sharp: radius-button 2px, radius-card 2px, radius-input 1px, radius-badge 1px
    - rounded: radius-button 8px, radius-card 12px, radius-input 6px, radius-badge 6px
    - pill: radius-button 9999px, radius-card 24px, radius-input 9999px, radius-badge 9999px
  - All functions pure, zero side effects, fully testable

- [X] T009 [P] Define OKLCH TypeScript types in `packages/tokens/src/oklch/types.ts`:
  - `OKLCHColor { lightness: number; chroma: number; hue: number }` — validation: L ∈ [0,1], C ≥ 0, H ∈ [0,360)
  - `ColorScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950`
  - `ColorScale = Record<ColorScaleStep, OKLCHColor>`
  - `ColorMode = 'light' | 'dark'`
  - `NeutralTemperature = 'warm' | 'cool' | 'neutral'`
  - `SemanticTemperature = 'warm' | 'cool' | 'neutral'`
  - `Shape = 'sharp' | 'rounded' | 'pill'`
  - `BrandColorConfig { primarySeed: OKLCHColor; accentSeed: OKLCHColor; neutralTemperature: NeutralTemperature; semanticTemperature: SemanticTemperature }`
  - `BrandPalette` — 8 named palettes each with `{ light: ColorScale; dark: ColorScale }`:
    - `primary`, `accent`, `secondary`, `neutral`, `success`, `warning`, `error`, `info`
  - `ShapeTokens` — keyed shape radius values: `{ button, card, input, badge, dialog, sm, md, lg }`
  - `ResolvedBrandTokens` — full brand palette + shape tokens + font declarations ready for CSS generation

- [X] T010 [P] Implement OKLCH utilities in `packages/tokens/src/oklch/utils.ts`:
  - `oklchToCSS(color: OKLCHColor): string` → `oklch(0.55 0.18 250)`
  - `oklchToHex(color: OKLCHColor): string` → `#0066FF` (for legacy/fallback)
  - `validateOKLCH(color: OKLCHColor): ValidationResult` — L ∈ [0,1], C ≥ 0, H ∈ [0,360)
  - `contrastRatio(fg: OKLCHColor, bg: OKLCHColor): number` — WCAG luminance-based
  - `meetsContrastAA(fg: OKLCHColor, bg: OKLCHColor, size: 'normal' | 'large'): boolean`

- [X] T011 [P] Implement OKLCH engine unit tests in `packages/tokens/src/oklch/__tests__/engine.test.ts`:
  - `generateColorScale`: produces 11 steps; lightness monotonic; gamut-clamped; boundary seeds accepted
  - `deriveFullPalette`: produces exactly 8 named palettes each with light + dark scales (176 total color values)
  - Secondary scale hue is average of primary + accent hues
  - Neutral warm: hue matches accentSeed, chroma in [0.010, 0.020]
  - Neutral cool: hue matches primarySeed, chroma in [0.008, 0.015]
  - Neutral neutral: chroma = 0 on all steps
  - Success/warning/error/info hues shift by ±10° per temperature selector
  - `deriveShapeTokens`: sharp → button radius ≤ 2px; rounded → button 6–12px; pill → button 9999px
  - `contrastRatio` and `meetsContrastAA` match known WCAG reference values

- [X] T012 Define platform-default primitive tokens in `packages/tokens/src/definitions/primitives/`:
  - `spacing.json` — scale: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 16, 20, 24 (in rem)
  - `shape.json` — three presets (sharp / rounded / pill) each declaring component-level radius tokens:
    - keys: `button`, `card`, `input`, `badge`, `dialog`, `sm`, `md`, `lg`, `full`
    - sharp:   button 2px,   card 2px,   input 1px,   badge 1px,   dialog 4px
    - rounded: button 8px,   card 12px,  input 6px,   badge 6px,   dialog 16px
    - pill:    button 9999px, card 24px, input 9999px, badge 9999px, dialog 24px
    - Platform default preset: `rounded`; brands override via `shape` selector
  - `typography.json` — size scale (xs through 4xl), line-height scale, weight scale (400–700), letter-spacing
  - `motion.json` — duration (fast: 100ms, normal: 200ms, slow: 300ms, slower: 500ms), easing curves (ease-out, ease-in-out, spring)
  - `elevation.json` — shadow definitions (sm, md, lg, xl, 2xl) using OKLCH-aware shadow colors (neutral hue-tinted)
  - `breakpoints.json` — sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

- [X] T013 Define semantic token schema in `packages/tokens/src/definitions/semantic/`:
  - `color-semantic.json` — mode-aware semantic mappings sourced from the 8 derived palettes:
    - **Surface tokens** (from `neutral` palette):
      - `color.background.default` → neutral-50 (light) / neutral-950 (dark)
      - `color.background.subtle` → neutral-100 / neutral-900
      - `color.surface.card` → neutral-100 / neutral-900 — card backgrounds
      - `color.surface.popover` → neutral-50 / neutral-900
      - `color.surface.overlay` → neutral-950/80% alpha / neutral-950/80%
      - `color.border.default` → neutral-200 / neutral-800
      - `color.border.muted` → neutral-100 / neutral-900
    - **Foreground tokens** (from `neutral` palette):
      - `color.foreground.default` → neutral-900 / neutral-50
      - `color.foreground.muted` → neutral-500 / neutral-400
      - `color.foreground.subtle` → neutral-400 / neutral-500
    - **Primary tokens** (from `primary` palette — primarySeed):
      - `color.primary.{default,hover,active}` → primary-500/600/700 (light) / primary-400/500/600 (dark)
      - `color.primary.foreground` → primary-50
    - **Accent tokens** (from `accent` palette — accentSeed):
      - `color.accent.{default,hover,active}` → accent-500/600/700 (light) / accent-400/500/600 (dark)
      - `color.accent.foreground` → accent-50
    - **Secondary tokens** (from `secondary` palette — derived blend):
      - `color.secondary.{default,hover,foreground}` → secondary-400/500 + secondary-50
    - **Semantic status tokens** (from temperature-shifted palettes):
      - `color.success.{default,foreground,subtle}` → success-500, success-50, success-100
      - `color.warning.{default,foreground,subtle}` → warning-500, warning-50, warning-100
      - `color.error.{default,foreground,subtle}` → error-500, error-50, error-100
      - `color.info.{default,foreground,subtle}` → info-500, info-50, info-100
    - Each token declares BOTH `lightValue` (step ref) and `darkValue` (step ref)
  - `shape-semantic.json` — maps brand shape preset to component radius CSS vars:
    - `shape.button` → `var(--shape-preset-button)` (resolves to sharp/rounded/pill preset values)
    - `shape.card`, `shape.input`, `shape.badge`, `shape.dialog`
  - `typography-semantic.json` — `text.heading.{1-6}` references `--font-heading`; `text.display` references `--font-display`; `text.body.{sm,md,lg}` references `--font-body`
  - `spacing-semantic.json` — `space.page`, `space.section`, `space.card`, `space.inline`, `space.stack`

- [X] T014 Define component token schema in `packages/tokens/src/definitions/component/`:
  - `button.json` — `button.{variant}.{background,foreground,border,shadow}.{default,hover,active,disabled,focus}`
  - `input.json` — `input.{background,foreground,border,placeholder}.{default,focus,error,disabled}`
  - `card.json` — `card.{background,border,shadow,foreground,header,footer}`
  - `badge.json` — `badge.{variant}.{background,foreground,border}`
  - `navigation.json` — `nav.{background,foreground,border,active,hover}`
  - All reference semantic tokens by name — no hard-coded values

- [X] T015 Implement Style Dictionary v4 build pipeline in `packages/tokens/src/build/`:
  - `config.ts` — Style Dictionary configuration consuming token JSONs
  - `transforms/oklch.ts` — custom transform to output OKLCH CSS values
  - `formats/css-custom-properties.ts` — generates `:root` and `.dark` CSS files with all resolved tokens
  - `formats/tailwind-theme.ts` — generates Tailwind v4 `@theme` compatible CSS
  - `formats/react-native.ts` — generates RN-compatible JS/TS token module (hex fallbacks for RN)
  - `formats/json-flat.ts` — generates flat JSON for runtime brand resolution API
  - Build script in `package.json`: `"build": "tsx src/build/run.ts"`

- [X] T016 Implement three-tier token resolution engine in `packages/tokens/src/resolver/`:
  - `resolver.ts` — `resolveToken(name: string, brand: BrandConfig, mode: ColorMode): ResolvedValue`
  - Traverses component → semantic → primitive/generated hierarchy
  - Detects and rejects circular references (FR-007)
  - Detects and reports broken references (FR-008)
  - Supports per-brand component token overrides (FR-012)
  - Returns resolved OKLCH CSS string or primitive value

- [X] T017 Implement token validation engine in `packages/tokens/src/validator/`:
  - `validator.ts` — `validateBrandTokens(brand: BrandConfig): ValidationReport`
  - Checks: OKLCH range validity, broken references, circular references
  - WCAG AA contrast checking on designated fg/bg pairs in both modes
  - Returns structured report per FR-015
  - `types.ts` — `ValidationReport`, `ValidationError`, `ContrastResult`

- [X] T018 Implement brand configuration types in `packages/tokens/src/brand/types.ts`:
  - `BrandConfig`:
    - `id: string` — URL-safe unique identifier
    - `displayName: string`
    - `primarySeed: OKLCHColor` — required; drives primary + influences secondary
    - `accentSeed: OKLCHColor` — required; drives accent + influences secondary + warm neutral tint
    - `neutralTemperature: NeutralTemperature` — `'warm' | 'cool' | 'neutral'`
    - `semanticTemperature: SemanticTemperature` — `'warm' | 'cool' | 'neutral'`
    - `shape: Shape` — `'sharp' | 'rounded' | 'pill'`
    - `fonts: { display: string; heading: string; body: string }` — required, no platform defaults
    - `overrides?: Record<string, string>` — per-brand component token overrides
  - `BrandRegistry` — runtime brand storage interface (list, get, set, delete by id)
  - `ResolvedTokenOutput` — flattened artifact for a brand + mode: all CSS custom properties + shape tokens + font declarations ready for injection

- [X] T019 [P] Write foundation integration test in `packages/tokens/src/__tests__/integration.test.ts`:
  - Register test brand with two seeds + warm/cool/neutral temperature variants + all three shape options
  - Assert `deriveFullPalette` produces all 8 named palettes × 2 modes (176 color values total)
  - Assert neutral scale tinting: warm uses accentSeed hue, cool uses primarySeed hue, neutral has chroma 0
  - Assert semantic hue shifts: warm → ±10° toward warm, cool → ±10° toward cool
  - Assert shape token values: sharp button = 2px, rounded = 8px, pill = 9999px
  - Resolve semantic + component tokens through all three tiers using each brand variant
  - Validate no broken references in default token set
  - Verify WCAG AA contrast on `color.primary.foreground` / `color.primary.default` and `color.foreground.default` / `color.background.default` in both modes

**Checkpoint**: `cd packages/tokens && npm run build` produces CSS custom properties, Tailwind theme, and RN tokens from a test brand config. Token resolution traverses all three tiers. Validation catches broken/circular references.

---

## Phase 3: User Story 1 — Brand Registration (Priority: P1) 🎯 MVP

**Goal**: Platform operators register brands via management API with two seeds + temperature selectors + shape; system derives 8 OKLCH palettes, shape tokens, and font declarations automatically

**Independent Test**: POST a brand with two seeds + temperatures + shape + fonts → GET brand → verify 8 palettes × 2 modes, correct neutral tinting, semantic hue shifts, and shape token values

### Implementation for User Story 1

- [X] T020 [US1] Implement brand registration API endpoint in `apps/api/src/routes/brands.ts`:
  - `POST /api/brands` — register new brand with full `BrandConfig`:
    - Required: `id`, `displayName`, `primarySeed`, `accentSeed`, `neutralTemperature`, `semanticTemperature`, `shape`, `fonts` (all three)
    - Optional: `overrides` (component token overrides)
  - Validate both OKLCH seed colors (L ∈ [0,1], C ≥ 0, H ∈ [0,360)) per FR-009
  - Validate all three font families present (FR-003)
  - Validate `neutralTemperature`, `semanticTemperature`, `shape` are valid enum values
  - Reject duplicate `id` with 409 Conflict
  - Derive full palette (`deriveFullPalette`) + shape tokens on registration
  - Store resolved output in `brand_tokens_cache` for immediate serving
  - Store full config in D1 for future re-derivation on updates

- [X] T021 [P] [US1] Create brand database schema migration in `apps/api/src/schema/`:
  - `brands` table:
    - `id TEXT PK`, `display_name TEXT`
    - `primary_l REAL`, `primary_c REAL`, `primary_h REAL` — primarySeed channels
    - `accent_l REAL`, `accent_c REAL`, `accent_h REAL` — accentSeed channels
    - `neutral_temperature TEXT` — 'warm' | 'cool' | 'neutral'
    - `semantic_temperature TEXT` — 'warm' | 'cool' | 'neutral'
    - `shape TEXT` — 'sharp' | 'rounded' | 'pill'
    - `font_display TEXT`, `font_heading TEXT`, `font_body TEXT`
    - `overrides_json TEXT`, `created_at TEXT`, `updated_at TEXT`
  - `brand_tokens_cache` table: `brand_id TEXT FK`, `mode TEXT`, `tokens_json TEXT`, `generated_at TEXT`
  - Compound PK on brand_tokens_cache (brand_id, mode)

- [X] T022 [US1] Implement brand CRUD operations in `apps/api/src/services/brand-service.ts`:
  - `registerBrand(config: BrandConfig): Promise<Brand>`
  - `getBrand(id: string): Promise<Brand | null>`
  - `updateBrand(id: string, updates: Partial<BrandConfig>): Promise<Brand>`
  - `listBrands(page: number, limit: number): Promise<PaginatedResult<Brand>>`
  - `deleteBrand(id: string): Promise<void>`
  - On create/update: trigger scale generation + cache invalidation

- [X] T023 [US1] Implement brand retrieval endpoints in `apps/api/src/routes/brands.ts`:
  - `GET /api/brands` — paginated list (FR-001b), supports 500+ brands (FR-001a)
  - `GET /api/brands/:id` — single brand config + metadata
  - `PUT /api/brands/:id` — update brand (triggers scale regeneration per FR-011)
  - `DELETE /api/brands/:id` — remove brand

- [X] T024 [US1] Wire brand API routes into existing Worker fetch handler in `apps/api/src/index.ts`:
  - Add `/api/brands/*` route patterns
  - Preserve existing route ordering rules from CLAUDE.md
  - Error responses with clear messages per FR-014

**Checkpoint**: Can register brand "acme" via POST with two seeds + temperatures + shape + fonts, retrieve it via GET, and see all 8 derived palettes (primary, accent, secondary, neutral, success, warning, error, info) in both light + dark modes. Palettes reflect correct neutral tinting and semantic hue shifts. Duplicate ids rejected. Missing/invalid seeds rejected. Invalid enum values rejected. Missing fonts rejected.

---

## Phase 4: User Story 2 — Three-Tier Token Authoring (Priority: P2)

**Goal**: Developers author semantic and component token layers; changing a seed color cascades through all tiers automatically

**Independent Test**: Change a brand's seed color → resolve a component token → verify it reflects the new palette

### Implementation for User Story 2

- [X] T025 [US2] Implement token authoring API in `apps/api/src/routes/tokens.ts`:
  - `GET /api/brands/:id/tokens` — full three-tier token tree for a brand
  - `GET /api/brands/:id/tokens/resolved?mode=light|dark` — fully resolved flat output (FR-010)
  - `PUT /api/brands/:id/tokens/component-overrides` — per-brand component token overrides (FR-012)

- [X] T026 [P] [US2] Implement token cascade integration in `apps/api/src/services/token-service.ts`:
  - Load shared semantic + component definitions from `packages/tokens`
  - Apply brand-specific overrides
  - Resolve through three tiers using `packages/tokens/resolver`
  - Generate CSS custom properties output
  - Generate Tailwind-compatible output

- [X] T027 [US2] Implement seed color change cascade in `apps/api/src/services/brand-service.ts`:
  - On seed update: regenerate both light + dark scales
  - Re-resolve all semantic tokens that reference scale steps
  - Re-resolve all component tokens that reference semantic tokens
  - Update cached resolved output
  - No manual propagation — fully automatic (SC-002)

**Checkpoint**: Update brand seed color → GET resolved tokens → all values reflect new palette. Component token `button.primary.background` traces through `color.primary.default` to correct scale step.

---

## Phase 5: User Story 3 — Token Validation & Audit (Priority: P3)

**Goal**: Validation engine detects broken references, circular deps, OKLCH range violations, and WCAG AA contrast failures

**Independent Test**: Submit a brand with invalid seed + low-contrast fg/bg pair → validation report surfaces both issues

### Implementation for User Story 3

- [X] T028 [US3] Implement validation API endpoint in `apps/api/src/routes/validation.ts`:
  - `POST /api/brands/:id/validate` — returns structured `ValidationReport`
  - Invokes `packages/tokens/validator` against brand's token set
  - Reports: broken refs, circular refs, OKLCH range errors, contrast failures
  - Evaluates contrast in BOTH light and dark modes independently (FR-015)
  - Returns clear actionable descriptions per failing pair

- [X] T029 [P] [US3] Implement WCAG AA contrast pair registry in `packages/tokens/src/validator/contrast-pairs.ts`:
  - Define which semantic token pairs must meet contrast requirements
  - `color.foreground.default` / `color.background.default` — 4.5:1
  - `color.primary.foreground` / `color.primary.default` — 4.5:1
  - `color.foreground.on-emphasis` / `color.background.emphasis` — 4.5:1
  - All error/warning/success foreground against their backgrounds
  - Large text pairs at 3:1 threshold

**Checkpoint**: Validation report catches invalid OKLCH values, broken token references, and contrast failures in a single pass. Clean brands return valid status.

---

## Phase 6: User Story 4 — Runtime Brand Resolution (Priority: P4)

**Goal**: End-user requests carry a brand key; system serves correct brand's tokens for the active color scheme

**Independent Test**: Request with brand key "acme" + dark mode → receive only Acme dark tokens, no cross-brand leakage

### Implementation for User Story 4

- [X] T030 [US4] Implement runtime resolution endpoint in `apps/api/src/routes/resolve.ts`:
  - `GET /api/resolve?brand=<key>&mode=<light|dark>` — returns resolved CSS custom properties
  - Brand key is required — missing/unknown key returns error, never fallback (FR-013, FR-014)
  - Serves from KV cache when available (60s TTL)
  - Returns appropriate `Content-Type` for CSS or JSON output

- [X] T031 [US4] Implement brand CSS generation in `apps/api/src/services/css-service.ts`:
  - Generate complete CSS custom properties block for a brand + mode
  - Include all three tiers resolved to final values
  - Include font-face declarations for brand fonts
  - Output consumable by Tailwind v4 `@theme` without modification (SC-003)

- [X] T032 [US4] Implement client-side brand loader in `packages/ui/src/brand/`:
  - `BrandProvider.tsx` — React context provider that fetches + applies brand tokens
  - `useBrand()` hook — access current brand config
  - `useBrandTokens()` hook — access resolved tokens
  - Injects CSS custom properties into `<html>` element before paint (SC-007)
  - No FOUC — tokens applied via `<link>` in `<head>` or inline `<style>` in SSR

- [X] T033 [US4] Implement Next.js middleware for brand resolution in `apps/web/middleware.ts`:
  - Extract brand key from subdomain, path segment, or header
  - Set brand context for SSR
  - Prefetch brand tokens CSS at edge

**Checkpoint**: Two brands with different seeds. Request for each brand + mode returns only that brand's tokens. Unknown brand key returns 404 error. No cross-brand or cross-mode leakage.

---

## Phase 7: Design System — Custom UI Kit Base Components

**Purpose**: Hand-authored base components built directly on Radix UI Primitives; all visual properties driven by tokens via CSS custom properties. Each component is a minimal, correct implementation styled to the design system — customizable later per brand or vertical.

**Depends on**: Phase 2 (Foundation) complete — tokens pipeline producing CSS custom properties

### Component conventions (apply to every component below)
- Import the relevant `@radix-ui/react-*` primitive — use its parts directly
- Style exclusively via token CSS custom properties (`var(--color-primary-default)` etc.) — zero hard-coded values
- Use CVA for variant definitions; pass `className` through `cn()` for overrides
- Export typed props interface extending the Radix primitive's props
- `data-state`, `data-disabled`, `aria-*` attributes come free from Radix — do not re-implement

### Core UI primitives (Layer 1)

- [X] T034 [P] Build custom form components in `packages/ui/src/components/ui/` from Radix Primitives:
  - `button.tsx` — **no Radix needed** (native `<button>`); CVA variants: primary, secondary, outline, ghost, destructive, link; sizes sm/md/lg/icon; loading state with spinner slot; focus ring via token
  - `input.tsx` — **native `<input>`** wrapped with token-styled border/background; error state, disabled, sizes, left/right icon slots; error message via `aria-describedby`
  - `textarea.tsx` — native `<textarea>`; token styling; auto-resize option; character count
  - `label.tsx` — native `<label>`; required indicator; helper text slot
  - `select.tsx` — `@radix-ui/react-select`; custom trigger + content + item; search variant passes filtered items
  - `checkbox.tsx` — `@radix-ui/react-checkbox`; custom indicator icon; indeterminate state
  - `radio-group.tsx` — `@radix-ui/react-radio-group`; custom indicator; horizontal + vertical layouts
  - `switch.tsx` — `@radix-ui/react-switch`; custom thumb + track; label positioning left/right
  - `slider.tsx` — `@radix-ui/react-slider`; price range variant; custom thumb + track styling
  - All components: basic implementation — styled to token system, ready for per-brand customization later

- [X] T035 [P] Build custom layout components in `packages/ui/src/components/ui/`:
  - `card.tsx` — **no Radix**; `div`-based with header/content/footer sub-components; CVA: elevated, outlined variants; token-driven radius via `--shape-card`
  - `separator.tsx` — `@radix-ui/react-separator`; horizontal + vertical; token color
  - `scroll-area.tsx` — `@radix-ui/react-scroll-area`; custom scrollbar track + thumb via tokens
  - `aspect-ratio.tsx` — `@radix-ui/react-aspect-ratio`; preset ratios: 16:9, 4:3, 1:1, 3:2
  - `skeleton.tsx` — **no Radix**; `div` with CVA pulse/shimmer animation variants; `aria-hidden="true"`
  - `badge.tsx` — **no Radix**; `span`-based; CVA variants: default, secondary, outline, destructive + travel: deal, new, popular
  - `avatar.tsx` — `@radix-ui/react-avatar`; custom image + fallback + status indicator slots
  - All: basic implementation, token-styled, ready for customization

- [X] T036 [P] Build custom overlay components in `packages/ui/src/components/ui/` from Radix Primitives:
  - `dialog.tsx` — `@radix-ui/react-dialog`; custom Overlay + Content; CVA sizes sm/md/lg/xl/full; mobile sheet variant; close button
  - `drawer.tsx` — `@radix-ui/react-dialog` (Portal + custom positioned Content); slide-in left/right/bottom via CSS transform + token motion
  - `sheet.tsx` — `@radix-ui/react-dialog`; full-height side panel variant; backdrop + content
  - `popover.tsx` — `@radix-ui/react-popover`; custom Content with token border/shadow/radius; arrow via `PopoverArrow`
  - `tooltip.tsx` — `@radix-ui/react-tooltip`; custom Content; delay prop; arrow; wraps `TooltipProvider`
  - `dropdown-menu.tsx` — `@radix-ui/react-dropdown-menu`; Item, CheckboxItem, RadioGroup, Sub; icon slot; keyboard shortcut slot
  - `command.tsx` — input + scrollable list (no Radix — custom implementation on `@radix-ui/react-popover`); keyboard `cmdk`-style filtering
  - `alert-dialog.tsx` — `@radix-ui/react-alert-dialog`; Confirm + Cancel action slots; cannot dismiss via overlay
  - All: basic implementation, ready for brand customization

- [X] T037 [P] Build custom feedback components in `packages/ui/src/components/ui/`:
  - `alert.tsx` — **no Radix**; `div`-based; CVA variants: info/success/warning/error; icon slot; dismissible option
  - `toast.tsx` — `@radix-ui/react-toast`; custom viewport + item; auto-dismiss; action button slot; swipe to dismiss
  - `progress.tsx` — `@radix-ui/react-progress`; linear variant; token-colored indicator; `aria-valuenow` managed by Radix
  - `accordion.tsx` — `@radix-ui/react-accordion`; single + multiple modes; custom trigger chevron; animated content height via CSS
  - All: basic implementation, ready for brand customization

- [X] T038 [P] Build custom navigation components in `packages/ui/src/components/ui/` from Radix Primitives:
  - `tabs.tsx` — `@radix-ui/react-tabs`; custom List + Trigger + Content; CVA: horizontal/vertical; icon slot; badge count slot
  - `navigation-menu.tsx` — `@radix-ui/react-navigation-menu`; custom `Content` for mega-menu layouts; viewport portal
  - `breadcrumb.tsx` — **no Radix**; `nav`/`ol`-based; collapsible middle items; last item non-link
  - `pagination.tsx` — **no Radix**; `nav`-based; page number buttons; prev/next; active state via CVA
  - All: basic implementation, ready for brand customization

- [X] T039 [P] Build custom data components in `packages/ui/src/components/ui/` from Radix Primitives:
  - `table.tsx` — **no Radix**; semantic `<table>`; sortable header (click callback); sticky columns via CSS; responsive collapse
  - `calendar.tsx` — **no Radix** (custom grid over native dates); date range selection; blocked dates; price overlay slot; month navigation; `aria-label` per day cell
  - `date-picker.tsx` — `@radix-ui/react-popover` + `calendar` component; single + range modes; flexible/nearby dates toggle
  - `combobox.tsx` — `@radix-ui/react-popover` + custom filtered list; searchable; async loading state; clears on Escape; IATA code display slot
  - All: basic implementation, ready for brand customization

- [X] T040 Wire Tailwind v4 `@theme` in `packages/ui/src/styles/theme.css`:
  - Import resolved token CSS custom properties
  - Map all tokens to Tailwind `@theme` directives
  - Define `light` and `dark` mode custom property blocks
  - Ensure all custom components reference only `@theme` tokens — audit for hard-coded values

**Checkpoint**: All ~40 base custom components render correctly, consume brand tokens, switch between light/dark modes, and have zero hard-coded color/spacing values. Each component is a clean Radix primitive wrapper — no hidden layer to fight when customizing.

---

## Phase 7.5: Base Component Testing

**Purpose**: Unit tests, interaction tests, and rendering verification for all base UI components

**Depends on**: Phase 7 (Base Components) — components must exist before testing

- [X] T077 [P] Write unit tests for form components in `packages/ui/src/components/ui/__tests__/`:
  - `button.test.tsx` — renders all variants (primary, secondary, outline, ghost, destructive, link) and sizes (sm, md, lg, icon); click handler fires; disabled state prevents click; loading state shows spinner; focus ring visible
  - `input.test.tsx` — renders default, error, disabled states; value change fires onChange; left/right slot icons render; error message associated via `aria-describedby`
  - `textarea.test.tsx` — auto-resize triggers on content; character count updates; disabled prevents input
  - `select.test.tsx` — opens on click; keyboard nav (ArrowDown, ArrowUp, Enter, Escape); selected value displays; disabled state
  - `checkbox.test.tsx` — toggles on click and Space; indeterminate state renders correctly; label association
  - `radio-group.test.tsx` — only one selected at a time; ArrowDown cycles options; disabled items skipped
  - `switch.test.tsx` — toggles on click and Space; `aria-checked` updates; label positioning
  - `slider.test.tsx` — value changes on drag; keyboard (ArrowLeft/Right); min/max respected; range mode

- [X] T078 [P] Write unit tests for layout components in `packages/ui/src/components/ui/__tests__/`:
  - `card.test.tsx` — renders header, content, footer slots; elevated vs. outlined variants apply correct classes
  - `badge.test.tsx` — renders all variants including travel-specific (deal, new, popular); text truncation
  - `avatar.test.tsx` — shows image when loaded; falls back to initials; shows status indicator
  - `skeleton.test.tsx` — pulse and shimmer variants render; `aria-hidden="true"` present
  - `separator.test.tsx` — horizontal and vertical orientation; correct `role="separator"`
  - `scroll-area.test.tsx` — renders children; scrollbar visible on overflow
  - `aspect-ratio.test.tsx` — maintains specified ratio; travel presets (16:9, 4:3, 1:1, 3:2)

- [X] T079 [P] Write unit tests for overlay components in `packages/ui/src/components/ui/__tests__/`:
  - `dialog.test.tsx` — opens/closes; Escape key closes; focus trapped inside; sizes sm/md/lg/xl/full; `aria-modal="true"`; overlay click closes (when configured)
  - `drawer.test.tsx` — opens from left/right/bottom; swipe-to-close on mobile; focus trap
  - `sheet.test.tsx` — side panel opens; content renders; close button works
  - `popover.test.tsx` — positioned relative to trigger; click outside closes; arrow renders
  - `tooltip.test.tsx` — shows on hover after delay; hides on mouse leave; `role="tooltip"`; keyboard focus shows tooltip
  - `dropdown-menu.test.tsx` — opens on trigger; keyboard nav through items; submenus open on ArrowRight; icons render; Escape closes
  - `command.test.tsx` — search filters items; keyboard selection; empty state renders
  - `alert-dialog.test.tsx` — confirmation and cancel actions fire; cannot dismiss via overlay click

- [X] T080 [P] Write unit tests for feedback + navigation components in `packages/ui/src/components/ui/__tests__/`:
  - `alert.test.tsx` — renders info, success, warning, error variants; icon correct per variant; dismissible option
  - `toast.test.tsx` — shows notification; auto-dismisses after timeout; action button fires callback; swipe to dismiss
  - `progress.test.tsx` — linear and circular variants; value updates aria-valuenow; indeterminate animation
  - `accordion.test.tsx` — single expand mode: opening one closes others; multiple expand mode; keyboard Enter/Space toggles
  - `tabs.test.tsx` — clicking tab shows panel; ArrowLeft/Right cycles; icons render; badge counts display; vertical orientation
  - `navigation-menu.test.tsx` — mega-menu opens on hover/click; submenu renders; active state
  - `breadcrumb.test.tsx` — renders path; collapsible middle items; last item not a link
  - `pagination.test.tsx` — page numbers render; prev/next buttons; active page highlighted; callback fires with page number

- [X] T081 [P] Write unit tests for data components in `packages/ui/src/components/ui/__tests__/`:
  - `table.test.tsx` — renders rows/columns; sortable header click fires callback; sticky column stays; responsive collapse hides columns
  - `calendar.test.tsx` — date range selection; blocked dates not selectable; price overlay renders; month navigation
  - `date-picker.test.tsx` — opens calendar; single date selects; range mode selects start/end; flexible dates toggle
  - `combobox.test.tsx` — search filters options; keyboard ArrowDown/Up + Enter selects; clearable; async loading state

- [X] T082 Write brand token integration tests in `packages/ui/src/components/__tests__/brand-integration.test.tsx`:
  - Render `Button` under two different brand `BrandProvider` configs
  - Verify CSS custom properties differ between brands
  - Switch from light to dark mode — verify token values update
  - Component with no `BrandProvider` throws or falls back gracefully
  - All component variants render without console errors under brand context

- [ ] T083 [P] Configure Storybook interaction tests (`play` functions) for critical components:
  - `button.stories.tsx` — `play`: click, verify callback, check focus ring visibility
  - `dialog.stories.tsx` — `play`: open, interact with content, Escape close, verify focus return
  - `combobox.stories.tsx` — `play`: type search, select option, verify selection displays
  - `date-picker.stories.tsx` — `play`: open, select range, verify dates display
  - `tabs.stories.tsx` — `play`: click each tab, verify panel content switches
  - Uses `@storybook/test` (`expect`, `userEvent`, `within`)

**Checkpoint**: `cd packages/ui && npx vitest run` — all base component tests pass. `npm run storybook -- --ci` — all interaction tests pass. Zero `aria-*` violations in test output.

---

## Phase 8: Design System — Travel Domain Components

**Purpose**: Higher-order components specific to the travel agency business domain, built from Radix Primitives and the custom base UI kit (Layer 2 on top of Layer 1)

**Depends on**: Phase 7 (Base Components) complete

### Search Components

- [X] T041 [P] Implement `SearchForm` in `packages/ui/src/components/travel/search-form.tsx`:
  - Tabbed interface: Flights | Hotels | Cars | Activities | Packages
  - Airport/city `Combobox` with IATA codes and fuzzy search
  - `DatePicker` range for travel dates (flexible dates option)
  - Passenger/room `Counter` with adult/child/infant breakdown
  - Class selector (Economy, Premium Economy, Business, First)
  - Trip type toggle (One-way, Round-trip, Multi-city)
  - Responsive: horizontal on desktop, stacked on mobile

- [X] T042 [P] Implement `FilterPanel` in `packages/ui/src/components/travel/filter-panel.tsx`:
  - Price range `Slider` with histogram
  - Airline/hotel chain `Checkbox` groups with logos
  - Star rating filter
  - Departure/arrival time range sliders
  - Number of stops filter (Non-stop, 1 stop, 2+ stops)
  - Amenities filter (WiFi, Pool, Breakfast, etc.)
  - Collapsible on mobile via `Sheet`
  - "Clear all" and active filter `Badge` count

### Result Components

- [X] T043 [P] Implement `FlightCard` in `packages/ui/src/components/travel/flight-card.tsx`:
  - Airline logo + name
  - Departure/arrival times with airport codes
  - Duration + stops visualization (timeline dots)
  - Price with currency and "per person" label
  - Fare class badges
  - Expand for fare breakdown (`Accordion`)
  - "Select" CTA `Button`
  - Responsive: card → list-item on mobile

- [X] T044 [P] Implement `HotelCard` in `packages/ui/src/components/travel/hotel-card.tsx`:
  - Image carousel (3-5 images) with `AspectRatio`
  - Hotel name + star rating
  - Location with distance to center/landmark
  - Amenity icons row (top 5)
  - Price per night with total stay price
  - Review score `Badge` + review count
  - "View Deal" CTA
  - Favorite/wishlist heart toggle

- [X] T045 [P] Implement `CarCard` in `packages/ui/src/components/travel/car-card.tsx`:
  - Vehicle image with category label (Economy, SUV, Luxury)
  - Car specs: seats, doors, transmission, AC, luggage capacity
  - Pickup/dropoff location
  - Price per day + total
  - Insurance options toggle
  - Provider logo

- [X] T046 [P] Implement `ActivityCard` in `packages/ui/src/components/travel/activity-card.tsx`:
  - Cover image with category overlay (Tour, Experience, Transfer)
  - Title + short description
  - Duration + difficulty badges
  - Rating stars + review count
  - Price per person
  - "Instant confirmation" / "Free cancellation" badges
  - Available dates indicator

### Booking Flow Components

- [X] T047 [P] Implement `BookingStepper` in `packages/ui/src/components/travel/booking-stepper.tsx`:
  - Steps: Search → Select → Customize → Passenger Details → Payment → Confirmation
  - Progress indicator with completed/active/upcoming states
  - Step labels with icons
  - Mobile-friendly horizontal scroll or vertical accordion

- [X] T048 [P] Implement `PriceBreakdown` in `packages/ui/src/components/travel/price-breakdown.tsx`:
  - Line items: base fare, taxes, fees, add-ons
  - Subtotals per passenger type
  - Discount/promo code applied row
  - Total with currency
  - Collapsible detail sections
  - Sticky on desktop during checkout scroll

- [X] T049 [P] Implement `PassengerForm` in `packages/ui/src/components/travel/passenger-form.tsx`:
  - Title, first name, last name, date of birth
  - Passport/ID number + expiry + nationality
  - Contact email + phone
  - Frequent flyer number (optional)
  - Special requests (meal preference, wheelchair)
  - Form validation with inline errors
  - "Copy from primary traveler" for additional passengers

- [X] T050 [P] Implement `SeatPicker` in `packages/ui/src/components/travel/seat-picker.tsx`:
  - Aircraft cabin grid layout
  - Seat status: available, occupied, selected, premium, exit-row
  - Color-coded by fare class
  - Zoom/pan on mobile
  - Price per seat overlay on hover/tap
  - Legend component
  - Accessible keyboard navigation (arrow keys to move, Enter to select)

- [X] T051 [P] Implement `RoomGallery` in `packages/ui/src/components/travel/room-gallery.tsx`:
  - Full-screen image gallery with thumbnails
  - Room type selector with price comparison
  - Amenities list with icons
  - Room size + bed configuration
  - "Last 2 rooms at this price" urgency badge
  - 360° view button placeholder

### Post-Booking Components

- [X] T052 [P] Implement `BookingConfirmation` in `packages/ui/src/components/travel/booking-confirmation.tsx`:
  - Confirmation number with copy-to-clipboard
  - Itinerary summary (outbound/return flights, hotel dates, car pickup)
  - QR code for mobile boarding pass placeholder
  - "Add to calendar" button
  - "Share itinerary" button
  - Print-friendly layout

- [X] T053 [P] Implement `ItineraryTimeline` in `packages/ui/src/components/travel/itinerary-timeline.tsx`:
  - Vertical timeline with date anchors
  - Flight/hotel/car/activity nodes with icons
  - Duration between events
  - Status badges (Confirmed, Pending, Cancelled)
  - Expandable detail per event

- [X] T054 [P] Implement `SupportChat` stub in `packages/ui/src/components/travel/support-chat.tsx`:
  - Floating action button to open
  - Chat bubble UI (user + agent messages)
  - Typing indicator
  - Attachment support stub
  - Minimize/maximize
  - Booking context pre-filled
  - (Full chat logic is backend — this is UI shell only)

**Checkpoint**: All domain components render with brand tokens, are responsive, and compose from Radix Primitives and base components. No hard-coded visual values.

---

## Phase 8.5: Domain Component & Visual Regression Testing

**Purpose**: Interaction tests for travel domain components + visual regression testing across brands and modes

**Depends on**: Phase 8 (Domain Components) + Phase 7.5 (testing patterns established)

### Domain Component Unit + Interaction Tests

- [ ] T084 [P] Write tests for search components in `packages/ui/src/components/travel/__tests__/`:
  - `search-form.test.tsx` — tab switching between verticals; airport combobox search + selection; date range picker opens and selects; passenger counter increments/decrements; trip type toggle switches; form submission callback fires with correct payload; responsive layout switches at breakpoint
  - `filter-panel.test.tsx` — price slider adjusts range; checkbox groups toggle; "Clear all" resets all filters; active filter badge count updates; mobile sheet opens/closes; filter change callback fires

- [ ] T085 [P] Write tests for result card components in `packages/ui/src/components/travel/__tests__/`:
  - `flight-card.test.tsx` — displays airline, times, price; accordion expands fare breakdown; "Select" button fires callback; stops visualization renders correct dots; responsive layout
  - `hotel-card.test.tsx` — image carousel navigates; star rating renders; amenity icons display; favorite toggle fires callback; review score badge correct variant
  - `car-card.test.tsx` — vehicle specs render; insurance toggle fires callback; price calculation correct
  - `activity-card.test.tsx` — category overlay; duration badge; rating stars; confirmation/cancellation badges render conditionally

- [ ] T086 [P] Write tests for booking flow components in `packages/ui/src/components/travel/__tests__/`:
  - `booking-stepper.test.tsx` — step states (completed, active, upcoming) render correctly; step click navigates (when allowed); progress indicator percentage; mobile scroll behavior
  - `price-breakdown.test.tsx` — line items sum to total; discount row displays when promo applied; collapsible sections toggle; sticky positioning class applied
  - `passenger-form.test.tsx` — all fields validate on submit; inline errors display for invalid fields; "Copy from primary" populates fields; frequent flyer field optional; special requests dropdown works
  - `seat-picker.test.tsx` — seat click selects/deselects; occupied seats not clickable; keyboard Arrow key navigation moves focus; Enter selects seat; legend renders; premium seats show price overlay; selected seat count updates

- [ ] T087 [P] Write tests for post-booking components in `packages/ui/src/components/travel/__tests__/`:
  - `booking-confirmation.test.tsx` — confirmation number renders; copy-to-clipboard fires; itinerary summary shows all segments; add-to-calendar button present; print layout
  - `itinerary-timeline.test.tsx` — timeline nodes render per event type; date anchors correct; status badges show right state; expand/collapse detail
  - `room-gallery.test.tsx` — full-screen opens; thumbnail click switches main image; room type selector changes content; amenity icons render
  - `support-chat.test.tsx` — FAB opens chat; messages render; minimize/maximize toggles; typing indicator shows

### Visual Regression Testing

- [ ] T088 Configure visual regression testing infrastructure:
  - Install Chromatic or Percy (Chromatic recommended — native Storybook integration)
  - CI pipeline integration: run visual snapshots on every PR
  - Configure snapshot matrix:
    - **2 modes**: light + dark
    - **3 brands**: default brand, partner-a, partner-b (test brand configs)
    - **4 viewports**: mobile (375px), tablet (768px), desktop (1280px), wide (1536px)
    - Total: 2 × 3 × 4 = **24 snapshot variants per story**
  - Baseline approval workflow
  - `.chromaticrc` or `percy.yml` config at monorepo root

- [ ] T089 [P] Create visual regression stories for critical UI states in `packages/storybook/stories/visual-regression/`:
  - `brand-matrix.stories.tsx` — same component rendered under all 3 test brands side-by-side
  - `mode-comparison.stories.tsx` — same component in light vs. dark for each brand
  - `state-matrix.stories.tsx` — Button (default, hover, focus, disabled, loading) × all variants
  - `form-states.stories.tsx` — Input (empty, filled, error, disabled) + Select + Checkbox states
  - `dialog-states.stories.tsx` — Dialog at each size with content
  - `travel-cards.stories.tsx` — FlightCard, HotelCard, CarCard, ActivityCard in default + compact + loading skeleton
  - `booking-flow.stories.tsx` — BookingStepper at each step state
  - `responsive-matrix.stories.tsx` — SearchForm + FilterPanel at mobile, tablet, desktop

- [ ] T090 [P] Write RTL visual regression stories in `packages/storybook/stories/visual-regression/`:
  - `rtl-layout.stories.tsx` — critical components in LTR vs. RTL layout comparison
  - `rtl-forms.stories.tsx` — SearchForm, PassengerForm, FilterPanel in RTL
  - `rtl-cards.stories.tsx` — FlightCard, HotelCard in RTL
  - Ensures directional icons are mirrored, text aligns correctly, margins/paddings flip

**Checkpoint**: `npx vitest run` — all domain component tests pass. `npx chromatic` (or equivalent) — visual baselines captured for all brand × mode × viewport combinations. PR diffs show visual changes clearly.

---

## Phase 9: Internationalization & RTL

**Purpose**: Full i18n infrastructure supporting 10+ languages with bidirectional layout

**Depends on**: Phase 7 (Base Components) — component text and layout must be parameterized

- [ ] T055 Install and configure `next-intl` in `apps/web/`:
  - Locale detection (Accept-Language header, URL prefix, cookie)
  - `messages/` directory with JSON per locale
  - `[locale]/` route segment for URL-based locale
  - Default locale: `en`, fallback behavior configuration

- [ ] T056 [P] Implement RTL support infrastructure in `packages/ui/`:
  - Tailwind v4 RTL plugin or logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*` instead of `ml-*`, `mr-*`, `pl-*`, `pr-*`)
  - `dir="rtl"` on `<html>` element via layout
  - Audit all components for directional CSS (margins, padding, borders, transforms)
  - Icon mirroring for directional icons (arrows, chevrons)
  - `useDirection()` hook for programmatic layout decisions

- [ ] T057 [P] Create translation key structure for travel domain in `apps/web/messages/en.json`:
  - `common.*` — shared terms (Search, Book, Cancel, Price, etc.)
  - `flights.*` — flight-specific (Departure, Arrival, Stops, etc.)
  - `hotels.*` — hotel-specific (Check-in, Check-out, Room type, etc.)
  - `cars.*` — car rental terms
  - `activities.*` — activity/tour terms
  - `booking.*` — checkout flow terms
  - `support.*` — help/support terms
  - Number/currency/date formatting per locale via `Intl` APIs

- [ ] T058 [P] Add locale for Arabic (RTL) in `apps/web/messages/ar.json`:
  - Full translation of all keys (placeholder text acceptable for MVP)
  - RTL-specific number formatting
  - Date formatting (Hijri calendar option)
  - Currency display (SAR, AED, EGP)

**Checkpoint**: App renders in English (LTR) and Arabic (RTL) with correct layout mirroring. All components adapt to direction. Currency and date formats are locale-aware.

---

## Phase 10: Motion & Animation System

**Purpose**: Consistent, token-driven motion across all components with reduced-motion support

**Depends on**: Phase 2 (Foundation) — motion tokens defined

- [ ] T059 Implement motion token layer in `packages/tokens/src/definitions/primitives/motion.json`:
  - Duration tokens: `motion.duration.instant` (0ms), `fast` (100ms), `normal` (200ms), `slow` (300ms), `slower` (500ms)
  - Easing tokens: `motion.easing.default` (ease-out), `entrance` (ease-out), `exit` (ease-in), `spring` (cubic-bezier)
  - Animation presets: `motion.animation.fade-in`, `slide-up`, `slide-down`, `scale-in`, `skeleton-pulse`, `skeleton-shimmer`

- [ ] T060 [P] Implement motion utilities in `packages/ui/src/utils/motion.ts`:
  - `transition()` helper that applies duration + easing tokens
  - `animate()` helper for keyframe animations
  - `reduceMotion()` wrapper respecting `prefers-reduced-motion`
  - When reduced motion: replace animations with opacity-only instant transitions
  - Tailwind custom utilities: `animate-fade-in`, `animate-slide-up`, etc.

- [ ] T061 [P] Add micro-interactions to base components:
  - Button: press scale (0.98), hover lift
  - Card: hover shadow elevation increase
  - Checkbox/Switch: spring toggle animation
  - Toast: slide-in from edge + auto-dismiss slide-out
  - Skeleton: shimmer gradient sweep
  - Dialog: backdrop fade + content scale-in
  - All respect `prefers-reduced-motion`

**Checkpoint**: Components animate smoothly using token-defined durations/easings. `prefers-reduced-motion` disables all non-essential animations. Motion is consistent across components.

---

## Phase 11: Storybook Documentation

**Purpose**: Visual component catalog with usage guidelines, brand switching, accessibility auditing, and do/don't examples

**Depends on**: Phase 7 + 8 — components must exist to document them

- [ ] T062 Configure Storybook global decorators in `packages/storybook/.storybook/preview.ts`:
  - Brand selector toolbar (switch between registered brands)
  - Color mode toggle (light/dark)
  - Locale/direction toggle (LTR/RTL)
  - Viewport presets (iPhone SE, iPhone 15, iPad, Desktop, Wide)
  - `BrandProvider` wrapper loading selected brand's tokens

- [ ] T063 [P] Write stories for ALL base UI components in `packages/storybook/stories/ui/`:
  - One story file per component (e.g., `button.stories.tsx`)
  - All variants and sizes showcased
  - Interactive controls via `argTypes` for every prop
  - Auto-generated docs from TypeScript interfaces
  - Accessibility panel verified (no violations)

- [ ] T064 [P] Write stories for ALL travel domain components in `packages/storybook/stories/travel/`:
  - `search-form.stories.tsx` — each tab (Flights, Hotels, Cars, Activities, Packages)
  - `flight-card.stories.tsx` — one-way, round-trip, multi-stop, expired deal
  - `hotel-card.stories.tsx` — luxury, budget, sold-out states
  - `seat-picker.stories.tsx` — partially booked cabin, fully interactive
  - `booking-stepper.stories.tsx` — each step active
  - `price-breakdown.stories.tsx` — with/without discounts
  - `passenger-form.stories.tsx` — empty, filled, validation errors

- [ ] T065 [P] Create usage guideline docs in `packages/storybook/stories/docs/`:
  - `getting-started.mdx` — installation, importing, using BrandProvider
  - `design-tokens.mdx` — token naming convention, three-tier model explained, how to add tokens
  - `color-system.mdx` — OKLCH overview; two-seed model (primary + accent); derivation of secondary / neutral / semantic palettes; neutralTemperature (warm/cool/neutral) effect on backgrounds + surfaces; semanticTemperature effect on status color hues; mode-awareness (light/dark)
  - `brand-personality.mdx` — visual explanation of how `primarySeed`, `accentSeed`, `neutralTemperature`, `semanticTemperature`, and `shape` combine to produce a brand personality; side-by-side examples (Luxury/Adventure/Eco); do/don't guidance on seed color selection
  - `shape.mdx` — sharp/rounded/pill presets visualized across all component types; guidance on which preset suits which brand personality
  - `typography.mdx` — type scale visualization, font role (display/heading/body), responsive sizing
  - `spacing.mdx` — spacing scale visualization, when to use which level
  - `motion.mdx` — animation principles, duration/easing tokens, reduced motion policy
  - `accessibility.mdx` — contrast requirements, keyboard nav patterns, screen reader expectations
  - `rtl.mdx` — RTL guidelines, what mirrors and what doesn't, testing checklist
  - `multi-brand.mdx` — how brand theming works, registering a brand with two seeds, testing brand isolation

- [ ] T066 [P] Create do/don't example pages in `packages/storybook/stories/guidelines/`:
  - `color-usage.mdx` — DO: use semantic tokens; DON'T: use scale steps directly in components
  - `component-composition.mdx` — DO: compose from Radix Primitives; DON'T: rebuild accessible patterns from scratch (focus trap, ARIA, keyboard nav)
  - `responsive.mdx` — DO: use breakpoint tokens; DON'T: hard-code pixel values
  - `forms.mdx` — DO: use label + input + error pattern; DON'T: rely on placeholder as label
  - Each with visual side-by-side comparison

- [ ] T067 Create brand showcase page in `packages/storybook/stories/showcase/`:
  - `brand-comparison.stories.tsx` — same component set rendered under 3+ brands with different seeds + temperatures + shapes (Luxury Airways, Adventure Co, Eco Getaways)
  - `palette-viewer.stories.tsx` — for the selected brand, visualize all **8 derived palettes** (primary, accent, secondary, neutral, success, warning, error, info) × 2 modes; each step shows OKLCH value + hex fallback; neutral panel shows warm/cool/neutral variant side-by-side
  - `temperature-explorer.stories.tsx` — interactive story: fix two seeds, toggle `neutralTemperature` and `semanticTemperature` selectors and see backgrounds + status colors update live
  - `shape-explorer.stories.tsx` — render Button, Input, Card, Badge, Dialog simultaneously under sharp / rounded / pill presets; instant toggle to compare personalities
  - `contrast-checker.stories.tsx` — interactive fg/bg pair picker with WCAG AA pass/fail in both light + dark modes, sourced from the active brand's derived palette

**Checkpoint**: `npm run storybook` launches documentation site. All components have stories. Brand switcher works. Accessibility addon reports no violations. Guidelines are publishable quality.

---

## Phase 12: React Native Token Sharing

**Purpose**: Shared token artifacts consumable by React Native apps

**Depends on**: Phase 2 (Foundation) — Style Dictionary RN format must exist

- [ ] T068 Implement React Native token output format in `packages/tokens/src/build/formats/react-native.ts`:
  - Generate `tokens.ts` with typed token constants
  - OKLCH → hex conversion for RN (RN does not support `oklch()` CSS)
  - Spacing values in density-independent pixels
  - Typography as RN `TextStyle` objects
  - Shadow as RN `ViewStyle.shadow*` properties

- [ ] T069 [P] Create `packages/tokens-native/` wrapper package:
  - Re-exports generated RN token module as `@travel/tokens-native`
  - TypeScript types for all token categories
  - `useBrandTokens()` hook for React Native (fetches from resolution API, applies to RN StyleSheet)
  - Color mode detection via RN `useColorScheme()`

- [ ] T070 [P] Write token parity tests in `packages/tokens/src/__tests__/parity.test.ts`:
  - For every CSS custom property output, verify a corresponding RN token exists
  - Verify hex values are valid conversions of OKLCH values
  - Verify spacing scale matches between CSS rem and RN dp values

**Checkpoint**: `@travel/tokens-native` exports typed tokens. Parity tests pass — web and native tokens are in sync for every brand.

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Quality, performance, and documentation finalization

- [ ] T071 [P] Audit all components for WCAG 2.1 AA compliance:
  - Color contrast on all fg/bg pairs (automated via Storybook a11y addon)
  - Focus indicators visible on all interactive elements
  - Keyboard navigation: Tab order, Enter/Space activation, Escape close
  - Screen reader: all images have alt text, all controls have accessible names
  - Touch targets: minimum 44x44px on mobile
  - Generate accessibility report

- [ ] T072 [P] Performance audit:
  - Bundle size analysis per component (no single component > 15KB gzipped)
  - Tree-shaking verification — unused components don't ship
  - Tailwind CSS purge — only used utilities in production CSS
  - Font loading strategy: `font-display: swap` with preload
  - Image components use `next/image` with proper sizing

- [ ] T073 [P] Update CLAUDE.md with design system architecture:
  - Monorepo structure documentation
  - Token pipeline commands
  - Component development workflow
  - Storybook development commands
  - Brand registration workflow

- [ ] T074 [P] Update README.md with design system getting started:
  - Monorepo setup instructions
  - Quick start for component development
  - Storybook usage
  - Adding a new brand
  - Adding a new component
  - Contributing guidelines

- [ ] T075 Code cleanup and consistency pass:
  - Consistent named exports across all packages
  - Barrel files (`index.ts`) for clean import paths
  - Remove any remaining TODO/FIXME comments
  - Verify all TypeScript strict mode — no `any` types

- [ ] T076 Security review:
  - Brand API: input validation on all endpoints
  - CSS injection prevention in token values
  - XSS prevention in brand display names
  - Rate limiting on brand management endpoints

**Checkpoint**: All accessibility audits pass. Bundle sizes are within budget. Documentation is complete and accurate. No `any` types or hard-coded values remain.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1:   Setup ────────────────────────────────────────── No deps
Phase 2:   Foundation (OKLCH Engine + Tokens) ───────────── Depends on Phase 1
Phase 3:   US1 Brand Registration ───────────────────────── Depends on Phase 2
Phase 4:   US2 Three-Tier Authoring ─────────────────────── Depends on Phase 2 + 3
Phase 5:   US3 Validation & Audit ───────────────────────── Depends on Phase 2
Phase 6:   US4 Runtime Resolution ───────────────────────── Depends on Phase 3 + 4
Phase 7:   Base Components ─────────────────────────────── Depends on Phase 2
Phase 7.5: Base Component Testing ──────────────────────── Depends on Phase 7
Phase 8:   Domain Components ───────────────────────────── Depends on Phase 7
Phase 8.5: Domain Component + Visual Regression Testing ── Depends on Phase 7.5 + 8
Phase 9:   i18n & RTL ──────────────────────────────────── Depends on Phase 7
Phase 10:  Motion System ───────────────────────────────── Depends on Phase 2
Phase 11:  Storybook Docs ──────────────────────────────── Depends on Phase 7 + 8
Phase 12:  React Native Tokens ─────────────────────────── Depends on Phase 2
Phase 13:  Polish ──────────────────────────────────────── Depends on all above
```

### Parallel Opportunities After Phase 2

Once Foundation is complete, these can run in parallel:
- **Track A** (API): Phase 3 → 4 → 5 → 6 (sequential — each builds on previous)
- **Track B** (UI): Phase 7 → 7.5 → 8 → 8.5 (sequential — tests follow their components)
- **Track C** (Infra): Phase 9, 10, 12 (independent — can parallel with Track B)
- **Track D** (Docs): Phase 11 (starts after Phase 8, can overlap with Phase 9-10)

### MVP Milestone

After completing **Phases 1-3 + 7 + 7.5**: you have a working token engine, brand registration, a full component library styled by brand tokens, and verified component tests. This is a demoable MVP.

---

## Task Count Summary

| Phase | Tasks | Parallel | Sequential |
|-------|-------|----------|------------|
| 1. Setup | 7 | 5 | 2 |
| 2. Foundation | 12 | 6 | 6 |
| 3. US1 Brand Registration | 5 | 1 | 4 |
| 4. US2 Token Authoring | 3 | 1 | 2 |
| 5. US3 Validation | 2 | 1 | 1 |
| 6. US4 Runtime Resolution | 4 | 0 | 4 |
| 7. Base Components | 7 | 6 | 1 |
| 7.5 Base Component Testing | 7 | 6 | 1 |
| 8. Domain Components | 14 | 14 | 0 |
| 8.5 Domain + Visual Regression Testing | 7 | 6 | 1 |
| 9. i18n & RTL | 4 | 3 | 1 |
| 10. Motion | 3 | 2 | 1 |
| 11. Storybook Docs | 6 | 5 | 1 |
| 12. RN Tokens | 3 | 2 | 1 |
| 13. Polish | 6 | 4 | 2 |
| **Total** | **90** | **62** | **28** |

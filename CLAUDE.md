# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

---

## UI Manifest

**`docs/ui-manifest.dsl`** — auto-generated index of all components, tokens, dependency graph, UI patterns, and screen mappings. Read this file before working on any component or UI task. Regenerate after adding or changing components:

```bash
pnpm generate:ui-manifest
```

---

## Overview

This repository is a **multi-brand travel design system** monorepo built with Turborepo + pnpm workspaces.
It also contains a legacy Cloudflare Worker at the root (`src/index.ts`); see the [Cloudflare Worker](#cloudflare-worker) section below.

---

## Monorepo Structure

```
Agentic-DS/
├── apps/
│   └── web/                  # Next.js 16 app — reference implementation
│       ├── app/[locale]/     # next-intl locale-aware routing
│       ├── i18n/             # routing.ts, request.ts, navigation.ts
│       └── messages/         # en.json, ar.json translation files
├── packages/
│   ├── tokens/               # Token engine — OKLCH → CSS custom properties
│   ├── tokens-native/        # React Native token output (hex + DP values)
│   ├── ui/                   # Radix Primitives component library
│   └── storybook/            # Storybook 8 documentation site
├── src/index.ts              # (Legacy) Cloudflare Worker
└── tasks.md                  # 90-task project plan
```

## Key Commands

```bash
# Development
pnpm dev                              # Start all packages in watch mode (Turborepo)
pnpm dev --filter @travel/web        # Start only the Next.js app

# Testing
pnpm test                             # Run all tests across all packages (Vitest)
pnpm test --filter @travel/ui        # Run UI component tests only
cd packages/tokens-native && pnpm exec vitest run  # Run RN parity tests

# Storybook
pnpm storybook                        # Start Storybook dev server on :6006

# Building
pnpm build                            # Build all packages
ANALYZE=true pnpm build --filter @travel/web  # Build + open bundle analyzer

# Type checking
pnpm typecheck                        # TypeScript check across all packages

# Token pipeline
cd packages/tokens && pnpm build     # Rebuild CSS custom property output
```

---

## Packages

### `@travel/tokens` — Token Engine

Located at `packages/tokens/`.

- Reads JSON definitions from `src/definitions/` (colors, spacing, typography, motion, shapes)
- Generates CSS custom properties at `src/output/tokens.css`
- **Color model**: OKLCH two-seed model — each brand defines a primary seed + accent seed; the engine derives 10-step palettes plus semantic aliases
- **Brands**: `default`, `luxury`, `adventure`, `eco` — each gets its own CSS class (`.brand-luxury`, etc.)
- Color modes: `:root` = light, `.dark` = dark mode

**Critical**: After editing any file in `src/definitions/`, run `pnpm build` to regenerate `tokens.css`.

### `@travel/ui` — Component Library

Located at `packages/ui/`.

- Built on **Radix UI Primitives** (zero implicit HTML, full keyboard nav + ARIA)
- Styled with **pure CSS** using CSS custom properties from `@travel/tokens` — no Tailwind dependency
- Variants via **CVA** (class-variance-authority)
- RTL-safe: all directional properties use CSS logical properties (`margin-inline-start`, `padding-inline`, etc.)
- Motion: `@media (prefers-reduced-motion: no-preference)` guards + CSS `@keyframes` in `src/styles/motion.css`

**Component locations:**
- `src/components/ui/` — base components (Button, Card, Input, Dialog, etc.)
- `src/components/travel/` — travel-domain components (FlightCard, HotelCard, etc.)

**Icons:** Always use `lucide-react` first. Only fall back to a custom inline SVG if the required icon does not exist in Lucide.

**Adding a component:**
1. Create `src/components/ui/[name].tsx` using Radix primitive + CVA variants
2. Use `var(--color-*)`, `var(--shape-*)`, `var(--duration-*)` for all theming
3. Add logical CSS properties for RTL support
4. Write tests in `src/components/ui/__tests__/[name].test.tsx`

### `@travel/tokens-native` — React Native Tokens

Located at `packages/tokens-native/`.

- Same brand tokens as `@travel/tokens` but in React Native–compatible formats
- Colors are **hex strings** (RN doesn't support `oklch()`)
- Spacing is **numbers in DPs** (not `rem`)
- Shadows use `shadowColor/shadowOffset/shadowOpacity/shadowRadius/elevation` format
- `getNativeTokens(brandId, mode)` — synchronous static lookup
- `useBrandTokens(brandId, mode?)` — React hook with OS dark-mode detection via `matchMedia`

### `@travel/storybook` — Documentation

Located at `packages/storybook/`.

- Storybook 8 with `@storybook/react-vite`
- Plugins: `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-essentials`
- **BrandDecorator** in `.storybook/preview.ts` wraps every story with `BrandProvider`
- Vite aliases in `.storybook/main.ts` `viteFinal` resolve `@travel/ui/components/*` paths
- MDX doc pages at `stories/docs/`

### `apps/web` — Reference App

- Next.js 16 + React 19 + TypeScript strict
- **i18n**: `next-intl` v4, locales `['en', 'ar']`, `localePrefix: 'as-needed'`
- **Routing**: `app/[locale]/` layout validates locale, sets `lang`/`dir` on `<html>`
- **Brand resolution**: middleware reads `x-brand` header
- **Skip link**: `<SkipLink href="#main-content" />` in every locale layout (WCAG 2.4.1)

---

## Token Pipeline

```
JSON definitions (packages/tokens/src/definitions/)
    ↓  build script
CSS custom properties (packages/tokens/src/output/tokens.css)
    ↓  @theme in globals.css
Tailwind utility classes (var(--color-*) etc.)
    ↓  consumed by
CVA variant className strings in components
```

React Native parallel output:
```
Same brand color seeds
    ↓  hex-converted static table
packages/tokens-native/src/tokens.ts
    ↓  hooks
getNativeTokens() + useBrandTokens()
```

---

## TypeScript

- `tsconfig.base.json`: `"moduleResolution": "bundler"`, `"strict": true`, `"exactOptionalPropertyTypes": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`
- `.js` extensions **not required** in imports (bundler resolution)
- Target: zero TS errors across all packages

---

## Testing

- **Vitest** per-package (`vitest.config.ts` in each package)
- **React Testing Library** + `@testing-library/user-event` for components
- Environment: `jsdom` for UI, `node` for token packages
- **384+ tests** must pass on all commits to `feature/specify`

---

## Accessibility

- `@storybook/addon-a11y` runs axe-core on every story
- All interactive Radix components have built-in ARIA + keyboard nav
- `SkipLink` component (WCAG 2.4.1) in every page layout
- RTL logical properties ensure correct layout in `dir="rtl"` contexts
- `@media (prefers-reduced-motion: no-preference)` guards respect user motion preference
- Skeleton has `aria-hidden="true"` (decorative)

---

## Conventions

| Topic | Convention |
|---|---|
| Color tokens | `var(--color-[category]-[scale])` |
| Shape tokens | `var(--shape-preset-[component])` |
| Spacing | Token vars (`var(--spacing-4)`, `var(--spacing-6)`, etc.) |
| Directional | CSS logical properties (`margin-inline-start`, `padding-inline`, `inset-inline-start`, etc.) |
| Motion | `@media (prefers-reduced-motion: no-preference)`; durations via `var(--duration-*)` |
| Exports | Named exports only |
| File naming | `kebab-case.tsx` for files, `PascalCase` for exported names |

---

## Cloudflare Worker (Legacy)

The legacy Worker lives at `src/index.ts` (root level). Commands:

```bash
pnpm dev          # wrangler dev
pnpm deploy       # deploy to Cloudflare
pnpm cf-typegen   # regenerate types from wrangler.toml
```

**Bindings**: `env.DB` (D1/SQLite), `env.KV` (60s TTL cache), `env.BUCKET` (R2).
**Routing**: manual URL matching — `/items/cached` must match before `/items/:id`.
**Cache invalidation**: mutations (`createItem`, `updateItem`, `deleteItem`) delete `items:list` KV key.


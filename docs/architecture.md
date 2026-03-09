# Architecture

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| UI components | React + Radix UI Primitives + CVA |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Tokens | OKLCH two-seed model → CSS custom properties |
| App | Next.js 16 + React 19 + next-intl v4 |
| Testing | Vitest + React Testing Library + jsdom |
| Docs | Storybook 8 + @storybook/react-vite |
| Package manager | **pnpm only** (not npm, not yarn, not bun) |

---

## Monorepo Packages

| Package | Purpose |
|---|---|
| `@travel/tokens` | Token engine — OKLCH → CSS custom properties |
| `@travel/tokens-native` | React Native hex/DP token output |
| `@travel/ui` | Component library |
| `@travel/storybook` | Documentation site |
| `apps/web` | Next.js reference app |

---

## Token Pipeline

```
JSON definitions (packages/tokens/src/definitions/)
    ↓ build script
CSS custom properties (packages/tokens/src/output/tokens.css)
    ↓ @theme in globals.css
Tailwind utility classes + var(--color-*) in components
```

After editing any token definition: `cd packages/tokens && pnpm build`

---

## Brand System

Four brands: `default`, `luxury`, `adventure`, `eco`. Each defines a primary + accent seed colour. The engine derives 10-step OKLCH palettes and semantic aliases.

- Brand CSS classes: `.brand-luxury`, `.brand-adventure`, `.brand-eco` (default has no class)
- Storybook BrandDecorator spreads tokens as inline styles — never inject into `:root`
- Light/dark via `:root` / `.dark`; RTL via `dir="rtl"` on `<html>`

---

## i18n & Routing (apps/web)

- `next-intl` v4, locales `['en', 'ar']`, `localePrefix: 'as-needed'`
- `app/[locale]/` layout validates locale, sets `lang`/`dir` on `<html>`
- Middleware reads `x-brand` header for brand resolution

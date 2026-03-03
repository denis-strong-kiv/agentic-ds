# Travel Design System

A multi-brand design system for travel applications built with Turborepo, React 19, Next.js 16, Radix UI, and Tailwind CSS v4.

## Packages

| Package | Description |
|---|---|
| `@travel/tokens` | OKLCH token engine → CSS custom properties |
| `@travel/tokens-native` | React Native token output (hex + DPs) |
| `@travel/ui` | Accessible component library (Radix + CVA) |
| `@travel/storybook` | Storybook 8 documentation site |
| `apps/web` | Next.js 16 reference application |

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
# Install all workspace dependencies
npm install

# Start all packages in development mode
npm run dev

# Start only the Next.js reference app
npm run dev --filter=@travel/web

# Start Storybook (port :6006)
npm run storybook
```

## Development

### Component Development

Components live in `packages/ui/src/components/`. Each component:
- Uses **Radix UI Primitives** for accessibility
- Variants defined with **CVA** (class-variance-authority)
- Themed via **CSS custom properties** from `@travel/tokens`
- RTL-safe via CSS logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`)

```tsx
// Example: creating a new component
// packages/ui/src/components/ui/my-component.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const myComponentVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'bg-[var(--color-primary-default)]',
    },
  },
});
```

### Token Pipeline

Tokens are defined as JSON in `packages/tokens/src/definitions/` and compiled to CSS custom properties:

```bash
# Rebuild tokens after editing definitions
cd packages/tokens && npm run build
```

Token categories: `colors`, `spacing`, `typography`, `motion`, `shapes`

Brands: `default`, `luxury`, `adventure`, `eco` — each gets a `.brand-*` CSS class.

### Testing

```bash
# Run all tests (333+ tests)
npm test

# Watch mode during development
npm run test:watch --filter=@travel/ui

# Type check all packages
npm run typecheck
```

### Building

```bash
# Build all packages
npm run build

# Build with bundle analysis
ANALYZE=true npm run build --filter=@travel/web
```

## Supported Brands

Each brand applies a distinct visual identity through CSS variable overrides:

| Brand | Personality | Primary Color |
|---|---|---|
| `default` | Modern & clean | Blue (`#2563eb`) |
| `luxury` | Prestige & sharp | Navy + Gold |
| `adventure` | Outdoor & earthy | Forest green + Amber |
| `eco` | Sustainable & round | Teal + Honey |

## Internationalization

The reference app supports English (`en`) and Arabic (`ar`) with full RTL layout support. Locale routing uses `next-intl` with `localePrefix: 'as-needed'`.

## Accessibility

- WCAG 2.1 AA target
- All interactive components keyboard-navigable via Radix primitives
- `SkipLink` in every page layout (WCAG 2.4.1)
- Axe-core integrated in Storybook via `@storybook/addon-a11y`
- `prefers-reduced-motion` respected via `motion-safe:` Tailwind prefix

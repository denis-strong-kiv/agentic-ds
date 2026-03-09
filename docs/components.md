# Components, Styling & Tokens

---

## UI Kit Priority

Always check `src/components/ui/` and `src/components/travel/` before writing raw HTML.

- **If a kit component exists** — use it. No exceptions.
- **If none exists** — propose creating one (reusable in 2+ places) or use a plain element with a comment
- **Examples**: `NotificationBadge` not `<span className="rounded-full …">`, `Button` not `<button className="…">`

---

## Component Structure

Directory-per-component — every component lives in its own folder:

```
src/components/ui/[name]/
  index.ts          # barrel export
  [name].tsx        # component (Radix primitive + CVA)
  [name].css        # CSS contract (co-located)
```

- Named exports only — no default exports
- File names: `kebab-case.tsx`; export names: `PascalCase`
- Use CVA (`class-variance-authority`) for all variant/size composition

---

## Semantic Class Contracts (mandatory, repo-wide)

TSX outputs semantic class names only — no long utility chains in JSX.

| Type | Pattern | Example |
|---|---|---|
| Block | `.namespace-component` | `.ui-button` |
| Modifier | `.namespace-component--variant` | `.ui-button--primary` |
| Element | `.namespace-component-element` | `.ui-button-icon` |

- Interaction/state styles (`:hover`, `:focus-visible`, `:disabled`, `[data-state]`) live in CSS contracts
- Style internal structure via modern selectors (`:where(...)`, `:is(...)`, `>`, `+`) from the CSS contract
- Long utility chains in TSX are forbidden for new code; migrate edited regions in existing files
- ESLint `no-restricted-syntax` enforces this in migrated scopes

---

## RTL

Use CSS logical properties everywhere — never physical direction values.

| Use | Never |
|---|---|
| `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*` | `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*` |
| `margin-inline-start`, `padding-inline-end` | `margin-left`, `padding-right` |

---

## Token Usage

Every value must come from the design system — no exceptions.

| Category | Use | Never |
|---|---|---|
| Colors | `var(--color-*)` | hex, `rgb()`, named colors |
| Radii | `var(--shape-preset-*)` or `var(--shape-preset-pill-*)` | literal `px`/`rem` values |
| Spacing | `var(--spacing-*)` | literal `px`/`rem` values |
| Typography | `var(--font-size-*)`, `var(--font-weight-*)`, `var(--font-*)` | literal `px` sizes, font-family strings |
| Motion | `var(--duration-*)`, `var(--easing-*)`, `@media (prefers-reduced-motion)` | literal `ms`, cubic-bezier strings |
| Shadows | `var(--shadow-*)` | literal `box-shadow` values |
| Hover/active | `oklch(from var(--color-X) calc(l ± 0.07) c h)` | hardcoded colour |
| White-alpha | `oklch(100% 0 0 / 0.8)` | `rgba(255,255,255,0.8)` or alpha token |

Token source: `packages/tokens/src/definitions/` — after editing, run `cd packages/tokens && pnpm build`.
Component token JSON files (`button.json`, etc.) are documentation-only; components use `var(--color-*)` directly.

---

## New Component Checklist

1. Create `[name]/[name].tsx` — Radix primitive + CVA variants
2. Create `[name]/[name].css` — semantic CSS contract under `@layer components`
3. Create `[name]/index.ts` — barrel export
4. Add to `src/components/ui/index.ts` top-level barrel
5. Register CSS import in `src/styles/components.css`
6. Write tests in `src/components/ui/__tests__/[name].test.tsx`
7. Decide story list upfront; create `packages/storybook/stories/ui/[name].stories.tsx`
8. Check Figma spec before implementing — confirm variants match token system before deviating

---

## Migration Guardrail

When editing a file that still has long utility class strings:
1. Migrate the edited region to semantic class contracts in the same change
2. Do not introduce new hardcoded color/shadow/spacing literals while migrating
3. Update tests to assert semantic class contracts

# Storybook

---

## Configuration

- `@tailwindcss/vite` must be **first** in the `viteFinal` plugins array in `.storybook/main.ts`
- `theme.css` must have `@source` directives covering `packages/ui/src/` and `packages/storybook/stories/`
- `preview.ts` imports `globals.css` from `packages/ui/src/styles/`

### BrandDecorator
- Spreads brand tokens as **inline styles** on the wrapper div — never inject a `<style>` tag on `:root`
- Inline styles always win the CSS cascade regardless of Vite injection order
- `useLayoutEffect` sets `data-mode` and `dir` on `document.documentElement`

### Globals

| Global | Options |
|---|---|
| Brand | `default`, `luxury`, `adventure`, `eco` |
| Color mode | `light`, `dark` |
| Locale | `en` (LTR), `ar` (RTL) |

### Commands
```bash
npm run storybook                # Start dev server on :6006
lsof -ti :6006 | xargs kill -9  # Kill stale Storybook process
```

---

## Stories

### What to Include

- **Overview stories** — render all variants, sizes, or states in one view: `AllVariants`, `AllSizes`, `AllStates`, `AllDisabled`
- **Composite stories** — realistic usage context: `OnButton`, `TravelBadges`, `Grid`, `MultipleResults`
- **Scenario stories** — travel domain components, one export per real-world case: `Direct`, `OneStop`, `BusinessClass`

### What to Exclude

- Single-prop stories that just toggle one variant, size, or boolean (`Primary`, `Secondary`, `Small`, `Large`, `Disabled`)
- Stories fully covered by the autodocs controls panel
- Redundant stories where a more comprehensive story already covers the case

### When Adding a New Component

Decide the story list **before** implementation. Default set:
- `AllVariants` (if the component has visual variants)
- `AllSizes` (if the component has size variants)
- `AllStates` (empty/filled/error/disabled)
- 1–2 composition stories showing real usage

### File Locations
- Base UI: `packages/storybook/stories/ui/[name].stories.tsx`
- Travel: `packages/storybook/stories/travel/[name].stories.tsx`

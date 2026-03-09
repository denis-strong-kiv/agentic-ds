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

- **Playground story** — a single `render(args)` story as the first export so the controls panel is live. Use `argTypes` to expose meaningful props (text, boolean, select) and hide non-controllable ones (ReactNode slots, callbacks, layout props).
- **Overview stories** — render all meaningful visual states in one view when they differ enough to warrant a side-by-side comparison: `AllVariants`, `AllStates`. Skip if the controls panel already covers all the differences.
- **Composite / scenario stories** — show the component in realistic context: `TravelBadges`, `ChipStrip`, `OnDarkBackground`. One or two is enough.
- **Interactive stories** — when a component has stateful behaviour that cannot be expressed through static props alone (e.g. toggle, animation, open/close sequence).

### What to Exclude

- **Single-prop demonstrations** — any story whose only purpose is to isolate one prop value: `Primary`, `Secondary`, `Small`, `Large`, `Disabled`, `ActiveState`, `WithIcon`, `WithoutLabel`. If toggling a control in the Playground produces the same result, the story is redundant.
- **Incremental variations** — stories that differ from an existing story by only one prop (e.g. `ActiveWithLabel` next to `Active`). Merge into the overview or let the controls handle it.
- **Duplicate coverage** — if `AllStates` or `AllVariants` already shows a case, do not add a separate story for that case.
- **Wrapper stories for layout testing** — stories that exist only to test padding, overflow, or alignment in a specific container. Use a decorator or a composite story instead.
- **Stories added "just in case"** — if you cannot clearly articulate what a reviewer learns from a story that they could not learn from the controls panel or an existing story, do not add it.

### The test: does this story teach something the controls panel cannot?

Before adding a story ask: *can I see this by tweaking the Playground controls?* If yes, skip the story. Only add a story when:
- Multiple props must be set simultaneously to produce a meaningful state.
- The state requires interaction or animation that args alone cannot reproduce.
- A realistic composition context is needed to understand usage.

### Controls setup (per story file)

```tsx
const meta: Meta<typeof MyComponent> = {
  component: MyComponent,        // required — enables autodocs + controls
  tags: ['autodocs'],
  args: { /* sensible defaults */ },
  argTypes: {
    // Expose controllable props explicitly
    label:    { control: 'text' },
    variant:  { control: 'select', options: ['a', 'b'] },
    isActive: { control: 'boolean' },
    // Hide props the controls panel cannot usefully represent
    children:      { table: { disable: true } },   // ReactNode slots
    popoverContent:{ table: { disable: true } },
    onSomething:   { table: { disable: true } },   // callbacks
    style:         { table: { disable: true } },   // layout / internal
  },
  // Optional: meta-level render when exactOptionalPropertyTypes requires
  // conditional prop spreading that plain args spreading cannot express.
  render: (args) => <MyComponent {...args} {...(args.isActive ? { onClear: () => {} } : {})} />,
};
```

### One component, one file — unless the component family warrants splitting

If a single export (e.g. `FilterChip`) is actually a family of distinct components (`AllFiltersChip`, `QuickFilterChip`, `FilterChip`), give each its own story file under the same title namespace:

```
Travel/FilterChip/AllFiltersChip   →  all-filters-chip.stories.tsx
Travel/FilterChip/QuickFilterChip  →  quick-filter-chip.stories.tsx
Travel/FilterChip/FilterChip       →  filter-chip.stories.tsx
```

### Docs pages (MDX)

A standalone MDX page can document an entire component family or concept without any story exports. Use it when you need narrative, architecture diagrams, or cross-component guidance that story canvases cannot express. Remove `tags: ['autodocs']` from the related story files if the MDX page covers the same ground.

### When Adding a New Component

Decide the story list **before** implementation. Minimum viable set:
- `Playground` — always, so controls work
- `AllVariants` or `AllStates` — only if the visual differences are not obvious from the controls alone
- 1 composition story if realistic context matters for understanding usage

### File Locations
- Base UI: `packages/storybook/stories/ui/[name].stories.tsx`
- Travel: `packages/storybook/stories/travel/[name].stories.tsx`
- Docs: `packages/storybook/stories/docs/[topic].mdx`

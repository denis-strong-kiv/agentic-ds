# Travel Design System — Constitution

Project-wide rules for Claude Code. These take precedence over default behaviour.

---

## Stories

### What to include
- **Overview stories** that render all variants, sizes, or states in one view (e.g. `AllVariants`, `AllSizes`, `AllStates`, `AllDisabled`)
- **Composite stories** that show the component in a realistic usage context (e.g. `OnButton`, `TravelBadges`, `Grid`, `MultipleResults`)
- **Scenario stories** for domain/travel components where each scenario represents a distinct real-world case (e.g. `Direct`, `OneStop`, `BusinessClass` for FlightCard)

### What to exclude
- Single-prop stories that just change one variant, size, or boolean (e.g. `Primary`, `Secondary`, `Small`, `Large`, `Disabled`, `Loading` as standalone exports)
- Stories that are fully covered by the autodocs controls panel
- Redundant stories where a more comprehensive story already covers the case

### When adding a new component
Decide the story list **before** implementation. Default set:
- `AllVariants` (if the component has visual variants)
- `AllSizes` (if the component has size variants)
- `AllStates` (if the component has meaningful states: empty/filled/error/disabled)
- 1–2 composition stories showing real usage

---

## Components

### Design system — no exceptions
Every value in every component must come from the design system. There are no allowed exceptions.

| Category | Use | Never |
|---|---|---|
| Colors | `var(--color-*)` | hex `#fff`, `rgb()`, named colors |
| Radii | `var(--shape-preset-*)` or `rounded-full` | literal `px`/`rem` radius values |
| Spacing | Tailwind scale (`p-4`, `gap-2`) or `var(--spacing-*)` | literal `px`/`rem` spacing |
| Typography | `text-sm`, `font-semibold`, `var(--font-*)` | literal `px` font sizes, font-family strings |
| Motion | `var(--duration-*)`, `var(--easing-*)`, `motion-safe:` prefix | literal `ms` durations, cubic-bezier strings |
| Shadows | `var(--shadow-*)` | literal `box-shadow` values |
| Hover/active | OKLCH relative color `oklch(from var(--color-X) calc(l ± 0.07) c h)` | hardcoded darker/lighter colour |
| White-alpha | `oklch(100% 0 0 / 0.8)` | `rgba(255,255,255,0.8)` or alpha token |

RTL: all directional utilities use CSS logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) — never `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`.

### UI kit priority
Every component and widget must use UI kit components wherever one exists. Raw HTML elements are a last resort.

- **First**: check `src/components/ui/` and `src/components/travel/` for a matching component
- **If none exists**: propose creating one (reusable in 2+ places) or use a local layout element with a comment explaining why no kit component applies
- This applies to all layers — base UI components, travel domain components, Storybook stories, app pages, and any other widgets
- **Examples**: `NotificationBadge` not `<span className="rounded-full …">`, `Badge` not `<span className="px-2 text-xs …">`, `Button` not `<button className="…">`

### Variants
- Use CVA (`class-variance-authority`) for all variant/size composition
- Prefer semantic class contracts (`ui-button`, `ui-button--primary`, etc.) over long inline Tailwind token chains in TSX
- Keep utility-heavy styling in `src/styles/components/*.css` under `@layer components`
- Named exports only; no default component exports
- File naming: `kebab-case.tsx`; export naming: `PascalCase`

### Semantic class contract standard (repo-wide, mandatory)
- Applies to **all render surfaces**: `packages/ui`, `packages/storybook`, `apps/web`, and any future app/package in this monorepo
- TSX/JSX should output semantic classes only (examples: `ui-*`, `travel-*`, `web-*`, `sb-*`) plus optional state/modifier classes
- Keep class composition in TSX short and semantic; move visual token details to CSS component layers
- Long utility chains in TSX are forbidden for new code; existing debt must be migrated when touched
- Every new component/page/story wrapper must ship with a corresponding CSS contract file or a clearly named section in an existing contract file
- Class naming pattern is required:
	- Block: `.namespace-component`
	- Modifier: `.namespace-component--variant`
	- Element: `.namespace-component-element`
- Interaction and theme styles (hover/active/focus/disabled/dark/RTL) live in CSS contracts, not inline utility literals
- If directionality is needed, use logical properties in CSS contracts (`margin-inline-start`, `padding-inline-end`, etc.)

### Modern CSS structure targeting (mandatory)
- Style internal DOM tree structure from CSS contracts using semantic roots and modern selectors (`:where(...)`, `:is(...)`, child `>`, adjacent `+`) rather than utility chains in TSX
- Component TSX should expose stable semantic hooks (block/element/modifier classes or `data-*` state attributes) for internal parts that need styling
- Prefer low-specificity contract patterns such as `.travel-component :where(.travel-component-element)` to keep overrides predictable
- Keep interaction/state logic in CSS contracts (`:hover`, `:focus-visible`, `:disabled`, `[aria-*]`, `[data-state]`), not inline utility literals in JSX
- Direct type/spacing/layout utility classes in JSX are disallowed in migrated files; use semantic class contracts exclusively

### Migration guardrail when editing existing code
- If a file still has long utility class strings and you modify that file, migrate the edited region to semantic class contracts in the same change
- Do not introduce new inline hardcoded color/shadow/spacing literals while migrating
- Update tests to assert semantic class contracts where style contracts are part of behavior

### Tokens
- Button hover/active: derived in CSS via OKLCH relative color — no token entries needed
- Do not create alpha-primitive tokens for white transparency; write `oklch(100% 0 0 / alpha)` inline
- `button.json` (and other component token files) are documentation-only source of truth; the broken Style Dictionary pipeline means `button.tsx` uses `var(--color-*)` directly

### New component checklist
1. Create `src/components/ui/[name].tsx` using Radix primitive + CVA
2. Write tests in `src/components/ui/__tests__/[name].test.tsx`
3. Add to `src/components/ui/index.ts` barrel
4. Decide story list upfront; create `packages/storybook/stories/ui/[name].stories.tsx`
5. Check Figma spec before implementing — confirm variants match token system before deviating
6. Add semantic CSS contract in `src/styles/components/[name].css` and register import in `src/styles/components.css`
7. Ensure no long inline utility class literals remain in the new file

---

## Storybook

### Tailwind / CSS setup
- `@tailwindcss/vite` must be **first** in the `viteFinal` plugins array in `.storybook/main.ts`
- `theme.css` must have `@source` directives covering `packages/ui/src/` and `packages/storybook/stories/` — auto-detection is unreliable in monorepos
- `preview.ts` imports `globals.css` from `packages/ui/src/styles/`

### BrandDecorator
- Spreads brand tokens as **inline styles** on the wrapper div — never inject a `<style>` tag on `:root`
- Inline styles always win the CSS cascade regardless of Vite injection order
- `useLayoutEffect` sets `data-mode` and `dir` on `document.documentElement`

### Globals
- Brand switcher: `default`, `luxury`, `adventure`, `eco`
- Color mode: `light` / `dark`
- Locale: `en` (LTR) / `ar` (RTL)

---

## Figma workflow

- Always fetch design context from Figma MCP before implementing a component
- Confirm token mapping with the user before deviating from design system tokens
- Verify final implementation against Figma screenshot before closing a task
- Inverted variants (for dark surfaces) use white-alpha, not a separate colour token

---

## Tests

- Vitest + React Testing Library; environment: `jsdom`
- Test class contracts for variant correctness (e.g. `toContain('ui-button--primary')`)
- Test accessibility attributes (`aria-label`, `aria-busy`, `role`)
- Test count capping and edge cases for numeric components
- All test suites must pass on every commit (current baseline is 379+ in `@travel/ui`)

## Enforcement

- ESLint no-restricted-syntax rules are used to block long inline class token chains in migrated scopes
- As additional repo areas are migrated, expand ESLint scope to keep semantic contracts enforced
- PRs that add new long inline utility chains in component/page/story files should be rejected

---

## Shell / tooling

- Package manager: **npm** (not yarn, not bun)
- All `npm *` and `npx *` commands are pre-approved — no confirmation needed
- All basic bash commands (`lsof`, `kill`, `ls`, `rm`, `cp`, `mv`, etc.) are pre-approved
- Run Storybook: `npm run storybook` (port 6006); kill stale: `lsof -ti :6006 | xargs kill -9`
- Run tests: `npm test --filter=@travel/ui`
- Token rebuild: `cd packages/tokens && npm run build`

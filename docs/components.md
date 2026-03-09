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

## CSS Architecture (no Tailwind)

Tailwind CSS has been removed. The styling stack is:

```
packages/tokens/src/output/tokens.css   ← CSS custom properties (colors, spacing, type, motion, shadows)
packages/ui/src/styles/theme.css        ← @layer base reset (box-sizing, margins, button cursor, sr-only)
packages/ui/src/styles/components.css   ← @import chain for all component CSS contracts
packages/ui/src/styles/motion.css       ← shared @keyframes (slide-in-*, fade-in, collapse, etc.)
```

**Layer declaration** — always at the top of every entry CSS file:

```css
@layer base, components;
```

**`@layer base`** contains only:
- Universal reset (`box-sizing: border-box; border-width: 0; border-style: solid; margin: 0; padding: 0`)
- Element-level defaults (`button cursor: pointer`, `a color: inherit`, `img display: block`, etc.)
- `.sr-only` utility (screen-reader only text)

**`@layer components`** contains all component CSS contracts imported via `components.css`.

**Registering a new component CSS file:**

```css
/* packages/ui/src/styles/components.css */
@import '../components/ui/[name]/[name].css';
/* or for travel domain: */
@import '../components/travel/[name]/[name].css';
```

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

### Notable tokens added

| Token | Value | Purpose |
|---|---|---|
| `--font-size-2xs` | `0.625rem` | Extra-small labels (e.g. airport IATA codes) |
| `--color-map-water` | `oklch(0.84 0.06 210)` | Matches CARTO Voyager tile water; used as map container background to prevent flash on canvas resize |

---

## FlightMap Component (travel domain)

Location: `packages/ui/src/components/travel/flight-map/`

```tsx
import { FlightMap } from '@travel/ui/components/travel/flight-map';
import type { FlightMapProps, AirportPoint, FlightPath } from '@travel/ui/components/travel/flight-map';

<FlightMap
  airports={[
    { id: 'JFK', lat: 40.64, lng: -73.78, label: 'JFK', isOrigin: true },
    { id: 'LHR', lat: 51.47, lng: -0.45, label: 'LHR', isDestination: true },
    { id: 'ZRH', lat: 47.46, lng: 8.56 },          // stop — no label
  ]}
  paths={[
    { id: 'seg-1', originId: 'JFK', destinationId: 'ZRH', coordinates: [[-73.78, 40.64], [8.56, 47.46]] },
    { id: 'seg-2', originId: 'ZRH', destinationId: 'LHR', coordinates: [[8.56, 47.46], [-0.45, 51.47]] },
  ]}
  initialViewState={{ longitude: -37, latitude: 46, zoom: 3.2 }}
/>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `airports` | `AirportPoint[]` | Markers to render. `isOrigin` gets a pulsing ring; `isDestination` gets a dark dot; neither gets a small grey stop dot. `label` shows the IATA chip above the dot. |
| `paths` | `FlightPath[]` | Each path renders a 3-layer arc: glow → gradient (indigo→violet→blue) → animated white dashes |
| `initialViewState` | `{ longitude, latitude, zoom, bearing?, pitch? }` | Starting camera position |

**Layout requirement** — the map container must fill its parent:

```css
/* page-level wrapper */
.web-flights-map {
  flex: 1;
  min-width: 0;
  background: var(--color-map-water);  /* prevents flash on canvas resize */
  overflow: hidden;
}
```

The map uses `flex: 1` (not `position: absolute`) so the canvas exactly equals the visible area. `fitBounds` with an 80px inset then works without camera-offset tricks and stays within a single world copy.

**Camera behaviour:**
- On `airports` change: `fitBounds(bounds, { padding: 80 })` with 900ms animation
- On canvas resize (panel open/close): debounced `fitBounds` fires 320ms after resize completes, zooming back in after panels close

**Arc rendering** — each `FlightPath` generates a great-circle arc (80-point SLERP). Three MapLibre layers render on one GeoJSON source (requires `lineMetrics: true` on the source):

| Layer | Purpose |
|---|---|
| `flight-paths-glow` | Blurred wide indigo halo |
| `flight-paths-gradient` | 2.5px gradient line (indigo→violet→blue via `line-gradient`) |
| `flight-paths-dash` | 1.5px white dashes animated via `requestAnimationFrame` + `setPaintProperty` |

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

# Travel Design System — Comprehensive Report

Generated: 2026-03-08

---

## Overview

A multi-brand travel design system built on **Radix UI Primitives**, **CSS custom properties**, and **CVA** (class-variance-authority). The system supports 4 brand themes, RTL layouts, dark mode, and reduced motion — consumed by a Next.js 16 reference app and documented in Storybook 8.

---

## Token System

**92 tokens** across 6 categories. All tokens are CSS custom properties (`var(--*)`). No hardcoded values are permitted in components.

### Colors
Defined per brand and mode using OKLCH. Semantic aliases cover all UI states:

| Group | Tokens | Purpose |
|---|---|---|
| Primary | `default`, `hover`, `active`, `foreground` | Brand action color |
| Accent | `default`, `hover`, `active`, `foreground` | Secondary brand color |
| Secondary | `default`, `hover`, `foreground` | Tertiary actions |
| Background | `default`, `subtle` | Page and surface backgrounds |
| Surface | `card`, `popover`, `overlay` | Elevated surfaces and overlays |
| Foreground | `default`, `muted`, `subtle`, `on-emphasis` | Text hierarchy |
| Border | `default`, `muted` | Dividers and outlines |
| Semantic | `success`, `warning`, `error`, `info` (+ `foreground`, `subtle` each) | Status states |
| Map | `map-water` | Map tile background |

Hover/active states use OKLCH relative syntax:
```css
oklch(from var(--color-X) calc(l ± 0.07) c h)
```

### Typography
9 font sizes (`2xs` → `4xl`), 4 weights, 5 line heights, 6 letter-spacing steps.

| Scale | Value | Use |
|---|---|---|
| `2xs` | 0.625rem | IATA codes, micro labels |
| `xs` | 0.75rem | Secondary text, captions |
| `sm` | 0.875rem | Body small, metadata |
| `md` | 1rem | Body default |
| `lg` | 1.125rem | Prices, emphasis |
| `xl`–`4xl` | 1.25–2.25rem | Headings |

### Spacing
14 steps from `0` to `24` (0rem → 6rem), including half-steps (`0-5`, `1-5`, `2-5`, `3-5`).

### Shape
3 style families × 5 component targets = 15 presets, plus generic `sm`/`md`/`lg`/`full` sizes:

| Family | Radius style |
|---|---|
| `sharp` | 1–4px — angular, high-density UIs |
| `rounded` | 4–16px — default, friendly |
| `pill` | 9999px — maximum softness |

Active preset is set per brand via `--shape-preset-*` aliases.

### Motion
5 durations (`instant` 0ms → `slower` 500ms), 4 easings including a spring curve. All animations respect `@media (prefers-reduced-motion)`.

### Shadows
5 levels: `sm` → `2xl`. All use OKLCH alpha for theme compatibility.

---

## Component Library

**60 components** in two domains.

### UI Components (39)

Foundation primitives built on Radix UI. Fully accessible (keyboard nav, ARIA, focus management).

| Component | Variants | Radix Primitive | Notable Props |
|---|---|---|---|
| `Accordion` | — | ✓ | — |
| `Alert` | info, success, warning, error | — | `onDismiss` |
| `AlertDialog` | — | ✓ | — |
| `AspectRatio` | — | ✓ | — |
| `Avatar` | — | ✓ | `status` (online/away/busy/offline) |
| `Badge` | default, secondary, outline, destructive, deal, new, popular | — | — |
| `Breadcrumb` | — | — | — |
| `Button` | 11 variants, 5 sizes | — | `isLoading`, `spinner` slot |
| `Calendar` | — | — | `mode` (single/range), `priceOverlay` |
| `Card` | elevated, outlined | — | — |
| `Checkbox` | — | ✓ | — |
| `Chip` | — | — | `isActive`, `onDismiss`, size sm/md |
| `Combobox` | — | — | — |
| `DatePicker` | — | — | Composed from Popover + Calendar |
| `Dialog` | sm, md, lg, xl, full | ✓ | `hideClose` |
| `DropdownMenu` | — | ✓ | — |
| `Icon` | — | — | Lucide + OTA custom icons |
| `Input` | — | — | `leftSlot`, `rightSlot`, `error` |
| `Label` | — | — | `required`, `helperText` |
| `NavBar` | — | — | `search`, `actions` slot, `brandLogo` slot |
| `NavigationMenu` | — | ✓ | — |
| `NotificationBadge` | 7 variants, 2 sizes | — | `count`, `max` |
| `Pagination` | — | — | — |
| `Popover` | — | ✓ | — |
| `Progress` | — | ✓ | — |
| `RadioGroup` | — | ✓ | — |
| `ScrollArea` | — | ✓ | — |
| `Select` | — | ✓ | — |
| `Separator` | — | ✓ | — |
| `Sheet` | top, bottom, left, right | ✓ | — |
| `Skeleton` | pulse, shimmer, none | — | — |
| `SkipLink` | — | — | WCAG 2.4.1 |
| `Slider` | — | ✓ | `showValue`, `formatValue` |
| `Switch` | — | ✓ | `label`, `labelPosition` |
| `Table` | — | — | `selected` |
| `Tabs` | horizontal, vertical | ✓ | `icon`, `badge` slots |
| `Textarea` | — | — | `showCount`, `autoResize`, `error` |
| `Toast` | default, success, error, warning | ✓ | — |
| `Tooltip` | — | ✓ | — |

**Button variants in full:** `primary`, `secondary`, `tertiary`, `neutral`, `inverted-primary`, `inverted-secondary`, `inverted-tertiary`, `outline`, `ghost`, `destructive`, `link`

### Travel Domain Components (21)

Travel-specific compositions. Each wraps multiple UI primitives.

| Component | Key Props | UI Dependencies |
|---|---|---|
| `ActivityCard` | title, category, duration, pricePerPerson | Button, Badge, AspectRatio |
| `BookingConfirmation` | confirmationNumber, status, segments, totalAmount | Button, Badge, Separator |
| `BookingStepper` | steps | — |
| `CarCard` | name, specs, pricePerDay, insuranceOptions | Button, Badge, Switch |
| `DestinationItemContent` | destinationType (7 values), title, subtitle | Icon |
| `FilterBar` | filters, onChange, sidebarOpen | Slider, Checkbox, Label, FilterChip, FilterPanel |
| `FilterChip` | label, isActive, popoverContent | Popover, Icon |
| `FilterPanel` | filters, mode (flights/hotels/cars) | Button, NotificationBadge, Checkbox, Slider, Switch, Accordion, Label, RadioGroup |
| `FlightCard` | legs, price, baggage, seatsLeft, isCompact | Button |
| `FlightDetails` | legs, fareOptions, isOpen | Button, Badge, FlightCard |
| `FlightMap` | airports, paths, initialViewState | MapLibre GL (react-map-gl) |
| `HotelCard` | name, starRating, images, amenities, reviewScore | Button, Badge, AspectRatio |
| `ItineraryTimeline` | events | Badge |
| `NavBar` | brandName, brandLogo, search, supportPhone | UserRound (Lucide) |
| `PassengerForm` | index, type (Adult/Child/Infant), isPrimary | Button, Input, Label, Select, Checkbox, Textarea |
| `PriceBreakdown` | lineItems, passengerBreakdown, totalAmount, sticky | Badge, Accordion, Separator |
| `RoomGallery` | rooms, onSelectRoom | Button, Badge, AspectRatio, Dialog |
| `SearchForm` | destinationOptions, airportOptions, onSearch | Icon, Calendar, Popover, Button, DestinationItemContent |
| `SearchOverlay` | isOpen, onClose | — |
| `SeatPicker` | seats, selectedSeatIds, maxSelections | — |
| `SupportChat` | messages, agentName, isTyping | Button |

---

## Dependency Graph

Most-depended-on UI primitives (highest in-degree):

| Component | Used by |
|---|---|
| `ui/button` | 13 components |
| `ui/badge` | 8 components |
| `ui/icon` | 11 components |
| `ui/label` | 3 components |
| `ui/checkbox` | 3 components |
| `ui/accordion` | 2 components |
| `ui/separator` | 2 components |
| `ui/aspect-ratio` | 3 components |

Most complex travel components (highest out-degree):

| Component | Direct dependencies |
|---|---|
| `travel/filter-panel` | 8 UI primitives |
| `travel/filter-bar` | 4 (incl. 2 travel) |
| `travel/passenger-form` | 6 UI primitives |
| `travel/flight-details` | 3 (incl. FlightCard) |
| `travel/room-gallery` | 4 UI primitives |

---

## UI Patterns

10 defined composition patterns:

| Pattern | Components | Screen |
|---|---|---|
| **Search Form** | SearchForm, SearchOverlay, Input, Button, Popover | Home, Flights |
| **Filter Bar** | FilterBar, FilterChip, FilterPanel | Flights |
| **Flight Listing** | FlightCard, Badge, Skeleton | Flights |
| **Flight Detail** | FlightDetails, FlightMap, ItineraryTimeline, PriceBreakdown, Button | Flights |
| **Booking Flow** | BookingStepper, PassengerForm, SeatPicker, BookingConfirmation, Dialog, Button | Booking |
| **Hotel Listing** | HotelCard, RoomGallery, Badge, Skeleton | Hotels |
| **Navigation Bar** | NavBar (travel), Button, DropdownMenu | All screens |
| **Notification** | Toast, NotificationBadge | Global |
| **Form Fields** | Input, Label, Select, Checkbox, RadioGroup, Textarea | Booking |
| **Data Table** | Table, Pagination, Skeleton | — |

---

## Screen Mappings

| Screen | Components | Patterns |
|---|---|---|
| **Flights Search** | 10 | search-form, filter-bar, flight-listing, flight-detail, nav-bar |
| **Hotels Search** | 7 | hotel-listing, nav-bar |
| **Booking** | 6 | booking-flow |
| **Home** | — | nav-bar, search-form |

---

## Architecture

### Styling Stack
No Tailwind. Pure CSS custom properties with a semantic class contract system:

```
tokens.css          → CSS custom properties (--color-*, --spacing-*, etc.)
motion.css          → shared @keyframes
components.css      → @import chain for all component CSS contracts
theme.css           → @layer base reset
```

### CSS Conventions
- `@layer base, components` declared in every entry file
- BEM-like class naming: `.ui-button`, `.ui-button--primary`, `.ui-button-icon`
- All interaction styles (`:hover`, `:focus-visible`, `[data-state]`) live in CSS contracts only
- RTL via CSS logical properties exclusively (`margin-inline-start`, `padding-inline-end`, etc.)

### Multi-brand
4 brand themes: `default`, `luxury`, `adventure`, `eco`. Each overrides color seeds via CSS class (`.brand-luxury`). The token engine derives 10-step OKLCH palettes from 2 seeds per brand.

### Internationalisation
`next-intl` v4, locales `en` + `ar`, `localePrefix: 'as-needed'`. RTL layout auto-applied via `dir="rtl"` on `<html>`.

### Accessibility
- All interactive components: Radix UI primitives (keyboard nav + ARIA built-in)
- `SkipLink` on every page layout (WCAG 2.4.1)
- `aria-hidden` on all decorative elements
- `@media (prefers-reduced-motion)` respected on all animations
- axe-core runs on every Storybook story via `@storybook/addon-a11y`

---

## Quality

- **339 tests** (Vitest + React Testing Library)
- TypeScript strict mode: `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`
- ESLint `no-restricted-syntax` enforces semantic class contracts in migrated scopes
- Storybook 8 documents every component with interactive stories and a11y audit

---

## Key Commands

```bash
pnpm dev                      # Start all packages
pnpm test                     # Run 339 tests
pnpm storybook                # Storybook on :6006
pnpm generate:ui-manifest     # Regenerate docs/ui-manifest.dsl
cd packages/tokens && pnpm build  # Rebuild token CSS after token edits
```

import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Sidebar filter panel on flight, hotel, or car search results pages. Renders mode-specific filter sections — stops/departure/arrival time for flights; star rating/amenities for hotels — alongside shared price range and provider filters.',
    whenNotToUse: 'Quick inline filters on a map view or compact chip-based filtering — use FilterChip or QuickFilterChip instead. Do not use for non-search contexts.',
    alternatives: ['FilterChip — for individual filter chips in a filter bar', 'QuickFilterChip — for pre-set quick filter options'],
    preferOver: 'Custom sidebar filter implementations. Use createDefaultFilters(maxPrice) factory to initialise the FilterState object.',
  },
  behavior: {
    states: [
      'isOpen=true — panel renders normally',
      'isOpen=false — component returns null (fully hidden)',
      'activeCount > 0 — notification badge on "Filters" heading and "Clear all" button appear',
      'allAirlinesSelected — select-all switch is checked',
    ],
    interactions: [
      'Price range slider fires onChange with updated priceRange',
      'Stops checkboxes toggle individual stop values in filters.stops (flights only)',
      'Airlines/provider checkboxes toggle items in filters.airlines',
      'Alliance checkboxes toggle items in filters.alliances',
      'Select all airlines switch replaces filters.airlines with all provider values or clears it',
      'Departure / Arrival time sliders fire onChange with updated hour ranges (flights only)',
      'Star rating toggle buttons set aria-pressed and toggle values in filters.starRatings (hotels only)',
      'Amenity checkboxes toggle items in filters.amenities (hotels only)',
      'Sort radio group fires onSortChange when provided',
      'Clear all button fires onClearAll callback',
      'Apply Filters button (mobile) is presentational — consumers should wire it to close the panel',
    ],
    responsive: 'Apply Filters button shown at bottom on mobile. Panel width is controlled by the parent layout.',
  },
  accessibility: {
    role: 'aside (landmark)',
    keyboardNav: 'All controls (sliders, checkboxes, radio buttons, switches, star buttons) are keyboard accessible. Accordion sections are navigable via keyboard.',
    ariaAttributes: [
      'aria-label="Search filters" on the aside element',
      'aria-pressed on star rating buttons',
      'htmlFor associations on all Label + input pairs',
      'NotificationBadge count on active filter count',
    ],
    wcag: ['2.1.1 Keyboard', '1.3.1 Info and Relationships', '4.1.2 Name, Role, Value'],
    screenReader: 'Accordion sections announce expanded/collapsed state. Star rating buttons announce their label (e.g. "3 stars") via aria-label. Active filter count badge is visible text.',
  },
  examples: [
    {
      label: 'Flights mode with airline options',
      code: `<FilterPanel
  mode="flights"
  filters={filters}
  onChange={setFilters}
  onClearAll={() => setFilters(createDefaultFilters())}
  sortBy={sortBy}
  onSortChange={setSortBy}
  providerOptions={[
    { value: 'ba', label: 'British Airways', logoUrl: '/logos/ba.png' },
    { value: 'ua', label: 'United Airlines', logoUrl: '/logos/ua.png' },
  ]}
  maxPrice={3000}
/>`,
    },
    {
      label: 'Hotels mode',
      code: `<FilterPanel
  mode="hotels"
  filters={filters}
  onChange={setFilters}
  onClearAll={() => setFilters(createDefaultFilters())}
  maxPrice={500}
/>`,
    },
  ],
};

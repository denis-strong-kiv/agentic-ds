import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Primary flight/hotel search entry point. Handles origin/destination, date range, passenger count, cabin class, and trip type. Use in the nav bar or as a standalone hero search.',
    whenNotToUse: 'Read-only search summary display (use the nav bar search pill). Car or activity search (those require different form fields).',
    alternatives: ['NavBar search pill — compact read-only summary with edit trigger', 'SearchOverlay — wrapper that slides the SearchForm into full-screen on mobile'],
  },
  behavior: {
    states: ['collapsed (in nav)', 'expanded (hero or overlay)', 'tab-flights', 'tab-hotels', 'trip-type: one-way|round-trip|multi-city'],
    interactions: ['Tab selection (flights/hotels)', 'Trip type radio', 'Origin/destination combobox with airport suggestions', 'Date picker (single or range)', 'Passenger/cabin class popover', 'Submit triggers onSearch'],
    animations: ['Divider variants (top/bottom) animate on scroll', 'Destination suggestion list fades in'],
    responsive: 'Stacks vertically on narrow viewports. SearchOverlay wraps for mobile full-screen mode.',
  },
  accessibility: {
    role: 'search (form with role=search)',
    keyboardNav: 'Tab through all fields. Combobox supports arrow keys for suggestion navigation. Date picker is keyboard-navigable.',
    ariaAttributes: ['role="search"', 'aria-label on origin and destination inputs', 'aria-expanded on dropdowns'],
    wcag: ['2.1.1 Keyboard', '3.3.2 Labels or Instructions', '1.3.1 Info and Relationships'],
  },
  examples: [
    {
      label: 'Hero search form',
      code: `<SearchForm
  destinationOptions={destinations}
  airportOptions={airports}
  recentSearches={recent}
  onSearch={handleSearch}
/>`,
    },
    {
      label: 'Controlled active tab',
      code: `<SearchForm activeTab="hotels" onTabChange={setTab} onSearch={handleSearch} />`,
    },
  ],
};

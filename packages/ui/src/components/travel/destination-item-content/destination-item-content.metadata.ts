import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Row content inside a destination autocomplete dropdown or combobox list. Renders the appropriate icon (Plane, Building2, MapPin, Globe2, Landmark, Map) based on destination type, or a thumbnail image for cities.',
    whenNotToUse: 'Standalone display outside a list/combobox context — this is a content fragment, not a self-contained card. Do not use as a full destination detail view.',
    alternatives: ['HotelCard — for full hotel result cards with images, price, and CTA', 'FlightCard — for flight search results'],
    neverUseFor: 'Full-page destination detail pages or hero sections.',
  },
  behavior: {
    states: [
      'city with imageUrl — renders thumbnail <img> instead of icon',
      'airport — Plane icon with airport-specific decoration styles',
      'airport-indented — Plane icon indented for sub-airport display (terminal/gate grouping)',
      'city (no image) — Building2 icon',
      'neighborhood — MapPin icon',
      'country — Globe2 icon',
      'landmark — Landmark icon',
      'area — Map icon',
    ],
    interactions: [],
    responsive: 'Inline flex content; inherits width from the list container.',
  },
  accessibility: {
    role: 'fragment (no wrapper element; renders as sibling spans)',
    keyboardNav: 'No interactive elements; keyboard navigation is managed by the parent combobox/listbox.',
    ariaAttributes: [
      'aria-hidden on the decoration icon (Icon component passes aria-hidden)',
      'imageAlt defaults to "Destination" if not provided; pass a meaningful alt when imageUrl is set',
    ],
    wcag: ['1.1.1 Non-text Content'],
    screenReader: 'The icon decoration is hidden from screen readers. Only the title and subtitle text are announced. Ensure the parent list item provides sufficient context.',
  },
  examples: [
    {
      label: 'Airport suggestion with IATA code subtitle',
      code: `<DestinationItemContent
  destinationType="airport"
  title="John F. Kennedy International"
  subtitle="New York, US · JFK"
/>`,
    },
    {
      label: 'City suggestion with thumbnail',
      code: `<DestinationItemContent
  destinationType="city"
  title="London"
  subtitle="United Kingdom"
  imageUrl="/images/destinations/london.jpg"
  imageAlt="London skyline"
/>`,
    },
    {
      label: 'Indented airport for sub-airport grouping',
      code: `<DestinationItemContent
  destinationType="airport-indented"
  title="London Heathrow"
  subtitle="LHR"
/>`,
    },
  ],
};

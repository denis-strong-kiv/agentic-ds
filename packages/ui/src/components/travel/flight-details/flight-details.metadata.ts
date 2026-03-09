import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Full itinerary detail panel shown when a FlightCard is selected. Displays all segments, layovers, fare options, and nights between legs.',
    whenNotToUse: 'Compact result list (use FlightCard). Booking confirmation (use BookingConfirmation). Static schedule display.',
    alternatives: ['FlightCard — compact result card', 'BookingConfirmation — post-booking receipt'],
    preferOver: 'Custom itinerary detail implementations.',
  },
  behavior: {
    states: ['closed (isOpen=false)', 'open (isOpen=true, slides in from right)', 'fare-option selected'],
    interactions: ['Close button / onClose', 'Share button / onShare', 'Select fare button / onSelectFare', 'Scroll within panel'],
    animations: ['Panel slides in from the right when isOpen changes to true'],
    responsive: 'Full-height panel, 720px wide on desktop. Full-width on mobile.',
  },
  accessibility: {
    role: 'dialog',
    keyboardNav: 'Escape or close button to close. Focus managed on open/close.',
    ariaAttributes: ['aria-modal="true"', 'aria-labelledby pointing to title'],
    wcag: ['2.1.1 Keyboard', '1.3.1 Info and Relationships'],
    screenReader: 'Layover durations and segment details are announced in reading order.',
  },
  examples: [
    {
      label: 'Basic usage',
      code: `<FlightDetails
  title="New York → London"
  legs={flightLegs}
  fareOptions={fareOptions}
  isOpen={detailOpen}
  onClose={() => setDetailOpen(false)}
  onSelectFare={handleFareSelect}
/>`,
    },
  ],
};

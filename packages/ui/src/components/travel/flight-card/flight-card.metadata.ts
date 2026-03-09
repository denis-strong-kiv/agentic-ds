import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Display a single flight option in search results. Supports one-way, round-trip, and multi-city (up to 6 legs). Use isCompact for the 400px mini-list panel.',
    whenNotToUse: 'Full itinerary detail (use FlightDetails). Hotel or car results (use HotelCard, CarCard). Static schedule display without selection.',
    alternatives: ['FlightDetails — full expanded itinerary with fare options', 'ActivityCard / HotelCard — for non-flight travel products'],
    preferOver: 'Custom flight result row implementations.',
  },
  behavior: {
    states: ['default', 'hover (elevated shadow)', 'selected (isSelected=true — 2px primary border)', 'compact (isCompact=true — stacked layout)'],
    interactions: ['Click card to select (onSelect)', 'Click Select button (isolated from card click)', 'Click Pin button (isolated, segment-level)', 'Hover airline emblem — CSS tooltip with airline name + flight number'],
    animations: ['Shadow transition on hover', 'Container-query switches to compact layout at 480px'],
    responsive: 'Desktop: content | price column. Compact/narrow: stacked with price strip at bottom.',
  },
  accessibility: {
    role: 'article',
    keyboardNav: 'Tab to focus card (tabIndex=0). Enter/Space triggers onSelect. Select button and Pin button are independently focusable.',
    ariaAttributes: ['aria-selected reflecting isSelected', 'aria-label on Pin button', 'aria-label on baggage items'],
    wcag: ['2.1.1 Keyboard', '1.3.1 Info and Relationships'],
    screenReader: 'Price, stops, and baggage counts have descriptive aria-labels. Airline tooltip is aria-hidden (visual only).',
  },
  examples: [
    {
      label: 'One-way nonstop',
      code: `<FlightCard
  legs={[{ segments: [{ airline: 'BA', flightNumber: 'BA178', origin: 'JFK', destination: 'LHR', departureTime: '10:00 PM', arrivalTime: '10:15 AM+1', duration: '7h 15m', class: 'Economy' }], stops: 0, duration: '7h 15m' }]}
  price="£420"
  totalPrice="£840"
  baggage={{ carryOn: 1, checked: 0 }}
  onSelect={handleSelect}
/>`,
    },
    {
      label: 'Compact (mini-list)',
      code: `<FlightCard {...props} isCompact isSelected />`,
    },
    {
      label: 'With urgency and best-value tag',
      code: `<FlightCard {...props} isBestValue seatsLeft={3} />`,
    },
  ],
};

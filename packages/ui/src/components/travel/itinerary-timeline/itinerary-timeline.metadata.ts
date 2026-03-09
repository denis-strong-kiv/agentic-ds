import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Chronological view of a multi-segment trip itinerary — flights, hotel stays, car rentals, activities, layovers, and transfers — displayed as a vertical timeline with expandable detail cards.',
    whenNotToUse: 'Simple single-segment bookings where a flat summary card suffices. Do not use for non-travel timelines (e.g. order history, notification feed).',
    alternatives: ['BookingConfirmation — for the post-booking confirmation view which includes a flat segment list without expand/collapse or gap indicators'],
  },
  behavior: {
    states: [
      'confirmed — default badge, full opacity event card',
      'pending — secondary badge, full opacity',
      'cancelled — destructive badge, card and icon node at 50–60% opacity',
      'completed — outline badge, full opacity',
      'expanded — detail key/value grid visible below time row',
      'collapsed — only title, subtitle, time, and location visible',
      'empty events array — "No itinerary events." message rendered',
    ],
    interactions: [
      'Expand/collapse button (chevron) toggles detail grid for events with details array',
      'Gap indicator (dashed line + label) between events when gapToNext is provided',
    ],
    animations: [
      'Chevron rotates 180° on expand via CSS transition',
    ],
    responsive: 'Vertical scroll timeline. Detail grids use 2-column layout. Gap indicators span full width.',
  },
  accessibility: {
    role: 'generic (div) with aria-label="Itinerary timeline"',
    keyboardNav: 'Tab to each event\'s expand/collapse button. Events without details have no interactive element.',
    ariaAttributes: [
      'aria-label="Itinerary timeline" on container',
      'aria-expanded on expand/collapse button',
      'aria-label="Expand details" / "Collapse details" on expand button',
      'aria-hidden on timeline connector lines and icon nodes',
    ],
    wcag: ['2.1.1 Keyboard', '4.1.2 Name, Role, Value', '1.4.1 Use of Color — status conveyed by badge text not color alone'],
    screenReader: 'Event status is conveyed via visible badge text (confirmed, pending, cancelled, completed). Timeline connector lines are hidden from screen readers.',
  },
  examples: [
    {
      label: 'Multi-segment trip with layover gap',
      code: `<ItineraryTimeline
  events={[
    {
      id: 'f1',
      type: 'flight',
      status: 'confirmed',
      title: 'NYC → LHR',
      subtitle: 'British Airways BA 178',
      startTime: '21:30',
      endTime: '09:15+1',
      duration: '7h 45m',
      location: 'JFK Terminal 7',
      details: [{ label: 'Seat', value: '14A' }, { label: 'Class', value: 'Economy' }],
      gapToNext: '2h 30m until check-in',
    },
    {
      id: 'h1',
      type: 'hotel',
      status: 'confirmed',
      title: 'The Savoy',
      subtitle: 'Superior Room',
      startTime: 'Check-in 15:00',
      endTime: 'Check-out 11:00',
      duration: '7 nights',
      location: 'Strand, London',
    },
  ]}
/>`,
    },
  ],
};

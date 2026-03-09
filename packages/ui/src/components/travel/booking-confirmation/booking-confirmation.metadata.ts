import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Post-payment confirmation page to display booking reference, itinerary segments, total paid, and share/print actions. Use after a successful (or pending/cancelled) booking transaction.',
    whenNotToUse: 'Mid-funnel booking steps — this is a terminal read-only view, not a form. Do not use as a booking summary panel during checkout.',
    alternatives: ['PriceBreakdown — for showing cost details during checkout, not after', 'ItineraryTimeline — for displaying trip events without the confirmation reference / QR context'],
    preferOver: 'Custom confirmation layouts that duplicate the QR placeholder, copy-to-clipboard reference, and segment icon logic.',
  },
  behavior: {
    states: [
      'confirmed — green success banner with checkmark',
      'pending — neutral banner with "Booking Pending" heading',
      'cancelled — destructive badge with "Booking Cancelled" heading',
    ],
    interactions: [
      'Copy confirmation number — copies to clipboard; icon swaps to checkmark for 2 seconds',
      'Add to Calendar — fires onAddToCalendar callback (button only rendered when prop provided)',
      'Share Itinerary — fires onShareItinerary callback (button only rendered when prop provided)',
      'Print — fires onPrint callback (button only rendered when prop provided)',
    ],
    responsive: 'Reference number row stacks vertically on narrow viewports. Action buttons wrap.',
  },
  accessibility: {
    role: 'region (implicit div)',
    keyboardNav: 'Tab through copy button, then optional Add to Calendar / Share / Print action buttons.',
    ariaAttributes: [
      'aria-label on copy button ("Copy confirmation number" / "Copied!")',
      'aria-label="QR code for booking {number}" role="img" on QR placeholder',
    ],
    wcag: ['2.1.1 Keyboard', '1.3.1 Info and Relationships'],
    screenReader: 'Copy button label updates to "Copied!" for 2 seconds after activation. Segment type icons are decorative and not announced. Contact email is read inline in the confirmation paragraph.',
  },
  examples: [
    {
      label: 'Confirmed booking with flight + hotel segments',
      code: `<BookingConfirmation
  confirmationNumber="TRV-2024-XYZ789"
  bookingDate="8 Mar 2026"
  status="confirmed"
  contactEmail="traveler@example.com"
  totalAmount="$1,248.00"
  currency="USD"
  segments={[
    { type: 'flight', title: 'NYC → LON', subtitle: 'British Airways BA 178', date: '12 Mar 2026', details: [{ label: 'Seat', value: '14A' }, { label: 'Class', value: 'Economy' }] },
    { type: 'hotel', title: 'The Savoy', subtitle: 'Superior Room', date: '12–19 Mar 2026', details: [{ label: 'Check-in', value: '3:00 PM' }] },
  ]}
  onAddToCalendar={() => addToCalendar()}
  onShareItinerary={() => shareItinerary()}
  onPrint={() => window.print()}
/>`,
    },
  ],
};

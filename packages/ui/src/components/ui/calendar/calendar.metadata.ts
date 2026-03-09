import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Date selection for travel booking flows — outbound and return flight dates, hotel check-in/check-out, car rental pickup/drop-off. Supports single date and date-range selection. Optionally overlays per-day pricing.',
    whenNotToUse: 'Time-only selection (use a time input). Year/month-only pickers with no day granularity. Inline date display without interaction (use formatted text).',
    alternatives: ['Native <input type="date"> — for simple forms where OS date picker is acceptable', 'DatePicker (popover-wrapped Calendar) — when space is constrained and calendar should appear on demand'],
    preferOver: 'Third-party date-picker libraries that bring their own styling and token systems.',
  },
  behavior: {
    states: ['default', 'today (highlighted)', 'selected', 'in-range (range mode)', 'disabled (minDate/maxDate/disabledDates)', 'with price overlay'],
    interactions: ['Click a day button to select it (calls onSelect)', 'Previous/next month navigation buttons', 'Disabled days are non-interactive'],
    animations: ['None — month transition is immediate'],
    responsive: 'Fixed 7-column grid; scales with font size. Wrap in a container to constrain width.',
  },
  accessibility: {
    role: 'grid (implicit via 7-column button layout)',
    keyboardNav: 'Tab to reach the calendar. Arrow keys and Tab move between month nav buttons and day buttons. Disabled days are skipped.',
    ariaAttributes: ['aria-label on each day button includes full date and price if priceOverlay is set (e.g., "15 March 2025, $199")', 'aria-label="Previous month" and "Next month" on navigation buttons', 'disabled attribute on non-selectable day buttons'],
    wcag: ['2.1.1 Keyboard', '1.4.3 Contrast', '1.3.1 Info and Relationships'],
    screenReader: 'Each day button is announced with its full date and optional price via aria-label. Current-month context is visible in the calendar title.',
  },
  examples: [
    { label: 'Single date selection', code: '<Calendar\n  mode="single"\n  selected={departureDate}\n  minDate={new Date()}\n  onSelect={setDepartureDate}\n/>' },
    { label: 'Date range (outbound + return)', code: '<Calendar\n  mode="range"\n  selected={{ from: checkIn, to: checkOut }}\n  minDate={new Date()}\n  onSelect={handleDateSelect}\n/>' },
    { label: 'With flight price overlay', code: '<Calendar\n  mode="single"\n  selected={selectedDate}\n  minDate={new Date()}\n  priceOverlay={(date) => getPriceForDate(date)}\n  onSelect={setSelectedDate}\n/>' },
  ],
};

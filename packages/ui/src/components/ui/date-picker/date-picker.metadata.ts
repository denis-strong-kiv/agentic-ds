import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Single-date selection (DatePicker) or two-date range selection (DateRangePicker) for travel booking forms — departure/return dates, check-in/check-out, etc. Renders a Calendar inside a Popover triggered by a Button.',
    whenNotToUse: 'Free-text date entry where the user knows the exact date — use a plain <input type="date"> instead. Inline calendar without a trigger — use the Calendar component directly.',
    alternatives: ['Calendar — for an always-visible calendar widget', 'Input type="date" — for simple date entry without a picker UI'],
    preferOver: 'Raw <input type="date"> when you need minDate/maxDate/disabledDates constraints with a branded calendar UI.',
  },
  behavior: {
    states: ['closed (trigger shows placeholder or formatted date)', 'open (Popover with Calendar visible)', 'date selected', 'range: awaiting-from / awaiting-to'],
    interactions: [
      'Click trigger button to open calendar popover',
      'Select a date in the Calendar to close the popover and call onChange',
      'DateRangePicker: first click sets "from" date, second click sets "to" date (auto-swaps if to < from)',
      'Clicking outside or pressing Escape closes the Popover',
    ],
    animations: ['Popover entrance/exit animation from PopoverContent'],
    responsive: 'Popover aligns to the start edge of the trigger by default (align="start").',
  },
  accessibility: {
    role: 'The trigger renders as a button with aria-haspopup="dialog". Calendar inside the popover handles its own grid navigation.',
    keyboardNav: 'Tab to reach trigger. Enter/Space to open. Calendar navigation handled by Calendar component. Escape to close.',
    ariaAttributes: [
      'aria-haspopup="dialog" on the trigger button',
      'DateRangePicker stage prompt ("Select departure date" / "Select return date") is rendered as visible text inside the popover',
    ],
    wcag: ['2.1.1 Keyboard', '1.3.1 Info and Relationships'],
    screenReader: 'Trigger button announces the currently selected date (formatted as "Mon DD, YYYY") or the placeholder string when no date is chosen.',
  },
  examples: [
    { label: 'Single date', code: '<DatePicker value={departDate} onChange={setDepartDate} placeholder="Select date" minDate={today} />' },
    { label: 'Date range for flights', code: '<DateRangePicker value={range} onChange={setRange} placeholder={{ from: "Departure", to: "Return" }} minDate={today} />' },
    { label: 'With blocked dates', code: '<DatePicker value={date} onChange={setDate} disabledDates={soldOutDates} minDate={today} maxDate={maxBookingDate} />' },
  ],
};

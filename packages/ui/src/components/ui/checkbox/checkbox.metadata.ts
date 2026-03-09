import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Binary opt-in/opt-out choices and multi-select filter lists — cabin class filters, airline selection, ancillary add-ons (extra baggage, seat selection, travel insurance), and terms-of-service acceptance.',
    whenNotToUse: 'Mutually exclusive options where only one can be true (use RadioGroup). Immediate binary state toggles with visible on/off meaning (use Switch).',
    alternatives: ['RadioGroup — when exactly one option from a group must be chosen', 'Switch — for settings with immediate on/off effect (e.g., enable notifications)', 'ToggleGroup — for visual multi-select that should look like buttons'],
    preferOver: 'Custom <input type="checkbox"> with manual styling and indeterminate state management.',
  },
  behavior: {
    states: ['unchecked', 'checked (shows Check icon)', 'indeterminate (shows Minus icon — for select-all parent checkboxes)', 'disabled'],
    interactions: ['Click to toggle checked/unchecked', 'Enter/Space when focused to toggle'],
    responsive: 'Inline-flex element; pair with a <label> for a larger click target.',
  },
  accessibility: {
    role: 'checkbox',
    keyboardNav: 'Tab to focus. Space to toggle. Does not respond to Enter (Space only, per ARIA checkbox pattern).',
    ariaAttributes: ['aria-checked="true" | "false" | "mixed" (indeterminate)', 'aria-disabled when disabled'],
    wcag: ['2.1.1 Keyboard', '1.4.3 Contrast', '4.1.2 Name, Role, Value'],
    screenReader: 'Must be associated with a visible <label> via htmlFor or wrapped in a <label> element. Screen reader announces checked/unchecked/mixed state. Indeterminate state announces as "mixed".',
  },
  examples: [
    { label: 'Filter — non-stop flights only', code: '<div className="flex items-center gap-2">\n  <Checkbox id="nonstop" checked={filters.nonStop} onCheckedChange={(v) => setFilter("nonStop", v)} />\n  <label htmlFor="nonstop">Non-stop only</label>\n</div>' },
    { label: 'Select-all with indeterminate state', code: '<div className="flex items-center gap-2">\n  <Checkbox\n    id="select-all"\n    checked={allSelected ? true : someSelected ? "indeterminate" : false}\n    onCheckedChange={handleSelectAll}\n  />\n  <label htmlFor="select-all">Select all airlines</label>\n</div>' },
    { label: 'Terms acceptance', code: '<div className="flex items-center gap-2">\n  <Checkbox id="terms" required onCheckedChange={setTermsAccepted} />\n  <label htmlFor="terms">I agree to the booking terms and conditions</label>\n</div>' },
  ],
};

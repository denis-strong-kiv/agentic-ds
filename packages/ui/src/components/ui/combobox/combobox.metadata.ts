import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Searchable single-value selector when the option list is large enough that filtering is helpful (e.g. selecting a country, airport, or airline). The user can type to narrow options and pick with keyboard or mouse.',
    whenNotToUse: 'Short, stable lists of 5 or fewer options — use a native <select> or RadioGroup instead. Multi-value selection — this component is single-select only.',
    alternatives: ['Select — for short lists without search', 'RadioGroup — for ≤5 mutually exclusive options visible at once'],
    preferOver: 'Native <select> when typeahead filtering is required or the option set is dynamic.',
  },
  behavior: {
    states: ['default', 'open', 'filtering', 'option-active (keyboard highlight)', 'option-selected', 'option-disabled', 'disabled'],
    interactions: [
      'Click or focus input to open listbox and select all current text',
      'Type to filter options in real-time',
      'ArrowDown / ArrowUp to move keyboard focus through filtered options',
      'Enter to select the active option (or the only remaining match)',
      'Escape to close and revert input to last confirmed value',
      'Tab to close and revert input',
      'Click chevron button to toggle open/closed without stealing input focus',
      'Click option to select and close',
    ],
    animations: ['ChevronDown icon rotates when listbox is open'],
    responsive: 'Width determined by parent container.',
  },
  accessibility: {
    role: 'combobox (on the input element)',
    keyboardNav: 'Tab to focus the input. ArrowDown/ArrowUp to navigate options. Enter to select. Escape to dismiss.',
    ariaAttributes: [
      'aria-expanded on input reflects open state',
      'aria-autocomplete="list" on input',
      'aria-controls links input to listbox when open',
      'aria-activedescendant tracks keyboard-highlighted option',
      'aria-selected on each option',
      'aria-disabled on disabled options',
      'aria-label prop forwarded to input',
      'Chevron toggle button is aria-hidden and tabIndex=-1',
    ],
    wcag: ['4.1.3 Status Messages', '1.3.1 Info and Relationships', '2.1.1 Keyboard'],
    screenReader: 'Pass aria-label to the Combobox so screen readers announce the field purpose. Disabled options are announced as unavailable.',
  },
  examples: [
    { label: 'Airport selector', code: '<Combobox options={airports} value={origin} onChange={setOrigin} aria-label="Origin airport" placeholder="Search airports..." />' },
    { label: 'With disabled option', code: '<Combobox options={[{ value: "syd", label: "Sydney" }, { value: "mel", label: "Melbourne", disabled: true }]} value={city} onChange={setCity} aria-label="Destination city" />' },
  ],
};

import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Mutually exclusive selection from a small set of visible options (2–6 items). Use when all choices should be visible at once and only one can be selected.',
    whenNotToUse: 'More than 6 options (use Select instead). Multiple selections (use Checkbox). Binary on/off toggle (use Switch).',
    alternatives: ['Select — for long option lists in a dropdown', 'Checkbox — for multi-select', 'Switch — for boolean toggles'],
    preferOver: 'Native <input type="radio"> elements — provides full keyboard navigation and ARIA automatically.',
  },
  behavior: {
    states: ['default', 'checked', 'unchecked', 'disabled', 'focused'],
    interactions: ['Click to select', 'Arrow keys to move between items within the group', 'Tab to enter/leave the group'],
    animations: ['Circle indicator appears/disappears on selection'],
    responsive: 'Typically stacked vertically on mobile; can be laid out in a row on wider viewports via className.',
  },
  accessibility: {
    role: 'radiogroup (Root), radio (Item)',
    keyboardNav: 'Tab focuses the selected or first item. Arrow keys navigate between items. Space selects the focused item.',
    ariaAttributes: ['aria-checked on each item', 'aria-disabled when disabled', 'aria-required on root if applicable'],
    wcag: ['2.1.1 Keyboard', '1.3.1 Info and Relationships', '4.1.2 Name, Role, Value'],
    screenReader: 'Each RadioGroupItem must have an associated visible label or aria-label. Group should have a legend or aria-labelledby.',
  },
  examples: [
    { label: 'Cabin class selection', code: '<RadioGroup defaultValue="economy"><RadioGroupItem value="economy" id="economy" /><RadioGroupItem value="business" id="business" /></RadioGroup>' },
    { label: 'Controlled selection', code: '<RadioGroup value={cabinClass} onValueChange={setCabinClass}><RadioGroupItem value="first" id="first" /></RadioGroup>' },
  ],
};

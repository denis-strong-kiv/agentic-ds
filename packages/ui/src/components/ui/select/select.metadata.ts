import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Choosing one option from a long list (7+ items) that would be impractical to show as radio buttons. Use for cabin class, nationality, currency, country, sort-order, or any enumerated field with many values.',
    whenNotToUse: 'Fewer than 6 options where all choices can be visible (use RadioGroup). Multi-select scenarios (use a multi-select combobox). When users need to type a custom value (use a combobox/autocomplete).',
    alternatives: ['RadioGroup — for small visible option sets', 'Combobox — when users can type to filter or enter custom values'],
    preferOver: 'Native <select> — provides consistent cross-platform styling and a custom scrollable dropdown.',
  },
  behavior: {
    states: ['closed', 'open', 'focused', 'disabled', 'placeholder'],
    interactions: ['Click trigger to open dropdown', 'Click item to select', 'Scroll in long lists via scroll buttons', 'Selected item shows check mark'],
    animations: ['Dropdown slides/fades in on open', 'Slides/fades out on close'],
    responsive: 'Dropdown renders in a portal to avoid overflow clipping. Popper position adjusts to viewport edges.',
  },
  accessibility: {
    role: 'combobox (trigger), listbox (content), option (item)',
    keyboardNav: 'Space/Enter/ArrowDown opens. Arrow keys navigate items. Enter/Space selects. Escape closes. Home/End jump to first/last.',
    ariaAttributes: ['aria-expanded on trigger', 'aria-selected on selected item', 'aria-disabled on disabled items', 'aria-labelledby connecting label to trigger'],
    wcag: ['2.1.1 Keyboard', '4.1.2 Name, Role, Value', '1.3.1 Info and Relationships'],
    screenReader: 'Pair with a visible <label> or use aria-label on SelectTrigger. SelectValue renders the current selection as text.',
  },
  examples: [
    { label: 'Cabin class picker', code: '<Select><SelectTrigger><SelectValue placeholder="Cabin class" /></SelectTrigger><SelectContent><SelectItem value="economy">Economy</SelectItem><SelectItem value="business">Business</SelectItem></SelectContent></Select>' },
    { label: 'Grouped options', code: '<Select><SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent><SelectGroup><SelectLabel>Price</SelectLabel><SelectItem value="asc">Low to high</SelectItem></SelectGroup></SelectContent></Select>' },
  ],
};

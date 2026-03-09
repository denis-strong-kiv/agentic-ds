import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Any single-line text entry: search, name, email, phone, airport code. Use with Label for accessible form fields.',
    whenNotToUse: 'Multi-line text (use Textarea). Selecting from a predefined list (use Select or Combobox). Date entry (use DatePicker).',
    alternatives: ['Textarea — multi-line text', 'Select — fixed option lists', 'Combobox — searchable option lists', 'DatePicker — date/time entry'],
    preferOver: 'Raw <input> elements — Input handles error states, ARIA, and slot layout automatically.',
  },
  behavior: {
    states: ['default', 'focus', 'error (aria-invalid)', 'disabled'],
    interactions: ['Type to enter text', 'Tab to focus', 'Shift+Tab to exit'],
    responsive: 'Full-width by default within its container.',
  },
  accessibility: {
    role: 'textbox (implicit)',
    keyboardNav: 'Tab to focus. Standard text input keyboard behaviour.',
    ariaAttributes: ['aria-invalid="true" when error prop is set', 'aria-describedby linking to error message element', 'id required for Label htmlFor association'],
    wcag: ['1.3.1 Info and Relationships', '3.3.1 Error Identification', '4.1.2 Name Role Value'],
    screenReader: 'Always pair with <Label htmlFor={id}>. Error message is announced via aria-describedby.',
  },
  examples: [
    {
      label: 'Labelled field',
      code: `<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="you@example.com" />`,
    },
    {
      label: 'With error',
      code: `<Input id="phone" error={{ message: 'Invalid phone number' }} />`,
    },
    {
      label: 'With icon slot',
      code: `<Input leftSlot={<Search size={16} />} placeholder="Search flights" />`,
    },
  ],
};

import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Associate a visible text label with a form control (Input, Select, Combobox, etc.) via the htmlFor prop. Use the required prop to show a visual asterisk when the field is mandatory. Use helperText for secondary guidance below the label.',
    whenNotToUse: 'Describing non-form content — use a heading or <p> instead. Labelling icon-only buttons — use aria-label on the button itself.',
    alternatives: ['aria-label on the input — when a visible label is intentionally hidden', 'aria-labelledby — when the label element already exists elsewhere in the DOM'],
    preferOver: 'Plain <label> elements — Label adds the required indicator and helperText slots in a consistent layout.',
  },
  behavior: {
    states: ['default', 'with-required-indicator', 'with-helper-text'],
    interactions: ['Click label to focus associated control (native <label> behaviour via htmlFor)'],
  },
  accessibility: {
    role: 'label (native <label> element)',
    keyboardNav: 'Not focusable. Clicking activates the associated control.',
    ariaAttributes: [
      'Required asterisk (*) is aria-hidden="true" — conveys requiredness visually only; pair with required attribute on the input for programmatic announcement',
    ],
    wcag: ['1.3.1 Info and Relationships', '2.4.6 Headings and Labels'],
    screenReader: 'The label text is announced when the associated control receives focus via htmlFor. The asterisk is suppressed from screen readers — mark the input as required separately.',
  },
  examples: [
    { label: 'Basic label', code: '<Label htmlFor="email">Email address</Label>' },
    { label: 'Required field', code: '<Label htmlFor="surname" required>Last name</Label>' },
    { label: 'With helper text', code: '<Label htmlFor="dob" helperText="Format: DD/MM/YYYY">Date of birth</Label>' },
    { label: 'Required with helper text', code: '<Label htmlFor="passport" required helperText="Must be valid for 6 months beyond travel date">Passport number</Label>' },
  ],
};

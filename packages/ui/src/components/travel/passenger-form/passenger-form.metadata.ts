import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Passenger details step in the booking funnel. Collects personal information (title, name, date of birth), travel document details (nationality, passport number and expiry), contact info (primary traveler only), and optional extras (frequent flyer number, meal preference, wheelchair assistance, special requests).',
    whenNotToUse: 'Account registration or profile editing — this form is scoped to travel booking data including passport fields. Do not use for non-passenger form contexts.',
    alternatives: ['ui/Input, ui/Select, ui/Label — if building a custom form layout from scratch'],
    preferOver: 'Ad hoc passenger forms that duplicate the built-in validation and "Copy from primary traveler" logic.',
  },
  behavior: {
    states: [
      'isPrimary=true — shows "Primary Traveler" legend and email/phone contact fields; hides "Copy from primary traveler" button',
      'isPrimary=false — shows "{type} {index+1}" legend; shows "Copy from primary traveler" button when onCopyFromPrimary is provided',
      'validation errors — inline error messages shown below each invalid field after save attempt',
      'valid submission — calls onSave with complete PassengerData; errors cleared',
    ],
    interactions: [
      'Field changes clear the corresponding validation error immediately',
      '"Copy from primary traveler" button populates fields from onCopyFromPrimary() return value and clears all errors',
      '"Save Passenger" button triggers client-side validation; calls onSave only when all required fields pass',
      'Wheelchair assistance checkbox toggles wheelchairAssistance boolean',
      'Meal preference select offers: Standard, Vegetarian, Vegan, Halal, Kosher, Gluten-Free',
      'Special requests textarea has a 500-character max with visible character count',
    ],
    responsive: 'Personal details grid: 1 col on mobile, 2 cols on sm, 4 cols on md. Passport details: 1 col on mobile, 3 cols on sm. Contact row: 1 col on mobile, 2 cols on sm.',
  },
  accessibility: {
    role: 'group (fieldset element)',
    keyboardNav: 'Standard form keyboard navigation. All inputs, selects, and checkboxes are reachable via Tab. Select dropdowns support arrow key navigation.',
    ariaAttributes: [
      'aria-label="{type} {index+1} details" on the fieldset',
      'htmlFor associations between all Label and Input/Select/Checkbox/Textarea elements',
      'required attribute surfaced via Label required prop',
      'error prop on Input propagates to aria-describedby / aria-invalid pattern',
    ],
    wcag: ['2.1.1 Keyboard', '1.3.1 Info and Relationships', '3.3.1 Error Identification', '3.3.2 Labels or Instructions'],
    screenReader: 'fieldset legend announces the passenger identity context ("Primary Traveler" or "Adult 2"). Field labels include "(optional)" suffix as visible text for optional fields.',
  },
  examples: [
    {
      label: 'Primary traveler (adult)',
      code: `<PassengerForm
  index={0}
  type="Adult"
  isPrimary
  onSave={(data) => savePassenger(0, data)}
/>`,
    },
    {
      label: 'Secondary passenger with copy-from-primary',
      code: `<PassengerForm
  index={1}
  type="Adult"
  onSave={(data) => savePassenger(1, data)}
  onCopyFromPrimary={() => getPrimaryPassengerData()}
/>`,
    },
  ],
};

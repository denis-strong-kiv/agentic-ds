import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Multi-step booking funnel (Search → Select → Customize → Passengers → Payment → Confirmation) to show users where they are and allow navigation back to completed steps.',
    whenNotToUse: 'Single-page forms or wizards with fewer than 3 steps. Non-booking flows like account settings where steps are not linearly ordered.',
    alternatives: ['ui/Breadcrumb — for hierarchical page location, not sequential step progress'],
    preferOver: 'Custom progress indicator implementations. Use createBookingSteps(activeStepIndex) factory for the standard 6-step travel booking flow.',
  },
  behavior: {
    states: [
      'completed — step shows checkmark icon, clickable if onStepClick is provided',
      'active — step highlighted, aria-current="step" set, not clickable (current position)',
      'upcoming — step shows numeric index, disabled button, greyed out',
    ],
    interactions: [
      'Clicking a completed step fires onStepClick(stepId) — allows backward navigation',
      'Upcoming steps are disabled and do not respond to clicks',
      'Connector lines between steps reflect whether the next step is upcoming (muted) or reached (filled)',
    ],
  },
  accessibility: {
    role: 'navigation (nav element)',
    keyboardNav: 'Tab through completed step buttons; upcoming steps are disabled and skipped in tab order. Active step button is focusable but clicking it does nothing without onStepClick.',
    ariaAttributes: [
      'aria-label on nav (defaults to "Booking progress", customisable via aria-label prop)',
      'aria-current="step" on the active step button',
      'aria-label on each button includes status suffix: "(completed)" or "(current)"',
      'aria-hidden on connector line dividers',
    ],
    wcag: ['2.1.1 Keyboard', '4.1.2 Name, Role, Value', '2.4.8 Location'],
    screenReader: 'Each step button announces its label plus current/completed status. Screen readers will announce the nav landmark with its label.',
  },
  examples: [
    {
      label: 'Standard 6-step booking funnel at Passengers step',
      code: `<BookingStepper
  steps={createBookingSteps(3)}
  onStepClick={(id) => navigateTo(id)}
/>`,
    },
    {
      label: 'Custom steps',
      code: `<BookingStepper
  steps={[
    { id: 'flights', label: 'Flights', status: 'completed' },
    { id: 'hotels', label: 'Hotels', status: 'active' },
    { id: 'payment', label: 'Payment', status: 'upcoming' },
  ]}
  onStepClick={(id) => navigateTo(id)}
  aria-label="Trip builder progress"
/>`,
    },
  ],
};

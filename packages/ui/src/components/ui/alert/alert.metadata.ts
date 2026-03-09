import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Inline status messages that give feedback about a user action or system state — booking confirmation, payment errors, form validation summaries, or important travel advisories.',
    whenNotToUse: 'Transient toasts that auto-dismiss (use a Toast). Blocking confirmations that require a decision (use AlertDialog). Decorative callouts with no semantic urgency.',
    alternatives: ['Toast — ephemeral feedback that disappears automatically', 'AlertDialog — destructive action confirmation requiring user choice', 'Banner — full-width page-level notifications'],
    preferOver: 'Custom colored div with manual role="alert" and icon.',
  },
  behavior: {
    states: ['default (info)', 'success', 'warning', 'error', 'dismissible (when onDismiss is provided)'],
    interactions: ['Optional dismiss button calls onDismiss callback when clicked'],
    animations: [],
    responsive: 'Full-width block element; stacks vertically with surrounding content.',
  },
  accessibility: {
    role: 'alert',
    keyboardNav: 'Dismiss button is focusable via Tab. Activated with Enter/Space.',
    ariaAttributes: ['role="alert" on root — live region that announces to screen readers immediately', 'aria-label="Dismiss" on the close button'],
    wcag: ['4.1.3 Status Messages', '1.4.3 Contrast', '2.1.1 Keyboard'],
    screenReader: 'role="alert" causes the content to be announced as soon as it is rendered. Keep AlertTitle and AlertDescription concise and actionable.',
  },
  examples: [
    { label: 'Error — payment failed', code: '<Alert variant="error">\n  <AlertTitle>Payment failed</AlertTitle>\n  <AlertDescription>Your card was declined. Please update your payment details.</AlertDescription>\n</Alert>' },
    { label: 'Success — booking confirmed', code: '<Alert variant="success" onDismiss={() => setVisible(false)}>\n  <AlertTitle>Booking confirmed</AlertTitle>\n  <AlertDescription>Your reservation PNR is AB1234.</AlertDescription>\n</Alert>' },
    { label: 'Warning — passport expiry', code: '<Alert variant="warning">\n  <AlertTitle>Passport expires soon</AlertTitle>\n  <AlertDescription>Your passport expires within 6 months of travel.</AlertDescription>\n</Alert>' },
  ],
};

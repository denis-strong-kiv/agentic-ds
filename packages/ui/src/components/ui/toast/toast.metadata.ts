import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Non-blocking, transient feedback for completed actions: save success, copy confirmation, booking created. Auto-dismisses after a timeout.',
    whenNotToUse: 'Critical errors requiring user action (use Alert or Dialog). Persistent status messages. Information the user needs to read carefully.',
    alternatives: ['Alert — for persistent, inline status banners', 'Dialog — for errors requiring acknowledgment', 'NotificationBadge — for unread count indicators'],
    neverUseFor: 'Blocking flows or content requiring user input.',
  },
  behavior: {
    states: ['entering', 'visible', 'dismissing', 'dismissed'],
    interactions: ['Auto-dismiss after timeout (default 5s)', 'Manual dismiss via close button', 'Swipe to dismiss on touch'],
    animations: ['Slides in from bottom-right, fades out on dismiss'],
    responsive: 'Full-width on mobile, fixed-width on desktop. Stacks vertically for multiple toasts.',
  },
  accessibility: {
    role: 'status (default) or alert (for error/warning variants)',
    keyboardNav: 'Focus is not moved to toast — it is non-blocking. Close button is focusable.',
    ariaAttributes: ['aria-live="polite" for success/info', 'aria-live="assertive" for error/warning', 'aria-atomic="true"'],
    wcag: ['4.1.3 Status Messages', '2.2.1 Timing Adjustable'],
    screenReader: 'ToastTitle and ToastDescription are announced via aria-live. Error toasts use assertive.',
  },
  examples: [
    {
      label: 'Success notification',
      code: `toast({ title: 'Booking confirmed', description: 'Check your email for details.', variant: 'success' })`,
    },
    {
      label: 'Error notification',
      code: `toast({ title: 'Payment failed', description: 'Please try a different card.', variant: 'error' })`,
    },
  ],
};

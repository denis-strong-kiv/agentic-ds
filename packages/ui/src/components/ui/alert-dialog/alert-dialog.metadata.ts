import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Destructive or irreversible actions that require explicit user confirmation — cancelling a booking, deleting saved search preferences, or permanently removing passenger details.',
    whenNotToUse: 'Informational messages that need no decision (use Alert). Non-destructive modals with rich content (use Dialog). Success/error feedback (use Toast or Alert).',
    alternatives: ['Dialog — general-purpose modal for forms, previews, or non-destructive interactions', 'Alert — inline status message requiring no confirmation'],
    preferOver: 'window.confirm() or custom modal built from scratch.',
    neverUseFor: 'Marketing upsells, feature announcements, or any non-critical interruptions.',
  },
  behavior: {
    states: ['closed', 'open'],
    interactions: ['AlertDialogTrigger opens the dialog', 'AlertDialogAction (destructive button) confirms and closes', 'AlertDialogCancel (secondary button) dismisses without action', 'Escape key closes and cancels'],
    animations: ['Overlay fade in/out', 'Content scale and fade via Radix data-state transitions'],
    responsive: 'Dialog content is centered; max-width constrained on larger viewports.',
  },
  accessibility: {
    role: 'alertdialog',
    keyboardNav: 'Tab cycles focus within dialog. Escape cancels. Focus is trapped inside while open and returns to trigger on close.',
    ariaAttributes: ['aria-labelledby pointing to AlertDialogTitle', 'aria-describedby pointing to AlertDialogDescription', 'role="alertdialog" prevents interaction with background content'],
    wcag: ['2.1.2 No Keyboard Trap (focus properly trapped and released)', '4.1.2 Name, Role, Value', '2.4.3 Focus Order'],
    screenReader: 'AlertDialogTitle is announced immediately on open. Both Title and Description are mandatory for screen reader users to understand the required decision.',
  },
  examples: [
    { label: 'Cancel booking', code: '<AlertDialog>\n  <AlertDialogTrigger asChild>\n    <Button variant="destructive">Cancel Booking</Button>\n  </AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>\n      <AlertDialogDescription>This action cannot be undone. Cancellation fees may apply.</AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Keep Booking</AlertDialogCancel>\n      <AlertDialogAction onClick={handleCancel}>Yes, Cancel</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>' },
  ],
};

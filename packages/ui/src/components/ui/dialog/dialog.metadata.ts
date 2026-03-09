import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Blocking interactions requiring user decision before continuing: confirmations, forms, detail views that must stay in context. Use when the task is short and self-contained.',
    whenNotToUse: 'Large content areas or multi-step flows that need persistent side panels (use Sheet). Non-blocking supplementary info (use Tooltip or Popover). Destructive confirmations (use AlertDialog).',
    alternatives: ['AlertDialog — for destructive confirmation prompts with required affirmation', 'Sheet — for side panels with richer content', 'Popover — for non-blocking, anchor-relative info', 'FlightDetails — travel-domain dialog wrapping full itinerary'],
    preferOver: 'Custom modal implementations — Dialog handles focus trap, scroll lock, escape key, and ARIA automatically.',
  },
  behavior: {
    states: ['closed', 'open', 'closing (exit animation)'],
    interactions: ['Escape to close', 'Click overlay to close', 'Click close button', 'Focus trap active when open'],
    animations: ['Fade + scale in/out via CSS data-state animations'],
    responsive: 'size="full" for full-screen mobile modals.',
  },
  accessibility: {
    role: 'dialog',
    keyboardNav: 'Escape closes. Focus trapped inside. First focusable element receives focus on open. Focus returns to trigger on close.',
    ariaAttributes: ['aria-modal="true"', 'aria-labelledby pointing to DialogTitle', 'aria-describedby pointing to DialogDescription'],
    wcag: ['2.1.2 No Keyboard Trap (focus trap is intentional and escapable)', '1.3.1 Info and Relationships'],
    screenReader: 'DialogTitle is announced on open. Always provide a visible or sr-only DialogTitle.',
  },
  examples: [
    {
      label: 'Basic confirmation dialog',
      code: `<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm booking</DialogTitle>
      <DialogDescription>This will charge your card.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    },
    {
      label: 'Large content',
      code: `<Dialog>
  <DialogTrigger asChild><Button>View details</Button></DialogTrigger>
  <DialogContent size="lg">
    <DialogHeader><DialogTitle>Fare rules</DialogTitle></DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>`,
    },
  ],
};

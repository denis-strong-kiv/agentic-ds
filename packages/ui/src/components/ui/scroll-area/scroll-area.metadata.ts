import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Constrained scrollable region where native scrollbars look inconsistent across platforms or clash with the design. Use for sidebars, dropdowns, modals, or any fixed-height overflow container.',
    whenNotToUse: 'Full-page scrolling (use native body scroll). When the content height is always visible and no overflow occurs.',
    alternatives: ['Native overflow-auto div — simpler, but with inconsistent scrollbar styling across browsers'],
    preferOver: 'Custom scrollbar CSS hacks on native elements.',
  },
  behavior: {
    states: ['idle', 'scrolling', 'scrollbar-visible', 'scrollbar-hidden'],
    interactions: ['Mouse wheel scrolls content', 'Drag scrollbar thumb', 'Click scrollbar track', 'Touch swipe on mobile'],
    animations: ['Scrollbar thumb fades in on scroll activity and fades out when idle'],
    responsive: 'Scrollbar orientation defaults to vertical; pass orientation="horizontal" to ScrollBar for horizontal scroll areas.',
  },
  accessibility: {
    role: 'region (implicit via landmark context)',
    keyboardNav: 'Content inside the viewport is natively focusable. Keyboard scrolling follows normal browser behavior within the viewport.',
    ariaAttributes: ['aria-label or aria-labelledby recommended on the root to identify the scrollable region'],
    wcag: ['1.4.10 Reflow', '2.1.1 Keyboard'],
    screenReader: 'Screen readers scroll to focused elements automatically. Ensure focusable children have descriptive labels.',
  },
  examples: [
    { label: 'Vertical scroll list', code: '<ScrollArea className="h-72"><FlightCardList /></ScrollArea>' },
    { label: 'Horizontal scroll', code: '<ScrollArea><ScrollBar orientation="horizontal" /><div className="flex gap-4">…</div></ScrollArea>' },
  ],
};

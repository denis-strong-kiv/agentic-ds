import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Persistent side panels, filter panels, detail views, or mobile navigation drawers. Use when content is too rich for a Dialog and does not need to fully block the page.',
    whenNotToUse: 'Short confirmations (use AlertDialog). Anchor-relative tooltips (use Popover). Full-page modals (use Dialog size="full").',
    alternatives: ['Dialog — for blocking, centered modals', 'FilterPanel — travel-domain sheet wrapping all filter controls', 'FlightDetails — travel-domain right-side detail panel'],
    preferOver: 'Custom drawer implementations — Sheet handles focus trap, scroll lock, and exit animation.',
  },
  behavior: {
    states: ['closed', 'open', 'closing (slide-out animation)'],
    interactions: ['Escape to close', 'Click overlay to close', 'Focus trap active when open'],
    animations: ['Slides in/out from the configured side via CSS data-state transitions'],
    responsive: 'side="bottom" is common for mobile sheets.',
  },
  accessibility: {
    role: 'dialog',
    keyboardNav: 'Escape closes. Focus trapped. Focus returns to trigger on close.',
    ariaAttributes: ['aria-modal="true"', 'aria-labelledby pointing to SheetTitle'],
    wcag: ['2.1.2 No Keyboard Trap', '1.3.1 Info and Relationships'],
  },
  examples: [
    {
      label: 'Filter side panel',
      code: `<Sheet>
  <SheetTrigger asChild><Button>Filters</Button></SheetTrigger>
  <SheetContent side="left">
    <SheetHeader><SheetTitle>Filter results</SheetTitle></SheetHeader>
    <FilterPanel filters={filters} onChange={setFilters} />
  </SheetContent>
</Sheet>`,
    },
  ],
};

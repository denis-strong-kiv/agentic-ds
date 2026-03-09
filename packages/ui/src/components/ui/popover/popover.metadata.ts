import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Floating content panel anchored to a trigger element — filter panels, date picker overlays, rich tooltips with interactive content, mini-forms. Use when the floating content is non-modal and the user can interact with the rest of the page.',
    whenNotToUse: 'Confirming a destructive action — use AlertDialog (modal). Displaying non-interactive hint text — use Tooltip. Full-screen overlays — use Dialog or Sheet.',
    alternatives: ['Tooltip — for read-only hover hints', 'Dialog — for modal flows that require user attention', 'DropdownMenu — for action/option lists triggered by a button'],
    preferOver: 'Custom absolutely-positioned divs — Popover uses Radix PopoverPrimitive for focus management, portal rendering, collision detection, and ARIA.',
  },
  behavior: {
    states: ['closed', 'open'],
    interactions: [
      'Click PopoverTrigger to open/close the popover',
      'Click outside PopoverContent to dismiss',
      'Escape key to dismiss',
      'Focus is moved into PopoverContent when opened',
      'Focus returns to trigger when closed',
    ],
    animations: ['PopoverContent enter/exit animations via Radix data-state attribute'],
    responsive: 'align prop controls horizontal alignment (start, center, end). sideOffset defaults to 4px gap between trigger and content. Radix handles viewport collision detection.',
  },
  accessibility: {
    role: 'dialog (PopoverContent)',
    keyboardNav: 'Tab to reach trigger. Enter/Space to open. Tab through focusable elements inside content. Escape to close.',
    ariaAttributes: [
      'PopoverContent has role="dialog" (Radix default)',
      'aria-expanded on trigger reflects open state (managed by Radix)',
      'PopoverAnchor available for cases where the anchor differs from the trigger',
    ],
    wcag: ['2.1.1 Keyboard', '4.1.3 Status Messages', '2.4.3 Focus Order'],
    screenReader: 'Add aria-label or aria-labelledby to PopoverContent to name the dialog for screen readers. Focus is moved into the content on open so users are not left stranded.',
  },
  examples: [
    { label: 'Filter panel', code: `<Popover>\n  <PopoverTrigger asChild>\n    <Button variant="secondary">Filters</Button>\n  </PopoverTrigger>\n  <PopoverContent align="start" aria-label="Search filters">\n    {/* filter controls */}\n  </PopoverContent>\n</Popover>` },
    { label: 'Controlled open state', code: `<Popover open={open} onOpenChange={setOpen}>\n  <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>\n  <PopoverContent>Content here</PopoverContent>\n</Popover>` },
    { label: 'Custom anchor', code: `<Popover>\n  <PopoverAnchor asChild><div ref={anchorRef} /></PopoverAnchor>\n  <PopoverTrigger asChild><Button>Trigger</Button></PopoverTrigger>\n  <PopoverContent>Anchored elsewhere</PopoverContent>\n</Popover>` },
  ],
};

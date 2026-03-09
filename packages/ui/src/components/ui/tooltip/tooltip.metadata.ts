import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Non-essential supplementary information revealed on hover or focus — icon button labels, abbreviated cell values, field hints, fare condition explanations. Content must be short (one phrase or sentence).',
    whenNotToUse: 'Critical information users need to complete a task (put it inline). Interactive content like links or buttons inside the tooltip (use Popover). On touch-only surfaces where hover is unavailable.',
    alternatives: ['Popover — for interactive or rich content anchored to a trigger', 'Dialog — for important information requiring user acknowledgement'],
    neverUseFor: 'Required form instructions — these must be permanently visible, not hidden behind a tooltip.',
  },
  behavior: {
    states: ['hidden', 'visible'],
    interactions: ['Mouse hover on trigger shows tooltip after delay', 'Keyboard focus on trigger shows tooltip', 'Mouse leave or blur hides tooltip'],
    animations: ['Tooltip fades/scales in on open, fades/scales out on close'],
    responsive: 'Renders in a portal to avoid overflow clipping. sideOffset defaults to 4px. Position auto-adjusts to stay within viewport.',
  },
  accessibility: {
    role: 'tooltip (content)',
    keyboardNav: 'Tab to focus the trigger — tooltip appears automatically. Escape dismisses. Tooltip is not in the tab order.',
    ariaAttributes: ['aria-describedby on the trigger element linking to the tooltip id (managed by Radix)'],
    wcag: ['1.4.13 Content on Hover or Focus', '2.1.1 Keyboard', '4.1.3 Status Messages'],
    screenReader: 'Tooltip content is announced as a description for the trigger. Ensure the trigger itself has an accessible name independent of the tooltip.',
  },
  examples: [
    { label: 'Icon button label', code: '<TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Share itinerary"><Share2 /></Button></TooltipTrigger><TooltipContent>Share itinerary</TooltipContent></Tooltip></TooltipProvider>' },
    { label: 'Fare condition hint', code: '<TooltipProvider><Tooltip><TooltipTrigger><InfoIcon className="w-4 h-4" /></TooltipTrigger><TooltipContent>Non-refundable. Changes allowed for a fee.</TooltipContent></Tooltip></TooltipProvider>' },
  ],
};

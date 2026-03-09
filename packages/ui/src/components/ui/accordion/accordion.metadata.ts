import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Collapsible sections of related content where only one or a few sections need to be visible at a time. Use for FAQs, filter panels, settings groups, or itinerary details.',
    whenNotToUse: 'When all content should be visible simultaneously (use a list or sections). When content is short enough to show inline without the overhead of disclosure.',
    alternatives: ['Tabs — when sections are mutually exclusive and equal in priority', 'Dialog — when content needs full focus isolation', 'Collapsible — single-item expand/collapse without a group context'],
    preferOver: 'Custom show/hide toggle implementations built with state and CSS display.',
  },
  behavior: {
    states: ['collapsed', 'expanded', 'disabled'],
    interactions: ['Click trigger to expand/collapse', 'Enter/Space to toggle when trigger is focused'],
    animations: ['ChevronDown icon rotates 180° on expand', 'Content height animates open/closed via Radix data attributes'],
    responsive: 'Full-width by default; stacks vertically regardless of viewport.',
  },
  accessibility: {
    role: 'region (AccordionContent) with associated button trigger',
    keyboardNav: 'Tab to focus triggers. Enter/Space to expand or collapse. Arrow keys move between triggers when in the accordion.',
    ariaAttributes: ['aria-expanded on trigger', 'aria-controls linking trigger to panel', 'aria-hidden on collapsed content'],
    wcag: ['4.1.2 Name, Role, Value', '2.1.1 Keyboard'],
    screenReader: 'Trigger text should clearly describe the panel content. Radix manages expanded/collapsed announcements automatically.',
  },
  examples: [
    { label: 'Single expand (FAQ)', code: '<Accordion type="single" collapsible>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>What is included in the fare?</AccordionTrigger>\n    <AccordionContent>Baggage, meals, and seat selection are included.</AccordionContent>\n  </AccordionItem>\n</Accordion>' },
    { label: 'Multiple expand (filters)', code: '<Accordion type="multiple">\n  <AccordionItem value="stops">\n    <AccordionTrigger>Stops</AccordionTrigger>\n    <AccordionContent>Non-stop, 1 stop, 2+ stops</AccordionContent>\n  </AccordionItem>\n  <AccordionItem value="airlines">\n    <AccordionTrigger>Airlines</AccordionTrigger>\n    <AccordionContent>Carrier checkboxes here</AccordionContent>\n  </AccordionItem>\n</Accordion>' },
  ],
};

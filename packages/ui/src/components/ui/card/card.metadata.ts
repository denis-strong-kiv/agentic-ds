import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Group related content and actions into a visually bounded container — flight results, hotel listings, booking summaries, saved itineraries, or dashboard widgets.',
    whenNotToUse: 'Full-page layout sections (use semantic HTML like <section>/<article>). Simple inline grouping that does not need a visual boundary. Lists where each row is a single action.',
    alternatives: ['Table row — for dense tabular data', 'List item — for simple single-line entries without media or actions'],
    preferOver: 'Custom div with manual border, shadow, and border-radius CSS.',
  },
  behavior: {
    states: ['default', 'elevated (box-shadow)', 'outlined (border, default)'],
    interactions: ['None by default — wrap in a button or anchor if the entire card is interactive'],
    responsive: 'Block-level; use grid or flex on the parent to control columns.',
  },
  accessibility: {
    role: 'generic (div)',
    keyboardNav: 'No inherent keyboard behaviour. If the card is a clickable target, wrap in a button or anchor. Ensure interactive elements inside are individually focusable.',
    ariaAttributes: ['Consider aria-label or aria-labelledby when card heading is not visually associated with card boundary'],
    wcag: ['1.4.3 Contrast — ensure card background meets contrast with page background', '2.1.1 Keyboard — any interactive card must be reachable and operable'],
    screenReader: 'CardTitle renders an <h3> and CardDescription a <p> — ensure heading hierarchy is correct for the page context.',
  },
  examples: [
    { label: 'Flight result card', code: '<Card variant="elevated">\n  <CardHeader>\n    <CardTitle>Dubai → London</CardTitle>\n    <CardDescription>Emirates · 7h 20m · Non-stop</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <p>Departs 08:15 · Arrives 12:35</p>\n  </CardContent>\n  <CardFooter>\n    <span className="font-bold">AED 1,250</span>\n    <Button>Select</Button>\n  </CardFooter>\n</Card>' },
    { label: 'Hotel listing card (outlined)', code: '<Card variant="outlined">\n  <CardHeader><CardTitle>Burj Al Arab</CardTitle></CardHeader>\n  <CardContent><p>5-star · Jumeirah Beach · From $850/night</p></CardContent>\n</Card>' },
  ],
};

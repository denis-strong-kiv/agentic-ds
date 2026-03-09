import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Visual divider between distinct sections of content — e.g., separating form sections, list groups, card body from footer, or sidebar sections.',
    whenNotToUse: 'When spacing alone (margin/padding) is sufficient to distinguish sections. Do not use as a structural layout element.',
    alternatives: ['CSS gap/margin for spacing without a visible rule', 'Card with distinct header/body areas for grouped content'],
    neverUseFor: 'Decorative graphic flourishes — use a CSS border or background instead.',
  },
  behavior: {
    states: ['static'],
    interactions: [],
    responsive: 'Orientation prop controls horizontal (full-width rule) vs vertical (full-height rule in flex rows).',
  },
  accessibility: {
    role: 'separator (when decorative=false), none/presentation (when decorative=true, the default)',
    keyboardNav: 'Not interactive — no keyboard behavior.',
    ariaAttributes: ['aria-orientation="horizontal|vertical" when role="separator"'],
    wcag: ['1.3.1 Info and Relationships — meaningful separators should be non-decorative'],
    screenReader: 'Defaults to decorative=true so screen readers skip it. Set decorative={false} only when the separator carries semantic grouping meaning.',
  },
  examples: [
    { label: 'Between card sections', code: '<Separator />' },
    { label: 'Vertical in flex row', code: '<Separator orientation="vertical" className="h-6" />' },
    { label: 'Semantic separator', code: '<Separator decorative={false} />' },
  ],
};

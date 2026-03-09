import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Any time you need to render a Lucide icon or a custom OTA icon with consistent sizing (xs–xl) and strokeWidth. Use the label prop to make standalone meaningful icons accessible.',
    whenNotToUse: 'Logos or brand marks — use an <img> or inline SVG directly. Complex multi-color illustrations — Icon only wraps single-color stroke icons.',
    alternatives: ['Raw LucideIcon component — only when Icon wrapper is not available'],
    preferOver: 'Direct Lucide component usage — Icon normalises strokeWidth to 1.75 and applies design-system size tokens consistently.',
    neverUseFor: 'Interactive controls on their own — wrap in a Button or IconButton so the clickable target has the correct role and keyboard support.',
  },
  behavior: {
    states: ['static (decorative or labelled)'],
    interactions: ['None — Icon is purely presentational. Interaction belongs to the parent button or link.'],
  },
  accessibility: {
    role: 'img (when label is provided) or presentation (decorative, aria-hidden)',
    keyboardNav: 'Not focusable — interactive parent handles focus.',
    ariaAttributes: [
      'aria-hidden="true" when no label prop is passed (decorative)',
      'aria-label set to label prop value when provided',
    ],
    wcag: ['1.1.1 Non-text Content'],
    screenReader: 'Pass label only when the icon conveys information not available in surrounding text (e.g. standalone icon buttons). For icons inside labelled buttons or links, omit label.',
  },
  examples: [
    { label: 'Decorative (inside labelled button)', code: '<Icon icon={Search} size="sm" />' },
    { label: 'Standalone meaningful icon', code: '<Icon icon={AlertCircle} size="md" label="Warning: price changed" />' },
    { label: 'Explicit pixel size', code: '<Icon icon={Plane} size={18} />' },
    { label: 'OTA custom icon', code: '<Icon icon={OtaFlightIcon} size="lg" label="Flight" />' },
  ],
};

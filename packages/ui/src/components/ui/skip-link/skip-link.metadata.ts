import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Place as the first element inside every page layout to allow keyboard users to bypass repeated navigation and jump directly to the main content area. Required on every route for WCAG 2.4.1 compliance.',
    whenNotToUse: 'Single-page flows with no repeated navigation block before main content.',
    alternatives: ['aria-label on <main> — helpful but not a substitute for a visible skip link'],
    preferOver: 'Omitting skip navigation entirely — this causes WCAG Level A failure.',
  },
  behavior: {
    states: ['visually-hidden', 'focused-visible'],
    interactions: ['Tab to reveal the link on first keypress', 'Enter/click to jump focus to the target element'],
    animations: ['Transitions from off-screen / invisible to visible when focused'],
    responsive: 'Always present regardless of viewport size.',
  },
  accessibility: {
    role: 'link',
    keyboardNav: 'Becomes the first Tab stop on the page. Enter activates the anchor and moves focus to #main-content (or the configured href).',
    ariaAttributes: [],
    wcag: ['2.4.1 Bypass Blocks (Level A)'],
    screenReader: 'Announced as a link with text "Skip to main content" (default). The target element must have a matching id and should be focusable (add tabIndex={-1} if it is not natively focusable).',
  },
  examples: [
    { label: 'Standard usage in layout', code: '<SkipLink href="#main-content" />' },
    { label: 'Custom label', code: '<SkipLink href="#search-results">Skip to search results</SkipLink>' },
  ],
};

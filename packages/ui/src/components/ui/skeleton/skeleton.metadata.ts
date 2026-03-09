import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Replace content areas while async data loads. Mirror the shape and size of the content it replaces for minimal layout shift.',
    whenNotToUse: 'Spinner/progress indicators for actions (use Progress or a loading Button). Error states. Empty states.',
    alternatives: ['Progress — for determinate loading with known completion', 'Button isLoading — for action-level loading feedback'],
    preferOver: 'Blank space, spinners, or generic "Loading..." text during content fetch.',
    neverUseFor: 'Interactive elements or content that is already loaded.',
  },
  behavior: {
    states: ['pulse', 'shimmer', 'none'],
    interactions: ['None — aria-hidden="true", fully decorative'],
    animations: ['pulse: opacity oscillation', 'shimmer: highlight sweep left-to-right'],
    responsive: 'Size via className — match the dimensions of the real content.',
  },
  accessibility: {
    role: 'none (aria-hidden="true")',
    keyboardNav: 'Not focusable.',
    ariaAttributes: ['aria-hidden="true" always — companion aria-live region should announce when content loads'],
    wcag: ['2.2.2 Pause Stop Hide — reduced-motion disables animation'],
  },
  examples: [
    {
      label: 'Card skeleton',
      code: `<div className="travel-flight-card">
  <Skeleton className="h-8 w-3/4" />
  <Skeleton className="h-4 w-1/2 mt-2" />
</div>`,
    },
    {
      label: 'Shimmer variant',
      code: `<Skeleton animation="shimmer" className="h-48 w-full rounded-lg" />`,
    },
  ],
};

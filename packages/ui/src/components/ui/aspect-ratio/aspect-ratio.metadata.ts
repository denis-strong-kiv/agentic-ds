import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Maintain a fixed width-to-height ratio for media containers — hotel hero images, destination photos, map previews, or video embeds — preventing layout shift as images load.',
    whenNotToUse: 'Content whose height should grow naturally with its contents (text blocks, cards with variable copy). Intrinsically-sized SVGs that already declare their own viewBox.',
    alternatives: ['CSS aspect-ratio property directly — for one-off cases where a full component is overkill'],
    preferOver: 'Padding-top percentage hack or fixed pixel dimensions that break on different viewports.',
  },
  behavior: {
    states: ['static — wraps children in a fixed-ratio container'],
    interactions: ['None — layout primitive only'],
    responsive: 'Fills the width of its container; height adjusts proportionally. Use ASPECT_RATIOS presets (16/9, 4/3, 1/1, 3/2) for consistent sizing across the design system.',
  },
  accessibility: {
    role: 'none (presentational wrapper)',
    keyboardNav: 'No keyboard behaviour. Child content manages its own focus.',
    screenReader: 'Invisible to assistive technology. Ensure the media child has appropriate alt text or aria-label.',
  },
  examples: [
    { label: 'Hotel hero image (16:9)', code: '<AspectRatio ratio={ASPECT_RATIOS["16/9"]}>\n  <img src={hotelImageUrl} alt="Hotel exterior" className="w-full h-full object-cover" />\n</AspectRatio>' },
    { label: 'Square destination thumbnail', code: '<AspectRatio ratio={ASPECT_RATIOS["1/1"]}>\n  <img src={destinationThumb} alt="Paris" className="w-full h-full object-cover rounded-lg" />\n</AspectRatio>' },
    { label: 'Video embed (16:9)', code: '<AspectRatio ratio={16 / 9}>\n  <iframe src="https://www.youtube.com/embed/..." title="Destination video" className="w-full h-full" />\n</AspectRatio>' },
  ],
};

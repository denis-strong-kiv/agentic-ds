import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Visualise flight routes on a map alongside search results or flight detail. Renders great-circle arcs with animated dashes and airport markers.',
    whenNotToUse: 'Static route diagrams (use ItineraryTimeline). Hotel location maps. Non-flight geographic contexts.',
    alternatives: ['ItineraryTimeline — for linear, text-based segment display without a map'],
    neverUseFor: 'Decorative backgrounds or non-flight route contexts.',
  },
  behavior: {
    states: ['loading (map tiles loading)', 'loaded', 'animating dashes (RAF loop)', 'refitting (fitBounds on airport or resize change)'],
    interactions: ['Pan and zoom (interactive=true)', 'Drag disabled for rotation (dragRotate=false)', 'Map re-fits on airport set change (900ms animation)', 'Map re-fits on container resize after 320ms debounce (panel transitions)'],
    animations: ['Animated white dashes on flight paths via requestAnimationFrame at ~20fps', 'fitBounds camera animation (900ms on airport change, 700ms on resize)', 'Pulsing ring on origin airport marker'],
    responsive: 'Must be placed in a flex:1 container to fill remaining space. Container must have overflow:hidden.',
  },
  accessibility: {
    role: 'img (map canvas)',
    keyboardNav: 'Map canvas is not keyboard-navigable by default. Navigation controls removed. Ensure route information is also available as text (ItineraryTimeline).',
    ariaAttributes: ['aria-hidden on pulse animation element', 'aria-label on IATA marker labels'],
    wcag: ['1.1.1 Non-text Content — provide text alternative of route via ItineraryTimeline alongside the map'],
  },
  examples: [
    {
      label: 'Single flight route',
      code: `<FlightMap
  airports={[
    { id: 'JFK', lat: 40.64, lng: -73.78, label: 'JFK', isOrigin: true },
    { id: 'LHR', lat: 51.47, lng: -0.45, label: 'LHR', isDestination: true },
  ]}
  paths={[{ id: 'seg-1', originId: 'JFK', destinationId: 'LHR', coordinates: [[-73.78, 40.64], [-0.45, 51.47]] }]}
/>`,
    },
    {
      label: 'With connecting stop',
      code: `<FlightMap
  airports={[
    { id: 'JFK', lat: 40.64, lng: -73.78, label: 'JFK', isOrigin: true },
    { id: 'ZRH', lat: 47.46, lng: 8.56 },
    { id: 'LHR', lat: 51.47, lng: -0.45, label: 'LHR', isDestination: true },
  ]}
  paths={[
    { id: 's1', originId: 'JFK', destinationId: 'ZRH', coordinates: [[-73.78, 40.64], [8.56, 47.46]] },
    { id: 's2', originId: 'ZRH', destinationId: 'LHR', coordinates: [[8.56, 47.46], [-0.45, 51.47]] },
  ]}
/>`,
    },
  ],
};

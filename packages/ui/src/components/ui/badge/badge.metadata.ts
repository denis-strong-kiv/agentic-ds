import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Static labels, status indicators, counts, or categorical tags that are purely informational. Use on cards, table rows, and list items.',
    whenNotToUse: 'Interactive toggle actions (use Chip). Notification counts on icons (use NotificationBadge). Long sentences.',
    alternatives: ['Chip — for interactive, dismissible, or toggleable labels', 'NotificationBadge — for numeric counts overlaid on icons', 'Alert — for full-width status messages'],
    preferOver: 'Raw <span> elements with manual styling.',
  },
  behavior: {
    states: ['default'],
    interactions: ['None — Badge is purely presentational'],
  },
  accessibility: {
    role: 'status (implied) — wrap in aria-live region if content changes dynamically',
    keyboardNav: 'Not focusable — not interactive.',
    ariaAttributes: ['aria-label if the visual text alone is insufficient'],
    wcag: ['1.4.3 Contrast Minimum'],
  },
  examples: [
    {
      label: 'Status label',
      code: `<Badge variant="success">Confirmed</Badge>`,
    },
    {
      label: 'Deal tag on a card',
      code: `<Badge variant="deal">Best value</Badge>`,
    },
    {
      label: 'Destructive / warning',
      code: `<Badge variant="destructive">Cancelled</Badge>`,
    },
  ],
};

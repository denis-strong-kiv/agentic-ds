import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Overlay a count, status indicator, or icon dot on another element — notification counts on nav icons, unread message counts, booking-status dots. Always circular; designed to be positioned absolutely over a parent.',
    whenNotToUse: 'Text labels or category tags on content cards — use Badge instead. Inline status text within a sentence — use a plain styled span.',
    alternatives: ['Badge — for rectangular tag/label indicators within content flow'],
    preferOver: 'Custom absolutely-positioned count spans — NotificationBadge handles the max overflow label (e.g. "99+"), semantic aria-label, and variant colours automatically.',
    neverUseFor: 'Replacing the Badge component for non-overlay label use cases.',
  },
  behavior: {
    states: ['count mode (numeric, capped at max prop)', 'dot / icon mode (no count, renders children)', 'variants: brand, accent, success, warning, danger, neutral, inverted', 'sizes: lg (default), md'],
    interactions: ['None — purely presentational overlay indicator'],
  },
  accessibility: {
    role: 'status indicator (rendered as <span>)',
    keyboardNav: 'Not focusable.',
    ariaAttributes: [
      'aria-label auto-generated as "{count} notifications" when count prop is provided',
      'Custom aria-label prop overrides the default',
      'No aria-label when rendering children (dot/icon mode) — supply one manually if the indicator conveys meaning',
    ],
    wcag: ['1.4.1 Use of Color', '1.4.3 Contrast'],
    screenReader: 'For count badges the auto-generated aria-label announces the count. For dot badges without children, pass aria-label to convey the status to screen reader users.',
  },
  examples: [
    { label: 'Unread notification count', code: '<NotificationBadge count={5} variant="brand" />' },
    { label: 'Capped count overflow', code: '<NotificationBadge count={120} max={99} variant="danger" />' },
    { label: 'Status dot (no count)', code: '<NotificationBadge variant="success" size="md" aria-label="Online" />' },
    { label: 'Overlaid on an icon', code: `<div className="relative inline-flex">\n  <Icon icon={Bell} size="md" />\n  <NotificationBadge count={3} variant="brand" className="absolute -top-1 -end-1" />\n</div>` },
  ],
};

import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Interactive filter tags, multi-select option tags, or removable selections. Use when the user toggles or dismisses individual values.',
    whenNotToUse: 'Static informational labels (use Badge). Navigation tabs (use Tabs). Broad filter categories with a popover (use FilterChip).',
    alternatives: ['Badge — static, non-interactive labels', 'FilterChip — filter chips with popover content for the travel domain', 'Tabs — mutually exclusive navigation between views'],
    preferOver: 'Custom toggle-button implementations.',
  },
  behavior: {
    states: ['default', 'active (isActive=true)', 'disabled', 'hover', 'focus-visible'],
    interactions: ['Click to toggle active state', 'Click × to dismiss (onDismiss)', 'Enter/Space on dismiss button'],
    animations: ['Active state background transition via CSS duration-fast'],
  },
  accessibility: {
    role: 'button',
    keyboardNav: 'Tab to focus chip. Enter/Space to toggle. Tab to dismiss button, Enter/Space to dismiss.',
    ariaAttributes: ['aria-pressed (reflects isActive)', 'aria-label on dismiss button'],
    wcag: ['2.1.1 Keyboard', '4.1.2 Name Role Value'],
  },
  examples: [
    {
      label: 'Filter toggle',
      code: `<Chip label="Nonstop" isActive={filter === 'nonstop'} onClick={() => setFilter('nonstop')} />`,
    },
    {
      label: 'Dismissible selection',
      code: `<Chip label="New York" isActive onDismiss={() => removeCity('nyc')} />`,
    },
  ],
};

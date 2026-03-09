import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Filter bar chips in travel search results. Three exports for three roles: FilterChip (dropdown filter with popover), QuickFilterChip (single toggle), AllFiltersChip (opens full filter panel).',
    whenNotToUse: 'Generic toggle chips outside the filter bar context (use Chip). Static labels (use Badge).',
    alternatives: ['Chip — generic interactive chip outside filter bar context', 'FilterBar — the full filter bar that composes these chips'],
    preferOver: 'Custom filter dropdown implementations.',
  },
  behavior: {
    states: ['inactive', 'active (filled style + clear icon)', 'popover-open'],
    interactions: [
      'FilterChip: click to open/close popover; click × to clear',
      'QuickFilterChip: click to toggle; click × when active to clear; click label when active to open popover',
      'AllFiltersChip: click to toggle sidebar; shows badge count of active filters',
    ],
    animations: ['FLIP animation via data-flip-id when chips reorder on activation', 'Popover fade/slide transition'],
    responsive: 'FilterBar handles horizontal scroll; chips do not wrap.',
  },
  accessibility: {
    role: 'button',
    keyboardNav: 'Tab to focus. Enter/Space to activate. Popover traps focus when open, Escape closes.',
    ariaAttributes: ['aria-expanded on FilterChip when popover is open', 'aria-label on clear button', 'aria-pressed on QuickFilterChip'],
    wcag: ['2.1.1 Keyboard', '4.1.2 Name Role Value'],
  },
  examples: [
    {
      label: 'Dropdown filter chip',
      code: `<FilterChip
  label="Price"
  activeLabel="Up to £500"
  isActive={priceActive}
  popoverContent={<PriceRangeSlider />}
  onClear={() => clearPrice()}
/>`,
    },
    {
      label: 'Quick toggle chip',
      code: `<QuickFilterChip
  label="Nonstop only"
  isActive={nonstopOnly}
  onClick={() => setNonstopOnly(v => !v)}
  onClear={() => setNonstopOnly(false)}
/>`,
    },
    {
      label: 'All filters chip',
      code: `<AllFiltersChip activeCount={3} onClick={toggleSidebar} isActive={sidebarOpen} />`,
    },
  ],
};

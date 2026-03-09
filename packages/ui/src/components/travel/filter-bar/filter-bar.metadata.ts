import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Horizontal quick-filter strip above flight search results. Manages chip order, FLIP animation, and coordination between sidebar and inline filters.',
    whenNotToUse: 'Hotel or car filter bars (FilterPanel with mode="hotels|cars" is more appropriate). Vertical filter layouts.',
    alternatives: ['FilterPanel — full sidebar panel with all filter options', 'Chip — for standalone toggle chips outside the results page'],
  },
  behavior: {
    states: ['default', 'with-active-filters (chips reorder via FLIP)', 'sidebar-open (AllFiltersChip active)'],
    interactions: ['Chip activation reorders chips to the front using FLIP animation', 'Sidebar toggle via AllFiltersChip', 'Horizontal scroll on overflow'],
    animations: ['FLIP position animation on chip activation (useFlip hook)', 'Chip reordering is frozen while a popover is open to prevent layout jump'],
    responsive: 'Single scrollable row; no wrapping.',
  },
  accessibility: {
    role: 'toolbar (implicit via structure)',
    keyboardNav: 'Tab between chips. Each chip handles its own keyboard interaction.',
    ariaAttributes: ['aria-label="Filter results" on the bar container recommended'],
    wcag: ['2.1.1 Keyboard'],
  },
  examples: [
    {
      label: 'Full filter bar',
      code: `<FilterBar
  filters={filters}
  onChange={setFilters}
  sortBy={sortBy}
  onSortChange={setSortBy}
  sidebarOpen={sidebarOpen}
  onToggleSidebar={toggleSidebar}
  airlineOptions={airlines}
  maxPrice={2000}
/>`,
    },
  ],
};

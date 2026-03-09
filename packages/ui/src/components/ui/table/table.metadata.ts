import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Displaying structured relational data with rows and columns — booking history, fare comparison grids, itinerary breakdowns, price matrices. Use when column alignment and headers are semantically meaningful.',
    whenNotToUse: 'Layout purposes (use CSS grid/flex). Simple lists without relational columns (use a list with Cards). When data is sparse or hierarchical (use an accordion or tree view).',
    alternatives: ['Card list — for non-tabular records', 'DataGrid — for large datasets requiring virtual scrolling'],
    preferOver: 'Ad-hoc div-based grids that lack semantic table markup.',
  },
  behavior: {
    states: ['default', 'row-selected', 'row-hover', 'sort-ascending', 'sort-descending'],
    interactions: ['Click sortable TableHead to trigger onSort', 'Rows can be marked selected via the selected prop'],
    responsive: 'Wrap in ScrollArea for horizontal scrolling on narrow viewports. Table itself does not collapse — implement column hiding at the data layer if needed.',
  },
  accessibility: {
    role: 'table, rowgroup, row, columnheader, cell',
    keyboardNav: 'Native table keyboard navigation. Interactive cells (sortable headers) receive Tab focus. Enter/Space activates sort.',
    ariaAttributes: ['aria-sort="ascending|descending" on sortable TableHead', 'aria-selected on selected TableRow', 'Use TableCaption for an accessible table title'],
    wcag: ['1.3.1 Info and Relationships', '2.1.1 Keyboard', '4.1.2 Name, Role, Value'],
    screenReader: 'Always include TableHeader with TableHead cells to give screen readers column context. Provide a TableCaption for table identification.',
  },
  examples: [
    { label: 'Booking history table', code: '<Table><TableCaption>Recent bookings</TableCaption><TableHeader><TableRow><TableHead>Route</TableHead><TableHead sortable sortDirection="asc" onSort={handleSort}>Date</TableHead><TableHead>Price</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>DXB → LHR</TableCell><TableCell>12 Mar</TableCell><TableCell>$420</TableCell></TableRow></TableBody></Table>' },
    { label: 'Selected row', code: '<TableRow selected><TableCell>Selected booking</TableCell></TableRow>' },
  ],
};

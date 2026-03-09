import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Switching between distinct views of related content within the same page context — Flights/Hotels/Cars search forms, Outbound/Return legs, Details/Policy/Reviews panels. Content panels are mutually exclusive.',
    whenNotToUse: 'Navigation between separate pages/routes (use links/nav). Filtering a single list (use a filter chip group). Accordion-style expand/collapse (use Accordion).',
    alternatives: ['Accordion — for show/hide sections that can be open simultaneously', 'SegmentedControl — for very small option sets that look more like a button group'],
    preferOver: 'Custom tab implementations built from divs — Tabs provides roving tabindex, arrow key navigation, and correct ARIA roles automatically.',
  },
  behavior: {
    states: ['default', 'active', 'focused', 'disabled'],
    interactions: ['Click trigger to activate panel', 'Arrow keys navigate between triggers', 'Content panel renders only for the active tab'],
    responsive: 'TabsList supports orientation="horizontal" (default, scrollable row) and orientation="vertical" (stacked column for sidebar tabs).',
  },
  accessibility: {
    role: 'tablist (TabsList), tab (TabsTrigger), tabpanel (TabsContent)',
    keyboardNav: 'Tab moves focus into the tablist. Left/Right arrows move between tabs (horizontal). Up/Down arrows move between tabs (vertical). Home/End jump to first/last. Tab again moves into the active panel.',
    ariaAttributes: ['aria-selected on active trigger', 'aria-controls linking trigger to panel', 'aria-labelledby linking panel to trigger', 'aria-disabled on disabled triggers'],
    wcag: ['2.1.1 Keyboard', '4.1.2 Name, Role, Value', '1.3.1 Info and Relationships'],
    screenReader: 'Each TabsTrigger should have descriptive text. Use the icon prop for decorative icons — they are wrapped in a span and do not interfere with label reading.',
  },
  examples: [
    { label: 'Search form tabs', code: '<Tabs defaultValue="flights"><TabsList><TabsTrigger value="flights">Flights</TabsTrigger><TabsTrigger value="hotels">Hotels</TabsTrigger><TabsTrigger value="cars">Cars</TabsTrigger></TabsList><TabsContent value="flights"><FlightSearchForm /></TabsContent></Tabs>' },
    { label: 'Tab with badge', code: '<TabsTrigger value="alerts" badge={3}>Alerts</TabsTrigger>' },
    { label: 'Vertical tabs', code: '<TabsList orientation="vertical"><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="policy">Policy</TabsTrigger></TabsList>' },
  ],
};

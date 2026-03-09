import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Show the user\'s location within a hierarchical site structure — e.g., Home › Flights › Search Results › Booking. Use on detail pages, multi-step flows, and any page more than one level deep.',
    whenNotToUse: 'Flat single-level sites with no meaningful hierarchy. Step indicators for a sequential wizard (use a Stepper instead).',
    alternatives: ['Tabs — for sibling-level navigation', 'Back button — for simple one-level-up navigation without hierarchy context'],
    preferOver: 'Custom ordered list with manual aria-label and current-page marking.',
  },
  behavior: {
    states: ['default', 'current page (BreadcrumbPage with aria-current="page")', 'truncated with ellipsis (BreadcrumbEllipsis)'],
    interactions: ['BreadcrumbLink navigates to ancestor pages', 'BreadcrumbPage is non-interactive (aria-disabled="true")', 'BreadcrumbSeparator and BreadcrumbEllipsis are aria-hidden presentational elements'],
    responsive: 'Use BreadcrumbEllipsis to collapse middle items on narrow viewports.',
  },
  accessibility: {
    role: 'navigation (nav element with aria-label="breadcrumb")',
    keyboardNav: 'Tab through BreadcrumbLink anchors. BreadcrumbPage is not focusable (non-interactive). BreadcrumbSeparator and BreadcrumbEllipsis are hidden from tab order.',
    ariaAttributes: ['aria-label="breadcrumb" on nav wrapper', 'aria-current="page" on BreadcrumbPage (current location)', 'aria-disabled="true" on BreadcrumbPage', 'aria-hidden="true" on BreadcrumbSeparator and BreadcrumbEllipsis'],
    wcag: ['2.4.8 Location — satisfies landmark for current location', '4.1.2 Name, Role, Value'],
    screenReader: 'Screen readers announce "breadcrumb navigation" and identify the current page. Ancestor links are read as standard links.',
  },
  examples: [
    { label: 'Flight booking flow', code: '<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbLink href="/flights">Flights</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>Search Results</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>' },
    { label: 'With collapsed middle items', code: '<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>Booking</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>' },
  ],
};

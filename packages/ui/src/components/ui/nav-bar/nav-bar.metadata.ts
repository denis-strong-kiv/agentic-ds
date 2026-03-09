import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Top-level site header for the travel app. Renders brand logo/name on the left, an optional mini search-summary pill or Flights/Hotels tab switcher in the centre, and account/menu actions on the right. The search pill collapses to tabs when searchExpanded is true.',
    whenNotToUse: 'In-page section headers or sub-navigation — use a heading or NavigationMenu. Inside a modal or sheet — use a Dialog title instead.',
    alternatives: ['NavigationMenu — for a standalone top-level link bar without the travel-specific search pill'],
    preferOver: 'Custom <header> elements — NavBar provides the search pill, tab switching, support phone link, and ARIA landmark in one composable component.',
  },
  behavior: {
    states: [
      'default (logo + optional search pill + actions)',
      'with-search-pill (search summary shown, click opens search overlay)',
      'search-expanded (pill hidden, Flights/Hotels tabs shown with active indicator)',
      'custom-actions (actions prop replaces default account/menu buttons)',
    ],
    interactions: [
      'Click search pill to trigger onSearchClick (opens search overlay)',
      'Click Flights/Hotels tab to trigger onSearchTabChange',
      'Click account icon button to trigger onAccountClick',
      'Click menu icon button to trigger onMenuClick',
      'Click support phone link to initiate phone call',
    ],
    responsive: 'Three-column grid: brand (start), centre slot (mid), actions (end). Designed for fixed top placement.',
  },
  accessibility: {
    role: 'banner (role on <header> element)',
    keyboardNav: 'Tab through all interactive elements: search pill button, tab buttons, support link, account button, menu button.',
    ariaAttributes: [
      'aria-label on search pill button describes route, dates, and passenger count',
      'aria-current="page" on the active search tab button',
      'aria-label="Search type" on the tabs nav element',
      'aria-label="Account" and aria-label="Menu" on icon buttons',
      'aria-label on support phone link',
      'Decorative SVG icons are aria-hidden',
    ],
    wcag: ['2.4.1 Bypass Blocks', '1.3.6 Identify Purpose', '2.1.1 Keyboard', '1.4.3 Contrast'],
    screenReader: 'The search pill is announced as a single button with a full description of the current search. Support phone numbers are readable as link text via aria-label.',
  },
  examples: [
    { label: 'With search pill', code: '<NavBar brandName="Travelco" search={{ route: "SYD → LHR", dates: "15 Mar – 22 Mar", passengers: 2 }} onSearchClick={openSearch} />' },
    { label: 'Search expanded (tabs)', code: '<NavBar brandName="Travelco" searchExpanded activeSearchTab="flights" onSearchTabChange={setTab} />' },
    { label: 'With support phone', code: '<NavBar brandName="Travelco" supportPhone="+1 800 555 0199" onAccountClick={openAccount} onMenuClick={openMenu} />' },
    { label: 'Custom actions slot', code: '<NavBar brandName="Travelco" actions={<Button variant="primary">Sign in</Button>} />' },
  ],
};

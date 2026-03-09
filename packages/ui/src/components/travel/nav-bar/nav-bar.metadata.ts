import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Top-level page header on all travel pages. Shows brand, optional mini search pill, 24/7 support phone, account button, and hamburger menu.',
    whenNotToUse: 'In-page section headers. Mobile bottom tab bars. Sub-navigation within a page (use Tabs).',
    alternatives: ['ui/nav-bar — the generic base NavBar without travel-specific search pill', 'Tabs — for in-page tab navigation'],
    preferOver: 'Custom header implementations.',
  },
  behavior: {
    states: ['default', 'with-search-pill (search prop provided)', 'scrolled (consumer manages)'],
    interactions: ['Search pill click triggers onSearchClick', 'Account button triggers onAccountClick', 'Menu button triggers onMenuClick'],
    responsive: 'Search pill collapses or hides on narrow viewports (CSS contract handles).',
  },
  accessibility: {
    role: 'banner',
    keyboardNav: 'Tab through brand, search pill, support link, account button, menu button.',
    ariaAttributes: ['role="banner"', 'aria-label="Account" on account button', 'aria-label="Menu" on menu button', 'aria-label on support phone link'],
    wcag: ['2.1.1 Keyboard', '2.4.1 Bypass Blocks — pair with SkipLink'],
    screenReader: 'Always pair with a SkipLink at the top of the page (WCAG 2.4.1).',
  },
  examples: [
    {
      label: 'With search pill',
      code: `<NavBar
  brandName="TravelCo"
  search={{ route: 'NYC → LON', dates: '12–19 Mar', passengers: 2 }}
  onSearchClick={openSearchOverlay}
  supportPhone="+1 800 123 4567"
  onAccountClick={openAccount}
  onMenuClick={openMenu}
/>`,
    },
    {
      label: 'Brand only',
      code: `<NavBar brandName="TravelCo" onAccountClick={openAccount} onMenuClick={openMenu} />`,
    },
  ],
};

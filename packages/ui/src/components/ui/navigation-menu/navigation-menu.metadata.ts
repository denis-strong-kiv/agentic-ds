import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Top-level horizontal site navigation with dropdown content panels. Use when nav items need rich flyout content (mega-menus, grouped links, descriptions) rather than simple flat links.',
    whenNotToUse: 'Simple flat link bars with no dropdown content — plain anchor elements or a link list are sufficient. Mobile hamburger menus — use a Sheet or Dialog instead. Contextual action menus triggered by a specific element — use DropdownMenu.',
    alternatives: ['DropdownMenu — for action menus attached to a single trigger', 'NavBar — for the travel app header which includes search pill and brand identity'],
    preferOver: 'Custom hover menus — NavigationMenu uses Radix primitives for focus management, ARIA, and keyboard navigation automatically.',
  },
  behavior: {
    states: ['closed', 'item-active (trigger open, viewport visible)', 'item-highlighted'],
    interactions: [
      'Click or hover NavigationMenuTrigger to show Content in the Viewport',
      'Click NavigationMenuLink to navigate',
      'ArrowLeft / ArrowRight to move between top-level triggers',
      'Escape to close open content panel',
      'Tab to move through interactive elements',
    ],
    animations: ['Viewport scales in/out on open/close (Radix data-state transitions)', 'ChevronDown indicator rotates when trigger is active'],
  },
  accessibility: {
    role: 'navigation (Root renders <nav>), menubar (List), menuitem (Item/Trigger)',
    keyboardNav: 'Tab to reach the nav. Arrow keys move between triggers. Enter/Space opens a trigger. Escape closes. Tab through content links while panel is open.',
    ariaAttributes: [
      'aria-expanded on Trigger reflects open state',
      'aria-controls links Trigger to its Content panel',
      'ChevronDown icon is decorative (aria-hidden via Icon component default)',
    ],
    wcag: ['2.1.1 Keyboard', '4.1.2 Name, Role, Value', '2.4.3 Focus Order'],
    screenReader: 'Each trigger label is announced. The chevron icon is hidden from screen readers. Use descriptive text in NavigationMenuTrigger children.',
  },
  examples: [
    { label: 'Basic nav with dropdown', code: `<NavigationMenu>\n  <NavigationMenuList>\n    <NavigationMenuItem>\n      <NavigationMenuTrigger>Flights</NavigationMenuTrigger>\n      <NavigationMenuContent>\n        <NavigationMenuLink href="/flights/search">Search flights</NavigationMenuLink>\n        <NavigationMenuLink href="/flights/deals">Deals</NavigationMenuLink>\n      </NavigationMenuContent>\n    </NavigationMenuItem>\n  </NavigationMenuList>\n</NavigationMenu>` },
    { label: 'Plain link item (no dropdown)', code: '<NavigationMenuItem><NavigationMenuLink href="/help">Help</NavigationMenuLink></NavigationMenuItem>' },
  ],
};

import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Full-screen modal overlay triggered from the NavBar search pill or a "Edit search" button on results pages. Wraps a SearchForm (or any children) in a focus-trapped, scroll-locked dialog.',
    whenNotToUse: 'Inline search forms embedded directly in a page layout — only use this when search needs to cover the full viewport. Do not use for non-search dialogs; prefer ui/Dialog for general-purpose modals.',
    alternatives: ['ui/Dialog — for general modal dialogs with Radix-managed focus trap and portal', 'ui/Drawer — for bottom-sheet panels on mobile'],
    preferOver: 'Custom overlay implementations that must manually wire focus trapping, body scroll lock, and Escape key handling.',
  },
  behavior: {
    states: [
      'isOpen=true, not exiting — overlay visible with entry state classes',
      'isOpen=false, isExiting=true — overlay visible with "travel-search-overlay--exiting" class for exit animation (EXIT_DURATION currently 0ms)',
      'isOpen=false, not exiting — component returns null, fully unmounted',
    ],
    interactions: [
      'Clicking the backdrop (outer overlay div) fires onClose',
      'Clicking inside the panel stops propagation — does not close the overlay',
      'Escape key fires onClose',
      'Focus is moved to the first focusable element inside the panel on open',
      'Tab/Shift+Tab wrap within the panel (focus trap)',
      'Body scroll is locked (overflow: hidden) while the overlay is visible',
    ],
    animations: [
      'Entry/exit CSS class toggling via travel-search-overlay--exiting; consumers control the animation in CSS',
    ],
    responsive: 'Full-viewport overlay. Panel width and height are controlled by CSS classes.',
  },
  accessibility: {
    role: 'dialog',
    keyboardNav: 'Focus moves to first focusable element on open. Tab/Shift+Tab are trapped within the panel. Escape closes the overlay.',
    ariaAttributes: [
      'role="dialog" on overlay container',
      'aria-modal="true" on overlay container',
      'aria-label="Edit search" on overlay container',
    ],
    wcag: ['2.1.1 Keyboard', '2.1.2 No Keyboard Trap (focus is trapped intentionally while modal is open)', '3.2.2 On Input'],
    screenReader: 'Screen readers announce the dialog role and "Edit search" label on open. Focus is programmatically moved to the first interactive child. Backdrop click and Escape provide consistent dismiss mechanisms.',
  },
  examples: [
    {
      label: 'Wrapping a SearchForm inside the overlay',
      code: `<SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)}>
  <SearchForm onSearch={(params) => { runSearch(params); setSearchOpen(false); }} />
</SearchOverlay>`,
    },
  ],
};

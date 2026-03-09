import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Any user-triggered action: form submission, navigation trigger, dialog open/close, data mutation. Use when the action has immediate consequence.',
    whenNotToUse: 'Pure navigation between pages — use an <a> tag or Next.js <Link> instead. Decorative or non-interactive elements.',
    alternatives: ['Link (variant="link") for inline text actions', 'IconButton (size="icon") for icon-only actions', 'DropdownMenu trigger for multi-action menus'],
    preferOver: 'Raw <button> elements — Button handles focus styles, disabled states, loading, and ARIA automatically.',
    neverUseFor: 'Decorative shapes, layout containers, or non-interactive visual elements.',
  },
  behavior: {
    states: ['default', 'hover', 'active', 'focus-visible', 'disabled', 'loading'],
    interactions: ['click', 'Enter to activate', 'Space to activate'],
    animations: ['Loading spinner fades in; button width locks to prevent layout shift'],
    responsive: 'Intrinsic width by default; apply w-full or travel-flight-card-select-btn for full-width contexts.',
  },
  accessibility: {
    role: 'button',
    keyboardNav: 'Tab to focus, Enter or Space to activate. Disabled state removes from tab order via aria-disabled.',
    ariaAttributes: ['aria-disabled (when disabled or loading)', 'aria-busy (when isLoading=true)', 'type="button" prevents accidental form submission'],
    wcag: ['2.1.1 Keyboard', '1.4.3 Contrast Minimum', '4.1.2 Name Role Value'],
  },
  examples: [
    {
      label: 'Primary action',
      code: `<Button variant="primary">Book flight</Button>`,
    },
    {
      label: 'Loading state',
      code: `<Button variant="primary" isLoading>Processing...</Button>`,
    },
    {
      label: 'Destructive with confirmation',
      code: `<Button variant="destructive" onClick={handleDelete}>Cancel booking</Button>`,
    },
    {
      label: 'Icon-only',
      code: `<Button size="icon" variant="ghost" aria-label="Close"><X size={16} /></Button>`,
    },
  ],
};

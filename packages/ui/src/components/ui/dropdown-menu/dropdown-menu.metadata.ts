import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Contextual action menus triggered by a button — "more options", account menus, sort controls, bulk-action overflow menus. Supports plain items, checkbox items (multi-select state), radio items (single-select state), sub-menus, labels, and separators.',
    whenNotToUse: 'Primary navigation between pages — use NavigationMenu. Selecting a single value from a list — use Select or Combobox. Confirming a destructive action — use AlertDialog.',
    alternatives: ['Select — for single-value form field selection', 'ContextMenu — for right-click / long-press triggered menus', 'NavigationMenu — for top-level site navigation'],
    preferOver: 'Custom absolutely-positioned lists — this uses Radix DropdownMenu which handles focus trap, portal, collision detection, and ARIA automatically.',
  },
  behavior: {
    states: ['closed', 'open', 'item-highlighted', 'item-disabled', 'checkbox-item-checked', 'radio-item-checked', 'sub-menu-open'],
    interactions: [
      'Click trigger to open menu',
      'ArrowDown / ArrowUp to move focus between items',
      'Enter or Space to activate focused item',
      'ArrowRight to open a sub-menu from SubTrigger',
      'Escape or click outside to close',
      'Tab closes the menu',
    ],
    animations: ['Radix data-state enter/exit animations on Content'],
  },
  accessibility: {
    role: 'menu (Content), menuitem (Item), menuitemcheckbox (CheckboxItem), menuitemradio (RadioItem)',
    keyboardNav: 'Tab / Shift-Tab to reach trigger. Enter/Space to open. Arrow keys navigate items. ArrowRight opens sub-menu. Escape closes.',
    ariaAttributes: [
      'aria-expanded on trigger reflects open state (managed by Radix)',
      'aria-checked on CheckboxItem',
      'aria-checked on RadioItem within RadioGroup',
      'aria-disabled on disabled items',
      'aria-haspopup="menu" on SubTrigger',
      'Keyboard shortcut spans use aria-hidden — visual only',
    ],
    wcag: ['2.1.1 Keyboard', '1.3.1 Info and Relationships', '4.1.2 Name, Role, Value'],
    screenReader: 'Item labels are read from children text. Use DropdownMenuLabel to announce group names. Provide descriptive text on the trigger button.',
  },
  examples: [
    { label: 'Basic action menu', code: `<DropdownMenu>\n  <DropdownMenuTrigger asChild><Button variant="ghost">Options</Button></DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>View booking</DropdownMenuItem>\n    <DropdownMenuItem>Download receipt</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem>Cancel booking</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>` },
    { label: 'With icon and shortcut', code: '<DropdownMenuItem icon={<Icon icon={Download} size="sm" />} shortcut="⌘D">Download</DropdownMenuItem>' },
    { label: 'Checkbox items', code: `<DropdownMenuCheckboxItem checked={showPrices} onCheckedChange={setShowPrices}>Show prices</DropdownMenuCheckboxItem>` },
  ],
};

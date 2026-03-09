import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Immediately applied binary settings — notifications on/off, dark mode, flexible dates, direct booking, search alerts. Effect takes place without a submit action.',
    whenNotToUse: 'Form choices that require confirmation before saving (use Checkbox + submit). Mutually exclusive options in a group (use RadioGroup).',
    alternatives: ['Checkbox — when the action requires a form submit to take effect', 'RadioGroup — for selecting one option from a set'],
    preferOver: 'Custom toggle buttons built from scratch — Switch provides built-in ARIA role, keyboard activation, and checked state.',
  },
  behavior: {
    states: ['unchecked', 'checked', 'disabled', 'focused'],
    interactions: ['Click to toggle', 'Space to toggle when focused'],
    animations: ['Thumb slides horizontally between unchecked and checked positions'],
    responsive: 'Inline element. Label position is configurable via labelPosition="left"|"right" (default right). Wraps in a <label> for click-to-toggle on the label text.',
  },
  accessibility: {
    role: 'switch',
    keyboardNav: 'Tab to focus. Space to toggle checked state.',
    ariaAttributes: ['aria-checked (true/false)', 'aria-disabled when disabled'],
    wcag: ['2.1.1 Keyboard', '4.1.2 Name, Role, Value', '1.4.3 Contrast'],
    screenReader: 'Provide a label via the label prop or wrap with an external <label>. The role="switch" communicates on/off semantics to screen readers.',
  },
  examples: [
    { label: 'Flexible dates toggle', code: '<Switch label="Flexible dates" defaultChecked={false} onCheckedChange={setFlexible} />' },
    { label: 'Label on left', code: '<Switch label="Receive price alerts" labelPosition="left" />' },
    { label: 'Controlled', code: '<Switch checked={notifications} onCheckedChange={setNotifications} label="Notifications" />' },
  ],
};

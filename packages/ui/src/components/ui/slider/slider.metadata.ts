import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Selecting a numeric value or range within a continuous spectrum — price range filters, budget sliders, distance radius, rating threshold. Supports single-thumb and dual-thumb (range) modes via the value/defaultValue array length.',
    whenNotToUse: 'Discrete enumerated choices (use RadioGroup or Select). When users need to type an exact number (use a numeric Input). Accessibility-critical forms where precise input is required (combine with a paired number input).',
    alternatives: ['Input type="number" — for precise numeric entry', 'RadioGroup — for discrete step choices'],
    preferOver: 'Native <input type="range"> — provides accessible thumb labels and custom formatting via formatValue.',
  },
  behavior: {
    states: ['default', 'focused', 'dragging', 'disabled'],
    interactions: ['Drag thumb to change value', 'Click on track to jump to value', 'Arrow keys to increment/decrement by step'],
    animations: ['Thumb scales on focus/drag'],
    responsive: 'Full-width by default, constrained by its container. Value labels render above the track when showValue is true.',
  },
  accessibility: {
    role: 'slider (each thumb)',
    keyboardNav: 'Tab focuses first thumb. Arrow keys change value by step. Page Up/Down change by larger increment. Home/End jump to min/max.',
    ariaAttributes: ['aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-label on each thumb (auto-set to "Minimum"/"Maximum" for range sliders)', 'aria-disabled when disabled'],
    wcag: ['2.1.1 Keyboard', '1.4.3 Contrast', '4.1.2 Name, Role, Value'],
    screenReader: 'Always provide aria-label on the root or rely on the auto-labelled thumbs. Use formatValue to render human-readable value announcements (e.g., "$200" instead of "200").',
  },
  examples: [
    { label: 'Price range filter', code: '<Slider defaultValue={[50, 500]} min={0} max={1000} step={10} showValue formatValue={(v) => `$${v}`} aria-label="Price range" />' },
    { label: 'Single value', code: '<Slider defaultValue={[3]} min={1} max={5} step={1} showValue aria-label="Star rating minimum" />' },
  ],
};

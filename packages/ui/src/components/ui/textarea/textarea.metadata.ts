import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Multi-line freeform text input — special requests, booking notes, travel itinerary descriptions, contact messages, review submissions. Use when the expected input is longer than a single line.',
    whenNotToUse: 'Single-line inputs like name, email, or search (use Input). Structured data entry with known format (use separate Input fields). Rich text with formatting (use a rich text editor).',
    alternatives: ['Input — for single-line text', 'RichTextEditor — for formatted content creation'],
    preferOver: 'Native <textarea> — provides integrated error display, character counter, and auto-resize behavior.',
  },
  behavior: {
    states: ['default', 'focused', 'error', 'disabled', 'read-only'],
    interactions: ['Type to enter text', 'Character count updates live when showCount and maxLength are provided', 'Height grows automatically when autoResize is true'],
    animations: ['Height transition when autoResize adjusts to content'],
    responsive: 'Full-width by default, constrained by its container. autoResize eliminates fixed-height scrolling on short content.',
  },
  accessibility: {
    role: 'textbox (multiline)',
    keyboardNav: 'Tab to focus. All standard text editing keyboard shortcuts apply.',
    ariaAttributes: ['aria-invalid={true} when error prop is set', 'aria-describedby linking to the error message element', 'aria-required if field is required'],
    wcag: ['1.3.1 Info and Relationships', '3.3.1 Error Identification', '3.3.3 Error Suggestion', '1.4.3 Contrast'],
    screenReader: 'Always pair with a visible <label> referencing the textarea id. Error messages are rendered in a role="alert" element so they are announced immediately.',
  },
  examples: [
    { label: 'Special requests with character limit', code: '<Textarea id="requests" placeholder="Any special requests?" maxLength={500} showCount />' },
    { label: 'With validation error', code: '<Textarea id="notes" error="Notes cannot exceed 500 characters." maxLength={500} />' },
    { label: 'Auto-resizing', code: '<Textarea placeholder="Describe your itinerary…" autoResize />' },
  ],
};

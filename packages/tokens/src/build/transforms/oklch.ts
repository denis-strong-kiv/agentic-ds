// ─── Style Dictionary OKLCH Transform ─────────────────────────────────────────
// Transforms OKLCHColor objects in token values to CSS oklch() strings.

import type { Transform } from 'style-dictionary/types';
import { oklchToCSS } from '../../oklch/utils.js';

/**
 * Detect if a token value is an OKLCHColor object (has lightness, chroma, hue).
 */
function isOKLCHColor(value: unknown): value is { lightness: number; chroma: number; hue: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'lightness' in value &&
    'chroma' in value &&
    'hue' in value
  );
}

export const oklchTransform: Transform = {
  name: 'color/oklch',
  type: 'value',
  filter: (token) => token.type === 'color' && isOKLCHColor(token.value),
  transform: (token) => {
    if (isOKLCHColor(token.value)) {
      return oklchToCSS(token.value);
    }
    return token.value as string;
  },
};

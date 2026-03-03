// ─── React Native Token Format ────────────────────────────────────────────────
// Generates a TypeScript module exporting tokens as a flat JS object.
// Uses hex fallbacks for colors since React Native does not support oklch().

import type { Format } from 'style-dictionary/types';
import { oklchToHex } from '../../oklch/utils.js';

function isOKLCHColor(value: unknown): value is { lightness: number; chroma: number; hue: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'lightness' in value &&
    'chroma' in value &&
    'hue' in value
  );
}

export const reactNativeFormat: Format = {
  name: 'typescript/react-native',
  format: ({ dictionary }) => {
    const entries = dictionary.allTokens.map((token) => {
      const value = isOKLCHColor(token.value)
        ? oklchToHex(token.value)
        : String(token.value);
      return `  '${token.name}': ${JSON.stringify(value)},`;
    });

    return [
      '// Auto-generated — do not edit manually',
      'export const tokens = {',
      ...entries,
      '} as const;',
      '',
      'export type TokenName = keyof typeof tokens;',
      '',
    ].join('\n');
  },
};

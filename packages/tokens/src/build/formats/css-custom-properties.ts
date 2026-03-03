// ─── CSS Custom Properties Format ─────────────────────────────────────────────
// Generates :root and .dark CSS blocks with all resolved tokens as CSS vars.

import type { Format } from 'style-dictionary/types';

export const cssCustomPropertiesFormat: Format = {
  name: 'css/custom-properties',
  format: ({ dictionary, options }) => {
    const selector = options?.['selector'] ?? ':root';
    const tokens = dictionary.allTokens
      .map((token) => `  --${token.name}: ${token.value};`)
      .join('\n');

    return `${selector} {\n${tokens}\n}\n`;
  },
};

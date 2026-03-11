// ─── CSS Custom Properties Format ─────────────────────────────────────────────
// Generates :root and .dark CSS blocks with primitives + semantic tokens as CSS vars.
// Component-level tokens are excluded (see filter-component-tokens.ts).

import type { Format } from 'style-dictionary/types';
import { filterCssTokens, toCssValue } from './filter-component-tokens.js';

export const cssCustomPropertiesFormat: Format = {
  name: 'css/custom-properties',
  format: ({ dictionary, options }) => {
    const selector = options?.['selector'] ?? ':root';
    const tokens = filterCssTokens(dictionary.allTokens)
      .map((token) => `  --${token.name}: ${toCssValue(token.value)};`)
      .join('\n');

    return `${selector} {\n${tokens}\n}\n`;
  },
};

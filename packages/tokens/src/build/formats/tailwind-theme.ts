// ─── Tailwind v4 @theme Format ────────────────────────────────────────────────
// Generates a CSS @theme block consumable by Tailwind CSS v4.

import type { Format } from 'style-dictionary/types';

export const tailwindThemeFormat: Format = {
  name: 'css/tailwind-theme',
  format: ({ dictionary }) => {
    const vars = dictionary.allTokens
      .map((token) => `  --${token.name}: ${token.value};`)
      .join('\n');

    return `@theme {\n${vars}\n}\n`;
  },
};

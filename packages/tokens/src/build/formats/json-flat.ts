// ─── Flat JSON Format ─────────────────────────────────────────────────────────
// Generates a flat JSON object: { "token-name": "value" }
// Used by the runtime brand resolution API.

import type { Format } from 'style-dictionary/types';

export const jsonFlatFormat: Format = {
  name: 'json/flat',
  format: ({ dictionary }) => {
    const obj: Record<string, string> = {};
    for (const token of dictionary.allTokens) {
      obj[token.name] = String(token.value);
    }
    return JSON.stringify(obj, null, 2) + '\n';
  },
};

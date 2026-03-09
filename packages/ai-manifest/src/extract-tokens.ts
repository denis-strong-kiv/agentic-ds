/**
 * extract-tokens.ts
 * Extracts all design tokens from packages/tokens/src/output/tokens.css
 * and returns a TokenManifest.
 */

import { resolve } from 'path';
import { buildTokenManifest } from './lib/token-parser.js';
import type { TokenManifest } from './types.js';

const TOKENS_CSS = resolve(
  new URL('.', import.meta.url).pathname,
  '../../tokens/src/output/tokens.css',
);

export function extractTokens(): TokenManifest {
  return buildTokenManifest(TOKENS_CSS);
}

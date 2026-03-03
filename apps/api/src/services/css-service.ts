// ─── CSS Generation Service ───────────────────────────────────────────────────
// Generates complete CSS custom properties blocks for brands, including fonts.

import { generateTokenStore, tokenStoreToCss } from '@travel/tokens';
import type { BrandConfig, ColorMode } from '@travel/tokens';

/**
 * Generate a complete CSS block for a brand + mode.
 * Includes all three token tiers resolved to final CSS values.
 * Output is consumable by Tailwind v4 @theme without modification.
 */
export function generateFullBrandCSS(brand: BrandConfig, mode: ColorMode): string {
  const store = generateTokenStore(brand, mode);

  // Add Tailwind v4 @theme override vars
  const tailwindVars = Object.entries(store)
    .filter(([k]) => k.startsWith('--color-') || k.startsWith('--shape-'))
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const rootCSS = tokenStoreToCss(store, `:root[data-brand="${brand.id}"][data-mode="${mode}"]`);

  const tailwindOverride = `@layer base {\n  :root[data-brand="${brand.id}"][data-mode="${mode}"] {\n${tailwindVars}\n  }\n}`;

  return [rootCSS, tailwindOverride].join('\n');
}

/** Serialize a token store to a JSON response-ready flat map. */
export function getBrandTokensJSON(
  brand: BrandConfig,
  mode: ColorMode,
): Record<string, string> {
  return generateTokenStore(brand, mode);
}

// ─── Token Service ────────────────────────────────────────────────────────────
// Loads semantic/component definitions, applies brand overrides, resolves all tiers.

import { generateTokenStore, tokenStoreToCss } from '@travel/tokens';
import type { BrandConfig, ColorMode, TokenStore } from '@travel/tokens';
import type { Env } from './brand-service.js';
import { getBrand } from './brand-service.js';

const KV_TTL = 300; // seconds

function kvKey(brandId: string, mode: ColorMode): string {
  return `brand:${brandId}:${mode}:tokens`;
}

// ─── CSS generation ───────────────────────────────────────────────────────────

/** Generate full CSS custom properties string for a brand + mode. */
export function generateBrandCSS(brand: BrandConfig, mode: ColorMode): string {
  const store = generateTokenStore(brand, mode);
  // Inject into :root selector scoped to brand + mode for isolation
  return tokenStoreToCss(store, `:root[data-brand="${brand.id}"][data-mode="${mode}"]`);
}

/** Generate CSS for both light and dark modes. */
export function generateBrandCSSBothModes(brand: BrandConfig): { light: string; dark: string } {
  return {
    light: generateBrandCSS(brand, 'light'),
    dark: generateBrandCSS(brand, 'dark'),
  };
}

// ─── Token resolution ─────────────────────────────────────────────────────────

/** Resolve all semantic + component tokens for a brand + mode as a flat map. */
export function getResolvedTokens(brand: BrandConfig, mode: ColorMode): TokenStore {
  return generateTokenStore(brand, mode);
}

// ─── Cascade: seed change → full regeneration ─────────────────────────────────

/** Re-derive all tokens after a seed/config change and update KV + D1 cache. */
export async function regenerateBrandTokens(brand: BrandConfig, env: Env): Promise<void> {
  for (const mode of ['light', 'dark'] as const) {
    const store = generateTokenStore(brand, mode);
    const css = tokenStoreToCss(store, `:root[data-brand="${brand.id}"][data-mode="${mode}"]`);
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO brand_tokens_cache (brand_id, mode, tokens_json, css_string, generated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (brand_id, mode) DO UPDATE SET
         tokens_json = excluded.tokens_json,
         css_string = excluded.css_string,
         generated_at = excluded.generated_at`,
    )
      .bind(brand.id, mode, JSON.stringify(store), css, now)
      .run();

    await env.KV.put(kvKey(brand.id, mode), css, { expirationTtl: KV_TTL });
  }
}

// ─── Resolution with KV caching ──────────────────────────────────────────────

/** Serve resolved CSS for a brand + mode, using KV cache when available. */
export async function serveBrandCSS(
  brandId: string,
  mode: ColorMode,
  env: Env,
): Promise<{ css: string; cacheHit: boolean } | null> {
  // Try KV first
  const cached = await env.KV.get(kvKey(brandId, mode));
  if (cached) {
    return { css: cached, cacheHit: true };
  }

  // Try D1 cache
  const row = await env.DB.prepare(
    'SELECT css_string FROM brand_tokens_cache WHERE brand_id = ? AND mode = ?',
  )
    .bind(brandId, mode)
    .first<{ css_string: string }>();

  if (row) {
    // Repopulate KV
    await env.KV.put(kvKey(brandId, mode), row.css_string, { expirationTtl: KV_TTL });
    return { css: row.css_string, cacheHit: false };
  }

  // Regenerate from brand config
  const brand = await getBrand(brandId, env);
  if (!brand) return null;

  const store = generateTokenStore(brand, mode);
  const css = tokenStoreToCss(store, `:root[data-brand="${brandId}"][data-mode="${mode}"]`);
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO brand_tokens_cache (brand_id, mode, tokens_json, css_string, generated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (brand_id, mode) DO UPDATE SET
       tokens_json = excluded.tokens_json,
       css_string = excluded.css_string,
       generated_at = excluded.generated_at`,
  )
    .bind(brandId, mode, JSON.stringify(store), css, now)
    .run();

  await env.KV.put(kvKey(brandId, mode), css, { expirationTtl: KV_TTL });
  return { css, cacheHit: false };
}

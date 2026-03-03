// ─── Brand Service ────────────────────────────────────────────────────────────
// Handles brand CRUD, palette derivation, and cache management.

import { generateTokenStore, tokenStoreToCss } from '@travel/tokens';
import type { BrandConfig, NeutralTemperature, SemanticTemperature, Shape } from '@travel/tokens';

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  BUCKET: R2Bucket;
}

interface BrandRow {
  id: string;
  display_name: string;
  primary_l: number;
  primary_c: number;
  primary_h: number;
  accent_l: number;
  accent_c: number;
  accent_h: number;
  neutral_temperature: NeutralTemperature;
  semantic_temperature: SemanticTemperature;
  shape: Shape;
  font_display: string;
  font_heading: string;
  font_body: string;
  overrides_json: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToBrandConfig(row: BrandRow): BrandConfig {
  return {
    id: row.id,
    displayName: row.display_name,
    primarySeed: { lightness: row.primary_l, chroma: row.primary_c, hue: row.primary_h },
    accentSeed: { lightness: row.accent_l, chroma: row.accent_c, hue: row.accent_h },
    neutralTemperature: row.neutral_temperature,
    semanticTemperature: row.semantic_temperature,
    shape: row.shape,
    fonts: {
      display: row.font_display,
      heading: row.font_heading,
      body: row.font_body,
    },
    overrides: row.overrides_json ? JSON.parse(row.overrides_json) : undefined,
  };
}

function kvKey(brandId: string, mode: 'light' | 'dark'): string {
  return `brand:${brandId}:${mode}:tokens`;
}

// ─── Token generation + caching ───────────────────────────────────────────────

async function generateAndCacheBrandTokens(brand: BrandConfig, env: Env): Promise<void> {
  for (const mode of ['light', 'dark'] as const) {
    const store = generateTokenStore(brand, mode);
    const css = tokenStoreToCss(store, `:root[data-brand="${brand.id}"][data-mode="${mode}"]`);
    const tokensJson = JSON.stringify(store);
    const now = new Date().toISOString();

    // Store in D1 cache table
    await env.DB.prepare(
      `INSERT INTO brand_tokens_cache (brand_id, mode, tokens_json, css_string, generated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (brand_id, mode) DO UPDATE SET
         tokens_json = excluded.tokens_json,
         css_string = excluded.css_string,
         generated_at = excluded.generated_at`,
    )
      .bind(brand.id, mode, tokensJson, css, now)
      .run();

    // Populate KV with 300s TTL
    await env.KV.put(kvKey(brand.id, mode), css, { expirationTtl: 300 });
  }
}

async function invalidateBrandCache(brandId: string, env: Env): Promise<void> {
  await Promise.all([
    env.KV.delete(kvKey(brandId, 'light')),
    env.KV.delete(kvKey(brandId, 'dark')),
  ]);
}

// ─── CRUD operations ──────────────────────────────────────────────────────────

export async function registerBrand(config: BrandConfig, env: Env): Promise<BrandConfig> {
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO brands (
      id, display_name,
      primary_l, primary_c, primary_h,
      accent_l, accent_c, accent_h,
      neutral_temperature, semantic_temperature, shape,
      font_display, font_heading, font_body,
      overrides_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      config.id,
      config.displayName,
      config.primarySeed.lightness,
      config.primarySeed.chroma,
      config.primarySeed.hue,
      config.accentSeed.lightness,
      config.accentSeed.chroma,
      config.accentSeed.hue,
      config.neutralTemperature,
      config.semanticTemperature,
      config.shape,
      config.fonts.display,
      config.fonts.heading,
      config.fonts.body,
      config.overrides ? JSON.stringify(config.overrides) : null,
      now,
      now,
    )
    .run();

  await generateAndCacheBrandTokens(config, env);
  return config;
}

export async function getBrand(id: string, env: Env): Promise<BrandConfig | null> {
  const row = await env.DB.prepare('SELECT * FROM brands WHERE id = ?')
    .bind(id)
    .first<BrandRow>();
  if (!row) return null;
  return rowToBrandConfig(row);
}

export async function updateBrand(
  id: string,
  updates: Partial<Omit<BrandConfig, 'id'>>,
  env: Env,
): Promise<BrandConfig> {
  const existing = await getBrand(id, env);
  if (!existing) throw new Error(`Brand "${id}" not found`);

  const merged: BrandConfig = {
    ...existing,
    ...updates,
    id,
    primarySeed: updates.primarySeed ?? existing.primarySeed,
    accentSeed: updates.accentSeed ?? existing.accentSeed,
    fonts: updates.fonts ?? existing.fonts,
    overrides: updates.overrides ?? existing.overrides,
  };

  const now = new Date().toISOString();

  await env.DB.prepare(
    `UPDATE brands SET
      display_name = ?, primary_l = ?, primary_c = ?, primary_h = ?,
      accent_l = ?, accent_c = ?, accent_h = ?,
      neutral_temperature = ?, semantic_temperature = ?, shape = ?,
      font_display = ?, font_heading = ?, font_body = ?,
      overrides_json = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(
      merged.displayName,
      merged.primarySeed.lightness,
      merged.primarySeed.chroma,
      merged.primarySeed.hue,
      merged.accentSeed.lightness,
      merged.accentSeed.chroma,
      merged.accentSeed.hue,
      merged.neutralTemperature,
      merged.semanticTemperature,
      merged.shape,
      merged.fonts.display,
      merged.fonts.heading,
      merged.fonts.body,
      merged.overrides ? JSON.stringify(merged.overrides) : null,
      now,
      id,
    )
    .run();

  await invalidateBrandCache(id, env);
  await generateAndCacheBrandTokens(merged, env);
  return merged;
}

export async function listBrands(
  page: number,
  limit: number,
  env: Env,
): Promise<PaginatedResult<BrandConfig>> {
  const offset = (page - 1) * limit;

  const [countResult, rowsResult] = await env.DB.batch([
    env.DB.prepare('SELECT COUNT(*) as count FROM brands'),
    env.DB.prepare('SELECT * FROM brands ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(limit, offset),
  ]);

  const total = (countResult.results[0] as { count: number }).count;
  const rows = rowsResult.results as BrandRow[];

  return {
    data: rows.map(rowToBrandConfig),
    total,
    page,
    limit,
  };
}

export async function deleteBrand(id: string, env: Env): Promise<void> {
  const { meta } = await env.DB.prepare('DELETE FROM brands WHERE id = ?').bind(id).run();
  if (meta.changes === 0) throw new Error(`Brand "${id}" not found`);
  await invalidateBrandCache(id, env);
}

// ─── Schema initialization ────────────────────────────────────────────────────

export async function initBrandSchema(env: Env): Promise<void> {
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      primary_l REAL NOT NULL,
      primary_c REAL NOT NULL,
      primary_h REAL NOT NULL,
      accent_l REAL NOT NULL,
      accent_c REAL NOT NULL,
      accent_h REAL NOT NULL,
      neutral_temperature TEXT NOT NULL,
      semantic_temperature TEXT NOT NULL,
      shape TEXT NOT NULL,
      font_display TEXT NOT NULL,
      font_heading TEXT NOT NULL,
      font_body TEXT NOT NULL,
      overrides_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS brand_tokens_cache (
      brand_id TEXT NOT NULL,
      mode TEXT NOT NULL,
      tokens_json TEXT NOT NULL,
      css_string TEXT NOT NULL,
      generated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (brand_id, mode),
      FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE CASCADE
    )`),
  ]);
}

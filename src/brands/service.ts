import type {
  Brand,
  BrandInput,
  BrandPatch,
  ColorScale,
  FieldError,
  Primitives,
} from '../types';
import { generateColorScale } from '../color/oklch';

// ─── Internal DB row type ─────────────────────────────────────────────────────

interface BrandRow {
  id: string;
  display_name: string;
  seed_l: number;
  seed_c: number;
  seed_h: number;
  font_display: string;
  font_heading: string;
  font_body: string;
  primitives: string | null;
  color_scale: string;
  valid_status: string;
  created_at: string;
  updated_at: string;
}

function rowToBrand(row: BrandRow): Brand {
  return {
    id: row.id,
    displayName: row.display_name,
    seedColor: { l: row.seed_l, c: row.seed_c, h: row.seed_h },
    fonts: {
      display: row.font_display,
      heading: row.font_heading,
      body: row.font_body,
    },
    primitives: row.primitives ? (JSON.parse(row.primitives) as Primitives) : null,
    colorScale: JSON.parse(row.color_scale) as {
      light: ColorScale;
      dark: ColorScale;
    },
    validStatus: row.valid_status as Brand['validStatus'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Input validation ─────────────────────────────────────────────────────────

const ID_RE = /^[a-z0-9-]{1,64}$/;

export function validateBrandInput(input: Record<string, unknown>): FieldError[] {
  const errors: FieldError[] = [];

  if (typeof input.id !== 'string' || !ID_RE.test(input.id)) {
    errors.push({ field: 'id', message: 'Must match [a-z0-9-], 1–64 chars' });
  }
  if (
    typeof input.displayName !== 'string' ||
    input.displayName.trim().length === 0 ||
    input.displayName.length > 128
  ) {
    errors.push({ field: 'displayName', message: 'Required; 1–128 chars' });
  }

  const seed = input.seedColor as Record<string, unknown> | undefined;
  if (!seed || typeof seed !== 'object') {
    errors.push({ field: 'seedColor', message: 'Required object' });
  } else {
    if (typeof seed.l !== 'number' || seed.l < 0 || seed.l > 1) {
      errors.push({ field: 'seedColor.l', message: 'Must be between 0 and 1' });
    }
    if (typeof seed.c !== 'number' || seed.c < 0 || seed.c > 0.4) {
      errors.push({ field: 'seedColor.c', message: 'Must be between 0 and 0.4' });
    }
    if (typeof seed.h !== 'number' || seed.h < 0 || seed.h >= 360) {
      errors.push({ field: 'seedColor.h', message: 'Must be in [0, 360)' });
    }
  }

  const fonts = input.fonts as Record<string, unknown> | undefined;
  if (!fonts || typeof fonts !== 'object') {
    errors.push({ field: 'fonts', message: 'Required object' });
  } else {
    if (typeof fonts.display !== 'string' || fonts.display.trim().length === 0) {
      errors.push({ field: 'fonts.display', message: 'Required; no platform default' });
    }
    if (typeof fonts.heading !== 'string' || fonts.heading.trim().length === 0) {
      errors.push({ field: 'fonts.heading', message: 'Required; no platform default' });
    }
    if (typeof fonts.body !== 'string' || fonts.body.trim().length === 0) {
      errors.push({ field: 'fonts.body', message: 'Required; no platform default' });
    }
  }

  return errors;
}

export function validateBrandPatch(patch: Record<string, unknown>): FieldError[] {
  const errors: FieldError[] = [];

  if ('displayName' in patch) {
    if (
      typeof patch.displayName !== 'string' ||
      patch.displayName.trim().length === 0 ||
      patch.displayName.length > 128
    ) {
      errors.push({ field: 'displayName', message: 'Must be 1–128 chars' });
    }
  }

  if ('seedColor' in patch) {
    const seed = patch.seedColor as Record<string, unknown> | undefined;
    if (!seed || typeof seed !== 'object') {
      errors.push({ field: 'seedColor', message: 'Must be an object' });
    } else {
      if ('l' in seed && (typeof seed.l !== 'number' || seed.l < 0 || seed.l > 1)) {
        errors.push({ field: 'seedColor.l', message: 'Must be between 0 and 1' });
      }
      if ('c' in seed && (typeof seed.c !== 'number' || seed.c < 0 || seed.c > 0.4)) {
        errors.push({ field: 'seedColor.c', message: 'Must be between 0 and 0.4' });
      }
      if ('h' in seed && (typeof seed.h !== 'number' || seed.h < 0 || seed.h >= 360)) {
        errors.push({ field: 'seedColor.h', message: 'Must be in [0, 360)' });
      }
    }
  }

  return errors;
}

// ─── D1 persistence ───────────────────────────────────────────────────────────

export async function insertBrand(db: D1Database, brand: Brand): Promise<void> {
  await db
    .prepare(
      `INSERT INTO brands
         (id, display_name, seed_l, seed_c, seed_h,
          font_display, font_heading, font_body,
          primitives, color_scale, valid_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      brand.id,
      brand.displayName,
      brand.seedColor.l,
      brand.seedColor.c,
      brand.seedColor.h,
      brand.fonts.display,
      brand.fonts.heading,
      brand.fonts.body,
      brand.primitives ? JSON.stringify(brand.primitives) : null,
      JSON.stringify(brand.colorScale),
      brand.validStatus,
      brand.createdAt,
      brand.updatedAt,
    )
    .run();
}

export async function getBrandFromDb(
  db: D1Database,
  id: string,
): Promise<Brand | null> {
  const row = await db
    .prepare(`SELECT * FROM brands WHERE id = ?`)
    .bind(id)
    .first<BrandRow>();
  return row ? rowToBrand(row) : null;
}

export async function updateBrandInDb(
  db: D1Database,
  id: string,
  patch: BrandPatch,
  newColorScale?: { light: ColorScale; dark: ColorScale },
): Promise<Brand | null> {
  const existing = await getBrandFromDb(db, id);
  if (!existing) return null;

  const merged: Brand = {
    ...existing,
    displayName: patch.displayName ?? existing.displayName,
    seedColor: patch.seedColor ?? existing.seedColor,
    fonts: {
      display: patch.fonts?.display ?? existing.fonts.display,
      heading: patch.fonts?.heading ?? existing.fonts.heading,
      body: patch.fonts?.body ?? existing.fonts.body,
    },
    primitives:
      'primitives' in patch ? (patch.primitives ?? null) : existing.primitives,
    colorScale: newColorScale ?? existing.colorScale,
    validStatus: newColorScale ? 'pending' : existing.validStatus,
    updatedAt: new Date().toISOString(),
  };

  await db
    .prepare(
      `UPDATE brands
         SET display_name = ?, seed_l = ?, seed_c = ?, seed_h = ?,
             font_display = ?, font_heading = ?, font_body = ?,
             primitives = ?, color_scale = ?, valid_status = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      merged.displayName,
      merged.seedColor.l,
      merged.seedColor.c,
      merged.seedColor.h,
      merged.fonts.display,
      merged.fonts.heading,
      merged.fonts.body,
      merged.primitives ? JSON.stringify(merged.primitives) : null,
      JSON.stringify(merged.colorScale),
      merged.validStatus,
      merged.updatedAt,
      id,
    )
    .run();

  return merged;
}

export async function deleteBrandFromDb(
  db: D1Database,
  id: string,
): Promise<boolean> {
  const { meta } = await db
    .prepare(`DELETE FROM brands WHERE id = ?`)
    .bind(id)
    .run();
  return meta.changes > 0;
}

// ─── KV cache helpers ─────────────────────────────────────────────────────────

export async function getBrandFromKV(
  kv: KVNamespace,
  id: string,
): Promise<Brand | null> {
  const raw = await kv.get(`brand:${id}`);
  return raw ? (JSON.parse(raw) as Brand) : null;
}

export async function setBrandKV(
  kv: KVNamespace,
  id: string,
  brand: Brand,
): Promise<void> {
  await kv.put(`brand:${id}`, JSON.stringify(brand), { expirationTtl: 60 });
}

export async function invalidateBrandKV(
  kv: KVNamespace,
  id: string,
): Promise<void> {
  await Promise.all([
    kv.delete(`brand:${id}`),
    kv.delete(`brand:${id}:tokens:light`),
    kv.delete(`brand:${id}:tokens:dark`),
    kv.delete(`brand:${id}:overrides`),
    kv.delete('brands:list'),
  ]);
}

export async function addBrandToIdsList(
  kv: KVNamespace,
  id: string,
): Promise<void> {
  const raw = await kv.get('brands:ids');
  const ids: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  if (!ids.includes(id)) ids.push(id);
  await kv.put('brands:ids', JSON.stringify(ids));
}

export async function removeBrandFromIdsList(
  kv: KVNamespace,
  id: string,
): Promise<void> {
  const raw = await kv.get('brands:ids');
  if (!raw) return;
  const ids = (JSON.parse(raw) as string[]).filter((i) => i !== id);
  await kv.put('brands:ids', JSON.stringify(ids));
}

/** Deletes resolved token KV cache for every registered brand. */
export async function invalidateAllBrandTokenCaches(
  kv: KVNamespace,
): Promise<void> {
  const raw = await kv.get('brands:ids');
  if (!raw) return;
  const ids = JSON.parse(raw) as string[];
  await Promise.all(
    ids.flatMap((id) => [
      kv.delete(`brand:${id}:tokens:light`),
      kv.delete(`brand:${id}:tokens:dark`),
    ]),
  );
}

// ─── registerBrand ────────────────────────────────────────────────────────────

export async function registerBrand(
  db: D1Database,
  kv: KVNamespace,
  input: BrandInput,
): Promise<Brand> {
  const colorScale = generateColorScale(
    input.seedColor.l,
    input.seedColor.c,
    input.seedColor.h,
  );

  const now = new Date().toISOString();
  const brand: Brand = {
    id: input.id,
    displayName: input.displayName,
    seedColor: input.seedColor,
    fonts: input.fonts,
    primitives: input.primitives ?? null,
    colorScale,
    validStatus: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  await insertBrand(db, brand);
  await Promise.all([addBrandToIdsList(kv, brand.id), setBrandKV(kv, brand.id, brand)]);

  return brand;
}

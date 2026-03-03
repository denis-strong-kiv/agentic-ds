// ─── Brand API Routes ─────────────────────────────────────────────────────────
// POST   /api/brands          — register new brand
// GET    /api/brands          — paginated list
// GET    /api/brands/:id      — single brand
// PUT    /api/brands/:id      — update brand (triggers regeneration)
// DELETE /api/brands/:id      — remove brand

import { validateOKLCH } from '@travel/tokens';
import type { BrandConfig, OKLCHColor, NeutralTemperature, SemanticTemperature, Shape } from '@travel/tokens';
import {
  registerBrand,
  getBrand,
  updateBrand,
  listBrands,
  deleteBrand,
} from '../services/brand-service.js';
import type { Env } from '../services/brand-service.js';

// ─── Validation helpers ───────────────────────────────────────────────────────

const VALID_NEUTRAL_TEMPS = new Set<NeutralTemperature>(['warm', 'cool', 'neutral']);
const VALID_SEMANTIC_TEMPS = new Set<SemanticTemperature>(['warm', 'cool', 'neutral']);
const VALID_SHAPES = new Set<Shape>(['sharp', 'rounded', 'pill']);

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function validateSeed(seed: unknown, fieldName: string): string[] {
  const errors: string[] = [];
  if (!seed || typeof seed !== 'object') {
    return [`${fieldName} must be an object with lightness, chroma, hue`];
  }
  const s = seed as Partial<OKLCHColor>;
  if (typeof s.lightness !== 'number') errors.push(`${fieldName}.lightness must be a number`);
  if (typeof s.chroma !== 'number') errors.push(`${fieldName}.chroma must be a number`);
  if (typeof s.hue !== 'number') errors.push(`${fieldName}.hue must be a number`);

  if (errors.length === 0) {
    const result = validateOKLCH(seed as OKLCHColor);
    errors.push(...result.errors.map((e) => `${fieldName}: ${e}`));
  }
  return errors;
}

function validateBrandBody(body: unknown): { config: BrandConfig; errors: string[] } | { errors: string[] } {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { errors: ['Request body must be a JSON object'] };
  }

  const b = body as Record<string, unknown>;

  if (!b.id || typeof b.id !== 'string' || !/^[a-z0-9-]+$/.test(b.id)) {
    errors.push('id must be a lowercase alphanumeric string (hyphens allowed)');
  }
  if (!b.displayName || typeof b.displayName !== 'string') {
    errors.push('displayName is required');
  }

  errors.push(...validateSeed(b.primarySeed, 'primarySeed'));
  errors.push(...validateSeed(b.accentSeed, 'accentSeed'));

  if (!b.neutralTemperature || !VALID_NEUTRAL_TEMPS.has(b.neutralTemperature as NeutralTemperature)) {
    errors.push("neutralTemperature must be 'warm', 'cool', or 'neutral'");
  }
  if (!b.semanticTemperature || !VALID_SEMANTIC_TEMPS.has(b.semanticTemperature as SemanticTemperature)) {
    errors.push("semanticTemperature must be 'warm', 'cool', or 'neutral'");
  }
  if (!b.shape || !VALID_SHAPES.has(b.shape as Shape)) {
    errors.push("shape must be 'sharp', 'rounded', or 'pill'");
  }

  const fonts = b.fonts as Record<string, unknown> | undefined;
  if (!fonts || typeof fonts !== 'object') {
    errors.push('fonts is required (display, heading, body)');
  } else {
    if (!fonts.display || typeof fonts.display !== 'string') errors.push('fonts.display is required');
    if (!fonts.heading || typeof fonts.heading !== 'string') errors.push('fonts.heading is required');
    if (!fonts.body || typeof fonts.body !== 'string') errors.push('fonts.body is required');
  }

  if (errors.length > 0) return { errors };

  const config: BrandConfig = {
    id: b.id as string,
    displayName: b.displayName as string,
    primarySeed: b.primarySeed as OKLCHColor,
    accentSeed: b.accentSeed as OKLCHColor,
    neutralTemperature: b.neutralTemperature as NeutralTemperature,
    semanticTemperature: b.semanticTemperature as SemanticTemperature,
    shape: b.shape as Shape,
    fonts: fonts as BrandConfig['fonts'],
    overrides: b.overrides as Record<string, string> | undefined,
  };

  return { config, errors: [] };
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function handleBrandsRoute(
  request: Request,
  env: Env,
  idSegment: string | null,
): Promise<Response> {
  const method = request.method;

  // POST /api/brands — register new brand
  if (!idSegment && method === 'POST') {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const validation = validateBrandBody(body);
    if ('errors' in validation && validation.errors.length > 0) {
      return json({ error: 'Validation failed', details: validation.errors }, 400);
    }

    if (!('config' in validation)) {
      return json({ error: 'Validation failed' }, 400);
    }

    // Check for duplicate id
    const existing = await getBrand(validation.config.id, env);
    if (existing) {
      return json({ error: `Brand "${validation.config.id}" already exists` }, 409);
    }

    const brand = await registerBrand(validation.config, env);
    return json({ brand }, 201);
  }

  // GET /api/brands — paginated list
  if (!idSegment && method === 'GET') {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20')));
    const result = await listBrands(page, limit, env);
    return json(result);
  }

  // GET /api/brands/:id
  if (idSegment && method === 'GET') {
    const brand = await getBrand(idSegment, env);
    if (!brand) return json({ error: `Brand "${idSegment}" not found` }, 404);
    return json({ brand });
  }

  // PUT /api/brands/:id — update brand
  if (idSegment && method === 'PUT') {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    // Partial update — only validate provided fields' types
    const b = body as Record<string, unknown>;
    const errors: string[] = [];

    if (b.primarySeed !== undefined) errors.push(...validateSeed(b.primarySeed, 'primarySeed'));
    if (b.accentSeed !== undefined) errors.push(...validateSeed(b.accentSeed, 'accentSeed'));
    if (b.neutralTemperature !== undefined && !VALID_NEUTRAL_TEMPS.has(b.neutralTemperature as NeutralTemperature)) {
      errors.push("neutralTemperature must be 'warm', 'cool', or 'neutral'");
    }
    if (b.semanticTemperature !== undefined && !VALID_SEMANTIC_TEMPS.has(b.semanticTemperature as SemanticTemperature)) {
      errors.push("semanticTemperature must be 'warm', 'cool', or 'neutral'");
    }
    if (b.shape !== undefined && !VALID_SHAPES.has(b.shape as Shape)) {
      errors.push("shape must be 'sharp', 'rounded', or 'pill'");
    }

    if (errors.length > 0) {
      return json({ error: 'Validation failed', details: errors }, 400);
    }

    try {
      const brand = await updateBrand(idSegment, b as Partial<Omit<BrandConfig, 'id'>>, env);
      return json({ brand });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found')) return json({ error: msg }, 404);
      throw err;
    }
  }

  // DELETE /api/brands/:id
  if (idSegment && method === 'DELETE') {
    try {
      await deleteBrand(idSegment, env);
      return json({ deleted: idSegment });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found')) return json({ error: msg }, 404);
      throw err;
    }
  }

  return json({ error: 'Method not allowed' }, 405);
}

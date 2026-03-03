import type { Env, BrandInput, BrandPatch } from '../types';
import {
  validateBrandInput,
  validateBrandPatch,
  registerBrand,
  getBrandFromDb,
  getBrandFromKV,
  setBrandKV,
  updateBrandInDb,
  deleteBrandFromDb,
  invalidateBrandKV,
  removeBrandFromIdsList,
} from './service';
import { generateColorScale } from '../color/oklch';
import { validateBrandTokenSet } from '../tokens/validator';

// ─── Helper ───────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ─── POST /brands ─────────────────────────────────────────────────────────────

export async function handleCreateBrand(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  _params: Record<string, string>,
): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const errors = validateBrandInput(body);
  if (errors.length > 0) {
    return json({ error: 'VALIDATION_ERROR', details: errors }, 422);
  }

  const input = body as unknown as BrandInput;

  // Check for duplicate id
  const existing = await getBrandFromDb(env.DB, input.id);
  if (existing) {
    return json({ error: 'CONFLICT', message: `Brand '${input.id}' already exists` }, 409);
  }

  const brand = await registerBrand(env.DB, env.KV, input);

  // Async validation (non-blocking)

  ctx.waitUntil(validateBrandTokenSet(env.DB, brand.id));

  return new Response(
    JSON.stringify({
      id: brand.id,
      displayName: brand.displayName,
      validStatus: brand.validStatus,
      createdAt: brand.createdAt,
    }),
    {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        Location: `/brands/${brand.id}`,
      },
    },
  );
}

// ─── GET /brands ──────────────────────────────────────────────────────────────

export async function handleListBrands(
  request: Request,
  env: Env,
  _ctx: ExecutionContext,
  _params: Record<string, string>,
): Promise<Response> {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200);
  const cursor = url.searchParams.get('cursor');
  const offset = cursor ? parseInt(atob(cursor), 10) : 0;

  // Serve from KV only when no cursor/limit variation
  if (!cursor && limit === 50) {
    const cached = await env.KV.get('brands:list');
    if (cached) return new Response(cached, { headers: { 'Content-Type': 'application/json' } });
  }

  const { results } = await env.DB.prepare(
    `SELECT id, display_name, valid_status, created_at
       FROM brands ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  )
    .bind(limit + 1, offset)
    .all<{ id: string; display_name: string; valid_status: string; created_at: string }>();

  const hasMore = results.length > limit;
  const page = hasMore ? results.slice(0, limit) : results;

  const { results: countResult } = await env.DB.prepare(`SELECT COUNT(*) as n FROM brands`).all<{
    n: number;
  }>();
  const total = countResult[0]?.n ?? 0;

  const nextCursor = hasMore ? btoa(String(offset + limit)) : null;
  const payload = {
    brands: page.map((r) => ({
      id: r.id,
      displayName: r.display_name,
      validStatus: r.valid_status,
      createdAt: r.created_at,
    })),
    nextCursor,
    total,
  };

  const body = JSON.stringify(payload);
  if (!cursor && limit === 50) {
    await env.KV.put('brands:list', body, { expirationTtl: 60 });
  }

  return new Response(body, { headers: { 'Content-Type': 'application/json' } });
}

// ─── GET /brands/:id ──────────────────────────────────────────────────────────

export async function handleGetBrand(
  _request: Request,
  env: Env,
  _ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const { id } = params;

  let brand = await getBrandFromKV(env.KV, id);
  if (!brand) {
    brand = await getBrandFromDb(env.DB, id);
    if (!brand) return json({ error: 'Not found' }, 404);
    await setBrandKV(env.KV, id, brand);
  }

  return json({
    id: brand.id,
    displayName: brand.displayName,
    seedColor: brand.seedColor,
    fonts: brand.fonts,
    primitives: brand.primitives,
    validStatus: brand.validStatus,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  });
}

// ─── PUT /brands/:id ──────────────────────────────────────────────────────────

export async function handleUpdateBrand(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const { id } = params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const errors = validateBrandPatch(body);
  if (errors.length > 0) {
    return json({ error: 'VALIDATION_ERROR', details: errors }, 422);
  }

  const patch = body as unknown as BrandPatch;

  // Regenerate color scale if seed changes
  let newColorScale: { light: import('../types').ColorScale; dark: import('../types').ColorScale } | undefined;
  const existing = await getBrandFromDb(env.DB, id);
  if (!existing) return json({ error: 'Not found' }, 404);

  if (patch.seedColor) {
    const seed = {
      l: patch.seedColor.l ?? existing.seedColor.l,
      c: patch.seedColor.c ?? existing.seedColor.c,
      h: patch.seedColor.h ?? existing.seedColor.h,
    };
    newColorScale = generateColorScale(seed.l, seed.c, seed.h);
  }

  const updated = await updateBrandInDb(env.DB, id, patch, newColorScale);
  if (!updated) return json({ error: 'Not found' }, 404);

  await invalidateBrandKV(env.KV, id);

  // Async re-validation

  ctx.waitUntil(validateBrandTokenSet(env.DB, id));

  return json({
    id: updated.id,
    displayName: updated.displayName,
    seedColor: updated.seedColor,
    fonts: updated.fonts,
    primitives: updated.primitives,
    validStatus: updated.validStatus,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  });
}

// ─── DELETE /brands/:id ───────────────────────────────────────────────────────

export async function handleDeleteBrand(
  _request: Request,
  env: Env,
  _ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const { id } = params;
  const deleted = await deleteBrandFromDb(env.DB, id);
  if (!deleted) return json({ error: 'Not found' }, 404);

  await Promise.all([
    invalidateBrandKV(env.KV, id),
    removeBrandFromIdsList(env.KV, id),
  ]);

  return new Response(null, { status: 204 });
}

// ─── GET /brands/:id/validate ─────────────────────────────────────────────────

export async function handleGetValidation(
  _request: Request,
  env: Env,
  _ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const { id } = params;

  // Verify brand exists
  const brand = await getBrandFromDb(env.DB, id);
  if (!brand) return json({ error: 'Not found' }, 404);

  const row = await env.DB.prepare(
    `SELECT id, brand_id, run_at, status, errors
       FROM token_validation_log
      WHERE brand_id = ?
      ORDER BY run_at DESC LIMIT 1`,
  )
    .bind(id)
    .first<{
      id: string;
      brand_id: string;
      run_at: string;
      status: string;
      errors: string | null;
    }>();

  if (!row) {
    return new Response(
      JSON.stringify({ brandId: id, status: 'pending', message: 'Validation not yet run' }),
      { status: 202, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return json({
    brandId: row.brand_id,
    status: row.status,
    runAt: row.run_at,
    errors: row.errors ? JSON.parse(row.errors) : [],
  });
}

// ─── POST /brands/:id/overrides ───────────────────────────────────────────────

export async function handleCreateOverride(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const { id } = params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { componentToken, semanticTokenOverride } = body as {
    componentToken?: string;
    semanticTokenOverride?: string;
  };

  if (!componentToken || !semanticTokenOverride) {
    return json(
      { error: 'VALIDATION_ERROR', details: [{ field: 'componentToken/semanticTokenOverride', message: 'Both fields required' }] },
      422,
    );
  }

  // Validate brand exists
  const brand = await getBrandFromDb(env.DB, id);
  if (!brand) return json({ error: 'Not found' }, 404);

  // Validate component token exists
  const ct = await env.DB.prepare(`SELECT name FROM component_tokens WHERE name = ?`)
    .bind(componentToken)
    .first<{ name: string }>();
  if (!ct) {
    return json(
      { error: 'VALIDATION_ERROR', details: [{ field: 'componentToken', message: 'Component token does not exist' }] },
      422,
    );
  }

  // Validate semantic token exists
  const st = await env.DB.prepare(`SELECT name FROM semantic_tokens WHERE name = ?`)
    .bind(semanticTokenOverride)
    .first<{ name: string }>();
  if (!st) {
    return json(
      { error: 'VALIDATION_ERROR', details: [{ field: 'semanticTokenOverride', message: 'Semantic token does not exist' }] },
      422,
    );
  }

  const now = new Date().toISOString();
  try {
    await env.DB.prepare(
      `INSERT INTO brand_token_overrides
         (brand_id, component_token, semantic_token_override, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(id, componentToken, semanticTokenOverride, now, now)
      .run();
  } catch {
    return json({ error: 'CONFLICT', message: 'Override already exists' }, 409);
  }

  await Promise.all([
    env.KV.delete(`brand:${id}:tokens:light`),
    env.KV.delete(`brand:${id}:tokens:dark`),
    env.KV.delete(`brand:${id}:overrides`),
  ]);


  ctx.waitUntil(validateBrandTokenSet(env.DB, id));

  return new Response(
    JSON.stringify({ brandId: id, componentToken, semanticTokenOverride, createdAt: now }),
    { status: 201, headers: { 'Content-Type': 'application/json' } },
  );
}

// ─── GET /brands/:id/overrides ────────────────────────────────────────────────

export async function handleListOverrides(
  _request: Request,
  env: Env,
  _ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const { id } = params;

  const brand = await getBrandFromDb(env.DB, id);
  if (!brand) return json({ error: 'Not found' }, 404);

  const cached = await env.KV.get(`brand:${id}:overrides`);
  if (cached) return new Response(cached, { headers: { 'Content-Type': 'application/json' } });

  const { results } = await env.DB.prepare(
    `SELECT component_token, semantic_token_override
       FROM brand_token_overrides WHERE brand_id = ?`,
  )
    .bind(id)
    .all<{ component_token: string; semantic_token_override: string }>();

  const payload = JSON.stringify({
    brandId: id,
    overrides: results.map((r) => ({
      componentToken: r.component_token,
      semanticTokenOverride: r.semantic_token_override,
    })),
  });

  await env.KV.put(`brand:${id}:overrides`, payload, { expirationTtl: 60 });
  return new Response(payload, { headers: { 'Content-Type': 'application/json' } });
}

// ─── DELETE /brands/:id/overrides/:token ──────────────────────────────────────

export async function handleDeleteOverride(
  _request: Request,
  env: Env,
  ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const { id, token } = params;

  const { meta } = await env.DB.prepare(
    `DELETE FROM brand_token_overrides WHERE brand_id = ? AND component_token = ?`,
  )
    .bind(id, token)
    .run();

  if (meta.changes === 0) return json({ error: 'Not found' }, 404);

  await Promise.all([
    env.KV.delete(`brand:${id}:tokens:light`),
    env.KV.delete(`brand:${id}:tokens:dark`),
    env.KV.delete(`brand:${id}:overrides`),
  ]);


  ctx.waitUntil(validateBrandTokenSet(env.DB, id));

  return new Response(null, { status: 204 });
}

import type { Env, SemanticToken, ComponentToken } from '../types';
import { VALID_SCALE_STEPS } from '../types';
import { invalidateAllBrandTokenCaches } from '../brands/service';
import { getResolvedTokens } from './resolver';
import { validateBrandTokenSet } from './validator';

// ─── Helper ───────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const TOKEN_NAME_RE = /^[a-z][a-z0-9.]*$/;
const VALID_STEPS = new Set<string>(VALID_SCALE_STEPS);

// ─── DB row types ─────────────────────────────────────────────────────────────

interface SemanticRow {
  name: string;
  tier1_ref_light: string | null;
  tier1_ref_dark: string | null;
  primitive_ref: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface ComponentRow {
  name: string;
  semantic_token: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

function rowToSemantic(r: SemanticRow): SemanticToken {
  return {
    name: r.name,
    tier1RefLight: r.tier1_ref_light,
    tier1RefDark: r.tier1_ref_dark,
    primitiveRef: r.primitive_ref,
    description: r.description,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToComponent(r: ComponentRow): ComponentToken {
  return {
    name: r.name,
    semanticToken: r.semantic_token,
    description: r.description,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// ─── Semantic token validation ────────────────────────────────────────────────

function validateSemanticInput(body: Record<string, unknown>): string[] {
  const errs: string[] = [];
  if (
    typeof body.name !== 'string' ||
    !TOKEN_NAME_RE.test(body.name) ||
    body.name.length > 128
  ) {
    errs.push('name: must match [a-z][a-z0-9.]*, max 128 chars');
  }

  const hasColor =
    'tier1RefLight' in body ||
    'tier1RefDark' in body;
  const hasPrimitive = 'primitiveRef' in body;

  if (hasColor && hasPrimitive) {
    errs.push('Provide either (tier1RefLight + tier1RefDark) or primitiveRef — not both');
  }
  if (!hasColor && !hasPrimitive) {
    errs.push('Provide either (tier1RefLight + tier1RefDark) or primitiveRef');
  }

  if (hasColor) {
    if (
      typeof body.tier1RefLight !== 'string' ||
      !VALID_STEPS.has(body.tier1RefLight)
    ) {
      errs.push(`tier1RefLight must be one of: ${VALID_SCALE_STEPS.join(', ')}`);
    }
    if (
      typeof body.tier1RefDark !== 'string' ||
      !VALID_STEPS.has(body.tier1RefDark)
    ) {
      errs.push(`tier1RefDark must be one of: ${VALID_SCALE_STEPS.join(', ')}`);
    }
  }

  if (hasPrimitive && typeof body.primitiveRef !== 'string') {
    errs.push('primitiveRef must be a string dot-path');
  }

  return errs;
}

// ─── Global cache invalidation + re-validation ───────────────────────────────

async function invalidateAndRevalidateAll(
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  await Promise.all([
    env.KV.delete('tokens:semantic'),
    env.KV.delete('tokens:components'),
    invalidateAllBrandTokenCaches(env.KV),
  ]);

  ctx.waitUntil(
    (async () => {
      const raw = await env.KV.get('brands:ids');
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      await Promise.all(ids.map((id) => validateBrandTokenSet(env.DB, id)));
    })(),
  );
}

// ─── POST /tokens/semantic ────────────────────────────────────────────────────

export async function handleCreateSemanticToken(
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

  const errs = validateSemanticInput(body);
  if (errs.length > 0) {
    return json({ error: 'VALIDATION_ERROR', details: errs }, 422);
  }

  const now = new Date().toISOString();
  const name = body.name as string;
  const tier1RefLight = (body.tier1RefLight as string) ?? null;
  const tier1RefDark = (body.tier1RefDark as string) ?? null;
  const primitiveRef = (body.primitiveRef as string) ?? null;
  const description = (body.description as string) ?? null;

  // Check duplicate
  const existing = await env.DB.prepare(`SELECT name FROM semantic_tokens WHERE name = ?`)
    .bind(name)
    .first();
  if (existing) return json({ error: 'CONFLICT', message: `Token '${name}' already exists` }, 409);

  await env.DB.prepare(
    `INSERT INTO semantic_tokens
       (name, tier1_ref_light, tier1_ref_dark, primitive_ref, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(name, tier1RefLight, tier1RefDark, primitiveRef, description, now, now)
    .run();

  ctx.waitUntil(
    Promise.all([
      env.KV.delete('tokens:semantic'),
      invalidateAllBrandTokenCaches(env.KV),
    ]),
  );

  return new Response(
    JSON.stringify({
      name,
      tier1RefLight,
      tier1RefDark,
      primitiveRef,
      description,
      createdAt: now,
    }),
    { status: 201, headers: { 'Content-Type': 'application/json' } },
  );
}

// ─── GET /tokens/semantic ─────────────────────────────────────────────────────

export async function handleListSemanticTokens(
  _request: Request,
  env: Env,
  _ctx: ExecutionContext,
  _params: Record<string, string>,
): Promise<Response> {
  const cached = await env.KV.get('tokens:semantic');
  if (cached)
    return new Response(cached, { headers: { 'Content-Type': 'application/json' } });

  const { results } = await env.DB.prepare(`SELECT * FROM semantic_tokens ORDER BY name`).all<SemanticRow>();
  const tokens = results.map(rowToSemantic);
  const body = JSON.stringify({ tokens });
  await env.KV.put('tokens:semantic', body, { expirationTtl: 600 });
  return new Response(body, { headers: { 'Content-Type': 'application/json' } });
}

// ─── GET /tokens/semantic/:name ───────────────────────────────────────────────

export async function handleGetSemanticToken(
  _request: Request,
  env: Env,
  _ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const row = await env.DB.prepare(`SELECT * FROM semantic_tokens WHERE name = ?`)
    .bind(params.name)
    .first<SemanticRow>();
  if (!row) return json({ error: 'Not found' }, 404);
  return json(rowToSemantic(row));
}

// ─── PUT /tokens/semantic/:name ───────────────────────────────────────────────

export async function handleUpdateSemanticToken(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const existing = await env.DB.prepare(`SELECT * FROM semantic_tokens WHERE name = ?`)
    .bind(params.name)
    .first<SemanticRow>();
  if (!existing) return json({ error: 'Not found' }, 404);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // Merge with existing for validation
  const merged: Record<string, unknown> = {
    tier1RefLight: existing.tier1_ref_light,
    tier1RefDark: existing.tier1_ref_dark,
    primitiveRef: existing.primitive_ref,
    ...body,
    name: params.name, // name is immutable
  };

  const errs = validateSemanticInput(merged);
  if (errs.length > 0) return json({ error: 'VALIDATION_ERROR', details: errs }, 422);

  const now = new Date().toISOString();
  const tier1RefLight = ('tier1RefLight' in body ? body.tier1RefLight : existing.tier1_ref_light) as string | null;
  const tier1RefDark = ('tier1RefDark' in body ? body.tier1RefDark : existing.tier1_ref_dark) as string | null;
  const primitiveRef = ('primitiveRef' in body ? body.primitiveRef : existing.primitive_ref) as string | null;
  const description = ('description' in body ? body.description : existing.description) as string | null;

  await env.DB.prepare(
    `UPDATE semantic_tokens
       SET tier1_ref_light = ?, tier1_ref_dark = ?, primitive_ref = ?,
           description = ?, updated_at = ?
     WHERE name = ?`,
  )
    .bind(tier1RefLight, tier1RefDark, primitiveRef, description, now, params.name)
    .run();

  await invalidateAndRevalidateAll(env, ctx);

  return json({
    name: params.name,
    tier1RefLight,
    tier1RefDark,
    primitiveRef,
    description,
    createdAt: existing.created_at,
    updatedAt: now,
  });
}

// ─── DELETE /tokens/semantic/:name ────────────────────────────────────────────

export async function handleDeleteSemanticToken(
  _request: Request,
  env: Env,
  ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const existing = await env.DB.prepare(`SELECT name FROM semantic_tokens WHERE name = ?`)
    .bind(params.name)
    .first();
  if (!existing) return json({ error: 'Not found' }, 404);

  // Check FK references
  const { results: refs } = await env.DB.prepare(
    `SELECT name FROM component_tokens WHERE semantic_token = ?`,
  )
    .bind(params.name)
    .all<{ name: string }>();

  if (refs.length > 0) {
    return json(
      { error: 'REFERENCED', referencedBy: refs.map((r) => r.name) },
      409,
    );
  }

  await env.DB.prepare(`DELETE FROM semantic_tokens WHERE name = ?`)
    .bind(params.name)
    .run();

  ctx.waitUntil(invalidateAndRevalidateAll(env, ctx));

  return new Response(null, { status: 204 });
}

// ─── POST /tokens/components ──────────────────────────────────────────────────

export async function handleCreateComponentToken(
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

  const { name, semanticToken, description } = body as {
    name?: string;
    semanticToken?: string;
    description?: string;
  };

  if (!name || !TOKEN_NAME_RE.test(name) || name.length > 128) {
    return json(
      { error: 'VALIDATION_ERROR', details: ['name: must match [a-z][a-z0-9.]*, max 128 chars'] },
      422,
    );
  }
  if (!semanticToken) {
    return json({ error: 'VALIDATION_ERROR', details: ['semanticToken: required'] }, 422);
  }

  // Validate semantic token exists
  const st = await env.DB.prepare(`SELECT name FROM semantic_tokens WHERE name = ?`)
    .bind(semanticToken)
    .first();
  if (!st) {
    return json(
      { error: 'VALIDATION_ERROR', details: [`semanticToken '${semanticToken}' does not exist`] },
      422,
    );
  }

  // Check duplicate
  const existing = await env.DB.prepare(`SELECT name FROM component_tokens WHERE name = ?`)
    .bind(name)
    .first();
  if (existing) return json({ error: 'CONFLICT', message: `Token '${name}' already exists` }, 409);

  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO component_tokens (name, semantic_token, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(name, semanticToken, description ?? null, now, now)
    .run();

  ctx.waitUntil(
    Promise.all([
      env.KV.delete('tokens:components'),
      invalidateAllBrandTokenCaches(env.KV),
    ]),
  );

  return new Response(
    JSON.stringify({ name, semanticToken, description: description ?? null, createdAt: now }),
    { status: 201, headers: { 'Content-Type': 'application/json' } },
  );
}

// ─── GET /tokens/components ───────────────────────────────────────────────────

export async function handleListComponentTokens(
  _request: Request,
  env: Env,
  _ctx: ExecutionContext,
  _params: Record<string, string>,
): Promise<Response> {
  const cached = await env.KV.get('tokens:components');
  if (cached)
    return new Response(cached, { headers: { 'Content-Type': 'application/json' } });

  const { results } = await env.DB.prepare(
    `SELECT * FROM component_tokens ORDER BY name`,
  ).all<ComponentRow>();
  const tokens = results.map(rowToComponent);
  const body = JSON.stringify({ tokens });
  await env.KV.put('tokens:components', body, { expirationTtl: 600 });
  return new Response(body, { headers: { 'Content-Type': 'application/json' } });
}

// ─── GET /tokens/components/:name ─────────────────────────────────────────────

export async function handleGetComponentToken(
  _request: Request,
  env: Env,
  _ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const row = await env.DB.prepare(`SELECT * FROM component_tokens WHERE name = ?`)
    .bind(params.name)
    .first<ComponentRow>();
  if (!row) return json({ error: 'Not found' }, 404);
  return json(rowToComponent(row));
}

// ─── PUT /tokens/components/:name ─────────────────────────────────────────────

export async function handleUpdateComponentToken(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const existing = await env.DB.prepare(`SELECT * FROM component_tokens WHERE name = ?`)
    .bind(params.name)
    .first<ComponentRow>();
  if (!existing) return json({ error: 'Not found' }, 404);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const semanticToken = (body.semanticToken as string) ?? existing.semantic_token;
  const description = ('description' in body ? body.description : existing.description) as string | null;

  // Validate new semantic token reference
  if (semanticToken !== existing.semantic_token) {
    const st = await env.DB.prepare(`SELECT name FROM semantic_tokens WHERE name = ?`)
      .bind(semanticToken)
      .first();
    if (!st) {
      return json(
        { error: 'VALIDATION_ERROR', details: [`semanticToken '${semanticToken}' does not exist`] },
        422,
      );
    }
  }

  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE component_tokens SET semantic_token = ?, description = ?, updated_at = ? WHERE name = ?`,
  )
    .bind(semanticToken, description, now, params.name)
    .run();

  await invalidateAndRevalidateAll(env, ctx);

  return json({
    name: params.name,
    semanticToken,
    description,
    createdAt: existing.created_at,
    updatedAt: now,
  });
}

// ─── DELETE /tokens/components/:name ─────────────────────────────────────────

export async function handleDeleteComponentToken(
  _request: Request,
  env: Env,
  ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const existing = await env.DB.prepare(`SELECT name FROM component_tokens WHERE name = ?`)
    .bind(params.name)
    .first();
  if (!existing) return json({ error: 'Not found' }, 404);

  // Check for per-brand overrides referencing this component token
  const { results: overrides } = await env.DB.prepare(
    `SELECT DISTINCT brand_id FROM brand_token_overrides WHERE component_token = ?`,
  )
    .bind(params.name)
    .all<{ brand_id: string }>();

  if (overrides.length > 0) {
    return json(
      { error: 'CONFLICT', referencedByBrands: overrides.map((r) => r.brand_id) },
      409,
    );
  }

  await env.DB.prepare(`DELETE FROM component_tokens WHERE name = ?`)
    .bind(params.name)
    .run();

  ctx.waitUntil(invalidateAndRevalidateAll(env, ctx));

  return new Response(null, { status: 204 });
}

// ─── GET /brands/:id/tokens.css ───────────────────────────────────────────────

export async function handleGetTokensCss(
  request: Request,
  env: Env,
  _ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const { id } = params;
  const url = new URL(request.url);
  const schemeParam = url.searchParams.get('scheme') ?? 'light';

  if (schemeParam !== 'light' && schemeParam !== 'dark') {
    return new Response(
      JSON.stringify({ error: 'BAD_REQUEST', message: "scheme must be 'light' or 'dark'" }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const result = await getResolvedTokens(env, id, schemeParam);

  if (result === 'not_found') {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (result === 'not_valid') {
    const brandRow = await env.DB.prepare(
      `SELECT valid_status FROM brands WHERE id = ?`,
    )
      .bind(id)
      .first<{ valid_status: string }>();

    if (!brandRow) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (brandRow.valid_status === 'invalid') {
      return new Response(
        JSON.stringify({
          error: 'INVALID_TOKEN_SET',
          brandId: id,
          validationReport: `/brands/${id}/validate`,
        }),
        { status: 422, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ error: 'VALIDATION_PENDING', brandId: id }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(result.css, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

// ─── GET /brands/:id/tokens.json ─────────────────────────────────────────────

export async function handleGetTokensJson(
  request: Request,
  env: Env,
  _ctx: ExecutionContext,
  params: Record<string, string>,
): Promise<Response> {
  const { id } = params;
  const url = new URL(request.url);
  const schemeParam = url.searchParams.get('scheme') ?? 'light';

  if (schemeParam !== 'light' && schemeParam !== 'dark') {
    return new Response(
      JSON.stringify({ error: 'BAD_REQUEST', message: "scheme must be 'light' or 'dark'" }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const result = await getResolvedTokens(env, id, schemeParam);

  if (result === 'not_found') {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (result === 'not_valid') {
    const brandRow = await env.DB.prepare(
      `SELECT valid_status FROM brands WHERE id = ?`,
    )
      .bind(id)
      .first<{ valid_status: string }>();

    if (!brandRow) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (brandRow.valid_status === 'invalid') {
      return new Response(
        JSON.stringify({
          error: 'INVALID_TOKEN_SET',
          brandId: id,
          validationReport: `/brands/${id}/validate`,
        }),
        { status: 422, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ error: 'VALIDATION_PENDING', brandId: id }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify(result.json), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

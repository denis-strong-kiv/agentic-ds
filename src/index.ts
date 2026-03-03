import type { Env } from './types';
import { matchRoute } from './router';
import { createSchema } from './db/schema';

// ─── Brand handlers ───────────────────────────────────────────────────────────
import {
  handleCreateBrand,
  handleListBrands,
  handleGetBrand,
  handleUpdateBrand,
  handleDeleteBrand,
  handleGetValidation,
  handleCreateOverride,
  handleListOverrides,
  handleDeleteOverride,
} from './brands/handler';

// ─── Token handlers ───────────────────────────────────────────────────────────
import {
  handleCreateSemanticToken,
  handleListSemanticTokens,
  handleGetSemanticToken,
  handleUpdateSemanticToken,
  handleDeleteSemanticToken,
  handleCreateComponentToken,
  handleListComponentTokens,
  handleGetComponentToken,
  handleUpdateComponentToken,
  handleDeleteComponentToken,
  handleGetTokensCss,
  handleGetTokensJson,
} from './tokens/handler';

// ─── Main fetch handler ───────────────────────────────────────────────────────

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;

    let params: Record<string, string> | null;

    // ── 1. Health endpoints ──────────────────────────────────────────────────
    if (pathname === '/health' && method === 'GET') return health();
    if (pathname === '/health/db' && method === 'GET') return healthDb(env);
    if (pathname === '/health/kv' && method === 'GET') return healthKv(env);
    if (pathname === '/health/r2' && method === 'GET') return healthR2(env);

    // ── 2. DB test / schema init ─────────────────────────────────────────────
    if (pathname === '/db/test' && method === 'GET') return dbTest(env);

    // ── 3. Token resolution — MUST come before /brands/:id catch-all ─────────
    if ((params = matchRoute(method, pathname, 'GET /brands/:id/tokens.css')))
      return handleGetTokensCss(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'GET /brands/:id/tokens.json')))
      return handleGetTokensJson(request, env, ctx, params);

    // ── 4. Brand management ──────────────────────────────────────────────────
    if ((params = matchRoute(method, pathname, 'POST /brands')))
      return handleCreateBrand(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'GET /brands')))
      return handleListBrands(request, env, ctx, params);

    // Specific brand sub-routes before /:id catch-all
    if ((params = matchRoute(method, pathname, 'GET /brands/:id/validate')))
      return handleGetValidation(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'POST /brands/:id/overrides')))
      return handleCreateOverride(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'GET /brands/:id/overrides')))
      return handleListOverrides(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'DELETE /brands/:id/overrides/:token')))
      return handleDeleteOverride(request, env, ctx, params);

    // Brand /:id catch-all (less specific — must be last in brand block)
    if ((params = matchRoute(method, pathname, 'GET /brands/:id')))
      return handleGetBrand(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'PUT /brands/:id')))
      return handleUpdateBrand(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'DELETE /brands/:id')))
      return handleDeleteBrand(request, env, ctx, params);

    // ── 5. Token authoring: semantic tokens ──────────────────────────────────
    if ((params = matchRoute(method, pathname, 'POST /tokens/semantic')))
      return handleCreateSemanticToken(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'GET /tokens/semantic')))
      return handleListSemanticTokens(request, env, ctx, params);

    // Specific semantic token routes before /:name catch-all
    if ((params = matchRoute(method, pathname, 'GET /tokens/semantic/:name')))
      return handleGetSemanticToken(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'PUT /tokens/semantic/:name')))
      return handleUpdateSemanticToken(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'DELETE /tokens/semantic/:name')))
      return handleDeleteSemanticToken(request, env, ctx, params);

    // ── 6. Token authoring: component tokens ─────────────────────────────────
    if ((params = matchRoute(method, pathname, 'POST /tokens/components')))
      return handleCreateComponentToken(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'GET /tokens/components')))
      return handleListComponentTokens(request, env, ctx, params);

    if ((params = matchRoute(method, pathname, 'GET /tokens/components/:name')))
      return handleGetComponentToken(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'PUT /tokens/components/:name')))
      return handleUpdateComponentToken(request, env, ctx, params);
    if ((params = matchRoute(method, pathname, 'DELETE /tokens/components/:name')))
      return handleDeleteComponentToken(request, env, ctx, params);

    // ── 7. Items CRUD + KV caching (existing routes — preserved unchanged) ───
    if (pathname === '/items' && method === 'GET') return listItems(env);
    if (pathname === '/items' && method === 'POST') return createItem(request, env);
    if (pathname === '/items/cached' && method === 'GET') return listItemsCached(env);

    const itemMatch = pathname.match(/^\/items\/([^/]+)$/);
    if (itemMatch) {
      const id = itemMatch[1];
      if (method === 'GET') return getItem(id, env);
      if (method === 'PUT') return updateItem(id, request, env);
      if (method === 'DELETE') return deleteItem(id, env);
    }

    // ── 8. R2 upload/download (existing — preserved unchanged) ───────────────
    if (pathname === '/upload' && method === 'POST') return uploadFile(request, env);
    const fileMatch = pathname.match(/^\/files\/(.+)$/);
    if (fileMatch && method === 'GET') return getFile(fileMatch[1], env);

    return json({ error: 'Not found' }, 404);
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ─── 1. Health ────────────────────────────────────────────────────────────────

function health(): Response {
  return json({ status: 'ok', timestamp: new Date().toISOString() });
}

async function healthDb(env: Env): Promise<Response> {
  try {
    await env.DB.prepare('SELECT 1').first();
    return json({ status: 'ok', service: 'D1' });
  } catch (e) {
    return json({ status: 'error', service: 'D1', error: String(e) }, 503);
  }
}

async function healthKv(env: Env): Promise<Response> {
  try {
    await env.KV.put('__health__', '1', { expirationTtl: 60 });
    const val = await env.KV.get('__health__');
    return json({ status: val === '1' ? 'ok' : 'error', service: 'KV' });
  } catch (e) {
    return json({ status: 'error', service: 'KV', error: String(e) }, 503);
  }
}

async function healthR2(env: Env): Promise<Response> {
  try {
    await env.BUCKET.put('__health__', 'ok');
    const obj = await env.BUCKET.get('__health__');
    return json({ status: obj ? 'ok' : 'error', service: 'R2' });
  } catch (e) {
    return json({ status: 'error', service: 'R2', error: String(e) }, 503);
  }
}

// ─── 2. DB test / schema init ─────────────────────────────────────────────────

async function dbTest(env: Env): Promise<Response> {
  // Create the legacy items table
  await env.DB.prepare(
    'CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, name TEXT NOT NULL, data TEXT, created_at TEXT NOT NULL)',
  ).run();

  // Create all 5 brand/token tables (idempotent)
  await createSchema(env.DB);

  // List all tables in the database
  const { results } = await env.DB.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
  ).all<{ name: string }>();

  return json({ status: 'ok', tables: results.map((r) => r.name) });
}

// ─── 3. Basic CRUD ────────────────────────────────────────────────────────────

async function listItems(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM items ORDER BY created_at DESC',
  ).all();
  return json(results);
}

async function createItem(request: Request, env: Env): Promise<Response> {
  const body = await request.json<{ name: string; data?: string }>();
  if (!body.name) return json({ error: 'name is required' }, 400);

  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO items (id, name, data, created_at) VALUES (?, ?, ?, ?)',
  )
    .bind(id, body.name, body.data ?? null, created_at)
    .run();

  await env.KV.delete('items:list'); // invalidate cache
  return json({ id, name: body.name, data: body.data ?? null, created_at }, 201);
}

async function getItem(id: string, env: Env): Promise<Response> {
  const item = await env.DB.prepare('SELECT * FROM items WHERE id = ?')
    .bind(id)
    .first();
  if (!item) return json({ error: 'Not found' }, 404);
  return json(item);
}

async function updateItem(
  id: string,
  request: Request,
  env: Env,
): Promise<Response> {
  const body = await request.json<{ name?: string; data?: string }>();
  const item = await env.DB.prepare('SELECT * FROM items WHERE id = ?')
    .bind(id)
    .first<{ name: string; data: string | null }>();
  if (!item) return json({ error: 'Not found' }, 404);

  const name = body.name ?? item.name;
  const data = body.data ?? item.data;
  await env.DB.prepare('UPDATE items SET name = ?, data = ? WHERE id = ?')
    .bind(name, data, id)
    .run();

  await env.KV.delete('items:list'); // invalidate cache
  return json({ id, name, data });
}

async function deleteItem(id: string, env: Env): Promise<Response> {
  const { meta } = await env.DB.prepare('DELETE FROM items WHERE id = ?')
    .bind(id)
    .run();
  if (meta.changes === 0) return json({ error: 'Not found' }, 404);
  await env.KV.delete('items:list'); // invalidate cache
  return json({ deleted: id });
}

// ─── 4. KV caching layer ─────────────────────────────────────────────────────

async function listItemsCached(env: Env): Promise<Response> {
  const cached = await env.KV.get('items:list');
  if (cached) {
    return new Response(cached, {
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
    });
  }

  const { results } = await env.DB.prepare(
    'SELECT * FROM items ORDER BY created_at DESC',
  ).all();
  const body = JSON.stringify(results);
  await env.KV.put('items:list', body, { expirationTtl: 60 });

  return new Response(body, {
    headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
  });
}

// ─── 5. R2 upload/download ────────────────────────────────────────────────────

async function uploadFile(request: Request, env: Env): Promise<Response> {
  const contentType =
    request.headers.get('Content-Type') ?? 'application/octet-stream';
  const key = `${crypto.randomUUID()}-${Date.now()}`;
  await env.BUCKET.put(key, request.body, {
    httpMetadata: { contentType },
  });
  return json({ key, contentType }, 201);
}

async function getFile(key: string, env: Env): Promise<Response> {
  const obj = await env.BUCKET.get(key);
  if (!obj) return json({ error: 'Not found' }, 404);
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
    },
  });
}

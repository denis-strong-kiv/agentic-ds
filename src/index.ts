interface Env {
  DB: D1Database;
  KV: KVNamespace;
  BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;

    // 1. Health endpoints
    if (pathname === "/health" && method === "GET") return health();
    if (pathname === "/health/db" && method === "GET") return healthDb(env);
    if (pathname === "/health/kv" && method === "GET") return healthKv(env);
    if (pathname === "/health/r2" && method === "GET") return healthR2(env);

    // 2. DB test endpoint
    if (pathname === "/db/test" && method === "GET") return dbTest(env);

    // 3+4. CRUD + KV caching — /items/cached must come before the :id regex
    if (pathname === "/items" && method === "GET") return listItems(env);
    if (pathname === "/items" && method === "POST") return createItem(request, env);
    if (pathname === "/items/cached" && method === "GET") return listItemsCached(env);

    const itemMatch = pathname.match(/^\/items\/([^/]+)$/);
    if (itemMatch) {
      const id = itemMatch[1];
      if (method === "GET") return getItem(id, env);
      if (method === "PUT") return updateItem(id, request, env);
      if (method === "DELETE") return deleteItem(id, env);
    }

    // 5. R2 upload/download
    if (pathname === "/upload" && method === "POST") return uploadFile(request, env);
    const fileMatch = pathname.match(/^\/files\/(.+)$/);
    if (fileMatch && method === "GET") return getFile(fileMatch[1], env);

    return json({ error: "Not found" }, 404);
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ─── 1. Health ────────────────────────────────────────────────────────────────

function health(): Response {
  return json({ status: "ok", timestamp: new Date().toISOString() });
}

async function healthDb(env: Env): Promise<Response> {
  try {
    await env.DB.prepare("SELECT 1").first();
    return json({ status: "ok", service: "D1" });
  } catch (e) {
    return json({ status: "error", service: "D1", error: String(e) }, 503);
  }
}

async function healthKv(env: Env): Promise<Response> {
  try {
    await env.KV.put("__health__", "1", { expirationTtl: 60 });
    const val = await env.KV.get("__health__");
    return json({ status: val === "1" ? "ok" : "error", service: "KV" });
  } catch (e) {
    return json({ status: "error", service: "KV", error: String(e) }, 503);
  }
}

async function healthR2(env: Env): Promise<Response> {
  try {
    await env.BUCKET.put("__health__", "ok");
    const obj = await env.BUCKET.get("__health__");
    return json({ status: obj ? "ok" : "error", service: "R2" });
  } catch (e) {
    return json({ status: "error", service: "R2", error: String(e) }, 503);
  }
}

// ─── 2. DB test endpoint ──────────────────────────────────────────────────────

async function dbTest(env: Env): Promise<Response> {
  await ensureItemsTable(env);
  return json({ status: "ok", message: "items table ready" });
}

// ─── 3. Basic CRUD ────────────────────────────────────────────────────────────

async function listItems(env: Env): Promise<Response> {
  await ensureItemsTable(env);
  const { results } = await env.DB.prepare(
    "SELECT * FROM items ORDER BY created_at DESC"
  ).all();
  return json(results);
}

async function createItem(request: Request, env: Env): Promise<Response> {
  await ensureItemsTable(env);
  const body = await request.json<{ name: string; data?: string }>();
  if (!body.name || typeof body.name !== "string") return json({ error: "name is required" }, 400);
  if (body.name.length > 255) return json({ error: "name must be 255 characters or fewer" }, 422);
  if (body.data !== undefined && typeof body.data !== "string") return json({ error: "data must be a string" }, 422);
  if (body.data !== undefined && body.data.length > 65535) return json({ error: "data must be 65535 characters or fewer" }, 422);

  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  await env.DB.prepare(
    "INSERT INTO items (id, name, data, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(id, body.name, body.data ?? null, created_at)
    .run();

  await env.KV.delete("items:list"); // invalidate cache
  return json({ id, name: body.name, data: body.data ?? null, created_at }, 201);
}

async function getItem(id: string, env: Env): Promise<Response> {
  await ensureItemsTable(env);
  const item = await env.DB.prepare("SELECT * FROM items WHERE id = ?")
    .bind(id)
    .first();
  if (!item) return json({ error: "Not found" }, 404);
  return json(item);
}

async function updateItem(
  id: string,
  request: Request,
  env: Env
): Promise<Response> {
  await ensureItemsTable(env);
  const body = await request.json<{ name?: string; data?: string }>();
  const item = await env.DB.prepare("SELECT * FROM items WHERE id = ?")
    .bind(id)
    .first<{ name: string; data: string | null }>();
  if (!item) return json({ error: "Not found" }, 404);

  if (body.name !== undefined && typeof body.name !== "string") return json({ error: "name must be a string" }, 422);
  if (body.name !== undefined && body.name.length > 255) return json({ error: "name must be 255 characters or fewer" }, 422);
  if (body.data !== undefined && typeof body.data !== "string") return json({ error: "data must be a string" }, 422);
  if (body.data !== undefined && body.data.length > 65535) return json({ error: "data must be 65535 characters or fewer" }, 422);
  const name = body.name ?? item.name;
  const data = body.data ?? item.data;
  await env.DB.prepare("UPDATE items SET name = ?, data = ? WHERE id = ?")
    .bind(name, data, id)
    .run();

  await env.KV.delete("items:list"); // invalidate cache
  return json({ id, name, data });
}

async function deleteItem(id: string, env: Env): Promise<Response> {
  await ensureItemsTable(env);
  const { meta } = await env.DB.prepare("DELETE FROM items WHERE id = ?")
    .bind(id)
    .run();
  if (meta.changes === 0) return json({ error: "Not found" }, 404);
  await env.KV.delete("items:list"); // invalidate cache
  return json({ deleted: id });
}

// ─── 4. KV caching layer ─────────────────────────────────────────────────────

async function listItemsCached(env: Env): Promise<Response> {
  await ensureItemsTable(env);
  const cached = await env.KV.get("items:list");
  if (cached) {
    return new Response(cached, {
      headers: { "Content-Type": "application/json", "X-Cache": "HIT" },
    });
  }

  const { results } = await env.DB.prepare(
    "SELECT * FROM items ORDER BY created_at DESC"
  ).all();
  const body = JSON.stringify(results);
  await env.KV.put("items:list", body, { expirationTtl: 60 });

  return new Response(body, {
    headers: { "Content-Type": "application/json", "X-Cache": "MISS" },
  });
}

async function ensureItemsTable(env: Env): Promise<void> {
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, name TEXT NOT NULL, data TEXT, created_at TEXT NOT NULL)"
  ).run();
}

// ─── 5. R2 upload/download ────────────────────────────────────────────────────

async function uploadFile(request: Request, env: Env): Promise<Response> {
  const contentType =
    request.headers.get("Content-Type") ?? "application/octet-stream";
  const key = `${crypto.randomUUID()}-${Date.now()}`;
  await env.BUCKET.put(key, request.body, {
    httpMetadata: { contentType },
  });
  return json({ key, contentType }, 201);
}

async function getFile(key: string, env: Env): Promise<Response> {
  const obj = await env.BUCKET.get(key);
  if (!obj) return json({ error: "Not found" }, 404);
  return new Response(obj.body, {
    headers: {
      "Content-Type":
        obj.httpMetadata?.contentType ?? "application/octet-stream",
    },
  });
}

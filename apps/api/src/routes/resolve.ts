// ─── Runtime Brand Resolution Route ──────────────────────────────────────────
// GET /api/resolve?brand=<key>&mode=<light|dark>
// Serves resolved CSS custom properties for a brand + mode.
// Uses KV cache (300s TTL). Returns 404 for unknown brands — no fallback.

import type { ColorMode } from '@travel/tokens';
import { serveBrandCSS } from '../services/token-service.js';
import type { Env } from '../services/brand-service.js';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function css(body: string, cacheHit: boolean): Response {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Cache': cacheHit ? 'HIT' : 'MISS',
    },
  });
}

export async function handleResolveRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const url = new URL(request.url);
  const brandKey = url.searchParams.get('brand');
  const modeParam = url.searchParams.get('mode');

  if (!brandKey) {
    return json({ error: 'brand query parameter is required' }, 400);
  }

  if (modeParam !== 'light' && modeParam !== 'dark') {
    return json({ error: "mode query parameter must be 'light' or 'dark'" }, 400);
  }

  const mode: ColorMode = modeParam;
  const accept = request.headers.get('Accept') ?? '';
  const wantJSON = accept.includes('application/json') && !accept.includes('text/css');

  const result = await serveBrandCSS(brandKey, mode, env);

  if (!result) {
    return json({ error: `Brand "${brandKey}" not found` }, 404);
  }

  if (wantJSON) {
    return json({ brandId: brandKey, mode, css: result.css, cacheHit: result.cacheHit });
  }

  return css(result.css, result.cacheHit);
}

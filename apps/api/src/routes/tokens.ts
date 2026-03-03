// ─── Token Authoring API Routes ───────────────────────────────────────────────
// GET /api/brands/:id/tokens                        — full token tree
// GET /api/brands/:id/tokens/resolved?mode=light|dark — resolved flat output
// PUT /api/brands/:id/tokens/component-overrides    — per-brand overrides

import { generateTokenStore } from '@travel/tokens';
import type { ColorMode } from '@travel/tokens';
import { getBrand, updateBrand } from '../services/brand-service.js';
import { serveBrandCSS } from '../services/token-service.js';
import type { Env } from '../services/brand-service.js';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleTokensRoute(
  request: Request,
  env: Env,
  brandId: string,
  subPath: string,
): Promise<Response> {
  const method = request.method;
  const url = new URL(request.url);

  // GET /api/brands/:id/tokens — full three-tier tree (both modes)
  if (subPath === '' && method === 'GET') {
    const brand = await getBrand(brandId, env);
    if (!brand) return json({ error: `Brand "${brandId}" not found` }, 404);

    const lightTokens = generateTokenStore(brand, 'light');
    const darkTokens = generateTokenStore(brand, 'dark');

    return json({
      brandId,
      tokens: {
        light: lightTokens,
        dark: darkTokens,
      },
      meta: {
        tokenCount: Object.keys(lightTokens).length,
        generatedAt: new Date().toISOString(),
      },
    });
  }

  // GET /api/brands/:id/tokens/resolved?mode=light|dark
  if (subPath === '/resolved' && method === 'GET') {
    const modeParam = url.searchParams.get('mode');
    if (modeParam !== 'light' && modeParam !== 'dark') {
      return json({ error: "mode query parameter must be 'light' or 'dark'" }, 400);
    }
    const mode: ColorMode = modeParam;

    const brand = await getBrand(brandId, env);
    if (!brand) return json({ error: `Brand "${brandId}" not found` }, 404);

    const result = await serveBrandCSS(brandId, mode, env);
    if (!result) return json({ error: `Brand "${brandId}" not found` }, 404);

    const tokens = generateTokenStore(brand, mode);

    return json({
      brandId,
      mode,
      tokens,
      cacheHit: result.cacheHit,
    });
  }

  // PUT /api/brands/:id/tokens/component-overrides
  if (subPath === '/component-overrides' && method === 'PUT') {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json({ error: 'Request body must be a JSON object of token overrides' }, 400);
    }

    const overrides = body as Record<string, unknown>;

    // Validate: all values must be strings
    const invalid = Object.entries(overrides).filter(([, v]) => typeof v !== 'string');
    if (invalid.length > 0) {
      return json({
        error: 'All override values must be strings',
        invalidKeys: invalid.map(([k]) => k),
      }, 400);
    }

    const brand = await getBrand(brandId, env);
    if (!brand) return json({ error: `Brand "${brandId}" not found` }, 404);

    const updated = await updateBrand(
      brandId,
      { overrides: overrides as Record<string, string> },
      env,
    );

    return json({
      brandId,
      overrides: updated.overrides ?? {},
    });
  }

  return json({ error: 'Not found' }, 404);
}

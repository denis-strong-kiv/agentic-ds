// ─── Token Validation API Route ───────────────────────────────────────────────
// POST /api/brands/:id/validate — returns structured ValidationReport

import { validateBrandTokens } from '@travel/tokens';
import { getBrand } from '../services/brand-service.js';
import type { Env } from '../services/brand-service.js';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleValidationRoute(
  _request: Request,
  env: Env,
  brandId: string,
): Promise<Response> {
  const brand = await getBrand(brandId, env);
  if (!brand) return json({ error: `Brand "${brandId}" not found` }, 404);

  const report = validateBrandTokens(brand);

  return json({
    brandId: report.brandId,
    valid: report.valid,
    errorCount: report.errors.length,
    errors: report.errors,
    contrastResults: report.contrastResults,
  }, report.valid ? 200 : 422);
}

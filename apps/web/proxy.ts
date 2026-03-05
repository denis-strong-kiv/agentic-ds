// ─── Combined i18n + Brand Resolution Proxy ────────────────────────────────
// 1. next-intl handles locale detection and URL-prefix routing (/ar/...)
// 2. Brand resolution extracts brand key from subdomain/path/header and
//    injects x-brand / x-color-mode headers for SSR consumption.

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// ─── Security: brand allow-list ───────────────────────────────────────────────
// Only known brand IDs are accepted. Unknown values fall through to 'default'.
const VALID_BRAND_IDS = new Set(['default', 'luxury', 'adventure', 'eco']);

function sanitizeBrandId(raw: string | null | undefined): string {
  if (!raw) return 'default';
  // Normalize: lowercase, strip non-alphanumeric-hyphen chars, truncate to 32
  const normalized = raw.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 32);
  return VALID_BRAND_IDS.has(normalized) ? normalized : 'default';
}

// ─── Locale middleware (next-intl) ────────────────────────────────────────────
const intlMiddleware = createMiddleware(routing);

// ─── Brand helpers ────────────────────────────────────────────────────────────

/** Extract brand key from the request using multiple strategies.
 *  All raw values are sanitized through sanitizeBrandId() before use. */
function extractBrandKey(request: NextRequest): string {
  // 1. Explicit header (e.g. from BFF or gateway)
  const headerBrand = sanitizeBrandId(request.headers.get('x-brand'));
  if (headerBrand !== 'default') return headerBrand;

  // 2. Path segment after locale prefix: /[locale]/b/<brand-id>/...
  const pathMatch = request.nextUrl.pathname.match(/\/b\/([a-z0-9-]+)\//);
  if (pathMatch) return sanitizeBrandId(pathMatch[1]);

  // 3. Subdomain: brand.example.com
  const host = request.headers.get('host') ?? '';
  const subdomain = host.split('.')[0];
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    return sanitizeBrandId(subdomain);
  }

  // 4. Default brand
  return 'default';
}

/** Extract preferred color mode from request. */
function extractColorMode(request: NextRequest): 'light' | 'dark' {
  const cookieMode = request.cookies.get('color-mode')?.value;
  if (cookieMode === 'dark') return 'dark';
  if (cookieMode === 'light') return 'light';

  const hint = request.headers.get('sec-ch-prefers-color-scheme');
  if (hint === 'dark') return 'dark';

  return 'light';
}

// ─── Combined proxy ───────────────────────────────────────────────────────────

export function proxy(request: NextRequest): NextResponse {
  // Run next-intl locale routing first
  const intlResponse = intlMiddleware(request) as NextResponse;

  // Overlay brand context headers
  const brandKey = extractBrandKey(request);
  const colorMode = extractColorMode(request);
  intlResponse.headers.set('x-brand', brandKey);
  intlResponse.headers.set('x-color-mode', colorMode);

  return intlResponse;
}

export const config = {
  // Match all paths except Next.js internals and static assets
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

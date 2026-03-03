// ─── Brand Resolution Middleware ──────────────────────────────────────────────
// Extracts brand key from subdomain, path segment, or header.
// Sets brand context headers for SSR and prefetches brand tokens CSS.

import { NextRequest, NextResponse } from 'next/server';

/** Extract brand key from the request using multiple strategies. */
function extractBrandKey(request: NextRequest): string {
  // 1. Explicit header (e.g. from BFF or gateway)
  const headerBrand = request.headers.get('x-brand');
  if (headerBrand) return headerBrand;

  // 2. Path segment: /b/<brand-id>/...
  const pathMatch = request.nextUrl.pathname.match(/^\/b\/([a-z0-9-]+)\//);
  if (pathMatch) return pathMatch[1];

  // 3. Subdomain: brand.example.com
  const host = request.headers.get('host') ?? '';
  const subdomain = host.split('.')[0];
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    return subdomain;
  }

  // 4. Default brand
  return 'default';
}

/** Extract preferred color mode from request. */
function extractColorMode(request: NextRequest): 'light' | 'dark' {
  // Honour explicit cookie set by client-side toggle
  const cookieMode = request.cookies.get('color-mode')?.value;
  if (cookieMode === 'dark') return 'dark';
  if (cookieMode === 'light') return 'light';

  // Fall back to Sec-CH-Prefers-Color-Scheme client hint
  const hint = request.headers.get('sec-ch-prefers-color-scheme');
  if (hint === 'dark') return 'dark';

  return 'light';
}

export function middleware(request: NextRequest): NextResponse {
  const brandKey = extractBrandKey(request);
  const colorMode = extractColorMode(request);

  const response = NextResponse.next();

  // Pass brand context to SSR via headers
  response.headers.set('x-brand', brandKey);
  response.headers.set('x-color-mode', colorMode);

  return response;
}

export const config = {
  // Run on all paths except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

// ─── BrandProvider ────────────────────────────────────────────────────────────
// React context provider that fetches + applies brand tokens.
// Injects CSS custom properties into <html> before paint to prevent FOUC.

'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export interface BrandTokens {
  brandId: string;
  mode: 'light' | 'dark';
  cssCustomProperties: Record<string, string>;
}

interface BrandContextValue {
  brandId: string;
  mode: 'light' | 'dark';
  tokens: BrandTokens | null;
  isLoading: boolean;
  error: string | null;
}

const BrandContext = createContext<BrandContextValue>({
  brandId: 'default',
  mode: 'light',
  tokens: null,
  isLoading: false,
  error: null,
});

export interface BrandProviderProps {
  brandId: string;
  mode?: 'light' | 'dark';
  /** Base URL of the token API (defaults to /api) */
  apiBase?: string;
  /** Optional pre-fetched CSS string (for SSR — prevents FOUC) */
  initialCSS?: string;
  children: React.ReactNode;
}

export function BrandProvider({
  brandId,
  mode = 'light',
  apiBase = '/api',
  initialCSS,
  children,
}: BrandProviderProps) {
  const [tokens, setTokens] = useState<BrandTokens | null>(null);
  const [isLoading, setIsLoading] = useState(!initialCSS);
  const [error, setError] = useState<string | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Apply CSS to <html> element's data attributes for token scoping
  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandId);
    document.documentElement.setAttribute('data-mode', mode);
  }, [brandId, mode]);

  // Apply initial SSR CSS immediately
  useEffect(() => {
    if (initialCSS && !styleRef.current) {
      const style = document.createElement('style');
      style.setAttribute('data-brand-tokens', brandId);
      style.textContent = initialCSS;
      document.head.appendChild(style);
      styleRef.current = style;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only: inject SSR CSS once; re-running would duplicate the style tag
  }, []);

  // Fetch brand tokens CSS
  useEffect(() => {
    let cancelled = false;

    async function fetchTokens() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${apiBase}/resolve?brand=${encodeURIComponent(brandId)}&mode=${mode}`,
          { headers: { Accept: 'text/css' } },
        );

        if (!res.ok) {
          const errBody = await res.json() as { error: string };
          throw new Error(errBody.error ?? `HTTP ${res.status}`);
        }

        const cssText = await res.text();

        if (cancelled) return;

        // Inject or replace style element
        if (!styleRef.current) {
          const style = document.createElement('style');
          style.setAttribute('data-brand-tokens', brandId);
          document.head.appendChild(style);
          styleRef.current = style;
        }
        styleRef.current.textContent = cssText;

        setTokens({ brandId, mode, cssCustomProperties: {} });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchTokens();

    return () => {
      cancelled = true;
    };
  }, [brandId, mode, apiBase]);

  return (
    <BrandContext.Provider value={{ brandId, mode, tokens, isLoading, error }}>
      {children}
    </BrandContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Access the current brand id and color mode. */
export function useBrand(): Pick<BrandContextValue, 'brandId' | 'mode'> {
  const { brandId, mode } = useContext(BrandContext);
  return { brandId, mode };
}

/** Access resolved brand tokens (null while loading). */
export function useBrandTokens(): BrandTokens | null {
  return useContext(BrandContext).tokens;
}

/** Access the full brand context value. */
export function useBrandContext(): BrandContextValue {
  return useContext(BrandContext);
}

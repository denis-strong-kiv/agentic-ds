import * as React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrandProvider, useBrand, useBrandContext } from '../../brand/BrandProvider.js';
import { Button } from '../ui/button.js';
import { Badge } from '../ui/badge.js';
import { Card, CardContent } from '../ui/card.js';

// ─── Fetch mock ───────────────────────────────────────────────────────────────

function makeFetchMock(cssMap: Record<string, string>) {
  return vi.fn((url: string | Request) => {
    const urlStr = url instanceof Request ? url.url : url;
    const brand = new URL(urlStr, 'http://localhost').searchParams.get('brand') ?? '';
    const mode = new URL(urlStr, 'http://localhost').searchParams.get('mode') ?? 'light';
    const key = `${brand}:${mode}`;
    const css = cssMap[key] ?? '';
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve(css),
      json: () => Promise.resolve({}),
    } as Response);
  });
}

const ACME_LIGHT_CSS = ':root { --color-primary-default: oklch(0.56 0.2 250); }';
const ACME_DARK_CSS = ':root { --color-primary-default: oklch(0.75 0.18 250); }';
const GLOBEX_LIGHT_CSS = ':root { --color-primary-default: oklch(0.50 0.22 140); }';

beforeEach(() => {
  global.fetch = makeFetchMock({
    'acme:light': ACME_LIGHT_CSS,
    'acme:dark': ACME_DARK_CSS,
    'globex:light': GLOBEX_LIGHT_CSS,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  // Clean up injected style tags
  document.querySelectorAll('style[data-brand-tokens]').forEach(el => el.remove());
  // Clean up data attributes
  document.documentElement.removeAttribute('data-brand');
  document.documentElement.removeAttribute('data-mode');
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('BrandProvider', () => {
  it('sets data-brand attribute on document root', async () => {
    render(
      <BrandProvider brandId="acme">
        <Button>Click</Button>
      </BrandProvider>
    );
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-brand')).toBe('acme');
    });
  });

  it('sets data-mode attribute on document root', async () => {
    render(
      <BrandProvider brandId="acme" mode="dark">
        <Button>Click</Button>
      </BrandProvider>
    );
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    });
  });

  it('injects CSS custom properties into document head', async () => {
    render(
      <BrandProvider brandId="acme" mode="light">
        <div />
      </BrandProvider>
    );
    await waitFor(() => {
      const styleEl = document.querySelector('style[data-brand-tokens="acme"]');
      expect(styleEl).toBeInTheDocument();
      expect(styleEl!.textContent).toBe(ACME_LIGHT_CSS);
    });
  });

  it('applies initialCSS immediately without waiting for fetch', async () => {
    render(
      <BrandProvider brandId="acme" initialCSS={ACME_LIGHT_CSS}>
        <div />
      </BrandProvider>
    );
    // Style should be injected synchronously via useEffect
    await act(async () => {});
    const styleEl = document.querySelector('style[data-brand-tokens="acme"]');
    expect(styleEl).toBeInTheDocument();
    expect(styleEl!.textContent).toBe(ACME_LIGHT_CSS);
  });

  it('injects different CSS for two brands', async () => {
    const { unmount } = render(
      <BrandProvider brandId="acme" mode="light">
        <div />
      </BrandProvider>
    );
    await waitFor(() => {
      const styleEl = document.querySelector('style[data-brand-tokens="acme"]');
      expect(styleEl!.textContent).toContain('0.56');
    });
    unmount();

    // Clean up
    document.querySelectorAll('style[data-brand-tokens]').forEach(el => el.remove());

    render(
      <BrandProvider brandId="globex" mode="light">
        <div />
      </BrandProvider>
    );
    await waitFor(() => {
      const styleEl = document.querySelector('style[data-brand-tokens="globex"]');
      expect(styleEl!.textContent).toContain('0.50');
    });
  });

  it('updates data-mode when mode prop changes', async () => {
    const { rerender } = render(
      <BrandProvider brandId="acme" mode="light">
        <div />
      </BrandProvider>
    );
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-mode')).toBe('light');
    });

    rerender(
      <BrandProvider brandId="acme" mode="dark">
        <div />
      </BrandProvider>
    );
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    });
  });

  it('fetches dark CSS when mode is dark', async () => {
    render(
      <BrandProvider brandId="acme" mode="dark">
        <div />
      </BrandProvider>
    );
    await waitFor(() => {
      const styleEl = document.querySelector('style[data-brand-tokens="acme"]');
      expect(styleEl!.textContent).toBe(ACME_DARK_CSS);
    });
  });
});

describe('useBrand hook', () => {
  function BrandDisplay() {
    const { brandId, mode } = useBrand();
    return <div data-testid="brand-display">{brandId}:{mode}</div>;
  }

  it('provides brandId and mode from context', async () => {
    render(
      <BrandProvider brandId="acme" mode="light">
        <BrandDisplay />
      </BrandProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('brand-display')).toHaveTextContent('acme:light');
    });
  });

  it('returns default values when no BrandProvider wraps the component', () => {
    render(<BrandDisplay />);
    expect(screen.getByTestId('brand-display')).toHaveTextContent('default:light');
  });
});

describe('useBrandContext hook', () => {
  function ContextDisplay() {
    const { isLoading, error } = useBrandContext();
    if (isLoading) return <div data-testid="status">Loading...</div>;
    if (error) return <div data-testid="status">Error: {error}</div>;
    return <div data-testid="status">Ready</div>;
  }

  it('starts in loading state', () => {
    render(
      <BrandProvider brandId="acme">
        <ContextDisplay />
      </BrandProvider>
    );
    // Initial render should show loading
    expect(screen.getByTestId('status')).toHaveTextContent('Loading...');
  });

  it('transitions to ready state after fetch completes', async () => {
    render(
      <BrandProvider brandId="acme">
        <ContextDisplay />
      </BrandProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('Ready');
    });
  });

  it('shows error state when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Brand not found' }),
      text: () => Promise.resolve(''),
    } as Response);

    render(
      <BrandProvider brandId="unknown">
        <ContextDisplay />
      </BrandProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('Error: Brand not found');
    });
  });
});

describe('UI components under BrandProvider', () => {
  it('renders Button without console errors under brand context', async () => {
    const consoleSpy = vi.spyOn(console, 'error');
    render(
      <BrandProvider brandId="acme">
        <Button>Book Now</Button>
        <Button variant="secondary">Save</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="ghost">Skip</Button>
        <Button variant="destructive">Delete</Button>
      </BrandProvider>
    );
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('renders Badge variants without errors under brand context', async () => {
    const consoleSpy = vi.spyOn(console, 'error');
    render(
      <BrandProvider brandId="acme">
        <Badge>Default</Badge>
        <Badge variant="deal">Deal</Badge>
        <Badge variant="new">New</Badge>
        <Badge variant="popular">Popular</Badge>
      </BrandProvider>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('renders Card without errors under brand context', async () => {
    const consoleSpy = vi.spyOn(console, 'error');
    render(
      <BrandProvider brandId="acme">
        <Card>
          <CardContent>Hello from Acme!</CardContent>
        </Card>
      </BrandProvider>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

import type { Meta, StoryObj } from '@storybook/react';
import { brandTokens, type BrandId, type ColorMode } from '../tokens/brand-tokens.js';
import { useMemo } from 'react';

const meta: Meta = {
  title: 'Showcase/Contrast Checker',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

/** Parse oklch() string to approximate relative luminance via conversion */
function parseOklch(value: string): [number, number, number] | null {
  const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) return null;
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
}

/** Approximate sRGB from OKLCH (simplified, enough for contrast estimation) */
function oklchToLinearLuminance(l: number, _c: number, _h: number): number {
  // Just use L as a proxy for relative luminance (simplified for visualization)
  // A real impl would convert OKLCH → Oklab → linear sRGB → relative luminance
  const linearL = l <= 0.04045 / 12.92 ? l / 12.92 : Math.pow((l + 0.055) / 1.055, 2.4);
  return linearL;
}

function getRelativeLuminance(oklchStr: string): number | null {
  const parsed = parseOklch(oklchStr);
  if (!parsed) return null;
  return oklchToLinearLuminance(parsed[0], parsed[1], parsed[2]);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastLevel(ratio: number): { aa: boolean; aaa: boolean; aaLarge: boolean; aaaLarge: boolean } {
  return {
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

function ContrastBadge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 700,
      background: pass ? 'oklch(0.45 0.16 145)' : 'oklch(0.45 0.22 20)',
      color: '#fff',
      marginRight: 4,
    }}>
      {pass ? '✓' : '✗'} {label}
    </span>
  );
}

interface TokenPair {
  label: string;
  fg: string;
  bg: string;
  fgKey: string;
  bgKey: string;
}

function extractTokenPairs(tokens: Record<string, string>): TokenPair[] {
  return [
    {
      label: 'Primary bg / Primary fg',
      fg: tokens['--color-primary-foreground'] ?? 'oklch(1 0 0)',
      bg: tokens['--color-primary-default'] ?? 'oklch(0.5 0.2 250)',
      fgKey: '--color-primary-foreground',
      bgKey: '--color-primary-default',
    },
    {
      label: 'Accent bg / Accent fg',
      fg: tokens['--color-accent-foreground'] ?? 'oklch(1 0 0)',
      bg: tokens['--color-accent-default'] ?? 'oklch(0.5 0.2 285)',
      fgKey: '--color-accent-foreground',
      bgKey: '--color-accent-default',
    },
    {
      label: 'Page bg / Default text',
      fg: tokens['--color-foreground-default'] ?? 'oklch(0.15 0 0)',
      bg: tokens['--color-background-default'] ?? 'oklch(0.99 0 0)',
      fgKey: '--color-foreground-default',
      bgKey: '--color-background-default',
    },
    {
      label: 'Page bg / Muted text',
      fg: tokens['--color-foreground-muted'] ?? 'oklch(0.5 0 0)',
      bg: tokens['--color-background-default'] ?? 'oklch(0.99 0 0)',
      fgKey: '--color-foreground-muted',
      bgKey: '--color-background-default',
    },
    {
      label: 'Card surface / Default text',
      fg: tokens['--color-foreground-default'] ?? 'oklch(0.15 0 0)',
      bg: tokens['--color-surface-card'] ?? 'oklch(0.97 0 0)',
      fgKey: '--color-foreground-default',
      bgKey: '--color-surface-card',
    },
    {
      label: 'Success bg / Success fg',
      fg: tokens['--color-success-foreground'] ?? 'oklch(1 0 0)',
      bg: tokens['--color-success-default'] ?? 'oklch(0.65 0.17 145)',
      fgKey: '--color-success-foreground',
      bgKey: '--color-success-default',
    },
    {
      label: 'Error bg / Error fg',
      fg: tokens['--color-error-foreground'] ?? 'oklch(1 0 0)',
      bg: tokens['--color-error-default'] ?? 'oklch(0.55 0.22 20)',
      fgKey: '--color-error-foreground',
      bgKey: '--color-error-default',
    },
  ];
}

function ContrastRow({ pair }: { pair: TokenPair }) {
  const fgL = getRelativeLuminance(pair.fg);
  const bgL = getRelativeLuminance(pair.bg);

  if (fgL === null || bgL === null) {
    return (
      <tr>
        <td colSpan={5} style={{ padding: '10px 12px', fontSize: 12, color: 'var(--color-foreground-muted)' }}>
          Cannot parse: {pair.label}
        </td>
      </tr>
    );
  }

  const ratio = contrastRatio(fgL, bgL);
  const levels = getContrastLevel(ratio);

  return (
    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 20, background: pair.bg, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 3 }} />
          <div style={{ width: 16, height: 20, background: pair.fg, borderRadius: 3 }} />
          <span style={{ fontSize: 12, color: '#555' }}>{pair.label}</span>
        </div>
      </td>
      <td style={{ padding: '10px 12px', fontWeight: 700, fontSize: 14 }}>
        {ratio.toFixed(2)}:1
      </td>
      <td style={{ padding: '10px 12px' }}>
        <ContrastBadge label="AA" pass={levels.aa} />
        <ContrastBadge label="AAA" pass={levels.aaa} />
      </td>
      <td style={{ padding: '10px 12px' }}>
        <ContrastBadge label="AA Large" pass={levels.aaLarge} />
        <ContrastBadge label="AAA Large" pass={levels.aaaLarge} />
      </td>
      <td style={{ padding: '10px 12px', background: pair.bg }}>
        <span style={{ color: pair.fg, fontSize: 14, fontWeight: 500 }}>Sample text</span>
      </td>
    </tr>
  );
}

function ContrastTable({ brandId, mode }: { brandId: BrandId; mode: ColorMode }) {
  const tokens = brandTokens[brandId][mode];
  const pairs = useMemo(() => extractTokenPairs(tokens), [tokens]);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: '0.75rem' }}>
        {brandId} &mdash; {mode}
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <thead>
          <tr style={{ background: '#f4f4f6' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Pair</th>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Ratio</th>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Normal text</th>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Large text</th>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair) => (
            <ContrastRow key={pair.label} pair={pair} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const DefaultBrand: Story = {
  name: 'Default Brand',
  render: (_, { globals }) => {
    const mode = (globals.colorMode ?? 'light') as ColorMode;
    return (
      <div style={{ maxWidth: 820, margin: '0 auto', fontFamily: 'system-ui, sans-serif', padding: '1rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: '0.5rem' }}>WCAG Contrast Checker</h2>
        <p style={{ fontSize: 13, color: '#666', marginBottom: '2rem' }}>
          Computed contrast ratios for semantic token pairs. AA = 4.5:1 (normal), 3:1 (large). AAA = 7:1 (normal), 4.5:1 (large).
          <br />
          <em>Note: ratios are estimated from OKLCH lightness — use browser tooling for certified values.</em>
        </p>
        <ContrastTable brandId="default" mode={mode} />
      </div>
    );
  },
};

export const AllBrands: Story = {
  name: 'All Brands',
  render: (_, { globals }) => {
    const mode = (globals.colorMode ?? 'light') as ColorMode;
    return (
      <div style={{ maxWidth: 820, margin: '0 auto', fontFamily: 'system-ui, sans-serif', padding: '1rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: '2rem' }}>Contrast Audit — All Brands</h2>
        {(['default', 'luxury', 'adventure', 'eco'] as BrandId[]).map(id => (
          <ContrastTable key={id} brandId={id} mode={mode} />
        ))}
      </div>
    );
  },
};

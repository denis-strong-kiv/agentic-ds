import type { Meta, StoryObj } from '@storybook/react';
import { brandTokens, type BrandId, type ColorMode } from '../tokens/brand-tokens.js';
import React from 'react';

const meta: Meta = {
  title: 'Showcase/Palette Viewer',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

/** Swatch grid for a semantic color group extracted from token vars */
function SemanticGroup({ label, vars, tokens }: {
  label: string;
  vars: string[];
  tokens: Record<string, string>;
}) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: tokens['--color-foreground-muted'] ?? '#888', marginBottom: '0.5rem' }}>
        {label}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {vars.map(v => {
          const value = tokens[v];
          if (!value) return null;
          return (
            <div key={v} style={{ width: 80 }}>
              <div
                style={{
                  height: 56,
                  borderRadius: 4,
                  background: value,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
                title={value}
              />
              <p style={{ fontSize: 10, marginTop: 4, wordBreak: 'break-all', color: tokens['--color-foreground-muted'] ?? '#888' }}>
                {v.replace('--color-', '')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaletteDisplay({ brandId, mode }: { brandId: BrandId; mode: ColorMode }) {
  const tokens = brandTokens[brandId][mode];
  const bg = tokens['--color-background-default'] ?? '#fff';
  const fg = tokens['--color-foreground-default'] ?? '#000';

  return (
    <div style={{ background: bg, color: fg, padding: '1.5rem', minHeight: '100vh' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: '0.25rem' }}>
        {brandId} &mdash; {mode}
      </h2>
      <p style={{ fontSize: 13, color: tokens['--color-foreground-muted'], marginBottom: '2rem' }}>
        Derived token palette
      </p>

      <SemanticGroup label="Primary" tokens={tokens} vars={['--color-primary-default', '--color-primary-hover', '--color-primary-active', '--color-primary-foreground']} />
      <SemanticGroup label="Accent" tokens={tokens} vars={['--color-accent-default', '--color-accent-hover', '--color-accent-active', '--color-accent-foreground']} />
      <SemanticGroup label="Secondary" tokens={tokens} vars={['--color-secondary-default', '--color-secondary-hover', '--color-secondary-foreground']} />
      <SemanticGroup label="Neutral — Backgrounds" tokens={tokens} vars={['--color-background-default', '--color-background-subtle', '--color-surface-card', '--color-surface-popover']} />
      <SemanticGroup label="Neutral — Foregrounds" tokens={tokens} vars={['--color-foreground-default', '--color-foreground-muted', '--color-foreground-subtle']} />
      <SemanticGroup label="Neutral — Borders" tokens={tokens} vars={['--color-border-default', '--color-border-muted']} />
      <SemanticGroup label="Success" tokens={tokens} vars={['--color-success-default', '--color-success-foreground', '--color-success-subtle']} />
      <SemanticGroup label="Warning" tokens={tokens} vars={['--color-warning-default', '--color-warning-foreground', '--color-warning-subtle']} />
      <SemanticGroup label="Error" tokens={tokens} vars={['--color-error-default', '--color-error-foreground', '--color-error-subtle']} />
      <SemanticGroup label="Info" tokens={tokens} vars={['--color-info-default', '--color-info-foreground', '--color-info-subtle']} />
    </div>
  );
}

export const DefaultLight: Story = {
  name: 'Default — Light',
  render: () => <PaletteDisplay brandId="default" mode="light" />,
};

export const DefaultDark: Story = {
  name: 'Default — Dark',
  render: () => <PaletteDisplay brandId="default" mode="dark" />,
};

export const LuxuryLight: Story = {
  name: 'Luxury Airways — Light',
  render: () => <PaletteDisplay brandId="luxury" mode="light" />,
};

export const AdventureLight: Story = {
  name: 'Adventure Co — Light',
  render: () => <PaletteDisplay brandId="adventure" mode="light" />,
};

export const EcoLight: Story = {
  name: 'Eco Getaways — Light',
  render: () => <PaletteDisplay brandId="eco" mode="light" />,
};

export const AllBrandsLightPreview: Story = {
  name: 'All Brands — Primary Swatches',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
      {(['default', 'luxury', 'adventure', 'eco'] as BrandId[]).map(id => {
        const light = brandTokens[id].light;
        const dark = brandTokens[id].dark;
        return (
          <div key={id}>
            <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: 15 }}>{id}</p>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
              {(['--color-primary-default', '--color-accent-default', '--color-success-default', '--color-warning-default', '--color-error-default'] as const).map(v => (
                <div key={v} style={{ flex: 1, height: 40, borderRadius: 4, background: light[v] ?? '#ccc' }} title={`${v}: ${light[v]}`} />
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#666' }}>Light &nbsp;|&nbsp; Shape: {light['--shape-preset-button']}</p>
          </div>
        );
      })}
    </div>
  ),
};

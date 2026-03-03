import type { Meta, StoryObj } from '@storybook/react';
import { brandTokens, type BrandId } from '../tokens/brand-tokens.js';
import type { ColorMode } from '../tokens/brand-tokens.js';

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

function PaletteDisplay({ brandId, mode }: { brandId: BrandId; mode?: ColorMode }) {
  if (!mode) {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0 }}><PaletteDisplay brandId={brandId} mode="light" /></div>
        <div style={{ flex: 1, minWidth: 0 }}><PaletteDisplay brandId={brandId} mode="dark" /></div>
      </div>
    );
  }
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

export const Default: Story = {
  name: 'Default',
  render: () => <PaletteDisplay brandId="default" />,
};

export const Luxury: Story = {
  name: 'Luxury Airways',
  render: () => <PaletteDisplay brandId="luxury" />,
};

export const Adventure: Story = {
  name: 'Adventure Co',
  render: () => <PaletteDisplay brandId="adventure" />,
};

export const Eco: Story = {
  name: 'Eco Getaways',
  render: () => <PaletteDisplay brandId="eco" />,
};

export const AllBrands: Story = {
  name: 'All Brands — Primary Swatches',
  render: () => (
    <div style={{ padding: '1.5rem' }}>
      {(['default', 'luxury', 'adventure', 'eco'] as BrandId[]).map(id => (
        <div key={id} style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: 15, textTransform: 'capitalize' }}>{id}</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {(['light', 'dark'] as ColorMode[]).map(m => {
              const tokens = brandTokens[id][m];
              return (
                <div key={m} style={{ flex: 1, padding: '0.75rem', borderRadius: 6, background: tokens['--color-background-default'], border: '1px solid rgba(128,128,128,0.2)' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: tokens['--color-foreground-muted'], marginBottom: '0.5rem' }}>{m}</p>
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.4rem' }}>
                    {(['--color-primary-default', '--color-accent-default', '--color-success-default', '--color-warning-default', '--color-error-default'] as const).map(v => (
                      <div key={v} style={{ flex: 1, height: 36, borderRadius: 4, background: tokens[v] ?? '#ccc' }} title={`${v}: ${tokens[v]}`} />
                    ))}
                  </div>
                  <p style={{ fontSize: 10, color: tokens['--color-foreground-muted'] }}>Shape: {tokens['--shape-preset-button']}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';
import {
  deriveFullPalette,
  oklchToCSS,
  type BrandColorConfig,
  type ColorMode,
  type ColorScaleStep,
} from '@travel/tokens';

type BrandId = 'default' | 'luxury' | 'adventure' | 'eco';

const STEPS: ColorScaleStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const brandConfigs: Record<BrandId, BrandColorConfig> = {
  default: {
    id: 'default',
    displayName: 'Default',
    primarySeed: { lightness: 0.56, chroma: 0.2, hue: 250 },
    accentSeed: { lightness: 0.62, chroma: 0.18, hue: 30 },
    neutralTemperature: 'neutral',
    semanticTemperature: 'neutral',
    shape: 'rounded',
    fonts: { display: 'Playfair Display', heading: 'Inter', body: 'Inter' },
  },
  luxury: {
    id: 'luxury',
    displayName: 'Luxury Airways',
    primarySeed: { lightness: 0.32, chroma: 0.12, hue: 255 },
    accentSeed: { lightness: 0.72, chroma: 0.16, hue: 85 },
    neutralTemperature: 'neutral',
    semanticTemperature: 'neutral',
    shape: 'sharp',
    fonts: { display: 'Playfair Display', heading: 'Inter', body: 'Inter' },
  },
  adventure: {
    id: 'adventure',
    displayName: 'Adventure Co',
    primarySeed: { lightness: 0.46, chroma: 0.15, hue: 150 },
    accentSeed: { lightness: 0.62, chroma: 0.2, hue: 55 },
    neutralTemperature: 'neutral',
    semanticTemperature: 'neutral',
    shape: 'rounded',
    fonts: { display: 'Playfair Display', heading: 'Inter', body: 'Inter' },
  },
  eco: {
    id: 'eco',
    displayName: 'Eco Getaways',
    primarySeed: { lightness: 0.46, chroma: 0.16, hue: 195 },
    accentSeed: { lightness: 0.68, chroma: 0.17, hue: 75 },
    neutralTemperature: 'neutral',
    semanticTemperature: 'neutral',
    shape: 'pill',
    fonts: { display: 'Playfair Display', heading: 'Inter', body: 'Inter' },
  },
};

const meta: Meta = {
  title: 'Showcase/OKLCH Ramps',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

function RampRow({
  label,
  mode,
  kind,
  brandId,
}: {
  label: string;
  mode: ColorMode;
  kind: 'primary' | 'accent' | 'secondary' | 'neutral';
  brandId: BrandId;
}) {
  const palette = useMemo(
    () => deriveFullPalette(brandConfigs[brandId]),
    [brandId],
  );
  const scale = palette[kind][mode];

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
        <span style={{ fontSize: 11, color: '#666' }}>
          {kind === 'neutral' ? 'neutralTemperature' : 'seed-driven'} · {mode}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap', overflowX: 'auto' }}>
        {STEPS.map((step) => {
          const c = scale[step];
          const css = oklchToCSS(c);
          return (
            <div
              key={step}
              style={{
                width: 64,
                borderRadius: 6,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.12)',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <div
                style={{
                  height: 40,
                  background: css,
                }}
                title={css}
              />
              <div style={{ padding: '4px 6px' }}>
                <div style={{ fontSize: 10, fontWeight: 600 }}> {step}</div>
                <div style={{ fontSize: 9, color: '#555' }}>
                  L {c.lightness.toFixed(2)}
                </div>
                <div style={{ fontSize: 9, color: '#555' }}>
                  C {c.chroma.toFixed(2)}
                </div>
                <div style={{ fontSize: 9, color: '#555' }}>
                  H {Math.round(c.hue)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OKLCHRampsExplorer({
  brandId,
  mode,
}: {
  brandId: BrandId;
  mode: ColorMode;
}) {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Seed & Neutral Ramps</h2>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
          Visualizes the raw OKLCH ramps generated from the brand&apos;s primary and accent seeds,
          plus the derived neutral ramp, for both light and dark modes.
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <RampRow label="Primary Ramp" kind="primary" mode={mode} brandId={brandId} />
        <RampRow label="Accent Ramp" kind="accent" mode={mode} brandId={brandId} />
        <RampRow label="Secondary Ramp" kind="secondary" mode={mode} brandId={brandId} />
        <RampRow label="Neutral Ramp" kind="neutral" mode={mode} brandId={brandId} />
      </section>
    </div>
  );
}

export const Explorer: Story = {
  name: 'Seed & Neutral Ramps',
  render: (_, { globals }) => {
    const brandId = (globals.brand as BrandId) ?? 'default';
    const mode = (globals.colorMode as ColorMode) ?? 'light';
    return <OKLCHRampsExplorer brandId={brandId} mode={mode} />;
  },
};


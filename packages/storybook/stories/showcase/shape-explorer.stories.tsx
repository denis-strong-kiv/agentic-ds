import type { Meta, StoryObj } from '@storybook/react';
import { brandTokens, type BrandId, type ColorMode } from '../tokens/brand-tokens.js';
import { useEffect, useRef } from 'react';

const meta: Meta = {
  title: 'Showcase/Shape Explorer',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type ShapePreset = 'sharp' | 'rounded' | 'pill';

const SHAPE_CONFIGS: Record<ShapePreset, {
  button: string;
  card: string;
  input: string;
  badge: string;
  dialog: string;
  description: string;
}> = {
  sharp: {
    button: '2px',
    card: '4px',
    input: '2px',
    badge: '2px',
    dialog: '4px',
    description: 'Clinical, architectural. Used by Luxury Airways brand.',
  },
  rounded: {
    button: '8px',
    card: '12px',
    input: '8px',
    badge: '6px',
    dialog: '16px',
    description: 'Friendly, modern. Default and Adventure brand.',
  },
  pill: {
    button: '9999px',
    card: '24px',
    input: '9999px',
    badge: '9999px',
    dialog: '24px',
    description: 'Playful, approachable. Eco Getaways brand.',
  },
};

function ComponentShowcase({ preset }: { preset: ShapePreset }) {
  const cfg = SHAPE_CONFIGS[preset];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Button */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 6 }}>Button</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button style={{ borderRadius: cfg.button, padding: '8px 20px', background: 'var(--color-primary-default)', color: 'var(--color-primary-foreground)', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            Search Flights
          </button>
          <button style={{ borderRadius: cfg.button, padding: '8px 20px', background: 'transparent', color: 'var(--color-primary-default)', border: '1.5px solid var(--color-primary-default)', cursor: 'pointer', fontSize: 14 }}>
            View Hotels
          </button>
          <button style={{ borderRadius: cfg.button, padding: '8px 20px', background: 'var(--color-accent-default)', color: 'var(--color-accent-foreground)', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            Book Now
          </button>
        </div>
      </div>

      {/* Input */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 6 }}>Input</p>
        <input
          style={{ borderRadius: cfg.input, padding: '8px 14px', border: '1.5px solid var(--color-border-default)', background: 'var(--color-background-default)', color: 'var(--color-foreground-default)', fontSize: 14, outline: 'none', width: 240 }}
          placeholder="Where do you want to go?"
          readOnly
        />
      </div>

      {/* Badge */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 6 }}>Badge</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['DEAL', 'NEW', 'POPULAR', '+3 more'].map(label => (
            <span key={label} style={{ borderRadius: cfg.badge, padding: '2px 10px', background: 'var(--color-primary-default)', color: 'var(--color-primary-foreground)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Card */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 6 }}>Card</p>
        <div style={{ borderRadius: cfg.card, padding: '1.25rem', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-muted)', width: 300 }}>
          <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-foreground-default)', marginBottom: 4 }}>Santorini, Greece</p>
          <p style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>5-night stay · Jun 15–20</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-default)', marginTop: 12 }}>
            $1,240 <span style={{ fontSize: 12, fontWeight: 400 }}>/ person</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ShapeFrameWithStyle({ preset, mode = 'light' }: { preset: ShapePreset; mode?: ColorMode }) {
  const tokens = brandTokens.default[mode];
  const styleEl = useRef<HTMLStyleElement | null>(null);
  const frameId = `shape-frame-${preset}-${mode}`;

  useEffect(() => {
    if (!styleEl.current) {
      styleEl.current = document.createElement('style');
      document.head.appendChild(styleEl.current);
    }
    const vars = Object.entries(tokens).map(([k, v]) => `${k}: ${v};`).join('\n');
    styleEl.current.textContent = `#${frameId} { ${vars} }`;
    return () => { if (styleEl.current) document.head.removeChild(styleEl.current); styleEl.current = null; };
  }, [frameId, tokens]);

  return (
    <div id={frameId} style={{ background: tokens['--color-background-default'], color: tokens['--color-foreground-default'], padding: '1.5rem', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)' }}>
      <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{preset}</p>
      <p style={{ fontSize: 12, color: '#888', marginBottom: '1.5rem' }}>{SHAPE_CONFIGS[preset].description}</p>
      <ComponentShowcase preset={preset} />
    </div>
  );
}

export const AllPresets: Story = {
  name: 'Sharp / Rounded / Pill — Light & Dark',
  render: () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
        <ShapeFrameWithStyle preset="sharp" mode="light" />
        <ShapeFrameWithStyle preset="rounded" mode="light" />
        <ShapeFrameWithStyle preset="pill" mode="light" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem', padding: '1rem', background: '#0f0f14' }}>
        <ShapeFrameWithStyle preset="sharp" mode="dark" />
        <ShapeFrameWithStyle preset="rounded" mode="dark" />
        <ShapeFrameWithStyle preset="pill" mode="dark" />
      </div>
    </>
  ),
};

export const BrandShapeMapping: Story = {
  name: 'Brand → Shape Mapping',
  render: () => {
    const mapping: Array<[BrandId, ShapePreset, string]> = [
      ['default', 'rounded', 'TravelCo — friendly, modern'],
      ['luxury', 'sharp', 'Luxury Airways — premium, architectural'],
      ['adventure', 'rounded', 'Adventure Co — bold, energetic'],
      ['eco', 'pill', 'Eco Getaways — soft, organic'],
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
        {mapping.map(([brandId, preset, desc]) => {
          const tokens = brandTokens[brandId].light;
          return (
            <div key={brandId} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: tokens['--color-primary-default'], height: 6 }} />
              <div style={{ padding: '1.25rem', background: tokens['--color-background-default'], color: tokens['--color-foreground-default'] }}>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{desc}</p>
                <p style={{ fontSize: 11, color: '#888', marginBottom: '1rem' }}>Shape preset: <strong>{preset}</strong></p>
                <button style={{ borderRadius: SHAPE_CONFIGS[preset].button, padding: '8px 20px', background: tokens['--color-primary-default'], color: tokens['--color-primary-foreground'], border: 'none', cursor: 'pointer', fontSize: 13 }}>
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

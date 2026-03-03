import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Showcase/Temperature Explorer',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type Temperature = 'warm' | 'cool' | 'neutral';

/** Hardcoded temperature shift values applied on top of base brand tokens */
const NEUTRAL_TEMPERATURE_DESC: Record<Temperature, string> = {
  warm: 'Surfaces and neutrals shift toward warm tones (hue 30–60°). Inviting, cozy.',
  cool: 'Surfaces and neutrals shift toward cool tones (hue 220–260°). Crisp, corporate.',
  neutral: 'Balanced grey neutrals with no hue bias.',
};

const SEMANTIC_TEMPERATURE_DESC: Record<Temperature, string> = {
  warm: 'Semantic colors (success, warning, error) lean warm — amber success, coral error.',
  cool: 'Semantic colors lean cool — teal success, cool-indigo info.',
  neutral: 'Standard semantic mapping without temperature shift.',
};

/** Visual representation of neutral temperature via background/surface colors */
const NEUTRAL_SWATCHES: Record<Temperature, { bg: string; surface: string; border: string; muted: string }> = {
  warm: { bg: 'oklch(0.97 0.01 55)', surface: 'oklch(0.94 0.02 50)', border: 'oklch(0.82 0.04 45)', muted: 'oklch(0.55 0.04 45)' },
  cool: { bg: 'oklch(0.97 0.01 245)', surface: 'oklch(0.93 0.02 240)', border: 'oklch(0.82 0.04 235)', muted: 'oklch(0.55 0.04 235)' },
  neutral: { bg: 'oklch(0.97 0.00 0)', surface: 'oklch(0.93 0.00 0)', border: 'oklch(0.82 0.00 0)', muted: 'oklch(0.55 0.00 0)' },
};

/** Visual representation of semantic temperature */
const SEMANTIC_SWATCHES: Record<Temperature, { success: string; warning: string; error: string; info: string }> = {
  warm: { success: 'oklch(0.68 0.17 88)', warning: 'oklch(0.72 0.18 55)', error: 'oklch(0.56 0.22 22)', info: 'oklch(0.62 0.12 200)' },
  cool: { success: 'oklch(0.62 0.16 170)', warning: 'oklch(0.70 0.17 75)', error: 'oklch(0.55 0.22 15)', info: 'oklch(0.58 0.16 255)' },
  neutral: { success: 'oklch(0.65 0.17 145)', warning: 'oklch(0.72 0.18 75)', error: 'oklch(0.55 0.22 20)', info: 'oklch(0.58 0.14 235)' },
};

function TemperatureCard({ label, value, onChange, descriptions }: {
  label: string;
  value: Temperature;
  onChange: (v: Temperature) => void;
  descriptions: Record<Temperature, string>;
}) {
  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, padding: '1.25rem' }}>
      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{label}</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {(['warm', 'neutral', 'cool'] as Temperature[]).map(t => (
          <button
            key={t}
            onClick={() => onChange(t)}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: 6,
              border: value === t ? '2px solid #4f46e5' : '1.5px solid rgba(0,0,0,0.15)',
              background: value === t ? '#4f46e5' : 'transparent',
              color: value === t ? '#fff' : '#333',
              fontWeight: value === t ? 700 : 400,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{descriptions[value]}</p>
    </div>
  );
}

function NeutralDemo({ temp }: { temp: Temperature }) {
  const s = NEUTRAL_SWATCHES[temp];
  return (
    <div style={{ background: s.bg, padding: '1.5rem', borderRadius: 8, border: `1px solid ${s.border}`, transition: 'all 0.3s' }}>
      <p style={{ color: '#555', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Neutral Surfaces</p>
      <div style={{ display: 'flex', gap: 8 }}>
        {[['bg', s.bg, 'Background'], ['surface', s.surface, 'Surface'], ['border', s.border, 'Border'], ['muted', s.muted, 'Muted text']].map(([k, color, name]) => (
          <div key={k} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 48, borderRadius: 6, background: color as string, border: '1px solid rgba(0,0,0,0.06)' }} />
            <p style={{ fontSize: 10, color: '#666', marginTop: 4 }}>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SemanticDemo({ temp }: { temp: Temperature }) {
  const s = SEMANTIC_SWATCHES[temp];
  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', transition: 'all 0.3s' }}>
      <p style={{ color: '#555', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Semantic Colors</p>
      <div style={{ display: 'flex', gap: 8 }}>
        {[['success', s.success, 'Success'], ['warning', s.warning, 'Warning'], ['error', s.error, 'Error'], ['info', s.info, 'Info']].map(([k, color, name]) => (
          <div key={k} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 48, borderRadius: 6, background: color as string }} />
            <p style={{ fontSize: 10, color: '#666', marginTop: 4 }}>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InteractiveExplorer() {
  const [neutralTemp, setNeutralTemp] = useState<Temperature>('neutral');
  const [semanticTemp, setSemanticTemp] = useState<Temperature>('neutral');

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Temperature Explorer</h2>
      <p style={{ fontSize: 14, color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
        Temperature shifts the emotional hue of the design without changing the primary brand color.
        Neutral temperature affects surfaces and background tones; semantic temperature shifts the
        meaning-bearing status colors.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <TemperatureCard
          label="Neutral Temperature"
          value={neutralTemp}
          onChange={setNeutralTemp}
          descriptions={NEUTRAL_TEMPERATURE_DESC}
        />
        <TemperatureCard
          label="Semantic Temperature"
          value={semanticTemp}
          onChange={setSemanticTemp}
          descriptions={SEMANTIC_TEMPERATURE_DESC}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <NeutralDemo temp={neutralTemp} />
        <SemanticDemo temp={semanticTemp} />
      </div>

      <div style={{ padding: '1rem', background: '#f8f8f8', borderRadius: 6, fontSize: 12, color: '#555' }}>
        <strong>Token config:&nbsp;</strong>
        <code>{`neutralTemperature: "${neutralTemp}", semanticTemperature: "${semanticTemp}"`}</code>
      </div>
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive Temperature Selector',
  render: () => <InteractiveExplorer />,
};

export const WarmWarm: Story = {
  name: 'Warm Neutral + Warm Semantic',
  render: () => (
    <div style={{ maxWidth: 640, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: '1rem' }}>Warm × Warm — Cozy Resort Brand</h3>
      <NeutralDemo temp="warm" />
      <div style={{ marginTop: '1rem' }} />
      <SemanticDemo temp="warm" />
    </div>
  ),
};

export const CoolCool: Story = {
  name: 'Cool Neutral + Cool Semantic',
  render: () => (
    <div style={{ maxWidth: 640, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: '1rem' }}>Cool × Cool — Business Travel Brand</h3>
      <NeutralDemo temp="cool" />
      <div style={{ marginTop: '1rem' }} />
      <SemanticDemo temp="cool" />
    </div>
  ),
};

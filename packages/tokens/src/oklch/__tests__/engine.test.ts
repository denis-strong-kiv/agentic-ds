import { describe, it, expect } from 'vitest';
import { generateColorScale, deriveFullPalette, deriveShapeTokens } from '../engine.js';
import { contrastRatio, meetsContrastAA } from '../utils.js';
import type { OKLCHColor, BrandColorConfig } from '../types.js';

const primarySeed: OKLCHColor = { lightness: 0.56, chroma: 0.20, hue: 250 };
const accentSeed: OKLCHColor = { lightness: 0.62, chroma: 0.18, hue: 30 };

const baseConfig: BrandColorConfig = {
  primarySeed,
  accentSeed,
  neutralTemperature: 'neutral',
  semanticTemperature: 'neutral',
};

// ─── generateColorScale ───────────────────────────────────────────────────────

describe('generateColorScale', () => {
  it('produces exactly 11 steps', () => {
    const scale = generateColorScale(primarySeed, 'light');
    expect(Object.keys(scale)).toHaveLength(11);
    for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
      expect(scale[step as keyof typeof scale]).toBeDefined();
    }
  });

  it('lightness is monotonically decreasing in light mode', () => {
    const scale = generateColorScale(primarySeed, 'light');
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
    for (let i = 1; i < steps.length; i++) {
      expect(scale[steps[i]].lightness).toBeLessThan(scale[steps[i - 1]].lightness);
    }
  });

  it('lightness is monotonically increasing in dark mode', () => {
    const scale = generateColorScale(primarySeed, 'dark');
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
    for (let i = 1; i < steps.length; i++) {
      expect(scale[steps[i]].lightness).toBeGreaterThan(scale[steps[i - 1]].lightness);
    }
  });

  it('all lightness values are in [0, 1]', () => {
    for (const mode of ['light', 'dark'] as const) {
      const scale = generateColorScale(primarySeed, mode);
      for (const step of Object.values(scale)) {
        expect(step.lightness).toBeGreaterThanOrEqual(0);
        expect(step.lightness).toBeLessThanOrEqual(1);
      }
    }
  });

  it('chroma values are non-negative (gamut clamped)', () => {
    for (const mode of ['light', 'dark'] as const) {
      const scale = generateColorScale(primarySeed, mode);
      for (const step of Object.values(scale)) {
        expect(step.chroma).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('hue is preserved from seed', () => {
    const scale = generateColorScale(primarySeed, 'light');
    for (const step of Object.values(scale)) {
      expect(step.hue).toBeCloseTo(primarySeed.hue, 1);
    }
  });

  it('accepts boundary seeds (L=0, C=0, H=0)', () => {
    const black: OKLCHColor = { lightness: 0, chroma: 0, hue: 0 };
    expect(() => generateColorScale(black, 'light')).not.toThrow();
  });
});

// ─── deriveFullPalette ────────────────────────────────────────────────────────

describe('deriveFullPalette', () => {
  it('produces exactly 8 named palettes', () => {
    const palette = deriveFullPalette(baseConfig);
    const keys = Object.keys(palette);
    expect(keys).toHaveLength(8);
    for (const name of ['primary', 'accent', 'secondary', 'neutral', 'success', 'warning', 'error', 'info']) {
      expect(palette[name as keyof typeof palette]).toBeDefined();
    }
  });

  it('each palette has both light and dark scales with 11 steps (176 total)', () => {
    const palette = deriveFullPalette(baseConfig);
    let total = 0;
    for (const entry of Object.values(palette)) {
      expect(Object.keys(entry.light)).toHaveLength(11);
      expect(Object.keys(entry.dark)).toHaveLength(11);
      total += Object.keys(entry.light).length + Object.keys(entry.dark).length;
    }
    expect(total).toBe(176);
  });

  it('secondary hue is average of primary and accent hues', () => {
    const config: BrandColorConfig = {
      primarySeed: { lightness: 0.56, chroma: 0.2, hue: 200 },
      accentSeed: { lightness: 0.56, chroma: 0.2, hue: 40 },
      neutralTemperature: 'neutral',
      semanticTemperature: 'neutral',
    };
    const palette = deriveFullPalette(config);
    // Average of 200 and 40 = 120
    const secondaryHue = palette.secondary.light[500].hue;
    expect(secondaryHue).toBeCloseTo(120, 0);
  });

  it('neutral warm: hue matches accentSeed hue', () => {
    const config: BrandColorConfig = { ...baseConfig, neutralTemperature: 'warm' };
    const palette = deriveFullPalette(config);
    for (const step of Object.values(palette.neutral.light)) {
      expect(step.hue).toBeCloseTo(accentSeed.hue, 1);
    }
  });

  it('neutral warm: chroma in [0.010, 0.020]', () => {
    const config: BrandColorConfig = { ...baseConfig, neutralTemperature: 'warm' };
    const palette = deriveFullPalette(config);
    for (const step of Object.values(palette.neutral.light)) {
      expect(step.chroma).toBeGreaterThanOrEqual(0.010);
      expect(step.chroma).toBeLessThanOrEqual(0.020);
    }
  });

  it('neutral cool: hue matches primarySeed hue', () => {
    const config: BrandColorConfig = { ...baseConfig, neutralTemperature: 'cool' };
    const palette = deriveFullPalette(config);
    for (const step of Object.values(palette.neutral.light)) {
      expect(step.hue).toBeCloseTo(primarySeed.hue, 1);
    }
  });

  it('neutral cool: chroma in [0.008, 0.015]', () => {
    const config: BrandColorConfig = { ...baseConfig, neutralTemperature: 'cool' };
    const palette = deriveFullPalette(config);
    for (const step of Object.values(palette.neutral.light)) {
      expect(step.chroma).toBeGreaterThanOrEqual(0.008);
      expect(step.chroma).toBeLessThanOrEqual(0.015);
    }
  });

  it('neutral neutral: chroma = 0 on all steps', () => {
    const palette = deriveFullPalette(baseConfig);
    for (const step of Object.values(palette.neutral.light)) {
      expect(step.chroma).toBe(0);
    }
    for (const step of Object.values(palette.neutral.dark)) {
      expect(step.chroma).toBe(0);
    }
  });

  it('success hue shifts +10° for warm semanticTemperature', () => {
    const warm = deriveFullPalette({ ...baseConfig, semanticTemperature: 'warm' });
    const neutral = deriveFullPalette(baseConfig);
    // Warm shifts +10° from base 145
    const warmHue = warm.success.light[500].hue;
    const neutralHue = neutral.success.light[500].hue;
    expect(warmHue - neutralHue).toBeCloseTo(10, 0);
  });

  it('success hue shifts -10° for cool semanticTemperature', () => {
    const cool = deriveFullPalette({ ...baseConfig, semanticTemperature: 'cool' });
    const neutral = deriveFullPalette(baseConfig);
    const coolHue = cool.success.light[500].hue;
    const neutralHue = neutral.success.light[500].hue;
    expect(neutralHue - coolHue).toBeCloseTo(10, 0);
  });

  it('error, warning, info also shift by ±10°', () => {
    const warm = deriveFullPalette({ ...baseConfig, semanticTemperature: 'warm' });
    const neutral = deriveFullPalette(baseConfig);
    for (const key of ['error', 'warning', 'info'] as const) {
      const delta = warm[key].light[500].hue - neutral[key].light[500].hue;
      expect(Math.abs(delta)).toBeCloseTo(10, 0);
    }
  });
});

// ─── deriveShapeTokens ────────────────────────────────────────────────────────

describe('deriveShapeTokens', () => {
  it('sharp: button radius ≤ 2px', () => {
    const tokens = deriveShapeTokens('sharp');
    expect(tokens.button).toBe('2px');
  });

  it('rounded: button radius in 6–12px range', () => {
    const tokens = deriveShapeTokens('rounded');
    const px = parseInt(tokens.button);
    expect(px).toBeGreaterThanOrEqual(6);
    expect(px).toBeLessThanOrEqual(12);
  });

  it('pill: button radius = 9999px', () => {
    const tokens = deriveShapeTokens('pill');
    expect(tokens.button).toBe('9999px');
  });

  it('returns all required keys', () => {
    for (const shape of ['sharp', 'rounded', 'pill'] as const) {
      const tokens = deriveShapeTokens(shape);
      for (const key of ['button', 'card', 'input', 'badge', 'dialog', 'sm', 'md', 'lg', 'full']) {
        expect(tokens[key as keyof typeof tokens]).toBeDefined();
      }
    }
  });
});

// ─── contrastRatio + meetsContrastAA ─────────────────────────────────────────

describe('contrastRatio', () => {
  it('white on black = 21:1', () => {
    const white: OKLCHColor = { lightness: 1, chroma: 0, hue: 0 };
    const black: OKLCHColor = { lightness: 0, chroma: 0, hue: 0 };
    expect(contrastRatio(white, black)).toBeCloseTo(21, 0);
  });

  it('same color = 1:1', () => {
    const mid: OKLCHColor = { lightness: 0.5, chroma: 0, hue: 0 };
    expect(contrastRatio(mid, mid)).toBeCloseTo(1, 1);
  });
});

describe('meetsContrastAA', () => {
  const white: OKLCHColor = { lightness: 1, chroma: 0, hue: 0 };
  const black: OKLCHColor = { lightness: 0, chroma: 0, hue: 0 };

  it('white on black passes normal AA', () => {
    expect(meetsContrastAA(white, black, 'normal')).toBe(true);
  });

  it('white on black passes large AA', () => {
    expect(meetsContrastAA(white, black, 'large')).toBe(true);
  });

  it('similar colors fail normal AA', () => {
    const lightGray: OKLCHColor = { lightness: 0.85, chroma: 0, hue: 0 };
    const white2: OKLCHColor = { lightness: 1, chroma: 0, hue: 0 };
    expect(meetsContrastAA(lightGray, white2, 'normal')).toBe(false);
  });
});

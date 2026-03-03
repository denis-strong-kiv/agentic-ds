import { describe, it, expect } from 'vitest';
import { getNativeTokens, BRAND_IDS, COLOR_MODES } from '../tokens';
import type { NativeTokens } from '../types';

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function isHex(value: string): boolean {
  return HEX_RE.test(value);
}

describe('getNativeTokens — structure parity', () => {
  for (const brandId of BRAND_IDS) {
    for (const mode of COLOR_MODES) {
      describe(`${brandId} / ${mode}`, () => {
        let tokens: NativeTokens;

        it('resolves without throwing', () => {
          tokens = getNativeTokens(brandId, mode);
          expect(tokens).toBeDefined();
        });

        it('has correct metadata', () => {
          tokens = getNativeTokens(brandId, mode);
          expect(tokens.brandId).toBe(brandId);
          expect(tokens.mode).toBe(mode);
        });

        it('has all color categories', () => {
          tokens = getNativeTokens(brandId, mode);
          const { color } = tokens;
          expect(color.primary).toBeDefined();
          expect(color.accent).toBeDefined();
          expect(color.secondary).toBeDefined();
          expect(color.backgroundDefault).toMatch(HEX_RE);
          expect(color.backgroundSubtle).toMatch(HEX_RE);
          expect(color.surfaceCard).toMatch(HEX_RE);
          expect(color.surfacePopover).toMatch(HEX_RE);
          expect(color.foregroundDefault).toMatch(HEX_RE);
          expect(color.foregroundMuted).toMatch(HEX_RE);
          expect(color.foregroundSubtle).toMatch(HEX_RE);
          expect(color.borderDefault).toMatch(HEX_RE);
          expect(color.borderMuted).toMatch(HEX_RE);
        });

        it('all color scale values are valid hex', () => {
          tokens = getNativeTokens(brandId, mode);
          const { color } = tokens;
          // Primary / accent full scales
          for (const key of ['primary', 'accent'] as const) {
            const scale = color[key];
            expect(isHex(scale.default), `${key}.default`).toBe(true);
            expect(isHex(scale.hover), `${key}.hover`).toBe(true);
            expect(isHex(scale.active), `${key}.active`).toBe(true);
            expect(isHex(scale.foreground), `${key}.foreground`).toBe(true);
            expect(isHex(scale.subtle), `${key}.subtle`).toBe(true);
          }
          // Semantic colors
          for (const key of ['success', 'warning', 'error', 'info'] as const) {
            const scale = color[key];
            expect(isHex(scale.default), `${key}.default`).toBe(true);
            expect(isHex(scale.foreground), `${key}.foreground`).toBe(true);
            expect(isHex(scale.subtle), `${key}.subtle`).toBe(true);
          }
        });

        it('has all shape tokens as non-negative numbers', () => {
          tokens = getNativeTokens(brandId, mode);
          for (const key of ['button', 'card', 'input', 'badge', 'dialog'] as const) {
            expect(typeof tokens.shape[key], `shape.${key}`).toBe('number');
            expect(tokens.shape[key]).toBeGreaterThanOrEqual(0);
          }
        });

        it('has spacing tokens as non-negative numbers', () => {
          tokens = getNativeTokens(brandId, mode);
          for (const [k, v] of Object.entries(tokens.spacing)) {
            expect(typeof v, `spacing.${k}`).toBe('number');
            expect(v).toBeGreaterThanOrEqual(0);
          }
        });

        it('spacing[4] equals 16 DPs', () => {
          tokens = getNativeTokens(brandId, mode);
          expect(tokens.spacing[4]).toBe(16);
        });

        it('has typography tokens with positive font sizes', () => {
          tokens = getNativeTokens(brandId, mode);
          for (const [scale, val] of Object.entries(tokens.typography)) {
            expect(val.fontSize, `typography.${scale}.fontSize`).toBeGreaterThan(0);
            expect(val.lineHeight, `typography.${scale}.lineHeight`).toBeGreaterThan(0);
          }
        });

        it('has motion tokens as non-negative numbers', () => {
          tokens = getNativeTokens(brandId, mode);
          expect(tokens.motion.durationInstant).toBe(0);
          expect(tokens.motion.durationFast).toBeGreaterThan(0);
          expect(tokens.motion.durationNormal).toBeGreaterThan(tokens.motion.durationFast);
          expect(tokens.motion.durationSlow).toBeGreaterThan(tokens.motion.durationNormal);
        });

        it('has all four shadow levels', () => {
          tokens = getNativeTokens(brandId, mode);
          for (const level of ['sm', 'md', 'lg', 'xl'] as const) {
            const s = tokens.shadow[level];
            expect(isHex(s.shadowColor), `shadow.${level}.shadowColor`).toBe(true);
            expect(s.shadowOpacity).toBeGreaterThan(0);
            expect(s.shadowOpacity).toBeLessThan(1);
            expect(s.shadowRadius).toBeGreaterThan(0);
            expect(s.elevation).toBeGreaterThan(0);
          }
        });

        it('shadow levels have increasing elevation', () => {
          tokens = getNativeTokens(brandId, mode);
          const { sm, md, lg, xl } = tokens.shadow;
          expect(sm.elevation).toBeLessThan(md.elevation);
          expect(md.elevation).toBeLessThan(lg.elevation);
          expect(lg.elevation).toBeLessThan(xl.elevation);
        });
      });
    }
  }
});

describe('getNativeTokens — brand differentiation', () => {
  it('luxury has near-zero border radius (prestige/sharp)', () => {
    const t = getNativeTokens('luxury', 'light');
    expect(t.shape.button).toBeLessThanOrEqual(4);
    expect(t.shape.input).toBeLessThanOrEqual(4);
  });

  it('eco has pill-shaped border radius', () => {
    const t = getNativeTokens('eco', 'light');
    expect(t.shape.button).toBeGreaterThan(100);
    expect(t.shape.input).toBeGreaterThan(100);
  });

  it('default and adventure have medium border radius', () => {
    const d = getNativeTokens('default', 'light');
    const a = getNativeTokens('adventure', 'light');
    expect(d.shape.button).toBeGreaterThan(4);
    expect(d.shape.button).toBeLessThan(100);
    expect(a.shape.button).toBeGreaterThan(4);
  });

  it('luxury light uses dark navy primary', () => {
    const t = getNativeTokens('luxury', 'light');
    // Navy-ish — red channel < 80
    const hex = t.color.primary.default;
    const r = parseInt(hex.slice(1, 3), 16);
    expect(r).toBeLessThan(80);
  });

  it('adventure light uses green primary', () => {
    const t = getNativeTokens('adventure', 'light');
    // Green-ish — green channel > red and blue
    const hex = t.color.primary.default;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    expect(g).toBeGreaterThan(r);
  });

  it('dark mode backgrounds are darker than light mode', () => {
    for (const brandId of BRAND_IDS) {
      const light = getNativeTokens(brandId, 'light');
      const dark = getNativeTokens(brandId, 'dark');
      const lightLum = luminance(light.color.backgroundDefault);
      const darkLum = luminance(dark.color.backgroundDefault);
      expect(lightLum, `${brandId} light background should be lighter`).toBeGreaterThan(darkLum);
    }
  });
});

// Approximate perceived luminance from hex
function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

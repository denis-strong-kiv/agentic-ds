// ─── Token Validation Engine ──────────────────────────────────────────────────

import type { BrandConfig } from '../oklch/types.js';
import { validateOKLCH, contrastRatio, meetsContrastAA } from '../oklch/utils.js';
import { deriveFullPalette } from '../oklch/engine.js';
import { resolveToken } from '../resolver/resolver.js';
import type { ValidationReport, ValidationError, ContrastResult } from './types.js';

// Designated fg/bg contrast pairs to validate per WCAG AA
const CONTRAST_PAIRS: Array<{ name: string; fg: string; bg: string; size: 'normal' | 'large' }> = [
  {
    name: 'primary-action',
    fg: 'color.primary.foreground',
    bg: 'color.primary.default',
    size: 'normal',
  },
  {
    name: 'foreground-on-background',
    fg: 'color.foreground.default',
    bg: 'color.background.default',
    size: 'normal',
  },
  {
    name: 'muted-on-background',
    fg: 'color.foreground.muted',
    bg: 'color.background.default',
    size: 'normal',
  },
  {
    name: 'success-foreground',
    fg: 'color.success.foreground',
    bg: 'color.success.default',
    size: 'normal',
  },
  {
    name: 'error-foreground',
    fg: 'color.error.foreground',
    bg: 'color.error.default',
    size: 'normal',
  },
];

/**
 * Validate all tokens for a brand configuration.
 * Checks OKLCH range validity, palette integrity, and WCAG AA contrast.
 */
export function validateBrandTokens(brand: BrandConfig): ValidationReport {
  const errors: ValidationError[] = [];
  const contrastResults: ContrastResult[] = [];

  // ── 1. Validate seed colors ─────────────────────────────────────────────────

  const primaryResult = validateOKLCH(brand.primarySeed);
  if (!primaryResult.valid) {
    for (const msg of primaryResult.errors) {
      errors.push({ code: 'INVALID_OKLCH', token: 'primarySeed', message: msg });
    }
  }

  const accentResult = validateOKLCH(brand.accentSeed);
  if (!accentResult.valid) {
    for (const msg of accentResult.errors) {
      errors.push({ code: 'INVALID_OKLCH', token: 'accentSeed', message: msg });
    }
  }

  // ── 2. Validate derived palette channel ranges ────────────────────────────────

  if (primaryResult.valid && accentResult.valid) {
    const palette = deriveFullPalette({
      primarySeed: brand.primarySeed,
      accentSeed: brand.accentSeed,
      neutralTemperature: brand.neutralTemperature,
      semanticTemperature: brand.semanticTemperature,
    });

    for (const [paletteName, entry] of Object.entries(palette)) {
      for (const [modeName, scale] of Object.entries(entry as Record<string, unknown>)) {
        for (const [step, color] of Object.entries(scale as Record<string, unknown>)) {
          const result = validateOKLCH(color as OKLCHColor);
          if (!result.valid) {
            for (const msg of result.errors) {
              errors.push({
                code: 'INVALID_OKLCH',
                token: `${paletteName}.${modeName}.${step}`,
                message: msg,
              });
            }
          }
        }
      }
    }
  }

  // ── 3. WCAG AA contrast checks (both modes) ───────────────────────────────────

  for (const mode of ['light', 'dark'] as const) {
    for (const pair of CONTRAST_PAIRS) {
      try {
        const fgResolved = resolveToken(pair.fg, brand, mode);
        const bgResolved = resolveToken(pair.bg, brand, mode);

        // Parse oklch() strings back to OKLCHColor for contrast calculation
        // We use a proxy approach: generate palette and pick known colors
        const fgPalette = extractColorFromCss(fgResolved.cssValue, brand, mode, pair.fg);
        const bgPalette = extractColorFromCss(bgResolved.cssValue, brand, mode, pair.bg);

        if (fgPalette && bgPalette) {
          const ratio = contrastRatio(fgPalette, bgPalette);
          const passes = meetsContrastAA(fgPalette, bgPalette, pair.size);

          contrastResults.push({
            token: `${pair.name} (${mode})`,
            fg: fgResolved.cssValue,
            bg: bgResolved.cssValue,
            ratio,
            passes,
            size: pair.size,
          });

          if (!passes) {
            errors.push({
              code: 'CONTRAST_FAIL',
              token: pair.name,
              message: `WCAG AA contrast failure (${mode}): ${pair.fg} on ${pair.bg} — ratio ${ratio.toFixed(2)}:1 (required ${pair.size === 'normal' ? '4.5' : '3.0'}:1)`,
            });
          }
        }
      } catch {
        errors.push({
          code: 'BROKEN_REFERENCE',
          token: pair.name,
          message: `Could not resolve contrast pair tokens for ${pair.name} (${mode})`,
        });
      }
    }
  }

  return {
    brandId: brand.id,
    valid: errors.length === 0,
    errors,
    contrastResults,
  };
}

// ─── Internal: parse oklch() string back to OKLCHColor ───────────────────────

import type { OKLCHColor } from '../oklch/types.js';

const OKLCH_RE = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/;

function extractColorFromCss(
  css: string,
  _brand: BrandConfig,
  _mode: 'light' | 'dark',
  _tokenName: string,
): OKLCHColor | null {
  const m = OKLCH_RE.exec(css);
  if (!m) return null;
  return {
    lightness: parseFloat(m[1]),
    chroma: parseFloat(m[2]),
    hue: parseFloat(m[3]),
  };
}

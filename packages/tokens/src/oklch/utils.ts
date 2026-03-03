// ─── OKLCH Utility Functions ──────────────────────────────────────────────────

import type { OKLCHColor } from './types.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ─── CSS serialization ────────────────────────────────────────────────────────

/**
 * Serialize an OKLCHColor to a CSS oklch() function string.
 * Example: oklch(0.55 0.18 250)
 */
export function oklchToCSS(color: OKLCHColor): string {
  const l = color.lightness.toFixed(4);
  const c = color.chroma.toFixed(4);
  const h = color.hue.toFixed(2);
  return `oklch(${l} ${c} ${h})`;
}

// ─── Hex conversion ───────────────────────────────────────────────────────────

/**
 * Convert OKLCHColor to hex string via OKLab → linear-sRGB → sRGB.
 * Used for legacy fallbacks and environments without oklch() support.
 */
export function oklchToHex(color: OKLCHColor): string {
  const [r, g, b] = oklchToSRGB(color);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ─── Color conversion internals ───────────────────────────────────────────────

/** OKLCH → OKLab */
function oklchToOklab(color: OKLCHColor): [number, number, number] {
  const hRad = (color.hue * Math.PI) / 180;
  return [
    color.lightness,
    color.chroma * Math.cos(hRad),
    color.chroma * Math.sin(hRad),
  ];
}

/** OKLab → linear-sRGB (via M1⁻¹ * cone → M2⁻¹) */
function oklabToLinearSRGB(lab: [number, number, number]): [number, number, number] {
  const [L, a, b] = lab;

  // OKLab to LMS (cube-root space)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  // Cube to linear LMS
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // Linear LMS to linear sRGB
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

/** Linear sRGB → sRGB (gamma) */
function linearToGamma(v: number): number {
  if (v <= 0.0031308) return 12.92 * v;
  return 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

/** OKLCH → sRGB [0,1] */
export function oklchToSRGB(color: OKLCHColor): [number, number, number] {
  const lab = oklchToOklab(color);
  const [lr, lg, lb] = oklabToLinearSRGB(lab);
  return [linearToGamma(lr), linearToGamma(lg), linearToGamma(lb)];
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate OKLCH color channel ranges:
 * L ∈ [0, 1], C ≥ 0, H ∈ [0, 360)
 */
export function validateOKLCH(color: OKLCHColor): ValidationResult {
  const errors: string[] = [];

  if (color.lightness < 0 || color.lightness > 1) {
    errors.push(`Lightness ${color.lightness} out of range [0, 1]`);
  }
  if (color.chroma < 0) {
    errors.push(`Chroma ${color.chroma} must be ≥ 0`);
  }
  if (color.hue < 0 || color.hue >= 360) {
    errors.push(`Hue ${color.hue} out of range [0, 360)`);
  }

  return { valid: errors.length === 0, errors };
}

// ─── WCAG contrast ────────────────────────────────────────────────────────────

/** Relative luminance of a linear sRGB value */
function relativeLuminance(color: OKLCHColor): number {
  const [r, g, b] = oklchToSRGB(color);
  // Linearize gamma-encoded values
  const lin = (v: number) =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * WCAG 2.1 contrast ratio between two colors.
 * Returns value in range [1, 21].
 */
export function contrastRatio(fg: OKLCHColor, bg: OKLCHColor): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG 2.1 AA compliance check.
 * Normal text: ratio ≥ 4.5; large text (≥18pt / bold ≥14pt): ratio ≥ 3.0
 */
export function meetsContrastAA(
  fg: OKLCHColor,
  bg: OKLCHColor,
  size: 'normal' | 'large',
): boolean {
  const ratio = contrastRatio(fg, bg);
  return size === 'large' ? ratio >= 3.0 : ratio >= 4.5;
}

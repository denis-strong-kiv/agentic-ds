/**
 * Custom OKLCH ↔ sRGB math.
 * No external dependencies. Based on Björn Ottosson's reference implementation.
 * https://bottosson.github.io/posts/oklab/
 */

import type { ColorScale, ColorStep } from '../types';

// ─── Matrix constants (Björn Ottosson) ───────────────────────────────────────

// Linear sRGB → LMS
const M1 = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
];

// LMS_cbrt → OKLab
const M2 = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766],
];

// LMS → linear sRGB (inverse of M1)
const M1_INV = [
  [4.0767416621, -3.3077115913, 0.2309699292],
  [-1.2684380046, 2.6097574011, -0.3413193965],
  [-0.0041960863, -0.7034186147, 1.707614701],
];

// OKLab → LMS_cbrt (inverse of M2)
const M2_INV = [
  [1.0, 0.3963377774, 0.2158037573],
  [1.0, -0.1055613458, -0.0638541728],
  [1.0, -0.0894841775, -1.291485548],
];

// ─── Transfer functions ───────────────────────────────────────────────────────

export function gammaToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToGamma(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// ─── Matrix multiply (3×3 × 3×1) ─────────────────────────────────────────────

function matMul3(m: number[][], v: number[]): number[] {
  return m.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
}

// ─── Core conversions ─────────────────────────────────────────────────────────

/** OKLCH → linear sRGB (un-clamped, for gamut testing) */
function oklchToLinearSrgb(L: number, C: number, H: number): number[] {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const lmsCbrt = matMul3(M2_INV, [L, a, b]);
  const lms = lmsCbrt.map((v) => v ** 3);
  return matMul3(M1_INV, lms);
}

/** OKLCH → gamma-encoded sRGB, clamped to [0, 1] */
export function oklchToSrgb(
  L: number,
  C: number,
  H: number,
): { r: number; g: number; b: number } {
  const lin = oklchToLinearSrgb(L, C, H);
  return {
    r: Math.max(0, Math.min(1, linearToGamma(lin[0]))),
    g: Math.max(0, Math.min(1, linearToGamma(lin[1]))),
    b: Math.max(0, Math.min(1, linearToGamma(lin[2]))),
  };
}

/** Gamma-encoded sRGB → OKLCH */
export function srgbToOklch(
  r: number,
  g: number,
  b: number,
): { L: number; C: number; H: number } {
  const lms = matMul3(M1, [
    gammaToLinear(r),
    gammaToLinear(g),
    gammaToLinear(b),
  ]);
  const lmsCbrt = lms.map((v) => Math.cbrt(v));
  const lab = matMul3(M2, lmsCbrt);
  const C = Math.sqrt(lab[1] ** 2 + lab[2] ** 2);
  const H = ((Math.atan2(lab[2], lab[1]) * 180) / Math.PI + 360) % 360;
  return { L: lab[0], C, H };
}

// ─── Gamut clamping ───────────────────────────────────────────────────────────

function isInGamut(L: number, C: number, H: number, eps = 0.001): boolean {
  const lin = oklchToLinearSrgb(L, C, H);
  return (
    lin[0] >= -eps &&
    lin[0] <= 1 + eps &&
    lin[1] >= -eps &&
    lin[1] <= 1 + eps &&
    lin[2] >= -eps &&
    lin[2] <= 1 + eps
  );
}

/**
 * Binary-search the maximum chroma that keeps the color in the sRGB gamut.
 * 20 iterations gives precision < 0.0001 on chroma.
 */
export function clampChroma(
  L: number,
  C: number,
  H: number,
): { L: number; C: number; H: number } {
  if (isInGamut(L, C, H)) return { L, C, H };

  let lo = 0;
  let hi = C;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (isInGamut(L, mid, H)) lo = mid;
    else hi = mid;
  }
  return { L, C: lo, H };
}

// ─── WCAG contrast ────────────────────────────────────────────────────────────

/**
 * Relative luminance per WCAG (IEC 61966-2-1 / BT.709 coefficients).
 * Input: gamma-encoded sRGB in [0, 1].
 */
export function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * gammaToLinear(r) +
    0.7152 * gammaToLinear(g) +
    0.0722 * gammaToLinear(b)
  );
}

/** WCAG contrast ratio between two relative luminance values. */
export function wcagContrastRatio(L1: number, L2: number): number {
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Scale generation ─────────────────────────────────────────────────────────

const STEPS: ColorStep[] = [
  '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950',
];

// Lightness targets for each scale step
const LIGHT_L = [0.98, 0.95, 0.9, 0.82, 0.72, 0.62, 0.52, 0.42, 0.32, 0.22, 0.12];
const DARK_L = [0.12, 0.2, 0.28, 0.36, 0.44, 0.54, 0.64, 0.74, 0.84, 0.92, 0.97];

function buildScale(seedC: number, seedH: number, lTargets: number[]): ColorScale {
  const scale = {} as Record<ColorStep, string>;
  for (let i = 0; i < STEPS.length; i++) {
    const targetL = lTargets[i];
    // Sinusoidal chroma envelope: reduces chroma at extremes
    const rawC = seedC * Math.sin(targetL * Math.PI);
    const { L, C, H } = clampChroma(targetL, rawC, seedH);
    scale[STEPS[i]] = `oklch(${L.toFixed(3)} ${C.toFixed(4)} ${H.toFixed(1)})`;
  }
  return scale;
}

/**
 * Generate a full 11-step light + dark color scale from an OKLCH seed.
 * The seed color lands at step 500 in the light scale.
 */
export function generateColorScale(
  seedL: number,
  seedC: number,
  seedH: number,
): { light: ColorScale; dark: ColorScale } {
  // Override step 500 with the exact seed to preserve brand color fidelity
  const light = buildScale(seedC, seedH, LIGHT_L);
  light['500'] = `oklch(${seedL.toFixed(3)} ${seedC.toFixed(4)} ${seedH.toFixed(1)})`;

  const dark = buildScale(seedC, seedH, DARK_L);

  return { light, dark };
}

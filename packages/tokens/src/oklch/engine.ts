// ─── OKLCH Color Engine ───────────────────────────────────────────────────────

import type {
  OKLCHColor,
  ColorScale,
  ColorScaleStep,
  BrandColorConfig,
  BrandPalette,
  ShapeTokens,
} from './types.js';
import { oklchToSRGB } from './utils.js';

// ─── Color scale generation ───────────────────────────────────────────────────

const SCALE_STEPS: ColorScaleStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * Lightness curves for each step (index 0 = step 50, index 10 = step 950).
 * Light mode: bright (0.97) → dark (0.25)
 * Dark mode: dark (0.12) → bright (0.92)
 */
const LIGHT_LIGHTNESS: Record<ColorScaleStep, number> = {
  50: 0.970,
  100: 0.940,
  200: 0.875,
  300: 0.790,
  400: 0.680,
  500: 0.560,
  600: 0.460,
  700: 0.370,
  800: 0.290,
  900: 0.220,
  950: 0.160,
};

const DARK_LIGHTNESS: Record<ColorScaleStep, number> = {
  50: 0.120,
  100: 0.160,
  200: 0.220,
  300: 0.300,
  400: 0.390,
  500: 0.490,
  600: 0.590,
  700: 0.680,
  800: 0.780,
  900: 0.880,
  950: 0.930,
};

/**
 * Chroma modulation envelope (as fraction of seed chroma).
 * Steps near the extremes (very light or very dark) have reduced chroma.
 * Peaks around step 500-600 to maintain vivid mid-tones.
 */
const CHROMA_ENVELOPE: Record<ColorScaleStep, number> = {
  50: 0.10,
  100: 0.18,
  200: 0.32,
  300: 0.55,
  400: 0.78,
  500: 1.00,
  600: 0.95,
  700: 0.85,
  800: 0.70,
  900: 0.50,
  950: 0.35,
};

/**
 * Clamp an OKLCH color to the sRGB gamut by reducing chroma until
 * all sRGB channels fall within [0, 1].
 */
function clampToSRGB(color: OKLCHColor): OKLCHColor {
  let { lightness, chroma, hue } = color;
  if (chroma <= 0) return color;

  // Binary search: find highest chroma that stays in sRGB gamut
  let lo = 0;
  let hi = chroma;
  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2;
    const [r, g, b] = oklchToSRGB({ lightness, chroma: mid, hue });
    const inGamut = r >= -0.0001 && r <= 1.0001 &&
                    g >= -0.0001 && g <= 1.0001 &&
                    b >= -0.0001 && b <= 1.0001;
    if (inGamut) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return { lightness, chroma: lo, hue };
}

/**
 * Generate an 11-step OKLCH color scale from a seed color.
 * All functions are pure and side-effect-free.
 */
export function generateColorScale(seed: OKLCHColor, mode: 'light' | 'dark'): ColorScale {
  const lightnessMap = mode === 'light' ? LIGHT_LIGHTNESS : DARK_LIGHTNESS;
  const scale = {} as ColorScale;

  for (const step of SCALE_STEPS) {
    const lightness = lightnessMap[step];
    const chromaFraction = CHROMA_ENVELOPE[step];
    const rawChroma = seed.chroma * chromaFraction;

    const raw: OKLCHColor = {
      lightness,
      chroma: rawChroma,
      hue: seed.hue,
    };

    scale[step] = clampToSRGB(raw);
  }

  return scale;
}

// ─── Neutral scale generation ─────────────────────────────────────────────────

/** Neutral chroma values controlled by temperature. Values per step are small. */
const NEUTRAL_WARM_CHROMA: Record<ColorScaleStep, number> = {
  50: 0.012, 100: 0.014, 200: 0.016, 300: 0.017, 400: 0.018,
  500: 0.018, 600: 0.017, 700: 0.016, 800: 0.015, 900: 0.013, 950: 0.011,
};

const NEUTRAL_COOL_CHROMA: Record<ColorScaleStep, number> = {
  50: 0.009, 100: 0.010, 200: 0.011, 300: 0.012, 400: 0.013,
  500: 0.013, 600: 0.012, 700: 0.011, 800: 0.010, 900: 0.009, 950: 0.008,
};

function generateNeutralScale(
  _seed: OKLCHColor,
  temperature: 'warm' | 'cool' | 'neutral',
  neutralHue: { warm: number; cool: number },
  mode: 'light' | 'dark',
): ColorScale {
  const lightnessMap = mode === 'light' ? LIGHT_LIGHTNESS : DARK_LIGHTNESS;
  const scale = {} as ColorScale;

  for (const step of SCALE_STEPS) {
    const lightness = lightnessMap[step];

    let chroma: number;
    let hue: number;

    switch (temperature) {
      case 'warm':
        chroma = NEUTRAL_WARM_CHROMA[step];
        hue = neutralHue.warm;
        break;
      case 'cool':
        chroma = NEUTRAL_COOL_CHROMA[step];
        hue = neutralHue.cool;
        break;
      case 'neutral':
      default:
        chroma = 0;
        hue = 0;
        break;
    }

    scale[step] = { lightness, chroma, hue };
  }

  return scale;
}

// ─── Full palette derivation ──────────────────────────────────────────────────

/**
 * Derive a semantic color seed from a base hue with semantic temperature shift.
 */
function semanticSeed(baseHue: number, temperature: 'warm' | 'cool' | 'neutral', shift: number): OKLCHColor {
  let hue = baseHue;
  if (temperature === 'warm') hue += shift;
  else if (temperature === 'cool') hue -= shift;
  hue = ((hue % 360) + 360) % 360;
  return { lightness: 0.56, chroma: 0.18, hue };
}

/**
 * Derive all 8 named OKLCH color palettes from a BrandColorConfig.
 * Each palette has both light and dark mode scales.
 */
export function deriveFullPalette(config: BrandColorConfig): BrandPalette {
  const { primarySeed, accentSeed, neutralTemperature, semanticTemperature } = config;

  // Secondary: blend of both seeds
  const avgHue = ((primarySeed.hue + accentSeed.hue) / 2 +
    (Math.abs(primarySeed.hue - accentSeed.hue) > 180 ? 180 : 0)) % 360;
  const secondarySeed: OKLCHColor = {
    lightness: (primarySeed.lightness + accentSeed.lightness) / 2,
    chroma: ((primarySeed.chroma + accentSeed.chroma) / 2) * 0.5,
    hue: avgHue,
  };

  return {
    primary: {
      light: generateColorScale(primarySeed, 'light'),
      dark: generateColorScale(primarySeed, 'dark'),
    },
    accent: {
      light: generateColorScale(accentSeed, 'light'),
      dark: generateColorScale(accentSeed, 'dark'),
    },
    secondary: {
      light: generateColorScale(secondarySeed, 'light'),
      dark: generateColorScale(secondarySeed, 'dark'),
    },
    neutral: {
      light: generateNeutralScale(
        accentSeed,
        neutralTemperature,
        { warm: accentSeed.hue, cool: primarySeed.hue },
        'light',
      ),
      dark: generateNeutralScale(
        accentSeed,
        neutralTemperature,
        { warm: accentSeed.hue, cool: primarySeed.hue },
        'dark',
      ),
    },
    success: {
      light: generateColorScale(semanticSeed(145, semanticTemperature, 10), 'light'),
      dark: generateColorScale(semanticSeed(145, semanticTemperature, 10), 'dark'),
    },
    warning: {
      light: generateColorScale(semanticSeed(85, semanticTemperature, 10), 'light'),
      dark: generateColorScale(semanticSeed(85, semanticTemperature, 10), 'dark'),
    },
    error: {
      light: generateColorScale(semanticSeed(25, semanticTemperature, 10), 'light'),
      dark: generateColorScale(semanticSeed(25, semanticTemperature, 10), 'dark'),
    },
    info: {
      light: generateColorScale(semanticSeed(250, semanticTemperature, 10), 'light'),
      dark: generateColorScale(semanticSeed(250, semanticTemperature, 10), 'dark'),
    },
  };
}

// ─── Shape token derivation ───────────────────────────────────────────────────

/**
 * Derive shape radius tokens from the brand shape preset.
 * All values returned as CSS strings (e.g., '8px', '9999px').
 */
export function deriveShapeTokens(shape: 'sharp' | 'rounded' | 'pill'): ShapeTokens {
  switch (shape) {
    case 'sharp':
      return {
        button: '2px',
        card: '2px',
        input: '1px',
        badge: '1px',
        dialog: '4px',
        sm: '1px',
        md: '2px',
        lg: '4px',
        full: '9999px',
      };
    case 'pill':
      return {
        button: '9999px',
        card: '24px',
        input: '9999px',
        badge: '9999px',
        dialog: '24px',
        sm: '4px',
        md: '12px',
        lg: '24px',
        full: '9999px',
      };
    case 'rounded':
    default:
      return {
        button: '8px',
        card: '12px',
        input: '6px',
        badge: '6px',
        dialog: '16px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '9999px',
      };
  }
}

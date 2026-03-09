/**
 * Pre-resolved static native tokens for all brands.
 * Colors are hex (OKLCH → hex converted), spacing is in density-independent pixels.
 *
 * These are generated outputs — update by running `pnpm build:tokens-native`
 * in packages/tokens (or re-run the token engine).
 */

import type { NativeTokens, BrandId, ColorMode, NativeShadowStyle } from './types';

// ─── Shared non-color tokens ───────────────────────────────────────────────────

const spacing = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40,
  12: 48, 16: 64, 20: 80, 24: 96, 32: 128,
} as const;

const typography = {
  xs:    { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  sm:    { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  base:  { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  lg:    { fontSize: 18, lineHeight: 28, fontWeight: '400' as const },
  xl:    { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  '2xl': { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  '3xl': { fontSize: 30, lineHeight: 36, fontWeight: '700' as const, letterSpacing: -0.5 },
  '4xl': { fontSize: 36, lineHeight: 40, fontWeight: '800' as const, letterSpacing: -1 },
};

const motion = {
  durationInstant: 0,
  durationFast: 100,
  durationNormal: 200,
  durationSlow: 300,
  durationSlower: 500,
};

function shadow(
  color: string,
  smRadius: number,
  smElevation: number,
): { sm: NativeShadowStyle; md: NativeShadowStyle; lg: NativeShadowStyle; xl: NativeShadowStyle } {
  return {
    sm:  { shadowColor: color, shadowOffset: { width: 0, height: 1 },  shadowOpacity: 0.08, shadowRadius: smRadius,     elevation: smElevation },
    md:  { shadowColor: color, shadowOffset: { width: 0, height: 4 },  shadowOpacity: 0.10, shadowRadius: 6,            elevation: 4 },
    lg:  { shadowColor: color, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.12, shadowRadius: 15,           elevation: 8 },
    xl:  { shadowColor: color, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.14, shadowRadius: 25,           elevation: 12 },
  };
}

// ─── Brand token tables ────────────────────────────────────────────────────────

const brandData: Record<BrandId, Record<ColorMode, Omit<NativeTokens, 'brandId' | 'mode' | 'spacing' | 'typography' | 'motion'>>> = {
  default: {
    light: {
      color: {
        primary:   { default: '#2563eb', hover: '#1d4ed8', active: '#1e40af', foreground: '#ffffff', subtle: '#eff6ff' },
        accent:    { default: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', foreground: '#ffffff', subtle: '#f5f3ff' },
        secondary: { default: '#f1f5f9', hover: '#e2e8f0', foreground: '#0f172a' },
        backgroundDefault: '#ffffff',
        backgroundSubtle:  '#f8fafc',
        surfaceCard:       '#ffffff',
        surfacePopover:    '#ffffff',
        foregroundDefault: '#0f172a',
        foregroundMuted:   '#64748b',
        foregroundSubtle:  '#94a3b8',
        borderDefault:     '#e2e8f0',
        borderMuted:       '#f1f5f9',
        success: { default: '#16a34a', foreground: '#ffffff', subtle: '#f0fdf4' },
        warning: { default: '#d97706', foreground: '#ffffff', subtle: '#fffbeb' },
        error:   { default: '#dc2626', foreground: '#ffffff', subtle: '#fef2f2' },
        info:    { default: '#0284c7', foreground: '#ffffff', subtle: '#f0f9ff' },
      },
      shape: { button: 8, card: 12, input: 8, badge: 6, dialog: 16 },
      shadow: shadow('#0f172a', 2, 2),
    },
    dark: {
      color: {
        primary:   { default: '#60a5fa', hover: '#93c5fd', active: '#bfdbfe', foreground: '#1e3a5f', subtle: '#172554' },
        accent:    { default: '#a78bfa', hover: '#c4b5fd', active: '#ddd6fe', foreground: '#2e1065', subtle: '#1e1b4b' },
        secondary: { default: '#1e293b', hover: '#334155', foreground: '#f1f5f9' },
        backgroundDefault: '#0f172a',
        backgroundSubtle:  '#1e293b',
        surfaceCard:       '#1e293b',
        surfacePopover:    '#334155',
        foregroundDefault: '#f8fafc',
        foregroundMuted:   '#94a3b8',
        foregroundSubtle:  '#64748b',
        borderDefault:     '#334155',
        borderMuted:       '#1e293b',
        success: { default: '#4ade80', foreground: '#14532d', subtle: '#14532d' },
        warning: { default: '#fbbf24', foreground: '#78350f', subtle: '#78350f' },
        error:   { default: '#f87171', foreground: '#7f1d1d', subtle: '#7f1d1d' },
        info:    { default: '#38bdf8', foreground: '#0c4a6e', subtle: '#0c4a6e' },
      },
      shape: { button: 8, card: 12, input: 8, badge: 6, dialog: 16 },
      shadow: shadow('#000000', 2, 2),
    },
  },

  luxury: {
    light: {
      color: {
        primary:   { default: '#1e2d5e', hover: '#162247', active: '#0f1930', foreground: '#ffffff', subtle: '#eef0f7' },
        accent:    { default: '#b8962a', hover: '#a07e20', active: '#836618', foreground: '#ffffff', subtle: '#fdf8ed' },
        secondary: { default: '#f4f4f6', hover: '#e8e8ec', foreground: '#1e2d5e' },
        backgroundDefault: '#ffffff',
        backgroundSubtle:  '#f9f9fb',
        surfaceCard:       '#ffffff',
        surfacePopover:    '#ffffff',
        foregroundDefault: '#1e2d5e',
        foregroundMuted:   '#6b7280',
        foregroundSubtle:  '#9ca3af',
        borderDefault:     '#e5e7eb',
        borderMuted:       '#f3f4f6',
        success: { default: '#15803d', foreground: '#ffffff', subtle: '#f0fdf4' },
        warning: { default: '#b8962a', foreground: '#ffffff', subtle: '#fdf8ed' },
        error:   { default: '#b91c1c', foreground: '#ffffff', subtle: '#fef2f2' },
        info:    { default: '#1d4ed8', foreground: '#ffffff', subtle: '#eff6ff' },
      },
      shape: { button: 2, card: 4, input: 2, badge: 2, dialog: 4 },
      shadow: shadow('#1e2d5e', 2, 2),
    },
    dark: {
      color: {
        primary:   { default: '#8899cc', hover: '#99aad4', active: '#aabade', foreground: '#0a0f2b', subtle: '#0a0f2b' },
        accent:    { default: '#d4a843', hover: '#dbb855', active: '#e2c867', foreground: '#3d2500', subtle: '#2a1800' },
        secondary: { default: '#1a1f35', hover: '#252b45', foreground: '#e8ecf5' },
        backgroundDefault: '#0a0f2b',
        backgroundSubtle:  '#111633',
        surfaceCard:       '#1a1f35',
        surfacePopover:    '#252b45',
        foregroundDefault: '#eef0f7',
        foregroundMuted:   '#8892b0',
        foregroundSubtle:  '#5a6280',
        borderDefault:     '#252b45',
        borderMuted:       '#1a1f35',
        success: { default: '#4ade80', foreground: '#052e16', subtle: '#052e16' },
        warning: { default: '#d4a843', foreground: '#451a03', subtle: '#451a03' },
        error:   { default: '#f87171', foreground: '#450a0a', subtle: '#450a0a' },
        info:    { default: '#60a5fa', foreground: '#172554', subtle: '#172554' },
      },
      shape: { button: 2, card: 4, input: 2, badge: 2, dialog: 4 },
      shadow: shadow('#000000', 2, 2),
    },
  },

  adventure: {
    light: {
      color: {
        primary:   { default: '#2d6a3f', hover: '#235532', active: '#1a4026', foreground: '#ffffff', subtle: '#f0fdf4' },
        accent:    { default: '#d2601a', hover: '#ba5115', active: '#a04411', foreground: '#ffffff', subtle: '#fff7ed' },
        secondary: { default: '#f0fdf4', hover: '#dcfce7', foreground: '#14532d' },
        backgroundDefault: '#ffffff',
        backgroundSubtle:  '#f7fdf9',
        surfaceCard:       '#ffffff',
        surfacePopover:    '#ffffff',
        foregroundDefault: '#14532d',
        foregroundMuted:   '#4b7a5d',
        foregroundSubtle:  '#86a893',
        borderDefault:     '#d1fae5',
        borderMuted:       '#ecfdf5',
        success: { default: '#16a34a', foreground: '#ffffff', subtle: '#f0fdf4' },
        warning: { default: '#d2601a', foreground: '#ffffff', subtle: '#fff7ed' },
        error:   { default: '#dc2626', foreground: '#ffffff', subtle: '#fef2f2' },
        info:    { default: '#0369a1', foreground: '#ffffff', subtle: '#f0f9ff' },
      },
      shape: { button: 8, card: 12, input: 8, badge: 6, dialog: 16 },
      shadow: shadow('#14532d', 2, 2),
    },
    dark: {
      color: {
        primary:   { default: '#4ade80', hover: '#86efac', active: '#bbf7d0', foreground: '#14532d', subtle: '#14532d' },
        accent:    { default: '#fb923c', hover: '#fdba74', active: '#fed7aa', foreground: '#431407', subtle: '#431407' },
        secondary: { default: '#1a2e1f', hover: '#243529', foreground: '#dcfce7' },
        backgroundDefault: '#0d1f11',
        backgroundSubtle:  '#1a2e1f',
        surfaceCard:       '#1a2e1f',
        surfacePopover:    '#243529',
        foregroundDefault: '#dcfce7',
        foregroundMuted:   '#6ea87f',
        foregroundSubtle:  '#4d7a5b',
        borderDefault:     '#243529',
        borderMuted:       '#1a2e1f',
        success: { default: '#4ade80', foreground: '#14532d', subtle: '#14532d' },
        warning: { default: '#fb923c', foreground: '#431407', subtle: '#431407' },
        error:   { default: '#f87171', foreground: '#450a0a', subtle: '#450a0a' },
        info:    { default: '#38bdf8', foreground: '#0c4a6e', subtle: '#0c4a6e' },
      },
      shape: { button: 8, card: 12, input: 8, badge: 6, dialog: 16 },
      shadow: shadow('#000000', 2, 2),
    },
  },

  eco: {
    light: {
      color: {
        primary:   { default: '#0d7377', hover: '#0a5e62', active: '#08484c', foreground: '#ffffff', subtle: '#f0fdfc' },
        accent:    { default: '#b57c2c', hover: '#9d6a23', active: '#855a1b', foreground: '#ffffff', subtle: '#fffbeb' },
        secondary: { default: '#f0fdfc', hover: '#ccfbf1', foreground: '#134e4a' },
        backgroundDefault: '#ffffff',
        backgroundSubtle:  '#f0fdfc',
        surfaceCard:       '#ffffff',
        surfacePopover:    '#ffffff',
        foregroundDefault: '#134e4a',
        foregroundMuted:   '#4a7f7c',
        foregroundSubtle:  '#86b5b2',
        borderDefault:     '#ccfbf1',
        borderMuted:       '#f0fdfc',
        success: { default: '#0d7377', foreground: '#ffffff', subtle: '#f0fdfc' },
        warning: { default: '#b57c2c', foreground: '#ffffff', subtle: '#fffbeb' },
        error:   { default: '#dc2626', foreground: '#ffffff', subtle: '#fef2f2' },
        info:    { default: '#0284c7', foreground: '#ffffff', subtle: '#f0f9ff' },
      },
      shape: { button: 9999, card: 24, input: 9999, badge: 9999, dialog: 24 },
      shadow: shadow('#134e4a', 2, 2),
    },
    dark: {
      color: {
        primary:   { default: '#2dd4bf', hover: '#5eead4', active: '#99f6e4', foreground: '#134e4a', subtle: '#134e4a' },
        accent:    { default: '#fbbf24', hover: '#fcd34d', active: '#fde68a', foreground: '#451a03', subtle: '#451a03' },
        secondary: { default: '#0f2f2d', hover: '#163835', foreground: '#ccfbf1' },
        backgroundDefault: '#082a28',
        backgroundSubtle:  '#0f2f2d',
        surfaceCard:       '#0f2f2d',
        surfacePopover:    '#163835',
        foregroundDefault: '#ccfbf1',
        foregroundMuted:   '#4a9e9a',
        foregroundSubtle:  '#2d6e6a',
        borderDefault:     '#163835',
        borderMuted:       '#0f2f2d',
        success: { default: '#2dd4bf', foreground: '#134e4a', subtle: '#134e4a' },
        warning: { default: '#fbbf24', foreground: '#451a03', subtle: '#451a03' },
        error:   { default: '#f87171', foreground: '#450a0a', subtle: '#450a0a' },
        info:    { default: '#38bdf8', foreground: '#0c4a6e', subtle: '#0c4a6e' },
      },
      shape: { button: 9999, card: 24, input: 9999, badge: 9999, dialog: 24 },
      shadow: shadow('#000000', 2, 2),
    },
  },
};

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Get the resolved native token set for a brand + mode combination.
 */
export function getNativeTokens(brandId: BrandId, mode: ColorMode): NativeTokens {
  const data = brandData[brandId][mode];
  return {
    brandId,
    mode,
    spacing,
    typography,
    motion,
    ...data,
  };
}

/** All available brand IDs */
export const BRAND_IDS: BrandId[] = ['default', 'luxury', 'adventure', 'eco'];

/** All available color modes */
export const COLOR_MODES: ColorMode[] = ['light', 'dark'];

/**
 * Static brand token CSS custom properties for Storybook.
 * In production these come from the token resolution API; here they are
 * hard-coded so stories work without a running API server.
 *
 * Each brand defines light + dark token sets.
 */

export type BrandId = 'default' | 'luxury' | 'adventure' | 'eco';
export type ColorMode = 'light' | 'dark';

interface TokenSet {
  light: Record<string, string>;
  dark: Record<string, string>;
}

const base = {
  // Motion
  '--duration-fast': '100ms',
  '--duration-normal': '200ms',
  '--duration-slow': '300ms',
  '--easing-ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--easing-ease-in-out': 'cubic-bezier(0.45, 0, 0.55, 1)',
  // Typography (matches Google Fonts loaded in preview-head.html)
  '--font-display': "'Space Grotesk', system-ui, sans-serif",
  '--font-heading': "'Plus Jakarta Sans', system-ui, sans-serif",
  '--font-body': "'Inter', system-ui, sans-serif",
};

// ─── Default Brand (blue primary, purple accent, rounded) ────────────────────

const defaultLight: Record<string, string> = {
  ...base,
  '--shape-preset-button': '8px',
  '--shape-preset-card': '12px',
  '--shape-preset-input': '6px',
  '--shape-preset-dialog': '16px',
  '--shape-preset-badge': '6px',
  '--shadow-sm': '0 1px 2px oklch(0% 0 0 / 0.05)',
  '--shadow-md': '0 4px 8px oklch(0% 0 0 / 0.10)',
  '--shadow-lg': '0 8px 24px oklch(0% 0 0 / 0.12)',
  // Primary (blue)
  '--color-primary-default': 'oklch(0.50 0.22 250)',
  '--color-primary-hover': 'oklch(0.44 0.22 250)',
  '--color-primary-active': 'oklch(0.38 0.22 250)',
  '--color-primary-foreground': 'oklch(0.98 0.01 250)',
  // Accent (purple)
  '--color-accent-default': 'oklch(0.52 0.20 285)',
  '--color-accent-hover': 'oklch(0.46 0.20 285)',
  '--color-accent-active': 'oklch(0.40 0.20 285)',
  '--color-accent-foreground': 'oklch(0.98 0.01 285)',
  // Secondary
  '--color-secondary-default': 'oklch(0.52 0.12 267)',
  '--color-secondary-hover': 'oklch(0.46 0.12 267)',
  '--color-secondary-foreground': 'oklch(0.98 0.01 267)',
  // Backgrounds
  '--color-background-default': 'oklch(0.99 0.002 250)',
  '--color-background-subtle': 'oklch(0.96 0.004 250)',
  // Surfaces
  '--color-surface-card': 'oklch(1 0 0)',
  '--color-surface-popover': 'oklch(1 0 0)',
  '--color-surface-overlay': 'oklch(0% 0 0 / 0.6)',
  // Foregrounds
  '--color-foreground-default': 'oklch(0.12 0.01 250)',
  '--color-foreground-muted': 'oklch(0.45 0.01 250)',
  '--color-foreground-subtle': 'oklch(0.60 0.01 250)',
  '--color-foreground-on-emphasis': 'oklch(0.98 0.01 250)',
  // Borders
  '--color-border-default': 'oklch(0.88 0.005 250)',
  '--color-border-muted': 'oklch(0.93 0.003 250)',
  // Success
  '--color-success-default': 'oklch(0.52 0.17 145)',
  '--color-success-foreground': 'oklch(0.98 0.02 145)',
  '--color-success-subtle': 'oklch(0.94 0.04 145)',
  // Warning
  '--color-warning-default': 'oklch(0.62 0.17 85)',
  '--color-warning-foreground': 'oklch(0.98 0.02 85)',
  '--color-warning-subtle': 'oklch(0.96 0.04 85)',
  // Error
  '--color-error-default': 'oklch(0.56 0.20 25)',
  '--color-error-foreground': 'oklch(0.98 0.02 25)',
  '--color-error-subtle': 'oklch(0.96 0.04 25)',
  // Info
  '--color-info-default': 'oklch(0.52 0.18 250)',
  '--color-info-foreground': 'oklch(0.98 0.02 250)',
  '--color-info-subtle': 'oklch(0.95 0.04 250)',
};

const defaultDark: Record<string, string> = {
  ...base,
  '--shape-preset-button': '8px',
  '--shape-preset-card': '12px',
  '--shape-preset-input': '6px',
  '--shape-preset-dialog': '16px',
  '--shape-preset-badge': '6px',
  '--shadow-sm': '0 1px 2px oklch(0% 0 0 / 0.3)',
  '--shadow-md': '0 4px 8px oklch(0% 0 0 / 0.4)',
  '--shadow-lg': '0 8px 24px oklch(0% 0 0 / 0.5)',
  '--color-primary-default': 'oklch(0.65 0.20 250)',
  '--color-primary-hover': 'oklch(0.70 0.20 250)',
  '--color-primary-active': 'oklch(0.75 0.20 250)',
  '--color-primary-foreground': 'oklch(0.12 0.04 250)',
  '--color-accent-default': 'oklch(0.65 0.18 285)',
  '--color-accent-hover': 'oklch(0.70 0.18 285)',
  '--color-accent-active': 'oklch(0.75 0.18 285)',
  '--color-accent-foreground': 'oklch(0.12 0.04 285)',
  '--color-secondary-default': 'oklch(0.62 0.10 267)',
  '--color-secondary-hover': 'oklch(0.68 0.10 267)',
  '--color-secondary-foreground': 'oklch(0.12 0.04 267)',
  '--color-background-default': 'oklch(0.13 0.01 250)',
  '--color-background-subtle': 'oklch(0.17 0.01 250)',
  '--color-surface-card': 'oklch(0.17 0.01 250)',
  '--color-surface-popover': 'oklch(0.20 0.01 250)',
  '--color-surface-overlay': 'oklch(0% 0 0 / 0.75)',
  '--color-foreground-default': 'oklch(0.94 0.005 250)',
  '--color-foreground-muted': 'oklch(0.65 0.01 250)',
  '--color-foreground-subtle': 'oklch(0.50 0.01 250)',
  '--color-foreground-on-emphasis': 'oklch(0.12 0.01 250)',
  '--color-border-default': 'oklch(0.28 0.01 250)',
  '--color-border-muted': 'oklch(0.22 0.01 250)',
  '--color-success-default': 'oklch(0.65 0.16 145)',
  '--color-success-foreground': 'oklch(0.12 0.04 145)',
  '--color-success-subtle': 'oklch(0.20 0.06 145)',
  '--color-warning-default': 'oklch(0.72 0.15 85)',
  '--color-warning-foreground': 'oklch(0.12 0.04 85)',
  '--color-warning-subtle': 'oklch(0.20 0.06 85)',
  '--color-error-default': 'oklch(0.68 0.18 25)',
  '--color-error-foreground': 'oklch(0.12 0.04 25)',
  '--color-error-subtle': 'oklch(0.20 0.06 25)',
  '--color-info-default': 'oklch(0.65 0.17 250)',
  '--color-info-foreground': 'oklch(0.12 0.04 250)',
  '--color-info-subtle': 'oklch(0.20 0.06 250)',
};

// ─── Luxury Airways (deep navy, gold, sharp) ─────────────────────────────────

const luxuryShape = {
  '--shape-preset-button': '2px',
  '--shape-preset-card': '2px',
  '--shape-preset-input': '1px',
  '--shape-preset-dialog': '4px',
  '--shape-preset-badge': '1px',
};

const luxuryLight: Record<string, string> = {
  ...defaultLight,
  ...luxuryShape,
  '--color-primary-default': 'oklch(0.32 0.12 255)',
  '--color-primary-hover': 'oklch(0.26 0.12 255)',
  '--color-primary-active': 'oklch(0.20 0.12 255)',
  '--color-primary-foreground': 'oklch(0.98 0.01 85)',
  '--color-accent-default': 'oklch(0.72 0.16 85)',
  '--color-accent-hover': 'oklch(0.66 0.16 85)',
  '--color-accent-active': 'oklch(0.60 0.16 85)',
  '--color-accent-foreground': 'oklch(0.15 0.05 85)',
  '--color-background-default': 'oklch(0.99 0.001 255)',
  '--color-background-subtle': 'oklch(0.97 0.003 255)',
  '--color-surface-card': 'oklch(1 0 0)',
  '--color-foreground-default': 'oklch(0.10 0.015 255)',
  '--color-foreground-muted': 'oklch(0.42 0.01 255)',
};

const luxuryDark: Record<string, string> = {
  ...defaultDark,
  ...luxuryShape,
  '--color-primary-default': 'oklch(0.62 0.10 255)',
  '--color-primary-hover': 'oklch(0.68 0.10 255)',
  '--color-primary-active': 'oklch(0.74 0.10 255)',
  '--color-primary-foreground': 'oklch(0.10 0.03 85)',
  '--color-accent-default': 'oklch(0.78 0.15 85)',
  '--color-accent-hover': 'oklch(0.82 0.15 85)',
  '--color-accent-active': 'oklch(0.86 0.15 85)',
  '--color-accent-foreground': 'oklch(0.12 0.04 85)',
  '--color-background-default': 'oklch(0.12 0.015 255)',
  '--color-background-subtle': 'oklch(0.16 0.015 255)',
  '--color-surface-card': 'oklch(0.16 0.015 255)',
};

// ─── Adventure Co (forest green, orange, rounded) ────────────────────────────

const adventureLight: Record<string, string> = {
  ...defaultLight,
  '--color-primary-default': 'oklch(0.46 0.15 150)',
  '--color-primary-hover': 'oklch(0.40 0.15 150)',
  '--color-primary-active': 'oklch(0.34 0.15 150)',
  '--color-primary-foreground': 'oklch(0.98 0.01 150)',
  '--color-accent-default': 'oklch(0.62 0.20 55)',
  '--color-accent-hover': 'oklch(0.56 0.20 55)',
  '--color-accent-active': 'oklch(0.50 0.20 55)',
  '--color-accent-foreground': 'oklch(0.15 0.04 55)',
  '--color-secondary-default': 'oklch(0.50 0.11 102)',
  '--color-secondary-hover': 'oklch(0.44 0.11 102)',
  '--color-secondary-foreground': 'oklch(0.98 0.01 102)',
  '--color-background-default': 'oklch(0.98 0.004 150)',
  '--color-background-subtle': 'oklch(0.95 0.006 150)',
  '--color-foreground-default': 'oklch(0.12 0.015 150)',
  '--color-border-default': 'oklch(0.87 0.008 150)',
};

const adventureDark: Record<string, string> = {
  ...defaultDark,
  '--color-primary-default': 'oklch(0.60 0.14 150)',
  '--color-primary-hover': 'oklch(0.66 0.14 150)',
  '--color-primary-active': 'oklch(0.72 0.14 150)',
  '--color-primary-foreground': 'oklch(0.10 0.03 150)',
  '--color-accent-default': 'oklch(0.70 0.18 55)',
  '--color-accent-hover': 'oklch(0.75 0.18 55)',
  '--color-accent-active': 'oklch(0.80 0.18 55)',
  '--color-accent-foreground': 'oklch(0.12 0.04 55)',
  '--color-background-default': 'oklch(0.12 0.012 150)',
  '--color-background-subtle': 'oklch(0.16 0.012 150)',
  '--color-surface-card': 'oklch(0.16 0.012 150)',
};

// ─── Eco Getaways (teal, amber, pill) ────────────────────────────────────────

const ecoShape = {
  '--shape-preset-button': '9999px',
  '--shape-preset-card': '24px',
  '--shape-preset-input': '9999px',
  '--shape-preset-dialog': '24px',
  '--shape-preset-badge': '9999px',
};

const ecoLight: Record<string, string> = {
  ...defaultLight,
  ...ecoShape,
  '--color-primary-default': 'oklch(0.52 0.16 195)',
  '--color-primary-hover': 'oklch(0.46 0.16 195)',
  '--color-primary-active': 'oklch(0.40 0.16 195)',
  '--color-primary-foreground': 'oklch(0.98 0.01 195)',
  '--color-accent-default': 'oklch(0.68 0.17 75)',
  '--color-accent-hover': 'oklch(0.62 0.17 75)',
  '--color-accent-active': 'oklch(0.56 0.17 75)',
  '--color-accent-foreground': 'oklch(0.15 0.04 75)',
  '--color-background-default': 'oklch(0.98 0.005 195)',
  '--color-background-subtle': 'oklch(0.95 0.007 195)',
  '--color-foreground-default': 'oklch(0.12 0.012 195)',
  '--color-border-default': 'oklch(0.88 0.008 195)',
};

const ecoDark: Record<string, string> = {
  ...defaultDark,
  ...ecoShape,
  '--color-primary-default': 'oklch(0.64 0.15 195)',
  '--color-primary-hover': 'oklch(0.70 0.15 195)',
  '--color-primary-active': 'oklch(0.76 0.15 195)',
  '--color-primary-foreground': 'oklch(0.10 0.03 195)',
  '--color-accent-default': 'oklch(0.74 0.16 75)',
  '--color-accent-hover': 'oklch(0.79 0.16 75)',
  '--color-accent-active': 'oklch(0.84 0.16 75)',
  '--color-accent-foreground': 'oklch(0.12 0.04 75)',
  '--color-background-default': 'oklch(0.12 0.012 195)',
  '--color-background-subtle': 'oklch(0.16 0.012 195)',
  '--color-surface-card': 'oklch(0.16 0.012 195)',
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const brandTokens: Record<BrandId, TokenSet> = {
  default: { light: defaultLight, dark: defaultDark },
  luxury: { light: luxuryLight, dark: luxuryDark },
  adventure: { light: adventureLight, dark: adventureDark },
  eco: { light: ecoLight, dark: ecoDark },
};

export function getBrandCSS(brandId: BrandId, mode: ColorMode): string {
  const tokens = brandTokens[brandId]?.[mode] ?? brandTokens.default.light;
  return Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
}

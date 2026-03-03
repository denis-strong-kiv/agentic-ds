// ─── WCAG AA Contrast Pair Registry ──────────────────────────────────────────
// Defines which semantic token pairs must meet contrast requirements.

export interface ContrastPairDefinition {
  name: string;
  fg: string;
  bg: string;
  size: 'normal' | 'large';
  /** Minimum required ratio (4.5 for normal, 3.0 for large) */
  minRatio: number;
}

/**
 * All semantic token pairs required to meet WCAG 2.1 AA.
 * Used by the validation engine for both light and dark mode checks.
 */
export const WCAG_CONTRAST_PAIRS: ContrastPairDefinition[] = [
  // ── Body text ────────────────────────────────────────────────────────────────
  {
    name: 'foreground/background',
    fg: 'color.foreground.default',
    bg: 'color.background.default',
    size: 'normal',
    minRatio: 4.5,
  },
  {
    name: 'muted-foreground/background',
    fg: 'color.foreground.muted',
    bg: 'color.background.default',
    size: 'normal',
    minRatio: 4.5,
  },

  // ── Primary actions ───────────────────────────────────────────────────────────
  {
    name: 'primary-foreground/primary',
    fg: 'color.primary.foreground',
    bg: 'color.primary.default',
    size: 'large',   // Button text qualifies as large text (bold ≥14pt)
    minRatio: 3.0,
  },

  // ── Accent actions ────────────────────────────────────────────────────────────
  {
    name: 'accent-foreground/accent',
    fg: 'color.accent.foreground',
    bg: 'color.accent.default',
    size: 'large',
    minRatio: 3.0,
  },

  // ── Semantic status ───────────────────────────────────────────────────────────
  {
    name: 'success-foreground/success',
    fg: 'color.success.foreground',
    bg: 'color.success.default',
    size: 'normal',
    minRatio: 4.5,
  },
  {
    name: 'warning-foreground/warning',
    fg: 'color.warning.foreground',
    bg: 'color.warning.default',
    size: 'normal',
    minRatio: 4.5,
  },
  {
    name: 'error-foreground/error',
    fg: 'color.error.foreground',
    bg: 'color.error.default',
    size: 'normal',
    minRatio: 4.5,
  },
  {
    name: 'info-foreground/info',
    fg: 'color.info.foreground',
    bg: 'color.info.default',
    size: 'normal',
    minRatio: 4.5,
  },
];

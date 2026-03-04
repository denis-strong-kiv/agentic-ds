import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

// Circular badge for numeric counts, status dots, or icon indicators.
// Distinct from Badge (tag/label) — always circular, designed to overlay other elements.

const notificationBadgeVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-full font-semibold leading-none tabular-nums shrink-0',
  ],
  {
    variants: {
      variant: {
        // ── Figma: Brand ──────────────────────────────────────────────────────
        brand: 'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)]',
        // ── Figma: Accent ─────────────────────────────────────────────────────
        accent: 'bg-[var(--color-accent-default)] text-[var(--color-accent-foreground)]',
        // ── Figma: Success ────────────────────────────────────────────────────
        success: 'bg-[var(--color-success-default)] text-[var(--color-success-foreground)]',
        // ── Figma: Warning ────────────────────────────────────────────────────
        warning: 'bg-[var(--color-warning-default)] text-[var(--color-warning-foreground)]',
        // ── Figma: Danger ─────────────────────────────────────────────────────
        danger: 'bg-[var(--color-error-default)] text-[var(--color-error-foreground)]',
        // ── Figma: Neutral ────────────────────────────────────────────────────
        neutral: 'bg-[var(--color-foreground-default)] text-[var(--color-background-default)]',
        // ── Figma: Inverted (for dark surfaces) ───────────────────────────────
        inverted: 'bg-[oklch(100%_0_0)] text-[var(--color-foreground-default)]',
      },
      size: {
        // Figma Large: 20×20px, 11px text
        lg: 'h-5 min-w-5 px-1 text-[11px]',
        // Figma Medium: 16×16px, 10px text
        md: 'h-4 min-w-4 px-1 text-[10px]',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'lg',
    },
  },
);

export interface NotificationBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof notificationBadgeVariants> {
  /** Numeric count to display. Omit to render children (icon/dot mode). */
  count?: number;
  /** Upper bound before the label becomes "{max}+". Defaults to 99. */
  max?: number;
}

export function NotificationBadge({
  className,
  variant,
  size,
  count,
  max = 99,
  children,
  'aria-label': ariaLabel,
  ...props
}: NotificationBadgeProps) {
  const label = count !== undefined
    ? count > max ? `${max}+` : String(count)
    : undefined;

  return (
    <span
      className={cn(notificationBadgeVariants({ variant, size }), className)}
      aria-label={ariaLabel ?? (label !== undefined ? `${label} notifications` : undefined)}
      {...props}
    >
      {label ?? children}
    </span>
  );
}

export { notificationBadgeVariants };

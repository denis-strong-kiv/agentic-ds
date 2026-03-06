import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Circular badge for numeric counts, status dots, or icon indicators.
// Distinct from Badge (tag/label) — always circular, designed to overlay other elements.

const notificationBadgeVariants = cva(
  ['ui-notification-badge'],
  {
    variants: {
      variant: {
        brand: 'ui-notification-badge--brand',
        accent: 'ui-notification-badge--accent',
        success: 'ui-notification-badge--success',
        warning: 'ui-notification-badge--warning',
        danger: 'ui-notification-badge--danger',
        neutral: 'ui-notification-badge--neutral',
        inverted: 'ui-notification-badge--inverted',
      },
      size: {
        lg: 'ui-notification-badge--lg',
        md: 'ui-notification-badge--md',
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

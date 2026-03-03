import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

const badgeVariants = cva(
  [
    'inline-flex items-center rounded-[var(--shape-preset-badge)]',
    'border px-2.5 py-0.5 text-xs font-semibold',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-default)]',
  ],
  {
    variants: {
      variant: {
        // Base variants
        default: [
          'border-transparent',
          'bg-[var(--color-background-subtle)] text-[var(--color-foreground-default)]',
        ],
        secondary: [
          'border-transparent',
          'bg-[var(--color-secondary-default)] text-[var(--color-secondary-foreground)]',
        ],
        outline: [
          'border-[var(--color-border-default)] text-[var(--color-foreground-default)]',
        ],
        destructive: [
          'border-transparent',
          'bg-[var(--color-error-default)] text-[var(--color-error-foreground)]',
        ],
        // Travel-specific variants
        deal: [
          'border-transparent',
          'bg-[var(--color-success-default)] text-[var(--color-success-foreground)]',
        ],
        new: [
          'border-transparent',
          'bg-[var(--color-accent-default)] text-[var(--color-accent-foreground)]',
        ],
        popular: [
          'border-transparent',
          'bg-[var(--color-warning-default)] text-[var(--color-warning-foreground)]',
        ],
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn.js';

const badgeVariants = cva(
  ['ui-badge'],
  {
    variants: {
      variant: {
        default: ['ui-badge--default'],
        secondary: ['ui-badge--secondary'],
        outline: ['ui-badge--outline'],
        destructive: ['ui-badge--destructive'],
        deal: ['ui-badge--deal'],
        new: ['ui-badge--new'],
        popular: ['ui-badge--popular'],
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

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn.js';

const skeletonVariants = cva('ui-skeleton', {
  variants: {
    animation: {
      pulse: 'ui-skeleton--pulse',
      shimmer: 'ui-skeleton--shimmer',
      none: 'ui-skeleton--none',
    },
  },
  defaultVariants: { animation: 'pulse' },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export function Skeleton({ className, animation, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ animation }), className)}
      aria-hidden="true"
      {...props}
    />
  );
}

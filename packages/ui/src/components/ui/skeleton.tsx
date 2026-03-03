import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

const skeletonVariants = cva(
  'rounded-md bg-[var(--color-background-subtle)]',
  {
    variants: {
      animation: {
        pulse: 'motion-safe:animate-[skeleton-pulse_1.5s_var(--easing-ease-in-out,cubic-bezier(0.4,0,0.2,1))_infinite]',
        shimmer: [
          'relative overflow-hidden',
          'before:absolute before:inset-0',
          'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
          'before:bg-[length:200%_100%]',
          'motion-safe:before:animate-[skeleton-shimmer_1.8s_linear_infinite]',
        ],
        none: '',
      },
    },
    defaultVariants: { animation: 'pulse' },
  },
);

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

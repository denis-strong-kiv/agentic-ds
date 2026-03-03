import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

const skeletonVariants = cva(
  'rounded-md bg-[var(--color-background-subtle)]',
  {
    variants: {
      animation: {
        pulse: 'animate-pulse',
        shimmer: [
          'relative overflow-hidden',
          'before:absolute before:inset-0',
          'before:-translate-x-full before:animate-[shimmer_1.5s_infinite]',
          'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
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

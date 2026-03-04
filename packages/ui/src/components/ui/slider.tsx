'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../utils/cn.js';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Show formatted value labels above thumbs */
  showValue?: boolean;
  /** Format function for value labels */
  formatValue?: (value: number) => string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showValue, formatValue = String, 'aria-label': ariaLabel, ...props }, ref) => {
  const values = props.value ?? props.defaultValue ?? [0];

  return (
    <div className="relative">
      {showValue && (
        <div className="flex justify-between mb-1">
          {values.map((v, i) => (
            <span key={i} className="text-xs text-[var(--color-foreground-muted)]">
              {formatValue(v)}
            </span>
          ))}
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            'relative h-1.5 w-full grow overflow-hidden rounded-full',
            'bg-[var(--color-border-default)]',
          )}
        >
          <SliderPrimitive.Range
            className="absolute h-full bg-[var(--color-primary-default)]"
          />
        </SliderPrimitive.Track>
        {values.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            aria-label={values.length > 1 ? (i === 0 ? 'Minimum' : 'Maximum') : ariaLabel}
            className={cn(
              'block h-4 w-4 rounded-full',
              'border border-[var(--color-primary-default)] bg-white',
              'shadow transition-transform',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)]',
              'disabled:pointer-events-none disabled:opacity-50',
              'hover:scale-110',
            )}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

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
    <div className="ui-slider-container">
      {showValue && (
        <div className="ui-slider-values">
          {values.map((v, i) => (
            <span key={i} className="ui-slider-value-label">
              {formatValue(v)}
            </span>
          ))}
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          'ui-slider-root',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            'ui-slider-track',
          )}
        >
          <SliderPrimitive.Range
            className="ui-slider-range"
          />
        </SliderPrimitive.Track>
        {values.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            aria-label={values.length > 1 ? (i === 0 ? 'Minimum' : 'Maximum') : ariaLabel}
            className={cn(
              'ui-slider-thumb',
            )}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

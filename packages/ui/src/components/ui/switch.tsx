'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../utils/cn.js';

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /** Label positioning relative to the switch */
  labelPosition?: 'left' | 'right';
  /** Label text */
  label?: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, labelPosition = 'right', ...props }, ref) => {
  const control = (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
        'border-2 border-transparent',
        'transition-colors duration-[var(--duration-normal)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'bg-[var(--color-border-default)]',
        'data-[state=checked]:bg-[var(--color-primary-default)]',
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full',
          'bg-white shadow-lg ring-0',
          'transition-transform duration-[var(--duration-normal)]',
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label) return control;

  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', props.disabled && 'cursor-not-allowed opacity-50')}>
      {labelPosition === 'left' && (
        <span className="text-sm font-medium text-[var(--color-foreground-default)]">{label}</span>
      )}
      {control}
      {labelPosition === 'right' && (
        <span className="text-sm font-medium text-[var(--color-foreground-default)]">{label}</span>
      )}
    </label>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };

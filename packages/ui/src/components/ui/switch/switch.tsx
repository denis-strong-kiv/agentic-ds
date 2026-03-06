'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../../utils/cn.js';

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
        'ui-switch',
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className={cn('ui-switch-thumb')}
      />
    </SwitchPrimitive.Root>
  );

  if (!label) return control;

  return (
    <label className={cn('ui-switch-label-wrap', props.disabled && 'ui-switch-label-wrap--disabled')}>
      {labelPosition === 'left' && (
        <span className="ui-switch-label">{label}</span>
      )}
      {control}
      {labelPosition === 'right' && (
        <span className="ui-switch-label">{label}</span>
      )}
    </label>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };

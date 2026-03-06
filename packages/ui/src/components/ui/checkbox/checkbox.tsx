'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../../utils/cn.js';
import { Icon } from '../icon/index.js';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'ui-checkbox',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="ui-checkbox-indicator">
      {props.checked === 'indeterminate' ? (
        <Icon icon={Minus} size="xs" />
      ) : (
        <Icon icon={Check} size="xs" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

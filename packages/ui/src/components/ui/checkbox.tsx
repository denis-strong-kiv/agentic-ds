'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { Icon } from './icon.js';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm',
      'border border-[var(--color-border-default)]',
      'bg-[var(--color-surface-card)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-[var(--color-primary-default)] data-[state=checked]:border-[var(--color-primary-default)]',
      'data-[state=checked]:text-[var(--color-primary-foreground)]',
      'data-[state=indeterminate]:bg-[var(--color-primary-default)] data-[state=indeterminate]:border-[var(--color-primary-default)]',
      'data-[state=indeterminate]:text-[var(--color-primary-foreground)]',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
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

import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface DestinationItemContentProps {
  leading?: React.ReactNode;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  meta?: string;
  titleClassName?: string;
}

export function DestinationItemContent({
  leading,
  title,
  subtitle,
  trailing,
  meta,
  titleClassName,
}: DestinationItemContentProps) {
  return (
    <>
      {leading}
      <span className="min-w-0">
        <span className={cn('flex items-baseline gap-1.5 truncate text-sm font-medium text-[var(--color-foreground-default)]', titleClassName)}>
          <span className="truncate">{title}</span>
          {trailing}
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-xs text-[var(--color-foreground-muted)]">
            {subtitle}
          </span>
        )}
        {meta && (
          <span className="block truncate text-[11px] font-semibold uppercase tracking-wide text-[var(--color-foreground-subtle)]">
            {meta}
          </span>
        )}
      </span>
    </>
  );
}

'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';
import { Button } from './button.js';
import { Calendar } from './calendar.js';
import { cn } from '../../utils/cn.js';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabledDates,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const formatted = value
    ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={cn('w-full justify-start text-left font-normal', !value && 'text-[var(--color-foreground-subtle)]', className)}
          aria-haspopup="dialog"
        >
          <svg className="mr-2 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {formatted}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          {...(value !== undefined ? { selected: value } : {})}
          onSelect={(date) => { onChange?.(date); setOpen(false); }}
          {...(minDate !== undefined ? { minDate } : {})}
          {...(maxDate !== undefined ? { maxDate } : {})}
          {...(disabledDates !== undefined ? { disabledDates } : {})}
        />
      </PopoverContent>
    </Popover>
  );
}

export interface DateRangePickerProps {
  value?: { from?: Date; to?: Date };
  onChange?: (range: { from?: Date; to?: Date }) => void;
  placeholder?: { from?: string; to?: string };
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = { from: 'Departure', to: 'Return' },
  minDate,
  maxDate,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [stage, setStage] = React.useState<'from' | 'to'>('from');

  function handleSelect(date: Date) {
    if (stage === 'from') {
      onChange?.({ from: date });
      setStage('to');
    } else {
      if (value?.from && date < value.from) {
        onChange?.({ from: date, to: value.from });
      } else {
        onChange?.({ ...value, to: date });
      }
      setOpen(false);
      setStage('from');
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={cn('w-full justify-start text-left font-normal gap-2', className)}
        >
          <span className={cn(!value?.from && 'text-[var(--color-foreground-subtle)]')}>
            {value?.from ? value.from.toLocaleDateString() : placeholder.from}
          </span>
          <span className="text-[var(--color-foreground-muted)]">→</span>
          <span className={cn(!value?.to && 'text-[var(--color-foreground-subtle)]')}>
            {value?.to ? value.to.toLocaleDateString() : placeholder.to}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          {...(value !== undefined ? { selected: value } : {})}
          onSelect={handleSelect}
          {...(minDate !== undefined ? { minDate } : {})}
          {...(maxDate !== undefined ? { maxDate } : {})}
        />
        <div className="px-3 pb-3 text-xs text-[var(--color-foreground-muted)]">
          {stage === 'from' ? 'Select departure date' : 'Select return date'}
        </div>
      </PopoverContent>
    </Popover>
  );
}

'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/index.js';
import { Button } from '../button/index.js';
import { Calendar } from '../calendar/index.js';
import { cn } from '../../../utils/cn.js';

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
          className={cn('ui-date-picker-trigger', !value && 'ui-date-picker-trigger--placeholder', className)}
          aria-haspopup="dialog"
        >
          <svg className="ui-date-picker-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {formatted}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="ui-date-picker-popover" align="start">
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
          className={cn('ui-date-range-picker-trigger', className)}
        >
          <span className={cn('ui-date-range-picker-value', !value?.from && 'ui-date-range-picker-value--placeholder')}>
            {value?.from ? value.from.toLocaleDateString() : placeholder.from}
          </span>
          <span className="ui-date-range-picker-separator">→</span>
          <span className={cn('ui-date-range-picker-value', !value?.to && 'ui-date-range-picker-value--placeholder')}>
            {value?.to ? value.to.toLocaleDateString() : placeholder.to}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="ui-date-picker-popover" align="start">
        <Calendar
          mode="range"
          {...(value !== undefined ? { selected: value } : {})}
          onSelect={handleSelect}
          {...(minDate !== undefined ? { minDate } : {})}
          {...(maxDate !== undefined ? { maxDate } : {})}
        />
        <div className="ui-date-range-picker-stage">
          {stage === 'from' ? 'Select departure date' : 'Select return date'}
        </div>
      </PopoverContent>
    </Popover>
  );
}

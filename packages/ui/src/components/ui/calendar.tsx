'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { buttonVariants } from './button.js';

type CalendarDate = Date;

export interface CalendarProps {
  /** Selected date or date range */
  selected?: CalendarDate | { from?: CalendarDate; to?: CalendarDate };
  /** Minimum selectable date */
  minDate?: CalendarDate;
  /** Maximum selectable date */
  maxDate?: CalendarDate;
  /** Dates that cannot be selected */
  disabledDates?: CalendarDate[];
  /** Called when a date is selected */
  onSelect?: (date: CalendarDate) => void;
  /** Selection mode: single date or date range */
  mode?: 'single' | 'range';
  /** Optional price overlay for travel use case */
  priceOverlay?: (date: CalendarDate) => string | undefined;
  className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function isSameDay(a: CalendarDate, b: CalendarDate): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function Calendar({
  selected,
  minDate,
  maxDate,
  disabledDates = [],
  onSelect,
  mode = 'single',
  priceOverlay,
  className,
}: CalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function isDisabled(date: CalendarDate): boolean {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(d => isSameDay(d, date));
  }

  function isSelected(date: CalendarDate): boolean {
    if (!selected) return false;
    if (selected instanceof Date) return isSameDay(selected, date);
    if ('from' in selected && selected.from) {
      if (isSameDay(selected.from, date)) return true;
      if (selected.to && isSameDay(selected.to, date)) return true;
    }
    return false;
  }

  function isInRange(date: CalendarDate): boolean {
    if (mode !== 'range' || !selected || selected instanceof Date) return false;
    const { from, to } = selected as { from?: CalendarDate; to?: CalendarDate };
    if (!from || !to) return false;
    return date > from && date < to;
  }

  const cells: (CalendarDate | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  return (
    <div className={cn('p-3 select-none', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-7 w-7')}
          aria-label="Previous month"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-medium text-[var(--color-foreground-default)]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-7 w-7')}
          aria-label="Next month"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(day => (
          <div key={day} className="text-center text-xs text-[var(--color-foreground-muted)] py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;
          const disabled = isDisabled(date);
          const selected_ = isSelected(date);
          const inRange = isInRange(date);
          const isToday = isSameDay(date, today);
          const price = priceOverlay?.(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => !disabled && onSelect?.(date)}
              disabled={disabled}
              aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}${price ? `, ${price}` : ''}`}
              className={cn(
                'relative flex flex-col items-center justify-center h-9 w-full rounded-md',
                'text-xs text-[var(--color-foreground-default)]',
                'transition-colors',
                isToday && !selected_ && 'border border-[var(--color-primary-default)]',
                selected_ && 'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)]',
                inRange && 'bg-[var(--color-background-subtle)]',
                !disabled && !selected_ && 'hover:bg-[var(--color-background-subtle)] cursor-pointer',
                disabled && 'opacity-30 cursor-not-allowed',
              )}
            >
              <span>{date.getDate()}</span>
              {price && (
                <span className={cn(
                  'text-[9px] leading-none',
                  selected_ ? 'text-[var(--color-primary-foreground)]' : 'text-[var(--color-success-default)]',
                )}>
                  {price}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

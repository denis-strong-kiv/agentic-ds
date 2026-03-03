'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../../utils/cn.js';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Sub-label (e.g. airport name for IATA code display) */
  sublabel?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  /** True while options are being fetched asynchronously */
  isLoading?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  isLoading,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(
    () =>
      query
        ? options.filter(
            o =>
              o.label.toLowerCase().includes(query.toLowerCase()) ||
              o.value.toLowerCase().includes(query.toLowerCase()) ||
              o.sublabel?.toLowerCase().includes(query.toLowerCase()),
          )
        : options,
    [options, query],
  );

  const selected = options.find(o => o.value === value);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-[var(--shape-preset-input)]',
            'border border-[var(--color-border-default)]',
            'bg-[var(--color-surface-card)] px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-default)]',
            !selected && 'text-[var(--color-foreground-subtle)]',
            selected && 'text-[var(--color-foreground-default)]',
            className,
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="flex flex-col text-left">
            <span>{selected ? selected.label : placeholder}</span>
            {selected?.sublabel && (
              <span className="text-xs text-[var(--color-foreground-muted)]">{selected.sublabel}</span>
            )}
          </span>
          <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            'z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden',
            'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
            'bg-[var(--color-surface-popover)] shadow-[var(--shadow-md)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
          align="start"
          sideOffset={4}
        >
          {/* Search input */}
          <div className="flex items-center border-b border-[var(--color-border-muted)] px-3">
            <svg className="mr-2 h-4 w-4 shrink-0 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className={cn(
                'flex h-10 w-full rounded-md bg-transparent py-3 text-sm',
                'outline-none placeholder:text-[var(--color-foreground-subtle)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
              autoFocus
            />
          </div>

          {/* Options list */}
          <ul role="listbox" className="max-h-64 overflow-y-auto p-1">
            {isLoading && (
              <li className="px-2 py-4 text-center text-sm text-[var(--color-foreground-muted)]">
                Loading...
              </li>
            )}
            {!isLoading && filtered.length === 0 && (
              <li className="px-2 py-4 text-center text-sm text-[var(--color-foreground-muted)]">
                No results found.
              </li>
            )}
            {!isLoading && filtered.map(option => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                onClick={() => {
                  if (!option.disabled) {
                    onChange?.(option.value);
                    setOpen(false);
                    setQuery('');
                  }
                }}
                className={cn(
                  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm',
                  'text-[var(--color-foreground-default)]',
                  !option.disabled && 'hover:bg-[var(--color-background-subtle)] cursor-pointer',
                  option.disabled && 'opacity-50',
                  option.value === value && 'bg-[var(--color-background-subtle)] font-medium',
                )}
              >
                <span className="flex-1">
                  {option.label}
                  {option.sublabel && (
                    <span className="block text-xs text-[var(--color-foreground-muted)]">
                      {option.sublabel}
                    </span>
                  )}
                </span>
                {option.value === value && (
                  <svg className="h-4 w-4 text-[var(--color-primary-default)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

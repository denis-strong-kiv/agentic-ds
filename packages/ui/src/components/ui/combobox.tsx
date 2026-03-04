'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled,
  className,
  'aria-label': ariaLabel,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isFiltering, setIsFiltering] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = React.useId();

  const selected = options.find(o => o.value === value);

  // Sync displayed text when external value changes (and user isn't mid-type)
  React.useEffect(() => {
    if (!isFiltering) {
      setInputValue(selected?.label ?? '');
    }
  }, [value, selected, isFiltering]);

  // Show all options until user actually types something different
  const filtered = React.useMemo(() => {
    if (!isFiltering || inputValue === '') return options;
    return options.filter(o =>
      o.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [options, inputValue, isFiltering]);

  function selectOption(option: ComboboxOption) {
    if (option.disabled) return;
    onChange?.(option.value);
    setInputValue(option.label);
    setIsFiltering(false);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    setIsFiltering(true);
    setOpen(true);
    setActiveIndex(-1);
  }

  function handleFocus() {
    setIsFiltering(false);
    setOpen(true);
    // Select all so the user can immediately start typing to replace
    inputRef.current?.select();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setIsFiltering(false);
        setActiveIndex(0);
      } else {
        setActiveIndex(i => (i + 1 < filtered.length ? i + 1 : i));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i > 0 ? i - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const candidate = filtered[activeIndex];
      if (open && candidate && !candidate.disabled) {
        selectOption(candidate);
      } else if (open && filtered.length === 1 && !filtered[0].disabled) {
        selectOption(filtered[0]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setInputValue(selected?.label ?? '');
      setIsFiltering(false);
      setActiveIndex(-1);
    } else if (e.key === 'Tab') {
      setOpen(false);
      setInputValue(selected?.label ?? '');
      setIsFiltering(false);
    }
  }

  function handleBlur(e: React.FocusEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false);
      setInputValue(selected?.label ?? '');
      setIsFiltering(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className={cn('relative', className)} onBlur={handleBlur}>
      <div
        className={cn(
          'flex h-10 items-center rounded-[var(--shape-preset-input)]',
          'border border-[var(--color-border-default)]',
          'bg-[var(--color-surface-card)] transition-shadow',
          'focus-within:border-[var(--color-primary-default)]',
          'focus-within:ring-2 focus-within:ring-[var(--color-primary-default)]',
          disabled && 'opacity-50',
        )}
      >
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
          }
          aria-label={ariaLabel}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex-1 h-full bg-transparent px-3 text-sm outline-none',
            'text-[var(--color-foreground-default)]',
            'placeholder:text-[var(--color-foreground-subtle)]',
            disabled && 'cursor-not-allowed',
          )}
        />
        {/* Chevron — mouseDown prevents blur on input */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled}
          onMouseDown={e => {
            e.preventDefault();
            if (!disabled) {
              setOpen(o => !o);
              setIsFiltering(false);
            }
          }}
          className="flex h-full items-center px-2 text-[var(--color-foreground-muted)]"
        >
          <svg
            className={cn('h-4 w-4 transition-transform duration-150', open && 'rotate-180')}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className={cn(
            'absolute z-50 mt-1 w-full overflow-auto py-1',
            'max-h-60 rounded-[var(--shape-preset-card)]',
            'border border-[var(--color-border-default)]',
            'bg-[var(--color-surface-popover)] shadow-[var(--shadow-md)]',
            'animate-in fade-in-0 zoom-in-95',
          )}
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[var(--color-foreground-muted)]">
              No options found.
            </li>
          ) : (
            filtered.map((option, i) => (
              <li
                key={option.value}
                id={`${listboxId}-${i}`}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled || undefined}
                onMouseDown={e => {
                  e.preventDefault();
                  if (!option.disabled) selectOption(option);
                }}
                onMouseEnter={() => { if (!option.disabled) setActiveIndex(i); }}
                className={cn(
                  'flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm',
                  'text-[var(--color-foreground-default)]',
                  activeIndex === i && !option.disabled && 'bg-[var(--color-background-subtle)]',
                  option.value === value && 'font-medium',
                  option.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                {option.label}
                {option.value === value && (
                  <svg
                    className="h-4 w-4 shrink-0 text-[var(--color-primary-default)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

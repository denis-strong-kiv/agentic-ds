'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { Icon } from './icon.js';

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
    <div className={cn('ui-combobox-root', className)} onBlur={handleBlur}>
      <div
        className={cn(
          'ui-combobox-shell',
          disabled && 'ui-combobox-shell--disabled',
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
            'ui-combobox-input',
            disabled && 'ui-combobox-input--disabled',
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
          className="ui-combobox-toggle"
        >
          <Icon icon={ChevronDown} size="sm" className={cn('ui-combobox-toggle-icon', open && 'ui-combobox-toggle-icon--open')} />
        </button>
      </div>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className={cn(
            'ui-combobox-listbox',
          )}
        >
          {filtered.length === 0 ? (
            <li className="ui-combobox-empty">
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
                  'ui-combobox-option',
                  activeIndex === i && !option.disabled && 'ui-combobox-option--active',
                  option.value === value && 'ui-combobox-option--selected',
                  option.disabled && 'ui-combobox-option--disabled',
                )}
              >
                {option.label}
                {option.value === value && (
                  <Icon icon={Check} size="sm" className="ui-combobox-check" />
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

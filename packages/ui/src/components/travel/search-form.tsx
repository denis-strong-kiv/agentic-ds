'use client';

import * as React from 'react';
import {
  ArrowLeftRight,
  CalendarDays,
  Users,
  BedDouble,
  Search,
  Plus,
  Minus,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { Icon } from '../ui/icon.js';
import { Calendar } from '../ui/calendar.js';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.js';
import { Button } from '../ui/button.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SearchTab = 'flights' | 'hotels';
export type TripType = 'round-trip' | 'one-way' | 'multi-city';
export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';

const CABIN_LABELS: Record<CabinClass, string> = {
  'economy': 'Economy',
  'premium-economy': 'Prem. Economy',
  'business': 'Business',
  'first': 'First',
};

export interface AirportOption {
  iata: string;
  city: string;
  country?: string;
}

export interface PassengerConfig {
  adults: number;
  children: number;
  infants: number;
  cabinClass: CabinClass;
}

export interface OccupancyConfig {
  adults: number;
  children: number;
  rooms: number;
}

export interface FlightLeg {
  origin: AirportOption | null;
  destination: AirportOption | null;
  departureDate: Date | null;
}

export interface FlightSearchPayload {
  tab: 'flights';
  tripType: TripType;
  legs: FlightLeg[];
  returnDate: Date | null;
  passengers: PassengerConfig;
}

export interface HotelSearchPayload {
  tab: 'hotels';
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  occupancy: OccupancyConfig;
}

export type TravelSearchPayload = FlightSearchPayload | HotelSearchPayload;

// Backward-compat aliases for existing code that imports from this file
export type SearchPayload = TravelSearchPayload;
export type SearchVertical = SearchTab;

export interface TravelSearchFormProps {
  defaultTab?: SearchTab;
  airportOptions?: AirportOption[];
  onSearch?: (payload: TravelSearchPayload) => void;
  className?: string;
}

// Kept for backward compat
export type SearchFormProps = TravelSearchFormProps;

// ─── Active-field context (drives separator visibility) ───────────────────────

const ActiveFieldCtx = React.createContext<{
  active: string | null;
  setHoverActive: (id: string | null) => void;
  setLockActive: (id: string | null) => void;
}>({ active: null, setHoverActive: () => {}, setLockActive: () => {} });

// ─── FieldSeparator ───────────────────────────────────────────────────────────
// Thin vertical rule that fades out when either adjacent field is hovered.

function FieldSeparator({
  left,
  right,
  className,
}: {
  left: string;
  right: string;
  className?: string;
}) {
  const { active } = React.useContext(ActiveFieldCtx);
  const hidden = active === left || active === right;
  return (
    <div className="tsf-separator-shell" aria-hidden="true">
      <div
        className={cn(
          'tsf-separator',
          hidden ? 'tsf-separator--hidden' : 'tsf-separator--visible',
          className,
        )}
      />
    </div>
  );
}

// ─── SearchField ──────────────────────────────────────────────────────────────
// Wrapper that signals hover to the separator context.

function SearchField({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setHoverActive, setLockActive } = React.useContext(ActiveFieldCtx);
  return (
    <div
      className={cn('tsf-field-shell', className)}
      onMouseEnter={() => setHoverActive(id)}
      onMouseLeave={() => setHoverActive(null)}
      onFocusCapture={() => setLockActive(id)}
      onBlurCapture={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setLockActive(null);
        }
      }}
    >
      {children}
    </div>
  );
}

// ─── Shared field button styles ───────────────────────────────────────────────

const fieldBtn = cn(
  'tsf-field-button',
);

const pillShell = cn(
  'tsf-pill-shell',
);

const tabBtn = (active: boolean) => cn(
  'tsf-tab-button',
  active ? 'tsf-tab-button--active' : 'tsf-tab-button--inactive',
);

const tripTypeLabel = (active: boolean) => cn(
  'tsf-trip-type-label',
  active ? 'tsf-trip-type-label--active' : 'tsf-trip-type-label--inactive',
);

const tripTypeIndicator = (active: boolean) => cn(
  'tsf-trip-type-indicator',
  active ? 'tsf-trip-type-indicator--active' : 'tsf-trip-type-indicator--inactive',
);

function SearchActionButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="primary"
      size={null}
      aria-label="Search"
      onClick={onClick}
      className={cn('tsf-search-action-btn')}
    >
      <Icon icon={Search} size="md" aria-hidden className="shrink-0" />
      <span className="whitespace-nowrap text-base font-semibold">
        Search
      </span>
    </Button>
  );
}

function SearchActionSlot({ onClick }: { onClick: () => void }) {
  return (
    <div className="tsf-search-action-slot">
      <SearchActionButton onClick={onClick} />
    </div>
  );
}

// ─── Counter ──────────────────────────────────────────────────────────────────

function Counter({
  label,
  sublabel,
  value,
  min = 0,
  max = 9,
  onChange,
}: {
  label: string;
  sublabel?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div>
        <p className="text-sm font-medium text-[var(--color-foreground-default)]">{label}</p>
        {sublabel && <p className="text-xs text-[var(--color-foreground-muted)]">{sublabel}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            'border border-[var(--color-border-default)]',
            'text-[var(--color-foreground-default)] transition-colors hover:bg-[var(--color-background-subtle)]',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          <Icon icon={Minus} size="xs" aria-hidden />
        </button>
        <span
          className="w-5 text-center text-sm font-medium text-[var(--color-foreground-default)]"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)]',
            'transition-colors hover:opacity-90',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          <Icon icon={Plus} size="xs" aria-hidden />
        </button>
      </div>
    </div>
  );
}

// ─── AirportField ─────────────────────────────────────────────────────────────

function AirportField({
  id,
  value,
  onChange,
  placeholder,
  options,
  icon,
  className,
  buttonClassName,
}: {
  id: string;
  value: AirportOption | null;
  onChange: (v: AirportOption | null) => void;
  placeholder: string;
  options: AirportOption[];
  icon?: LucideIcon;
  className?: string;
  buttonClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const optionRefs = React.useRef<Array<HTMLLIElement | null>>([]);
  const listId = React.useId();
  const { setLockActive } = React.useContext(ActiveFieldCtx);

  const filtered = query.length >= 1
    ? options.filter(o =>
        o.city.toLowerCase().includes(query.toLowerCase()) ||
        o.iata.toLowerCase().includes(query.toLowerCase()),
      )
    : options.slice(0, 8);

  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  function select(opt: AirportOption) {
    onChange(opt);
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
    setLockActive(null);
  }

  function handleOpen() {
    setOpen(true);
    setLockActive(id);
    setQuery('');
    setActiveIndex(-1);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <SearchField id={id} className={cn('flex-1 min-w-0', open && 'z-20', className)}>
      <button
        type="button"
        aria-label={value ? `${value.city} ${value.iata} — change ${placeholder}` : placeholder}
        onClick={handleOpen}
        onKeyDown={e => {
          if (e.key === 'Escape' && open) {
            e.preventDefault();
            setOpen(false);
            setLockActive(null);
          }
        }}
        className={cn(
          fieldBtn,
          buttonClassName,
          open && 'ring-2 ring-inset ring-[var(--color-primary-default)]',
        )}
      >
        {icon && <Icon icon={icon} size="md" className="shrink-0 text-[var(--color-foreground-muted)]" aria-hidden />}
        <div className="flex min-w-0 items-baseline gap-1.5">
          <span
            className={cn(
              'truncate text-sm font-medium',
              value ? 'text-[var(--color-foreground-default)]' : 'text-[var(--color-foreground-subtle)]',
            )}
          >
            {value ? value.city : placeholder}
          </span>
          {value && (
            <span className="shrink-0 text-xs font-medium uppercase text-[var(--color-foreground-subtle)]">
              {value.iata}
            </span>
          )}
        </div>
      </button>

      {open && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={cn(
            'absolute left-0 top-full z-50 mt-1 w-80',
            'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
            'bg-[var(--color-surface-popover)] shadow-[var(--shadow-md)]',
            'motion-safe:animate-slide-down',
          )}
          onMouseDown={e => e.preventDefault()}
        >
          <div className="border-b border-[var(--color-border-default)] p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search airports or cities…"
              aria-label="Search airports"
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={open && activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
              onKeyDown={e => {
                if (!filtered.length) return;

                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActiveIndex(prev => (prev + 1) % filtered.length);
                  return;
                }

                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActiveIndex(prev => (prev <= 0 ? filtered.length - 1 : prev - 1));
                  return;
                }

                if (e.key === 'Home') {
                  e.preventDefault();
                  setActiveIndex(0);
                  return;
                }

                if (e.key === 'End') {
                  e.preventDefault();
                  setActiveIndex(filtered.length - 1);
                  return;
                }

                if (e.key === 'Enter' && activeIndex >= 0) {
                  e.preventDefault();
                  select(filtered[activeIndex] as AirportOption);
                  return;
                }

                if (e.key === 'Escape') {
                  e.preventDefault();
                  setOpen(false);
                  setLockActive(null);
                }
              }}
              onBlur={() => setOpen(false)}
              onBlurCapture={e => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setLockActive(null);
                }
              }}
              className={cn(
                'w-full rounded-md bg-transparent px-2 py-1.5 text-sm outline-none',
                'text-[var(--color-foreground-default)] placeholder:text-[var(--color-foreground-subtle)]',
              )}
            />
          </div>
          <ul id={listId} role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[var(--color-foreground-muted)]">No airports found.</li>
            ) : (
              filtered.map((opt, index) => (
                <li
                  key={opt.iata}
                  id={`${listId}-opt-${index}`}
                  ref={el => { optionRefs.current[index] = el; }}
                  role="option"
                  aria-selected={value?.iata === opt.iata || activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={() => select(opt)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-3 py-2',
                    'hover:bg-[var(--color-background-subtle)]',
                    activeIndex === index && 'bg-[var(--color-background-subtle)]',
                    value?.iata === opt.iata && 'text-[var(--color-primary-default)]',
                  )}
                >
                  <span className="w-9 shrink-0 text-xs font-medium uppercase text-[var(--color-foreground-subtle)]">
                    {opt.iata}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--color-foreground-default)]">{opt.city}</p>
                    {opt.country && (
                      <p className="truncate text-xs text-[var(--color-foreground-muted)]">{opt.country}</p>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </SearchField>
  );
}

// ─── DateField ────────────────────────────────────────────────────────────────

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function DateField({
  id,
  value,
  onChange,
  placeholder,
  minDate,
  className,
  buttonClassName,
}: {
  id: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
  placeholder: string;
  minDate?: Date;
  className?: string;
  buttonClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { setLockActive } = React.useContext(ActiveFieldCtx);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setLockActive(id);
      return;
    }
    if (!nextOpen) {
      setLockActive(null);
    }
  }

  return (
    <SearchField id={id} className={cn('flex-[1_0_0] min-w-0', open && 'z-20', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={value ? `${formatDate(value)} — change ${placeholder}` : placeholder}
            className={cn(
              fieldBtn,
              buttonClassName,
              open && 'ring-2 ring-inset ring-[var(--color-primary-default)]',
            )}
          >
            <Icon icon={CalendarDays} size="md" className="shrink-0 text-[var(--color-foreground-muted)]" aria-hidden />
            <span
              className={cn(
                'truncate text-sm font-medium',
                value ? 'text-[var(--color-foreground-default)]' : 'text-[var(--color-foreground-subtle)]',
              )}
            >
              {value ? formatDate(value) : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            {...(value ? { selected: value } : {})}
            minDate={minDate ?? new Date()}
            onSelect={d => {
              onChange(d);
              handleOpenChange(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </SearchField>
  );
}

// ─── PassengerField ───────────────────────────────────────────────────────────

function PassengerField({
  id,
  value,
  onChange,
  className,
}: {
  id: string;
  value: PassengerConfig;
  onChange: (c: PassengerConfig) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { setLockActive } = React.useContext(ActiveFieldCtx);
  const total = value.adults + value.children + value.infants;
  const label = `${total}, ${CABIN_LABELS[value.cabinClass]}`;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setLockActive(nextOpen ? id : null);
  }

  return (
    <SearchField id={id} className={cn('flex-[1_0_0] min-w-0', open && 'z-20', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label}
            aria-expanded={open}
            aria-haspopup="dialog"
            className={cn(
              fieldBtn,
              open && 'ring-2 ring-inset ring-[var(--color-primary-default)]',
            )}
          >
            <Icon icon={Users} size="md" className="shrink-0 text-[var(--color-foreground-muted)]" aria-hidden />
            <span className="truncate text-sm font-medium text-[var(--color-foreground-default)]">
              {label}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end">
          <div className="divide-y divide-[var(--color-border-default)] px-4">
            <Counter
              label="Adults"
              sublabel="12+ years"
              value={value.adults}
              min={1}
              max={9}
              onChange={v => onChange({ ...value, adults: v })}
            />
            <Counter
              label="Children"
              sublabel="2–11 years"
              value={value.children}
              min={0}
              max={8}
              onChange={v => onChange({ ...value, children: v })}
            />
            <Counter
              label="Infants"
              sublabel="Under 2"
              value={value.infants}
              min={0}
              max={value.adults}
              onChange={v => onChange({ ...value, infants: v })}
            />
          </div>
          <div className="border-t border-[var(--color-border-default)] p-3">
            <p className="mb-2 text-xs font-medium text-[var(--color-foreground-muted)]">Cabin class</p>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(CABIN_LABELS) as CabinClass[]).map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => onChange({ ...value, cabinClass: cls })}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                    value.cabinClass === cls
                      ? 'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)]'
                      : 'border border-[var(--color-border-default)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-subtle)]',
                  )}
                >
                  {CABIN_LABELS[cls]}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-[var(--color-border-default)] p-3 flex justify-end">
            <Button size="sm" onClick={() => handleOpenChange(false)}>Done</Button>
          </div>
        </PopoverContent>
      </Popover>
    </SearchField>
  );
}

// ─── OccupancyField ───────────────────────────────────────────────────────────

function OccupancyField({
  id,
  value,
  onChange,
  className,
}: {
  id: string;
  value: OccupancyConfig;
  onChange: (c: OccupancyConfig) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { setLockActive } = React.useContext(ActiveFieldCtx);
  const total = value.adults + value.children;
  const label = `${total} Guest${total !== 1 ? 's' : ''}, ${value.rooms} Room${value.rooms !== 1 ? 's' : ''}`;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setLockActive(nextOpen ? id : null);
  }

  return (
    <SearchField id={id} className={cn('flex-[1_0_0] min-w-0', open && 'z-20', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label}
            aria-expanded={open}
            aria-haspopup="dialog"
            className={cn(
              fieldBtn,
              open && 'ring-2 ring-inset ring-[var(--color-primary-default)]',
            )}
          >
            <Icon icon={BedDouble} size="md" className="shrink-0 text-[var(--color-foreground-muted)]" aria-hidden />
            <span className="truncate text-sm font-medium text-[var(--color-foreground-default)]">
              {label}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end">
          <div className="divide-y divide-[var(--color-border-default)] px-4">
            <Counter
              label="Adults"
              value={value.adults}
              min={1}
              max={30}
              onChange={v => onChange({ ...value, adults: v })}
            />
            <Counter
              label="Children"
              sublabel="Ages 0–17"
              value={value.children}
              min={0}
              max={10}
              onChange={v => onChange({ ...value, children: v })}
            />
            <Counter
              label="Rooms"
              value={value.rooms}
              min={1}
              max={30}
              onChange={v => onChange({ ...value, rooms: v })}
            />
          </div>
          <div className="border-t border-[var(--color-border-default)] p-3 flex justify-end">
            <Button size="sm" onClick={() => handleOpenChange(false)}>Done</Button>
          </div>
        </PopoverContent>
      </Popover>
    </SearchField>
  );
}

// ─── HotelDestinationField ────────────────────────────────────────────────────

function HotelDestinationField({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: AirportOption | null;
  onChange: (v: AirportOption | null) => void;
  options: AirportOption[];
}) {
  return (
    <AirportField
      id={id}
      value={value}
      onChange={onChange}
      placeholder="Where to?"
      options={options}
      icon={Search}
      className="flex-[2_0_0]"
      buttonClassName="ps-4"
    />
  );
}

// ─── SearchPill ───────────────────────────────────────────────────────────────
// Single outer pill wrapping all fields. Fields inside use rounded-full for
// hover/focus background only — no individual borders.

function SearchPill({
  onSearch,
  children,
}: {
  onSearch: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={pillShell}>
      <div className="flex min-w-0 flex-1 items-stretch">{children}</div>
      <SearchActionSlot onClick={onSearch} />
    </div>
  );
}

// ─── TravelSearchForm ─────────────────────────────────────────────────────────

const TABS: { id: SearchTab; label: string }[] = [
  { id: 'flights', label: 'Flights' },
  { id: 'hotels', label: 'Hotels' },
];

const TRIP_TYPES: { id: TripType; label: string }[] = [
  { id: 'round-trip', label: 'Round-trip' },
  { id: 'one-way', label: 'One-way' },
  { id: 'multi-city', label: 'Multi-city' },
];

const DEFAULT_PASSENGERS: PassengerConfig = { adults: 1, children: 0, infants: 0, cabinClass: 'economy' };
const DEFAULT_OCCUPANCY: OccupancyConfig = { adults: 2, children: 0, rooms: 1 };
const DEFAULT_LEG: FlightLeg = { origin: null, destination: null, departureDate: null };

export function TravelSearchForm({
  defaultTab = 'flights',
  airportOptions = [],
  onSearch,
  className,
}: TravelSearchFormProps) {
  const [activeTab, setActiveTab] = React.useState<SearchTab>(defaultTab);
  const [tripType, setTripType] = React.useState<TripType>('round-trip');

  // Flights state
  const [origin, setOrigin] = React.useState<AirportOption | null>(null);
  const [destination, setDestination] = React.useState<AirportOption | null>(null);
  const [departureDate, setDepartureDate] = React.useState<Date | null>(null);
  const [returnDate, setReturnDate] = React.useState<Date | null>(null);
  const [passengers, setPassengers] = React.useState<PassengerConfig>(DEFAULT_PASSENGERS);
  const [legs, setLegs] = React.useState<FlightLeg[]>([{ ...DEFAULT_LEG }, { ...DEFAULT_LEG }]);
  const [swapRotationDeg, setSwapRotationDeg] = React.useState(0);

  // Hotels state
  const [hotelDest, setHotelDest] = React.useState<AirportOption | null>(null);
  const [checkIn, setCheckIn] = React.useState<Date | null>(null);
  const [checkOut, setCheckOut] = React.useState<Date | null>(null);
  const [occupancy, setOccupancy] = React.useState<OccupancyConfig>(DEFAULT_OCCUPANCY);

  // Separator context
  const [hoverActiveField, setHoverActiveField] = React.useState<string | null>(null);
  const [lockActiveField, setLockActiveField] = React.useState<string | null>(null);
  const activeField = lockActiveField ?? hoverActiveField;

  function handleSwap() {
    setOrigin(destination);
    setDestination(origin);
    setSwapRotationDeg(value => value - 180);
  }

  function handleSearch() {
    if (activeTab === 'flights') {
      onSearch?.({
        tab: 'flights',
        tripType,
        legs: tripType === 'multi-city'
          ? legs
          : [{ origin, destination, departureDate }],
        returnDate: tripType === 'round-trip' ? returnDate : null,
        passengers,
      });
    } else {
      onSearch?.({
        tab: 'hotels',
        destination: hotelDest ? `${hotelDest.city} (${hotelDest.iata})` : '',
        checkIn,
        checkOut,
        occupancy,
      });
    }
  }

  function updateLeg(i: number, patch: Partial<FlightLeg>) {
    setLegs(ls => ls.map((l, j) => j === i ? { ...l, ...patch } : l));
  }

  return (
    <ActiveFieldCtx.Provider
      value={{
        active: activeField,
        setHoverActive: setHoverActiveField,
        setLockActive: setLockActiveField,
      }}
    >
      <div className={cn('flex flex-col gap-3', className)}>

        {/* ── Top nav tabs ─────────────────────────────────────────────────── */}
        <div className="flex justify-center border-b border-[var(--color-border-default)]" role="tablist" aria-label="Travel type">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={tabBtn(activeTab === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Trip type radios (flights only, animated) ────────────────────── */}
        <div
          className={cn(
            'grid transition-all duration-[var(--duration-normal,200ms)] ease-out motion-safe:transition-all',
            activeTab === 'flights' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <div className="flex items-center gap-6 pb-1 ps-2" role="radiogroup" aria-label="Trip type">
              {TRIP_TYPES.map(type => (
                <label
                  key={type.id}
                  className={tripTypeLabel(tripType === type.id)}
                >
                  {/* Custom radio indicator */}
                  <span
                    className={tripTypeIndicator(tripType === type.id)}
                    aria-hidden="true"
                  >
                    {tripType === type.id && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-foreground-default)]" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="tripType"
                    value={type.id}
                    checked={tripType === type.id}
                    onChange={() => setTripType(type.id)}
                    className="sr-only"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Form pill ─────────────────────────────────────────────────────── */}
        {activeTab === 'flights' && tripType !== 'multi-city' && (
          <SearchPill onSearch={handleSearch}>
            {/* Origin + Destination — takes most space */}
            <div
              className={cn(
                'relative flex min-w-0 items-stretch',
                'transition-all duration-[var(--duration-normal,200ms)] ease-out motion-safe:transition-all',
                tripType === 'round-trip' ? 'flex-[3_0_0]' : 'flex-[4_0_0]',
              )}
            >
              <AirportField
                id="origin"
                value={origin}
                onChange={setOrigin}
                placeholder="From"
                options={airportOptions}
              />
              <FieldSeparator left="origin" right="destination" />
              <AirportField
                id="destination"
                value={destination}
                onChange={setDestination}
                placeholder="Where to?"
                options={airportOptions}
                buttonClassName="ps-7"
              />
              {/* Swap button — centered on the separator */}
              <button
                type="button"
                aria-label="Swap origin and destination"
                onClick={handleSwap}
                onMouseEnter={() => setHoverActiveField(null)}
                onMouseMove={() => setHoverActiveField(null)}
                className={cn(
                  'absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2',
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  'border border-[var(--color-border-default)] bg-[var(--color-surface-card)] opacity-100',
                  'transition-colors hover:bg-[var(--color-background-subtle)]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)]',
                )}
              >
                <span
                  className="inline-flex transition-transform duration-[500ms] ease-out"
                  style={{ transform: `rotate(${swapRotationDeg}deg)` }}
                >
                  <Icon icon={ArrowLeftRight} size="sm" className="text-[var(--color-foreground-muted)]" aria-hidden />
                </span>
              </button>
            </div>

            <FieldSeparator left="destination" right="departure" />

            {/* Departure date */}
            <DateField
              id="departure"
              value={departureDate}
              onChange={setDepartureDate}
              placeholder="Depart"
              buttonClassName="ps-3"
              className={cn(
                'transition-all duration-[var(--duration-normal,200ms)] ease-out motion-safe:transition-all',
                tripType === 'round-trip' ? 'flex-[1_0_0]' : 'flex-[1.35_0_0]',
              )}
            />

            {/* Return date — collapses for one-way, allowing smooth width redistribution */}
            <div
              className={cn(
                'flex overflow-hidden items-stretch',
                'transition-all duration-[var(--duration-normal,200ms)] ease-out motion-safe:transition-all',
                tripType === 'round-trip'
                  ? 'max-w-[500px] flex-[1_0_0] opacity-100'
                  : 'max-w-0 flex-[0_0_0] pointer-events-none opacity-0',
              )}
              aria-hidden={tripType !== 'round-trip'}
            >
              <FieldSeparator left="departure" right="return" />
              <DateField
                id="return"
                value={returnDate}
                onChange={setReturnDate}
                placeholder="Return"
                buttonClassName="ps-3"
                {...(departureDate ? { minDate: departureDate } : {})}
              />
            </div>

            <FieldSeparator
              left={tripType === 'round-trip' ? 'return' : 'departure'}
              right="passengers"
            />

            {/* Passengers + cabin class */}
            <PassengerField
              id="passengers"
              value={passengers}
              onChange={setPassengers}
              className="w-[120px] min-w-[120px] shrink-0 flex-none"
            />
          </SearchPill>
        )}

        {/* ── Multi-city: stacked leg rows ─────────────────────────────────── */}
        {activeTab === 'flights' && tripType === 'multi-city' && (
          <div className="flex flex-col gap-2">
            {legs.map((leg, i) => (
              <div
                key={i}
                className={cn(pillShell, 'items-stretch')}
              >
                <div className="flex min-w-0 flex-1 items-stretch">
                  {/* O+D group — takes most space */}
                  <div className="relative flex flex-[3_0_0] min-w-0 items-stretch">
                    <AirportField
                      id={`mc-origin-${i}`}
                      value={leg.origin}
                      onChange={v => updateLeg(i, { origin: v })}
                      placeholder="From"
                      options={airportOptions}
                    />
                    <FieldSeparator left={`mc-origin-${i}`} right={`mc-dest-${i}`} />
                    <AirportField
                      id={`mc-dest-${i}`}
                      value={leg.destination}
                      onChange={v => updateLeg(i, { destination: v })}
                      placeholder="To"
                      options={airportOptions}
                    />
                  </div>
                  <FieldSeparator left={`mc-dest-${i}`} right={`mc-date-${i}`} />
                  <DateField
                    id={`mc-date-${i}`}
                    value={leg.departureDate}
                    onChange={d => updateLeg(i, { departureDate: d })}
                    placeholder="Date"
                    {...(i > 0 && legs[i - 1].departureDate ? { minDate: legs[i - 1].departureDate as Date } : {})}
                  />
                </div>
              </div>
            ))}

            {/* Add/Remove + passengers + search */}
            <div className="flex items-center gap-3 ps-1">
              {legs.length < 4 && (
                <button
                  type="button"
                  onClick={() => setLegs(ls => [...ls, { ...DEFAULT_LEG }])}
                  className="text-sm font-medium text-[var(--color-primary-default)] hover:underline"
                >
                  + Add flight
                </button>
              )}
              {legs.length > 2 && (
                <button
                  type="button"
                  onClick={() => setLegs(ls => ls.slice(0, -1))}
                  className="text-sm font-medium text-[var(--color-foreground-muted)] hover:underline"
                >
                  Remove last
                </button>
              )}
              <div className="ms-auto flex items-center gap-2">
                <div className={pillShell}>
                  <PassengerField id="mc-passengers" value={passengers} onChange={setPassengers} />
                </div>
                <SearchActionSlot onClick={handleSearch} />
              </div>
            </div>
          </div>
        )}

        {/* ── Hotels form ──────────────────────────────────────────────────── */}
        {activeTab === 'hotels' && (
          <SearchPill onSearch={handleSearch}>
            <HotelDestinationField id="hotel-dest" value={hotelDest} onChange={setHotelDest} options={airportOptions} />
            <FieldSeparator left="hotel-dest" right="checkin" />
            <DateField id="checkin" value={checkIn} onChange={setCheckIn} placeholder="Check-in" />
            <FieldSeparator left="checkin" right="checkout" />
            <DateField
              id="checkout"
              value={checkOut}
              onChange={setCheckOut}
              placeholder="Check-out"
              {...(checkIn ? { minDate: checkIn } : {})}
            />
            <FieldSeparator left="checkout" right="guests" />
            <OccupancyField id="guests" value={occupancy} onChange={setOccupancy} />
          </SearchPill>
        )}

      </div>
    </ActiveFieldCtx.Provider>
  );
}

// Backward-compat alias — old code importing `SearchForm` still works.
export const SearchForm = TravelSearchForm;

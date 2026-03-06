'use client';

import * as React from 'react';
import {
  ArrowLeftRight,
  CalendarDays,
  Users,
  BedDouble,
  Search,
  Plane,
  Plus,
  Minus,
  type LucideIcon,
} from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../utils/cn.js';
import { Icon } from '../../ui/icon/index.js';
import { Calendar } from '../../ui/calendar/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover/index.js';
import { Button } from '../../ui/button/index.js';
import {
  DestinationItemContent,
  type DestinationDisplayType,
} from '../destination-item-content/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SearchTab = 'flights' | 'hotels';
export type TripType = 'round-trip' | 'one-way' | 'multi-city';
export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';
export type DestinationItemType =
  | 'airport'
  | 'city'
  | 'neighborhood'
  | 'country'
  | 'landmark'
  | 'area';

export interface GeographicBreadcrumb {
  type: DestinationItemType;
  label: string;
}

const CABIN_LABELS: Record<CabinClass, string> = {
  'economy': 'Economy',
  'premium-economy': 'Prem. Economy',
  'business': 'Business',
  'first': 'First',
};

export interface DestinationOption {
  id?: string;
  iata?: string;
  city?: string;
  code?: string;
  label?: string;
  name?: string;
  shortName?: string;
  country?: string;
  distance?: string;
  thumbnailUrl?: string;
  itemType?: DestinationItemType;
  geographicBreadcrumbs?: GeographicBreadcrumb[];
}

export interface RecentSearchItem {
  route: string;
  from?: string;
  to?: string;
  dates?: string;
}

// Backward-compat alias
export type AirportOption = DestinationOption;

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
  origin: DestinationOption | null;
  destination: DestinationOption | null;
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
  destinationOptions?: DestinationOption[];
  airportOptions?: DestinationOption[];
  recentSearches?: RecentSearchItem[];
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

const destinationPickerPanelVariants = cva([
  'tsf-destination-picker-panel',
]);

const destinationPickerHeaderVariants = cva([
  'tsf-destination-picker-header',
]);

const destinationPickerInputRowVariants = cva([
  'tsf-destination-picker-input-row',
]);

const destinationPickerInputVariants = cva([
  'tsf-destination-picker-input',
]);

const destinationPickerAddButtonVariants = cva([
  'tsf-destination-picker-add-button',
]);

const destinationPickerSectionVariants = cva('tsf-destination-picker-section', {
  variants: {
    divider: {
      bottom: ['tsf-destination-picker-section--bottom'],
      top: ['tsf-destination-picker-section--top'],
      none: [],
    },
  },
  defaultVariants: {
    divider: 'none',
  },
});

const destinationPickerRowVariants = cva([
  'tsf-destination-picker-row',
]);

const destinationPickerAirportRowVariants = cva(
  ['tsf-destination-picker-airport-row'],
  {
    variants: {
      indent: {
        true: ['tsf-destination-picker-airport-row--indented'],
        false: ['tsf-destination-picker-airport-row--full'],
      },
    },
    defaultVariants: {
      indent: false,
    },
  },
);

const destinationPickerListItemVariants = cva(
  ['tsf-destination-picker-list-item'],
  {
    variants: {
      active: {
        true: ['tsf-destination-picker-list-item--active'],
        false: [],
      },
      selected: {
        true: ['tsf-destination-picker-list-item--selected'],
        false: [],
      },
    },
    defaultVariants: {
      active: false,
      selected: false,
    },
  },
);

const destinationPickerRecentRowVariants = cva([
  'tsf-destination-picker-recent-row',
]);

function SearchActionButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="primary"
      size={null}
      aria-label="Search"
      onClick={onClick}
      className={cn('tsf-search-action-btn')}
    >
      <Icon icon={Search} size="md" aria-hidden className="tsf-search-action-icon" />
      <span className="tsf-search-action-label">
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
    <div className="tsf-counter-row">
      <div className="tsf-counter-label-group">
        <p className="tsf-counter-label">{label}</p>
        {sublabel && <p className="tsf-counter-sublabel">{sublabel}</p>}
      </div>
      <div className="tsf-counter-controls">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="tsf-counter-button tsf-counter-button--decrement"
        >
          <Icon icon={Minus} size="xs" aria-hidden />
        </button>
        <span
          className="tsf-counter-value"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="tsf-counter-button tsf-counter-button--increment"
        >
          <Icon icon={Plus} size="xs" aria-hidden />
        </button>
      </div>
    </div>
  );
}

// ─── DestinationPicker ────────────────────────────────────────────────────────

function getDestinationName(option: DestinationOption): string {
  return option.shortName ?? option.city ?? option.label ?? option.name ?? '';
}

function getDestinationOptionTitle(option: DestinationOption): string {
  return option.label ?? option.name ?? option.shortName ?? option.city ?? '';
}

function formatGeographicBreadcrumbs(option: DestinationOption): string {
  if (option.itemType === 'country') return '';
  const crumbs = option.geographicBreadcrumbs?.map(crumb => crumb.label).filter(Boolean) ?? [];
  if (crumbs.length === 0) return '';
  return crumbs.slice(0, 2).join(', ');
}

function getDestinationOptionSubtitle(option: DestinationOption): string {
  const breadcrumbText = formatGeographicBreadcrumbs(option);
  if (breadcrumbText) return breadcrumbText;

  const title = getDestinationOptionTitle(option);
  if (title && option.city && title.toLowerCase() !== option.city.toLowerCase()) {
    return [option.city, option.country].filter(Boolean).join(', ');
  }
  return option.country ?? '';
}

function getDestinationCode(option: DestinationOption): string {
  return option.iata ?? option.code ?? '';
}

function getRecentSearchTitle(item: RecentSearchItem): React.ReactNode {
  if (item.from && item.to) {
    return (
      <span className="tsf-recent-route">
        <span className="tsf-recent-route-point">{item.from}</span>
        <Icon icon={ArrowLeftRight} size="sm" className="tsf-recent-route-icon" aria-hidden />
        <span className="tsf-recent-route-point">{item.to}</span>
      </span>
    );
  }
  return item.route;
}

function getDestinationDisplayType(option: DestinationOption): DestinationDisplayType {
  if (option.itemType) return option.itemType;
  if (getDestinationCode(option)) return 'airport';
  return 'city';
}

function DestinationPicker({
  id,
  value,
  onChange,
  placeholder,
  options,
  pickerType = 'destination',
  excludeCode,
  icon,
  className,
  buttonClassName,
  recentSearches = [],
}: {
  id: string;
  value: DestinationOption | null;
  onChange: (v: DestinationOption | null) => void;
  placeholder: string;
  options: DestinationOption[];
  pickerType?: 'origin' | 'destination' | 'hotel';
  excludeCode?: string;
  icon?: LucideIcon;
  className?: string;
  buttonClassName?: string;
  recentSearches?: RecentSearchItem[];
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const optionRefs = React.useRef<Array<HTMLLIElement | null>>([]);
  const listId = React.useId();
  const { setLockActive } = React.useContext(ActiveFieldCtx);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    const pool = excludeCode
      ? options.filter(option => getDestinationCode(option) !== excludeCode)
      : options;

    const matched = normalizedQuery.length >= 1
      ? pool.filter(option => {
          const name = getDestinationName(option).toLowerCase();
          const title = getDestinationOptionTitle(option).toLowerCase();
          const shortName = (option.shortName ?? '').toLowerCase();
          const code = getDestinationCode(option).toLowerCase();
          const country = (option.country ?? '').toLowerCase();
          const breadcrumbs = (option.geographicBreadcrumbs ?? []).map(crumb => crumb.label.toLowerCase());
          return name.includes(normalizedQuery)
            || title.includes(normalizedQuery)
            || shortName.includes(normalizedQuery)
            || code.includes(normalizedQuery)
            || country.includes(normalizedQuery)
            || breadcrumbs.some(label => label.includes(normalizedQuery));
        })
      : pool;

    const sorted = [...matched].sort((left, right) => {
      const leftName = getDestinationOptionTitle(left).toLowerCase();
      const rightName = getDestinationOptionTitle(right).toLowerCase();
      const leftCode = getDestinationCode(left).toLowerCase();
      const rightCode = getDestinationCode(right).toLowerCase();

      if (normalizedQuery.length >= 1) {
        const leftNameStarts = leftName.startsWith(normalizedQuery);
        const rightNameStarts = rightName.startsWith(normalizedQuery);
        if (leftNameStarts !== rightNameStarts) return leftNameStarts ? -1 : 1;

        const leftCodeStarts = leftCode.startsWith(normalizedQuery);
        const rightCodeStarts = rightCode.startsWith(normalizedQuery);
        if (leftCodeStarts !== rightCodeStarts) return leftCodeStarts ? -1 : 1;
      }

      if (pickerType === 'origin') {
        return leftCode.localeCompare(rightCode) || leftName.localeCompare(rightName);
      }

      return leftName.localeCompare(rightName) || leftCode.localeCompare(rightCode);
    });

    return sorted.slice(0, 8);
  }, [excludeCode, normalizedQuery, options, pickerType]);

  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const featuredCityItem = React.useMemo(() => {
    if (value && (value.itemType === 'city' || (!getDestinationCode(value) && value.city))) {
      return value;
    }

    const selectedCity = value?.city;
    if (selectedCity) {
      const found = filtered.find(item => item.city === selectedCity && (item.itemType === 'city' || !getDestinationCode(item)));
      if (found) return found;

      return {
        city: selectedCity,
        shortName: selectedCity,
        itemType: 'city',
        ...(value?.country ? { country: value.country } : {}),
        ...(value?.thumbnailUrl ? { thumbnailUrl: value.thumbnailUrl } : {}),
      } satisfies DestinationOption;
    }

    return filtered.find(item => item.itemType === 'city' || (!getDestinationCode(item) && Boolean(item.city))) ?? null;
  }, [filtered, value]);

  const cityAirportChildren = React.useMemo(() => {
    if (!featuredCityItem?.city) return [];
    return filtered
      .filter(item => item.city === featuredCityItem.city)
      .filter(item => item.itemType === 'airport' || Boolean(getDestinationCode(item)))
      .slice(0, 5);
  }, [featuredCityItem?.city, filtered]);

  function select(opt: DestinationOption) {
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
    <SearchField id={id} className={cn('tsf-field-shell--destination', open && 'tsf-field-shell--elevated', className)}>
      <button
        type="button"
        aria-label={value
          ? `${getDestinationName(value)}${getDestinationCode(value) ? ` ${getDestinationCode(value)}` : ''} — change ${placeholder}`
          : placeholder}
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
          open && 'tsf-field-button--open',
        )}
      >
        {icon && <Icon icon={icon} size="md" className="tsf-field-icon" aria-hidden />}
        <div className="tsf-destination-button-content">
          <span
            className={cn(
              'tsf-destination-button-value',
              value ? 'tsf-destination-button-value--selected' : 'tsf-destination-button-value--placeholder',
            )}
          >
            {value ? getDestinationName(value) : placeholder}
          </span>
          {value && getDestinationCode(value) && (
            <span className="tsf-destination-button-code">
              {getDestinationCode(value)}
            </span>
          )}
        </div>
      </button>

      {open && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={destinationPickerPanelVariants()}
          onMouseDown={e => e.preventDefault()}
        >
          <div className={destinationPickerHeaderVariants()}>
            <div className={destinationPickerInputRowVariants()}>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search destinations or cities…"
                aria-label={`Search ${pickerType === 'origin' ? 'origins' : 'destinations'}`}
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
                    select(filtered[activeIndex] as DestinationOption);
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
                className={destinationPickerInputVariants()}
              />
              <button
                type="button"
                aria-label="Add destination"
                className={destinationPickerAddButtonVariants()}
              >
                <Icon icon={Plus} size="sm" aria-hidden />
              </button>
            </div>
          </div>

          {!normalizedQuery && pickerType !== 'hotel' && featuredCityItem && (
            <div className={cn(destinationPickerSectionVariants({ divider: 'bottom' }), 'tsf-destination-picker-section--popular')}>
              <p className="tsf-destination-section-label">Popular destination</p>
              <button
                type="button"
                onMouseDown={() => select(featuredCityItem)}
                className={cn(destinationPickerRowVariants(), 'tsf-destination-picker-row--full')}
              >
                <DestinationItemContent
                  title={featuredCityItem.city ?? getDestinationName(featuredCityItem)}
                  subtitle={getDestinationOptionSubtitle(featuredCityItem)}
                  destinationType={getDestinationDisplayType(featuredCityItem)}
                  imageAlt={featuredCityItem.city ?? getDestinationName(featuredCityItem)}
                  {...(featuredCityItem.thumbnailUrl ? { imageUrl: featuredCityItem.thumbnailUrl } : {})}
                />
              </button>

              {cityAirportChildren.map((opt, index) => (
                <button
                  key={`airport-row-${getDestinationCode(opt)}-${index}`}
                  type="button"
                  onMouseDown={() => select(opt)}
                  className={destinationPickerAirportRowVariants({ indent: cityAirportChildren.length > 1 })}
                >
                  <DestinationItemContent
                    destinationType={cityAirportChildren.length > 1 ? 'airport-indented' : 'airport'}
                    title={getDestinationOptionTitle(opt)}
                    subtitle={opt.distance ?? getDestinationOptionSubtitle(opt)}
                  />
                </button>
              ))}
            </div>
          )}

          <ul id={listId} role="listbox" className="tsf-destination-picker-list">
            {filtered.length === 0 ? (
              <li className="tsf-destination-picker-empty">No destinations found.</li>
            ) : (
              filtered.map((opt, index) => (
                <li
                  key={`${getDestinationCode(opt)}-${getDestinationName(opt)}-${index}`}
                  id={`${listId}-opt-${index}`}
                  ref={el => { optionRefs.current[index] = el; }}
                  role="option"
                  aria-selected={
                    (value && getDestinationCode(value) === getDestinationCode(opt)) || activeIndex === index
                  }
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={() => select(opt)}
                  className={destinationPickerListItemVariants({
                    active: activeIndex === index,
                    selected: Boolean(value && getDestinationCode(value) === getDestinationCode(opt)),
                  })}
                >
                  <DestinationItemContent
                    destinationType={getDestinationDisplayType(opt)}
                    title={getDestinationOptionTitle(opt)}
                    imageAlt={opt.city ?? getDestinationName(opt)}
                    {...((opt.country || opt.city || opt.geographicBreadcrumbs?.length)
                      ? { subtitle: getDestinationOptionSubtitle(opt) }
                      : {})}
                    {...(getDestinationDisplayType(opt) === 'city' && opt.thumbnailUrl
                      ? { imageUrl: opt.thumbnailUrl }
                      : {})}
                  />
                </li>
              ))
            )}
          </ul>

          {!normalizedQuery && recentSearches.length > 0 && (
            <div className={cn(destinationPickerSectionVariants({ divider: 'top' }), 'tsf-destination-picker-section--recent')}>
              <p className="tsf-recent-section-label">Recent search</p>
              <div className="tsf-destination-picker-recent-list">
                {recentSearches.slice(0, 3).map(item => (
                  <button
                    key={`${item.route}-${item.from ?? ''}-${item.to ?? ''}-${item.dates ?? ''}`}
                    type="button"
                    className={destinationPickerRecentRowVariants()}
                  >
                    <Icon icon={Plane} size="sm" className="tsf-recent-item-icon" aria-hidden />
                    <span className="tsf-recent-item-content">
                      <span className="tsf-recent-item-title">
                        {getRecentSearchTitle(item)}
                      </span>
                      {item.dates && (
                        <span className="tsf-recent-item-subtitle">
                          {item.dates}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
    <SearchField id={id} className={cn('tsf-field-shell--date', open && 'tsf-field-shell--elevated', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={value ? `${formatDate(value)} — change ${placeholder}` : placeholder}
            className={cn(
              fieldBtn,
              buttonClassName,
              open && 'tsf-field-button--open',
            )}
          >
            <Icon icon={CalendarDays} size="md" className="tsf-field-icon" aria-hidden />
            <span
              className={cn(
                'tsf-date-button-value',
                value ? 'tsf-date-button-value--selected' : 'tsf-date-button-value--placeholder',
              )}
            >
              {value ? formatDate(value) : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="tsf-date-popover-content" align="start">
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
    <SearchField id={id} className={cn('tsf-field-shell--date', open && 'tsf-field-shell--elevated', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label}
            aria-expanded={open}
            aria-haspopup="dialog"
            className={cn(
              fieldBtn,
              open && 'tsf-field-button--open',
            )}
          >
            <Icon icon={Users} size="md" className="tsf-field-icon" aria-hidden />
            <span className="tsf-passenger-field-label">
              {label}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="tsf-menu-popover-content" align="end">
          <div className="tsf-counter-list">
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
          <div className="tsf-passenger-cabin-section">
            <p className="tsf-cabin-class-label">Cabin class</p>
            <div className="tsf-cabin-class-grid">
              {(Object.keys(CABIN_LABELS) as CabinClass[]).map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => onChange({ ...value, cabinClass: cls })}
                  className={cn(
                    'tsf-cabin-class-option',
                    value.cabinClass === cls
                      ? 'tsf-cabin-class-option--active'
                      : 'tsf-cabin-class-option--inactive',
                  )}
                >
                  {CABIN_LABELS[cls]}
                </button>
              ))}
            </div>
          </div>
          <div className="tsf-menu-actions">
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
    <SearchField id={id} className={cn('tsf-field-shell--date', open && 'tsf-field-shell--elevated', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label}
            aria-expanded={open}
            aria-haspopup="dialog"
            className={cn(
              fieldBtn,
              open && 'tsf-field-button--open',
            )}
          >
            <Icon icon={BedDouble} size="md" className="tsf-field-icon" aria-hidden />
            <span className="tsf-occupancy-field-label">
              {label}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="tsf-menu-popover-content" align="end">
          <div className="tsf-counter-list">
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
          <div className="tsf-menu-actions">
            <Button size="sm" onClick={() => handleOpenChange(false)}>Done</Button>
          </div>
        </PopoverContent>
      </Popover>
    </SearchField>
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
      <div className="tsf-pill-content">{children}</div>
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
  destinationOptions,
  airportOptions = [],
  recentSearches = [],
  onSearch,
  className,
}: TravelSearchFormProps) {
  const [activeTab, setActiveTab] = React.useState<SearchTab>(defaultTab);
  const [tripType, setTripType] = React.useState<TripType>('round-trip');

  // Flights state
  const [origin, setOrigin] = React.useState<DestinationOption | null>(null);
  const [destination, setDestination] = React.useState<DestinationOption | null>(null);
  const [departureDate, setDepartureDate] = React.useState<Date | null>(null);
  const [returnDate, setReturnDate] = React.useState<Date | null>(null);
  const [passengers, setPassengers] = React.useState<PassengerConfig>(DEFAULT_PASSENGERS);
  const [legs, setLegs] = React.useState<FlightLeg[]>([{ ...DEFAULT_LEG }, { ...DEFAULT_LEG }]);
  const [swapRotationDeg, setSwapRotationDeg] = React.useState(0);

  // Hotels state
  const [hotelDest, setHotelDest] = React.useState<DestinationOption | null>(null);
  const [checkIn, setCheckIn] = React.useState<Date | null>(null);
  const [checkOut, setCheckOut] = React.useState<Date | null>(null);
  const [occupancy, setOccupancy] = React.useState<OccupancyConfig>(DEFAULT_OCCUPANCY);

  const resolvedDestinationOptions = React.useMemo(
    () => destinationOptions ?? airportOptions,
    [destinationOptions, airportOptions],
  );

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
        destination: hotelDest
          ? `${getDestinationName(hotelDest)}${getDestinationCode(hotelDest) ? ` (${getDestinationCode(hotelDest)})` : ''}`
          : '',
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
      <div className={cn('tsf-root', className)}>

        {/* ── Top nav tabs ─────────────────────────────────────────────────── */}
        <div className="tsf-tablist" role="tablist" aria-label="Travel type">
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
            'tsf-trip-type-shell',
            activeTab === 'flights' ? 'tsf-trip-type-shell--open' : 'tsf-trip-type-shell--collapsed',
          )}
        >
          <div className="tsf-trip-type-overflow">
            <div className="tsf-trip-type-group" role="radiogroup" aria-label="Trip type">
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
                      <span className="tsf-trip-type-indicator-dot" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="tripType"
                    value={type.id}
                    checked={tripType === type.id}
                    onChange={() => setTripType(type.id)}
                    className="tsf-visually-hidden"
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
                'tsf-flight-route-group',
                tripType === 'round-trip' ? 'tsf-flight-route-group--round-trip' : 'tsf-flight-route-group--one-way',
              )}
            >
              <DestinationPicker
                id="origin"
                value={origin}
                onChange={setOrigin}
                pickerType="origin"
                placeholder="From"
                options={resolvedDestinationOptions}
                recentSearches={recentSearches}
              />
              <FieldSeparator left="origin" right="destination" />
              <DestinationPicker
                id="destination"
                value={destination}
                onChange={setDestination}
                pickerType="destination"
                placeholder="Where to?"
                options={resolvedDestinationOptions}
                {...(getDestinationCode(origin ?? {}) ? { excludeCode: getDestinationCode(origin ?? {}) } : {})}
                buttonClassName="tsf-field-button--destination-end-padding"
                recentSearches={recentSearches}
              />
              {/* Swap button — centered on the separator */}
              <button
                type="button"
                aria-label="Swap origin and destination"
                onClick={handleSwap}
                onMouseEnter={() => setHoverActiveField(null)}
                onMouseMove={() => setHoverActiveField(null)}
                className={cn(
                  'tsf-swap-button',
                )}
              >
                <span
                  className="tsf-swap-button-rotation"
                  style={{ transform: `rotate(${swapRotationDeg}deg)` }}
                >
                  <Icon icon={ArrowLeftRight} size="sm" className="tsf-swap-button-icon" aria-hidden />
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
              buttonClassName="tsf-field-button--date-padding"
              className={cn(
                'tsf-date-field-shell',
                tripType === 'round-trip' ? 'tsf-date-field-shell--round-trip' : 'tsf-date-field-shell--one-way',
              )}
            />

            {/* Return date — collapses for one-way, allowing smooth width redistribution */}
            <div
              className={cn(
                'tsf-return-field-shell',
                tripType === 'round-trip'
                  ? 'tsf-return-field-shell--open'
                  : 'tsf-return-field-shell--collapsed',
              )}
              aria-hidden={tripType !== 'round-trip'}
            >
              <FieldSeparator left="departure" right="return" />
              <DateField
                id="return"
                value={returnDate}
                onChange={setReturnDate}
                placeholder="Return"
                buttonClassName="tsf-field-button--date-padding"
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
              className="tsf-passenger-shell"
            />
          </SearchPill>
        )}

        {/* ── Multi-city: stacked leg rows ─────────────────────────────────── */}
        {activeTab === 'flights' && tripType === 'multi-city' && (
          <div className="tsf-multicity-stack">
            {legs.map((leg, i) => (
              <div
                key={i}
                className={cn(pillShell, 'tsf-multicity-row-pill')}
              >
                <div className="tsf-pill-content">
                  {/* O+D group — takes most space */}
                  <div className="tsf-multicity-route-group">
                    <DestinationPicker
                      id={`mc-origin-${i}`}
                      value={leg.origin}
                      onChange={v => updateLeg(i, { origin: v })}
                      pickerType="origin"
                      placeholder="From"
                      options={resolvedDestinationOptions}
                      recentSearches={recentSearches}
                    />
                    <FieldSeparator left={`mc-origin-${i}`} right={`mc-dest-${i}`} />
                    <DestinationPicker
                      id={`mc-dest-${i}`}
                      value={leg.destination}
                      onChange={v => updateLeg(i, { destination: v })}
                      pickerType="destination"
                      placeholder="To"
                      options={resolvedDestinationOptions}
                      {...(getDestinationCode(leg.origin ?? {}) ? { excludeCode: getDestinationCode(leg.origin ?? {}) } : {})}
                      recentSearches={recentSearches}
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
            <div className="tsf-multicity-actions-row">
              {legs.length < 4 && (
                <button
                  type="button"
                  onClick={() => setLegs(ls => [...ls, { ...DEFAULT_LEG }])}
                  className="tsf-multicity-action-link tsf-multicity-action-link--primary"
                >
                  + Add flight
                </button>
              )}
              {legs.length > 2 && (
                <button
                  type="button"
                  onClick={() => setLegs(ls => ls.slice(0, -1))}
                  className="tsf-multicity-action-link tsf-multicity-action-link--muted"
                >
                  Remove last
                </button>
              )}
              <div className="tsf-multicity-actions-end">
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
            <DestinationPicker
              id="hotel-dest"
              value={hotelDest}
              onChange={setHotelDest}
              pickerType="hotel"
              placeholder="Where to?"
              options={resolvedDestinationOptions}
              icon={Search}
              className="tsf-hotel-destination-shell"
              buttonClassName="tsf-field-button--hotel-padding"
              recentSearches={recentSearches}
            />
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

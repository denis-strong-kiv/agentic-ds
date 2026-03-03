'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../ui/button.js';
import { Combobox, type ComboboxOption } from '../ui/combobox.js';
import { DateRangePicker } from '../ui/date-picker.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs.js';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select.js';
import { Label } from '../ui/label.js';

// ─── Counter ──────────────────────────────────────────────────────────────────

interface CounterProps {
  label: string;
  sublabel?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

function Counter({ label, sublabel, value, min = 0, max = 9, onChange }: CounterProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-[var(--color-foreground-default)]">{label}</p>
        {sublabel && <p className="text-xs text-[var(--color-foreground-muted)]">{sublabel}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center text-lg',
            'border border-[var(--color-border-default)]',
            'text-[var(--color-foreground-default)]',
            'hover:bg-[var(--color-background-subtle)]',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-medium text-[var(--color-foreground-default)]">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center text-lg',
            'border border-[var(--color-border-default)]',
            'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)]',
            'hover:opacity-90',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── Passenger Popover ────────────────────────────────────────────────────────

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: PassengerCounts;
  onChange: (counts: PassengerCounts) => void;
}

function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const total = value.adults + value.children + value.infants;
  const label = `${total} Passenger${total !== 1 ? 's' : ''}`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          'flex h-10 w-full items-center justify-between px-3',
          'rounded-[var(--shape-preset-input)] border border-[var(--color-border-default)]',
          'bg-[var(--color-surface-card)] text-sm text-[var(--color-foreground-default)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-default)]',
        )}
      >
        <span>{label}</span>
        <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className={cn(
            'absolute top-full mt-1 z-50 w-72 p-4',
            'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
            'bg-[var(--color-surface-popover)] shadow-[var(--shadow-md)]',
          )}
          role="dialog"
          aria-label="Passenger selection"
        >
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
            sublabel="Under 2 years"
            value={value.infants}
            min={0}
            max={value.adults}
            onChange={v => onChange({ ...value, infants: v })}
          />
          <div className="mt-3 flex justify-end">
            <Button size="sm" onClick={() => setOpen(false)}>Done</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SearchForm ───────────────────────────────────────────────────────────────

export type TripType = 'round-trip' | 'one-way' | 'multi-city';
export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';
export type SearchVertical = 'flights' | 'hotels' | 'cars' | 'activities' | 'packages';

export interface FlightSearchPayload {
  vertical: 'flights';
  origin: string;
  destination: string;
  dates: { from?: Date; to?: Date };
  passengers: PassengerCounts;
  cabinClass: CabinClass;
  tripType: TripType;
}

export interface HotelSearchPayload {
  vertical: 'hotels';
  destination: string;
  dates: { from?: Date; to?: Date };
  rooms: number;
  guests: PassengerCounts;
}

export interface CarSearchPayload {
  vertical: 'cars';
  pickupLocation: string;
  dropoffLocation: string;
  dates: { from?: Date; to?: Date };
}

export type SearchPayload = FlightSearchPayload | HotelSearchPayload | CarSearchPayload;

export interface SearchFormProps {
  /** Available airport/city options */
  locationOptions?: ComboboxOption[];
  /** Called when form is submitted */
  onSearch?: (payload: SearchPayload) => void;
  /** Default vertical tab */
  defaultVertical?: SearchVertical;
  className?: string;
}

export function SearchForm({
  locationOptions = [],
  onSearch,
  defaultVertical = 'flights',
  className,
}: SearchFormProps) {
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [dates, setDates] = React.useState<{ from?: Date; to?: Date }>({});
  const [passengers, setPassengers] = React.useState<PassengerCounts>({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = React.useState<CabinClass>('economy');
  const [tripType, setTripType] = React.useState<TripType>('round-trip');

  function handleFlightSearch() {
    onSearch?.({
      vertical: 'flights',
      origin,
      destination,
      dates,
      passengers,
      cabinClass,
      tripType,
    });
  }

  return (
    <div
      className={cn(
        'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
        'bg-[var(--color-surface-card)] shadow-[var(--shadow-sm)] p-4',
        className,
      )}
    >
      <Tabs defaultValue={defaultVertical}>
        <TabsList className="mb-4 w-full flex-wrap h-auto">
          {(['flights', 'hotels', 'cars', 'activities', 'packages'] as SearchVertical[]).map(v => (
            <TabsTrigger key={v} value={v} className="capitalize flex-1">
              {v}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Flights tab ────────────────────────────────────────────── */}
        <TabsContent value="flights">
          {/* Trip type + cabin class row */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {(['round-trip', 'one-way', 'multi-city'] as TripType[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setTripType(type)}
                className={cn(
                  'text-sm px-3 py-1 rounded-full border transition-colors',
                  tripType === type
                    ? 'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)] border-transparent'
                    : 'border-[var(--color-border-default)] text-[var(--color-foreground-muted)]',
                )}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
            <div className="ml-auto w-40">
              <Select value={cabinClass} onValueChange={v => setCabinClass(v as CabinClass)}>
                <SelectTrigger>
                  <SelectValue placeholder="Cabin class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium-economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search fields grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-1">
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">From</Label>
              <Combobox
                options={locationOptions}
                value={origin}
                onChange={setOrigin}
                placeholder="Origin airport"
                searchPlaceholder="Search airports..."
              />
            </div>
            <div className="lg:col-span-1">
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">To</Label>
              <Combobox
                options={locationOptions}
                value={destination}
                onChange={setDestination}
                placeholder="Destination airport"
                searchPlaceholder="Search airports..."
              />
            </div>
            <div className="lg:col-span-1">
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Dates</Label>
              <DateRangePicker
                value={dates}
                onChange={setDates}
                placeholder={{ from: 'Departure', to: 'Return' }}
              />
            </div>
            <div className="lg:col-span-1">
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Passengers</Label>
              <PassengerSelector value={passengers} onChange={setPassengers} />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleFlightSearch} size="lg">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              Search Flights
            </Button>
          </div>
        </TabsContent>

        {/* ── Hotels tab ─────────────────────────────────────────────── */}
        <TabsContent value="hotels">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Destination</Label>
              <Combobox
                options={locationOptions}
                value={destination}
                onChange={setDestination}
                placeholder="City or hotel"
                searchPlaceholder="Search destinations..."
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Check-in / Check-out</Label>
              <DateRangePicker
                value={dates}
                onChange={setDates}
                placeholder={{ from: 'Check-in', to: 'Check-out' }}
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Guests &amp; Rooms</Label>
              <PassengerSelector value={passengers} onChange={setPassengers} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="lg" onClick={() => onSearch?.({ vertical: 'hotels', destination, dates, rooms: 1, guests: passengers })}>
              Search Hotels
            </Button>
          </div>
        </TabsContent>

        {/* ── Cars tab ───────────────────────────────────────────────── */}
        <TabsContent value="cars">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Pick-up location</Label>
              <Combobox
                options={locationOptions}
                value={origin}
                onChange={setOrigin}
                placeholder="Airport or city"
                searchPlaceholder="Search locations..."
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Drop-off location</Label>
              <Combobox
                options={locationOptions}
                value={destination}
                onChange={setDestination}
                placeholder="Same as pick-up"
                searchPlaceholder="Search locations..."
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Dates</Label>
              <DateRangePicker
                value={dates}
                onChange={setDates}
                placeholder={{ from: 'Pick-up', to: 'Drop-off' }}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="lg" onClick={() => onSearch?.({ vertical: 'cars', pickupLocation: origin, dropoffLocation: destination, dates })}>
              Search Cars
            </Button>
          </div>
        </TabsContent>

        {/* ── Activities & Packages tabs ─────────────────────────────── */}
        <TabsContent value="activities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Destination</Label>
              <Combobox
                options={locationOptions}
                value={destination}
                onChange={setDestination}
                placeholder="City or region"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-[var(--color-foreground-muted)]">Date</Label>
              <DateRangePicker value={dates} onChange={setDates} placeholder={{ from: 'From', to: 'To' }} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="lg">Search Activities</Button>
          </div>
        </TabsContent>

        <TabsContent value="packages">
          <p className="text-sm text-[var(--color-foreground-muted)] py-4 text-center">
            Package search coming soon. Combine flights + hotels for the best deal.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

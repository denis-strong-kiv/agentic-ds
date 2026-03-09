'use client';

import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button/index';
import { NotificationBadge } from '../../ui/notification-badge/index';
import { Checkbox } from '../../ui/checkbox/index';
import { Slider } from '../../ui/slider/index';
import { Switch } from '../../ui/switch/index';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion/index';
import { Label } from '../../ui/label/index';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group/index';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortOption = 'cheap-and-fast' | 'lowest-price' | 'fastest' | 'earliest-departure';

export interface FilterState {
  priceRange: [number, number];
  stops: ('nonstop' | '1-stop' | '2-plus')[];
  airlines: string[];
  alliances: string[];
  departureRange: [number, number];
  arrivalRange: [number, number];
  amenities: string[];
  starRatings: number[];
}

export interface FilterOption {
  value: string;
  label: string;
  logoUrl?: string;
}

export interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClearAll?: () => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  providerOptions?: FilterOption[];
  amenityOptions?: FilterOption[];
  allianceOptions?: FilterOption[];
  maxPrice?: number;
  mode?: 'flights' | 'hotels' | 'cars';
  /** Controlled open state — false collapses the sidebar */
  isOpen?: boolean;
  className?: string;
}

const DEFAULT_AMENITIES: FilterOption[] = [
  { value: 'wifi', label: 'Free WiFi' },
  { value: 'pool', label: 'Swimming Pool' },
  { value: 'breakfast', label: 'Breakfast Included' },
  { value: 'parking', label: 'Free Parking' },
  { value: 'gym', label: 'Fitness Center' },
  { value: 'spa', label: 'Spa' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'pet-friendly', label: 'Pet Friendly' },
];

const DEFAULT_ALLIANCES: FilterOption[] = [
  { value: 'star-alliance', label: 'Star Alliance' },
  { value: 'skyteam', label: 'SkyTeam' },
  { value: 'oneworld', label: 'Oneworld' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'cheap-and-fast', label: 'Cheap and fast' },
  { value: 'lowest-price', label: 'Lowest price' },
  { value: 'fastest', label: 'Fastest' },
  { value: 'earliest-departure', label: 'Earliest departure' },
];

function formatHour(h: number) {
  if (h === 0) return '12am';
  if (h < 12) return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

function countActiveFilters(filters: FilterState, maxPrice: number): number {
  let count = 0;
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
  if (filters.stops.length > 0) count += filters.stops.length;
  if (filters.airlines.length > 0) count++;
  if (filters.alliances.length > 0) count++;
  if (filters.departureRange[0] !== 0 || filters.departureRange[1] !== 24) count++;
  if (filters.arrivalRange[0] !== 0 || filters.arrivalRange[1] !== 24) count++;
  if (filters.amenities.length > 0) count++;
  if (filters.starRatings.length > 0) count++;
  return count;
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

export function FilterPanel({
  filters,
  onChange,
  onClearAll,
  sortBy = 'cheap-and-fast',
  onSortChange,
  providerOptions = [],
  amenityOptions = DEFAULT_AMENITIES,
  allianceOptions = DEFAULT_ALLIANCES,
  maxPrice = 2000,
  mode = 'flights',
  isOpen = true,
  className,
}: FilterPanelProps) {
  const activeCount = countActiveFilters(filters, maxPrice);
  const allAirlinesSelected = providerOptions.length > 0 &&
    providerOptions.every(o => filters.airlines.includes(o.value));

  function handleSelectAllAirlines(checked: boolean) {
    onChange({
      ...filters,
      airlines: checked ? providerOptions.map(o => o.value) : [],
    });
  }

  if (!isOpen) return null;

  return (
    <aside
      className={cn('travel-filter-panel', className)}
      aria-label="Search filters"
    >
      {/* Header */}
      <div className="travel-filter-panel-header">
        <h2 className="travel-filter-panel-title">
          Filters
          {activeCount > 0 && (
            <NotificationBadge className="travel-filter-panel-active-count" count={activeCount} />
          )}
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="travel-filter-panel-clear"
          >
            Clear all
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['sort', 'price', 'stops', 'times']}>

        {/* ── Sort ──────────────────────────────────────────────────────────── */}
        {onSortChange && (
          <AccordionItem value="sort">
            <AccordionTrigger>Sort</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={sortBy}
                onValueChange={v => onSortChange(v as SortOption)}
                className="travel-filter-panel-check-list"
              >
                {SORT_OPTIONS.map(opt => (
                  <div key={opt.value} className="travel-filter-panel-check-item">
                    <RadioGroupItem id={`sort-${opt.value}`} value={opt.value} />
                    <Label htmlFor={`sort-${opt.value}`} className="travel-filter-panel-check-label">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Stops (flights only) ──────────────────────────────────────────── */}
        {mode === 'flights' && (
          <AccordionItem value="stops">
            <AccordionTrigger>Stops</AccordionTrigger>
            <AccordionContent>
              <div className="travel-filter-panel-check-list">
                {([
                  { value: 'nonstop', label: 'Non-stop' },
                  { value: '1-stop', label: '1 Stop' },
                  { value: '2-plus', label: '2+ Stops' },
                ] as { value: FilterState['stops'][number]; label: string }[]).map(opt => (
                  <div key={opt.value} className="travel-filter-panel-check-item">
                    <Checkbox
                      id={`stop-${opt.value}`}
                      checked={filters.stops.includes(opt.value)}
                      onCheckedChange={() =>
                        onChange({ ...filters, stops: toggleItem(filters.stops, opt.value) })
                      }
                    />
                    <Label htmlFor={`stop-${opt.value}`} className="travel-filter-panel-check-label">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Price ─────────────────────────────────────────────────────────── */}
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="travel-filter-panel-section-body">
              <Slider
                min={0}
                max={maxPrice}
                step={10}
                value={filters.priceRange}
                onValueChange={v => onChange({ ...filters, priceRange: v as [number, number] })}
                showValue
                formatValue={v => `$${v}`}
              />
              <div className="travel-filter-panel-range-labels">
                <span>$0</span>
                <span>${maxPrice}+</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ── Airlines / Providers ──────────────────────────────────────────── */}
        {providerOptions.length > 0 && (
          <AccordionItem value="providers">
            <AccordionTrigger>{mode === 'flights' ? 'Airlines' : 'Providers'}</AccordionTrigger>
            <AccordionContent>
              {/* Select all toggle */}
              <div className="travel-filter-panel-select-all">
                <Label htmlFor="select-all-airlines" className="travel-filter-panel-check-label">
                  Select all airlines
                </Label>
                <Switch
                  id="select-all-airlines"
                  checked={allAirlinesSelected}
                  onCheckedChange={handleSelectAllAirlines}
                />
              </div>

              {/* Alliances */}
              {allianceOptions.length > 0 && (
                <div className="travel-filter-panel-subsection">
                  <p className="travel-filter-panel-subsection-label">Alliances</p>
                  <div className="travel-filter-panel-check-list">
                    {allianceOptions.map(opt => (
                      <div key={opt.value} className="travel-filter-panel-check-item">
                        <Checkbox
                          id={`alliance-${opt.value}`}
                          checked={filters.alliances.includes(opt.value)}
                          onCheckedChange={() =>
                            onChange({ ...filters, alliances: toggleItem(filters.alliances, opt.value) })
                          }
                        />
                        <Label htmlFor={`alliance-${opt.value}`} className="travel-filter-panel-check-label">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual airlines */}
              <div className="travel-filter-panel-subsection">
                <p className="travel-filter-panel-subsection-label">Airlines</p>
                <div className="travel-filter-panel-check-list travel-filter-panel-check-list--scrollable">
                  {providerOptions.map(opt => (
                    <div key={opt.value} className="travel-filter-panel-check-item">
                      <Checkbox
                        id={`provider-${opt.value}`}
                        checked={filters.airlines.includes(opt.value)}
                        onCheckedChange={() =>
                          onChange({ ...filters, airlines: toggleItem(filters.airlines, opt.value) })
                        }
                      />
                      <Label
                        htmlFor={`provider-${opt.value}`}
                        className="travel-filter-panel-check-label travel-filter-panel-check-label--with-logo"
                      >
                        {opt.logoUrl && (
                          <img src={opt.logoUrl} alt="" className="travel-filter-panel-provider-logo" aria-hidden />
                        )}
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Departure time ────────────────────────────────────────────────── */}
        {mode === 'flights' && (
          <AccordionItem value="times">
            <AccordionTrigger>Departure Time</AccordionTrigger>
            <AccordionContent>
              <div className="travel-filter-panel-section-body">
                <Slider
                  min={0}
                  max={24}
                  step={1}
                  value={filters.departureRange}
                  onValueChange={v => onChange({ ...filters, departureRange: v as [number, number] })}
                  showValue
                  formatValue={formatHour}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Arrival time ──────────────────────────────────────────────────── */}
        {mode === 'flights' && (
          <AccordionItem value="arrival-times">
            <AccordionTrigger>Arrival Time</AccordionTrigger>
            <AccordionContent>
              <div className="travel-filter-panel-section-body">
                <Slider
                  min={0}
                  max={24}
                  step={1}
                  value={filters.arrivalRange}
                  onValueChange={v => onChange({ ...filters, arrivalRange: v as [number, number] })}
                  showValue
                  formatValue={formatHour}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Star rating (hotels only) ─────────────────────────────────────── */}
        {mode === 'hotels' && (
          <AccordionItem value="stars">
            <AccordionTrigger>Star Rating</AccordionTrigger>
            <AccordionContent>
              <div className="travel-filter-panel-stars-wrap">
                {[1, 2, 3, 4, 5].map(stars => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() =>
                      onChange({ ...filters, starRatings: toggleItem(filters.starRatings, stars) })
                    }
                    aria-pressed={filters.starRatings.includes(stars)}
                    aria-label={`${stars} star${stars !== 1 ? 's' : ''}`}
                    className={cn(
                      'travel-filter-panel-star-btn',
                      filters.starRatings.includes(stars)
                        ? 'travel-filter-panel-star-btn--active'
                        : 'travel-filter-panel-star-btn--inactive',
                    )}
                  >
                    {'★'.repeat(stars)}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Amenities (hotels only) ───────────────────────────────────────── */}
        {mode === 'hotels' && (
          <AccordionItem value="amenities">
            <AccordionTrigger>Amenities</AccordionTrigger>
            <AccordionContent>
              <div className="travel-filter-panel-amenities-grid">
                {amenityOptions.map(opt => (
                  <div key={opt.value} className="travel-filter-panel-check-item">
                    <Checkbox
                      id={`amenity-${opt.value}`}
                      checked={filters.amenities.includes(opt.value)}
                      onCheckedChange={() =>
                        onChange({ ...filters, amenities: toggleItem(filters.amenities, opt.value) })
                      }
                    />
                    <Label htmlFor={`amenity-${opt.value}`} className="travel-filter-panel-check-label">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Apply button (mobile) */}
      <div className="travel-filter-panel-mobile-actions">
        <Button className="travel-filter-panel-apply-btn">Apply Filters</Button>
      </div>
    </aside>
  );
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createDefaultFilters(maxPrice = 2000): FilterState {
  return {
    priceRange: [0, maxPrice],
    stops: [],
    airlines: [],
    alliances: [],
    departureRange: [0, 24],
    arrivalRange: [0, 24],
    amenities: [],
    starRatings: [],
  };
}

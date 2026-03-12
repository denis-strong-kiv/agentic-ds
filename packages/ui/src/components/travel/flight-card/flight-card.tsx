'use client';

import * as React from 'react';
import { Pin } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button/index';
import { MonoTooltipProvider, MonoTooltip } from '../../ui/tooltip/tooltip';
import {
  OtaBaggageTrolley,
  OtaBaggageTrolleyOff,
  OtaBaggageChecked,
  OtaBaggageCheckedOff,
} from '../../ui/icon/ota-icons';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FlightSegment {
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  aircraft?: string;
  origin: string;
  originCity?: string;
  /** Full airport name shown on IATA hover, e.g. "John F. Kennedy Intl Airport" */
  originAirportName?: string;
  destination: string;
  destinationCity?: string;
  /** Full airport name shown on IATA hover, e.g. "London Heathrow Airport" */
  destinationAirportName?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  class?: string;
  operatedBy?: string;
}

export interface FlightLeg {
  /** Display label e.g. "New York → London". Inferred from segments if omitted. */
  label?: string;
  date?: string;
  /** Total leg duration including layovers */
  duration: string;
  /** One segment = nonstop. Multiple = with layovers. Max 6 legs per card. */
  segments: FlightSegment[];
  stops: number;
  stopAirports?: string[];
}

export interface BaggageAllowance {
  carryOn: number;
  checked: number;
  checkedFee?: string;
}

export interface FareBreakdownItem {
  label: string;
  amount: string;
  type?: 'base' | 'tax' | 'fee' | 'total';
}

export interface FlightCardProps {
  /** 1 = one-way, 2 = round-trip, 3–6 = multi-city */
  legs: FlightLeg[];
  price: string;
  currency?: string;
  totalPrice?: string;
  fareClass?: string;
  /** Accepted but not rendered — shown in the detail panel */
  fareBreakdown?: FareBreakdownItem[];
  baggage?: BaggageAllowance;
  isBestValue?: boolean;
  isCheapest?: boolean;
  seatsLeft?: number;
  /** Compact layout — set true when shown in the 400px mini list */
  isCompact?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseArrivalTime(time: string): { base: string; nextDay?: string } {
  const match = time.match(/^(.+?)(\+\d+)$/);
  return match ? { base: match[1].trim(), nextDay: match[2] } : { base: time };
}

function parseTimeParts(time: string): { digits: string; period?: string } {
  const match = time.match(/^(.+?)\s*(AM|PM)$/i);
  return match ? { digits: match[1], period: match[2].toLowerCase() } : { digits: time };
}

function parseTimeToMinutes(time: string): number {
  const clean = time.replace(/\+\d+$/, '').trim();
  const m = clean.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!m) return 0;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
  return h * 60 + min;
}

function formatLayover(arrTime: string, depTime: string): string {
  let diff = parseTimeToMinutes(depTime) - parseTimeToMinutes(arrTime);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m === 0 ? `${h}h layover` : `${h}h ${m}m layover`;
}

// ─── IATA Code with popover ───────────────────────────────────────────────────

function IataCode({ iata, airportName, city }: { iata: string; airportName?: string | undefined; city?: string | undefined }) {
  const trigger = <span className="travel-flight-card-leg-route-iata">{iata}</span>;
  if (!airportName && !city) return trigger;
  return (
    <MonoTooltip content={airportName ?? city}>
      {trigger}
    </MonoTooltip>
  );
}

// ─── Airline Emblem ───────────────────────────────────────────────────────────

function AirlineEmblem({ segment }: { segment: FlightSegment }) {
  if (segment.airlineLogo) {
    return (
      <img
        src={segment.airlineLogo}
        alt={segment.airline}
        className="travel-flight-card-emblem-img"
      />
    );
  }
  return (
    <div className="travel-flight-card-emblem-fallback" aria-hidden>
      {segment.airline.slice(0, 2).toUpperCase()}
    </div>
  );
}



// ─── Stops Tooltip ────────────────────────────────────────────────────────────

function StopsTooltipContent({ leg }: { leg: FlightLeg }) {
  const stops = leg.segments.slice(0, -1);
  return (
    <div className="travel-flight-card-stops-tooltip">
      {stops.map((seg, i) => (
        <div key={i} className="travel-flight-card-iata-tooltip-content">
          <span className="travel-flight-card-iata-tooltip-duration">
            {formatLayover(seg.arrivalTime, leg.segments[i + 1].departureTime)}
          </span>
          {seg.destinationAirportName && (
            <span className="travel-flight-card-iata-tooltip-name">{seg.destinationAirportName}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function WithStopTooltip({ leg, children }: { leg: FlightLeg; children: React.ReactElement }) {
  if (leg.stops === 0) return children;
  return (
    <MonoTooltip content={<StopsTooltipContent leg={leg} />}>
      {children}
    </MonoTooltip>
  );
}

// ─── Leg Row ──────────────────────────────────────────────────────────────────

function LegRow({ leg, isCompact }: { leg: FlightLeg; isCompact: boolean }) {
  const first = leg.segments[0];
  const last = leg.segments[leg.segments.length - 1];

  const airlineName =
    leg.segments.length > 1
      ? leg.segments.every((s) => s.airline === first.airline)
        ? first.airline
        : 'Multiple airlines'
      : first.airline;

  const arr = parseArrivalTime(last.arrivalTime);

  const stopsLabel =
    leg.stops === 0
      ? 'nonstop'
      : `${leg.stops} stop${leg.stops > 1 ? 's' : ''}`;

  // City names for all stops, joined with · — CSS truncates if they overflow
  const stopCity = leg.stops > 0
    ? leg.segments.slice(0, -1).map(s => s.destinationCity ?? s.destination).join(' · ')
    : undefined;

  return (
    <div className="travel-flight-card-leg">
      {/* Airline emblem — mono tooltip on hover */}
      <MonoTooltip content={airlineName}>
        <div className="travel-flight-card-leg-emblem-wrap">
          <AirlineEmblem segment={first} />
        </div>
      </MonoTooltip>

      {/* Itinerary: times + route — flex-1, min-width 0 */}
      <div className="travel-flight-card-leg-info">
        <div className="travel-flight-card-leg-times-row">
          {(() => { const p = parseTimeParts(first.departureTime); return (
            <span className="travel-flight-card-leg-time">
              {p.digits}{p.period && <span className="travel-flight-card-leg-time-period">{p.period}</span>}
            </span>
          ); })()}
          <span className="travel-flight-card-leg-dash" aria-hidden>–</span>
          <span className="travel-flight-card-leg-time travel-flight-card-leg-time-arr">
            {(() => { const p = parseTimeParts(arr.base); return <>{p.digits}{p.period && <span className="travel-flight-card-leg-time-period">{p.period}</span>}</>; })()}
            {arr.nextDay && (
              <span className="travel-flight-card-leg-next-day">{arr.nextDay}</span>
            )}
          </span>
        </div>

        <div className="travel-flight-card-leg-route">
          {isCompact ? (
            <>
              <IataCode iata={first.origin} airportName={first.originAirportName} city={first.originCity} />
              <span className="travel-flight-card-leg-route-dash" aria-hidden> – </span>
              <IataCode iata={last.destination} airportName={last.destinationAirportName} city={last.destinationCity} />
              <span className="travel-flight-card-leg-route-dot" aria-hidden> · </span>
              <span className="travel-flight-card-leg-duration-compact">{leg.duration}</span>
            </>
          ) : (
            <>
              <span className="travel-flight-card-leg-route-city">{first.originCity ?? first.origin}</span>
              <IataCode iata={first.origin} airportName={first.originAirportName} city={first.originCity} />
              <span className="travel-flight-card-leg-route-dash" aria-hidden> – </span>
              <span className="travel-flight-card-leg-route-city">{last.destinationCity ?? last.destination}</span>
              <IataCode iata={last.destination} airportName={last.destinationAirportName} city={last.destinationCity} />
            </>
          )}
        </div>
      </div>

      {/* Desktop: duration column (96px) */}
      {!isCompact && (
        <div className="travel-flight-card-leg-duration-col">
          <span className="travel-flight-card-leg-duration-val">{leg.duration}</span>
        </div>
      )}

      {/* Stops column */}
      {isCompact ? (
        <div className="travel-flight-card-leg-stops-col">
          <WithStopTooltip leg={leg}>
            <span
              className={cn(
                'travel-flight-card-leg-stops-text',
                leg.stops === 0 && 'travel-flight-card-leg-stops-text--nonstop',
              )}
            >
              {stopsLabel}
            </span>
          </WithStopTooltip>
          {stopCity && (
            <span className="travel-flight-card-leg-stop-city-compact">{stopCity}</span>
          )}
        </div>
      ) : (
        <div className="travel-flight-card-leg-stops-desk">
          <WithStopTooltip leg={leg}>
            <span
              className={cn(
                'travel-flight-card-leg-stops-val',
                leg.stops === 0 && 'travel-flight-card-leg-stops-val--nonstop',
              )}
            >
              {stopsLabel}
            </span>
          </WithStopTooltip>
          {stopCity && (
            <span className="travel-flight-card-leg-stop-city">{stopCity}</span>
          )}
        </div>
      )}

      {/* Pin segment button */}
      <button
        type="button"
        className="travel-flight-card-leg-pin-btn"
        aria-label="Pin this flight segment"
        onClick={(e) => e.stopPropagation()}
      >
        <Pin size={16} aria-hidden />
      </button>
    </div>
  );
}

// ─── FlightCard ───────────────────────────────────────────────────────────────

export function FlightCard({
  legs,
  price,
  totalPrice,
  baggage,
  isBestValue,
  isCheapest,
  seatsLeft,
  isCompact = false,
  isSelected = false,
  onSelect,
  className,
}: FlightCardProps) {
  const displayLegs = legs.slice(0, 6);

  const tagLabel = isBestValue ? 'Best value' : isCheapest ? 'Cheapest' : null;

  const operatedBy = displayLegs
    .flatMap((l) => l.segments)
    .map((s) => s.operatedBy)
    .filter(Boolean)[0];

  const showUrgency = !isCompact && seatsLeft !== undefined && seatsLeft <= 9;

  return (
    <MonoTooltipProvider {...(isCompact && { tooltipClassName: 'travel-flight-card-tooltip--compact' })}>
    <article
      className={cn('travel-flight-card', className)}
      data-compact={isCompact || undefined}
      data-selected={isSelected || undefined}
      aria-selected={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(); } }}
      tabIndex={0}
    >
      <div className="travel-flight-card-inner">
        {/* ── Content ── */}
        <div className="travel-flight-card-content">
          {tagLabel && (
            <div
              className={cn(
                'travel-flight-card-tag',
                isBestValue && 'travel-flight-card-tag--deal',
                isCheapest && !isBestValue && 'travel-flight-card-tag--cheap',
              )}
            >
              {tagLabel}
            </div>
          )}

          <div className="travel-flight-card-legs">
            {displayLegs.map((leg, i) => (
              <LegRow key={i} leg={leg} isCompact={isCompact} />
            ))}
          </div>

          {operatedBy && (
            <p className="travel-flight-card-operated-by">{operatedBy}</p>
          )}
        </div>

        {/* ── Price block ── */}
        <div className="travel-flight-card-price-col">
          {/* Top: seats left */}
          <div className="travel-flight-card-price-top">
            {showUrgency && (
              <div className="travel-flight-card-urgency">
                <span className="travel-flight-card-urgency-badge">{seatsLeft}</span>
                <span className="travel-flight-card-urgency-label">seats left</span>
              </div>
            )}
          </div>

          {/* Middle: price + button */}
          <div className="travel-flight-card-price-center">
            <p className="travel-flight-card-price-display">{price}</p>
            {totalPrice && (
              <p className="travel-flight-card-total-price">{totalPrice} total</p>
            )}
            {!isCompact && (
              <Button size="sm" onClick={(e) => e.stopPropagation()} className="travel-flight-card-select-btn">
                Select
              </Button>
            )}
          </div>

          {/* Bottom: baggage */}
          {baggage && (
            <div className="travel-flight-card-baggage">
              <div className="travel-flight-card-baggage-icons">
                <span
                  className={cn(
                    'travel-flight-card-baggage-item',
                    baggage.carryOn === 0 && 'travel-flight-card-baggage-item--none',
                  )}
                  aria-label={`${baggage.carryOn} carry-on bag`}
                >
                  {baggage.carryOn > 0 ? (
                    <OtaBaggageTrolley aria-hidden style={{ width: 16, height: 16 }} />
                  ) : (
                    <OtaBaggageTrolleyOff aria-hidden style={{ width: 16, height: 16 }} />
                  )}
                  <span className="travel-flight-card-baggage-count">{baggage.carryOn}</span>
                </span>
                <span
                  className={cn(
                    'travel-flight-card-baggage-item',
                    baggage.checked === 0 && 'travel-flight-card-baggage-item--none',
                  )}
                  aria-label={`${baggage.checked} checked bag`}
                >
                  {baggage.checked > 0 ? (
                    <OtaBaggageChecked aria-hidden style={{ width: 16, height: 16 }} />
                  ) : (
                    <OtaBaggageCheckedOff aria-hidden style={{ width: 16, height: 16 }} />
                  )}
                  <span className="travel-flight-card-baggage-count">{baggage.checked}</span>
                </span>
              </div>
              {baggage.checkedFee && (
                <p className="travel-flight-card-bag-fee">
                  20kg{' '}
                  <span className="travel-flight-card-bag-fee-price">{baggage.checkedFee}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
    </MonoTooltipProvider>
  );
}

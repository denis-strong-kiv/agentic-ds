'use client';

import { Pin } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button/index';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FlightSegment {
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  aircraft?: string;
  origin: string;
  originCity?: string;
  destination: string;
  destinationCity?: string;
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
  return match ? { digits: match[1], period: match[2].toUpperCase() } : { digits: time };
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


// ─── Baggage SVG Icons ────────────────────────────────────────────────────────

function CarryOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="4.5" y="5.5" width="7" height="8" rx="0.75" stroke="currentColor" strokeWidth="1.1" />
      <path d="M6 5.5V4.5a2 2 0 0 1 4 0v1" stroke="currentColor" strokeWidth="1.1" />
      <line x1="8" y1="7.5" x2="8" y2="11.5" stroke="currentColor" strokeWidth="1.1" />
      <line x1="5.5" y1="9.5" x2="10.5" y2="9.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function CheckedBagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="9" height="8" rx="0.75" stroke="currentColor" strokeWidth="1.1" />
      <path d="M6 5.5V4.5a2 2 0 0 1 4 0v1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M3.5 8.5h9" stroke="currentColor" strokeWidth="1.1" />
    </svg>
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

  const stopCity = leg.stopAirports?.[0];

  return (
    <div className="travel-flight-card-leg">
      {/* Airline emblem — CSS tooltip on hover */}
      <div className="travel-flight-card-leg-emblem-wrap">
        <AirlineEmblem segment={first} />
        <span className="travel-flight-card-leg-tooltip" aria-hidden>
          <span className="travel-flight-card-leg-airline-name">{airlineName}</span>
          {' '}
          <span className="travel-flight-card-leg-flight-num">{first.flightNumber}</span>
        </span>
      </div>

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
            {arr.base}
            {arr.nextDay && (
              <sup className="travel-flight-card-leg-next-day">{arr.nextDay}</sup>
            )}
          </span>
        </div>

        <div className="travel-flight-card-leg-route">
          {isCompact ? (
            <>
              <span>{first.origin}</span>
              <span className="travel-flight-card-leg-route-line" aria-hidden />
              <span>{last.destination}</span>
              <span className="travel-flight-card-leg-route-dot" aria-hidden> · </span>
              <span className="travel-flight-card-leg-duration-compact">{leg.duration}</span>
            </>
          ) : (
            <>
              <span className="travel-flight-card-leg-route-city">{first.originCity ?? first.origin}</span>
              <span className="travel-flight-card-leg-route-line" aria-hidden />
              <span className="travel-flight-card-leg-route-city">{last.destinationCity ?? last.destination}</span>
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
          <span
            className={cn(
              'travel-flight-card-leg-stops-text',
              leg.stops === 0 && 'travel-flight-card-leg-stops-text--nonstop',
            )}
          >
            {stopsLabel}
          </span>
          {stopCity && (
            <span className="travel-flight-card-leg-stop-city-compact">{stopCity}</span>
          )}
        </div>
      ) : (
        <div className="travel-flight-card-leg-stops-desk">
          <span
            className={cn(
              'travel-flight-card-leg-stops-val',
              leg.stops === 0 && 'travel-flight-card-leg-stops-val--nonstop',
            )}
          >
            {stopsLabel}
          </span>
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
                  className="travel-flight-card-baggage-item"
                  aria-label={`${baggage.carryOn} carry-on bag`}
                >
                  <CarryOnIcon />
                  <span className="travel-flight-card-baggage-count">{baggage.carryOn}</span>
                </span>
                <span
                  className={cn(
                    'travel-flight-card-baggage-item',
                    baggage.checked === 0 && 'travel-flight-card-baggage-item--none',
                  )}
                  aria-label={`${baggage.checked} checked bag`}
                >
                  <CheckedBagIcon />
                  <span className="travel-flight-card-baggage-count">{baggage.checked}</span>
                </span>
              </div>
              {baggage.checkedFee && (
                <p className="travel-flight-card-bag-fee">
                  Optional bag (20kg){' '}
                  <span className="travel-flight-card-bag-fee-price">{baggage.checkedFee}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

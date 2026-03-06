'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn.js';
import { Button } from '../../ui/button/index.js';
import { Badge } from '../../ui/badge/index.js';

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
  fareBreakdown?: FareBreakdownItem[];
  baggage?: BaggageAllowance;
  isBestValue?: boolean;
  isCheapest?: boolean;
  seatsLeft?: number;
  similarCount?: number;
  /** Compact layout — set true when detail panel opens (iOS fallback for container queries) */
  isCompact?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onShowSimilar?: () => void;
  className?: string;
}

// ─── Airline Logo ─────────────────────────────────────────────────────────────

function AirlineLogo({ segment }: { segment: FlightSegment }) {
  if (segment.airlineLogo) {
    return (
      <img
        src={segment.airlineLogo}
        alt={segment.airline}
        className="travel-flight-card-airline-logo"
      />
    );
  }
  return (
    <div className="travel-flight-card-airline-fallback" aria-hidden>
      {segment.airline.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─── Leg Row ──────────────────────────────────────────────────────────────────

function LegRow({ leg }: { leg: FlightLeg }) {
  const first = leg.segments[0];
  const last = leg.segments[leg.segments.length - 1];
  const airlineLabel = leg.segments.length > 1
    ? leg.segments.every(s => s.airline === first.airline)
      ? first.airline
      : 'Multiple airlines'
    : first.airline;

  return (
    <div className="travel-flight-card-leg">
      <div className="travel-flight-card-leg-airline">
        <AirlineLogo segment={first} />
        <div>
          <span className="travel-flight-card-leg-airline-name">{airlineLabel}</span>
          <span className="travel-flight-card-leg-flight-number">{first.flightNumber}</span>
        </div>
      </div>

      <div className="travel-flight-card-leg-times">
        <span className="travel-flight-card-leg-time">{first.departureTime}</span>
        <span className="travel-flight-card-leg-route">
          <span className="travel-flight-card-leg-code">{first.origin}</span>
          <span className="travel-flight-card-leg-arrow" aria-hidden>—</span>
          <span className="travel-flight-card-leg-code">{last.destination}</span>
        </span>
        <span className="travel-flight-card-leg-time">{last.arrivalTime}</span>
      </div>

      <div className="travel-flight-card-leg-meta">
        <span className="travel-flight-card-leg-duration">{leg.duration}</span>
        <span
          className={cn(
            'travel-flight-card-leg-stops',
            leg.stops === 0 && 'travel-flight-card-leg-stops--nonstop',
          )}
        >
          {leg.stops === 0
            ? 'nonstop'
            : `${leg.stops} stop${leg.stops > 1 ? 's' : ''}`}
        </span>
        {leg.stopAirports && leg.stopAirports.length > 0 && (
          <span className="travel-flight-card-leg-via">
            {leg.stopAirports.join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Baggage Row ──────────────────────────────────────────────────────────────

function BaggageRow({ baggage }: { baggage: BaggageAllowance }) {
  return (
    <div className="travel-flight-card-baggage" aria-label="Baggage allowance">
      <span className="travel-flight-card-baggage-item">
        <span className="travel-flight-card-baggage-icon" aria-hidden>🧳</span>
        {baggage.carryOn}
      </span>
      <span className="travel-flight-card-baggage-item">
        <span className="travel-flight-card-baggage-icon" aria-hidden>💼</span>
        {baggage.checked}
        {baggage.checkedFee && (
          <span className="travel-flight-card-baggage-fee">{baggage.checkedFee}</span>
        )}
      </span>
    </div>
  );
}

// ─── FlightCard ───────────────────────────────────────────────────────────────

export function FlightCard({
  legs,
  price,
  totalPrice,
  fareClass,
  fareBreakdown = [],
  baggage,
  isBestValue,
  isCheapest,
  seatsLeft,
  similarCount,
  isCompact = false,
  isSelected = false,
  onSelect,
  onShowSimilar,
  className,
}: FlightCardProps) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const displayLegs = legs.slice(0, 6);

  return (
    <article
      className={cn('travel-flight-card', className)}
      data-compact={isCompact || undefined}
      data-selected={isSelected || undefined}
      aria-selected={isSelected}
    >
      <div className="travel-flight-card-body">
        {/* Legs */}
        <div className="travel-flight-card-legs">
          {displayLegs.map((leg, i) => (
            <LegRow key={i} leg={leg} />
          ))}
        </div>

        {/* Price column */}
        <div className="travel-flight-card-price-col">
          {(isBestValue || isCheapest) && (
            <div className="travel-flight-card-price-badge">
              {isBestValue && <Badge variant="deal">Best value</Badge>}
              {isCheapest && !isBestValue && <Badge variant="popular">Cheapest</Badge>}
            </div>
          )}

          {seatsLeft !== undefined && seatsLeft <= 9 && (
            <p className="travel-flight-card-seats-left">
              {seatsLeft} seat{seatsLeft !== 1 ? 's' : ''} left
            </p>
          )}

          <p className="travel-flight-card-price">{price}</p>

          {totalPrice && (
            <p className="travel-flight-card-total-price">{totalPrice} total</p>
          )}

          {fareClass && (
            <Badge variant="outline" className="travel-flight-card-fare-class">{fareClass}</Badge>
          )}

          {baggage && <BaggageRow baggage={baggage} />}

          <Button size="sm" onClick={onSelect}>Select</Button>
        </div>
      </div>

      {/* Fare breakdown */}
      {fareBreakdown.length > 0 && (
        <div className="travel-flight-card-breakdown-wrap">
          <button
            type="button"
            className="travel-flight-card-breakdown-toggle"
            onClick={() => setShowBreakdown(v => !v)}
            aria-expanded={showBreakdown}
          >
            Fare breakdown
            <span className="travel-flight-card-breakdown-chevron" aria-hidden>
              {showBreakdown ? '▲' : '▼'}
            </span>
          </button>
          {showBreakdown && (
            <div className="travel-flight-card-breakdown-content">
              {fareBreakdown.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'travel-flight-card-breakdown-row',
                    item.type === 'total' && 'travel-flight-card-breakdown-row--total',
                  )}
                >
                  <span className="travel-flight-card-breakdown-label">{item.label}</span>
                  <span className="travel-flight-card-breakdown-amount">{item.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Similar flights */}
      {similarCount !== undefined && similarCount > 0 && (
        <button
          type="button"
          className="travel-flight-card-similar"
          onClick={onShowSimilar}
        >
          Show {similarCount} similar flight{similarCount !== 1 ? 's' : ''} at this price
        </button>
      )}
    </article>
  );
}

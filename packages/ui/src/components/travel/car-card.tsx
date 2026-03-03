'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../ui/button.js';
import { Badge } from '../ui/badge.js';
import { Switch } from '../ui/switch.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CarCategory = 'Economy' | 'Compact' | 'Mid-size' | 'Full-size' | 'SUV' | 'Luxury' | 'Van' | 'Convertible';

export interface CarSpecs {
  seats: number;
  doors: number;
  transmission: 'Manual' | 'Automatic';
  hasAC: boolean;
  luggageCapacity: number;
}

export interface InsuranceOption {
  id: string;
  label: string;
  pricePerDay: string;
  description: string;
}

export interface CarCardProps {
  name: string;
  category: CarCategory;
  imageUrl?: string;
  specs: CarSpecs;
  pickupLocation: string;
  dropoffLocation?: string;
  pricePerDay: string;
  totalPrice?: string;
  currency?: string;
  providerName: string;
  providerLogo?: string;
  insuranceOptions?: InsuranceOption[];
  onSelect?: (selectedInsurance?: string) => void;
  className?: string;
}

// ─── CarCard ──────────────────────────────────────────────────────────────────

export function CarCard({
  name,
  category,
  imageUrl,
  specs,
  pickupLocation,
  dropoffLocation,
  pricePerDay,
  totalPrice,
  currency = 'USD',
  providerName,
  providerLogo,
  insuranceOptions = [],
  onSelect,
  className,
}: CarCardProps) {
  const [selectedInsurance, setSelectedInsurance] = React.useState<string | undefined>();

  return (
    <div
      className={cn(
        'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
        'bg-[var(--color-surface-card)] overflow-hidden',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Vehicle image */}
        <div className="sm:w-48 flex-shrink-0 bg-[var(--color-background-subtle)] flex items-center justify-center p-4">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-28 w-full object-contain" />
          ) : (
            <div className="h-28 w-full flex items-center justify-center text-[var(--color-foreground-subtle)]">
              <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
          )}
          <div className="mt-2 text-center">
            <Badge variant="secondary">{category}</Badge>
          </div>
        </div>

        {/* Car details */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-[var(--color-foreground-default)]">{name}</h3>
              <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">or similar</p>
            </div>
            {/* Provider */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-muted)]">
              {providerLogo && <img src={providerLogo} alt={providerName} className="h-5 w-auto object-contain" />}
              {!providerLogo && <span>{providerName}</span>}
            </div>
          </div>

          {/* Specs row */}
          <div className="flex flex-wrap gap-3 mt-3" aria-label="Vehicle specifications">
            <span className="text-xs text-[var(--color-foreground-muted)] flex items-center gap-1">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              {specs.seats} seats
            </span>
            <span className="text-xs text-[var(--color-foreground-muted)] flex items-center gap-1">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              {specs.doors} doors
            </span>
            <span className="text-xs text-[var(--color-foreground-muted)]">{specs.transmission}</span>
            {specs.hasAC && <span className="text-xs text-[var(--color-foreground-muted)]">A/C</span>}
            <span className="text-xs text-[var(--color-foreground-muted)]">
              {specs.luggageCapacity} bag{specs.luggageCapacity !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Location */}
          <div className="mt-2 text-xs text-[var(--color-foreground-muted)]">
            <p>Pick-up: {pickupLocation}</p>
            {dropoffLocation && dropoffLocation !== pickupLocation && (
              <p>Drop-off: {dropoffLocation}</p>
            )}
          </div>

          {/* Insurance options */}
          {insuranceOptions.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-[var(--color-foreground-default)]">Insurance options</p>
              {insuranceOptions.map(option => (
                <div key={option.id} className="flex items-center justify-between">
                  <Switch
                    label={`${option.label} (+${option.pricePerDay}/day)`}
                    checked={selectedInsurance === option.id}
                    onCheckedChange={checked => setSelectedInsurance(checked ? option.id : undefined)}
                    aria-describedby={`insurance-desc-${option.id}`}
                  />
                  <span id={`insurance-desc-${option.id}`} className="sr-only">{option.description}</span>
                </div>
              ))}
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground-default)]">{pricePerDay}</p>
              <p className="text-xs text-[var(--color-foreground-muted)]">{currency} per day</p>
              {totalPrice && (
                <p className="text-xs text-[var(--color-foreground-muted)]">{totalPrice} total</p>
              )}
            </div>
            <Button onClick={() => onSelect?.(selectedInsurance)}>Select Car</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn.js';
import { Button } from '../../ui/button/index.js';
import { Badge } from '../../ui/badge/index.js';
import { Switch } from '../../ui/switch/index.js';

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
        'travel-car-card',
        className,
      )}
    >
      <div className="travel-car-card-layout">
        {/* Vehicle image */}
        <div className="travel-car-card-media">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="travel-car-card-image" />
          ) : (
            <div className="travel-car-card-image-fallback">
              <svg className="travel-car-card-image-fallback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
          )}
          <div className="travel-car-card-category-wrap">
            <Badge variant="secondary">{category}</Badge>
          </div>
        </div>

        {/* Car details */}
        <div className="travel-car-card-content">
          <div className="travel-car-card-header">
            <div>
              <h3 className="travel-car-card-title">{name}</h3>
              <p className="travel-car-card-subtitle">or similar</p>
            </div>
            {/* Provider */}
            <div className="travel-car-card-provider">
              {providerLogo && <img src={providerLogo} alt={providerName} className="travel-car-card-provider-logo" />}
              {!providerLogo && <span>{providerName}</span>}
            </div>
          </div>

          {/* Specs row */}
          <div className="travel-car-card-specs" aria-label="Vehicle specifications">
            <span className="travel-car-card-spec travel-car-card-spec--with-icon">
              <svg className="travel-car-card-spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              {specs.seats} seats
            </span>
            <span className="travel-car-card-spec travel-car-card-spec--with-icon">
              <svg className="travel-car-card-spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              {specs.doors} doors
            </span>
            <span className="travel-car-card-spec">{specs.transmission}</span>
            {specs.hasAC && <span className="travel-car-card-spec">A/C</span>}
            <span className="travel-car-card-spec">
              {specs.luggageCapacity} bag{specs.luggageCapacity !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Location */}
          <div className="travel-car-card-location">
            <p>Pick-up: {pickupLocation}</p>
            {dropoffLocation && dropoffLocation !== pickupLocation && (
              <p>Drop-off: {dropoffLocation}</p>
            )}
          </div>

          {/* Insurance options */}
          {insuranceOptions.length > 0 && (
            <div className="travel-car-card-insurance">
              <p className="travel-car-card-insurance-title">Insurance options</p>
              {insuranceOptions.map(option => (
                <div key={option.id} className="travel-car-card-insurance-option">
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
          <div className="travel-car-card-footer">
            <div>
              <p className="travel-car-card-price">{pricePerDay}</p>
              <p className="travel-car-card-price-meta">{currency} per day</p>
              {totalPrice && (
                <p className="travel-car-card-price-meta">{totalPrice} total</p>
              )}
            </div>
            <Button onClick={() => onSelect?.(selectedInsurance)}>Select Car</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

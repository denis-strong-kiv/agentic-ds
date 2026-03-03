'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../ui/button.js';
import { Badge } from '../ui/badge.js';
import { AspectRatio } from '../ui/aspect-ratio.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HotelCardProps {
  name: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  images?: string[];
  location: string;
  distanceToCenter?: string;
  amenities?: string[];
  pricePerNight: string;
  totalPrice?: string;
  currency?: string;
  reviewScore?: number;
  reviewCount?: number;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onViewDeal?: () => void;
  className?: string;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} star hotel`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'text-xs',
            i < rating ? 'text-[var(--color-warning-default)]' : 'text-[var(--color-border-default)]',
          )}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─── Image Carousel ───────────────────────────────────────────────────────────

function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = React.useState(0);

  if (images.length === 0) {
    return (
      <AspectRatio ratio={4 / 3}>
        <div className="h-full w-full bg-[var(--color-background-subtle)] flex items-center justify-center">
          <svg className="h-12 w-12 text-[var(--color-foreground-subtle)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
      </AspectRatio>
    );
  }

  return (
    <AspectRatio ratio={4 / 3}>
      <div className="relative h-full w-full overflow-hidden rounded-t-[var(--shape-preset-card)]">
        <img
          src={images[current]}
          alt={`${alt} — image ${current + 1} of ${images.length}`}
          className="h-full w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrent(i => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setCurrent(i => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/60',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </AspectRatio>
  );
}

// ─── Review Score Badge ───────────────────────────────────────────────────────

function reviewVariant(score: number): 'deal' | 'popular' | 'default' {
  if (score >= 8.5) return 'deal';
  if (score >= 7.0) return 'popular';
  return 'default';
}

// ─── HotelCard ────────────────────────────────────────────────────────────────

export function HotelCard({
  name,
  starRating,
  images = [],
  location,
  distanceToCenter,
  amenities = [],
  pricePerNight,
  totalPrice,
  currency = 'USD',
  reviewScore,
  reviewCount,
  isFavorite = false,
  onFavoriteToggle,
  onViewDeal,
  className,
}: HotelCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
        'bg-[var(--color-surface-card)] overflow-hidden',
        className,
      )}
    >
      {/* Image carousel */}
      <div className="relative">
        <ImageCarousel images={images} alt={name} />
        {/* Favorite toggle */}
        <button
          type="button"
          onClick={onFavoriteToggle}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isFavorite}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors"
        >
          <svg
            className={cn('h-4 w-4', isFavorite ? 'fill-[var(--color-error-default)] text-[var(--color-error-default)]' : 'text-[var(--color-foreground-muted)]')}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill={isFavorite ? 'currentColor' : 'none'}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Hotel info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[var(--color-foreground-default)] line-clamp-1">{name}</h3>
          {reviewScore !== undefined && (
            <Badge variant={reviewVariant(reviewScore)} className="flex-shrink-0">
              {reviewScore.toFixed(1)}
            </Badge>
          )}
        </div>

        <StarRating rating={starRating} />

        <p className="text-xs text-[var(--color-foreground-muted)] mt-1">
          {location}
          {distanceToCenter && ` · ${distanceToCenter} from center`}
        </p>

        {reviewCount !== undefined && (
          <p className="text-xs text-[var(--color-foreground-muted)]">
            {reviewCount.toLocaleString()} reviews
          </p>
        )}

        {/* Amenity icons */}
        {amenities.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap" aria-label="Amenities">
            {amenities.slice(0, 5).map(amenity => (
              <span
                key={amenity}
                className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-background-subtle)] text-[var(--color-foreground-muted)]"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 5 && (
              <span className="text-xs text-[var(--color-foreground-muted)]">+{amenities.length - 5} more</span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-4">
          <div>
            <p className="text-2xl font-bold text-[var(--color-foreground-default)]">{pricePerNight}</p>
            <p className="text-xs text-[var(--color-foreground-muted)]">{currency} per night</p>
            {totalPrice && (
              <p className="text-xs text-[var(--color-foreground-muted)]">{totalPrice} total</p>
            )}
          </div>
          <Button onClick={onViewDeal}>View Deal</Button>
        </div>
      </div>
    </div>
  );
}

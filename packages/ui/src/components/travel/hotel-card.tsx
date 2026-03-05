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
    <div className="travel-hotel-stars" role="img" aria-label={`${rating} star hotel`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'travel-hotel-star',
            i < rating ? 'travel-hotel-star--active' : 'travel-hotel-star--inactive',
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
        <div className="travel-hotel-image-placeholder">
          <svg className="travel-hotel-image-placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
      </AspectRatio>
    );
  }

  return (
    <AspectRatio ratio={4 / 3}>
      <div className="travel-hotel-image-shell">
        <img
          src={images[current]}
          alt={`${alt} (${current + 1} of ${images.length})`}
          className="travel-hotel-image"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrent(i => (i - 1 + images.length) % images.length)}
              className="travel-hotel-image-nav travel-hotel-image-nav--prev"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setCurrent(i => (i + 1) % images.length)}
              className="travel-hotel-image-nav travel-hotel-image-nav--next"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="travel-hotel-image-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={cn(
                    'travel-hotel-image-dot',
                    i === current ? 'travel-hotel-image-dot--active' : 'travel-hotel-image-dot--inactive',
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
        'travel-hotel-card',
        className,
      )}
    >
      {/* Image carousel */}
      <div className="travel-hotel-image-wrap">
        <ImageCarousel images={images} alt={name} />
        {/* Favorite toggle */}
        <button
          type="button"
          onClick={onFavoriteToggle}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isFavorite}
          className="travel-hotel-favorite-btn"
        >
          <svg
            className={cn(
              'travel-hotel-favorite-icon',
              isFavorite ? 'travel-hotel-favorite-icon--active' : 'travel-hotel-favorite-icon--inactive',
            )}
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
      <div className="travel-hotel-content">
        <div className="travel-hotel-header-row">
          <h3 className="travel-hotel-name">{name}</h3>
          {reviewScore !== undefined && (
            <Badge variant={reviewVariant(reviewScore)} className="travel-hotel-review-badge">
              {reviewScore.toFixed(1)}
            </Badge>
          )}
        </div>

        <StarRating rating={starRating} />

        <p className="travel-hotel-location">
          {location}
          {distanceToCenter && ` · ${distanceToCenter} from center`}
        </p>

        {reviewCount !== undefined && (
          <p className="travel-hotel-review-count">
            {reviewCount.toLocaleString()} reviews
          </p>
        )}

        {/* Amenity icons */}
        {amenities.length > 0 && (
          <div className="travel-hotel-amenities" aria-label="Amenities">
            {amenities.slice(0, 5).map(amenity => (
              <span
                key={amenity}
                className="travel-hotel-amenity-pill"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 5 && (
              <span className="travel-hotel-amenity-more">+{amenities.length - 5} more</span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="travel-hotel-footer-row">
          <div>
            <p className="travel-hotel-price">{pricePerNight}</p>
            <p className="travel-hotel-price-currency">{currency} per night</p>
            {totalPrice && (
              <p className="travel-hotel-price-total">{totalPrice} total</p>
            )}
          </div>
          <Button onClick={onViewDeal}>View Deal</Button>
        </div>
      </div>
    </div>
  );
}

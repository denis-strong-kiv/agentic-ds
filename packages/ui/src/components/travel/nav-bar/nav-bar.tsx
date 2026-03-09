'use client';

import * as React from 'react';
import { UserRound } from 'lucide-react';
import { cn } from '../../../utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchSummary {
  route: string;
  dates: string;
  passengers: number;
}

export interface NavBarProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  search?: SearchSummary;
  onSearchClick?: () => void;
  supportPhone?: string;
  onAccountClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

// ─── NavBar ───────────────────────────────────────────────────────────────────

export function NavBar({
  brandName = 'Brand',
  brandLogo,
  search,
  onSearchClick,
  supportPhone,
  onAccountClick,
  onMenuClick,
  className,
}: NavBarProps) {
  return (
    <header className={cn('travel-nav-bar', className)} role="banner">
      {/* Logo */}
      <div className="travel-nav-bar-brand">
        {brandLogo ?? (
          <span className="travel-nav-bar-brand-name">{brandName}</span>
        )}
      </div>

      {/* Mini search widget */}
      {search && (
        <button
          type="button"
          className="travel-nav-bar-search"
          onClick={onSearchClick}
          aria-label={`Search: ${search.route}, ${search.dates}, ${search.passengers} passenger${search.passengers !== 1 ? 's' : ''}. Click to edit search.`}
        >
          <span className="travel-nav-bar-search-route">{search.route}</span>
          <span className="travel-nav-bar-search-divider" aria-hidden>·</span>
          <span className="travel-nav-bar-search-dates">{search.dates}</span>
          <span className="travel-nav-bar-search-divider" aria-hidden>·</span>
          <span className="travel-nav-bar-search-pax">
            {search.passengers} Adult{search.passengers !== 1 ? 's' : ''}
          </span>
          <span className="travel-nav-bar-search-icon" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      )}

      {/* Right actions */}
      <div className="travel-nav-bar-actions">
        {supportPhone && (
          <a
            href={`tel:${supportPhone.replace(/\D/g, '')}`}
            className="travel-nav-bar-support"
            aria-label={`Call support: ${supportPhone}`}
          >
            <span className="travel-nav-bar-support-label">24/7 Support</span>
            <span className="travel-nav-bar-support-phone">{supportPhone}</span>
          </a>
        )}
        <button
          type="button"
          className="travel-nav-bar-icon-btn"
          onClick={onAccountClick}
          aria-label="Account"
        >
          <UserRound size={20} aria-hidden />
        </button>
        <button
          type="button"
          className="travel-nav-bar-icon-btn"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}

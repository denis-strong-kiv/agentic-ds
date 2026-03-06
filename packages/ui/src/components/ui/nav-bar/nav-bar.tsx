'use client';

import * as React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../../utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavBarSearchSummary {
  route: string;
  dates: string;
  passengers: number;
}

export type NavBarSearchTab = 'flights' | 'hotels';

export interface NavBarProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  /** Mini search pill — omit to hide */
  search?: NavBarSearchSummary;
  onSearchClick?: () => void;
  /** When true: hides the mini pill and shows Flights/Hotels tabs */
  searchExpanded?: boolean;
  activeSearchTab?: NavBarSearchTab;
  onSearchTabChange?: (tab: NavBarSearchTab) => void;
  supportPhone?: string;
  /** Right-side slot for arbitrary actions (overrides default account + menu buttons) */
  actions?: React.ReactNode;
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
  searchExpanded = false,
  activeSearchTab = 'flights',
  onSearchTabChange,
  supportPhone,
  actions,
  onAccountClick,
  onMenuClick,
  className,
}: NavBarProps) {
  return (
    <header
      className={cn('ui-nav-bar', className)}
      role="banner"
      data-search-expanded={searchExpanded || undefined}
    >
      {/* Logo */}
      <div className="ui-nav-bar-brand">
        {brandLogo ?? (
          <span className="ui-nav-bar-brand-name">{brandName}</span>
        )}
      </div>

      {/* Centre slot — grid column 2, always centered */}
      <div className="ui-nav-bar-center">
      {search && !searchExpanded && (
        <button
          type="button"
          className="ui-nav-bar-search"
          onClick={onSearchClick}
          aria-label={`Search: ${search.route}, ${search.dates}, ${search.passengers} passenger${search.passengers !== 1 ? 's' : ''}. Click to edit search.`}
        >
          <span className="ui-nav-bar-search-segment">{search.route}</span>
          <span className="ui-nav-bar-search-sep" aria-hidden />
          <span className="ui-nav-bar-search-segment">{search.dates}</span>
          <span className="ui-nav-bar-search-sep" aria-hidden />
          <span className="ui-nav-bar-search-segment">
            <User size={20} aria-hidden />
            <span>{search.passengers}</span>
          </span>
          <span className="ui-nav-bar-search-submit" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      )}

      {searchExpanded && (
        <nav className="ui-nav-bar-search-tabs" aria-label="Search type">
          {(['flights', 'hotels'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={cn(
                'ui-nav-bar-search-tab',
                activeSearchTab === tab && 'ui-nav-bar-search-tab--active',
              )}
              aria-current={activeSearchTab === tab ? 'page' : undefined}
              onClick={() => onSearchTabChange?.(tab)}
            >
              <span className="ui-nav-bar-search-tab-label">
                {tab === 'flights' ? 'Flights' : 'Hotels'}
              </span>
              <span className="ui-nav-bar-search-tab-underline" aria-hidden />
            </button>
          ))}
        </nav>
      )}
      </div>

      {/* Right actions */}
      <div className="ui-nav-bar-actions">
        {actions ?? (
          <>
            {supportPhone && (
              <a
                href={`tel:${supportPhone.replace(/\D/g, '')}`}
                className="ui-nav-bar-support"
                aria-label={`Call support: ${supportPhone}`}
              >
                <span className="ui-nav-bar-support-label">24/7 Support</span>
                <span className="ui-nav-bar-support-phone">{supportPhone}</span>
              </a>
            )}
            <button
              type="button"
              className="ui-nav-bar-icon-btn"
              onClick={onAccountClick}
              aria-label="Account"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className="ui-nav-bar-icon-btn"
              onClick={onMenuClick}
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

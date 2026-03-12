'use client';

import type { MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

type BrandId = 'default' | 'luxury' | 'adventure' | 'eco';

const BRAND_IDS: BrandId[] = ['default', 'luxury', 'adventure', 'eco'];

type BrandTokens = Record<string, string>;

// Light-mode brand snapshots for dev switching.
// Values mirror the Storybook brand token examples.
const BRAND_STYLES: Record<BrandId, BrandTokens> = {
  default: {
    '--shape-preset-button': '8px',
    '--shape-preset-card': '12px',
    '--shape-preset-input': '6px',
    '--shape-preset-dialog': '16px',
    '--shape-preset-badge': '6px',
    '--shadow-sm': '0 1px 2px oklch(0% 0 0 / 0.05)',
    '--shadow-md': '0 4px 8px oklch(0% 0 0 / 0.10)',
    '--shadow-lg': '0 8px 24px oklch(0% 0 0 / 0.12)',
    '--color-primary-default': 'oklch(0.50 0.22 250)',
    '--color-primary-hover': 'oklch(0.44 0.22 250)',
    '--color-primary-active': 'oklch(0.38 0.22 250)',
    '--color-primary-foreground': 'oklch(0.98 0.01 250)',
    '--color-accent-default': 'oklch(0.52 0.20 285)',
    '--color-accent-hover': 'oklch(0.46 0.20 285)',
    '--color-accent-active': 'oklch(0.40 0.20 285)',
    '--color-accent-foreground': 'oklch(0.98 0.01 285)',
    '--color-secondary-default': 'oklch(0.52 0.12 267)',
    '--color-secondary-hover': 'oklch(0.46 0.12 267)',
    '--color-secondary-foreground': 'oklch(0.98 0.01 267)',
    '--color-background-default': 'oklch(0.99 0.002 250)',
    '--color-background-subtle': 'oklch(0.96 0.004 250)',
    '--color-surface-card': 'oklch(1 0 0)',
    '--color-surface-popover': 'oklch(1 0 0)',
    '--color-surface-overlay': 'oklch(0% 0 0 / 0.6)',
    '--color-foreground-default': 'oklch(0.12 0.01 250)',
    '--color-foreground-muted': 'oklch(0.45 0.01 250)',
    '--color-foreground-subtle': 'oklch(0.52 0.01 250)',
    '--color-foreground-on-emphasis': 'oklch(0.98 0.01 250)',
    '--color-border-default': 'oklch(0.88 0.005 250)',
    '--color-border-muted': 'oklch(0.93 0.003 250)',
    '--color-success-default': 'oklch(0.52 0.17 145)',
    '--color-success-foreground': 'oklch(0.98 0.02 145)',
    '--color-success-subtle': 'oklch(0.94 0.04 145)',
    '--color-warning-default': 'oklch(0.62 0.20 95)',
    '--color-warning-foreground': 'oklch(0.22 0.07 80)',
    '--color-warning-subtle': 'oklch(0.96 0.06 95)',
    '--color-error-default': 'oklch(0.56 0.20 25)',
    '--color-error-foreground': 'oklch(0.98 0.02 25)',
    '--color-error-subtle': 'oklch(0.96 0.04 25)',
    '--color-info-default': 'oklch(0.52 0.18 250)',
    '--color-info-foreground': 'oklch(0.98 0.02 250)',
    '--color-info-subtle': 'oklch(0.95 0.04 250)',
  },
  luxury: {
    '--shape-preset-button': '2px',
    '--shape-preset-card': '2px',
    '--shape-preset-input': '1px',
    '--shape-preset-dialog': '4px',
    '--shape-preset-badge': '1px',
    '--shadow-sm': '0 1px 2px oklch(0% 0 0 / 0.05)',
    '--shadow-md': '0 4px 8px oklch(0% 0 0 / 0.10)',
    '--shadow-lg': '0 8px 24px oklch(0% 0 0 / 0.12)',
    '--color-primary-default': 'oklch(0.32 0.12 255)',
    '--color-primary-hover': 'oklch(0.26 0.12 255)',
    '--color-primary-active': 'oklch(0.20 0.12 255)',
    '--color-primary-foreground': 'oklch(0.98 0.01 85)',
    '--color-accent-default': 'oklch(0.72 0.16 85)',
    '--color-accent-hover': 'oklch(0.66 0.16 85)',
    '--color-accent-active': 'oklch(0.60 0.16 85)',
    '--color-accent-foreground': 'oklch(0.15 0.05 85)',
    '--color-background-default': 'oklch(0.99 0.001 255)',
    '--color-background-subtle': 'oklch(0.97 0.003 255)',
    '--color-surface-card': 'oklch(1 0 0)',
    '--color-surface-popover': 'oklch(1 0 0)',
    '--color-surface-overlay': 'oklch(0% 0 0 / 0.6)',
    '--color-foreground-default': 'oklch(0.10 0.015 255)',
    '--color-foreground-muted': 'oklch(0.42 0.01 255)',
    '--color-foreground-subtle': 'oklch(0.52 0.01 255)',
    '--color-foreground-on-emphasis': 'oklch(0.98 0.01 255)',
    '--color-border-default': 'oklch(0.88 0.005 255)',
    '--color-border-muted': 'oklch(0.93 0.003 255)',
    '--color-success-default': 'oklch(0.52 0.17 145)',
    '--color-success-foreground': 'oklch(0.98 0.02 145)',
    '--color-success-subtle': 'oklch(0.94 0.04 145)',
    '--color-warning-default': 'oklch(0.62 0.20 95)',
    '--color-warning-foreground': 'oklch(0.22 0.07 80)',
    '--color-warning-subtle': 'oklch(0.96 0.06 95)',
    '--color-error-default': 'oklch(0.56 0.20 25)',
    '--color-error-foreground': 'oklch(0.98 0.02 25)',
    '--color-error-subtle': 'oklch(0.96 0.04 25)',
    '--color-info-default': 'oklch(0.52 0.18 250)',
    '--color-info-foreground': 'oklch(0.98 0.02 250)',
    '--color-info-subtle': 'oklch(0.95 0.04 250)',
  },
  adventure: {
    '--shape-preset-button': '8px',
    '--shape-preset-card': '12px',
    '--shape-preset-input': '6px',
    '--shape-preset-dialog': '16px',
    '--shape-preset-badge': '6px',
    '--shadow-sm': '0 1px 2px oklch(0% 0 0 / 0.05)',
    '--shadow-md': '0 4px 8px oklch(0% 0 0 / 0.10)',
    '--shadow-lg': '0 8px 24px oklch(0% 0 0 / 0.12)',
    '--color-primary-default': 'oklch(0.46 0.15 150)',
    '--color-primary-hover': 'oklch(0.40 0.15 150)',
    '--color-primary-active': 'oklch(0.34 0.15 150)',
    '--color-primary-foreground': 'oklch(0.98 0.01 150)',
    '--color-accent-default': 'oklch(0.62 0.20 55)',
    '--color-accent-hover': 'oklch(0.56 0.20 55)',
    '--color-accent-active': 'oklch(0.50 0.20 55)',
    '--color-accent-foreground': 'oklch(0.15 0.04 55)',
    '--color-secondary-default': 'oklch(0.50 0.11 102)',
    '--color-secondary-hover': 'oklch(0.44 0.11 102)',
    '--color-secondary-foreground': 'oklch(0.98 0.01 102)',
    '--color-background-default': 'oklch(0.98 0.004 150)',
    '--color-background-subtle': 'oklch(0.95 0.006 150)',
    '--color-surface-card': 'oklch(1 0 0)',
    '--color-surface-popover': 'oklch(1 0 0)',
    '--color-surface-overlay': 'oklch(0% 0 0 / 0.6)',
    '--color-foreground-default': 'oklch(0.12 0.015 150)',
    '--color-foreground-muted': 'oklch(0.45 0.01 150)',
    '--color-foreground-subtle': 'oklch(0.52 0.01 150)',
    '--color-foreground-on-emphasis': 'oklch(0.98 0.01 150)',
    '--color-border-default': 'oklch(0.87 0.008 150)',
    '--color-border-muted': 'oklch(0.93 0.003 150)',
    '--color-success-default': 'oklch(0.52 0.17 145)',
    '--color-success-foreground': 'oklch(0.98 0.02 145)',
    '--color-success-subtle': 'oklch(0.94 0.04 145)',
    '--color-warning-default': 'oklch(0.62 0.20 95)',
    '--color-warning-foreground': 'oklch(0.22 0.07 80)',
    '--color-warning-subtle': 'oklch(0.96 0.06 95)',
    '--color-error-default': 'oklch(0.56 0.20 25)',
    '--color-error-foreground': 'oklch(0.98 0.02 25)',
    '--color-error-subtle': 'oklch(0.96 0.04 25)',
    '--color-info-default': 'oklch(0.52 0.18 250)',
    '--color-info-foreground': 'oklch(0.98 0.02 250)',
    '--color-info-subtle': 'oklch(0.95 0.04 250)',
  },
  eco: {
    '--shape-preset-button': '9999px',
    '--shape-preset-card': '24px',
    '--shape-preset-input': '9999px',
    '--shape-preset-dialog': '24px',
    '--shape-preset-badge': '9999px',
    '--shadow-sm': '0 1px 2px oklch(0% 0 0 / 0.05)',
    '--shadow-md': '0 4px 8px oklch(0% 0 0 / 0.10)',
    '--shadow-lg': '0 8px 24px oklch(0% 0 0 / 0.12)',
    '--color-primary-default': 'oklch(0.46 0.16 195)',
    '--color-primary-hover': 'oklch(0.40 0.16 195)',
    '--color-primary-active': 'oklch(0.34 0.16 195)',
    '--color-primary-foreground': 'oklch(0.98 0.01 195)',
    '--color-accent-default': 'oklch(0.68 0.17 75)',
    '--color-accent-hover': 'oklch(0.62 0.17 75)',
    '--color-accent-active': 'oklch(0.56 0.17 75)',
    '--color-accent-foreground': 'oklch(0.15 0.04 75)',
    '--color-background-default': 'oklch(0.98 0.005 195)',
    '--color-background-subtle': 'oklch(0.95 0.007 195)',
    '--color-surface-card': 'oklch(1 0 0)',
    '--color-surface-popover': 'oklch(1 0 0)',
    '--color-surface-overlay': 'oklch(0% 0 0 / 0.6)',
    '--color-foreground-default': 'oklch(0.12 0.012 195)',
    '--color-foreground-muted': 'oklch(0.45 0.01 195)',
    '--color-foreground-subtle': 'oklch(0.52 0.01 195)',
    '--color-foreground-on-emphasis': 'oklch(0.98 0.01 195)',
    '--color-border-default': 'oklch(0.88 0.008 195)',
    '--color-border-muted': 'oklch(0.93 0.003 195)',
    '--color-success-default': 'oklch(0.52 0.17 145)',
    '--color-success-foreground': 'oklch(0.98 0.02 145)',
    '--color-success-subtle': 'oklch(0.94 0.04 145)',
    '--color-warning-default': 'oklch(0.62 0.20 95)',
    '--color-warning-foreground': 'oklch(0.22 0.07 80)',
    '--color-warning-subtle': 'oklch(0.96 0.06 95)',
    '--color-error-default': 'oklch(0.56 0.20 25)',
    '--color-error-foreground': 'oklch(0.98 0.02 25)',
    '--color-error-subtle': 'oklch(0.96 0.04 25)',
    '--color-info-default': 'oklch(0.52 0.18 250)',
    '--color-info-foreground': 'oklch(0.98 0.02 250)',
    '--color-info-subtle': 'oklch(0.95 0.04 250)',
  },
};

const STORAGE_KEY = 'dev-active-brand';
const POSITION_STORAGE_KEY = 'dev-brand-fab-position';

function getBulletStyle(id: BrandId): React.CSSProperties {
  const tokens = BRAND_STYLES[id];
  const primary =
    tokens['--color-primary-default'] ??
    tokens['--color-accent-default'] ??
    'oklch(0.5 0.22 250)';

  // Give each brand a distinct shape so bullets are visually different.
  // Adventure should feel more squared than Luxury, mirroring the button shapes.
  const borderRadius =
    id === 'adventure'
      ? '2px' // most rectangular
      : id === 'luxury'
        ? '8px' // softer than Adventure
        : id === 'eco'
          ? '9999px' // full pill
          : '6px'; // default medium rounded

  return {
    width: 10,
    height: 10,
    borderRadius,
    background: primary,
    boxShadow: '0 0 0 3px color-mix(in oklab, var(--color-background-default) 70%, transparent)',
    flexShrink: 0,
  };
}

function applyBrandTokens(id: BrandId) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const tokens = BRAND_STYLES[id];

  root.dataset.brand = id;

  for (const [key, value] of Object.entries(tokens)) {
    root.style.setProperty(key, value);
  }
}

export function BrandSwitcherFab() {
  const [open, setOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState<BrandId>('default');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [panelPlacement, setPanelPlacement] = useState<'top' | 'bottom'>('bottom');
  const dragOffsetRef = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedBrand = window.localStorage.getItem(STORAGE_KEY) as BrandId | null;
    if (storedBrand && BRAND_IDS.includes(storedBrand)) {
      setActiveBrand(storedBrand);
      applyBrandTokens(storedBrand);
    } else {
      applyBrandTokens('default');
    }

    const storedPositionRaw = window.localStorage.getItem(POSITION_STORAGE_KEY);
    if (storedPositionRaw) {
      try {
        const parsed = JSON.parse(storedPositionRaw) as { top: number; left: number };
        if (typeof parsed.top === 'number' && typeof parsed.left === 'number') {
          setPosition(parsed);
        }
      } catch {
        // ignore invalid position
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !dragging) return;

    function handleMouseMove(event: MouseEvent) {
      if (!dragOffsetRef.current) return;
      if (!containerRef.current) return;

      const { offsetX, offsetY } = dragOffsetRef.current;
      const nextTop = event.clientY - offsetY;
      const nextLeft = event.clientX - offsetX;

      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width || 0;
      const height = rect.height || 0;

      const maxTop = Math.max(8, window.innerHeight - height - 8);
      const maxLeft = Math.max(8, window.innerWidth - width - 8);

      const clampedTop = Math.max(8, Math.min(maxTop, nextTop));
      const clampedLeft = Math.max(8, Math.min(maxLeft, nextLeft));

      const nextPosition = { top: clampedTop, left: clampedLeft };
      setPosition(nextPosition);
      window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(nextPosition));
    }

    function handleMouseUp() {
      setDragging(false);
      dragOffsetRef.current = null;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    if (!containerRef.current || !panelRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - (containerRect.top + containerRect.height);
    const spaceAbove = containerRect.top;
    const margin = 12;

    if (spaceBelow < panelRect.height + margin && spaceAbove > panelRect.height + margin) {
      setPanelPlacement('top');
    } else {
      setPanelPlacement('bottom');
    }
  }, [open, position]);

  function handleDragStart(event: ReactMouseEvent<HTMLDivElement | HTMLButtonElement>) {
    if (!containerRef.current) return;
    event.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    setDragging(true);
  }

  // Only render in non-production builds (local dev, branches, previews).
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="dev-brand-fab"
      aria-hidden={false}
      style={
        position
          ? {
              top: position.top,
              left: position.left,
              insetInlineEnd: 'auto',
              insetBlockEnd: 'auto',
            }
          : undefined
      }
    >
      <button
        type="button"
        className="dev-brand-fab-toggle"
        aria-label="Toggle brand switcher"
        onMouseDown={handleDragStart}
        onClick={() => setOpen(prev => !prev)}
      >
        <span className="dev-brand-fab-toggle-dot" />
        <span className="dev-brand-fab-toggle-label">Brand</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className={
            panelPlacement === 'top'
              ? 'dev-brand-fab-panel dev-brand-fab-panel--top'
              : 'dev-brand-fab-panel dev-brand-fab-panel--bottom'
          }
        >
          <div
            className="dev-brand-fab-panel-header"
            onMouseDown={handleDragStart}
          >
            <span className="dev-brand-fab-panel-title">Brand theme</span>
          </div>
          <div className="dev-brand-fab-panel-body">
            {BRAND_IDS.map(id => (
              <button
                key={id}
                type="button"
                className={
                  id === activeBrand
                    ? 'dev-brand-fab-option dev-brand-fab-option--active'
                    : 'dev-brand-fab-option'
                }
                onClick={() => {
                  setActiveBrand(id);
                  applyBrandTokens(id);
                  if (typeof window !== 'undefined') {
                    window.localStorage.setItem(STORAGE_KEY, id);
                  }
                  setOpen(false);
                }}
              >
                <span className="dev-brand-fab-option-dot" style={getBulletStyle(id)} />
                <span className="dev-brand-fab-option-label">{id}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


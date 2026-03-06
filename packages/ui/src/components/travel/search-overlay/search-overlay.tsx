'use client';

import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// ─── SearchOverlay ─────────────────────────────────────────────────────────────

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const EXIT_DURATION = 280;

export function SearchOverlay({ isOpen, onClose, children }: SearchOverlayProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(isOpen);
  const [isExiting, setIsExiting] = React.useState(false);

  // Drive visibility + exit animation from isOpen
  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsExiting(false);
    } else if (isVisible) {
      setIsExiting(true);
      const t = setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
      }, EXIT_DURATION);
      return () => clearTimeout(t);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock
  React.useEffect(() => {
    if (!isVisible) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isVisible]);

  // Focus trap + auto-focus + Escape
  React.useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const panel = panelRef.current;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));

    getFocusable()[0]?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={isExiting ? 'travel-search-overlay travel-search-overlay--exiting' : 'travel-search-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Edit search"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="travel-search-overlay-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="travel-search-overlay-content">
          {children}
        </div>
      </div>
    </div>
  );
}

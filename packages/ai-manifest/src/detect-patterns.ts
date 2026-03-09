/**
 * detect-patterns.ts
 * Detects UI composition patterns and screen-level component mappings by
 * analyzing the apps/web directory for page components, and applying
 * heuristic rules based on known component co-occurrence.
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import type { ComponentEntry, UIPattern, ScreenMapping } from './types.js';

const WEB_APP = resolve(
  new URL('.', import.meta.url).pathname,
  '../../../apps/web/app',
);

// ─── Static pattern definitions ───────────────────────────────────────────────
// These are known composition patterns for this travel domain.
// Extend with @pattern JSDoc tags for dynamic detection.

const STATIC_PATTERNS: UIPattern[] = [
  {
    id: 'search-form',
    label: 'Search Form',
    description: 'Origin/destination input with date range and passenger count',
    components: ['travel/search-form', 'travel/search-overlay', 'ui/input', 'ui/button', 'ui/popover'],
    example: '<SearchForm onSearch={fn} />',
  },
  {
    id: 'filter-bar',
    label: 'Filter Bar',
    description: 'Horizontal chip strip for quick flight filtering',
    components: ['travel/filter-bar', 'travel/filter-chip', 'travel/filter-panel'],
    example: '<FilterBar chips={chips} onFilter={fn} />',
  },
  {
    id: 'flight-listing',
    label: 'Flight Listing',
    description: 'Scrollable list of flight result cards',
    components: ['travel/flight-card', 'ui/badge', 'ui/skeleton'],
    example: '<FlightCard flight={flight} onSelect={fn} />',
  },
  {
    id: 'flight-detail',
    label: 'Flight Detail',
    description: 'Expanded flight details panel with map, timeline, and booking',
    components: [
      'travel/flight-details',
      'travel/flight-map',
      'travel/itinerary-timeline',
      'travel/price-breakdown',
      'ui/button',
    ],
    example: '<FlightDetails flight={flight} onBook={fn} />',
  },
  {
    id: 'booking-flow',
    label: 'Booking Flow',
    description: 'Multi-step booking: passengers → seats → confirmation',
    components: [
      'travel/booking-stepper',
      'travel/passenger-form',
      'travel/seat-picker',
      'travel/booking-confirmation',
      'ui/dialog',
      'ui/button',
    ],
    example: '<BookingStepper steps={steps} />',
  },
  {
    id: 'hotel-listing',
    label: 'Hotel Listing',
    description: 'Hotel result cards with room gallery',
    components: ['travel/hotel-card', 'travel/room-gallery', 'ui/badge', 'ui/skeleton'],
    example: '<HotelCard hotel={hotel} onSelect={fn} />',
  },
  {
    id: 'nav-bar',
    label: 'Navigation Bar',
    description: 'Top navigation with brand logo, locale switcher, and auth',
    components: ['travel/nav-bar', 'ui/button', 'ui/dropdown-menu'],
    example: '<NavBar brand={brand} />',
  },
  {
    id: 'notification',
    label: 'Notification / Toast',
    description: 'Transient feedback messages',
    components: ['ui/toast', 'ui/notification-badge'],
    example: '<Toast message="..." variant="success" />',
  },
  {
    id: 'form-fields',
    label: 'Form Fields',
    description: 'Labeled inputs with validation feedback',
    components: ['ui/input', 'ui/label', 'ui/select', 'ui/checkbox', 'ui/radio-group', 'ui/textarea'],
    example: '<Input label="Email" type="email" />',
  },
  {
    id: 'data-table',
    label: 'Data Table',
    description: 'Structured tabular data with pagination',
    components: ['ui/table', 'ui/pagination', 'ui/skeleton'],
    example: '<Table columns={cols} rows={rows} />',
  },
];

// ─── Screen detection ─────────────────────────────────────────────────────────

/** Heuristic: derive screen mappings by scanning page.tsx files */
function detectScreenMappings(components: ComponentEntry[]): ScreenMapping[] {
  const screens: ScreenMapping[] = [];
  const componentIds = new Set(components.map(c => c.id));

  // Known screen definitions — augmented by file scanning
  const knownScreens: Array<{ id: string; label: string; glob: string; patterns: string[] }> = [
    { id: 'flights-search', label: 'Flights Search', glob: '[locale]/flights/page.tsx', patterns: ['search-form', 'filter-bar', 'flight-listing', 'flight-detail', 'nav-bar'] },
    { id: 'hotels-search', label: 'Hotels Search', glob: '[locale]/hotels/page.tsx', patterns: ['hotel-listing', 'nav-bar'] },
    { id: 'booking', label: 'Booking', glob: '[locale]/booking/page.tsx', patterns: ['booking-flow'] },
    { id: 'home', label: 'Home', glob: '[locale]/page.tsx', patterns: ['nav-bar', 'search-form'] },
  ];

  for (const screen of knownScreens) {
    const filePath = join(WEB_APP, screen.glob);
    const usedComponents: string[] = [];

    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      // Find which component names are imported/used in this page
      for (const comp of components) {
        const nameInFile = comp.name;
        if (content.includes(nameInFile) || content.includes(comp.id)) {
          usedComponents.push(comp.id);
        }
      }
    } else {
      // Infer from pattern definitions
      for (const patternId of screen.patterns) {
        const pattern = STATIC_PATTERNS.find(p => p.id === patternId);
        if (pattern) {
          for (const cid of pattern.components) {
            if (componentIds.has(cid) && !usedComponents.includes(cid)) {
              usedComponents.push(cid);
            }
          }
        }
      }
    }

    screens.push({
      id: screen.id,
      label: screen.label,
      components: usedComponents,
      patterns: screen.patterns,
      filePath: screen.glob,
    });
  }

  return screens;
}

// ─── Pattern enrichment ───────────────────────────────────────────────────────

/** Merge @pattern JSDoc annotations from components into static patterns */
function enrichPatternsFromJSDoc(
  staticPatterns: UIPattern[],
  components: ComponentEntry[],
): UIPattern[] {
  const patternMap = new Map(staticPatterns.map(p => [p.id, { ...p }]));

  for (const comp of components) {
    for (const patternId of comp.patterns ?? []) {
      const existing = patternMap.get(patternId);
      if (existing) {
        if (!existing.components.includes(comp.id)) {
          existing.components.push(comp.id);
        }
      } else {
        patternMap.set(patternId, {
          id: patternId,
          label: patternId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          description: `Auto-detected from @pattern annotations`,
          components: [comp.id],
        });
      }
    }
  }

  return Array.from(patternMap.values());
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function detectPatterns(components: ComponentEntry[]): {
  patterns: UIPattern[];
  screenMappings: ScreenMapping[];
} {
  const patterns = enrichPatternsFromJSDoc(STATIC_PATTERNS, components);
  const screenMappings = detectScreenMappings(components);
  return { patterns, screenMappings };
}

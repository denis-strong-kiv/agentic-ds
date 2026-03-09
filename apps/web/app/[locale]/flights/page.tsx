'use client';

import { useState, useMemo, useEffect } from 'react';
import { NavBar } from '@travel/ui/components/ui/nav-bar';
import { FilterBar } from '@travel/ui/components/travel/filter-bar';
import { FilterPanel, createDefaultFilters } from '@travel/ui/components/travel/filter-panel';
import { FlightCard } from '@travel/ui/components/travel/flight-card';
import { FlightDetails } from '@travel/ui/components/travel/flight-details';
import { SearchOverlay } from '@travel/ui/components/travel/search-overlay';
import { TravelSearchForm } from '@travel/ui/components/travel/search-form';
import { FlightMap } from '@travel/ui/components/travel/flight-map';
import type { FilterState, SortOption } from '@travel/ui/components/travel/filter-panel';
import type { FlightLeg, BaggageAllowance } from '@travel/ui/components/travel/flight-card';
import type { FareOption } from '@travel/ui/components/travel/flight-details';
import type { DestinationOption } from '@travel/ui/components/travel/search-form';
import type { NavBarSearchTab } from '@travel/ui/components/ui/nav-bar';

// ─── Mock data ────────────────────────────────────────────────────────────────

interface FlightResult {
  id: string;
  legs: FlightLeg[];
  price: string;
  totalPrice?: string;
  fareClass?: string;
  fareBreakdown?: { label: string; amount: string; type?: 'base' | 'tax' | 'fee' | 'total' }[];
  fareOptions?: FareOption[];
  baggage?: BaggageAllowance;
  isCheapest?: boolean;
  isBestValue?: boolean;
  seatsLeft?: number;
  similarCount?: number;
}

const FARE_OPTIONS: FareOption[] = [
  {
    id: 'basic',
    name: 'Basic',
    fareClass: 'Economy',
    price: '$578',
    features: ['1 carry-on bag', 'No seat selection', 'No changes'],
  },
  {
    id: 'standard',
    name: 'Standard',
    fareClass: 'Economy',
    price: '$673',
    features: ['1 carry-on bag', '1 checked bag (20 kg)', 'Seat selection', 'Free rebooking'],
    isRecommended: true,
  },
  {
    id: 'flex',
    name: 'Flex',
    fareClass: 'Economy',
    price: '$798',
    features: ['1 carry-on bag', '2 checked bags', 'Any seat', 'Free changes', 'Refundable'],
  },
];

const FLIGHTS: FlightResult[] = [
  {
    id: 'f1',
    isCheapest: true,
    seatsLeft: 4,
    price: '$673',
    totalPrice: '$1,346',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 0, checkedFee: '+$138' },
    fareBreakdown: [
      { label: 'Base fare', amount: '$549', type: 'base' },
      { label: 'Taxes & fees', amount: '$124', type: 'tax' },
      { label: 'Total', amount: '$673', type: 'total' },
    ],
    fareOptions: FARE_OPTIONS,
    legs: [
      {
        duration: '10h 40m',
        stops: 1,
        stopAirports: ['ZRH'],
        segments: [
          {
            airline: 'Swiss',
            flightNumber: 'LX 87',
            origin: 'JFK',
            originCity: 'New York',
            destination: 'ZRH',
            destinationCity: 'Zürich',
            departureTime: '4:15 am',
            arrivalTime: '6:05 pm',
            duration: '8h 50m',
            class: 'Economy',
          },
          {
            airline: 'Swiss',
            flightNumber: 'LX 318',
            origin: 'ZRH',
            originCity: 'Zürich',
            destination: 'LHR',
            destinationCity: 'London',
            departureTime: '7:05 pm',
            arrivalTime: '7:55 pm',
            duration: '1h 50m',
            class: 'Economy',
          },
        ],
      },
      {
        duration: '11h 18m',
        stops: 1,
        stopAirports: ['YYZ'],
        segments: [
          {
            airline: 'Air Canada',
            flightNumber: 'AC 849',
            origin: 'LHR',
            originCity: 'London',
            destination: 'YYZ',
            destinationCity: 'Toronto',
            departureTime: '8:30 am',
            arrivalTime: '11:25 am',
            duration: '8h 55m',
            class: 'Economy',
          },
          {
            airline: 'Air Canada',
            flightNumber: 'AC 781',
            origin: 'YYZ',
            originCity: 'Toronto',
            destination: 'JFK',
            destinationCity: 'New York',
            departureTime: '1:10 pm',
            arrivalTime: '2:48 pm',
            duration: '1h 38m',
            class: 'Economy',
          },
        ],
      },
    ],
  },
  {
    id: 'f2',
    isBestValue: true,
    price: '$675',
    totalPrice: '$1,350',
    fareClass: 'Economy',
    similarCount: 2,
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: FARE_OPTIONS,
    legs: [
      {
        duration: '7h 25m',
        stops: 0,
        segments: [
          {
            airline: 'United Airlines',
            flightNumber: 'UA 9838',
            origin: 'EWR',
            originCity: 'Newark',
            destination: 'LHR',
            destinationCity: 'London',
            departureTime: '5:30 pm',
            arrivalTime: '5:55 am+1',
            duration: '7h 25m',
            class: 'Economy',
          },
        ],
      },
      {
        duration: '12h 5m',
        stops: 1,
        stopAirports: ['ZRH'],
        segments: [
          {
            airline: 'Swiss',
            flightNumber: 'LX 4905',
            origin: 'LHR',
            originCity: 'London',
            destination: 'ZRH',
            destinationCity: 'Zürich',
            departureTime: '6:00 am',
            arrivalTime: '9:05 am',
            duration: '2h 5m',
            class: 'Economy',
          },
          {
            airline: 'Swiss',
            flightNumber: 'LX 22',
            origin: 'ZRH',
            originCity: 'Zürich',
            destination: 'JFK',
            destinationCity: 'New York',
            departureTime: '10:30 am',
            arrivalTime: '1:05 pm',
            duration: '9h 35m',
            class: 'Economy',
          },
        ],
      },
    ],
  },
  {
    id: 'f3',
    seatsLeft: 9,
    price: '$679',
    totalPrice: '$1,358',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 0, checkedFee: '+$138' },
    fareOptions: FARE_OPTIONS,
    legs: [
      {
        duration: '9h 45m',
        stops: 1,
        stopAirports: ['ZRH'],
        segments: [
          {
            airline: 'Swiss',
            flightNumber: 'LX 5',
            origin: 'EWR',
            originCity: 'Newark',
            destination: 'ZRH',
            destinationCity: 'Zürich',
            departureTime: '6:40 am',
            arrivalTime: '7:55 pm',
            duration: '8h 15m',
            class: 'Economy',
          },
          {
            airline: 'Swiss',
            flightNumber: 'LX 318',
            origin: 'ZRH',
            originCity: 'Zürich',
            destination: 'LHR',
            destinationCity: 'London',
            departureTime: '9:05 pm',
            arrivalTime: '10:00 pm',
            duration: '1h 55m',
            class: 'Economy',
          },
        ],
      },
      {
        duration: '23h 5m',
        stops: 2,
        stopAirports: ['BOS', 'LIS'],
        segments: [
          {
            airline: 'TAP Air Portugal',
            flightNumber: 'TP 6104',
            origin: 'LHR',
            originCity: 'London',
            destination: 'LIS',
            destinationCity: 'Lisbon',
            departureTime: '3:35 am',
            arrivalTime: '5:45 am',
            duration: '2h 10m',
            class: 'Economy',
          },
          {
            airline: 'TAP Air Portugal',
            flightNumber: 'TP 201',
            origin: 'LIS',
            originCity: 'Lisbon',
            destination: 'BOS',
            destinationCity: 'Boston',
            departureTime: '9:25 am',
            arrivalTime: '12:55 pm',
            duration: '8h 30m',
            class: 'Economy',
          },
          {
            airline: 'American Airlines',
            flightNumber: 'AA 2173',
            origin: 'BOS',
            originCity: 'Boston',
            destination: 'JFK',
            destinationCity: 'New York',
            departureTime: '5:55 pm',
            arrivalTime: '6:29 pm',
            duration: '1h 34m',
            class: 'Economy',
          },
        ],
      },
    ],
  },
  {
    id: 'f4',
    price: '$691',
    totalPrice: '$1,382',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 2 },
    fareOptions: FARE_OPTIONS,
    legs: [
      {
        duration: '9h 45m',
        stops: 1,
        stopAirports: ['YYZ'],
        segments: [
          {
            airline: 'Air Canada',
            flightNumber: 'AC 856',
            origin: 'LGA',
            originCity: 'New York',
            destination: 'YYZ',
            destinationCity: 'Toronto',
            departureTime: '6:40 am',
            arrivalTime: '8:00 am',
            duration: '1h 20m',
            class: 'Economy',
          },
          {
            airline: 'Air Canada',
            flightNumber: 'AC 808',
            origin: 'YYZ',
            originCity: 'Toronto',
            destination: 'LHR',
            destinationCity: 'London',
            departureTime: '9:30 am',
            arrivalTime: '10:15 pm',
            duration: '7h 45m',
            class: 'Economy',
          },
        ],
      },
      {
        duration: '8h 30m',
        stops: 0,
        segments: [
          {
            airline: 'British Airways',
            flightNumber: 'BA 178',
            origin: 'LHR',
            originCity: 'London',
            destination: 'JFK',
            destinationCity: 'New York',
            departureTime: '11:15 am',
            arrivalTime: '2:45 pm',
            duration: '8h 30m',
            class: 'Economy',
          },
        ],
      },
    ],
  },
];

const AIRPORTS: (DestinationOption & { lat: number, lng: number })[] = [
  { id: 'airport-jfk', iata: 'JFK', city: 'New York', country: 'United States', label: 'John F. Kennedy Intl Airport', itemType: 'airport', shortName: 'New York', distance: '13 km from city center', geographicBreadcrumbs: [{ type: 'city', label: 'New York' }, { type: 'country', label: 'United States' }], lat: 40.6413, lng: -73.7781 },
  { id: 'airport-ewr', iata: 'EWR', city: 'Newark', country: 'United States', label: 'Newark Liberty Intl Airport', itemType: 'airport', shortName: 'Newark', distance: '9 km from city center', geographicBreadcrumbs: [{ type: 'city', label: 'Newark' }, { type: 'country', label: 'United States' }], lat: 40.6895, lng: -74.1745 },
  { id: 'airport-lga', iata: 'LGA', city: 'New York', country: 'United States', label: 'LaGuardia Airport', itemType: 'airport', shortName: 'New York', distance: '8 km from city center', geographicBreadcrumbs: [{ type: 'city', label: 'New York' }, { type: 'country', label: 'United States' }], lat: 40.7769, lng: -73.8740 },
  { id: 'airport-lhr', iata: 'LHR', city: 'London', country: 'United Kingdom', label: 'London Heathrow Airport', itemType: 'airport', shortName: 'London', geographicBreadcrumbs: [{ type: 'city', label: 'London' }, { type: 'country', label: 'United Kingdom' }], lat: 51.4700, lng: -0.4543 },
  { id: 'airport-lgw', iata: 'LGW', city: 'London', country: 'United Kingdom', label: 'London Gatwick Airport', itemType: 'airport', shortName: 'London', geographicBreadcrumbs: [{ type: 'city', label: 'London' }, { type: 'country', label: 'United Kingdom' }], lat: 51.1537, lng: -0.1821 },
  { id: 'airport-cdg', iata: 'CDG', city: 'Paris', country: 'France', label: 'Charles de Gaulle Airport', itemType: 'airport', lat: 49.0097, lng: 2.5479 },
  { id: 'airport-ams', iata: 'AMS', city: 'Amsterdam', country: 'Netherlands', label: 'Amsterdam Schiphol Airport', itemType: 'airport', lat: 52.3105, lng: 4.7683 },
  { id: 'airport-fra', iata: 'FRA', city: 'Frankfurt', country: 'Germany', label: 'Frankfurt Airport', itemType: 'airport', lat: 50.0379, lng: 8.5622 },
  { id: 'airport-zrh', iata: 'ZRH', city: 'Zurich', country: 'Switzerland', label: 'Zurich Airport', itemType: 'airport', lat: 47.4582, lng: 8.5555 },
  { id: 'airport-yyz', iata: 'YYZ', city: 'Toronto', country: 'Canada', label: 'Toronto Pearson Airport', itemType: 'airport', lat: 43.6777, lng: -79.6248 },
  { id: 'airport-lis', iata: 'LIS', city: 'Lisbon', country: 'Portugal', label: 'Lisbon Portela Airport', itemType: 'airport', lat: 38.7742, lng: -9.1342 },
  { id: 'airport-bos', iata: 'BOS', city: 'Boston', country: 'United States', label: 'Logan International Airport', itemType: 'airport', lat: 42.3656, lng: -71.0096 }
];

const AIRLINES = [
  { value: 'UA', label: 'United Airlines' },
  { value: 'BA', label: 'British Airways' },
  { value: 'LX', label: 'Swiss' },
  { value: 'AC', label: 'Air Canada' },
  { value: 'TP', label: 'TAP Air Portugal' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FlightsPage() {
  const [filters, setFilters] = useState<FilterState>(createDefaultFilters(2345));
  const [sortBy, setSortBy] = useState<SortOption>('cheap-and-fast');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Keep sidebar open by default only on very large screens (>1440px)
      if (window.innerWidth > 1440) {
        setSidebarOpen(true);
      }
    }
  }, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<NavBarSearchTab>('flights');

  const selectedFlight = FLIGHTS.find(f => f.id === selectedId) ?? null;
  const detailOpen = selectedFlight !== null;

  // Extract map data for the view
  const mapAirports = useMemo(() => {
    if (!selectedFlight) {
      // Default: Display origin and destination from search criteria
      const origin = AIRPORTS.find(a => a.iata === 'JFK');
      const dest = AIRPORTS.find(a => a.iata === 'LHR');
      
      return [
        origin ? { id: origin.iata, lat: origin.lat, lng: origin.lng, label: origin.iata, isOrigin: true } : null,
        dest ? { id: dest.iata, lat: dest.lat, lng: dest.lng, label: dest.iata, isDestination: true } : null
      ].filter(Boolean) as any[];
    }

    const uniqueAirports = new Map<string, typeof AIRPORTS[number] & { isOrigin?: boolean; isDestination?: boolean }>();
    
    selectedFlight.legs.forEach(leg => {
      leg.segments.forEach((seg, index) => {
        const isFirst = index === 0;
        const isLast = index === leg.segments.length - 1;
        
        if (!uniqueAirports.has(seg.origin)) {
          const airport = AIRPORTS.find(a => a.iata === seg.origin);
          if (airport) uniqueAirports.set(seg.origin, { ...airport, isOrigin: isFirst });
        } else if (isFirst) {
          uniqueAirports.get(seg.origin)!.isOrigin = true;
        }

        if (!uniqueAirports.has(seg.destination)) {
          const airport = AIRPORTS.find(a => a.iata === seg.destination);
          if (airport) uniqueAirports.set(seg.destination, { ...airport, isDestination: isLast });
        } else if (isLast) {
          uniqueAirports.get(seg.destination)!.isDestination = true;
        }
      });
    });

    return Array.from(uniqueAirports.values()).map(a => ({
      id: a.iata || a.id || 'unknown',
      lat: a.lat,
      lng: a.lng,
      label: (a.isOrigin || a.isDestination) ? a.iata : undefined, // ONLY show label for origin/dest
      isOrigin: a.isOrigin,
      isDestination: a.isDestination
    }));
  }, [selectedFlight]);

  const mapPaths = useMemo(() => {
    if (!selectedFlight) {
       // Default path for search criteria
       const origin = AIRPORTS.find(a => a.iata === 'JFK');
       const dest = AIRPORTS.find(a => a.iata === 'LHR');
       if (origin && dest) {
         return [{
           id: 'default-path',
           originId: 'JFK',
           destinationId: 'LHR',
           coordinates: [[origin.lng, origin.lat], [dest.lng, dest.lat]]
         }];
       }
       return [];
    }

    const paths: { id: string, originId: string, destinationId: string, coordinates: number[][] }[] = [];
    
    selectedFlight.legs.forEach((leg, legIndex) => {
      leg.segments.forEach((seg, segIndex) => {
        const originAirport = AIRPORTS.find(a => a.iata === seg.origin);
        const destAirport = AIRPORTS.find(a => a.iata === seg.destination);
        
        if (originAirport && destAirport) {
          paths.push({
            id: `${selectedFlight.id}-${legIndex}-${segIndex}`,
            originId: seg.origin,
            destinationId: seg.destination,
            coordinates: [
              [originAirport.lng, originAirport.lat],
              [destAirport.lng, destAirport.lat]
            ]
          });
        }
      });
    });
    
    return paths;
  }, [selectedFlight]);

  function handleSelectFlight(id: string) {
    const isOpening = selectedId !== id;
    setSelectedId(prev => prev === id ? null : id);
    if (isOpening) setSidebarOpen(false);
  }

  function handleCloseDetail() {
    setSelectedId(null);
  }

  function handleToggleSidebar() {
    setSidebarOpen(v => !v);
  }

  return (
    <div className="web-flights-page">
      <NavBar
        brandName="TravelCo"
        search={{ route: 'New York to London', dates: 'Oct 20 – 27', passengers: 1 }}
        supportPhone="855-706-2925"
        onSearchClick={() => setSearchOpen(true)}
        searchExpanded={searchOpen}
        activeSearchTab={searchTab}
        onSearchTabChange={(tab) => setSearchTab(tab)}
        onAccountClick={() => {}}
        onMenuClick={() => {}}
      />

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)}>
        <TravelSearchForm
          activeTab={searchTab}
          onTabChange={setSearchTab}
          airportOptions={AIRPORTS}
          onSearch={() => setSearchOpen(false)}
        />
      </SearchOverlay>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        airlineOptions={AIRLINES}
        maxPrice={2345}
      />

      <div
        className="web-flights-body"
        data-detail-open={detailOpen || undefined}
        data-sidebar-open={sidebarOpen || undefined}
      >
        {/* Sidebar — independent, doesn't affect detail state */}
        <aside
          className={`web-flights-sidebar${sidebarOpen ? '' : ' web-flights-sidebar--closed'}`}
          aria-label="Search filters"
          aria-hidden={!sidebarOpen || undefined}
        >
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onClearAll={() => setFilters(createDefaultFilters(2345))}
            sortBy={sortBy}
            onSortChange={setSortBy}
            providerOptions={AIRLINES}
            maxPrice={2345}
            mode="flights"
            isOpen={sidebarOpen}
          />
        </aside>

        {/* Mini flight list — always in DOM for smooth slide transition */}
        <div
          className="web-flights-mini-list"
          aria-hidden={!detailOpen || undefined}
        >
          <div className="web-flights-mini-list-inner">
            {detailOpen && FLIGHTS.map(flight => (
              <FlightCard
                key={flight.id}
                legs={flight.legs}
                price={flight.price}
                totalPrice={flight.totalPrice}
                isCheapest={flight.isCheapest}
                isBestValue={flight.isBestValue}
                seatsLeft={flight.seatsLeft}
                baggage={flight.baggage}
                isCompact
                isSelected={selectedId === flight.id}
                onSelect={() => handleSelectFlight(flight.id)}
              />
            ))}
          </div>
        </div>

        {/* Main area: large cards or detail panel — always 800px */}
        <main id="main-content" className="web-flights-main">
          {detailOpen && selectedFlight ? (
            <FlightDetails
              title="New York – London"
              legs={selectedFlight.legs}
              nightsBetween={7}
              fareOptions={selectedFlight.fareOptions}
              isOpen
              onClose={handleCloseDetail}
              onShare={() => {}}
              onSelectFare={() => {}}
            />
          ) : (
            <div className="web-flights-results-inner">
              {FLIGHTS.map(flight => (
                <FlightCard
                  key={flight.id}
                  legs={flight.legs}
                  price={flight.price}
                  totalPrice={flight.totalPrice}
                  fareClass={flight.fareClass}
                  fareBreakdown={flight.fareBreakdown}
                  baggage={flight.baggage}
                  isCheapest={flight.isCheapest}
                  isBestValue={flight.isBestValue}
                  seatsLeft={flight.seatsLeft}
                  isSelected={selectedId === flight.id}
                  onSelect={() => handleSelectFlight(flight.id)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Map — flex stretch, fills all remaining space */}
        <div className="web-flights-map" aria-label="Map view" role="region">
          <FlightMap
            airports={mapAirports}
            paths={mapPaths}
            // Fit bounds roughly around US East Coast & Western Europe
            initialViewState={{
              longitude: -40,
              latitude: 45,
              zoom: 2.2,
              bearing: 0,
              pitch: 0
            }}
          />
        </div>
      </div>
    </div>
  );
}

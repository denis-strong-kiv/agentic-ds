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
import type { NavBarSearchTab } from '@travel/ui/components/ui/nav-bar';
import { MOCK_FLIGHTS as FLIGHTS, MOCK_AIRPORTS as AIRPORTS, MOCK_AIRLINES as AIRLINES } from './mock-flights';

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
            initialViewState={{ longitude: -37, latitude: 46, zoom: 3.2 }}
          />
        </div>
      </div>
    </div>
  );
}

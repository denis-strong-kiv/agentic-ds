'use client';

import * as React from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import type { LineLayerSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '../../../utils/cn';

// Import CSS
import './flight-map.css';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AirportPoint {
  id: string;   // E.g., 'JFK'
  lat: number;
  lng: number;
  label?: string;
  isOrigin?: boolean;
  isDestination?: boolean;
}

export interface FlightPath {
  id: string;
  originId: string;
  destinationId: string;
  // An array of coordinates mapping out the line: [[lng, lat], [lng, lat]]
  coordinates: number[][];
}

export interface FlightMapProps {
  className?: string;
  airports: AirportPoint[];
  paths?: FlightPath[];
  // Bounding box options
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
  };
}

// Map style free alternative
const BASE_MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// Line layer for flight paths
const pathLayerStyle: LineLayerSpecification = {
  id: 'flight-paths',
  type: 'line',
  source: 'flight-paths-source',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#4a44f2', // Primary looking color, defaults to a clear blue/indigo
    'line-width': 2,
    'line-dasharray': [2, 2], // Dashed line effect
    'line-opacity': 0.6
  }
};

// ─── FlightMap ────────────────────────────────────────────────────────────────

export function FlightMap({ className, airports, paths = [], initialViewState }: FlightMapProps) {
  // Build GeoJSON FeatureCollection for the flight paths
  const pathFeatures = React.useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: paths.map(path => ({
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates: path.coordinates
        },
        properties: {
          id: path.id
        }
      }))
    };
  }, [paths]);

  // Default view centering on generic North Atlantic / Europe if none provided
  const defaultViewState = {
    longitude: -40,
    latitude: 35,
    zoom: 2,
    ...initialViewState
  };

  return (
    <div className={cn('travel-flight-map-container', className)}>
      <Map
        initialViewState={defaultViewState}
        mapStyle={BASE_MAP_STYLE}
        interactive={true}
        dragRotate={false}
        pitchWithRotate={false}
      >
        <NavigationControl position="top-right" />

        {/* Render paths using Source and Layer */}
        {paths.length > 0 && (
          <Source id="flight-paths-source" type="geojson" data={pathFeatures}>
            <Layer {...pathLayerStyle} />
          </Source>
        )}

        {/* Render markers for each airport */}
        {airports.map((airport) => (
          <Marker
            key={airport.id}
            longitude={airport.lng}
            latitude={airport.lat}
            anchor="bottom"
          >
            <div className="travel-flight-map-marker">
              {airport.label && (
                <div className="travel-flight-map-marker-label">
                  {airport.label}
                </div>
              )}
              <div
                className={cn(
                  'travel-flight-map-marker-dot',
                  airport.isOrigin && 'travel-flight-map-marker-dot--origin',
                  airport.isDestination && 'travel-flight-map-marker-dot--dest'
                )}
              />
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}

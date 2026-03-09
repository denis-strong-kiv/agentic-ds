'use client';

import * as React from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import type { LineLayerSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '../../../utils/cn';
import './flight-map.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AirportPoint {
  id: string;
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
  /** [origin, destination] — great-circle arc is generated internally */
  coordinates: number[][];
}

export interface MapPadding {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface FlightMapProps {
  className?: string;
  airports: AirportPoint[];
  paths?: FlightPath[];
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

// 14 frames cycling at ~20 fps → smooth 0.7 s loop
const DASH_FRAMES: number[][] = [
  [0, 4, 3],        [0.5, 4, 2.5],    [1, 4, 2],        [1.5, 4, 1.5],
  [2, 4, 1],        [2.5, 4, 0.5],    [3, 4, 0],
  [0, 0.5, 3, 3.5], [0, 1, 3, 3],     [0, 1.5, 3, 2.5],
  [0, 2, 3, 2],     [0, 2.5, 3, 1.5], [0, 3, 3, 1],     [0, 3.5, 3, 0.5],
];

// ─── Great-circle arc (spherical interpolation) ───────────────────────────────

function greatCircleArc(
  from: [number, number],
  to: [number, number],
  steps = 80,
): number[][] {
  const r = (d: number) => (d * Math.PI) / 180;
  const d2r = (d: number) => (d * 180) / Math.PI;

  const [lng1, lat1] = [r(from[0]), r(from[1])];
  const [lng2, lat2] = [r(to[0]),   r(to[1])];

  const angDist =
    2 * Math.asin(Math.sqrt(
      Math.sin((lat2 - lat1) / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2,
    ));

  if (angDist < 0.0001) return [from, to];

  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const A = Math.sin((1 - t) * angDist) / Math.sin(angDist);
    const B = Math.sin(t * angDist) / Math.sin(angDist);
    const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
    const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    return [d2r(Math.atan2(y, x)), d2r(Math.atan2(z, Math.sqrt(x * x + y * y)))];
  });
}

// ─── Layer specs ──────────────────────────────────────────────────────────────

const glowLayer: LineLayerSpecification = {
  id: 'flight-paths-glow',
  type: 'line',
  source: 'flight-paths',
  layout: { 'line-join': 'round', 'line-cap': 'round' },
  paint: {
    'line-color': '#4f46e5',
    'line-width': 10,
    'line-opacity': 0.1,
    'line-blur': 6,
  },
};

// line-gradient requires lineMetrics: true on the GeoJSON source
const gradientLayer: LineLayerSpecification = {
  id: 'flight-paths-gradient',
  type: 'line',
  source: 'flight-paths',
  layout: { 'line-join': 'round', 'line-cap': 'round' },
  paint: {
    'line-width': 2.5,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'line-gradient': ['interpolate', ['linear'], ['line-progress'],
      0,   '#4f46e5',
      0.5, '#7c3aed',
      1,   '#2563eb',
    ] as any,
  },
};

// Animated white dashes overlaid on the gradient — line-dasharray updated via RAF
const dashLayer: LineLayerSpecification = {
  id: 'flight-paths-dash',
  type: 'line',
  source: 'flight-paths',
  layout: { 'line-join': 'round', 'line-cap': 'round' },
  paint: {
    'line-color': 'rgba(255, 255, 255, 0.65)',
    'line-width': 1.5,
    'line-dasharray': [0, 4, 3],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function FlightMap({
  className,
  airports,
  paths = [],
  initialViewState,
}: FlightMapProps) {
  const mapRef = React.useRef<React.ElementRef<typeof Map>>(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const airportKeyRef = React.useRef('');
  const airportsRef = React.useRef(airports);

  // Straight [origin, dest] coordinates → 80-point great-circle arc
  const pathGeoJSON = React.useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: paths.map(path => ({
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates: greatCircleArc(
            path.coordinates[0] as [number, number],
            path.coordinates[path.coordinates.length - 1] as [number, number],
          ),
        },
        properties: { id: path.id },
      })),
    }),
    [paths],
  );

  // Animated dash — cycles DASH_FRAMES at ~20 fps
  React.useEffect(() => {
    if (!mapLoaded) return;
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    let animId: number;
    let lastTime = 0;
    let step = 0;

    function frame(time: number) {
      animId = requestAnimationFrame(frame);
      if (time - lastTime < 50) return;
      lastTime = time;
      step = (step + 1) % DASH_FRAMES.length;
      try {
        mapInstance!.setPaintProperty('flight-paths-dash', 'line-dasharray', DASH_FRAMES[step]);
      } catch (_) { /* layer not yet ready */ }
    }

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [mapLoaded]);

  // Always keep airportsRef current so the resize handler uses fresh data
  airportsRef.current = airports;

  const fitAirports = React.useCallback((map: maplibregl.Map, duration = 900) => {
    const pts = airportsRef.current;
    if (pts.length === 0) return;
    const lngs = pts.map(a => a.lng);
    const lats = pts.map(a => a.lat);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 80, duration, maxZoom: 7 },
    );
  }, []);

  // Re-fit when airports set changes (new flight selected / deselected)
  React.useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current?.getMap();
    if (!map) return;

    const newKey = airports.map(a => a.id).join(',');
    if (newKey === airportKeyRef.current) return;
    airportKeyRef.current = newKey;

    fitAirports(map, 900);
  }, [airports, mapLoaded, fitAirports]);

  // Re-fit when map canvas resizes (panel opens/closes) — debounced so it
  // fires once after the 300ms CSS transition completes
  React.useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current?.getMap();
    if (!map) return;

    let tid: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(() => fitAirports(map, 700), 320);
    };

    map.on('resize', onResize);
    return () => { clearTimeout(tid); map.off('resize', onResize); };
  }, [mapLoaded, fitAirports]);

  const defaultView = { longitude: -40, latitude: 45, zoom: 2.5, ...initialViewState };

  return (
    <div className={cn('travel-flight-map-container', className)}>
      <Map
        ref={mapRef}
        initialViewState={defaultView}
        mapStyle={MAP_STYLE}
        interactive
        dragRotate={false}
        pitchWithRotate={false}
        onLoad={() => setMapLoaded(true)}
      >
        <NavigationControl position="top-right" />

        {paths.length > 0 && (
          // lineMetrics: true required for line-gradient interpolation
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Source id="flight-paths" type="geojson" data={pathGeoJSON} {...({ lineMetrics: true } as any)}>
            <Layer {...glowLayer} />
            <Layer {...gradientLayer} />
            <Layer {...dashLayer} />
          </Source>
        )}

        {airports.map(airport => (
          <Marker
            key={airport.id}
            longitude={airport.lng}
            latitude={airport.lat}
            anchor="bottom"
          >
            <div
              className={cn(
                'travel-flight-map-marker',
                airport.isOrigin      && 'travel-flight-map-marker--origin',
                airport.isDestination && 'travel-flight-map-marker--destination',
                !airport.isOrigin && !airport.isDestination && 'travel-flight-map-marker--stop',
              )}
            >
              {airport.label && (
                <span className="travel-flight-map-marker-label">{airport.label}</span>
              )}
              <div className="travel-flight-map-marker-dot">
                {airport.isOrigin && <div className="travel-flight-map-marker-pulse" aria-hidden="true" />}
              </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}

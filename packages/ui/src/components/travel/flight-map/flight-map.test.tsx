import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlightMap } from './index';
import type { AirportPoint, FlightPath } from './index';

// react-map-gl / maplibre-gl cannot run in jsdom (WebGL). Stub the map entirely.
vi.mock('react-map-gl/maplibre', () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  Marker: ({
    children,
    longitude,
    latitude,
  }: {
    children: React.ReactNode;
    longitude: number;
    latitude: number;
  }) => (
    <div data-testid="marker" data-lng={longitude} data-lat={latitude}>
      {children}
    </div>
  ),
  Source: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Layer: () => null,
}));

vi.mock('maplibre-gl', () => ({ default: {} }));

const JFK: AirportPoint = { id: 'JFK', lat: 40.6413, lng: -73.7781, label: 'JFK', isOrigin: true };
const LHR: AirportPoint = { id: 'LHR', lat: 51.4700, lng: -0.4543, label: 'LHR', isDestination: true };

const PATH: FlightPath = {
  id: 'jfk-lhr',
  originId: 'JFK',
  destinationId: 'LHR',
  coordinates: [[-73.7781, 40.6413], [-0.4543, 51.4700]],
};

describe('FlightMap', () => {
  it('renders map container', () => {
    render(<FlightMap airports={[]} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('applies semantic root class', () => {
    const { container } = render(<FlightMap airports={[]} />);
    expect(container.firstElementChild).toHaveClass('travel-flight-map-container');
  });

  it('renders a marker for each airport', () => {
    render(<FlightMap airports={[JFK, LHR]} />);
    expect(screen.getAllByTestId('marker')).toHaveLength(2);
  });

  it('renders marker labels', () => {
    render(<FlightMap airports={[JFK, LHR]} />);
    expect(screen.getByText('JFK')).toBeInTheDocument();
    expect(screen.getByText('LHR')).toBeInTheDocument();
  });

  it('renders markers at correct coordinates', () => {
    render(<FlightMap airports={[JFK, LHR]} />);
    const markers = screen.getAllByTestId('marker');
    const lngs = markers.map(m => m.getAttribute('data-lng'));
    expect(lngs).toContain(String(JFK.lng));
    expect(lngs).toContain(String(LHR.lng));
  });

  it('applies origin marker class', () => {
    const { container } = render(<FlightMap airports={[JFK]} />);
    expect(container.querySelector('.travel-flight-map-marker--origin')).toBeInTheDocument();
  });

  it('applies destination marker class', () => {
    const { container } = render(<FlightMap airports={[LHR]} />);
    expect(container.querySelector('.travel-flight-map-marker--destination')).toBeInTheDocument();
  });

  it('applies stop marker class for intermediate airports', () => {
    const DUB: AirportPoint = { id: 'DUB', lat: 53.4264, lng: -6.2499, label: 'DUB' };
    const { container } = render(<FlightMap airports={[DUB]} />);
    expect(container.querySelector('.travel-flight-map-marker--stop')).toBeInTheDocument();
  });

  it('renders no markers when airports is empty', () => {
    render(<FlightMap airports={[]} />);
    expect(screen.queryAllByTestId('marker')).toHaveLength(0);
  });

  it('accepts paths prop without crashing', () => {
    render(<FlightMap airports={[JFK, LHR]} paths={[PATH]} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });
});

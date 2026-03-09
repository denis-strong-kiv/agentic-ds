import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlightDetails } from './index';
import type { FlightDetailsProps, FareOption } from './index';
import type { FlightLeg } from '../flight-card/index';

const LEG: FlightLeg = {
  duration: '7h 15m',
  stops: 0,
  segments: [
    {
      airline: 'British Airways',
      flightNumber: 'BA 178',
      origin: 'JFK',
      destination: 'LHR',
      departureTime: '10:00 PM',
      arrivalTime: '10:15 AM+1',
      duration: '7h 15m',
      class: 'Economy',
      aircraft: 'Boeing 777',
    },
  ],
};

const FARE: FareOption = {
  id: 'eco',
  name: 'Economy',
  fareClass: 'Y',
  price: '£420',
  features: ['1 carry-on', 'Seat selection'],
};

const BASE_PROPS: FlightDetailsProps = {
  title: 'New York → London',
  legs: [LEG],
  isOpen: true,
  onClose: vi.fn(),
};

describe('FlightDetails', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(<FlightDetails {...BASE_PROPS} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog with correct role and aria-label when open', () => {
    render(<FlightDetails {...BASE_PROPS} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Flight details: New York → London');
  });

  it('renders title', () => {
    render(<FlightDetails {...BASE_PROPS} />);
    expect(screen.getByText('New York → London')).toBeInTheDocument();
  });

  it('renders airline and flight number', () => {
    render(<FlightDetails {...BASE_PROPS} />);
    expect(screen.getByText('British Airways')).toBeInTheDocument();
    expect(screen.getByText('BA 178')).toBeInTheDocument();
  });

  it('renders segment origin and destination', () => {
    render(<FlightDetails {...BASE_PROPS} />);
    expect(screen.getByText('JFK')).toBeInTheDocument();
    expect(screen.getByText('LHR')).toBeInTheDocument();
  });

  it('renders aircraft type', () => {
    render(<FlightDetails {...BASE_PROPS} />);
    expect(screen.getByText(/Boeing 777/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<FlightDetails {...BASE_PROPS} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close flight details' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders share button when onShare is provided', () => {
    render(<FlightDetails {...BASE_PROPS} onShare={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Share this flight' })).toBeInTheDocument();
  });

  it('does not render share button when onShare is omitted', () => {
    render(<FlightDetails {...BASE_PROPS} />);
    expect(screen.queryByRole('button', { name: 'Share this flight' })).not.toBeInTheDocument();
  });

  it('renders nights between legs for round trips', () => {
    const returnLeg: FlightLeg = {
      duration: '8h 0m',
      stops: 0,
      segments: [
        {
          airline: 'British Airways',
          flightNumber: 'BA 179',
          origin: 'LHR',
          destination: 'JFK',
          departureTime: '11:00 AM',
          arrivalTime: '2:00 PM',
          duration: '8h 0m',
        },
      ],
    };
    render(<FlightDetails {...BASE_PROPS} legs={[LEG, returnLeg]} nightsBetween={7} />);
    expect(screen.getByText('7 nights')).toBeInTheDocument();
  });

  it('renders fare options section', () => {
    render(<FlightDetails {...BASE_PROPS} fareOptions={[FARE]} />);
    expect(screen.getByRole('region', { name: 'Booking options' })).toBeInTheDocument();
    expect(screen.getByText('£420')).toBeInTheDocument();
    // Fare name appears in the fare card (may also appear as segment class — use getAllBy)
    expect(screen.getAllByText('Economy').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onSelectFare when Select button is clicked', async () => {
    const onSelectFare = vi.fn();
    render(<FlightDetails {...BASE_PROPS} fareOptions={[FARE]} onSelectFare={onSelectFare} />);
    await userEvent.click(screen.getByRole('button', { name: 'Select' }));
    expect(onSelectFare).toHaveBeenCalledWith('eco');
  });

  it('renders Recommended badge on recommended fare', () => {
    const recommendedFare: FareOption = { ...FARE, id: 'flex', name: 'Flex', isRecommended: true };
    render(<FlightDetails {...BASE_PROPS} fareOptions={[recommendedFare]} />);
    expect(screen.getByText('Recommended')).toBeInTheDocument();
  });

  it('renders layover row between segments', () => {
    const multiSegmentLeg: FlightLeg = {
      duration: '12h 0m',
      stops: 1,
      segments: [
        {
          airline: 'British Airways',
          flightNumber: 'BA 200',
          origin: 'JFK',
          destination: 'DUB',
          departureTime: '9:00 PM',
          arrivalTime: '9:00 AM+1',
          duration: '6h',
        },
        {
          airline: 'British Airways',
          flightNumber: 'BA 201',
          origin: 'DUB',
          destination: 'LHR',
          departureTime: '11:00 AM',
          arrivalTime: '12:00 PM',
          duration: '1h',
        },
      ],
    };
    render(<FlightDetails {...BASE_PROPS} legs={[multiSegmentLeg]} />);
    expect(screen.getByRole('note')).toBeInTheDocument(); // layover row
  });
});

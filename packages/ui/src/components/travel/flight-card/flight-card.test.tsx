import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlightCard } from '../flight-card/index';
import type { FlightCardProps, FlightLeg } from '../flight-card/index';

const LEG: FlightLeg = {
  duration: '5h 30m',
  stops: 0,
  segments: [
    {
      airline: 'American Airlines',
      flightNumber: 'AA 100',
      origin: 'JFK',
      destination: 'LAX',
      departureTime: '08:00',
      arrivalTime: '11:30',
      duration: '5h 30m',
    },
  ],
};

const PROPS: FlightCardProps = {
  legs: [LEG],
  price: '$349',
  currency: 'USD',
};

describe('FlightCard', () => {
  it('applies semantic root class', () => {
    const { container } = render(<FlightCard {...PROPS} />);
    expect(container.firstElementChild).toHaveClass('travel-flight-card');
  });

  it('renders airline name', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('American Airlines')).toBeInTheDocument();
  });

  it('renders flight number', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('AA 100')).toBeInTheDocument();
  });

  it('renders departure and arrival times', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('11:30')).toBeInTheDocument();
  });

  it('renders origin and destination codes', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('JFK')).toBeInTheDocument();
    expect(screen.getByText('LAX')).toBeInTheDocument();
  });

  it('renders duration', () => {
    render(<FlightCard {...PROPS} />);
    // Duration appears on both the leg and segment — at least one instance
    expect(screen.getAllByText('5h 30m').length).toBeGreaterThan(0);
  });

  it('shows nonstop for 0 stops', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('nonstop')).toBeInTheDocument();
  });

  it('shows correct stop count for 1 stop', () => {
    render(<FlightCard {...PROPS} legs={[{ ...LEG, stops: 1 }]} />);
    expect(screen.getByText('1 stop')).toBeInTheDocument();
  });

  it('shows correct stop count for 2 stops', () => {
    render(<FlightCard {...PROPS} legs={[{ ...LEG, stops: 2 }]} />);
    expect(screen.getByText('2 stops')).toBeInTheDocument();
  });

  it('renders price', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('$349')).toBeInTheDocument();
  });

  it('renders Best value badge when isBestValue', () => {
    render(<FlightCard {...PROPS} isBestValue />);
    expect(screen.getByText('Best value')).toBeInTheDocument();
  });

  it('renders Cheapest badge when isCheapest (not best value)', () => {
    render(<FlightCard {...PROPS} isCheapest />);
    expect(screen.getByText('Cheapest')).toBeInTheDocument();
  });

  it('prefers Best value badge over Cheapest when both', () => {
    render(<FlightCard {...PROPS} isBestValue isCheapest />);
    expect(screen.getByText('Best value')).toBeInTheDocument();
    expect(screen.queryByText('Cheapest')).not.toBeInTheDocument();
  });

  it('renders Select button', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(<FlightCard {...PROPS} onSelect={onSelect} />);
    await user.click(container.firstElementChild as HTMLElement);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('renders airline initials when no logo', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('AM')).toBeInTheDocument();
  });

  it('does not render fare breakdown when no items', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.queryByText('Fare breakdown')).not.toBeInTheDocument();
  });

  it('renders multiple legs (round-trip)', () => {
    const returnLeg: FlightLeg = {
      duration: '6h 00m',
      stops: 0,
      segments: [
        {
          airline: 'American Airlines',
          flightNumber: 'AA 101',
          origin: 'LAX',
          destination: 'JFK',
          departureTime: '14:00',
          arrivalTime: '22:00',
          duration: '6h 00m',
        },
      ],
    };
    render(<FlightCard {...PROPS} legs={[LEG, returnLeg]} />);
    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
  });

  it('renders compact state via data attribute', () => {
    const { container } = render(<FlightCard {...PROPS} isCompact />);
    expect(container.firstElementChild).toHaveAttribute('data-compact', 'true');
  });

  it('renders selected state', () => {
    const { container } = render(<FlightCard {...PROPS} isSelected />);
    expect(container.firstElementChild).toHaveAttribute('data-selected', 'true');
    expect(container.firstElementChild).toHaveAttribute('aria-selected', 'true');
  });
});

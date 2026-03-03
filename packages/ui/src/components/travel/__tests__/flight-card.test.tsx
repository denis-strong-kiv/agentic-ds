import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlightCard } from '../flight-card.js';
import type { FlightCardProps, FlightSegment } from '../flight-card.js';

const SEGMENT: FlightSegment = {
  airline: 'American Airlines',
  flightNumber: 'AA 100',
  origin: 'JFK',
  destination: 'LAX',
  departureTime: '08:00',
  arrivalTime: '11:30',
  duration: '5h 30m',
  stops: 0,
};

const PROPS: FlightCardProps = {
  segment: SEGMENT,
  price: '$349',
  currency: 'USD',
};

describe('FlightCard', () => {
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
    expect(screen.getByText('5h 30m')).toBeInTheDocument();
  });

  it('shows Non-stop for 0 stops', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('Non-stop')).toBeInTheDocument();
  });

  it('shows correct stop count for 1 stop', () => {
    render(<FlightCard {...PROPS} segment={{ ...SEGMENT, stops: 1 }} />);
    expect(screen.getByText('1 stop')).toBeInTheDocument();
  });

  it('shows correct stop count for 2 stops', () => {
    render(<FlightCard {...PROPS} segment={{ ...SEGMENT, stops: 2 }} />);
    expect(screen.getByText('2 stops')).toBeInTheDocument();
  });

  it('renders price', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('$349')).toBeInTheDocument();
  });

  it('renders currency per person label', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByText('USD per person')).toBeInTheDocument();
  });

  it('renders Best Value badge when isBestValue', () => {
    render(<FlightCard {...PROPS} isBestValue />);
    expect(screen.getByText('Best Value')).toBeInTheDocument();
  });

  it('renders Cheapest badge when isCheapest (not best value)', () => {
    render(<FlightCard {...PROPS} isCheapest />);
    expect(screen.getByText('Cheapest')).toBeInTheDocument();
  });

  it('prefers Best Value badge over Cheapest when both', () => {
    render(<FlightCard {...PROPS} isBestValue isCheapest />);
    expect(screen.getByText('Best Value')).toBeInTheDocument();
    expect(screen.queryByText('Cheapest')).not.toBeInTheDocument();
  });

  it('renders fare class badge', () => {
    render(<FlightCard {...PROPS} fareClass="Economy" />);
    expect(screen.getByText('Economy')).toBeInTheDocument();
  });

  it('renders Select button', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
  });

  it('calls onSelect when Select is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<FlightCard {...PROPS} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: 'Select' }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('renders airline initials when no logo', () => {
    render(<FlightCard {...PROPS} />);
    // AA from "American Airlines"
    expect(screen.getByText('AM')).toBeInTheDocument();
  });

  it('does not render fare breakdown accordion when no items', () => {
    render(<FlightCard {...PROPS} />);
    expect(screen.queryByText('Fare breakdown')).not.toBeInTheDocument();
  });

  it('renders fare breakdown accordion when items provided', () => {
    render(
      <FlightCard
        {...PROPS}
        fareBreakdown={[
          { label: 'Base fare', amount: '$299' },
          { label: 'Taxes', amount: '$50', type: 'tax' },
          { label: 'Total', amount: '$349', type: 'total' },
        ]}
      />,
    );
    expect(screen.getByText('Fare breakdown')).toBeInTheDocument();
  });

  it('expands fare breakdown on click', async () => {
    const user = userEvent.setup();
    render(
      <FlightCard
        {...PROPS}
        fareBreakdown={[{ label: 'Base fare', amount: '$299' }]}
      />,
    );
    await user.click(screen.getByText('Fare breakdown'));
    expect(screen.getByText('Base fare')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();
  });
});

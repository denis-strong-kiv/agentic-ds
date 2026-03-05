import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarCard } from '../car-card.js';
import type { CarCardProps } from '../car-card.js';

const SPECS = {
  seats: 5,
  doors: 4,
  transmission: 'Automatic' as const,
  hasAC: true,
  luggageCapacity: 2,
};

const PROPS: CarCardProps = {
  name: 'Toyota Corolla',
  category: 'Economy',
  specs: SPECS,
  pickupLocation: 'JFK Airport',
  pricePerDay: '$45',
  providerName: 'Hertz',
};

const INSURANCE_OPTIONS = [
  { id: 'basic', label: 'Basic Cover', pricePerDay: '$8', description: 'Third party coverage' },
  { id: 'full', label: 'Full Cover', pricePerDay: '$18', description: 'Full comprehensive' },
];

describe('CarCard', () => {
  it('applies semantic root class', () => {
    const { container } = render(<CarCard {...PROPS} />);
    expect(container.firstElementChild).toHaveClass('travel-car-card');
  });

  it('renders car name', () => {
    render(<CarCard {...PROPS} />);
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<CarCard {...PROPS} />);
    expect(screen.getByText('Economy')).toBeInTheDocument();
  });

  it('renders vehicle specs', () => {
    render(<CarCard {...PROPS} />);
    expect(screen.getByText('5 seats')).toBeInTheDocument();
    expect(screen.getByText('4 doors')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
    expect(screen.getByText('A/C')).toBeInTheDocument();
    expect(screen.getByText('2 bags')).toBeInTheDocument();
  });

  it('uses singular bag for luggageCapacity of 1', () => {
    render(<CarCard {...PROPS} specs={{ ...SPECS, luggageCapacity: 1 }} />);
    expect(screen.getByText('1 bag')).toBeInTheDocument();
  });

  it('renders pickup location', () => {
    render(<CarCard {...PROPS} />);
    expect(screen.getByText('Pick-up: JFK Airport')).toBeInTheDocument();
  });

  it('renders dropoff when different from pickup', () => {
    render(<CarCard {...PROPS} dropoffLocation="LAX Airport" />);
    expect(screen.getByText('Drop-off: LAX Airport')).toBeInTheDocument();
  });

  it('does not render dropoff when same as pickup', () => {
    render(<CarCard {...PROPS} dropoffLocation="JFK Airport" />);
    expect(screen.queryByText(/drop-off/i)).not.toBeInTheDocument();
  });

  it('renders price per day', () => {
    render(<CarCard {...PROPS} />);
    expect(screen.getByText('$45')).toBeInTheDocument();
  });

  it('renders currency per day label', () => {
    render(<CarCard {...PROPS} />);
    expect(screen.getByText('USD per day')).toBeInTheDocument();
  });

  it('renders total price when provided', () => {
    render(<CarCard {...PROPS} totalPrice="$225" />);
    expect(screen.getByText('$225 total')).toBeInTheDocument();
  });

  it('renders provider name when no logo', () => {
    render(<CarCard {...PROPS} />);
    expect(screen.getByText('Hertz')).toBeInTheDocument();
  });

  it('renders Select Car button', () => {
    render(<CarCard {...PROPS} />);
    expect(screen.getByRole('button', { name: 'Select Car' })).toBeInTheDocument();
  });

  it('calls onSelect without insurance when no insurance selected', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CarCard {...PROPS} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: 'Select Car' }));
    expect(onSelect).toHaveBeenCalledWith(undefined);
  });

  it('renders insurance options', () => {
    render(<CarCard {...PROPS} insuranceOptions={INSURANCE_OPTIONS} />);
    expect(screen.getByText(/Basic Cover/)).toBeInTheDocument();
    expect(screen.getByText(/Full Cover/)).toBeInTheDocument();
  });

  it('selects insurance option via switch', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CarCard {...PROPS} insuranceOptions={INSURANCE_OPTIONS} onSelect={onSelect} />);
    // Toggle basic insurance on
    const basicSwitch = screen.getAllByRole('switch')[0];
    await user.click(basicSwitch);
    // Now select car
    await user.click(screen.getByRole('button', { name: 'Select Car' }));
    expect(onSelect).toHaveBeenCalledWith('basic');
  });

  it('does not show AC when hasAC is false', () => {
    render(<CarCard {...PROPS} specs={{ ...SPECS, hasAC: false }} />);
    expect(screen.queryByText('A/C')).not.toBeInTheDocument();
  });
});

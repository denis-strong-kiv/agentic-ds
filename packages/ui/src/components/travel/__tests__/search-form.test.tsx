import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TravelSearchForm } from '../search-form.js';
import type { TravelSearchPayload } from '../search-form.js';

const AIRPORTS = [
  { iata: 'JFK', city: 'New York', country: 'United States' },
  { iata: 'LHR', city: 'London', country: 'United Kingdom' },
  { iata: 'DXB', city: 'Dubai', country: 'United Arab Emirates' },
];

describe('TravelSearchForm', () => {
  // ── Tab bar ──────────────────────────────────────────────────────────────

  it('renders Flights and Hotels tabs', () => {
    render(<TravelSearchForm />);
    expect(screen.getByRole('tab', { name: /flights/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /hotels/i })).toBeInTheDocument();
  });

  it('defaults to flights tab', () => {
    render(<TravelSearchForm />);
    expect(screen.getByRole('tab', { name: /flights/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('respects defaultTab prop', () => {
    render(<TravelSearchForm defaultTab="hotels" />);
    expect(screen.getByRole('tab', { name: /hotels/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches to hotels tab on click', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm />);
    await user.click(screen.getByRole('tab', { name: /hotels/i }));
    expect(screen.getByRole('tab', { name: /hotels/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByPlaceholderText('Where to?')).toBeInTheDocument();
  });

  // ── Trip type ────────────────────────────────────────────────────────────

  it('shows trip type radios on flights tab', () => {
    render(<TravelSearchForm />);
    expect(screen.getByRole('radio', { name: /round-trip/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /one-way/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /multi-city/i })).toBeInTheDocument();
  });

  it('round-trip is selected by default', () => {
    render(<TravelSearchForm />);
    expect(screen.getByRole('radio', { name: /round-trip/i })).toBeChecked();
  });

  it('switches trip type to one-way', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm />);
    await user.click(screen.getByRole('radio', { name: /one-way/i }));
    expect(screen.getByRole('radio', { name: /one-way/i })).toBeChecked();
  });

  it('switches trip type to multi-city', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm />);
    await user.click(screen.getByRole('radio', { name: /multi-city/i }));
    expect(screen.getByRole('radio', { name: /multi-city/i })).toBeChecked();
  });

  // ── Airport field ────────────────────────────────────────────────────────

  it('opens airport dropdown on click', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm airportOptions={AIRPORTS} />);
    await user.click(screen.getByRole('button', { name: /^From$/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('filters airports by city name', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm airportOptions={AIRPORTS} />);
    await user.click(screen.getByRole('button', { name: /^From$/i }));
    await user.type(screen.getByRole('combobox'), 'London');
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.queryByText('New York')).not.toBeInTheDocument();
  });

  it('selects airport from dropdown', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm airportOptions={AIRPORTS} />);
    await user.click(screen.getByRole('button', { name: /^From$/i }));
    await user.click(screen.getByRole('option', { name: /new york/i }));
    // Button label should now mention selected airport
    expect(screen.getByRole('button', { name: /New York JFK/i })).toBeInTheDocument();
  });

  // ── Swap button ──────────────────────────────────────────────────────────

  it('renders swap origin/destination button', () => {
    render(<TravelSearchForm />);
    expect(screen.getByRole('button', { name: /swap origin and destination/i })).toBeInTheDocument();
  });

  // ── Passenger selector ───────────────────────────────────────────────────

  it('shows passenger field with default label', () => {
    render(<TravelSearchForm />);
    expect(screen.getByRole('button', { name: /1, Economy/i })).toBeInTheDocument();
  });

  it('opens passenger popover', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm />);
    await user.click(screen.getByRole('button', { name: /1, Economy/i }));
    expect(screen.getByText('Adults')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
    expect(screen.getByText('Infants')).toBeInTheDocument();
  });

  it('increments adult count', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm />);
    await user.click(screen.getByRole('button', { name: /1, Economy/i }));
    await user.click(screen.getByRole('button', { name: /increase adults/i }));
    expect(screen.getByRole('button', { name: /2, Economy/i })).toBeInTheDocument();
  });

  it('decrease children is disabled at zero', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm />);
    await user.click(screen.getByRole('button', { name: /1, Economy/i }));
    expect(screen.getByRole('button', { name: /decrease children/i })).toBeDisabled();
  });

  it('closes passenger popover on Done', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm />);
    await user.click(screen.getByRole('button', { name: /1, Economy/i }));
    expect(screen.getByText('Adults')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Done$/i }));
    expect(screen.queryByText('Cabin class')).not.toBeInTheDocument();
  });

  // ── Hotels occupancy ─────────────────────────────────────────────────────

  it('shows occupancy field on hotels tab', async () => {
    render(<TravelSearchForm defaultTab="hotels" />);
    expect(screen.getByRole('button', { name: /2 Guests, 1 Room/i })).toBeInTheDocument();
  });

  it('opens occupancy popover on hotels tab', async () => {
    const user = userEvent.setup();
    render(<TravelSearchForm defaultTab="hotels" />);
    await user.click(screen.getByRole('button', { name: /2 Guests, 1 Room/i }));
    expect(screen.getByText('Rooms')).toBeInTheDocument();
  });

  // ── Search callback ──────────────────────────────────────────────────────

  it('calls onSearch with flights payload', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn<(p: TravelSearchPayload) => void>();
    render(<TravelSearchForm onSearch={onSearch} />);
    await user.click(screen.getByRole('button', { name: /^Search$/i }));
    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch.mock.calls[0][0].tab).toBe('flights');
  });

  it('calls onSearch with hotels payload', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn<(p: TravelSearchPayload) => void>();
    render(<TravelSearchForm defaultTab="hotels" onSearch={onSearch} />);
    await user.click(screen.getByRole('button', { name: /^Search$/i }));
    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch.mock.calls[0][0].tab).toBe('hotels');
  });

  it('flight payload contains round-trip by default', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn<(p: TravelSearchPayload) => void>();
    render(<TravelSearchForm onSearch={onSearch} />);
    await user.click(screen.getByRole('button', { name: /^Search$/i }));
    const payload = onSearch.mock.calls[0][0];
    expect(payload.tab).toBe('flights');
    if (payload.tab === 'flights') {
      expect(payload.tripType).toBe('round-trip');
    }
  });

  it('flight payload has one-way tripType when one-way is selected', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn<(p: TravelSearchPayload) => void>();
    render(<TravelSearchForm onSearch={onSearch} />);
    await user.click(screen.getByRole('radio', { name: /one-way/i }));
    await user.click(screen.getByRole('button', { name: /^Search$/i }));
    const payload = onSearch.mock.calls[0][0];
    if (payload.tab === 'flights') {
      expect(payload.tripType).toBe('one-way');
      expect(payload.returnDate).toBeNull();
    }
  });
});

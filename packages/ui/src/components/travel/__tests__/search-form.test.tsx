import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '../search-form.js';
import type { SearchPayload } from '../search-form.js';


describe('SearchForm', () => {
  it('renders all vertical tabs', () => {
    render(<SearchForm />);
    expect(screen.getByRole('tab', { name: /flights/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /hotels/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /cars/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /activities/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /packages/i })).toBeInTheDocument();
  });

  it('defaults to flights tab', () => {
    render(<SearchForm />);
    expect(screen.getByRole('tab', { name: /flights/i })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('Search Flights')).toBeInTheDocument();
  });

  it('switches to hotels tab', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    await user.click(screen.getByRole('tab', { name: /hotels/i }));
    expect(screen.getByText('Search Hotels')).toBeInTheDocument();
  });

  it('switches to cars tab', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    await user.click(screen.getByRole('tab', { name: /cars/i }));
    expect(screen.getByText('Search Cars')).toBeInTheDocument();
  });

  it('switches to activities tab', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    await user.click(screen.getByRole('tab', { name: /activities/i }));
    expect(screen.getByText('Search Activities')).toBeInTheDocument();
  });

  it('shows packages coming soon message', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    await user.click(screen.getByRole('tab', { name: /packages/i }));
    expect(screen.getByText(/Package search coming soon/i)).toBeInTheDocument();
  });

  it('renders trip type toggles on flights tab', () => {
    render(<SearchForm />);
    expect(screen.getByText('round trip')).toBeInTheDocument();
    expect(screen.getByText('one way')).toBeInTheDocument();
    expect(screen.getByText('multi city')).toBeInTheDocument();
  });

  it('changes trip type on click', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    const oneWayBtn = screen.getByText('one way');
    await user.click(oneWayBtn);
    // Button should have primary styling class applied
    expect(oneWayBtn).toHaveClass('bg-[var(--color-primary-default)]');
  });

  it('opens passenger selector popover', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    const passengerBtn = screen.getByRole('button', { name: /passenger/i });
    await user.click(passengerBtn);
    expect(screen.getByRole('dialog', { name: /passenger selection/i })).toBeInTheDocument();
  });

  it('increments adult count in passenger selector', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    // Open passenger popover
    await user.click(screen.getByRole('button', { name: /passenger/i }));
    // Increase adults
    await user.click(screen.getByRole('button', { name: /increase adults/i }));
    // The label should update
    expect(screen.getByRole('button', { name: /passenger/i })).toHaveTextContent('2 Passengers');
  });

  it('decrements child count (at min, stays 0)', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    await user.click(screen.getByRole('button', { name: /passenger/i }));
    const decreaseChildren = screen.getByRole('button', { name: /decrease children/i });
    // Already at 0, should be disabled
    expect(decreaseChildren).toBeDisabled();
  });

  it('closes passenger popover via Done', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    await user.click(screen.getByRole('button', { name: /passenger/i }));
    expect(screen.getByRole('dialog', { name: /passenger selection/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog', { name: /passenger selection/i })).not.toBeInTheDocument();
  });

  it('calls onSearch with flight payload', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn<(payload: SearchPayload) => void>();
    render(<SearchForm onSearch={handleSearch} />);
    await user.click(screen.getByText('Search Flights'));
    expect(handleSearch).toHaveBeenCalledOnce();
    const payload = handleSearch.mock.calls[0][0] as SearchPayload;
    expect(payload.vertical).toBe('flights');
  });

  it('calls onSearch with hotels payload', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn<(payload: SearchPayload) => void>();
    render(<SearchForm onSearch={handleSearch} />);
    await user.click(screen.getByRole('tab', { name: /hotels/i }));
    await user.click(screen.getByText('Search Hotels'));
    expect(handleSearch).toHaveBeenCalledOnce();
    const payload = handleSearch.mock.calls[0][0] as SearchPayload;
    expect(payload.vertical).toBe('hotels');
  });

  it('calls onSearch with cars payload', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn<(payload: SearchPayload) => void>();
    render(<SearchForm onSearch={handleSearch} />);
    await user.click(screen.getByRole('tab', { name: /cars/i }));
    await user.click(screen.getByText('Search Cars'));
    expect(handleSearch).toHaveBeenCalledOnce();
    const payload = handleSearch.mock.calls[0][0] as SearchPayload;
    expect(payload.vertical).toBe('cars');
  });

  it('respects defaultVertical prop', () => {
    render(<SearchForm defaultVertical="hotels" />);
    expect(screen.getByText('Search Hotels')).toBeInTheDocument();
  });
});

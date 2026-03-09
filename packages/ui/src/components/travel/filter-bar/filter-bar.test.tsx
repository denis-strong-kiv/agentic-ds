import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './index';
import type { FilterBarProps, FilterState } from './index';

const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 2000],
  stops: [],
  airlines: [],
  alliances: [],
  departureRange: [0, 24],
  arrivalRange: [0, 24],
};

const BASE_PROPS: FilterBarProps = {
  filters: DEFAULT_FILTERS,
  onChange: vi.fn(),
  sidebarOpen: false,
  onToggleSidebar: vi.fn(),
};

describe('FilterBar', () => {
  it('renders nav with label "Filter options"', () => {
    render(<FilterBar {...BASE_PROPS} />);
    expect(screen.getByRole('navigation', { name: 'Filter options' })).toBeInTheDocument();
  });

  it('renders "All filters" chip', () => {
    render(<FilterBar {...BASE_PROPS} />);
    expect(screen.getByText('All filters')).toBeInTheDocument();
  });

  it('calls onToggleSidebar when All filters chip is clicked', async () => {
    const onToggleSidebar = vi.fn();
    render(<FilterBar {...BASE_PROPS} onToggleSidebar={onToggleSidebar} />);
    await userEvent.click(screen.getByRole('button', { name: /all filters/i }));
    expect(onToggleSidebar).toHaveBeenCalledOnce();
  });

  it('reflects sidebarOpen on All filters chip via aria-pressed', () => {
    const { rerender } = render(<FilterBar {...BASE_PROPS} sidebarOpen={false} />);
    expect(screen.getByRole('button', { name: /all filters/i })).toHaveAttribute('aria-pressed', 'false');
    rerender(<FilterBar {...BASE_PROPS} sidebarOpen />);
    expect(screen.getByRole('button', { name: /all filters/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders "Nonstop only" quick filter chip', () => {
    render(<FilterBar {...BASE_PROPS} />);
    expect(screen.getByText('Nonstop only')).toBeInTheDocument();
  });

  it('renders Price, Stops, and placeholder chips', () => {
    render(<FilterBar {...BASE_PROPS} />);
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Stops')).toBeInTheDocument();
    expect(screen.getByText('Bags')).toBeInTheDocument();
  });

  it('calls onChange with nonstop stop when Nonstop only is clicked', async () => {
    const onChange = vi.fn();
    render(<FilterBar {...BASE_PROPS} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /nonstop only/i }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ stops: ['nonstop'] }),
    );
  });

  it('hides Stops chip when nonstop-only filter is active', () => {
    render(
      <FilterBar
        {...BASE_PROPS}
        filters={{ ...DEFAULT_FILTERS, stops: ['nonstop'] }}
      />,
    );
    // Stops chip should not appear — nonstop QuickFilter covers it
    expect(screen.queryByText('Stops')).not.toBeInTheDocument();
  });

  it('renders Airlines chip when airlineOptions are provided', () => {
    render(
      <FilterBar
        {...BASE_PROPS}
        airlineOptions={[{ value: 'BA', label: 'British Airways' }]}
      />,
    );
    expect(screen.getByText('Airlines')).toBeInTheDocument();
  });

  it('does not render Airlines chip when airlineOptions is empty', () => {
    render(<FilterBar {...BASE_PROPS} airlineOptions={[]} />);
    expect(screen.queryByText('Airlines')).not.toBeInTheDocument();
  });

  it('shows active count on All filters chip when filters are set', () => {
    render(
      <FilterBar
        {...BASE_PROPS}
        filters={{ ...DEFAULT_FILTERS, priceRange: [0, 500], stops: ['nonstop'] }}
      />,
    );
    expect(screen.getByLabelText('2 active filters')).toBeInTheDocument();
  });

  it('shows active price label on Price chip when price filter is set', () => {
    render(
      <FilterBar
        {...BASE_PROPS}
        filters={{ ...DEFAULT_FILTERS, priceRange: [0, 500] }}
        maxPrice={2000}
      />,
    );
    expect(screen.getByText('Up to $500')).toBeInTheDocument();
  });
});

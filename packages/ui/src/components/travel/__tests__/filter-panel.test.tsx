import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterPanel, createDefaultFilters } from '../filter-panel/index';
import type { FilterState } from '../filter-panel/index';

const PROVIDERS = [
  { value: 'AA', label: 'American Airlines' },
  { value: 'UA', label: 'United Airlines' },
  { value: 'DL', label: 'Delta' },
];

function makeFilters(overrides: Partial<FilterState> = {}): FilterState {
  return { ...createDefaultFilters(2000), ...overrides };
}

describe('FilterPanel', () => {
  it('applies semantic root class', () => {
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} />);
    expect(screen.getByLabelText('Search filters')).toHaveClass('travel-filter-panel');
  });

  it('renders Filters heading', () => {
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('does not show badge or clear button when no active filters', () => {
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} />);
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('shows badge and Clear all when stops filter is active', () => {
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters({ stops: ['nonstop'] })} onChange={onChange} />);
    expect(screen.getByText('Clear all')).toBeInTheDocument();
    // Badge count should be 1
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls onClearAll when Clear all is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClearAll = vi.fn();
    render(
      <FilterPanel
        filters={makeFilters({ stops: ['nonstop'] })}
        onChange={onChange}
        onClearAll={onClearAll}
      />,
    );
    await user.click(screen.getByText('Clear all'));
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it('renders Price accordion trigger', () => {
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} />);
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('renders Stops section for flights mode', () => {
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} mode="flights" />);
    expect(screen.getByText('Stops')).toBeInTheDocument();
  });

  it('does not render Stops section for hotels mode', () => {
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} mode="hotels" />);
    expect(screen.queryByText('Stops')).not.toBeInTheDocument();
  });

  it('toggles nonstop checkbox', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} mode="flights" />);
    // Stops section is open by default (defaultValue includes 'stops')
    const nonstopCheckbox = screen.getByRole('checkbox', { name: /non-stop/i });
    await user.click(nonstopCheckbox);
    expect(onChange).toHaveBeenCalledOnce();
    const newFilters = onChange.mock.calls[0][0] as FilterState;
    expect(newFilters.stops).toContain('nonstop');
  });

  it('toggles nonstop off when already checked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterPanel
        filters={makeFilters({ stops: ['nonstop'] })}
        onChange={onChange}
        mode="flights"
      />,
    );
    const nonstopCheckbox = screen.getByRole('checkbox', { name: /non-stop/i });
    await user.click(nonstopCheckbox);
    const newFilters = onChange.mock.calls[0][0] as FilterState;
    expect(newFilters.stops).not.toContain('nonstop');
  });

  it('renders provider checkboxes when options provided', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterPanel
        filters={makeFilters()}
        onChange={onChange}
        providerOptions={PROVIDERS}
        mode="flights"
      />,
    );
    // Expand Airlines section
    const airlinesBtn = screen.getByRole('button', { name: /airlines/i });
    await user.click(airlinesBtn);
    expect(screen.getByLabelText('American Airlines')).toBeInTheDocument();
    expect(screen.getByLabelText('United Airlines')).toBeInTheDocument();
  });

  it('toggles airline checkbox', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterPanel
        filters={makeFilters()}
        onChange={onChange}
        providerOptions={PROVIDERS}
        mode="flights"
      />,
    );
    const airlinesBtn = screen.getByRole('button', { name: /airlines/i });
    await user.click(airlinesBtn);
    await user.click(screen.getByLabelText('American Airlines'));
    const newFilters = onChange.mock.calls[0][0] as FilterState;
    expect(newFilters.airlines).toContain('AA');
  });

  it('renders star rating buttons in hotels mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} mode="hotels" />);
    // Expand Star Rating section
    const starBtn = screen.getByRole('button', { name: /star rating/i });
    await user.click(starBtn);
    expect(screen.getByRole('button', { name: '5 stars' })).toBeInTheDocument();
  });

  it('toggles star rating', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} mode="hotels" />);
    const starBtn = screen.getByRole('button', { name: /star rating/i });
    await user.click(starBtn);
    await user.click(screen.getByRole('button', { name: '4 stars' }));
    const newFilters = onChange.mock.calls[0][0] as FilterState;
    expect(newFilters.starRatings).toContain(4);
  });

  it('renders Departure Time slider for flights', () => {
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} mode="flights" />);
    expect(screen.getByText('Departure Time')).toBeInTheDocument();
  });

  it('does not render Departure Time for hotels', () => {
    const onChange = vi.fn();
    render(<FilterPanel filters={makeFilters()} onChange={onChange} mode="hotels" />);
    expect(screen.queryByText('Departure Time')).not.toBeInTheDocument();
  });

  it('createDefaultFilters returns correct defaults', () => {
    const defaults = createDefaultFilters(1500);
    expect(defaults.priceRange).toEqual([0, 1500]);
    expect(defaults.stops).toEqual([]);
    expect(defaults.airlines).toEqual([]);
    expect(defaults.departureRange).toEqual([0, 24]);
    expect(defaults.arrivalRange).toEqual([0, 24]);
    expect(defaults.amenities).toEqual([]);
    expect(defaults.starRatings).toEqual([]);
  });
});

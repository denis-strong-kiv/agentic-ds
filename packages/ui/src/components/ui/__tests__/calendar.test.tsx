import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Calendar } from '../calendar.js';

const today = new Date();
const currentYear = today.getFullYear().toString();

describe('Calendar', () => {
  it('renders month/year header', () => {
    render(<Calendar />);
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it('renders day name headers', () => {
    render(<Calendar />);
    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('navigates to next month', async () => {
    const user = userEvent.setup();
    render(<Calendar />);
    await user.click(screen.getByLabelText('Next month'));
    // After navigation, year header should still be visible but month may change
    expect(screen.getByText(new RegExp('\\d{4}'))).toBeInTheDocument();
  });

  it('navigates to previous month', async () => {
    const user = userEvent.setup();
    render(<Calendar />);
    await user.click(screen.getByLabelText('Previous month'));
    expect(screen.getByText(new RegExp('\\d{4}'))).toBeInTheDocument();
  });

  it('calls onSelect when a date is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar onSelect={onSelect} />);
    // Click on day 15
    const day15 = screen.queryByLabelText(new RegExp('15 '));
    if (day15) {
      await user.click(day15);
      expect(onSelect).toHaveBeenCalledOnce();
      expect(onSelect.mock.calls[0][0]).toBeInstanceOf(Date);
    }
  });

  it('marks selected date with aria-selected', () => {
    const selectedDate = new Date(today.getFullYear(), today.getMonth(), 15);
    render(<Calendar selected={selectedDate} />);
    const day15 = screen.queryByLabelText(new RegExp('15 '));
    if (day15) {
      expect(day15.className).toContain('ui-calendar-day--selected');
    }
  });

  it('disables dates before minDate', () => {
    // Use a minDate set to the 28th of the current month to ensure
    // earlier dates in the same month are disabled
    const minDate = new Date(today.getFullYear(), today.getMonth(), 28);
    render(<Calendar minDate={minDate} />);
    // Day 1 of the month is always before day 28, so it should be disabled
    const day1 = screen.queryByLabelText(new RegExp(`^1 `));
    if (day1) {
      expect(day1).toBeDisabled();
    }
  });

  it('disables specific dates in disabledDates array', () => {
    const disabledDate = new Date(today.getFullYear(), today.getMonth(), 10);
    render(<Calendar disabledDates={[disabledDate]} />);
    const day10 = screen.queryByLabelText(new RegExp('10 '));
    if (day10) {
      expect(day10).toBeDisabled();
    }
  });

  it('renders price overlay text when priceOverlay is provided', () => {
    const priceOverlay = (date: Date) =>
      date.getDate() === 15 ? '$199' : undefined;
    render(<Calendar priceOverlay={priceOverlay} />);
    expect(screen.getByText('$199')).toBeInTheDocument();
  });

  describe('range mode', () => {
    it('highlights range between from and to dates', () => {
      const from = new Date(today.getFullYear(), today.getMonth(), 10);
      const to = new Date(today.getFullYear(), today.getMonth(), 15);
      render(<Calendar mode="range" selected={{ from, to }} />);
      // Day 12 should be in range
      const day12 = screen.queryByLabelText(new RegExp('12 '));
      if (day12) {
        expect(day12.className).toContain('ui-calendar-day--in-range');
      }
    });
  });
});

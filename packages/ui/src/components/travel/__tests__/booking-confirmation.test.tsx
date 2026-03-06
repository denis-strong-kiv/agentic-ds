import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingConfirmation } from '../booking-confirmation/index';

const SEGMENTS = [
  {
    type: 'flight' as const,
    title: 'NYC → LHR',
    subtitle: 'AA 100',
    date: '2026-03-10',
    details: [
      { label: 'Seat', value: '12A' },
      { label: 'Class', value: 'Business' },
    ],
  },
];

describe('BookingConfirmation', () => {
  it('applies semantic root class', () => {
    const { container } = render(
      <BookingConfirmation
        confirmationNumber="ABC12345"
        bookingDate="Mar 5, 2026"
        segments={SEGMENTS}
        totalAmount="$1,299"
      />,
    );

    expect(container.firstElementChild).toHaveClass('travel-booking-card');
  });

  it('renders confirmation number and itinerary', () => {
    render(
      <BookingConfirmation
        confirmationNumber="ABC12345"
        bookingDate="Mar 5, 2026"
        segments={SEGMENTS}
        totalAmount="$1,299"
      />,
    );

    expect(screen.getAllByText('ABC12345').length).toBeGreaterThan(0);
    expect(screen.getByText('Your Itinerary')).toBeInTheDocument();
    expect(screen.getByText('NYC → LHR')).toBeInTheDocument();
  });

  it('calls action handlers', async () => {
    const user = userEvent.setup();
    const onAddToCalendar = vi.fn();
    const onShareItinerary = vi.fn();
    const onPrint = vi.fn();

    render(
      <BookingConfirmation
        confirmationNumber="ABC12345"
        bookingDate="Mar 5, 2026"
        segments={SEGMENTS}
        totalAmount="$1,299"
        onAddToCalendar={onAddToCalendar}
        onShareItinerary={onShareItinerary}
        onPrint={onPrint}
      />,
    );

    await user.click(screen.getByRole('button', { name: /add to calendar/i }));
    await user.click(screen.getByRole('button', { name: /share itinerary/i }));
    await user.click(screen.getByRole('button', { name: /print/i }));

    expect(onAddToCalendar).toHaveBeenCalledOnce();
    expect(onShareItinerary).toHaveBeenCalledOnce();
    expect(onPrint).toHaveBeenCalledOnce();
  });
});

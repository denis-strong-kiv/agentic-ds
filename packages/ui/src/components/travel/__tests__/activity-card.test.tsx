import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActivityCard } from '../activity-card/index.js';
import type { ActivityCardProps } from '../activity-card/index.js';

const PROPS: ActivityCardProps = {
  title: 'Eiffel Tower Skip-the-Line Tour',
  category: 'Tour',
  duration: '3 hours',
  pricePerPerson: '$79',
};

describe('ActivityCard', () => {
  it('applies semantic root class', () => {
    const { container } = render(<ActivityCard {...PROPS} />);
    expect(container.firstElementChild).toHaveClass('travel-activity-card');
  });

  it('renders title', () => {
    render(<ActivityCard {...PROPS} />);
    expect(screen.getByText('Eiffel Tower Skip-the-Line Tour')).toBeInTheDocument();
  });

  it('renders category overlay badge', () => {
    render(<ActivityCard {...PROPS} />);
    expect(screen.getByText('Tour')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ActivityCard {...PROPS} description="Visit the iconic Eiffel Tower." />);
    expect(screen.getByText('Visit the iconic Eiffel Tower.')).toBeInTheDocument();
  });

  it('renders duration badge', () => {
    render(<ActivityCard {...PROPS} />);
    expect(screen.getByText(/3 hours/)).toBeInTheDocument();
  });

  it('renders difficulty badge when provided', () => {
    render(<ActivityCard {...PROPS} difficulty="Easy" />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('does not render difficulty badge when not provided', () => {
    render(<ActivityCard {...PROPS} />);
    // Duration badge exists but no difficulty
    expect(screen.queryByText(/moderate|easy|challenging|expert/i)).not.toBeInTheDocument();
  });

  it('renders rating stars and score', () => {
    render(<ActivityCard {...PROPS} ratingScore={4.5} reviewCount={200} />);
    expect(screen.getByLabelText('4.5 out of 5')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText(/200 reviews/)).toBeInTheDocument();
  });

  it('does not render rating section when not provided', () => {
    render(<ActivityCard {...PROPS} />);
    expect(screen.queryByLabelText(/out of 5/)).not.toBeInTheDocument();
  });

  it('renders Instant Confirmation badge when instantConfirmation is true', () => {
    render(<ActivityCard {...PROPS} instantConfirmation />);
    expect(screen.getByText(/Instant Confirmation/)).toBeInTheDocument();
  });

  it('renders Free Cancellation badge when freeCancellation is true', () => {
    render(<ActivityCard {...PROPS} freeCancellation />);
    expect(screen.getByText(/Free Cancellation/)).toBeInTheDocument();
  });

  it('does not render confirmation badges when false', () => {
    render(<ActivityCard {...PROPS} />);
    expect(screen.queryByText(/Instant Confirmation/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Free Cancellation/)).not.toBeInTheDocument();
  });

  it('renders available dates when provided', () => {
    render(
      <ActivityCard
        {...PROPS}
        availableDates={{ earliest: 'Apr 1, 2026', count: 12 }}
      />,
    );
    expect(screen.getByText(/Available from Apr 1, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/12 dates/)).toBeInTheDocument();
  });

  it('renders price per person', () => {
    render(<ActivityCard {...PROPS} />);
    expect(screen.getByText('$79')).toBeInTheDocument();
  });

  it('renders currency per person label', () => {
    render(<ActivityCard {...PROPS} currency="EUR" />);
    expect(screen.getByText('EUR per person')).toBeInTheDocument();
  });

  it('renders Book Now button', () => {
    render(<ActivityCard {...PROPS} />);
    expect(screen.getByRole('button', { name: 'Book Now' })).toBeInTheDocument();
  });

  it('calls onBook when Book Now is clicked', async () => {
    const user = userEvent.setup();
    const onBook = vi.fn();
    render(<ActivityCard {...PROPS} onBook={onBook} />);
    await user.click(screen.getByRole('button', { name: 'Book Now' }));
    expect(onBook).toHaveBeenCalledOnce();
  });

  it('renders image when imageUrl is provided', () => {
    render(<ActivityCard {...PROPS} imageUrl="/eiffel.jpg" />);
    const img = screen.getByAltText('Eiffel Tower Skip-the-Line Tour');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/eiffel.jpg');
  });
});

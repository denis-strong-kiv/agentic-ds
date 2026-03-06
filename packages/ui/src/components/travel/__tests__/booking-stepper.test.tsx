import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingStepper, createBookingSteps } from '../booking-stepper/index.js';
import type { BookingStep } from '../booking-stepper/index.js';

function makeSteps(): BookingStep[] {
  return [
    { id: 'search', label: 'Search', status: 'completed' },
    { id: 'select', label: 'Select', status: 'active' },
    { id: 'payment', label: 'Payment', status: 'upcoming' },
  ];
}

describe('BookingStepper', () => {
  it('applies semantic root class', () => {
    render(<BookingStepper steps={makeSteps()} />);
    expect(screen.getByRole('navigation', { name: 'Booking progress' })).toHaveClass('travel-booking-stepper');
  });

  it('renders all step labels', () => {
    render(<BookingStepper steps={makeSteps()} />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Select')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
  });

  it('marks nav with aria-label', () => {
    render(<BookingStepper steps={makeSteps()} />);
    expect(screen.getByRole('navigation', { name: 'Booking progress' })).toBeInTheDocument();
  });

  it('marks active step with aria-current="step"', () => {
    render(<BookingStepper steps={makeSteps()} />);
    const activeBtn = screen.getByRole('button', { name: /select \(current\)/i });
    expect(activeBtn).toHaveAttribute('aria-current', 'step');
  });

  it('marks completed step with (completed) in label', () => {
    render(<BookingStepper steps={makeSteps()} />);
    expect(screen.getByRole('button', { name: /search \(completed\)/i })).toBeInTheDocument();
  });

  it('disables upcoming step button', () => {
    render(<BookingStepper steps={makeSteps()} />);
    expect(screen.getByRole('button', { name: /payment/i })).toBeDisabled();
  });

  it('calls onStepClick for completed step', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<BookingStepper steps={makeSteps()} onStepClick={onStepClick} />);
    await user.click(screen.getByRole('button', { name: /search \(completed\)/i }));
    expect(onStepClick).toHaveBeenCalledWith('search');
  });

  it('does not call onStepClick for active step', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<BookingStepper steps={makeSteps()} onStepClick={onStepClick} />);
    // Active step has no onClick handler (only completed do)
    await user.click(screen.getByRole('button', { name: /select \(current\)/i }));
    expect(onStepClick).not.toHaveBeenCalled();
  });

  it('renders an ordered list', () => {
    render(<BookingStepper steps={makeSteps()} />);
    expect(document.querySelector('ol')).toBeInTheDocument();
  });
});

describe('createBookingSteps', () => {
  it('creates 6 steps', () => {
    const steps = createBookingSteps(0);
    expect(steps).toHaveLength(6);
  });

  it('sets first step as active when activeStepIndex is 0', () => {
    const steps = createBookingSteps(0);
    expect(steps[0].status).toBe('active');
    expect(steps[1].status).toBe('upcoming');
  });

  it('sets correct completed, active, upcoming statuses', () => {
    const steps = createBookingSteps(2);
    expect(steps[0].status).toBe('completed');
    expect(steps[1].status).toBe('completed');
    expect(steps[2].status).toBe('active');
    expect(steps[3].status).toBe('upcoming');
  });

  it('has expected step IDs', () => {
    const steps = createBookingSteps(0);
    const ids = steps.map(s => s.id);
    expect(ids).toEqual(['search', 'select', 'customize', 'passengers', 'payment', 'confirmation']);
  });
});

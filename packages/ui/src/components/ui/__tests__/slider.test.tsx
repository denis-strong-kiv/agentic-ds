import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Slider } from '../slider/index';

describe('Slider', () => {
  it('renders a slider', () => {
    render(<Slider defaultValue={[50]} min={0} max={100} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('sets aria-valuenow on the thumb', () => {
    render(<Slider defaultValue={[50]} min={0} max={100} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50');
  });

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<Slider defaultValue={[30]} min={10} max={90} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '90');
  });

  it('marks thumb as disabled when disabled prop is true', () => {
    render(<Slider defaultValue={[50]} disabled />);
    // Radix Slider uses data-disabled on the span thumb (not HTML disabled attribute)
    expect(screen.getByRole('slider')).toHaveAttribute('data-disabled');
  });

  describe('showValue', () => {
    it('shows value labels when showValue is true', () => {
      render(<Slider defaultValue={[42]} showValue />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('formats value with formatValue function', () => {
      render(
        <Slider
          defaultValue={[200]}
          showValue
          formatValue={(v) => `$${v}`}
        />
      );
      expect(screen.getByText('$200')).toBeInTheDocument();
    });

    it('does not show value labels when showValue is false', () => {
      render(<Slider defaultValue={[42]} />);
      expect(screen.queryByText('42')).not.toBeInTheDocument();
    });
  });

  describe('range mode (two thumbs)', () => {
    it('renders two thumb elements for range selection', () => {
      render(<Slider defaultValue={[20, 80]} min={0} max={100} />);
      expect(screen.getAllByRole('slider')).toHaveLength(2);
    });

    it('shows both value labels for range', () => {
      render(<Slider defaultValue={[20, 80]} showValue />);
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });
  });
});

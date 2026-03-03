import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from '../skeleton.js';

describe('Skeleton', () => {
  it('renders a div', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('has aria-hidden="true"', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders with pulse animation by default', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton').className).toContain('animate-pulse');
  });

  it('renders with shimmer animation', () => {
    render(<Skeleton animation="shimmer" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton').className).toContain('overflow-hidden');
  });

  it('renders with no animation when animation="none"', () => {
    render(<Skeleton animation="none" data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).not.toContain('animate-pulse');
    expect(el.className).not.toContain('overflow-hidden');
  });

  it('accepts className for sizing', () => {
    render(<Skeleton className="h-4 w-48" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton').className).toContain('h-4');
    expect(screen.getByTestId('skeleton').className).toContain('w-48');
  });
});

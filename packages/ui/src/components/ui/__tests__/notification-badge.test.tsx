import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationBadge } from '../notification-badge.js';

describe('NotificationBadge', () => {
  describe('count rendering', () => {
    it('renders a numeric count', () => {
      render(<NotificationBadge count={5} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders count at the max boundary', () => {
      render(<NotificationBadge count={99} />);
      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('caps count above max with "+"', () => {
      render(<NotificationBadge count={100} />);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('respects a custom max', () => {
      render(<NotificationBadge count={10} max={9} />);
      expect(screen.getByText('9+')).toBeInTheDocument();
    });

    it('adds aria-label for count', () => {
      render(<NotificationBadge count={3} />);
      expect(screen.getByRole('generic', { name: '3 notifications' })).toBeInTheDocument();
    });
  });

  describe('icon / children mode', () => {
    it('renders children when no count is provided', () => {
      render(<NotificationBadge>★</NotificationBadge>);
      expect(screen.getByText('★')).toBeInTheDocument();
    });

    it('aria-label is not auto-set for children mode', () => {
      render(<NotificationBadge>★</NotificationBadge>);
      expect(screen.getByText('★')).not.toHaveAttribute('aria-label');
    });

    it('accepts a manual aria-label in children mode', () => {
      render(<NotificationBadge aria-label="new message">★</NotificationBadge>);
      expect(screen.getByRole('generic', { name: 'new message' })).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('renders brand variant', () => {
      render(<NotificationBadge count={1} variant="brand" />);
      expect(screen.getByText('1').className).toContain('ui-notification-badge--brand');
    });

    it('renders accent variant', () => {
      render(<NotificationBadge count={1} variant="accent" />);
      expect(screen.getByText('1').className).toContain('ui-notification-badge--accent');
    });

    it('renders success variant', () => {
      render(<NotificationBadge count={1} variant="success" />);
      expect(screen.getByText('1').className).toContain('ui-notification-badge--success');
    });

    it('renders warning variant', () => {
      render(<NotificationBadge count={1} variant="warning" />);
      expect(screen.getByText('1').className).toContain('ui-notification-badge--warning');
    });

    it('renders danger variant', () => {
      render(<NotificationBadge count={1} variant="danger" />);
      expect(screen.getByText('1').className).toContain('ui-notification-badge--danger');
    });

    it('renders neutral variant', () => {
      render(<NotificationBadge count={1} variant="neutral" />);
      expect(screen.getByText('1').className).toContain('ui-notification-badge--neutral');
    });

    it('renders inverted variant', () => {
      render(<NotificationBadge count={1} variant="inverted" />);
      expect(screen.getByText('1').className).toContain('ui-notification-badge--inverted');
    });
  });

  describe('sizes', () => {
    it('renders lg size', () => {
      render(<NotificationBadge count={1} size="lg" />);
      expect(screen.getByText('1').className).toContain('ui-notification-badge--lg');
    });

    it('renders md size', () => {
      render(<NotificationBadge count={1} size="md" />);
      expect(screen.getByText('1').className).toContain('ui-notification-badge--md');
    });
  });

  it('passes additional className', () => {
    render(<NotificationBadge count={1} className="absolute -top-1" />);
    expect(screen.getByText('1').className).toContain('absolute');
  });
});

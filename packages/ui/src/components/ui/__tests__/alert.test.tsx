import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Alert, AlertTitle, AlertDescription } from '../alert.js';

describe('Alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders info variant by default', () => {
    render(<Alert data-testid="alert">Info message</Alert>);
    expect(screen.getByTestId('alert').className).toContain('border-[var(--color-info-default)]');
  });

  it('renders success variant', () => {
    render(<Alert variant="success" data-testid="alert">Success</Alert>);
    expect(screen.getByTestId('alert').className).toContain('border-[var(--color-success-default)]');
  });

  it('renders warning variant', () => {
    render(<Alert variant="warning" data-testid="alert">Warning</Alert>);
    expect(screen.getByTestId('alert').className).toContain('border-[var(--color-warning-default)]');
  });

  it('renders error variant', () => {
    render(<Alert variant="error" data-testid="alert">Error</Alert>);
    expect(screen.getByTestId('alert').className).toContain('border-[var(--color-error-default)]');
  });

  it('renders children content', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description text</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert description text')).toBeInTheDocument();
  });

  describe('dismissible', () => {
    it('renders dismiss button when onDismiss is provided', () => {
      render(<Alert onDismiss={vi.fn()}>Content</Alert>);
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });

    it('does not render dismiss button without onDismiss', () => {
      render(<Alert>Content</Alert>);
      expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(<Alert onDismiss={onDismiss}>Content</Alert>);
      await user.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(onDismiss).toHaveBeenCalledOnce();
    });
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Content</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

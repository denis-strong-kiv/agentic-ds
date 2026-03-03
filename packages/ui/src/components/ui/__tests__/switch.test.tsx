import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from '../switch.js';

describe('Switch', () => {
  it('renders a switch control', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('fires onCheckedChange when clicked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles on Space key', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange} />);
    screen.getByRole('switch').focus();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('updates aria-checked when toggled', async () => {
    const user = userEvent.setup();
    render(<Switch />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await user.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Switch disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  describe('with label', () => {
    it('renders label text on the right by default', () => {
      render(<Switch label="Enable notifications" />);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('renders label on the left when labelPosition is left', () => {
      render(<Switch label="Dark mode" labelPosition="left" />);
      const label = screen.getByText('Dark mode');
      const sw = screen.getByRole('switch');
      expect(label.compareDocumentPosition(sw)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('renders label on the right when labelPosition is right', () => {
      render(<Switch label="Dark mode" labelPosition="right" />);
      const label = screen.getByText('Dark mode');
      const sw = screen.getByRole('switch');
      expect(label.compareDocumentPosition(sw)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    });
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

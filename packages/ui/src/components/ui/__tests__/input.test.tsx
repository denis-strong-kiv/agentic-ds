import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../input.js';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('fires onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  describe('error state', () => {
    it('renders error message when error prop is provided', () => {
      render(<Input id="email" error="Invalid email" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
    });

    it('sets aria-invalid when error is provided', () => {
      render(<Input id="email" error="Required" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('associates error message via aria-describedby when id is provided', () => {
      render(<Input id="email" error="Required" />);
      const input = screen.getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBe('email-error');
      expect(document.getElementById(errorId!)).toHaveTextContent('Required');
    });

    it('does not set aria-describedby when no id provided', () => {
      render(<Input error="Required" />);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
    });

    it('does not render error when error prop is absent', () => {
      render(<Input />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('renders as disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('slots', () => {
    it('renders left slot content', () => {
      render(<Input leftSlot={<span data-testid="left-icon" />} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders right slot content', () => {
      render(<Input rightSlot={<span data-testid="right-icon" />} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('adds padding-left when leftSlot is provided', () => {
      render(<Input leftSlot={<span />} />);
      expect(screen.getByRole('textbox').className).toContain('ui-input--with-left-slot');
    });

    it('adds padding-right when rightSlot is provided', () => {
      render(<Input rightSlot={<span />} />);
      expect(screen.getByRole('textbox').className).toContain('ui-input--with-right-slot');
    });
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

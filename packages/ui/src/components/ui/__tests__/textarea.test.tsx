import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from '../textarea.js';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  describe('character count', () => {
    it('shows character count when showCount and maxLength are provided', () => {
      render(<Textarea showCount maxLength={100} />);
      expect(screen.getByText('0/100')).toBeInTheDocument();
    });

    it('updates character count as user types', async () => {
      const user = userEvent.setup();
      render(<Textarea showCount maxLength={100} />);
      await user.type(screen.getByRole('textbox'), 'hello');
      expect(screen.getByText('5/100')).toBeInTheDocument();
    });

    it('does not show count when showCount is false', () => {
      render(<Textarea maxLength={100} />);
      expect(screen.queryByText('0/100')).not.toBeInTheDocument();
    });
  });

  describe('autoResize', () => {
    it('calls onChange when user types', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Textarea autoResize onChange={onChange} />);
      await user.type(screen.getByRole('textbox'), 'test');
      expect(onChange).toHaveBeenCalled();
    });

    it('adds resize-none class when autoResize is true', () => {
      render(<Textarea autoResize />);
      expect(screen.getByRole('textbox').className).toContain('resize-none');
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('error state', () => {
    it('renders error message when error prop is provided', () => {
      render(<Textarea id="bio" error="Too short" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Too short');
    });

    it('sets aria-invalid when error is provided', () => {
      render(<Textarea error="Required" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});

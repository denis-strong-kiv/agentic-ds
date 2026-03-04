import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../button.js';

describe('Button', () => {
  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Click me</Button>);
      const btn = screen.getByRole('button', { name: 'Click me' });
      expect(btn).toBeInTheDocument();
      expect(btn.className).toContain('bg-[var(--color-primary-default)]');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-transparent');
      expect(btn.className).toContain('border-[var(--color-border-default)]');
    });

    it('renders tertiary variant', () => {
      render(<Button variant="tertiary">Tertiary</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('text-[var(--color-foreground-default)]');
      expect(btn.className).toContain('bg-transparent');
    });

    it('renders neutral variant', () => {
      render(<Button variant="neutral">Neutral</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-[var(--color-foreground-default)]');
      expect(btn.className).toContain('text-[var(--color-background-default)]');
    });

    it('renders inverted-primary variant', () => {
      render(<Button variant="inverted-primary">Inverted Primary</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-[oklch(100%_0_0)]');
    });

    it('renders inverted-secondary variant', () => {
      render(<Button variant="inverted-secondary">Inverted Secondary</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('text-[oklch(100%_0_0)]');
      expect(btn.className).toContain('border-[oklch(100%_0_0)]');
    });

    it('renders inverted-tertiary variant', () => {
      render(<Button variant="inverted-tertiary">Inverted Tertiary</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('text-[oklch(100%_0_0)]');
      expect(btn.className).toContain('bg-transparent');
    });

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('border-[var(--color-primary-default)]');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('hover:bg-[var(--color-background-subtle)]');
    });

    it('renders destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-[var(--color-error-default)]');
    });

    it('renders link variant', () => {
      render(<Button variant="link">Link</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('text-[var(--color-primary-default)]');
    });
  });

  describe('sizes', () => {
    it('renders sm size', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button').className).toContain('h-8');
    });

    it('renders md size by default', () => {
      render(<Button>Medium</Button>);
      expect(screen.getByRole('button').className).toContain('h-10');
    });

    it('renders lg size', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button').className).toContain('h-12');
    });

    it('renders xl size', () => {
      render(<Button size="xl">X-Large</Button>);
      expect(screen.getByRole('button').className).toContain('h-14');
    });

    it('renders icon size', () => {
      render(<Button size="icon" aria-label="icon">X</Button>);
      expect(screen.getByRole('button').className).toContain('h-10 w-10');
    });
  });

  describe('interaction', () => {
    it('fires onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('does not fire onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button disabled onClick={onClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('sets disabled attribute when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('loading state', () => {
    it('shows spinner when isLoading is true', () => {
      render(<Button isLoading>Submit</Button>);
      const btn = screen.getByRole('button');
      expect(btn.querySelector('svg')).toBeInTheDocument();
    });

    it('disables button when isLoading is true', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('sets aria-busy when isLoading is true', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('renders custom spinner when provided', () => {
      render(<Button isLoading spinner={<span data-testid="custom-spinner" />}>Submit</Button>);
      expect(screen.getByTestId('custom-spinner')).toBeInTheDocument();
    });

    it('still renders children text while loading', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Submit');
    });
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes additional className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });
});

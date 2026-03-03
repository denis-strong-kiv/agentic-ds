import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../badge.js';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-[var(--color-background-subtle)]');
  });

  it('renders secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary').className).toContain('bg-[var(--color-secondary-default)]');
  });

  it('renders outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline').className).toContain('border-[var(--color-border-default)]');
  });

  it('renders destructive variant', () => {
    render(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText('Error').className).toContain('bg-[var(--color-error-default)]');
  });

  describe('travel-specific variants', () => {
    it('renders deal variant', () => {
      render(<Badge variant="deal">Deal</Badge>);
      expect(screen.getByText('Deal').className).toContain('bg-[var(--color-success-default)]');
    });

    it('renders new variant', () => {
      render(<Badge variant="new">New</Badge>);
      expect(screen.getByText('New').className).toContain('bg-[var(--color-accent-default)]');
    });

    it('renders popular variant', () => {
      render(<Badge variant="popular">Popular</Badge>);
      expect(screen.getByText('Popular').className).toContain('bg-[var(--color-warning-default)]');
    });
  });

  it('renders children content', () => {
    render(<Badge>My Badge</Badge>);
    expect(screen.getByText('My Badge')).toBeInTheDocument();
  });

  it('passes additional className', () => {
    render(<Badge className="extra-class">Tag</Badge>);
    expect(screen.getByText('Tag').className).toContain('extra-class');
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../badge/index.js';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('ui-badge--default');
  });

  it('renders secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary').className).toContain('ui-badge--secondary');
  });

  it('renders outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline').className).toContain('ui-badge--outline');
  });

  it('renders destructive variant', () => {
    render(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText('Error').className).toContain('ui-badge--destructive');
  });

  describe('travel-specific variants', () => {
    it('renders deal variant', () => {
      render(<Badge variant="deal">Deal</Badge>);
      expect(screen.getByText('Deal').className).toContain('ui-badge--deal');
    });

    it('renders new variant', () => {
      render(<Badge variant="new">New</Badge>);
      expect(screen.getByText('New').className).toContain('ui-badge--new');
    });

    it('renders popular variant', () => {
      render(<Badge variant="popular">Popular</Badge>);
      expect(screen.getByText('Popular').className).toContain('ui-badge--popular');
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

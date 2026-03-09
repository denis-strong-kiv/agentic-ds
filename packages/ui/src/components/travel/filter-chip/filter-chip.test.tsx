import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AllFiltersChip, QuickFilterChip, FilterChip } from './index';

// ─── AllFiltersChip ───────────────────────────────────────────────────────────

describe('AllFiltersChip', () => {
  it('renders "All filters" label', () => {
    render(<AllFiltersChip onClick={vi.fn()} />);
    expect(screen.getByText('All filters')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<AllFiltersChip onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('reflects isActive via aria-pressed', () => {
    const { rerender } = render(<AllFiltersChip onClick={vi.fn()} isActive={false} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    rerender(<AllFiltersChip onClick={vi.fn()} isActive />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows count badge with accessible label when count > 0', () => {
    render(<AllFiltersChip onClick={vi.fn()} count={3} />);
    expect(screen.getByLabelText('3 active filters')).toBeInTheDocument();
  });

  it('hides count badge when count is 0', () => {
    render(<AllFiltersChip onClick={vi.fn()} count={0} />);
    expect(screen.queryByLabelText(/active filters/)).not.toBeInTheDocument();
  });
});

// ─── QuickFilterChip ──────────────────────────────────────────────────────────

describe('QuickFilterChip', () => {
  it('renders label', () => {
    render(<QuickFilterChip label="Nonstop only" onClick={vi.fn()} />);
    expect(screen.getByText('Nonstop only')).toBeInTheDocument();
  });

  it('calls onClick when inactive', async () => {
    const onClick = vi.fn();
    render(<QuickFilterChip label="Nonstop only" onClick={onClick} isActive={false} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when active (clear icon handles dismiss)', async () => {
    const onClick = vi.fn();
    render(<QuickFilterChip label="Nonstop only" onClick={onClick} isActive />);
    // The button itself has no onClick when active
    const btn = screen.getByRole('button', { name: /nonstop only/i });
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows clear icon and calls onClear when active with onClear', async () => {
    const onClear = vi.fn();
    render(<QuickFilterChip label="Nonstop only" onClick={vi.fn()} isActive onClear={onClear} />);
    await userEvent.click(screen.getByLabelText('Remove Nonstop only filter'));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('reflects aria-pressed', () => {
    const { rerender } = render(<QuickFilterChip label="Nonstop only" onClick={vi.fn()} isActive={false} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    rerender(<QuickFilterChip label="Nonstop only" onClick={vi.fn()} isActive />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });
});

// ─── FilterChip ───────────────────────────────────────────────────────────────

describe('FilterChip', () => {
  it('renders label', () => {
    render(<FilterChip label="Price" />);
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('shows activeLabel instead of label when active', () => {
    render(<FilterChip label="Price" activeLabel="Up to $500" isActive />);
    expect(screen.getByText('Up to $500')).toBeInTheDocument();
    expect(screen.queryByText('Price')).not.toBeInTheDocument();
  });

  it('shows arrow icon when inactive and no popover', () => {
    const { container } = render(<FilterChip label="Price" isActive={false} />);
    expect(container.querySelector('.travel-filter-chip-arrow-icon')).toBeInTheDocument();
  });

  it('hides arrow icon when active', () => {
    const { container } = render(<FilterChip label="Price" isActive />);
    expect(container.querySelector('.travel-filter-chip-arrow-icon')).not.toBeInTheDocument();
  });

  it('shows clear icon and calls onClear when active with onClear', async () => {
    const onClear = vi.fn();
    render(<FilterChip label="Price" isActive onClear={onClear} />);
    await userEvent.click(screen.getByLabelText('Remove Price filter'));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('reflects aria-pressed', () => {
    const { rerender } = render(<FilterChip label="Price" isActive={false} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    rerender(<FilterChip label="Price" isActive />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Combobox } from '../combobox.js';

const options = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class', disabled: true },
];

function cb(props = {}) {
  return render(
    <Combobox options={options} aria-label="Cabin class" {...props} />,
  );
}

describe('Combobox', () => {
  it('renders with placeholder when no value', () => {
    cb({ placeholder: 'Select cabin' });
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Select cabin');
  });

  it('displays selected option label', () => {
    cb({ value: 'business' });
    expect(screen.getByRole('combobox')).toHaveValue('Business');
  });

  it('opens dropdown on focus', async () => {
    const user = userEvent.setup();
    cb();
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows all options when opened', async () => {
    const user = userEvent.setup();
    cb();
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Economy' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Business' })).toBeInTheDocument();
  });

  it('filters options as user types', async () => {
    const user = userEvent.setup();
    cb();
    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'bus');
    expect(screen.getByRole('option', { name: 'Business' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Economy' })).not.toBeInTheDocument();
  });

  it('shows "No options found" when nothing matches', async () => {
    const user = userEvent.setup();
    cb();
    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByText('No options found.')).toBeInTheDocument();
  });

  it('calls onChange and closes dropdown when option is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    cb({ onChange });
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Economy' }));
    expect(onChange).toHaveBeenCalledWith('economy');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('updates input to selected label after selection', async () => {
    const user = userEvent.setup();
    cb({ onChange: vi.fn() });
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Business' }));
    expect(screen.getByRole('combobox')).toHaveValue('Business');
  });

  it('marks selected option with aria-selected', async () => {
    const user = userEvent.setup();
    cb({ value: 'premium' });
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Premium Economy' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Economy' })).toHaveAttribute('aria-selected', 'false');
  });

  it('does not call onChange for a disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    cb({ onChange });
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'First Class' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('closes dropdown on Escape and reverts input', async () => {
    const user = userEvent.setup();
    cb({ value: 'economy' });
    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'bus');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('Economy');
  });

  it('navigates options with ArrowDown / Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    cb({ onChange });
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('premium');
  });

  it('is disabled when disabled prop is set', () => {
    cb({ disabled: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});

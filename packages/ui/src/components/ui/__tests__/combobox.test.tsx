import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Combobox } from '../combobox.js';

const options = [
  { value: 'jfk', label: 'JFK', sublabel: 'John F. Kennedy International' },
  { value: 'lax', label: 'LAX', sublabel: 'Los Angeles International' },
  { value: 'ord', label: 'ORD', sublabel: 'O\'Hare International', disabled: true },
];

describe('Combobox', () => {
  it('renders the trigger with placeholder when no value', () => {
    render(<Combobox options={options} placeholder="Select airport" />);
    expect(screen.getByText('Select airport')).toBeInTheDocument();
  });

  it('renders selected value label', () => {
    render(<Combobox options={options} value="jfk" />);
    expect(screen.getByText('JFK')).toBeInTheDocument();
  });

  it('renders selected value sublabel', () => {
    render(<Combobox options={options} value="jfk" />);
    expect(screen.getByText('John F. Kennedy International')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows all options when opened', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('option', { name: /JFK/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /LAX/ })).toBeInTheDocument();
  });

  it('filters options based on search query', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), 'los');
    expect(screen.getByRole('option', { name: /LAX/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /JFK/ })).not.toBeInTheDocument();
  });

  it('filters by sublabel', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), 'Kennedy');
    expect(screen.getByRole('option', { name: /JFK/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /LAX/ })).not.toBeInTheDocument();
  });

  it('shows "No results found" when search has no matches', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), 'xyz_no_match');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox options={options} onChange={onChange} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: /JFK/ }));
    expect(onChange).toHaveBeenCalledWith('jfk');
  });

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: /JFK/ }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown on Escape key', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not call onChange when disabled option is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox options={options} onChange={onChange} />);
    await user.click(screen.getByRole('button'));
    const ordOption = screen.getByRole('option', { name: /ORD/ });
    await user.click(ordOption);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows loading state when isLoading is true', async () => {
    const user = userEvent.setup();
    render(<Combobox options={[]} isLoading />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows checkmark next to selected option', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} value="lax" />);
    await user.click(screen.getByRole('button'));
    const laxOption = screen.getByRole('option', { name: /LAX/ });
    expect(laxOption).toHaveAttribute('aria-selected', 'true');
  });
});

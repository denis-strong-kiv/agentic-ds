import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select/index.js';

function SelectFixture({
  defaultValue,
  onValueChange,
  disabled,
}: {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onValueChange !== undefined ? { onValueChange } : {})}
    >
      <SelectTrigger disabled={disabled}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry" disabled>Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders trigger with placeholder', () => {
    render(<SelectFixture />);
    expect(screen.getByText('Select a fruit')).toBeInTheDocument();
  });

  it('displays selected value', () => {
    render(<SelectFixture defaultValue="apple" />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();
    render(<SelectFixture />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
  });

  it('calls onValueChange when an item is selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SelectFixture onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Apple' }));
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });

  it('disables trigger when disabled prop is true', () => {
    render(<SelectFixture disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders disabled items as non-interactive', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SelectFixture onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    const cherryOption = screen.getByRole('option', { name: 'Cherry' });
    expect(cherryOption).toHaveAttribute('aria-disabled', 'true');
  });

  it('closes dropdown on Escape key', async () => {
    const user = userEvent.setup();
    render(<SelectFixture />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Apple' })).toBeVisible();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
  });
});

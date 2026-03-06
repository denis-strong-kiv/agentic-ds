import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RadioGroup, RadioGroupItem } from '../radio-group/index';

function RadioGroupFixture({
  defaultValue,
  onValueChange,
  disabled,
}: {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <RadioGroup
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onValueChange !== undefined ? { onValueChange } : {})}
      {...(disabled !== undefined ? { disabled } : {})}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-a" id="option-a" />
        <label htmlFor="option-a">Option A</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-b" id="option-b" />
        <label htmlFor="option-b">Option B</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-c" id="option-c" />
        <label htmlFor="option-c">Option C</label>
      </div>
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('renders radio group with items', () => {
    render(<RadioGroupFixture />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('marks the default value as checked', () => {
    render(<RadioGroupFixture defaultValue="option-b" />);
    expect(screen.getByLabelText('Option B')).toBeChecked();
    expect(screen.getByLabelText('Option A')).not.toBeChecked();
    expect(screen.getByLabelText('Option C')).not.toBeChecked();
  });

  it('calls onValueChange when an item is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RadioGroupFixture onValueChange={onValueChange} />);
    await user.click(screen.getByLabelText('Option A'));
    expect(onValueChange).toHaveBeenCalledWith('option-a');
  });

  it('only allows one selection at a time', async () => {
    const user = userEvent.setup();
    render(<RadioGroupFixture />);
    await user.click(screen.getByLabelText('Option A'));
    await user.click(screen.getByLabelText('Option B'));
    expect(screen.getByLabelText('Option A')).not.toBeChecked();
    expect(screen.getByLabelText('Option B')).toBeChecked();
  });

  it('navigates with ArrowDown key', async () => {
    const user = userEvent.setup();
    render(<RadioGroupFixture defaultValue="option-a" />);
    screen.getByLabelText('Option A').focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByLabelText('Option B')).toHaveFocus();
  });

  it('navigates with ArrowUp key', async () => {
    const user = userEvent.setup();
    render(<RadioGroupFixture defaultValue="option-b" />);
    screen.getByLabelText('Option B').focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByLabelText('Option A')).toHaveFocus();
  });

  it('is disabled when disabled prop is true', () => {
    render(<RadioGroupFixture disabled />);
    screen.getAllByRole('radio').forEach(radio => {
      expect(radio).toBeDisabled();
    });
  });
});

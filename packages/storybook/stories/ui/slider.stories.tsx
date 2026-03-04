import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@travel/ui/components/ui/slider';

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const PriceRange: Story = {
  name: 'Price range filter',
  args: {
    defaultValue: [150, 600],
    min: 0,
    max: 1500,
    step: 10,
    showValue: true,
    formatValue: (v: number) => `$${v}`,
  },
  render: (args) => (
    <div className="w-72">
      <p className="text-sm font-medium text-[var(--color-foreground-default)] mb-4">
        Price per night
      </p>
      <Slider {...args} />
    </div>
  ),
};

export const BudgetFilter: Story = {
  name: 'Budget (single thumb)',
  args: {
    defaultValue: [800],
    min: 0,
    max: 5000,
    step: 50,
    showValue: true,
    formatValue: (v: number) => `$${v}`,
  },
  render: (args) => (
    <div className="w-72">
      <p className="text-sm font-medium text-[var(--color-foreground-default)] mb-4">
        Max total budget
      </p>
      <Slider {...args} aria-label="Max total budget" />
    </div>
  ),
};

export const DurationFilter: Story = {
  name: 'Flight duration filter',
  args: {
    defaultValue: [0, 16],
    min: 0,
    max: 24,
    step: 1,
    showValue: true,
    formatValue: (v: number) => `${v}h`,
  },
  render: (args) => (
    <div className="w-72">
      <p className="text-sm font-medium text-[var(--color-foreground-default)] mb-4">
        Max flight duration
      </p>
      <Slider {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: [40],
    disabled: true,
    showValue: true,
    formatValue: (v: number) => `${v}%`,
  },
  render: (args) => (
    <div className="w-72">
      <Slider {...args} aria-label="Disabled slider" />
    </div>
  ),
};

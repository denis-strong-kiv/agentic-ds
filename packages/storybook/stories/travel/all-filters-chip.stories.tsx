import type { Meta, StoryObj } from '@storybook/react';
import { AllFiltersChip } from '@travel/ui/components/travel/filter-chip';

const meta: Meta<typeof AllFiltersChip> = {
  title: 'Travel/FilterChip/AllFiltersChip',
  component: AllFiltersChip,
  tags: ['autodocs'],
  args: {
    isActive: false,
  },
  argTypes: {
    isActive: { control: 'boolean' },
    count: { control: 'number' },
    onClick: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => <AllFiltersChip {...args} onClick={() => {}} />,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: '0.5rem', padding: '1.5rem', alignItems: 'center' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AllFiltersChip>;

export const Playground: Story = {};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <>
      <AllFiltersChip onClick={() => {}} />
      <AllFiltersChip isActive onClick={() => {}} />
      <AllFiltersChip isActive count={3} onClick={() => {}} />
    </>
  ),
};

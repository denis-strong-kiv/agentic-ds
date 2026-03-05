import type { Meta, StoryObj } from '@storybook/react';
import { PassengerForm } from '@travel/ui/components/travel/passenger-form';

const meta: Meta<typeof PassengerForm> = {
  title: 'Travel/PassengerForm',
  component: PassengerForm,
  tags: ['autodocs'],
  args: {
    index: 0,
    type: 'Adult',
    isPrimary: true,
    onSave: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof PassengerForm>;

export const PrimaryTraveler: Story = {
  name: 'Primary traveler (Adult)',
};

export const SecondAdult: Story = {
  name: 'Second traveler (Adult)',
  args: {
    index: 1,
    type: 'Adult',
    isPrimary: false,
    onCopyFromPrimary: () => ({
      title: 'Mr' as const,
      firstName: 'James',
      lastName: 'Smith',
      nationality: 'US',
    }),
  },
};

export const Child: Story = {
  args: {
    index: 2,
    type: 'Child',
    isPrimary: false,
  },
};

export const Infant: Story = {
  args: {
    index: 3,
    type: 'Infant',
    isPrimary: false,
  },
};

export const PrePopulated: Story = {
  name: 'Pre-populated (returning traveler)',
  args: {
    isPrimary: true,
    initialData: {
      title: 'Mr' as const,
      firstName: 'James',
      lastName: 'Smith',
      dateOfBirth: '1985-04-12',
      nationality: 'US',
      passportNumber: 'A12345678',
      passportExpiry: '2030-06-30',
      email: 'james.smith@example.com',
      phone: '+1 555 012 3456',
      frequentFlyerNumber: 'BA123456789',
      mealPreference: 'standard',
      wheelchairAssistance: false,
    },
  },
};

export const MultiplePassengers: Story = {
  name: 'Multiple passengers (stacked)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 720 }}>
      <PassengerForm index={0} type="Adult" isPrimary onSave={() => {}} />
      <PassengerForm
        index={1}
        type="Adult"
        isPrimary={false}
        onSave={() => {}}
        onCopyFromPrimary={() => ({ nationality: 'US' })}
      />
      <PassengerForm index={2} type="Child" isPrimary={false} onSave={() => {}} />
    </div>
  ),
};

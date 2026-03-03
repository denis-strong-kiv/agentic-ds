import type { Meta, StoryObj } from '@storybook/react';
import { BookingStepper } from '@travel/ui/components/travel/booking-stepper';
import type { BookingStep } from '@travel/ui/components/travel/booking-stepper';
import React from 'react';

const allSteps: BookingStep[] = [
  { id: 'search', label: 'Search', status: 'completed' },
  { id: 'select', label: 'Select', status: 'completed' },
  { id: 'customize', label: 'Customize', status: 'active' },
  { id: 'passengers', label: 'Passengers', status: 'upcoming' },
  { id: 'payment', label: 'Payment', status: 'upcoming' },
  { id: 'confirm', label: 'Confirmation', status: 'upcoming' },
];

const meta: Meta<typeof BookingStepper> = {
  title: 'Travel/BookingStepper',
  component: BookingStepper,
  tags: ['autodocs'],
  args: { steps: allSteps, onStepClick: () => {} },
};
export default meta;
type Story = StoryObj<typeof BookingStepper>;

export const Step1Search: Story = {
  args: {
    steps: allSteps.map((s, i) => ({ ...s, status: i === 0 ? 'active' : 'upcoming' })),
  },
};

export const Step3Customize: Story = {
  args: { steps: allSteps },
};

export const Step5Payment: Story = {
  args: {
    steps: allSteps.map((s, i) => ({
      ...s,
      status: i < 4 ? 'completed' : i === 4 ? 'active' : 'upcoming',
    })),
  },
};

export const Completed: Story = {
  args: {
    steps: allSteps.map(s => ({ ...s, status: 'completed' })),
  },
};

export const AllStepStates: Story = {
  name: 'All Step States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {[0, 1, 2, 3, 4, 5].map(activeIdx => (
        <div key={activeIdx}>
          <p style={{ fontSize: 12, color: 'var(--color-foreground-muted)', marginBottom: '0.5rem' }}>
            Active: Step {activeIdx + 1} — {allSteps[activeIdx].label}
          </p>
          <BookingStepper
            steps={allSteps.map((s, i) => ({
              ...s,
              status: i < activeIdx ? 'completed' : i === activeIdx ? 'active' : 'upcoming',
            }))}
            onStepClick={() => {}}
          />
        </div>
      ))}
    </div>
  ),
};

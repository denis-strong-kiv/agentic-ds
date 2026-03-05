import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '@travel/ui/components/ui/progress';
import { useEffect, useState } from 'react';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: { value: { control: { type: 'range', min: 0, max: 100, step: 1 } } },
};
export default meta;
type Story = StoryObj<typeof Progress>;

function AnimatedUploadProgress() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setValue(v => (v >= 100 ? 0 : v + 5)), 200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sb-stack-sm sb-max-sm">
      <div className="sb-row-between sb-caption-muted">
        <span>Uploading passport scan…</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} aria-label="Uploading passport scan" />
    </div>
  );
}

export const BookingSteps: Story = {
  name: 'Booking step progress',
  render: () => (
    <div className="sb-stack-lg sb-max-sm">
      {[
        { label: 'Search', value: 100 },
        { label: 'Passenger details', value: 75 },
        { label: 'Seat selection', value: 50 },
        { label: 'Payment', value: 25 },
        { label: 'Not started', value: 0 },
      ].map(({ label, value }) => (
        <div key={label} className="sb-stack-sm">
          <div className="sb-row-between sb-caption-muted">
            <span>{label}</span>
            <span>{value}%</span>
          </div>
          <Progress value={value} aria-label={label} />
        </div>
      ))}
    </div>
  ),
};

export const Indeterminate: Story = {
  name: 'Indeterminate (loading)',
  render: () => (
    <div className="sb-max-sm">
      <Progress value={undefined} aria-label="Loading" />
    </div>
  ),
};

export const Animated: Story = {
  name: 'Animated upload',
  render: () => <AnimatedUploadProgress />,
};

export const Controlled: Story = {
  args: { value: 60 },
  render: (args) => (
    <div className="sb-max-sm">
      <Progress {...args} aria-label="Upload progress" />
    </div>
  ),
};

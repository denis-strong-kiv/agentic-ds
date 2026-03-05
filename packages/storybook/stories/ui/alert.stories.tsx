import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '@travel/ui/components/ui/alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const AllVariants: Story = {
  render: () => (
    <div className="sb-stack-md sb-max-lg">
      <Alert variant="info">
        <AlertTitle>Flight update</AlertTitle>
        <AlertDescription>Your flight FL-204 has been moved to Gate B14.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Booking confirmed</AlertTitle>
        <AlertDescription>
          Your reservation is confirmed. Check-in opens 48 hours before departure.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Check-in closes soon</AlertTitle>
        <AlertDescription>
          Online check-in for your flight closes in 2 hours. Complete it now to choose your seat.
        </AlertDescription>
      </Alert>
      <Alert variant="error">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your card was declined. Please update your payment method and try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithDismiss: Story = {
  name: 'Dismissible alert',
  render: () => (
    <div className="sb-max-lg">
      <Alert variant="info" onDismiss={() => {}}>
        <AlertTitle>Price drop alert</AlertTitle>
        <AlertDescription>
          Flights to Barcelona dropped by $42 since you last searched.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <div className="sb-stack-md sb-max-lg">
      <Alert variant="success">
        <AlertTitle>Seat selection saved.</AlertTitle>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Last 3 seats available at this price.</AlertTitle>
      </Alert>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="sb-stack-md sb-max-lg">
      <Alert variant="error">
        <svg className="sb-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4m0 4h.01" />
        </svg>
        <AlertTitle>Passport expiry warning</AlertTitle>
        <AlertDescription>
          Your passport expires within 6 months of your travel date. Some destinations may deny
          entry. Check entry requirements before booking.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <svg className="sb-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4m0-4h.01" />
        </svg>
        <AlertTitle>Visa required</AlertTitle>
        <AlertDescription>
          Citizens of your country require a visa to enter this destination. Apply at least
          4 weeks before travel.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

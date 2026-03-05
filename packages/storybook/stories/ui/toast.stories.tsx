import type { Meta, StoryObj } from '@storybook/react';
import {
  ToastProvider, ToastViewport, Toast, ToastTitle,
  ToastDescription, ToastClose, ToastAction,
} from '@travel/ui/components/ui/toast';

const meta: Meta = {
  title: 'UI/Toast',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

function ToastScene({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastViewport aria-label="Notifications" />
    </ToastProvider>
  );
}

export const AllVariants: Story = {
  render: () => (
    <ToastScene>
      <div className="sb-stack-md sb-max-sm sb-ms-auto">
        <Toast open variant="default">
          <div className="sb-flex-1">
            <ToastTitle>Seat saved</ToastTitle>
            <ToastDescription>14A (window) has been reserved for 10 minutes.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <Toast open variant="success">
          <div className="sb-flex-1">
            <ToastTitle>Booking confirmed!</ToastTitle>
            <ToastDescription>FL-204 · Jun 15 · Ref: TRV-8821</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <Toast open variant="warning">
          <div className="sb-flex-1">
            <ToastTitle>Check-in closes in 1 hour</ToastTitle>
            <ToastDescription>Complete online check-in before 08:00.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <Toast open variant="error">
          <div className="sb-flex-1">
            <ToastTitle>Payment failed</ToastTitle>
            <ToastDescription>Card ending 4242 was declined.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </div>
    </ToastScene>
  ),
};

export const WithAction: Story = {
  name: 'With undo action',
  render: () => (
    <ToastScene>
      <Toast open variant="default" className="sb-max-sm sb-ms-auto">
        <div className="sb-flex-1">
          <ToastTitle>Search removed</ToastTitle>
          <ToastDescription>London → Tokyo saved search was deleted.</ToastDescription>
        </div>
        <ToastAction altText="Undo delete saved search">Undo</ToastAction>
        <ToastClose />
      </Toast>
    </ToastScene>
  ),
};

export const TitleOnly: Story = {
  name: 'Title only',
  render: () => (
    <ToastScene>
      <Toast open variant="success" className="sb-max-sm sb-ms-auto">
        <ToastTitle className="sb-flex-1">Wishlist updated</ToastTitle>
        <ToastClose />
      </Toast>
    </ToastScene>
  ),
};

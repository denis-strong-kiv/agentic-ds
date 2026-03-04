import type { Meta, StoryObj } from '@storybook/react';
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogFooter, AlertDialogTitle,
  AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from '@travel/ui/components/ui/alert-dialog';
import { Button } from '@travel/ui/components/ui/button';

const meta: Meta = {
  title: 'UI/AlertDialog',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const CancelBooking: Story = {
  name: 'Cancel booking',
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Cancel booking</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Cancelling flight FL-204 (London → Barcelona, Jun 15) is not reversible.
            A cancellation fee of $45 will apply per the fare rules. Any refund will
            be processed within 5–10 business days.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep booking</AlertDialogCancel>
          <AlertDialogAction>Yes, cancel</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const DeleteSavedSearch: Story = {
  name: 'Delete saved search',
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">Remove saved search</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove &ldquo;London → Tokyo&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This saved search and its price alerts will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

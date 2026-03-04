import type { Meta, StoryObj } from '@storybook/react';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis,
} from '@travel/ui/components/ui/breadcrumb';

const meta: Meta = {
  title: 'UI/Breadcrumb',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const BookingFlow: Story = {
  name: 'Booking flow',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Flights</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Search results</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Passenger details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const WithEllipsis: Story = {
  name: 'Collapsed with ellipsis',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Review</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Payment</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const CustomSeparator: Story = {
  name: 'Custom separator',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Hotels</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Santorini</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { PriceBreakdown } from '@travel/ui/components/travel/price-breakdown';

const flightLineItems = [
  { label: 'Base fare (2 Adults)', amount: '$960', type: 'base' as const },
  { label: 'Seat selection', amount: '$40', type: 'addon' as const },
  { label: 'Checked baggage (2 bags)', amount: '$60', type: 'addon' as const },
  { label: 'UK Air Passenger Duty', amount: '$80', type: 'tax' as const, description: 'Per person, Economy' },
  { label: 'Airport security fee', amount: '$11', type: 'tax' as const },
  { label: 'Booking fee', amount: '$15', type: 'fee' as const },
];

const passengerBreakdown = [
  { type: 'Adult' as const, count: 2, priceEach: '$480', subtotal: '$960' },
];

const meta: Meta<typeof PriceBreakdown> = {
  title: 'Travel/PriceBreakdown',
  component: PriceBreakdown,
  tags: ['autodocs'],
  args: {
    lineItems: flightLineItems,
    totalAmount: '$1,166',
    currency: 'USD',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof PriceBreakdown>;

export const FlightBasic: Story = {
  name: 'Flight — basic',
};

export const FlightWithPassengerBreakdown: Story = {
  name: 'Flight — with passenger breakdown',
  args: { passengerBreakdown },
};

export const WithPromoCode: Story = {
  name: 'With promo code',
  args: {
    passengerBreakdown,
    promoCode: 'SUMMER20',
    promoDiscount: '$93',
    totalAmount: '$1,073',
    lineItems: [
      ...flightLineItems,
      { label: 'Promo discount (SUMMER20)', amount: '−$93', type: 'discount' as const },
    ],
  },
};

export const HotelStay: Story = {
  name: 'Hotel stay',
  args: {
    lineItems: [
      { label: 'Deluxe King Room × 4 nights', amount: '$680', type: 'base' as const },
      { label: 'Breakfast included', amount: '$120', type: 'addon' as const },
      { label: 'City tax', amount: '$32', type: 'tax' as const },
      { label: 'VAT (10%)', amount: '$80', type: 'tax' as const },
    ],
    totalAmount: '$912',
    currency: 'USD',
  },
};

export const MixedPassengers: Story = {
  name: 'Mixed passengers (Adult + Child + Infant)',
  args: {
    passengerBreakdown: [
      { type: 'Adult' as const, count: 2, priceEach: '$480', subtotal: '$960' },
      { type: 'Child' as const, count: 1, priceEach: '$320', subtotal: '$320' },
      { type: 'Infant' as const, count: 1, priceEach: '$60', subtotal: '$60' },
    ],
    lineItems: [
      { label: 'Base fares (4 travelers)', amount: '$1,340', type: 'base' as const },
      { label: 'Taxes & fees', amount: '$135', type: 'tax' as const },
      { label: 'Booking fee', amount: '$15', type: 'fee' as const },
    ],
    totalAmount: '$1,490',
  },
};

export const Sticky: Story = {
  name: 'Sticky (desktop sidebar)',
  args: {
    passengerBreakdown,
    sticky: true,
  },
};

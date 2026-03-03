import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PriceBreakdown } from '../price-breakdown.js';
import type { LineItem, PassengerBreakdown } from '../price-breakdown.js';

const BASE_ITEMS: LineItem[] = [
  { label: 'Base fare', amount: '$300', type: 'base' },
  { label: 'Seat selection', amount: '$25', type: 'addon' },
];

const TAX_ITEMS: LineItem[] = [
  { label: 'Airport tax', amount: '$18', type: 'tax' },
  { label: 'Fuel surcharge', amount: '$12', type: 'tax' },
];

const DISCOUNT_ITEMS: LineItem[] = [
  { label: 'Loyalty discount', amount: '-$15', type: 'discount' },
];

const PASSENGER_BREAKDOWN: PassengerBreakdown[] = [
  { type: 'Adult', count: 2, priceEach: '$150', subtotal: '$300' },
  { type: 'Child', count: 1, priceEach: '$75', subtotal: '$75' },
];

describe('PriceBreakdown', () => {
  it('renders Price Summary heading', () => {
    render(<PriceBreakdown lineItems={[]} totalAmount="$349" />);
    expect(screen.getByText('Price Summary')).toBeInTheDocument();
  });

  it('renders total amount', () => {
    render(<PriceBreakdown lineItems={[]} totalAmount="$349" />);
    expect(screen.getByText('$349')).toBeInTheDocument();
  });

  it('renders "Total" label', () => {
    render(<PriceBreakdown lineItems={[]} totalAmount="$349" />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('renders currency label', () => {
    render(<PriceBreakdown lineItems={[]} totalAmount="$349" currency="USD" />);
    expect(screen.getByText('USD incl. all taxes')).toBeInTheDocument();
  });

  it('renders base fare line items', () => {
    render(<PriceBreakdown lineItems={BASE_ITEMS} totalAmount="$325" />);
    expect(screen.getByText('Base fare')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();
    expect(screen.getByText('Seat selection')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();
  });

  it('renders line item description when provided', () => {
    const items: LineItem[] = [
      { label: 'Bag fee', amount: '$30', type: 'fee', description: 'Checked bag' },
    ];
    render(<PriceBreakdown lineItems={items} totalAmount="$30" />);
    expect(screen.getByText('Checked bag')).toBeInTheDocument();
  });

  it('renders discount items in green text', () => {
    render(<PriceBreakdown lineItems={DISCOUNT_ITEMS} totalAmount="$285" />);
    expect(screen.getByText('Loyalty discount')).toBeInTheDocument();
    expect(screen.getByText('-$15')).toBeInTheDocument();
  });

  it('renders promo code badge and discount', () => {
    render(
      <PriceBreakdown
        lineItems={[]}
        totalAmount="$299"
        promoCode="SAVE10"
        promoDiscount="$50"
      />,
    );
    expect(screen.getByText('PROMO')).toBeInTheDocument();
    expect(screen.getByText('SAVE10')).toBeInTheDocument();
    expect(screen.getByText('−$50')).toBeInTheDocument();
  });

  it('does not render promo section when no promoCode', () => {
    render(<PriceBreakdown lineItems={[]} totalAmount="$349" />);
    expect(screen.queryByText('PROMO')).not.toBeInTheDocument();
  });

  it('renders passenger breakdown accordion trigger', () => {
    render(
      <PriceBreakdown
        lineItems={[]}
        totalAmount="$375"
        passengerBreakdown={PASSENGER_BREAKDOWN}
      />,
    );
    expect(screen.getByText('Passenger details')).toBeInTheDocument();
  });

  it('expands passenger breakdown to show details', async () => {
    const user = userEvent.setup();
    render(
      <PriceBreakdown
        lineItems={[]}
        totalAmount="$375"
        passengerBreakdown={PASSENGER_BREAKDOWN}
      />,
    );
    await user.click(screen.getByText('Passenger details'));
    expect(screen.getByText(/2× Adult @ \$150/)).toBeInTheDocument();
    expect(screen.getByText(/1× Child @ \$75/)).toBeInTheDocument();
  });

  it('renders taxes accordion trigger when tax items provided', () => {
    render(<PriceBreakdown lineItems={TAX_ITEMS} totalAmount="$330" />);
    expect(screen.getByText('Taxes & fees')).toBeInTheDocument();
  });

  it('expands taxes accordion to show items', async () => {
    const user = userEvent.setup();
    render(<PriceBreakdown lineItems={TAX_ITEMS} totalAmount="$330" />);
    await user.click(screen.getByText('Taxes & fees'));
    expect(screen.getByText('Airport tax')).toBeInTheDocument();
    expect(screen.getByText('$18')).toBeInTheDocument();
  });

  it('applies sticky class when sticky prop is true', () => {
    const { container } = render(
      <PriceBreakdown lineItems={[]} totalAmount="$349" sticky />,
    );
    expect(container.firstChild).toHaveClass('md:sticky');
  });

  it('does not apply sticky class by default', () => {
    const { container } = render(
      <PriceBreakdown lineItems={[]} totalAmount="$349" />,
    );
    expect(container.firstChild).not.toHaveClass('md:sticky');
  });
});

import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Checkout sidebar or payment page panel that itemises base fare, fees, add-ons, taxes, discounts, and promo codes, with a prominent total. Use sticky=true to keep it visible as the user scrolls through a long checkout form.',
    whenNotToUse: 'Post-booking confirmation page — use BookingConfirmation which has the QR code and reference number context. Do not use for non-monetary summaries.',
    alternatives: ['BookingConfirmation — includes total paid in a post-booking read-only view'],
    preferOver: 'Custom price summary panels that duplicate the accordion tax/passenger breakdown and promo badge logic.',
  },
  behavior: {
    states: [
      'sticky=true — component uses sticky positioning for desktop sidebar placement',
      'sticky=false (default) — static positioning',
      'passengerBreakdown provided — collapsible "Passenger details" accordion section shown',
      'taxItems present — collapsible "Taxes & fees" accordion section shown',
      'discountItems present — discount rows shown in green with minus prefix',
      'promoCode + promoDiscount provided — promo row with "PROMO" deal badge shown',
    ],
    interactions: [
      'Passenger details accordion — expand/collapse to see per-type passenger price breakdown',
      'Taxes & fees accordion — expand/collapse to see individual tax line items',
    ],
  },
  accessibility: {
    role: 'generic (div) with aria-label="Price breakdown"',
    keyboardNav: 'Tab through accordion triggers for Passenger details and Taxes & fees. Accordion content is keyboard expandable.',
    ariaAttributes: [
      'aria-label="Price breakdown" on container',
      'Accordion triggers have aria-expanded managed by Radix AccordionTrigger',
    ],
    wcag: ['2.1.1 Keyboard', '1.3.1 Info and Relationships'],
    screenReader: 'Promo code section announces the code label and discount amount. Total row reads "Total" with currency and tax inclusion note as separate text.',
  },
  examples: [
    {
      label: 'Checkout sidebar with passenger breakdown and promo',
      code: `<PriceBreakdown
  sticky
  currency="USD"
  totalAmount="$1,248.00"
  passengerBreakdown={[
    { type: 'Adult', count: 2, priceEach: '$520.00', subtotal: '$1,040.00' },
    { type: 'Child', count: 1, priceEach: '$180.00', subtotal: '$180.00' },
  ]}
  lineItems={[
    { label: 'Base fare', amount: '$1,220.00', type: 'base' },
    { label: 'Seat selection', amount: '$45.00', type: 'addon', description: '3× preferred seats' },
    { label: 'Airport tax', amount: '$38.00', type: 'tax' },
    { label: 'Fuel surcharge', amount: '$22.00', type: 'tax' },
    { label: 'Early bird discount', amount: '−$50.00', type: 'discount' },
  ]}
  promoCode="SUMMER25"
  promoDiscount="$27.00"
/>`,
    },
  ],
};

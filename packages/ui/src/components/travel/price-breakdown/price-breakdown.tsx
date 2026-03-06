'use client';

import { cn } from '../../../utils/cn';
import { Badge } from '../../ui/badge/index';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion/index';
import { Separator } from '../../ui/separator/index';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LineItem {
  label: string;
  amount: string;
  type: 'base' | 'tax' | 'fee' | 'addon' | 'discount' | 'total';
  description?: string;
}

export interface PassengerBreakdown {
  type: 'Adult' | 'Child' | 'Infant';
  count: number;
  priceEach: string;
  subtotal: string;
}

export interface PriceBreakdownProps {
  lineItems: LineItem[];
  passengerBreakdown?: PassengerBreakdown[];
  promoCode?: string;
  promoDiscount?: string;
  currency?: string;
  totalAmount: string;
  /** Makes the component sticky-positioned on desktop */
  sticky?: boolean;
  className?: string;
}

// ─── PriceBreakdown ───────────────────────────────────────────────────────────

export function PriceBreakdown({
  lineItems,
  passengerBreakdown = [],
  promoCode,
  promoDiscount,
  currency = 'USD',
  totalAmount,
  sticky = false,
  className,
}: PriceBreakdownProps) {
  const baseItems = lineItems.filter(i => ['base', 'fee', 'addon'].includes(i.type));
  const taxItems = lineItems.filter(i => i.type === 'tax');
  const discountItems = lineItems.filter(i => i.type === 'discount');

  return (
    <div
      className={cn(
        'travel-price-breakdown',
        sticky && 'travel-price-breakdown--sticky',
        className,
      )}
      aria-label="Price breakdown"
    >
      {/* Header */}
      <div className="travel-price-breakdown-header">
        <h2 className="travel-price-breakdown-title">Price Summary</h2>
      </div>

      <div className="travel-price-breakdown-body">
        {/* Passenger breakdown (collapsible) */}
        {passengerBreakdown.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="passengers" className="travel-price-breakdown-accordion-item">
              <AccordionTrigger className="travel-price-breakdown-accordion-trigger travel-price-breakdown-accordion-trigger--primary">
                Passenger details
              </AccordionTrigger>
              <AccordionContent>
                <div className="travel-price-breakdown-accordion-content">
                  {passengerBreakdown.map((p, i) => (
                    <div key={i} className="travel-price-breakdown-row">
                      <span className="travel-price-breakdown-row-label">
                        {p.count}× {p.type} @ {p.priceEach}
                      </span>
                      <span className="travel-price-breakdown-row-amount travel-price-breakdown-row-amount--strong">{p.subtotal}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Base fare + fees */}
        <div className="travel-price-breakdown-section">
          {baseItems.map((item, i) => (
            <div key={i} className="travel-price-breakdown-row">
              <div>
                <span className="travel-price-breakdown-row-label">{item.label}</span>
                {item.description && (
                  <p className="travel-price-breakdown-row-description">{item.description}</p>
                )}
              </div>
              <span className="travel-price-breakdown-row-amount">{item.amount}</span>
            </div>
          ))}
        </div>

        {/* Taxes (collapsible) */}
        {taxItems.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="taxes" className="travel-price-breakdown-accordion-item">
              <AccordionTrigger className="travel-price-breakdown-accordion-trigger">
                Taxes &amp; fees
              </AccordionTrigger>
              <AccordionContent>
                <div className="travel-price-breakdown-accordion-content">
                  {taxItems.map((item, i) => (
                    <div key={i} className="travel-price-breakdown-row">
                      <span className="travel-price-breakdown-row-label travel-price-breakdown-row-label--subtle">{item.label}</span>
                      <span className="travel-price-breakdown-row-amount travel-price-breakdown-row-amount--muted">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Discounts */}
        {discountItems.map((item, i) => (
          <div key={i} className="travel-price-breakdown-row travel-price-breakdown-row--compact">
            <span className="travel-price-breakdown-discount">{item.label}</span>
            <span className="travel-price-breakdown-discount travel-price-breakdown-discount--strong">{item.amount}</span>
          </div>
        ))}

        {/* Promo code */}
        {promoCode && promoDiscount && (
          <div className="travel-price-breakdown-row travel-price-breakdown-row--compact">
            <span className="travel-price-breakdown-promo">
              <Badge variant="deal" className="travel-price-breakdown-promo-badge">PROMO</Badge>
              {promoCode}
            </span>
            <span className="travel-price-breakdown-discount travel-price-breakdown-discount--strong">−{promoDiscount}</span>
          </div>
        )}

        <Separator className="travel-price-breakdown-separator" />

        {/* Total */}
        <div className="travel-price-breakdown-total">
          <div>
            <p className="travel-price-breakdown-total-label">Total</p>
            <p className="travel-price-breakdown-total-meta">{currency} incl. all taxes</p>
          </div>
          <p className="travel-price-breakdown-total-amount">{totalAmount}</p>
        </div>
      </div>
    </div>
  );
}

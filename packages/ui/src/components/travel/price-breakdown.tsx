'use client';

import { cn } from '../../utils/cn.js';
import { Badge } from '../ui/badge.js';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion.js';
import { Separator } from '../ui/separator.js';

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
        'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
        'bg-[var(--color-surface-card)] overflow-hidden',
        sticky && 'md:sticky md:top-4',
        className,
      )}
      aria-label="Price breakdown"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border-muted)] bg-[var(--color-background-subtle)]">
        <h2 className="text-sm font-semibold text-[var(--color-foreground-default)]">Price Summary</h2>
      </div>

      <div className="p-4 space-y-0">
        {/* Passenger breakdown (collapsible) */}
        {passengerBreakdown.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="passengers" className="border-none">
              <AccordionTrigger className="text-sm py-2 text-[var(--color-foreground-default)]">
                Passenger details
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1.5 pb-2">
                  {passengerBreakdown.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[var(--color-foreground-muted)]">
                        {p.count}× {p.type} @ {p.priceEach}
                      </span>
                      <span className="text-[var(--color-foreground-default)] font-medium">{p.subtotal}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Base fare + fees */}
        <div className="space-y-2 py-2">
          {baseItems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <span className="text-[var(--color-foreground-muted)]">{item.label}</span>
                {item.description && (
                  <p className="text-xs text-[var(--color-foreground-subtle)]">{item.description}</p>
                )}
              </div>
              <span className="text-[var(--color-foreground-default)]">{item.amount}</span>
            </div>
          ))}
        </div>

        {/* Taxes (collapsible) */}
        {taxItems.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="taxes" className="border-none">
              <AccordionTrigger className="text-sm py-2 text-[var(--color-foreground-muted)]">
                Taxes &amp; fees
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1.5 pb-2">
                  {taxItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[var(--color-foreground-subtle)]">{item.label}</span>
                      <span className="text-[var(--color-foreground-muted)]">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Discounts */}
        {discountItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span className="text-[var(--color-success-default)]">{item.label}</span>
            <span className="text-[var(--color-success-default)] font-medium">{item.amount}</span>
          </div>
        ))}

        {/* Promo code */}
        {promoCode && promoDiscount && (
          <div className="flex justify-between text-sm py-1">
            <span className="flex items-center gap-1.5 text-[var(--color-success-default)]">
              <Badge variant="deal" className="text-xs">PROMO</Badge>
              {promoCode}
            </span>
            <span className="text-[var(--color-success-default)] font-medium">−{promoDiscount}</span>
          </div>
        )}

        <Separator className="my-3" />

        {/* Total */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-base font-bold text-[var(--color-foreground-default)]">Total</p>
            <p className="text-xs text-[var(--color-foreground-muted)]">{currency} incl. all taxes</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-foreground-default)]">{totalAmount}</p>
        </div>
      </div>
    </div>
  );
}

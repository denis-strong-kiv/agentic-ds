'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type StepStatus = 'completed' | 'active' | 'upcoming';

export interface BookingStep {
  id: string;
  label: string;
  icon?: React.ReactNode;
  status: StepStatus;
}

export interface BookingStepperProps {
  steps: BookingStep[];
  onStepClick?: (stepId: string) => void;
  className?: string;
  'aria-label'?: string;
}

// ─── Default step icons ───────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// ─── BookingStepper ───────────────────────────────────────────────────────────

export function BookingStepper({ steps, onStepClick, className, 'aria-label': ariaLabel = 'Booking progress' }: BookingStepperProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'w-full overflow-x-auto',
        className,
      )}
    >
      <ol className="flex items-center min-w-max px-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <li className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => step.status === 'completed' && onStepClick?.(step.id)}
                disabled={step.status === 'upcoming'}
                aria-current={step.status === 'active' ? 'step' : undefined}
                aria-label={`${step.label}${step.status === 'completed' ? ' (completed)' : step.status === 'active' ? ' (current)' : ''}`}
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)]',
                  step.status === 'completed' && [
                    'bg-[var(--color-primary-default)] border-[var(--color-primary-default)]',
                    'text-[var(--color-primary-foreground)]',
                    'cursor-pointer hover:opacity-90',
                  ],
                  step.status === 'active' && [
                    'bg-white border-[var(--color-primary-default)]',
                    'text-[var(--color-primary-default)]',
                    'ring-4 ring-[var(--color-primary-default)]/20',
                  ],
                  step.status === 'upcoming' && [
                    'bg-[var(--color-background-subtle)] border-[var(--color-border-muted)]',
                    'text-[var(--color-foreground-subtle)]',
                    'cursor-not-allowed',
                  ],
                )}
              >
                {step.status === 'completed' ? (
                  <CheckIcon />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>
              <span
                className={cn(
                  'text-xs font-medium text-center whitespace-nowrap',
                  step.status === 'active' && 'text-[var(--color-primary-default)]',
                  step.status === 'completed' && 'text-[var(--color-foreground-default)]',
                  step.status === 'upcoming' && 'text-[var(--color-foreground-subtle)]',
                )}
              >
                {step.label}
              </span>
            </li>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                aria-hidden
                className={cn(
                  'h-0.5 flex-1 mx-2 min-w-[32px]',
                  steps[index + 1].status === 'upcoming'
                    ? 'bg-[var(--color-border-muted)]'
                    : 'bg-[var(--color-primary-default)]',
                )}
              />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

// ─── Default booking steps factory ───────────────────────────────────────────

export function createBookingSteps(activeStepIndex: number): BookingStep[] {
  const stepDefs = [
    { id: 'search', label: 'Search' },
    { id: 'select', label: 'Select' },
    { id: 'customize', label: 'Customize' },
    { id: 'passengers', label: 'Passengers' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmation', label: 'Confirmation' },
  ];

  return stepDefs.map((step, i) => ({
    ...step,
    status: i < activeStepIndex ? 'completed' : i === activeStepIndex ? 'active' : 'upcoming',
  }));
}

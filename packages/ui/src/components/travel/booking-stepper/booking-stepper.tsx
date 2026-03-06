'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn.js';

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
  <svg className="travel-booking-stepper-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// ─── BookingStepper ───────────────────────────────────────────────────────────

export function BookingStepper({ steps, onStepClick, className, 'aria-label': ariaLabel = 'Booking progress' }: BookingStepperProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'travel-booking-stepper',
        className,
      )}
    >
      <ol className="travel-booking-stepper-list">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <li className="travel-booking-stepper-item">
              <button
                type="button"
                onClick={() => step.status === 'completed' && onStepClick?.(step.id)}
                disabled={step.status === 'upcoming'}
                aria-current={step.status === 'active' ? 'step' : undefined}
                aria-label={`${step.label}${step.status === 'completed' ? ' (completed)' : step.status === 'active' ? ' (current)' : ''}`}
                className={cn(
                  'travel-booking-stepper-step-btn',
                  step.status === 'completed' && [
                    'travel-booking-stepper-step-btn--completed',
                  ],
                  step.status === 'active' && [
                    'travel-booking-stepper-step-btn--active',
                  ],
                  step.status === 'upcoming' && [
                    'travel-booking-stepper-step-btn--upcoming',
                  ],
                )}
              >
                {step.status === 'completed' ? (
                  <CheckIcon />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span className="travel-booking-stepper-step-index">{index + 1}</span>
                )}
              </button>
              <span
                className={cn(
                  'travel-booking-stepper-step-label',
                  step.status === 'active' && 'travel-booking-stepper-step-label--active',
                  step.status === 'completed' && 'travel-booking-stepper-step-label--completed',
                  step.status === 'upcoming' && 'travel-booking-stepper-step-label--upcoming',
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
                  'travel-booking-stepper-connector',
                  steps[index + 1].status === 'upcoming'
                    ? 'travel-booking-stepper-connector--upcoming'
                    : 'travel-booking-stepper-connector--complete',
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

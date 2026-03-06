'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn.js';
import { Button } from '../../ui/button/index.js';
import { Input } from '../../ui/input/index.js';
import { Label } from '../../ui/label/index.js';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui/select/index.js';
import { Checkbox } from '../../ui/checkbox/index.js';
import { Textarea } from '../../ui/textarea/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PassengerData {
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Prof';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  email: string;
  phone: string;
  frequentFlyerNumber?: string;
  mealPreference?: string;
  specialRequests?: string;
  wheelchairAssistance?: boolean;
}

type PassengerErrors = Partial<Record<keyof PassengerData, string>>;

export interface PassengerFormProps {
  index: number;
  type: 'Adult' | 'Child' | 'Infant';
  initialData?: Partial<PassengerData>;
  onSave?: (data: PassengerData) => void;
  onCopyFromPrimary?: () => Partial<PassengerData>;
  isPrimary?: boolean;
  className?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(data: Partial<PassengerData>): PassengerErrors {
  const errors: PassengerErrors = {};
  if (!data.firstName?.trim()) errors.firstName = 'First name is required';
  if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  if (!data.nationality) errors.nationality = 'Nationality is required';
  if (!data.passportNumber?.trim()) errors.passportNumber = 'Passport number is required';
  if (!data.passportExpiry) errors.passportExpiry = 'Passport expiry is required';
  if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Valid email is required';
  if (!data.phone?.trim()) errors.phone = 'Phone number is required';
  return errors;
}

// ─── PassengerForm ────────────────────────────────────────────────────────────

export function PassengerForm({
  index,
  type,
  initialData = {},
  onSave,
  onCopyFromPrimary,
  isPrimary = false,
  className,
}: PassengerFormProps) {
  const [data, setData] = React.useState<Partial<PassengerData>>(initialData);
  const [errors, setErrors] = React.useState<PassengerErrors>({});
  const formId = `passenger-${index}`;

  function update<K extends keyof PassengerData>(field: K, value: PassengerData[K]) {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function handleSave() {
    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave?.(data as PassengerData);
  }

  function handleCopyFromPrimary() {
    const copied = onCopyFromPrimary?.() ?? {};
    setData(prev => ({ ...prev, ...copied }));
    setErrors({});
  }

  return (
    <fieldset
      className={cn(
        'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
        'bg-[var(--color-surface-card)] p-4',
        className,
      )}
      aria-label={`${type} ${index + 1} details`}
    >
      <legend className="px-2 text-sm font-semibold text-[var(--color-foreground-default)]">
        {isPrimary ? 'Primary Traveler' : `${type} ${index + 1}`}
      </legend>

      {/* Copy from primary */}
      {!isPrimary && onCopyFromPrimary && (
        <div className="mb-4">
          <Button type="button" variant="outline" size="sm" onClick={handleCopyFromPrimary}>
            Copy from primary traveler
          </Button>
        </div>
      )}

      {/* Personal details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div>
          <Label htmlFor={`${formId}-title`} required>Title</Label>
          <Select {...(data.title !== undefined ? { value: data.title } : {})} onValueChange={v => update('title', v as PassengerData['title'])}>
            <SelectTrigger id={`${formId}-title`}>
              <SelectValue placeholder="Title" />
            </SelectTrigger>
            <SelectContent>
              {(['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'] as PassengerData['title'][]).map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${formId}-firstName`} required>First Name</Label>
          <Input
            id={`${formId}-firstName`}
            value={data.firstName ?? ''}
            onChange={e => update('firstName', e.target.value)}
            error={errors.firstName}
            placeholder="As on passport"
          />
        </div>
        <div>
          <Label htmlFor={`${formId}-lastName`} required>Last Name</Label>
          <Input
            id={`${formId}-lastName`}
            value={data.lastName ?? ''}
            onChange={e => update('lastName', e.target.value)}
            error={errors.lastName}
            placeholder="As on passport"
          />
        </div>
        <div>
          <Label htmlFor={`${formId}-dob`} required>Date of Birth</Label>
          <Input
            id={`${formId}-dob`}
            type="date"
            value={data.dateOfBirth ?? ''}
            onChange={e => update('dateOfBirth', e.target.value)}
            error={errors.dateOfBirth}
          />
        </div>
      </div>

      {/* Passport details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <Label htmlFor={`${formId}-nationality`} required>Nationality</Label>
          <Input
            id={`${formId}-nationality`}
            value={data.nationality ?? ''}
            onChange={e => update('nationality', e.target.value)}
            error={errors.nationality}
            placeholder="e.g. US"
          />
        </div>
        <div>
          <Label htmlFor={`${formId}-passport`} required>Passport / ID Number</Label>
          <Input
            id={`${formId}-passport`}
            value={data.passportNumber ?? ''}
            onChange={e => update('passportNumber', e.target.value)}
            error={errors.passportNumber}
            placeholder="Passport number"
          />
        </div>
        <div>
          <Label htmlFor={`${formId}-expiry`} required>Passport Expiry</Label>
          <Input
            id={`${formId}-expiry`}
            type="date"
            value={data.passportExpiry ?? ''}
            onChange={e => update('passportExpiry', e.target.value)}
            error={errors.passportExpiry}
          />
        </div>
      </div>

      {/* Contact (primary traveler only) */}
      {isPrimary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <Label htmlFor={`${formId}-email`} required>Email</Label>
            <Input
              id={`${formId}-email`}
              type="email"
              value={data.email ?? ''}
              onChange={e => update('email', e.target.value)}
              error={errors.email}
              placeholder="booking@example.com"
            />
          </div>
          <div>
            <Label htmlFor={`${formId}-phone`} required>Phone</Label>
            <Input
              id={`${formId}-phone`}
              type="tel"
              value={data.phone ?? ''}
              onChange={e => update('phone', e.target.value)}
              error={errors.phone}
              placeholder="+1 555 000 0000"
            />
          </div>
        </div>
      )}

      {/* Optional extras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <Label htmlFor={`${formId}-ffn`}>Frequent Flyer Number <span className="text-[var(--color-foreground-subtle)]">(optional)</span></Label>
          <Input
            id={`${formId}-ffn`}
            value={data.frequentFlyerNumber ?? ''}
            onChange={e => update('frequentFlyerNumber', e.target.value)}
            placeholder="FF123456789"
          />
        </div>
        <div>
          <Label htmlFor={`${formId}-meal`}>Meal Preference <span className="text-[var(--color-foreground-subtle)]">(optional)</span></Label>
          <Select {...(data.mealPreference !== undefined ? { value: data.mealPreference } : {})} onValueChange={v => update('mealPreference', v)}>
            <SelectTrigger id={`${formId}-meal`}>
              <SelectValue placeholder="Select meal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="halal">Halal</SelectItem>
              <SelectItem value="kosher">Kosher</SelectItem>
              <SelectItem value="gluten-free">Gluten-Free</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Wheelchair */}
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id={`${formId}-wheelchair`}
          checked={data.wheelchairAssistance ?? false}
          onCheckedChange={checked => update('wheelchairAssistance', checked === true)}
        />
        <Label htmlFor={`${formId}-wheelchair`} className="text-sm font-normal cursor-pointer">
          Wheelchair assistance required
        </Label>
      </div>

      {/* Special requests */}
      <div className="mb-4">
        <Label htmlFor={`${formId}-requests`}>Special Requests <span className="text-[var(--color-foreground-subtle)]">(optional)</span></Label>
        <Textarea
          id={`${formId}-requests`}
          value={data.specialRequests ?? ''}
          onChange={e => update('specialRequests', e.target.value)}
          placeholder="Any special accommodations, accessibility needs, etc."
          showCount
          maxLength={500}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave}>Save Passenger</Button>
      </div>
    </fieldset>
  );
}

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@travel/ui/components/ui/input';
import { Label } from '@travel/ui/components/ui/label';
import React from 'react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: { placeholder: 'Enter value…' },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: 'john@example.com' } };
export const WithError: Story = {
  args: { id: 'email', placeholder: 'Email', error: 'Invalid email address' },
};
export const Disabled: Story = { args: { disabled: true, value: 'Disabled value' } };

export const WithLabel: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Label htmlFor="name" required>Full Name</Label>
      <Input id="name" placeholder="As on passport" />
    </div>
  ),
};

export const WithLabelAndError: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Label htmlFor="email" required>Email</Label>
      <Input id="email" placeholder="you@example.com" error="Please enter a valid email" />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 320 }}>
      <div>
        <Label htmlFor="s1">Default</Label>
        <Input id="s1" placeholder="Default" />
      </div>
      <div>
        <Label htmlFor="s2">Filled</Label>
        <Input id="s2" defaultValue="paris@example.com" />
      </div>
      <div>
        <Label htmlFor="s3">Error</Label>
        <Input id="s3" placeholder="Email" error="This field is required" />
      </div>
      <div>
        <Label htmlFor="s4">Disabled</Label>
        <Input id="s4" disabled value="Disabled" />
      </div>
    </div>
  ),
};

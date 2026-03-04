import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@travel/ui/components/ui/icon';
import {
  Plane, Hotel, Car, Map, Globe, Compass,
  Luggage, Ticket, Receipt, CreditCard,
  Search, Filter, SlidersHorizontal,
  Bell, BellOff, Star, Heart,
  CircleCheck, CircleAlert, TriangleAlert, Info,
  ChevronDown, ChevronRight, ChevronLeft, X,
  Calendar, Clock, Users, User,
  Wifi, Coffee, Utensils, Dumbbell,
  ShieldCheck, BadgeCheck, Headphones,
} from 'lucide-react';

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Icon>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: { icon: Plane, size: 'md' },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex items-end gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon icon={Plane} size={size} className="text-[var(--color-foreground-default)]" />
          <span className="text-xs text-[var(--color-foreground-muted)]">{size}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Travel ───────────────────────────────────────────────────────────────────

function IconGrid({ icons }: { icons: { icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number }>; name: string }[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4">
      {icons.map(({ icon, name }) => (
        <div key={name} className="flex flex-col items-center gap-2 rounded-[var(--shape-preset-card)] border border-[var(--color-border-muted)] p-3">
          <Icon icon={icon as Parameters<typeof Icon>[0]['icon']} size="md" className="text-[var(--color-foreground-default)]" />
          <span className="text-center text-xs text-[var(--color-foreground-muted)]">{name}</span>
        </div>
      ))}
    </div>
  );
}

export const TravelIcons: Story = {
  name: 'Travel',
  render: () => (
    <IconGrid icons={[
      { icon: Plane, name: 'Plane' },
      { icon: Hotel, name: 'Hotel' },
      { icon: Car, name: 'Car' },
      { icon: Map, name: 'Map' },
      { icon: Globe, name: 'Globe' },
      { icon: Compass, name: 'Compass' },
      { icon: Luggage, name: 'Luggage' },
      { icon: Ticket, name: 'Ticket' },
      { icon: Calendar, name: 'Calendar' },
      { icon: Clock, name: 'Clock' },
      { icon: Users, name: 'Passengers' },
      { icon: User, name: 'Traveller' },
    ]} />
  ),
};

export const BookingIcons: Story = {
  name: 'Booking & payments',
  render: () => (
    <IconGrid icons={[
      { icon: CreditCard, name: 'CreditCard' },
      { icon: Receipt, name: 'Receipt' },
      { icon: ShieldCheck, name: 'ShieldCheck' },
      { icon: BadgeCheck, name: 'BadgeCheck' },
      { icon: Star, name: 'Star' },
      { icon: Heart, name: 'Wishlist' },
      { icon: Bell, name: 'Bell' },
      { icon: BellOff, name: 'BellOff' },
      { icon: Headphones, name: 'Support' },
    ]} />
  ),
};

export const AmenitiesIcons: Story = {
  name: 'Amenities',
  render: () => (
    <IconGrid icons={[
      { icon: Wifi, name: 'Wifi' },
      { icon: Coffee, name: 'Coffee' },
      { icon: Utensils, name: 'Dining' },
      { icon: Dumbbell, name: 'Gym' },
    ]} />
  ),
};

export const UIIcons: Story = {
  name: 'UI & navigation',
  render: () => (
    <IconGrid icons={[
      { icon: Search, name: 'Search' },
      { icon: Filter, name: 'Filter' },
      { icon: SlidersHorizontal, name: 'Sliders' },
      { icon: ChevronDown, name: 'ChevronDown' },
      { icon: ChevronRight, name: 'ChevronRight' },
      { icon: ChevronLeft, name: 'ChevronLeft' },
      { icon: X, name: 'Close' },
    ]} />
  ),
};

export const StatusIcons: Story = {
  name: 'Status & feedback',
  render: () => (
    <div className="flex gap-6">
      <div className="flex items-center gap-2">
        <Icon icon={CircleCheck} size="md" className="text-[var(--color-success-default)]" />
        <span className="text-sm text-[var(--color-foreground-default)]">Confirmed</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={Info} size="md" className="text-[var(--color-info-default)]" />
        <span className="text-sm text-[var(--color-foreground-default)]">Info</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={TriangleAlert} size="md" className="text-[var(--color-warning-default)]" />
        <span className="text-sm text-[var(--color-foreground-default)]">Warning</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={CircleAlert} size="md" className="text-[var(--color-error-default)]" />
        <span className="text-sm text-[var(--color-foreground-default)]">Error</span>
      </div>
    </div>
  ),
};

// ─── Accessibility ─────────────────────────────────────────────────────────────

export const Accessible: Story = {
  name: 'Standalone (with label)',
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--color-foreground-muted)]">
        Icons with a <code>label</code> prop are announced by screen readers — use for standalone icons outside a button.
      </p>
      <div className="flex gap-4">
        <Icon icon={Plane} size="lg" label="Flight" className="text-[var(--color-primary-default)]" />
        <Icon icon={Bell} size="lg" label="Notifications" className="text-[var(--color-foreground-default)]" />
        <Icon icon={ShieldCheck} size="lg" label="Secure booking" className="text-[var(--color-success-default)]" />
      </div>
    </div>
  ),
};

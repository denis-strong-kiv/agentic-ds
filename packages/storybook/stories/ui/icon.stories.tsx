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
    <div className="sb-row-end-lg">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <div key={size} className="sb-stack-center-sm">
          <Icon icon={Plane} size={size} className="sb-text-foreground-default" />
          <span className="sb-caption-muted">{size}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Travel ───────────────────────────────────────────────────────────────────

function IconGrid({ icons }: { icons: { icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number }>; name: string }[] }) {
  return (
    <div className="sb-icon-grid">
      {icons.map(({ icon, name }) => (
        <div key={name} className="sb-icon-grid-item">
          <Icon icon={icon as Parameters<typeof Icon>[0]['icon']} size="md" className="sb-text-foreground-default" />
          <span className="sb-caption-muted sb-text-center">{name}</span>
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
    <div className="sb-row-lg">
      <div className="sb-row-sm">
        <Icon icon={CircleCheck} size="md" className="sb-text-success-default" />
        <span className="sb-text-sm-default">Confirmed</span>
      </div>
      <div className="sb-row-sm">
        <Icon icon={Info} size="md" className="sb-text-info-default" />
        <span className="sb-text-sm-default">Info</span>
      </div>
      <div className="sb-row-sm">
        <Icon icon={TriangleAlert} size="md" className="sb-text-warning-default" />
        <span className="sb-text-sm-default">Warning</span>
      </div>
      <div className="sb-row-sm">
        <Icon icon={CircleAlert} size="md" className="sb-text-error-default" />
        <span className="sb-text-sm-default">Error</span>
      </div>
    </div>
  ),
};

// ─── Accessibility ─────────────────────────────────────────────────────────────

export const Accessible: Story = {
  name: 'Standalone (with label)',
  render: () => (
    <div className="sb-stack-md">
      <p className="sb-text-sm-muted">
        Icons with a <code>label</code> prop are announced by screen readers — use for standalone icons outside a button.
      </p>
      <div className="sb-row-md">
        <Icon icon={Plane} size="lg" label="Flight" className="sb-text-primary-default" />
        <Icon icon={Bell} size="lg" label="Notifications" className="sb-text-foreground-default" />
        <Icon icon={ShieldCheck} size="lg" label="Secure booking" className="sb-text-success-default" />
      </div>
    </div>
  ),
};

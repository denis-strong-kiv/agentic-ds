import type { Meta, StoryObj } from '@storybook/react';
import { NavBar } from '@travel/ui/components/ui/nav-bar';

const meta: Meta<typeof NavBar> = {
  title: 'UI/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof NavBar>;

export const WithSearch: Story = {
  name: 'With search pill',
  args: {
    brandName: 'TravelCo',
    search: { route: 'New York to London', dates: 'Oct 20 – 27', passengers: 1 },
    supportPhone: '855-706-2925',
    onSearchClick: () => {},
    onAccountClick: () => {},
    onMenuClick: () => {},
  },
};

export const BrandOnly: Story = {
  name: 'Brand only (no search)',
  args: {
    brandName: 'TravelCo',
    supportPhone: '855-706-2925',
    onAccountClick: () => {},
    onMenuClick: () => {},
  },
};

export const MultiplePassengers: Story = {
  name: 'Multiple passengers',
  args: {
    brandName: 'TravelCo',
    search: { route: 'Dubai to Tokyo', dates: 'Dec 1 – 14', passengers: 3 },
    supportPhone: '855-706-2925',
    onSearchClick: () => {},
    onAccountClick: () => {},
    onMenuClick: () => {},
  },
};

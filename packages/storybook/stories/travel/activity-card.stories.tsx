import type { Meta, StoryObj } from '@storybook/react';
import { ActivityCard } from '@travel/ui/components/travel/activity-card';

const meta: Meta<typeof ActivityCard> = {
  title: 'Travel/ActivityCard',
  component: ActivityCard,
  tags: ['autodocs'],
  args: {
    title: 'Skip-the-Line Colosseum Tour with Underground Access',
    category: 'Tour',
    duration: '3 hours',
    pricePerPerson: '$89',
    currency: 'USD',
    onBook: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ActivityCard>;

export const Default: Story = {
  args: {
    description: 'Explore the iconic Colosseum with a knowledgeable guide and skip the long queues.',
    difficulty: 'Easy',
    ratingScore: 4.8,
    reviewCount: 3247,
    instantConfirmation: true,
    freeCancellation: true,
    availableDates: { earliest: 'Mar 10', count: 24 },
  },
};

export const NoImage: Story = {
  name: 'No image (placeholder)',
  args: {
    description: 'A city highlights tour by bike through historic streets.',
    difficulty: 'Moderate',
    ratingScore: 4.5,
    reviewCount: 822,
  },
};

export const ChallengingSport: Story = {
  name: 'Challenging — Sport',
  args: {
    title: 'Mount Fuji Sunrise Hiking Expedition',
    category: 'Sport',
    duration: '12 hours',
    difficulty: 'Challenging',
    ratingScore: 4.9,
    reviewCount: 541,
    pricePerPerson: '$129',
    description: 'Guided ascent from Station 5 to the crater rim, arriving in time for sunrise.',
    freeCancellation: false,
    instantConfirmation: false,
  },
};

export const FoodAndDrink: Story = {
  name: 'Food & Drink',
  args: {
    title: 'Tokyo Street Food Night Tour',
    category: 'Food & Drink',
    duration: '4 hours',
    difficulty: 'Easy',
    ratingScore: 4.7,
    reviewCount: 1890,
    pricePerPerson: '$65',
    description: 'Sample ramen, yakitori, takoyaki and more across Shinjuku and Shibuya.',
    instantConfirmation: true,
    freeCancellation: true,
    availableDates: { earliest: 'Mar 8', count: 30 },
  },
};

export const WellnessExperience: Story = {
  name: 'Wellness',
  args: {
    title: 'Traditional Thai Massage & Spa Day',
    category: 'Wellness',
    duration: '2.5 hours',
    ratingScore: 4.6,
    reviewCount: 2104,
    pricePerPerson: '$55',
    instantConfirmation: true,
    freeCancellation: true,
    availableDates: { earliest: 'Mar 7', count: 42 },
  },
};

export const MinimalProps: Story = {
  name: 'Minimal props (required only)',
  args: {
    title: 'Airport Transfer',
    category: 'Transfer',
    duration: '45 min',
    pricePerPerson: '$35',
  },
};

export const CardGrid: Story = {
  name: 'Card grid (3-up)',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      <ActivityCard
        title="Skip-the-Line Colosseum Tour"
        category="Tour"
        duration="3 hours"
        difficulty="Easy"
        ratingScore={4.8}
        reviewCount={3247}
        pricePerPerson="$89"
        instantConfirmation
        freeCancellation
        onBook={() => {}}
      />
      <ActivityCard
        title="Mount Fuji Hiking Expedition"
        category="Sport"
        duration="12 hours"
        difficulty="Challenging"
        ratingScore={4.9}
        reviewCount={541}
        pricePerPerson="$129"
        onBook={() => {}}
      />
      <ActivityCard
        title="Tokyo Street Food Night Tour"
        category="Food & Drink"
        duration="4 hours"
        difficulty="Easy"
        ratingScore={4.7}
        reviewCount={1890}
        pricePerPerson="$65"
        instantConfirmation
        freeCancellation
        availableDates={{ earliest: 'Mar 8', count: 30 }}
        onBook={() => {}}
      />
    </div>
  ),
};

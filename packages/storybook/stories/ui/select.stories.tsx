import type { Meta, StoryObj } from '@storybook/react';
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectItem, SelectGroup, SelectLabel, SelectSeparator,
} from '@travel/ui/components/ui/select';

const meta: Meta = {
  title: 'UI/Select',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const CabinClass: Story = {
  name: 'Cabin class',
  render: () => (
    <Select defaultValue="economy">
      <SelectTrigger className="sb-w-48" aria-label="Cabin class">
        <SelectValue placeholder="Select cabin" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="economy">Economy</SelectItem>
        <SelectItem value="premium-economy">Premium Economy</SelectItem>
        <SelectItem value="business">Business</SelectItem>
        <SelectItem value="first">First</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  name: 'Grouped with labels',
  render: () => (
    <Select>
      <SelectTrigger className="sb-w-56" aria-label="Sort results">
        <SelectValue placeholder="Sort by…" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Price</SelectLabel>
          <SelectItem value="price-asc">Lowest first</SelectItem>
          <SelectItem value="price-desc">Highest first</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Duration</SelectLabel>
          <SelectItem value="duration-asc">Shortest first</SelectItem>
          <SelectItem value="duration-desc">Longest first</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Departure</SelectLabel>
          <SelectItem value="depart-early">Earliest departure</SelectItem>
          <SelectItem value="depart-late">Latest departure</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Placeholder: Story = {
  name: 'Unselected placeholder',
  render: () => (
    <Select>
      <SelectTrigger className="sb-w-48" aria-label="Number of bags">
        <SelectValue placeholder="Number of bags" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">No checked bags</SelectItem>
        <SelectItem value="1">1 bag (23 kg)</SelectItem>
        <SelectItem value="2">2 bags (23 kg each)</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="sb-w-48" aria-label="Upgrades unavailable">
        <SelectValue placeholder="No upgrades available" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="premium">Premium Economy</SelectItem>
      </SelectContent>
    </Select>
  ),
};

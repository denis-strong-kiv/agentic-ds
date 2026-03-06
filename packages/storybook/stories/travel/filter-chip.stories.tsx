import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterChip } from '@travel/ui/components/travel/filter-chip';
import { Slider } from '@travel/ui/components/ui/slider';
import { Checkbox } from '@travel/ui/components/ui/checkbox';
import { Label } from '@travel/ui/components/ui/label';

const meta: Meta<typeof FilterChip> = {
  title: 'Travel/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '1.5rem' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {
  args: { label: 'Price' },
};

export const Active: Story = {
  args: { label: 'Price', isActive: true, activeLabel: 'Up to $800', onClear: () => {} },
};

export const AllFilters: Story = {
  name: 'All filters chip',
  args: { label: 'All filters', isAllFilters: true },
};

export const AllFiltersWithCount: Story = {
  name: 'All filters — with count',
  args: { label: 'All filters', isAllFilters: true, isActive: true, count: 3 },
};

export const WithPricePopover: Story = {
  name: 'With price popover',
  render: () => {
    const [range, setRange] = useState<[number, number]>([0, 2000]);
    const isActive = range[0] > 0 || range[1] < 2000;
    return (
      <FilterChip
        label="Price"
        isActive={isActive}
        {...(isActive ? { activeLabel: `Up to $${range[1]}` } : {})}
        {...(isActive ? { onClear: () => setRange([0, 2000]) } : {})}
        popoverContent={
          <div style={{ padding: '1rem', width: '16rem' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Price range</p>
            <Slider
              min={0}
              max={2000}
              step={10}
              value={range}
              onValueChange={v => setRange(v as [number, number])}
              showValue
              formatValue={v => `$${v}`}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--color-foreground-muted)' }}>
              <span>$0</span><span>$2000+</span>
            </div>
          </div>
        }
      />
    );
  },
};

export const WithStopsPopover: Story = {
  name: 'With stops popover',
  render: () => {
    const [stops, setStops] = useState<string[]>([]);
    const toggle = (v: string) => setStops(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v]);
    return (
      <FilterChip
        label="Stops"
        isActive={stops.length > 0}
        {...(stops.length > 0 ? { activeLabel: `${stops.length} selected`, onClear: () => setStops([]) } : {})}
        popoverContent={
          <div style={{ padding: '1rem', width: '12rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { value: 'nonstop', label: 'Non-stop' },
              { value: '1-stop', label: '1 Stop' },
              { value: '2-plus', label: '2+ Stops' },
            ].map(opt => (
              <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox
                  id={opt.value}
                  checked={stops.includes(opt.value)}
                  onCheckedChange={() => toggle(opt.value)}
                />
                <Label htmlFor={opt.value}>{opt.label}</Label>
              </div>
            ))}
          </div>
        }
      />
    );
  },
};

export const ChipStrip: Story = {
  name: 'Chip strip — all states',
  render: () => (
    <>
      <FilterChip label="All filters" isAllFilters isActive count={2} />
      <FilterChip label="Price" isActive activeLabel="Up to $800" onClear={() => {}} />
      <FilterChip label="Stops" isActive activeLabel="Nonstop" onClear={() => {}} />
      <FilterChip label="Airlines" />
      <FilterChip label="Bags" />
      <FilterChip label="Departure" />
    </>
  ),
};

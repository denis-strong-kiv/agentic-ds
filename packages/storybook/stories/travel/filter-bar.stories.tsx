import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from '@travel/ui/components/travel/filter-bar';
import { createDefaultFilters } from '@travel/ui/components/travel/filter-panel';
import type { FilterState, SortOption } from '@travel/ui/components/travel/filter-panel';

const AIRLINES = [
  { value: 'UA', label: 'United Airlines' },
  { value: 'BA', label: 'British Airways' },
  { value: 'LX', label: 'Swiss' },
  { value: 'AC', label: 'Air Canada' },
];

function ControlledFilterBar(props: Partial<React.ComponentProps<typeof FilterBar>>) {
  const [filters, setFilters] = useState<FilterState>(createDefaultFilters(2000));
  const [sortBy, setSortBy] = useState<SortOption>('cheap-and-fast');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <FilterBar
      filters={filters}
      onChange={setFilters}
      sortBy={sortBy}
      onSortChange={setSortBy}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(v => !v)}
      airlineOptions={AIRLINES}
      maxPrice={2000}
      {...props}
    />
  );
}

const meta: Meta<typeof FilterBar> = {
  title: 'Travel/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  render: () => <ControlledFilterBar />,
};

export const SidebarOpen: Story = {
  name: 'Sidebar open state',
  render: () => {
    const [filters, setFilters] = useState<FilterState>(createDefaultFilters(2000));
    const [sortBy, setSortBy] = useState<SortOption>('cheap-and-fast');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
      <FilterBar
        filters={filters}
        onChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        airlineOptions={AIRLINES}
        maxPrice={2000}
      />
    );
  },
};

export const WithActiveFilters: Story = {
  name: 'With active filters',
  render: () => {
    const [filters, setFilters] = useState<FilterState>({
      ...createDefaultFilters(2000),
      priceRange: [0, 800],
      stops: ['nonstop'],
      airlines: ['BA', 'UA'],
    });
    const [sortBy, setSortBy] = useState<SortOption>('lowest-price');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
      <FilterBar
        filters={filters}
        onChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        airlineOptions={AIRLINES}
        maxPrice={2000}
      />
    );
  },
};

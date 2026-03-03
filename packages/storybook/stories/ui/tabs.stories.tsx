import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@travel/ui/components/ui/tabs';
import React from 'react';

const meta: Meta = {
  title: 'UI/Tabs',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="flights" style={{ width: 480 }}>
      <TabsList>
        <TabsTrigger value="flights">Flights</TabsTrigger>
        <TabsTrigger value="hotels">Hotels</TabsTrigger>
        <TabsTrigger value="cars">Cars</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
      </TabsList>
      <TabsContent value="flights">
        <div style={{ padding: '1rem', color: 'var(--color-foreground-muted)', fontSize: 14 }}>
          Search for flights between any two destinations worldwide.
        </div>
      </TabsContent>
      <TabsContent value="hotels">
        <div style={{ padding: '1rem', color: 'var(--color-foreground-muted)', fontSize: 14 }}>
          Find hotels, hostels, and vacation rentals.
        </div>
      </TabsContent>
      <TabsContent value="cars">
        <div style={{ padding: '1rem', color: 'var(--color-foreground-muted)', fontSize: 14 }}>
          Rent a car from top providers at any destination.
        </div>
      </TabsContent>
      <TabsContent value="activities">
        <div style={{ padding: '1rem', color: 'var(--color-foreground-muted)', fontSize: 14 }}>
          Discover experiences, tours, and local activities.
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="departures" style={{ width: 400 }}>
      <TabsList>
        <TabsTrigger value="departures" icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        }>Departures</TabsTrigger>
        <TabsTrigger value="arrivals" icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        }>Arrivals</TabsTrigger>
      </TabsList>
      <TabsContent value="departures">
        <div style={{ padding: '1rem', fontSize: 14, color: 'var(--color-foreground-muted)' }}>
          Upcoming departures from your selected airport.
        </div>
      </TabsContent>
      <TabsContent value="arrivals">
        <div style={{ padding: '1rem', fontSize: 14, color: 'var(--color-foreground-muted)' }}>
          Recent arrivals at your selected airport.
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithBadgeCount: Story = {
  render: () => (
    <Tabs defaultValue="results" style={{ width: 420 }}>
      <TabsList>
        <TabsTrigger value="results" badge={124}>All Results</TabsTrigger>
        <TabsTrigger value="direct" badge={18}>Direct Only</TabsTrigger>
        <TabsTrigger value="saved">Saved</TabsTrigger>
      </TabsList>
      <TabsContent value="results">
        <div style={{ padding: '1rem', fontSize: 14, color: 'var(--color-foreground-muted)' }}>
          124 flights found for your search.
        </div>
      </TabsContent>
      <TabsContent value="direct">
        <div style={{ padding: '1rem', fontSize: 14, color: 'var(--color-foreground-muted)' }}>
          18 direct flights available.
        </div>
      </TabsContent>
      <TabsContent value="saved">
        <div style={{ padding: '1rem', fontSize: 14, color: 'var(--color-foreground-muted)' }}>
          No saved flights yet.
        </div>
      </TabsContent>
    </Tabs>
  ),
};

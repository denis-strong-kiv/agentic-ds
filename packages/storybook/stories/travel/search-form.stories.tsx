import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { useRef, useState } from 'react';
import { TravelSearchForm } from '@travel/ui/components/travel/search-form';
import type { TravelSearchPayload } from '@travel/ui/components/travel/search-form';

const AIRPORTS = [
  { iata: 'JFK', city: 'New York', country: 'United States' },
  { iata: 'LHR', city: 'London', country: 'United Kingdom' },
  { iata: 'CDG', city: 'Paris', country: 'France' },
  { iata: 'DXB', city: 'Dubai', country: 'United Arab Emirates' },
  { iata: 'SIN', city: 'Singapore', country: 'Singapore' },
  { iata: 'LAX', city: 'Los Angeles', country: 'United States' },
  { iata: 'NRT', city: 'Tokyo', country: 'Japan' },
  { iata: 'SYD', city: 'Sydney', country: 'Australia' },
  { iata: 'AMS', city: 'Amsterdam', country: 'Netherlands' },
  { iata: 'FRA', city: 'Frankfurt', country: 'Germany' },
  { iata: 'IST', city: 'Istanbul', country: 'Turkey' },
  { iata: 'DOH', city: 'Doha', country: 'Qatar' },
  { iata: 'BKK', city: 'Bangkok', country: 'Thailand' },
  { iata: 'HKG', city: 'Hong Kong', country: 'China' },
  { iata: 'ICN', city: 'Seoul', country: 'South Korea' },
  { iata: 'MUC', city: 'Munich', country: 'Germany' },
  { iata: 'MAD', city: 'Madrid', country: 'Spain' },
  { iata: 'BCN', city: 'Barcelona', country: 'Spain' },
  { iata: 'FCO', city: 'Rome', country: 'Italy' },
  { iata: 'ZRH', city: 'Zurich', country: 'Switzerland' },
];

// ─── Resizable preview wrapper ────────────────────────────────────────────────
// Drag the right handle to test responsiveness at any container width.

function ResizablePreview({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = ref.current?.offsetWidth ?? 800;

    function onMove(e: MouseEvent) {
      if (!dragging.current) return;
      setWidth(Math.max(320, startW.current + (e.clientX - startX.current)));
    }
    function onUp() {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: width != null ? `${width}px` : '100%',
        maxWidth: '100%',
        minWidth: 320,
        padding: '2rem 3rem',
        boxSizing: 'border-box',
      }}
    >
      {children}

      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        title="Drag to resize"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 12,
          cursor: 'ew-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        <div style={{
          width: 3,
          height: 32,
          borderRadius: 2,
          background: 'rgba(0,0,0,0.18)',
        }} />
      </div>

      {/* Width badge */}
      {width != null && (
        <div style={{
          position: 'absolute',
          right: 16,
          top: 8,
          fontSize: 11,
          lineHeight: 1,
          fontFamily: 'monospace',
          color: 'rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}>
          {width}px
        </div>
      )}
    </div>
  );
}

const meta: Meta<typeof TravelSearchForm> = {
  title: 'Travel/SearchForm',
  component: TravelSearchForm,
  tags: ['autodocs'],
  args: {
    airportOptions: AIRPORTS,
    onSearch: (payload: TravelSearchPayload) => console.log('Search payload:', payload),
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story: ComponentType) => (
      <ResizablePreview>
        <Story />
      </ResizablePreview>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TravelSearchForm>;

export const FlightsRoundTrip: Story = {
  name: 'Flights — Round trip',
  args: { defaultTab: 'flights' },
};

export const FlightsOneWay: Story = {
  name: 'Flights — One way',
  args: { defaultTab: 'flights' },
  play: async ({ canvasElement }) => {
    // Pre-select one-way trip type so the story renders in that state
    const radio = canvasElement.querySelector('input[value="one-way"]') as HTMLInputElement | null;
    radio?.click();
  },
};

export const Hotels: Story = {
  name: 'Hotels',
  args: { defaultTab: 'hotels' },
};

export const NoOptions: Story = {
  name: 'No airport options (empty state)',
  args: { defaultTab: 'flights', airportOptions: [] },
};

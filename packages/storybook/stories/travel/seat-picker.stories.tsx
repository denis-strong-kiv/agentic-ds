import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SeatPicker } from '@travel/ui/components/travel/seat-picker';
import type { Seat, SeatStatus } from '@travel/ui/components/travel/seat-picker';

// ─── Seat data generators ─────────────────────────────────────────────────────

const ECONOMY_COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const BUSINESS_COLS = ['A', 'B', 'C', 'D'];

const OCCUPIED_ECONOMY = new Set([
  '2B', '3E', '4A', '5F', '6C', '8B', '9D', '10F',
  '13A', '14C', '15E', '16B', '17D', '18F',
]);

function generateEconomySeats(): Seat[] {
  const seats: Seat[] = [];
  for (let row = 1; row <= 20; row++) {
    for (const col of ECONOMY_COLS) {
      const id = `${row}${col}`;
      let status: SeatStatus = 'available';
      if (OCCUPIED_ECONOMY.has(id)) status = 'occupied';
      else if (row === 11 || row === 12) status = 'exit-row';

      seats.push({
        id,
        row,
        column: col,
        status,
        isExitRow: row === 11 || row === 12,
        price: row === 11 || row === 12 ? '$25' : '$15',
      });
    }
  }
  return seats;
}

function generateBusinessSeats(): Seat[] {
  const seats: Seat[] = [];
  const occupied = new Set(['1B', '2C', '3A']);
  for (let row = 1; row <= 6; row++) {
    for (const col of BUSINESS_COLS) {
      const id = `${row}${col}`;
      seats.push({
        id,
        row,
        column: col,
        status: occupied.has(id) ? 'occupied' : 'premium',
        fareClass: 'business',
        price: '$95',
      });
    }
  }
  return seats;
}

const ECONOMY_SEATS = generateEconomySeats();
const BUSINESS_SEATS = generateBusinessSeats();

// ─── Stateful wrapper ─────────────────────────────────────────────────────────

function ControlledSeatPicker(
  props: Omit<React.ComponentProps<typeof SeatPicker>, 'selectedSeatIds' | 'onSeatSelect'>,
) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const max = props.maxSelections ?? 1;

  function handleSelect(id: string) {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : prev.length < max
          ? [...prev, id]
          : prev,
    );
  }

  return (
    <SeatPicker {...props} selectedSeatIds={selectedIds} onSeatSelect={handleSelect} />
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof SeatPicker> = {
  title: 'Travel/SeatPicker',
  component: SeatPicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SeatPicker>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const EconomyClass: Story = {
  name: 'Economy class — single seat',
  render: () => <ControlledSeatPicker seats={ECONOMY_SEATS} maxSelections={1} />,
};

export const EconomyTwoSeats: Story = {
  name: 'Economy class — select 2 seats',
  render: () => <ControlledSeatPicker seats={ECONOMY_SEATS} maxSelections={2} />,
};

export const BusinessClass: Story = {
  name: 'Business class',
  render: () => <ControlledSeatPicker seats={BUSINESS_SEATS} maxSelections={1} />,
};

export const PreSelected: Story = {
  name: 'Pre-selected seat',
  args: {
    seats: ECONOMY_SEATS,
    selectedSeatIds: ['7C'],
    maxSelections: 1,
    onSeatSelect: () => {},
  },
};

export const MultiplePreSelected: Story = {
  name: 'Multiple pre-selected',
  args: {
    seats: ECONOMY_SEATS,
    selectedSeatIds: ['4C', '4D'],
    maxSelections: 2,
    onSeatSelect: () => {},
  },
};

export const FullyCabinOccupied: Story = {
  name: 'Almost fully occupied',
  args: {
    seats: ECONOMY_SEATS.map(s => ({
      ...s,
      status: (['7C', '7D', '12A', '12F'] as string[]).includes(s.id)
        ? s.status
        : s.status === 'available' || s.status === 'exit-row'
          ? 'occupied'
          : s.status,
    })) as Seat[],
    selectedSeatIds: [],
    onSeatSelect: () => {},
  },
};

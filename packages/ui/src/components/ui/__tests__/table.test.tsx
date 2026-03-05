import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter,
} from '../table.js';

function TableFixture({
  onSort,
  sortDirection,
}: {
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
}) {
  return (
    <Table>
      <TableCaption>Flight results</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead
            sortable
            {...(sortDirection !== undefined ? { sortDirection } : {})}
            {...(onSort !== undefined ? { onSort } : {})}
          >Airline</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Delta</TableCell>
          <TableCell>$299</TableCell>
        </TableRow>
        <TableRow selected>
          <TableCell>United</TableCell>
          <TableCell>$349</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>$648</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe('Table', () => {
  it('renders table with rows and columns', () => {
    render(<TableFixture />);
    expect(screen.getByText('Airline')).toBeInTheDocument();
    expect(screen.getByText('Delta')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();
  });

  it('renders caption', () => {
    render(<TableFixture />);
    expect(screen.getByText('Flight results')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<TableFixture />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  describe('sortable header', () => {
    it('calls onSort when sortable header is clicked', async () => {
      const user = userEvent.setup();
      const onSort = vi.fn();
      render(<TableFixture onSort={onSort} />);
      await user.click(screen.getByText('Airline').closest('th')!);
      expect(onSort).toHaveBeenCalledOnce();
    });

    it('renders ascending sort indicator', () => {
      render(<TableFixture sortDirection="asc" />);
      expect(screen.getByText('↑')).toBeInTheDocument();
    });

    it('renders descending sort indicator', () => {
      render(<TableFixture sortDirection="desc" />);
      expect(screen.getByText('↓')).toBeInTheDocument();
    });

    it('renders neutral sort indicator when no direction', () => {
      render(<TableFixture sortDirection={null} />);
      expect(screen.getByText('↕')).toBeInTheDocument();
    });

    it('sets aria-sort on sortable header (ascending)', () => {
      render(<TableFixture sortDirection="asc" />);
      const th = screen.getByText('Airline').closest('th')!;
      expect(th).toHaveAttribute('aria-sort', 'ascending');
    });

    it('sets aria-sort on sortable header (descending)', () => {
      render(<TableFixture sortDirection="desc" />);
      const th = screen.getByText('Airline').closest('th')!;
      expect(th).toHaveAttribute('aria-sort', 'descending');
    });
  });

  describe('selected row', () => {
    it('applies selected styling to selected row', () => {
      render(<TableFixture />);
      const selectedRow = screen.getByText('United').closest('tr')!;
      expect(selectedRow.className).toContain('ui-table-row--selected');
    });

    it('sets aria-selected on selected row', () => {
      render(<TableFixture />);
      const selectedRow = screen.getByText('United').closest('tr')!;
      expect(selectedRow).toHaveAttribute('aria-selected', 'true');
    });
  });
});

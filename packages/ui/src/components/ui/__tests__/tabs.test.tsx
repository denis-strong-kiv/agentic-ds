import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs/index';

function TabsFixture({ defaultValue = 'tab1' }: { defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="tab1">Flights</TabsTrigger>
        <TabsTrigger value="tab2">Hotels</TabsTrigger>
        <TabsTrigger value="tab3" disabled>Cars</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Flights content</TabsContent>
      <TabsContent value="tab2">Hotels content</TabsContent>
      <TabsContent value="tab3">Cars content</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders all tab triggers', () => {
    render(<TabsFixture />);
    expect(screen.getByRole('tab', { name: 'Flights' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Hotels' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cars' })).toBeInTheDocument();
  });

  it('shows the default tab panel', () => {
    render(<TabsFixture defaultValue="tab1" />);
    expect(screen.getByText('Flights content')).toBeVisible();
  });

  it('shows panel when tab is clicked', async () => {
    const user = userEvent.setup();
    render(<TabsFixture />);
    await user.click(screen.getByRole('tab', { name: 'Hotels' }));
    expect(screen.getByText('Hotels content')).toBeVisible();
  });

  it('marks selected tab as active', async () => {
    const user = userEvent.setup();
    render(<TabsFixture />);
    await user.click(screen.getByRole('tab', { name: 'Hotels' }));
    expect(screen.getByRole('tab', { name: 'Hotels' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('tab', { name: 'Flights' })).toHaveAttribute('data-state', 'inactive');
  });

  it('navigates with ArrowRight key', async () => {
    const user = userEvent.setup();
    render(<TabsFixture />);
    screen.getByRole('tab', { name: 'Flights' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Hotels' })).toHaveFocus();
  });

  it('navigates with ArrowLeft key', async () => {
    const user = userEvent.setup();
    render(<TabsFixture defaultValue="tab2" />);
    screen.getByRole('tab', { name: 'Hotels' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Flights' })).toHaveFocus();
  });

  it('disables tab when disabled prop is set', () => {
    render(<TabsFixture />);
    expect(screen.getByRole('tab', { name: 'Cars' })).toBeDisabled();
  });

  describe('with icon and badge', () => {
    it('renders icon slot', () => {
      render(
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a" icon={<span data-testid="tab-icon" />}>Tab A</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content A</TabsContent>
        </Tabs>
      );
      expect(screen.getByTestId('tab-icon')).toBeInTheDocument();
    });

    it('renders badge count', () => {
      render(
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a" badge={5}>Tab A</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content A</TabsContent>
        </Tabs>
      );
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });
});

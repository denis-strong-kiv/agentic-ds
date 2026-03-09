import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// travel/nav-bar re-exports from ui/nav-bar; test against what's actually rendered
import { NavBar } from './index';

describe('NavBar', () => {
  it('renders with role="banner"', () => {
    render(<NavBar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders brand name', () => {
    render(<NavBar brandName="TravelCo" />);
    expect(screen.getByText('TravelCo')).toBeInTheDocument();
  });

  it('renders custom brandLogo slot instead of brand name', () => {
    render(<NavBar brandName="TravelCo" brandLogo={<img src="/logo.svg" alt="Logo" />} />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.queryByText('TravelCo')).not.toBeInTheDocument();
  });

  it('renders search pill with accessible label including route, dates and passenger count', () => {
    render(
      <NavBar search={{ route: 'JFK → LHR', dates: '12–19 Mar', passengers: 2 }} />,
    );
    // Pill is a button; accessible label carries all segments
    expect(
      screen.getByRole('button', { name: /JFK → LHR.*12–19 Mar.*2 passengers/i }),
    ).toBeInTheDocument();
  });

  it('renders route and dates as visible text in search pill', () => {
    render(<NavBar search={{ route: 'JFK → LHR', dates: '12–19 Mar', passengers: 2 }} />);
    expect(screen.getByText('JFK → LHR')).toBeInTheDocument();
    expect(screen.getByText('12–19 Mar')).toBeInTheDocument();
  });

  it('uses singular "passenger" in aria-label when passengers is 1', () => {
    render(<NavBar search={{ route: 'NYC → PAR', dates: '1 Apr', passengers: 1 }} />);
    expect(
      screen.getByRole('button', { name: /1 passenger\b/i }),
    ).toBeInTheDocument();
  });

  it('calls onSearchClick when search pill is clicked', async () => {
    const onSearchClick = vi.fn();
    render(
      <NavBar
        search={{ route: 'JFK → LHR', dates: '12 Mar', passengers: 1 }}
        onSearchClick={onSearchClick}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /search:/i }));
    expect(onSearchClick).toHaveBeenCalledOnce();
  });

  it('does not render search pill when search prop is omitted', () => {
    render(<NavBar />);
    expect(screen.queryByRole('button', { name: /search:/i })).not.toBeInTheDocument();
  });

  it('shows Flights and Hotels tabs when searchExpanded is true', () => {
    render(<NavBar searchExpanded activeSearchTab="flights" />);
    expect(screen.getByRole('button', { name: 'Flights' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hotels' })).toBeInTheDocument();
  });

  it('calls onSearchTabChange when a tab is clicked', async () => {
    const onSearchTabChange = vi.fn();
    render(
      <NavBar searchExpanded activeSearchTab="flights" onSearchTabChange={onSearchTabChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Hotels' }));
    expect(onSearchTabChange).toHaveBeenCalledWith('hotels');
  });

  it('renders support phone link with tel: href', () => {
    render(<NavBar supportPhone="+1 800 123 4567" />);
    const link = screen.getByRole('link', { name: /call support/i });
    expect(link).toHaveAttribute('href', 'tel:18001234567');
  });

  it('does not render support link when supportPhone is omitted', () => {
    render(<NavBar />);
    expect(screen.queryByRole('link', { name: /call support/i })).not.toBeInTheDocument();
  });

  it('calls onAccountClick when account button is clicked', async () => {
    const onAccountClick = vi.fn();
    render(<NavBar onAccountClick={onAccountClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(onAccountClick).toHaveBeenCalledOnce();
  });

  it('calls onMenuClick when menu button is clicked', async () => {
    const onMenuClick = vi.fn();
    render(<NavBar onMenuClick={onMenuClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(onMenuClick).toHaveBeenCalledOnce();
  });

  it('renders custom actions slot instead of default account/menu buttons', () => {
    render(<NavBar actions={<button type="button">Custom</button>} />);
    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Account' })).not.toBeInTheDocument();
  });
});

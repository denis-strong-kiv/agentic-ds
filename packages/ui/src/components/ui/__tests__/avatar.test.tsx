import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus } from '../avatar.js';

describe('Avatar', () => {
  it('renders fallback with initials when image is not provided', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders AvatarImage — shows fallback in jsdom (images do not load)', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    // In jsdom images do not load; Radix shows the fallback
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders fallback when image fails to load', () => {
    // Radix Avatar shows fallback when image fails; in jsdom fallback is shown immediately
    render(
      <Avatar>
        <AvatarImage src="" alt="Test" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('renders with rounded-full class for circular shape', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByTestId('avatar').className).toContain('rounded-full');
  });

  it('forwards ref to Avatar root', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(
      <Avatar ref={ref}>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

describe('AvatarStatus', () => {
  it('renders online status indicator', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarStatus status="online" />
      </Avatar>
    );
    expect(screen.getByLabelText('online')).toBeInTheDocument();
  });

  it('renders away status indicator', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarStatus status="away" />
      </Avatar>
    );
    expect(screen.getByLabelText('away')).toBeInTheDocument();
  });

  it('renders busy status indicator', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarStatus status="busy" />
      </Avatar>
    );
    expect(screen.getByLabelText('busy')).toBeInTheDocument();
  });

  it('renders offline status indicator', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarStatus status="offline" />
      </Avatar>
    );
    expect(screen.getByLabelText('offline')).toBeInTheDocument();
  });
});

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card/index';

describe('Card', () => {
  it('renders with outlined variant by default', () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId('card').className).toContain('ui-card--outlined');
  });

  it('renders with elevated variant', () => {
    render(<Card variant="elevated" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card').className).toContain('ui-card--elevated');
  });

  it('renders header slot', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
  });

  it('renders content slot', () => {
    render(
      <Card>
        <CardContent>Main content area</CardContent>
      </Card>
    );
    expect(screen.getByText('Main content area')).toBeInTheDocument();
  });

  it('renders footer slot', () => {
    render(
      <Card>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });

  it('renders all sub-components together', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('passes additional className', () => {
    render(<Card className="custom-card" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card').className).toContain('custom-card');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

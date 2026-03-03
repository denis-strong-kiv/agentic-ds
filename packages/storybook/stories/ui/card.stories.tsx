import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardContent, CardFooter } from '@travel/ui/components/ui/card';
import { Badge } from '@travel/ui/components/ui/badge';
import { Button } from '@travel/ui/components/ui/button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined'] },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Outlined: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Paris, France</h3>
        <Badge variant="deal">Best Value</Badge>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-foreground-muted)' }}>
          5 nights · Hotel Lumière · Breakfast included
        </p>
      </CardContent>
      <CardFooter style={{ justifyContent: 'space-between' }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>$1,240</span>
        <Button size="sm">View Deal</Button>
      </CardFooter>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" style={{ maxWidth: 360 }}>
      <CardHeader>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>New York → London</h3>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-foreground-muted)' }}>
          Direct flight · British Airways · Mar 20
        </p>
      </CardContent>
      <CardFooter style={{ justifyContent: 'space-between' }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>$580</span>
        <Button size="sm" variant="outline">Select</Button>
      </CardFooter>
    </Card>
  ),
};

export const BrandComparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: 800 }}>
      {(['outlined', 'elevated'] as const).map(v => (
        <Card key={v} variant={v}>
          <CardHeader>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Card · {v}</h3>
          </CardHeader>
          <CardContent>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-foreground-muted)' }}>
              Radius adapts to brand shape token.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" style={{ width: '100%' }}>Action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

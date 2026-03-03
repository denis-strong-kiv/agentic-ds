import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@travel/ui/components/ui/button';
import { Badge } from '@travel/ui/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@travel/ui/components/ui/card';
import { Input } from '@travel/ui/components/ui/input';
import { brandTokens, getBrandCSS, type BrandId } from '../tokens/brand-tokens.js';
import React from 'react';

/**
 * Renders a component set under a specific brand by injecting that brand's
 * CSS custom properties into a scoped container.
 */
function BrandFrame({ brandId, mode = 'light', children }: {
  brandId: BrandId;
  mode?: 'light' | 'dark';
  children: React.ReactNode;
}) {
  const tokens = brandTokens[brandId][mode];
  const css = getBrandCSS(brandId, mode);
  const styleId = `brand-frame-${brandId}-${mode}`;

  React.useEffect(() => {
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) { el = document.createElement('style'); el.id = styleId; document.head.appendChild(el); }
    el.textContent = `[data-brand-frame="${brandId}-${mode}"] { ${Object.entries(tokens).map(([k,v]) => `${k}:${v}`).join(';')} }`;
    return () => { el?.remove(); };
  }, [brandId, mode]);

  return (
    <div
      data-brand-frame={`${brandId}-${mode}`}
      style={{
        background: tokens['--color-background-default'],
        color: tokens['--color-foreground-default'],
        padding: '1.25rem',
        borderRadius: tokens['--shape-preset-card'],
        border: `1px solid ${tokens['--color-border-default']}`,
        minWidth: 220,
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', color: tokens['--color-foreground-muted'] }}>
        {brandId} · {mode}
      </p>
      {children}
    </div>
  );
}

const brandNames: Record<BrandId, string> = {
  default: 'Default',
  luxury: 'Luxury Airways',
  adventure: 'Adventure Co',
  eco: 'Eco Getaways',
};

const meta: Meta = {
  title: 'Showcase/Brand Comparison',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

const SampleComponents = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <Button size="sm">Book Now</Button>
      <Button variant="secondary" size="sm">Save</Button>
      <Button variant="outline" size="sm">Share</Button>
    </div>
    <Input placeholder="Search destinations…" style={{ maxWidth: '100%' }} />
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="deal">Best Deal</Badge>
      <Badge variant="new">New Route</Badge>
      <Badge>Economy</Badge>
    </div>
  </div>
);

export const LightMode: Story = {
  name: 'All Brands · Light',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', padding: '1.5rem' }}>
      {(Object.keys(brandNames) as BrandId[]).map(id => (
        <BrandFrame key={id} brandId={id} mode="light">
          <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{brandNames[id]}</p>
          <SampleComponents />
        </BrandFrame>
      ))}
    </div>
  ),
};

export const DarkMode: Story = {
  name: 'All Brands · Dark',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', padding: '1.5rem', background: '#111' }}>
      {(Object.keys(brandNames) as BrandId[]).map(id => (
        <BrandFrame key={id} brandId={id} mode="dark">
          <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{brandNames[id]}</p>
          <SampleComponents />
        </BrandFrame>
      ))}
    </div>
  ),
};

export const CardComponents: Story = {
  name: 'Cards Across Brands',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', padding: '1.5rem' }}>
      {(Object.keys(brandNames) as BrandId[]).map(id => {
        const tokens = brandTokens[id].light;
        return (
          <BrandFrame key={id} brandId={id} mode="light">
            <Card style={{ background: tokens['--color-surface-card'], border: `1px solid ${tokens['--color-border-default']}`, borderRadius: tokens['--shape-preset-card'] }}>
              <CardHeader>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Paris · 5 nights</span>
                <Badge variant="deal">Save 20%</Badge>
              </CardHeader>
              <CardContent>
                <p style={{ fontSize: 13, color: tokens['--color-foreground-muted'], margin: 0 }}>
                  Hotel Lumière · Breakfast included
                </p>
              </CardContent>
              <CardFooter style={{ justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>$1,240</span>
                <Button size="sm">View Deal</Button>
              </CardFooter>
            </Card>
            <p style={{ fontSize: 11, marginTop: '0.5rem', color: tokens['--color-foreground-muted'] }}>
              Shape: {tokens['--shape-preset-card']} · {brandNames[id]}
            </p>
          </BrandFrame>
        );
      })}
    </div>
  ),
};

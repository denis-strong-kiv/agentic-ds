import type { Preview } from '@storybook/react';
import React, { useEffect } from 'react';
import { brandTokens, type BrandId } from '../stories/tokens/brand-tokens.js';

// ─── Brand + Mode Decorator ───────────────────────────────────────────────────
// Renders the story twice — once in a light-token pane and once in a dark-token
// pane — side by side. CSS custom properties are scoped to each pane via inline
// styles so components using var(--color-*) automatically see the right values.
const BrandDecorator = (Story: React.FC, context: { globals: Record<string, string> }) => {
  const brand = (context.globals.brand ?? 'default') as BrandId;
  const locale = context.globals.locale ?? 'en';
  const isRTL = locale === 'ar';

  const lightTokens = brandTokens[brand]?.light ?? brandTokens.default.light;
  const darkTokens = brandTokens[brand]?.dark ?? brandTokens.default.dark;

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [isRTL]);

  const makePaneStyle = (tokens: Record<string, string>): React.CSSProperties => ({
    ...(tokens as React.CSSProperties),
    flex: 1,
    minWidth: 0,
    padding: '1.5rem',
    background: tokens['--color-background-default'],
    color: tokens['--color-foreground-default'],
  });

  const labelStyle: React.CSSProperties = {
    fontSize: '0.6875rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    opacity: 0.4,
    marginBottom: '0.75rem',
  };

  return React.createElement(
    'div',
    { style: { display: 'flex', minHeight: '100%' } },
    React.createElement(
      'div',
      { 'data-mode': 'light', style: makePaneStyle(lightTokens) },
      React.createElement('div', { style: labelStyle }, '☀ Light'),
      React.createElement(Story),
    ),
    React.createElement(
      'div',
      { 'data-mode': 'dark', style: makePaneStyle(darkTokens) },
      React.createElement('div', { style: labelStyle }, '☾ Dark'),
      React.createElement(Story),
    ),
  );
};

const preview: Preview = {
  decorators: [BrandDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile (375px)', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet (768px)', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop (1280px)', styles: { width: '1280px', height: '900px' } },
        wide: { name: 'Wide (1536px)', styles: { width: '1536px', height: '900px' } },
      },
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
  globalTypes: {
    brand: {
      description: 'Active brand',
      defaultValue: 'default',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'luxury', title: 'Luxury Airways' },
          { value: 'adventure', title: 'Adventure Co' },
          { value: 'eco', title: 'Eco Getaways' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Locale / direction',
      defaultValue: 'en',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English (LTR)' },
          { value: 'ar', title: 'Arabic (RTL)' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

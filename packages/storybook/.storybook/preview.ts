import '../../../packages/ui/src/styles/theme.css';
import '../../../packages/ui/src/styles/motion.css';

import type { Preview } from '@storybook/react';
import React from 'react';
import { brandTokens, type BrandId, type ColorMode } from '../stories/tokens/brand-tokens.js';

// ─── Brand + Mode Decorator ───────────────────────────────────────────────────
// Spreads brand CSS custom properties as inline styles on the wrapper element.
// Inline styles always win over any stylesheet (including Tailwind's injected CSS),
// eliminating cascade ordering race conditions in Vite dev mode.
// CSS custom properties are inherited, so all children resolve var() correctly.
const BrandDecorator = (Story: React.FC, context: { globals: Record<string, string> }) => {
  const brand = (context.globals.brand ?? 'default') as BrandId;
  const mode = (context.globals.colorMode ?? 'light') as ColorMode;
  const locale = context.globals.locale ?? 'en';
  const isRTL = locale === 'ar';

  const tokens = brandTokens[brand]?.[mode] ?? brandTokens.default.light;

  // Set synchronously — idempotent DOM attribute writes, no cleanup needed.
  // Avoids useLayoutEffect which fails in vitest's browser context (null dispatcher).
  document.documentElement.setAttribute('data-mode', mode);
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

  return React.createElement(
    'div',
    {
      // Casting needed: React.CSSProperties doesn't type CSS custom properties,
      // but browsers and React both support them as inline style values.
      style: {
        ...tokens,
        padding: '1.5rem',
        minHeight: '100%',
      } as React.CSSProperties,
    },
    React.createElement(Story),
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

      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error'  // was: 'todo' — keeping as 'error' to enforce a11y in CI
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
    colorMode: {
      description: 'Color mode',
      defaultValue: 'light',
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

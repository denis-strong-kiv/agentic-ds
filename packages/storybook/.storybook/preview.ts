import type { Preview } from '@storybook/react';
import React, { useLayoutEffect } from 'react';
import { brandTokens, type BrandId, type ColorMode } from '../stories/tokens/brand-tokens.js';

// ─── Brand + Mode Decorator ───────────────────────────────────────────────────
// Injects brand CSS custom properties into a scoped wrapper element.
// Also sets data-mode and dir on the wrapper so dark/RTL layouts work.
const BrandDecorator = (Story: React.FC, context: { globals: Record<string, string> }) => {
  const brand = (context.globals.brand ?? 'default') as BrandId;
  const mode = (context.globals.colorMode ?? 'light') as ColorMode;
  const locale = context.globals.locale ?? 'en';
  const isRTL = locale === 'ar';

  const tokens = brandTokens[brand]?.[mode] ?? brandTokens.default.light;
  const styleId = 'sb-brand-tokens';

  useLayoutEffect(() => {
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    const vars = Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n');
    // Include a transition so color changes animate rather than snap
    const transition = '  transition: background-color 150ms, color 150ms;';
    style.textContent = `:root {\n${vars}\n${transition}\n}`;

    document.documentElement.setAttribute('data-mode', mode);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.style.backgroundColor = tokens['--color-background-default'] ?? '';
    document.documentElement.style.color = tokens['--color-foreground-default'] ?? '';
  }, [brand, mode, locale]);

  return React.createElement(
    'div',
    {
      style: {
        padding: '1.5rem',
        minHeight: '100%',
        background: tokens['--color-background-default'],
        color: tokens['--color-foreground-default'],
        transition: 'background-color 150ms, color 150ms',
      },
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
      test: 'todo'
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

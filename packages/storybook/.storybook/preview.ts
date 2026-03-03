import type { Preview } from '@storybook/react';
import React from 'react';
import { brandTokens, type BrandId, type ColorMode } from '../stories/tokens/brand-tokens.js';

// ─── Pre-generate all brand × mode CSS blocks once at module load ─────────────
// This avoids rewriting <style> tags on every toggle (which causes Docs flicker).
// The decorator just flips two attributes on <html>; the CSS cascade does the rest.
function injectAllTokenCSS() {
  if (typeof document === 'undefined') return;
  const styleId = 'sb-all-brand-tokens';
  if (document.getElementById(styleId)) return; // already injected

  const brands = Object.keys(brandTokens) as BrandId[];
  const modes: ColorMode[] = ['light', 'dark'];

  const blocks = brands.flatMap((brand) =>
    modes.map((mode) => {
      const vars = Object.entries(brandTokens[brand][mode])
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n');
      return `:root[data-brand="${brand}"][data-mode="${mode}"] {\n${vars}\n}`;
    }),
  );

  // Smooth transition on root — applied once, not rewritten on every toggle
  blocks.push(':root { transition: background-color 150ms, color 150ms; }');

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = blocks.join('\n\n');
  document.head.appendChild(style);
}

injectAllTokenCSS();

// ─── Brand + Mode Decorator ───────────────────────────────────────────────────
// Sets data-brand / data-mode attributes on <html> — no style rewriting.
// In Docs mode multiple stories call this with identical values; identical
// attribute sets are no-ops in the browser and don't trigger recalculations.
const BrandDecorator = (Story: React.FC, context: { globals: Record<string, string> }) => {
  const brand = (context.globals.brand ?? 'default') as BrandId;
  const mode = (context.globals.colorMode ?? 'light') as ColorMode;
  const locale = context.globals.locale ?? 'en';
  const isRTL = locale === 'ar';

  // Synchronous attribute update — safe because it is a write-only side effect
  // with no layout reads. Runs before the browser paints.
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-brand', brand);
    document.documentElement.setAttribute('data-mode', mode);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }

  return React.createElement(
    'div',
    {
      style: {
        padding: '1.5rem',
        minHeight: '100%',
        // Use CSS vars — already set on :root via attribute selectors above
        background: 'var(--color-background-default)',
        color: 'var(--color-foreground-default)',
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

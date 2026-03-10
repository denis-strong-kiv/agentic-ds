import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)', '../stories/**/*.mdx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? [])];

    const uiSrc = path.resolve(import.meta.dirname, '../../../packages/ui/src');
    const tokensCss = path.resolve(
      import.meta.dirname,
      '../../../packages/tokens/src/output/tokens.css',
    );

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> | undefined ?? {}),
      // Allow deep imports: @travel/ui/components/ui/button → packages/ui/src/components/ui/button
      '@travel/ui/components': path.join(uiSrc, 'components'),
      '@travel/ui/brand': path.join(uiSrc, 'brand'),
      '@travel/ui/hooks': path.join(uiSrc, 'hooks'),
      '@travel/ui/utils': path.join(uiSrc, 'utils'),
      // Keep the root import working too
      '@travel/ui': path.join(uiSrc, 'index.ts'),
      // Allow CSS imports for design tokens from any package
      '@travel/tokens/css': tokensCss,
    };

    return config;
  },
};

export default config;

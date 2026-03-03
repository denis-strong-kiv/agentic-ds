import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)', '../stories/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    const uiSrc = path.resolve(__dirname, '../../../packages/ui/src');
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> | undefined ?? {}),
      // Allow deep imports: @travel/ui/components/ui/button → packages/ui/src/components/ui/button
      '@travel/ui/components': path.join(uiSrc, 'components'),
      '@travel/ui/brand': path.join(uiSrc, 'brand'),
      '@travel/ui/utils': path.join(uiSrc, 'utils'),
      // Keep the root import working too
      '@travel/ui': path.join(uiSrc, 'index.ts'),
    };
    return config;
  },
};

export default config;

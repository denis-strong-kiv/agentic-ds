import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    storybookTest({ configDir: path.join(dirname, '.storybook') }),
  ],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    setupFiles: ['.storybook/vitest.setup.ts'],
    server: {
      deps: {
        // Inline storybook packages so Vite replaces import.meta.env refs
        // before the module runner proxy intercepts them (avoids "Dynamic
        // access of import.meta.env is not supported" clone errors).
        inline: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
      },
    },
  },
});

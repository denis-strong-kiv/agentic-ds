import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      './packages/tokens/vitest.config.ts',
      './packages/tokens-native/vitest.config.ts',
      './packages/ui/vitest.config.ts',
    ],
  },
});

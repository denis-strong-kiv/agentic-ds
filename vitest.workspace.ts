import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './packages/tokens/vitest.config.ts',
    test: {
      name: 'tokens',
      root: './packages/tokens',
    },
  },
  {
    extends: './packages/ui/vitest.config.ts',
    test: {
      name: 'ui',
      root: './packages/ui',
    },
  },
]);

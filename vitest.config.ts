import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text'],
    },
    environment: 'node',
    globals: true,
    restoreMocks: true,
  },
});

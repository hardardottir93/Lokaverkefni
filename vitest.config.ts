import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    isolate: true,
    
    fileParallelism: false,
    maxConcurrency: 1,

    sequence: {
      concurrent: false
    }
  }
});

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx,js,jsx}'],
    silent: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/index.ts',
        '*.cjs',
        'webpack.config.js',
        'vitest.config.ts',
        '**/*.test.{ts,tsx,js,jsx}',
        '**/test/**',
        '**/tests/**',
      ],
      all: true,
      clean: true,
      cleanOnRerun: true,
    },
  },
})

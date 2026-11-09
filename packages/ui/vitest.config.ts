import tailwindcss from '@tailwindcss/postcss';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

const browsers = (process.env.VITEST_BROWSERS ?? 'chromium')
  .split(',')
  .map((name) => name.trim())
  .filter((name): name is BrowserName => ['chromium', 'firefox', 'webkit'].includes(name));

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: { plugins: [tailwindcss()] },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
          exclude: ['src/**/*.browser.test.{ts,tsx}', 'src/**/*.visual.test.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.{ts,tsx}'],
          setupFiles: ['./vitest.browser.setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            viewport: { width: 1024, height: 768 },
            instances: browsers.map((browser) => ({ browser })),
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'visual',
          include: ['src/**/*.visual.test.{ts,tsx}'],
          setupFiles: ['./vitest.browser.setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            viewport: { width: 1024, height: 768 },
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});

import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const webServerEnv = {
  DATABASE_URL:
    process.env.DATABASE_URL ?? 'postgresql://ledger:ledger@127.0.0.1:5432/ledger_v2?schema=public',
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD ?? 'admin123456',
  DEFAULT_ADMIN_USERNAME: process.env.DEFAULT_ADMIN_USERNAME ?? 'admin',
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'Ledger v2',
  REDIS_URL: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
  SESSION_SECRET: process.env.SESSION_SECRET ?? 'change-me-in-tests',
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  webServer: {
    command: 'pnpm dev',
    env: webServerEnv,
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

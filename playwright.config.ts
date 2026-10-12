import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,          // a forgotten test.only fails CI
  retries: process.env.CI ? 2 : 0,       // retries only on CI
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    testIdAttribute: 'data-test',        // Sauce Demo uses data-test="…"
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testDir: './tests/ui', testMatch: /auth\.setup\.ts/,
      use: { baseURL: 'https://www.saucedemo.com' } },
    { name: 'ui', testDir: './tests/ui', dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'],
             baseURL: 'https://www.saucedemo.com',
             storageState: '.auth/user.json' } },
    { name: 'api', testDir: './tests/api',
      use: { baseURL: 'https://restful-booker.herokuapp.com',
             extraHTTPHeaders: { Accept: 'application/json' } } },
  ],
});
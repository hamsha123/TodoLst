import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './toDoTest', // Directory where your test files are located
  timeout: 30 * 1000, // Timeout for each test in milliseconds
  expect: {
    timeout: 5000 // Timeout for expect assertions in milliseconds
  },
  use: {
    headless: false, // Run tests in headless mode
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0, // Disable timeout for each action
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    video: 'on-first-retry', // Record video on first retry of each test
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  reporter: [['list'], ['json', { outputFile: 'test-results.json' }]], // Reporters to use
});
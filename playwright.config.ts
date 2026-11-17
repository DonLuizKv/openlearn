import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: { baseURL: 'http://127.0.0.1:8081', ...devices['iPhone 13'], defaultBrowserType: 'chromium', channel: 'chrome', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'npx expo start --web --port 8081', url: 'http://127.0.0.1:8081', reuseExistingServer: true, timeout: 120000 },
});

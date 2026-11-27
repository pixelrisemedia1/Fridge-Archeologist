import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
const systemChromium = existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined;
export default defineConfig({
  testDir: './e2e',
  testIgnore: process.env.PLAYWRIGHT_BASE_URL ? '**/app.spec.ts' : '**/production.spec.ts',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173', ...devices['Desktop Chrome'], launchOptions: { executablePath: systemChromium } },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : { command: 'npm run dev -- --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI, timeout: 30_000 }
});

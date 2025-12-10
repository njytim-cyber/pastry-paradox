/* eslint-disable no-undef */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',

    use: {
        baseURL: 'http://localhost:5174',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        actionTimeout: 5000, // 5s per action
    },

    timeout: 15000, // 15s per test

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 7'] },
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 14 Pro'] },
        },
    ],

    webServer: {
        command: 'npm run dev -- --port 5174',
        url: 'http://localhost:5174',
        reuseExistingServer: !process.env.CI,
    },
});

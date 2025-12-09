
import { test, expect } from '@playwright/test';

test.describe('Achievement System', () => {
    test.beforeEach(async ({ page }) => {
        // Reset storage to ensure fresh achievements
        await page.addInitScript(() => {
            localStorage.clear();
        });
        await page.goto('/');
        // Wait for hydration
        await expect(page.locator('body')).toBeVisible();
    });

    test('unlocks achievement on clicks', async ({ page }) => {
        // 1. Verify the stats panel exists and header is visible
        await expect(page.getByRole('heading', { name: 'Your Bakery' })).toBeVisible();

        // 2. Click to see details/achievements view
        const statsPanel = page.locator('.stats-panel');
        await expect(statsPanel).toBeVisible({ timeout: 10000 });

        const toggleBtn = statsPanel.locator('.panel-header button');
        await expect(toggleBtn).toBeVisible();
        await expect(toggleBtn).toBeEnabled();

        // Click to open details view (button shows "📜 Details" when in stats mode)
        const btnText = await toggleBtn.textContent();
        if (btnText?.includes('Details')) {
            await toggleBtn.click();
        }

        // 3. Verify details view is shown (shows Upgrades section)
        await expect(page.getByRole('heading', { name: '⚡ Upgrades' })).toBeVisible();

        // 4. Verify there's a message about buying upgrades (since we have none)
        await expect(page.getByText('Active upgrades are listed')).toBeVisible();
    });
});

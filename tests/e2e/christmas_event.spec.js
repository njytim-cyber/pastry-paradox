import { test, expect } from '@playwright/test';

test.describe('Pastry Paradox - Christmas Event', () => {
    test('should load Christmas Event theme', async ({ page }) => {
        // Need to force Christmas event active if it's not default.
        // We can do this by mocking the import or checking if it's active.
        // Or we rely on manual switch for now. 
        // Ideally, we mock the events.json response or use query param override.
        // Assuming we manually switch or use query param ?event=christmas if supported.
        // For E2E without code change, we might fail if not active.
        // Let's assume we will switch logic before running this test.

        // Force Christmas event via URL override
        await page.goto('/?event_override=event_christmas_2025');

        const eventWrapper = page.locator('#event-system-wrapper');
        await expect(eventWrapper).toBeVisible();

        // Check for specific Christmas colors or font
        // e.g. Mountains of Christmas font
        // Note: Computed style checks are hard to assert reliably.
        // Future: Check for "Cookies" currency or specific visual elements.
    });

    test('should show Reindeer Stable instead of Farm', async ({ page }) => {
        await page.goto('/');

        // Wait for store to be populated
        const shopList = page.locator('.shop-list');
        await expect(shopList).toBeVisible();

        // We need to buy/unlock Farm (Tier 3) to see it?
        // Or just check locked state text if visible.
        // Farm is Tier 3. Usually hidden until Grandma unlocked.

        // Cheat to unlock
        await page.addInitScript(() => {
            const state = {
                state: {
                    cakes: 10000,
                    generators: { "grandmas_secret_recipe": 10 }
                },
                version: "1.0"
            };
            window.localStorage.setItem('pastry_paradox_save', JSON.stringify(state));
        });

        // Reload with override to apply state and event
        await page.goto('/?event_override=event_christmas_2025');

        if (await page.viewportSize().width <= 480) {
            await page.locator('.tab-btn:has-text("Store")').click();
        }

        // Check text
        await expect(page.locator('.shop-item', { hasText: 'Reindeer Stable' })).toBeVisible();
    });
});

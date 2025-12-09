/**
 * E2E Test: Core Game Flow
 * Tests cake clicking, currency accumulation, and shop interaction
 * 
 * Following "Paranoid" E2E standards:
 * - No sleeps, only explicit waits
 * - Assert visibility before interaction
 * - Use resilient selectors (role, testId)
 */
import { test, expect } from '@playwright/test';

test.describe('Pastry Paradox - Core Game Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Hydration wait
        await expect(page.locator('body')).toBeVisible();
    });

    test('should display the 3-pane layout', async ({ page }) => {
        // Verify left pane (cake area)
        const leftPane = page.locator('.pane-left');
        await expect(leftPane).toBeVisible();

        // Verify center pane (stats)
        const centerPane = page.locator('.pane-center');
        await expect(centerPane).toBeVisible();

        // Verify right pane (store)
        const rightPane = page.locator('.pane-right');
        await expect(rightPane).toBeVisible();
    });

    test('should display bakery name and currency', async ({ page }) => {
        // Check bakery name is editable
        const bakeryName = page.locator('.bakery-name');
        await expect(bakeryName).toBeVisible();
        await expect(bakeryName).toContainText('Patisserie');

        // Check currency display starts at 0
        const balance = page.locator('.bakery-balance');
        await expect(balance).toBeVisible();
        await expect(balance).toContainText('0');
    });

    test('should increase balance when clicking the cake', async ({ page }) => {
        // Find the cake
        const cake = page.locator('.cake');
        await expect(cake).toBeVisible();

        // Get initial balance
        const balance = page.locator('.bakery-balance');
        await expect(balance).toContainText('0');

        // Click cake multiple times
        for (let i = 0; i < 5; i++) {
            await cake.click();
        }

        // Verify balance increased
        await expect(balance).not.toContainText('0');
    });

    test('should display flavor text banner', async ({ page }) => {
        const flavorBanner = page.locator('.flavor-banner');
        await expect(flavorBanner).toBeVisible();

        const flavorText = page.locator('.flavor-text__message');
        await expect(flavorText).toBeVisible();
        // Should have some text content
        await expect(flavorText).not.toBeEmpty();
    });

    test('should show first generator and mystery tier in store', async ({ page }) => {
        // First generator should be visible
        const shopItems = page.locator('.shop-item');
        await expect(shopItems.first()).toBeVisible();

        // Should show Apprentice Baker (first tier)
        await expect(page.getByText('Apprentice Baker')).toBeVisible();

        // Should show mystery tier
        const mysteryItem = page.locator('.shop-item--mystery');
        await expect(mysteryItem).toBeVisible();
        await expect(mysteryItem.locator('.shop-item__name--mystery')).toContainText('???');
    });

    test('should show buy quantity buttons (1, 67, 6767)', async ({ page }) => {
        const quantityBtns = page.locator('.quantity-btn');
        await expect(quantityBtns).toHaveCount(3);

        await expect(quantityBtns.nth(0)).toContainText('1');
        await expect(quantityBtns.nth(1)).toContainText('67');
        await expect(quantityBtns.nth(2)).toContainText('6767');
    });

    test('should disable unaffordable generators', async ({ page }) => {
        // With 0 balance, first generator should be disabled
        const firstShopItem = page.locator('.shop-item').first();
        await expect(firstShopItem).toBeVisible();
        await expect(firstShopItem).toHaveClass(/shop-item--disabled/);
    });

    test('should be able to purchase generator after clicking enough', async ({ page }) => {
        const cake = page.locator('.cake');
        await expect(cake).toBeVisible();

        // Click enough to afford first generator (15 cakes)
        for (let i = 0; i < 20; i++) {
            await cake.click();
        }

        // Generator should now be affordable
        const firstShopItem = page.locator('.shop-item').first();
        await expect(firstShopItem).not.toHaveClass(/shop-item--disabled/);

        // Click to purchase
        await firstShopItem.click();

        // Should now own 1
        const ownedCount = firstShopItem.locator('.shop-item__owned');
        await expect(ownedCount).toContainText('1');
    });
});

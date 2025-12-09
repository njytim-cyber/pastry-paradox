/**
 * E2E Tests for Store Quantity Buttons and Flavor Text Timing
 * Tests bulk purchasing behavior and text display frequency
 */
import { test, expect } from '@playwright/test';

test.describe('Store Quantity Buttons', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage for fresh state
        await page.addInitScript(() => localStorage.clear());
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should display all three quantity buttons (1, 67, 6767)', async ({ page }) => {
        // Verify all quantity buttons are visible
        await expect(page.locator('.quantity-btn').filter({ hasText: '1' })).toBeVisible();
        await expect(page.locator('.quantity-btn').filter({ hasText: '67' })).toBeVisible();
        await expect(page.locator('.quantity-btn').filter({ hasText: '6767' })).toBeVisible();
    });

    test('should toggle active state when clicking quantity buttons', async ({ page }) => {
        // Initially button "1" should be active
        const btn1 = page.locator('.quantity-btn').filter({ hasText: '1' });
        const btn67 = page.locator('.quantity-btn').filter({ hasText: '67' });
        const btn6767 = page.locator('.quantity-btn').filter({ hasText: '6767' });

        await expect(btn1).toHaveClass(/quantity-btn--active/);

        // Click 67 button
        await btn67.click();
        await expect(btn67).toHaveClass(/quantity-btn--active/);
        await expect(btn1).not.toHaveClass(/quantity-btn--active/);

        // Click 6767 button
        await btn6767.click();
        await expect(btn6767).toHaveClass(/quantity-btn--active/);
        await expect(btn67).not.toHaveClass(/quantity-btn--active/);

        // Click back to 1
        await btn1.click();
        await expect(btn1).toHaveClass(/quantity-btn--active/);
    });

    test('should show correct bulk price indicator in shop items when quantity > 1', async ({ page }) => {
        const btn67 = page.locator('.quantity-btn').filter({ hasText: '67' });

        // Select quantity 67
        await btn67.click();

        // Shop items should show (×67) indicator
        await expect(page.locator('.shop-item__bulk').first()).toContainText('×67');
    });

    test('should disable shop items when cannot afford bulk quantity', async ({ page }) => {
        // With 0 cakes, selecting 67 should disable items (can't afford 67 of anything)
        const btn67 = page.locator('.quantity-btn').filter({ hasText: '67' });
        await btn67.click();

        // Items should be disabled since we can't afford 67 items
        const firstShopItem = page.locator('.shop-item').first();
        await expect(firstShopItem).toHaveClass(/shop-item--disabled/);
    });

    test('should increment owned count by selected quantity when purchasing', async ({ page }) => {
        // Generate enough cakes to afford purchases
        const cake = page.locator('.cake-wrapper');

        // Click cake many times to build up balance
        for (let i = 0; i < 50; i++) {
            await cake.click({ delay: 10 });
        }

        // Get initial owned count of first item
        const firstItem = page.locator('.shop-item').first();
        const ownedBefore = await firstItem.locator('.shop-item__owned').textContent();
        const ownedBeforeNum = parseInt(ownedBefore || '0');

        // Ensure quantity 1 is selected
        await page.locator('.quantity-btn').filter({ hasText: '1' }).click();

        // Buy one item
        if (!await firstItem.evaluate(el => el.classList.contains('shop-item--disabled'))) {
            await firstItem.click();

            // Check owned count increased by 1
            const ownedAfter = await firstItem.locator('.shop-item__owned').textContent();
            const ownedAfterNum = parseInt(ownedAfter || '0');
            expect(ownedAfterNum).toBe(ownedBeforeNum + 1);
        }
    });
});

test.describe('Buy/Sell Mode Toggle', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => localStorage.clear());
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should display Buy and Sell mode buttons', async ({ page }) => {
        await expect(page.locator('.store-mode-btn').filter({ hasText: 'Buy' })).toBeVisible();
        await expect(page.locator('.store-mode-btn').filter({ hasText: 'Sell' })).toBeVisible();
    });

    test('should toggle between Buy and Sell modes', async ({ page }) => {
        const buyBtn = page.locator('.store-mode-btn').filter({ hasText: 'Buy' });
        const sellBtn = page.locator('.store-mode-btn').filter({ hasText: 'Sell' });

        // Initially Buy should be active
        await expect(buyBtn).toHaveClass(/store-mode-btn--active/);

        // Click Sell
        await sellBtn.click();
        await expect(sellBtn).toHaveClass(/store-mode-btn--active/);
        await expect(buyBtn).not.toHaveClass(/store-mode-btn--active/);

        // Click Buy
        await buyBtn.click();
        await expect(buyBtn).toHaveClass(/store-mode-btn--active/);
    });
});

test.describe('Flavor Text Timing', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => localStorage.clear());
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should initially display flavor text', async ({ page }) => {
        // Flavor text should be visible on initial load
        const flavorText = page.locator('.flavor-text');
        await expect(flavorText).toBeVisible();

        // And should have content
        const message = await flavorText.locator('.flavor-text__message').textContent();
        expect(message?.length).toBeGreaterThan(0);
    });

    test('should have fade opacity style on flavor text', async ({ page }) => {
        // The flavor text element should have opacity transition style
        const flavorText = page.locator('.flavor-text');
        const style = await flavorText.getAttribute('style');
        expect(style).toContain('opacity');
        expect(style).toContain('transition');
    });

    test('flavor text should fade out after 10 seconds', async ({ page }) => {
        // This test validates the hide behavior
        // Wait 10 seconds for the text to fade
        const flavorText = page.locator('.flavor-text');

        // Initially should be visible (opacity 1)
        await expect(flavorText).toHaveCSS('opacity', '1');

        // Wait 11 seconds for the fade to complete
        await page.waitForTimeout(11000);

        // Should now be hidden (opacity 0)
        await expect(flavorText).toHaveCSS('opacity', '0');
    });
});

test.describe('Balance Display Throttling', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => localStorage.clear());
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should display balance with throttled updates', async ({ page }) => {
        // The balance display should exist and show a number
        const balance = page.locator('.bakery-balance');
        await expect(balance).toBeVisible();

        // Balance should be 0 initially
        const initialBalance = await balance.textContent();
        expect(initialBalance).toBe('0');
    });

    test('balance should update smoothly after clicks', async ({ page }) => {
        const cake = page.locator('.cake-wrapper');
        const balance = page.locator('.bakery-balance');

        // Click several times
        for (let i = 0; i < 10; i++) {
            await cake.click();
        }

        // Wait for throttled update (500ms)
        await page.waitForTimeout(600);

        // Balance should be greater than 0 now
        const updatedBalance = await balance.textContent();
        const balanceNum = parseInt(updatedBalance?.replace(/,/g, '') || '0');
        expect(balanceNum).toBeGreaterThan(0);
    });
});

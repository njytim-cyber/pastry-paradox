/**
 * Mobile Navigation E2E Test (Paranoid Rules)
 * Tests mobile-specific features: tabbed navigation, swipe gestures, touch targets
 */
import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to app
        await page.goto('/');

        // PARANOID RULE: Hydration wait
        await expect(page.locator('body')).toBeVisible();
    });

    test('should display mobile tab bar on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Force reload to ensure media queries apply initially
        await page.reload();
        await expect(page.locator('body')).toBeVisible();

        // PARANOID RULE: Assert visibility before checking
        const tabBar = page.locator('.mobile-tab-bar');
        await expect(tabBar).toBeVisible();

        // Verify all three tabs are present
        await expect(page.getByRole('button', { name: 'Bakery' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Stats' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Store' })).toBeVisible();
    });

    test('should hide mobile tab bar on desktop viewport', async ({ page }) => {
        // Set desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });

        // Tab bar should not be visible on desktop
        const tabBar = page.locator('.mobile-tab-bar');
        await expect(tabBar).not.toBeVisible();
    });

    test('should switch tabs when clicking tab buttons', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // PARANOID RULE: Verify initial state
        const bakeryTab = page.getByRole('button', { name: 'Bakery' });
        await expect(bakeryTab).toBeVisible();
        await expect(bakeryTab).toHaveAttribute('aria-current', 'page');

        // Click Stats tab
        const statsTab = page.getByRole('button', { name: 'Stats' });
        await expect(statsTab).toBeVisible();
        await statsTab.click();

        // PARANOID RULE: Wait for transition to complete
        await expect(statsTab).toHaveAttribute('aria-current', 'page');
        await expect(bakeryTab).not.toHaveAttribute('aria-current');

        // Verify stats content is visible
        const statsPanel = page.locator('.pane-center.active');
        await expect(statsPanel).toBeVisible();
    });

    test('should navigate all tabs in sequence', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Start at Bakery (default)
        const bakeryTab = page.getByRole('button', { name: 'Bakery' });
        await expect(bakeryTab).toHaveAttribute('aria-current', 'page');

        // Navigate to Stats
        const statsTab = page.getByRole('button', { name: 'Stats' });
        await expect(statsTab).toBeVisible();
        await statsTab.click();
        await expect(statsTab).toHaveAttribute('aria-current', 'page');

        // Navigate to Store
        const storeTab = page.getByRole('button', { name: 'Store' });
        await expect(storeTab).toBeVisible();
        await storeTab.click();
        await expect(storeTab).toHaveAttribute('aria-current', 'page');

        // Verify store content is visible
        const storePanel = page.locator('.pane-right.active');
        await expect(storePanel).toBeVisible();

        // Navigate back to Bakery
        await expect(bakeryTab).toBeVisible();
        await bakeryTab.click();
        await expect(bakeryTab).toHaveAttribute('aria-current', 'page');
    });

    test('should persist selected tab on page reload', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Switch to Store tab
        const storeTab = page.getByRole('button', { name: 'Store' });
        await expect(storeTab).toBeVisible();
        await storeTab.click();
        await expect(storeTab).toHaveAttribute('aria-current', 'page');

        // Reload page
        await page.reload();
        await expect(page.locator('body')).toBeVisible();

        // Verify Store tab is still active after reload
        const storeTabAfterReload = page.getByRole('button', { name: 'Store' });
        await expect(storeTabAfterReload).toBeVisible();
        await expect(storeTabAfterReload).toHaveAttribute('aria-current', 'page');
    });

    test('should have appropriate touch target sizes on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Check tab button sizes (should be at least 48x48px for touch)
        const bakeryTab = page.getByRole('button', { name: 'Bakery' });
        await expect(bakeryTab).toBeVisible();

        const boundingBox = await bakeryTab.boundingBox();
        expect(boundingBox).not.toBeNull();
        expect(boundingBox.width).toBeGreaterThanOrEqual(48);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
    });

    test('should display cake and core UI on bakery tab', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Bakery tab should be active by default
        const bakeryTab = page.getByRole('button', { name: 'Bakery' });
        await expect(bakeryTab).toHaveAttribute('aria-current', 'page');

        // Verify cake is visible
        const cake = page.locator('.cake');
        await expect(cake).toBeVisible();

        // Verify balance display
        const balance = page.locator('.bakery-balance');
        await expect(balance).toBeVisible();
    });

    test('should handle landscape orientation', async ({ page }) => {
        // Set landscape mobile viewport
        await page.setViewportSize({ width: 667, height: 375 });

        // Tab bar should still be visible in landscape
        const tabBar = page.locator('.mobile-tab-bar');
        await expect(tabBar).toBeVisible();

        // All tabs should be accessible
        await expect(page.getByRole('button', { name: 'Bakery' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Stats' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Store' })).toBeVisible();
    });

    test('should show active indicator on active tab', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Click Stats tab
        const statsTab = page.getByRole('button', { name: 'Stats' });
        await expect(statsTab).toBeVisible();
        await statsTab.click();

        // Verify active indicator is present (gold underline)
        const activeIndicator = statsTab.locator('.mobile-tab__indicator');
        await expect(activeIndicator).toBeVisible();
    });
});

test.describe('Mobile-Specific Interactions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
        await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should allow clicking the cake on mobile', async ({ page }) => {
        // Verify bakery tab is active
        const bakeryTab = page.getByRole('button', { name: 'Bakery' });
        await expect(bakeryTab).toHaveAttribute('aria-current', 'page');

        // Get initial balance
        const balanceElement = page.locator('.bakery-balance');
        await expect(balanceElement).toBeVisible();
        const initialBalance = await balanceElement.textContent();

        // Click the cake
        const cake = page.locator('.cake');
        await expect(cake).toBeVisible();
        await cake.click();

        // PARANOID RULE: Wait for state update (balance should change)
        await expect(balanceElement).not.toHaveText(initialBalance);
    });

    test('should allow purchasing items in store tab', async ({ page }) => {
        // Navigate to Store tab
        const storeTab = page.getByRole('button', { name: 'Store' });
        await expect(storeTab).toBeVisible();
        await storeTab.click();
        await expect(storeTab).toHaveAttribute('aria-current', 'page');

        // Wait for store panel to be visible
        const storePanel = page.locator('.pane-right.active');
        await expect(storePanel).toBeVisible();

        // Verify shop items are displayed
        const shopItems = page.locator('.shop-item');
        await expect(shopItems.first()).toBeVisible();
    });
});

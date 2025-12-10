import { test, expect } from '@playwright/test';

test.describe('Pastry Paradox - Big Crunch & Dark Matter', () => {

    test('should show Big Crunch button when affordable (1 Trillion Cakes)', async ({ page }) => {
        // failed unlock condition: unlocked by upgrade 'the_end_is_nigh' which costs huge amount.
        // Actually, let's just check if the UI handles the pre-requisites.

        // Inject rich state
        await page.addInitScript(() => {
            const richState = {
                state: {
                    cakes: 2000000000000, // 2 Trillion
                    stats: { totalBaked: 2000000000000 },
                    generators: {
                        "apprentice_baker": 100 // Ensure some production
                    },
                    upgrades: [
                        { id: 'the_end_is_nigh', isPurchased: true }
                        // We need to simulate ensuring this upgrade is bought or accessible?
                        // Actually 'the_end_is_nigh' is an upgrade we likely need to buy. 
                        // If we inject it as purchased, the button should appear.
                    ]
                },
                version: 0
            };
            window.localStorage.setItem('pastry_paradox_save', JSON.stringify(richState));
        });

        await page.goto('/');

        // Verify Stats Panel is present (where prestige button lives)
        // Mobile might need navigation, but desktop shows it.
        // Let's assume desktop viewport for simplicity or handle mobile tab.

        // If mobile, switch to Stats tab
        if (await page.viewportSize().width <= 480) {
            await page.locator('.tab-btn:has-text("Stats")').click();
        }

        // Check for Big Crunch Button
        const prestigeBtn = page.locator('button', { hasText: 'THE BIG CRUNCH' });
        // It might be inside StatsPanel -> PrestigeSection

        // Initially it might just be available.
        // Wait, did I implement the button? Yes, BigCrunchButton.jsx.

        // We injected "the_end_is_nigh" as purchased? 
        // Logic in StatsPanel: unlocked={upgrades.some(u => u.id === 'the_end_is_nigh' && u.isPurchased)}

        await expect(prestigeBtn).toBeVisible({ timeout: 5000 });
        await expect(prestigeBtn).toBeEnabled();

        // Verify Dark Matter potential is positive
        await expect(page.locator('.prestige-available')).toContainText('Dark Matter');
    });

    test('should trigger Implosion and Reset on Big Crunch', async ({ page }) => {
        // Inject rich state with The End Is Nigh unlocked
        await page.addInitScript(() => {
            const richState = {
                state: {
                    cakes: 10000000000000, // 10T
                    stats: { totalBaked: 10000000000000, prestigeCount: 0 },
                    upgrades: [{ id: 'the_end_is_nigh', isPurchased: true }],
                    darkMatter: 0
                },
                version: 0
            };
            window.localStorage.setItem('pastry_paradox_save', JSON.stringify(richState));
        });

        await page.goto('/');

        if (await page.viewportSize().width <= 480) {
            await page.locator('.tab-btn:has-text("Stats")').click();
        }

        const prestigeBtn = page.locator('button', { hasText: 'THE BIG CRUNCH' });
        await prestigeBtn.click();

        // 1. Check for Implosion Overlay
        const implosion = page.locator('.big-crunch-implosion');
        await expect(implosion).toBeVisible();

        // 2. Wait for reset (animation is ~3s)
        await page.waitForTimeout(4000);

        // 3. Verify Reset
        const balance = page.locator('.bakery-balance');
        // Should be close to 0 (or baseline)
        await expect(balance).toContainText('0');

        // 4. Verify Dark Matter Gained
        const darkMatterDisplay = page.locator('.stat-value--gold').first(); // "Dark Matter" in Stats
        await expect(darkMatterDisplay).not.toContainText('0');
    });

    test('should access Dark Matter Tree', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                state: {
                    darkMatter: 100, // Have DM
                    stats: { prestigeCount: 1 } // Prestiged once
                },
                version: 0
            };
            window.localStorage.setItem('pastry_paradox_save', JSON.stringify(state));
        });

        await page.goto('/');

        // Look for Dark Matter Tree toggle/button
        // It resides in BakeryHeader usually? Or we added it?
        // "DarkMatterTree ... to BakeryHeader" in task.md

        const dmButton = page.locator('.dark-matter-badge'); // Assuming class name from implementation
        await expect(dmButton).toBeVisible();
        await dmButton.click();

        // Check Modal
        const modal = page.locator('.dark-tree-modal');
        await expect(modal).toBeVisible();

        // Check for Upgrade Nodes
        // They are images with generated icons
        await expect(page.locator('.transform-layer img').first()).toBeVisible();
    });

});

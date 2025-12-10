/**
 * Unit Tests: UpgradeGrid
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpgradeGrid } from './UpgradeGrid';

// Mock balanceData
vi.mock('@data/balance.json', () => ({
    default: {
        globalConfig: {
            upgradeVisibilityThreshold: 1.0,
            costMultiplier: 1.15
        },
        productionTiers: [] // Prevent crash in useCakeLogic if it iterates this
    }
}));

describe('UpgradeGrid', () => {
    const mockUpgrades = [
        { id: 'u1', name: 'Upgrade 1', cost: 100, isPurchased: false, description: 'Test 1' },
        { id: 'u2', name: 'Upgrade 2', cost: 200, isPurchased: true, description: 'Test 2' }, // Purchased
    ];

    it('renders upgrades grid', () => {
        render(<UpgradeGrid upgrades={mockUpgrades} balance={100} />);
        expect(screen.getByRole('heading', { name: /secret ingredients/i })).toBeInTheDocument();
    });

    it('shows only available upgrades (not purchased)', () => {
        render(<UpgradeGrid upgrades={mockUpgrades} balance={100} />);
        // Upgrade 1 should be visible, Upgrade 2 should be hidden (handled in StatsPanel)
        const buttons = screen.getAllByRole('button');
        const upgradeButtons = buttons.filter(btn => btn.className.includes('upgrade-card'));
        expect(upgradeButtons).toHaveLength(1);
    });

    it('allows purchasing affordable upgrade', () => {
        const onPurchase = vi.fn();
        const canPurchase = vi.fn().mockReturnValue(true);

        render(<UpgradeGrid
            upgrades={mockUpgrades}
            balance={100}
            canPurchase={canPurchase}
            onPurchase={onPurchase}
        />);

        const buttons = screen.getAllByRole('button');
        const upgradeButtons = buttons.filter(btn => btn.className.includes('upgrade-card'));
        fireEvent.click(upgradeButtons[0]);

        expect(onPurchase).toHaveBeenCalledWith('u1');
    });

    it('shows Buy All button when available', () => {
        const canPurchase = vi.fn().mockReturnValue(true);
        render(<UpgradeGrid upgrades={mockUpgrades} balance={100} canPurchase={canPurchase} />);
        expect(screen.getByText('Buy All')).toBeInTheDocument();
    });
});

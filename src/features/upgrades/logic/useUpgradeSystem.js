/**
 * useUpgradeSystem - "67" pattern detection and upgrade effects
 * Container Component (NO UI)
 */
import { useState, useCallback, useMemo } from 'react';
import balanceData from '@data/balance.json';

const { upgrades } = balanceData;

// Pre-build Map for O(1) lookup by ID (instead of O(n) find on every call)
const upgradeById = new Map(
    Object.values(upgrades).map(upgrade => [upgrade.id, upgrade])
);

/**
 * Main upgrade system hook
 */
export function useUpgradeSystem({ totalBaked, setCpsMultiplier }) {
    // Track purchased upgrades
    const [purchasedUpgrades, setPurchasedUpgrades] = useState({});

    // Convert upgrades object to array for easier rendering
    const upgradeList = useMemo(() => {
        return Object.values(upgrades).map(upgrade => ({
            ...upgrade,
            isPurchased: !!purchasedUpgrades[upgrade.id],
        }));
    }, [purchasedUpgrades]);

    // Purchase an upgrade - O(1) lookup using pre-built Map
    const purchaseUpgrade = useCallback((upgradeId, balance, setBalance) => {
        const upgrade = upgradeById.get(upgradeId);
        if (!upgrade) return false;
        if (purchasedUpgrades[upgradeId]) return false;
        if (balance < upgrade.cost) return false;

        // Deduct cost
        setBalance(prev => prev - upgrade.cost);

        // Mark as purchased
        setPurchasedUpgrades(prev => ({
            ...prev,
            [upgradeId]: true,
        }));

        // Apply effect
        if (upgrade.effect) {
            switch (upgrade.effect.type) {
                case 'cpsMultiplier':
                    setCpsMultiplier(prev => prev * upgrade.effect.value);
                    break;
                case 'unlockEvent':
                    // Event system will listen for this
                    window.dispatchEvent(new CustomEvent('unlockEvent', {
                        detail: { eventId: upgrade.effect.value }
                    }));
                    break;
                default:
                    console.warn('Unknown upgrade effect type:', upgrade.effect.type);
            }
        }

        return true;
    }, [purchasedUpgrades, setCpsMultiplier]);

    // Check if upgrade is available (can afford + not purchased) - O(1) lookup
    const canPurchaseUpgrade = useCallback((upgradeId, balance) => {
        const upgrade = upgradeById.get(upgradeId);
        if (!upgrade) return false;
        if (purchasedUpgrades[upgradeId]) return false;
        return balance >= upgrade.cost;
    }, [purchasedUpgrades]);

    // Check for "67" patterns in total baked (easter egg)
    const has67Pattern = useMemo(() => {
        const totalStr = Math.floor(totalBaked).toString();
        return totalStr.includes('67');
    }, [totalBaked]);

    // Reset upgrades for prestige (keep permanent unlocks like 'the_end_is_nigh')
    const resetForPrestige = useCallback(() => {
        // Keep only permanent prestige unlocks
        setPurchasedUpgrades(prev => {
            const kept = {};
            // Keep the prestige unlock upgrade (permanent)
            if (prev['the_end_is_nigh']) {
                kept['the_end_is_nigh'] = true;
            }
            return kept;
        });
        // Reset CPS multiplier to base
        setCpsMultiplier(1);
    }, [setCpsMultiplier]);

    return {
        upgradeList,
        purchasedUpgrades,
        purchaseUpgrade,
        canPurchaseUpgrade,
        has67Pattern,
        resetForPrestige,
    };
}

export default useUpgradeSystem;

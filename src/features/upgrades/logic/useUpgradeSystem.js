/**
 * useUpgradeSystem - "67" pattern detection and upgrade effects
 * Container Component (NO UI)
 */
import { useState, useCallback, useMemo } from 'react';
import balanceData from '@data/balance.json';

const { upgrades } = balanceData;

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

    // Purchase an upgrade
    const purchaseUpgrade = useCallback((upgradeId, balance, setBalance) => {
        const upgrade = upgrades[Object.keys(upgrades).find(k => upgrades[k].id === upgradeId)];
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

    // Check if upgrade is available (can afford + not purchased)
    const canPurchaseUpgrade = useCallback((upgradeId, balance) => {
        const upgrade = upgrades[Object.keys(upgrades).find(k => upgrades[k].id === upgradeId)];
        if (!upgrade) return false;
        if (purchasedUpgrades[upgradeId]) return false;
        return balance >= upgrade.cost;
    }, [purchasedUpgrades]);

    // Check for "67" patterns in total baked (easter egg)
    const has67Pattern = useMemo(() => {
        const totalStr = Math.floor(totalBaked).toString();
        return totalStr.includes('67');
    }, [totalBaked]);

    return {
        upgradeList,
        purchasedUpgrades,
        purchaseUpgrade,
        canPurchaseUpgrade,
        has67Pattern,
    };
}

export default useUpgradeSystem;

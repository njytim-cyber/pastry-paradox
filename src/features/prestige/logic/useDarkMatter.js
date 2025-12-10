/**
 * useDarkMatter.js
 * Logic for the Dark Matter Upgrade Tree
 */
import { useCallback, useMemo } from 'react';
import balanceData from '@data/balance.json';

const { darkMatterUpgrades } = balanceData;

// Pre-build Map for O(1) lookup
const upgradeMap = new Map(
    Object.values(darkMatterUpgrades || {}).map(u => [u.id, u])
);

export function useDarkMatter({
    darkMatter,
    setDarkMatter,
    darkUpgrades,
    setDarkUpgrades
}) {
    // 1. Compute derived stats from unlocked upgrades
    const darkEffects = useMemo(() => {
        const effects = {
            costScale: 1,
            productionMult: 1,
            cpsMult: 1,
            timeWarp: 1,
            clickPowerMult: 1,
            critChance: 0,
            offlineBonus: 1,
            passiveGen: 0
        };

        if (!darkUpgrades) return effects;

        darkUpgrades.forEach(id => {
            const upg = upgradeMap.get(id);
            if (!upg || !upg.effect) return;

            const { type, value } = upg.effect;
            switch (type) {
                case 'globalCostScale':
                    effects.costScale *= value;
                    break;
                case 'globalProductionMult':
                    effects.productionMult *= value;
                    break;
                case 'cpsMultiplier':
                    effects.cpsMult *= value;
                    break;
                case 'timeWarp':
                    effects.timeWarp *= value;
                    break;
                case 'clickPowerMult':
                    effects.clickPowerMult *= value;
                    break;
                case 'critChance':
                    effects.critChance += value;
                    break;
                case 'offlineBonus':
                    effects.offlineBonus *= value;
                    break;
                case 'passiveDarkMatter':
                    effects.passiveGen += value;
                    break;
            }
        });

        // Clamp or finalize
        return effects;
    }, [darkUpgrades]);

    // 2. Buy Upgrade Action
    const buyDarkUpgrade = useCallback((upgradeId) => {
        const upgrade = upgradeMap.get(upgradeId);
        if (!upgrade) return false;

        // Check if already owned
        if (darkUpgrades.includes(upgradeId)) return false;

        // Check cost
        if (darkMatter < upgrade.cost) return false;

        // Check parent requirement (if any)
        if (upgrade.parent && upgrade.parent !== 'ROOT' && !darkUpgrades.includes(upgrade.parent)) {
            // "dark_core" has parent null.
            // "dark_matter_1" has parent "dark_core".
            // If parent is not null and not in list, fail.
            return false;
        }

        // Transaction
        setDarkMatter(prev => prev - upgrade.cost);
        setDarkUpgrades(prev => [...prev, upgradeId]);

        return true;
    }, [darkMatter, darkUpgrades, setDarkMatter, setDarkUpgrades]);

    // 3. Check if purchaseable (for UI)
    const canAfford = useCallback((upgradeId) => {
        const upgrade = upgradeMap.get(upgradeId);
        if (!upgrade) return false;
        if (darkUpgrades.includes(upgradeId)) return false; // Already owned
        if (darkMatter < upgrade.cost) return false;

        // Parent check
        if (upgrade.parent && !darkUpgrades.includes(upgrade.parent)) return false;

        return true;
    }, [darkMatter, darkUpgrades]);

    // 4. Apply Effects to Game Loop (Sync with useCakeLogic)
    // We need to export these values so the parent (App.js) can pass them to useCakeLogic
    // actually, useCakeLogic has 'modifiers' but those are usually temporary buffs.
    // Permanent prestige buffs should be passed as 'globalMultiplier' or similar?
    // 'useCakeLogic' has 'globalMultiplier'. 
    // We might need to Refactor useCakeLogic to accept 'prestigeMultipliers' logic more cleanly,
    // Or just calculate a single 'totalGlobalMultiplier' here and pass it down.

    // Calculate Total Multiplier combining all factors
    const totalGlobalMultiplier = useMemo(() => {
        return darkEffects.productionMult * darkEffects.cpsMult;
        // Note: cpsMult in useCakeLogic effectively multiplies baseCps.
        // globalProductionMult might be same concept.
        // Let's combine them for simple 'globalMultiplier' injection if useCakeLogic only expects one.
        // But useCakeLogic has separate 'cpsMultiplier' and 'globalMultiplier'.
    }, [darkEffects]);

    return {
        darkEffects,
        buyDarkUpgrade,
        canAfford,
        totalGlobalMultiplier
    };
}

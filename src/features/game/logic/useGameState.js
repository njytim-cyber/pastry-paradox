
/**
 * useGameState - Central game state management
 * Handles: prestige, bakery naming, stats tracking, sell mode
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import balanceData from '@data/balance.json';

const { globalConfig, prestige } = balanceData;

// Load saved state from localStorage (called once during initialization)
const loadSavedState = () => {
    try {
        const saved = localStorage.getItem('pastry_paradox_gamestate');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.warn('Failed to load gamestate:', e);
        return null;
    }
};

/**
 * Main game state hook
 */
export function useGameState() {
    // Persistence Key
    const SAVE_KEY_GAMESTATE = 'pastry_paradox_gamestate';

    // Lazy initialization: only parse localStorage once on mount
    const [savedState] = useState(loadSavedState);

    // Bakery name
    const [bakeryName, setBakeryName] = useState(savedState?.bakeryName || "Your Patisserie");

    // Stats tracking
    const [stats, setStats] = useState(savedState?.stats || {
        totalClicks: 0,
        totalBaked: 0,
        totalSpent: 0,
        sessionStart: Date.now(),
        allTimeBaked: 0,
        prestigeCount: 0,
    });

    // Prestige system (Dark Matter)
    const [darkMatter, setDarkMatter] = useState(savedState?.darkMatter || 0);
    const [darkUpgrades, setDarkUpgrades] = useState(savedState?.darkUpgrades || []);

    // Legacy support
    const [legacyMultiplier, setLegacyMultiplier] = useState(savedState?.legacyMultiplier || 1);

    // Shop mode
    const [shopMode, setShopMode] = useState('buy'); // 'buy' | 'sell'
    const [buyQuantity, setBuyQuantity] = useState(1); // 1, 10, 100

    // Calculate Dark Matter earned from reset
    const calculateDarkMatter = useCallback((totalBaked) => {
        // Formula: 1 dark matter per X amount baked (1 Trillion base)
        const required = prestige?.requiredBaked || 1000000000000;
        if (totalBaked < required) return 0;
        return Math.floor(Math.cbrt(totalBaked / required));
    }, []);

    // Calculate legacy multiplier from points (Base flat bonus kept for now, but tree adds more)
    const calculateLegacyMultiplier = useCallback((points) => {
        // Each dark matter point = +X% CpS (Default 2% or from config)
        const bonus = prestige?.cpsBonusPerPoint || 0.02;
        return 1 + (points * bonus);
    }, []);

    // Track a click
    const recordClick = useCallback(() => {
        setStats(prev => ({
            ...prev,
            totalClicks: prev.totalClicks + 1,
        }));
    }, []);

    // Track baked cakes
    const recordBaked = useCallback((amount) => {
        setStats(prev => ({
            ...prev,
            totalBaked: prev.totalBaked + amount,
            allTimeBaked: prev.allTimeBaked + amount,
        }));
    }, []);

    // Track spending
    const recordSpent = useCallback((amount) => {
        setStats(prev => ({
            ...prev,
            totalSpent: prev.totalSpent + amount,
        }));
    }, []);

    // Calculate sell price for a generator (single or bulk)
    const getSellPrice = useCallback((baseCost, owned, quantity = 1) => {
        if (owned < quantity) return 0;
        // Refund = Cost of buying these items fresh (at the time) * refundRate
        // Items being sold are indices: (owned - quantity) to (owned - 1)
        // This is exactly asking: "How much would it cost to buy 'quantity' items if I currently owned 'owned - quantity'?"
        const startOwned = owned - quantity;

        // Import helper dynamically or assume it's available? 
        // We need to import it at top of file. For now, let's duplicate the logic to avoid import cycle issues if any,
        // OR better: Move helper to a shared utility? 
        // Actually, logic is identical. Let's just implement the O(1) math here directly to be safe and clean.

        const r = globalConfig.costMultiplier || 1.15;
        const refundRate = globalConfig.sellRefundRate || 0.25;

        // Geometric Series: Sum = a * r^k * (r^n - 1) / (r - 1)
        // a = baseCost
        // k = startOwned
        // n = quantity

        const firstTerm = baseCost * Math.pow(r, startOwned);
        const buyCost = firstTerm * (Math.pow(r, quantity) - 1) / (r - 1);

        return Math.floor(buyCost * refundRate);
    }, []);

    // Perform prestige reset (The Big Crunch)
    const performPrestige = useCallback((totalBaked, resetGame) => {
        const earnedPoints = calculateDarkMatter(totalBaked);
        if (earnedPoints <= 0) return false;

        const newTotalPoints = darkMatter + earnedPoints;
        setDarkMatter(newTotalPoints);
        setLegacyMultiplier(calculateLegacyMultiplier(newTotalPoints));

        // Reset stats
        setStats(prev => ({
            ...prev,
            totalClicks: 0,
            totalBaked: 0, // Reset current run baked
            sessionStart: Date.now(),
            prestigeCount: prev.prestigeCount + 1,
        }));

        // Reset bakery name override if it was still default (optional)? 
        // User requested NOT to touch the name automatically. So we do nothing here.

        // Callback to reset the game state (buildings, upgrades, etc)
        resetGame?.();
        return true;
    }, [darkMatter, calculateDarkMatter, calculateLegacyMultiplier]);

    // Buy Dark Matter Upgrade
    const buyDarkUpgrade = useCallback((upgradeId) => {
        const upgrade = balanceData.darkMatterUpgrades[upgradeId];
        if (!upgrade) return false;

        // Check ownership
        if (darkUpgrades.includes(upgradeId)) return false;

        // Check cost
        if (darkMatter < upgrade.cost) return false;

        // Check parent (if applicable)
        if (upgrade.parent && !darkUpgrades.includes(upgrade.parent)) return false;

        // Deduct cost
        setDarkMatter(prev => prev - upgrade.cost);

        // Add to upgrades
        setDarkUpgrades(prev => [...prev, upgradeId]);

        return true;
    }, [darkMatter, darkUpgrades]);

    // Potential legacy points if prestige now (Dark Matter)
    // We calculate this in the return object or here if needed for other logic
    // Currently only needed for UI, so we can expose the function or a memoized value in the return

    // Auto-save
    useEffect(() => {
        const save = () => {
            const stateToSave = {
                bakeryName,
                stats,
                darkMatter,
                darkUpgrades,
                legacyMultiplier
            };
            try {
                localStorage.setItem(SAVE_KEY_GAMESTATE, JSON.stringify(stateToSave));
            } catch (e) {
                console.warn('Failed to save gamestate:', e);
            }
        };

        const interval = setInterval(save, 10000);
        window.addEventListener('beforeunload', save);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', save);
            save();
        };
    }, [bakeryName, stats, darkMatter, darkUpgrades, legacyMultiplier]);

    // Time played this session (computed dynamically, not memoized as it changes constantly)
    // Note: This will be stale - use getSessionTime() for live value
    const getSessionTime = useCallback(() => Date.now() - stats.sessionStart, [stats.sessionStart]);

    return {
        // Bakery
        bakeryName,
        setBakeryName,

        // Stats
        stats,
        recordClick,
        recordBaked,
        recordSpent,
        getSessionTime,

        // Shop mode
        shopMode,
        setShopMode,
        buyQuantity,
        setBuyQuantity,
        getSellPrice,

        // Prestige (Dark Matter)
        darkMatter,
        setDarkMatter,
        darkUpgrades,
        setDarkUpgrades,
        legacyMultiplier,
        calculateDarkMatter, // Exposed for UI preview
        potentialDarkMatter: useMemo(() => calculateDarkMatter(stats.totalBaked), [stats.totalBaked, calculateDarkMatter]),
        performPrestige,
        canPrestige: calculateDarkMatter(stats.totalBaked) > 0,
        buyDarkUpgrade,
    };
}

export default useGameState;

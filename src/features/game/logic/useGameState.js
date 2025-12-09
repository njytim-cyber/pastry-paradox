/**
 * useGameState - Central game state management
 * Handles: prestige, bakery naming, stats tracking, sell mode
 */
import { useState, useCallback, useMemo } from 'react';
import balanceData from '@data/balance.json';

const { globalConfig, prestige } = balanceData;

/**
 * Main game state hook
 */
export function useGameState() {
    // Bakery name
    const [bakeryName, setBakeryName] = useState("Your Patisserie");

    // Stats tracking
    const [stats, setStats] = useState({
        totalClicks: 0,
        totalBaked: 0,
        totalSpent: 0,
        sessionStart: Date.now(),
        allTimeBaked: 0,
        prestigeCount: 0,
    });

    // Prestige system
    const [legacyPoints, setLegacyPoints] = useState(0);
    const [legacyMultiplier, setLegacyMultiplier] = useState(1);

    // Shop mode
    const [shopMode, setShopMode] = useState('buy'); // 'buy' | 'sell'
    const [buyQuantity, setBuyQuantity] = useState(1); // 1, 10, 100

    // Calculate legacy points earned from reset
    const calculateLegacyPoints = useCallback((totalBaked) => {
        // Formula: 1 legacy point per X amount baked
        const required = prestige?.requiredBaked || 1000000000000;
        if (totalBaked < required) return 0;
        return Math.floor(Math.cbrt(totalBaked / required));
    }, []);

    // Calculate legacy multiplier from points
    const calculateLegacyMultiplier = useCallback((points) => {
        // Each legacy point = +X% CpS
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

    // Perform prestige reset
    const performPrestige = useCallback((totalBaked, resetGame) => {
        const earnedPoints = calculateLegacyPoints(totalBaked);
        if (earnedPoints <= 0) return false;

        const newTotalPoints = legacyPoints + earnedPoints;
        setLegacyPoints(newTotalPoints);
        setLegacyMultiplier(calculateLegacyMultiplier(newTotalPoints));

        setStats(prev => ({
            ...prev,
            totalClicks: 0,
            totalBaked: 0,
            totalSpent: 0,
            sessionStart: Date.now(),
            prestigeCount: prev.prestigeCount + 1,
        }));

        // Callback to reset the game state
        resetGame?.();
        return true;
    }, [legacyPoints, calculateLegacyPoints, calculateLegacyMultiplier]);

    // Potential legacy points if prestige now
    const potentialLegacyPoints = useMemo(() => {
        return calculateLegacyPoints(stats.totalBaked);
    }, [stats.totalBaked, calculateLegacyPoints]);

    // Time played this session
    const sessionTime = useMemo(() => {
        return Date.now() - stats.sessionStart;
    }, [stats.sessionStart]);

    return {
        // Bakery
        bakeryName,
        setBakeryName,

        // Stats
        stats,
        recordClick,
        recordBaked,
        recordSpent,
        sessionTime,

        // Shop mode
        shopMode,
        setShopMode,
        buyQuantity,
        setBuyQuantity,
        getSellPrice,

        // Prestige
        legacyPoints,
        legacyMultiplier,
        potentialLegacyPoints,
        performPrestige,
        canPrestige: potentialLegacyPoints > 0,
    };
}

export default useGameState;

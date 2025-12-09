/**
 * useGameState - Central game state management
 * Handles: prestige, bakery naming, stats tracking, sell mode
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import balanceData from '@data/balance.json';

const { globalConfig } = balanceData;
const SELL_REFUND_RATE = 0.25; // 25% refund when selling

/**
 * Main game state hook
 */
export function useGameState() {
    // Bakery name
    const [bakeryName, setBakeryName] = useState("My Patisserie");

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
        // Formula: 1 legacy point per 1 trillion baked, minimum 1 trillion to prestige
        const trillion = 1e12;
        if (totalBaked < trillion) return 0;
        return Math.floor(Math.sqrt(totalBaked / trillion));
    }, []);

    // Calculate legacy multiplier from points
    const calculateLegacyMultiplier = useCallback((points) => {
        // Each legacy point = +2% CpS
        return 1 + (points * 0.02);
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

    // Calculate sell price for a generator
    const getSellPrice = useCallback((baseCost, owned) => {
        if (owned <= 0) return 0;
        const costMultiplier = globalConfig.costMultiplier || 1.15;
        // Sell price is the cost of the last purchased unit * refund rate
        const lastPurchasePrice = Math.floor(baseCost * Math.pow(costMultiplier, owned - 1));
        return Math.floor(lastPurchasePrice * SELL_REFUND_RATE);
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

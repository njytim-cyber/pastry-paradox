/**
 * useCakeLogic - Core click handling and balance state management
 * Container Component (NO UI)
 * 
 * Imports from @data/balance.json per Data-Driven Law
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import balanceData from '@data/balance.json';

const { globalConfig, productionTiers } = balanceData;
const COST_MULTIPLIER = globalConfig.costMultiplier || 1.15;
const BASE_CLICK_POWER = balanceData.entities?.player?.baseClickPower || 1;
const SAVE_KEY = 'pastry_paradox_save';

// Number suffix constants (DRY - single source of truth)
const NUMBER_SUFFIXES_SHORT = ['', 'K', 'M', 'B', 'T', 'Q'];
const NUMBER_SUFFIXES_WORD = [
    '', ' Thousand', ' Million', ' Billion', ' Trillion', ' Quadrillion',
    ' Quintillion', ' Sextillion', ' Septillion', ' Octillion', ' Nonillion', ' Decillion'
];

/**
 * Load saved game state from localStorage
 */
function loadSavedState() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load save:', e);
    }
    return null;
}

/**
 * Save game state to localStorage
 */
function saveGameState(state) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
            ...state,
            savedAt: Date.now(),
        }));
    } catch (e) {
        console.warn('Failed to save:', e);
    }
}

/**
 * Calculate the current price for a generator tier
 * @param {number} baseCost - Base cost from balance.json
 * @param {number} owned - Number currently owned
 * @returns {number} Current purchase price
 */
export function calculatePrice(baseCost, owned) {
    return Math.floor(baseCost * Math.pow(COST_MULTIPLIER, owned));
}

/**
 * Format large numbers for display (K, M, B, T, Q notation)
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export function formatNumber(num) {
    if (num < 100) {
        // Show 1 decimal place for small numbers, remove trailing .0
        return parseFloat(num.toFixed(1)).toString();
    }
    if (num < 1000) return Math.floor(num).toString();

    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier >= NUMBER_SUFFIXES_SHORT.length) {
        return num.toExponential(2);
    }

    const scaled = num / Math.pow(1000, tier);
    return scaled.toFixed(scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2) + NUMBER_SUFFIXES_SHORT[tier];
}

/**
 * Format numbers using words (Thousand, Million, Billion)
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export function formatNumberWord(num) {
    if (num < 1000) return Math.floor(num).toLocaleString();

    // Tier 1 = Thousand (10^3), Tier 2 = Million (10^6), etc.
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier >= NUMBER_SUFFIXES_WORD.length) {
        return num.toExponential(2);
    }

    const scaled = num / Math.pow(1000, tier);
    const formatted = scaled.toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1');
    return formatted + NUMBER_SUFFIXES_WORD[tier];
}

/**
 * Calculate total cost for bulk purchase using Geometric Series Formula
 * O(1) complexity instead of O(N) loop
 * Formula: Sum = a * r^k * (1 - r^n) / (1 - r)
 * where a=base, r=1.15, k=owned, n=quantity
 */
export function calculateBulkPrice(baseCost, owned, quantity) {
    if (quantity <= 0) return 0;
    if (quantity === 1) return calculatePrice(baseCost, owned);

    const r = 1.15; // Hardcoded multiplier for consistency with balance.json

    // First term cost: a * r^k
    const firstTerm = baseCost * Math.pow(r, owned);

    // Sum of geometric series: firstTerm * (1 - r^n) / (1 - r)
    // Since r > 1, we can flip signs: firstTerm * (r^n - 1) / (r - 1)
    const sum = firstTerm * (Math.pow(r, quantity) - 1) / (r - 1);

    return Math.floor(sum);
}

/**
 * Format numbers returning value and suffix separately
 * @param {number} num - Number to format
 * @returns {{value: string, suffix: string}}
 */
export function formatNumberParts(num) {
    if (num < 1000) return { value: Math.floor(num).toLocaleString(), suffix: '' };

    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier >= NUMBER_SUFFIXES_WORD.length) {
        return { value: num.toExponential(2), suffix: '' };
    }

    const scaled = num / Math.pow(1000, tier);
    const formatted = scaled.toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1');

    return { value: formatted, suffix: NUMBER_SUFFIXES_WORD[tier] };
}

/**
 * Main cake logic hook
 * Manages: balance, CpS, click events, generators
 * Includes localStorage persistence
 */
export function useCakeLogic(options = {}) {
    // Load saved state
    const savedState = loadSavedState();

    // Core state (with saved values or defaults)
    const [balance, setBalance] = useState(savedState?.balance || 0);
    const [totalBaked, setTotalBaked] = useState(savedState?.totalBaked || 0);
    const [clickPower, setClickPower] = useState(savedState?.clickPower || BASE_CLICK_POWER);
    const [cpsMultiplier, setCpsMultiplier] = useState(savedState?.cpsMultiplier || 1);
    const [globalMultiplier, setGlobalMultiplier] = useState(savedState?.globalMultiplier || 1);

    // Generator ownership: { [tierId]: count }
    const [generators, setGenerators] = useState(() => {
        if (savedState?.generators) {
            return savedState.generators;
        }
        const initial = {};
        productionTiers.forEach(tier => {
            initial[tier.id] = 0;
        });
        return initial;
    });

    // Temporary Modifiers (Buffs)
    const [modifiers, setModifiers] = useState({
        production: 1,
        click: 1,
        costScale: 1, // < 1 means discount
        global: 1
    });

    // Buff Application Helper
    const applyBuff = useCallback((type, value, durationSeconds) => {
        // Map buff type to modifier key
        let key = '';
        if (type === 'production_multiplier') key = 'production';
        else if (type === 'click_multiplier') key = 'click';
        else if (type === 'discount') key = 'costScale'; // e.g. 0.5 discount = 0.5 scale
        else if (type === 'global_multiplier') key = 'global';

        if (!key) return;

        // Apply modifier
        setModifiers(prev => ({ ...prev, [key]: value }));

        // Reset after duration
        setTimeout(() => {
            setModifiers(prev => ({ ...prev, [key]: 1 }));
        }, durationSeconds * 1000);
    }, []);

    // Calculate CpS (Cakes Per Second) - memoized to avoid recalc on every render
    const cps = useMemo(() => {
        const baseCps = productionTiers.reduce((total, tier) => {
            const owned = generators[tier.id] || 0;
            return total + (tier.baseCps * owned);
        }, 0);
        return baseCps * cpsMultiplier * globalMultiplier * modifiers.production * modifiers.global;
    }, [generators, cpsMultiplier, globalMultiplier, modifiers.production, modifiers.global]);

    // Instant Resource Helper
    const grantResources = useCallback((secondsOfProduction) => {
        // Calculate based on CURRENT effective CpS
        const amount = cps * secondsOfProduction;
        if (amount > 0) {
            setBalance(prev => prev + amount);
            setTotalBaked(prev => prev + amount);
        }
        return amount;
    }, [cps]);

    // Click particles for animation
    const [particles, setParticles] = useState([]);
    const particleIdRef = useRef(0);

    // Calculate CpS (Cakes Per Second)


    // Game tick - accumulate CpS
    useEffect(() => {
        const tickInterval = 1000 / globalConfig.fps;
        const cpsPerTick = cps / globalConfig.fps;

        if (cps <= 0) return;

        const interval = setInterval(() => {
            setBalance(prev => prev + cpsPerTick);
            setTotalBaked(prev => prev + cpsPerTick);
            // Notify external listeners (e.g. game state stats)
            if (options?.onTick) {
                options.onTick(cpsPerTick);
            }
        }, tickInterval);

        return () => clearInterval(interval);
    }, [cps, options]);

    // Handle cake click
    const handleClick = useCallback((event) => {
        const earned = clickPower * globalMultiplier * modifiers.click * modifiers.global;

        setBalance(prev => prev + earned);
        setTotalBaked(prev => prev + earned);

        // Create click particle
        const particleId = ++particleIdRef.current;
        const rect = event?.currentTarget?.getBoundingClientRect?.();
        const x = event?.clientX ?? (rect ? rect.left + rect.width / 2 : 150);
        const y = event?.clientY ?? (rect ? rect.top + rect.height / 2 : 150);

        setParticles(prev => [...prev, {
            id: particleId,
            x,
            y,
            value: earned,
        }]);

        // Remove particle after animation
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== particleId));
        }, 1000);

        return earned;
    }, [clickPower, globalMultiplier, modifiers]);

    // Purchase a generator (single or bulk)
    const purchaseGenerator = useCallback((tierId, quantity = 1) => {
        const tier = productionTiers.find(t => t.id === tierId);
        if (!tier) return false;

        const owned = generators[tierId] || 0;
        // Calculate total cost using O(1) formula
        let totalCost = calculateBulkPrice(tier.baseCost, owned, quantity);

        // Apply discount if active
        if (modifiers.costScale !== 1) {
            totalCost = Math.floor(totalCost * modifiers.costScale);
        }

        if (balance < totalCost) return false;

        setBalance(prev => prev - totalCost);
        setGenerators(prev => ({
            ...prev,
            [tierId]: (prev[tierId] || 0) + quantity,
        }));

        return true;
    }, [balance, generators, modifiers.costScale]);

    // Check if can afford generator (single or bulk)
    const canAfford = useCallback((tierId, quantity = 1) => {
        const tier = productionTiers.find(t => t.id === tierId);
        if (!tier) return false;

        const owned = generators[tierId] || 0;

        // Calculate total cost for bulk purchase O(1)
        let totalCost = calculateBulkPrice(tier.baseCost, owned, quantity);

        // Apply discount
        if (modifiers.costScale !== 1) {
            totalCost = Math.floor(totalCost * modifiers.costScale);
        }

        return balance >= totalCost;
    }, [balance, generators, modifiers.costScale]);

    // Get generator info
    const getGeneratorInfo = useCallback((tierId) => {
        const tier = productionTiers.find(t => t.id === tierId);
        if (!tier) return null;

        const owned = generators[tierId] || 0;
        let currentPrice = calculatePrice(tier.baseCost, owned);

        // Apply discount for display
        if (modifiers.costScale !== 1) {
            currentPrice = Math.floor(currentPrice * modifiers.costScale);
        }

        return {
            ...tier,
            owned,
            currentPrice,
            contribution: tier.baseCps * owned * cpsMultiplier * globalMultiplier * modifiers.production * modifiers.global,
        };
    }, [generators, cpsMultiplier, globalMultiplier, modifiers]);

    // Keep track of latest state for saving without re-triggering effects
    const stateRef = useRef({ balance, totalBaked, clickPower, cpsMultiplier, globalMultiplier, generators });
    useEffect(() => {
        stateRef.current = { balance, totalBaked, clickPower, cpsMultiplier, globalMultiplier, generators };
    }, [balance, totalBaked, clickPower, cpsMultiplier, globalMultiplier, generators]);

    // Auto-save every 10 seconds and on page unload
    useEffect(() => {
        const save = () => {
            saveGameState(stateRef.current);
        };

        const saveInterval = setInterval(save, 10000);

        const handleBeforeUnload = () => {
            save();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Save on cleanup (only happens on unmount now)
            save();
        };
    }, []); // Empty dependency array ensures this only runs once on mount/unmount

    // Sell a generator (single or bulk)
    const sellGenerator = useCallback((tierId, quantity = 1) => {
        const tier = productionTiers.find(t => t.id === tierId);
        if (!tier) return false;

        const owned = generators[tierId] || 0;
        if (owned < quantity) return false; // Strict sell rule? Or sell max? Strict for now.

        let totalRefund = 0;
        const refundRate = globalConfig.sellRefundRate || 0.25;

        // Calculate total refund iteratively (selling from highest owned down)
        for (let i = 0; i < quantity; i++) {
            // Price of the Nth item (where N = owned - i)
            // If owned=1, we are selling the 1st item (index 0). cost = base * 1.15^0
            const itemIndex = owned - 1 - i;
            const originalCost = Math.floor(tier.baseCost * Math.pow(COST_MULTIPLIER, itemIndex));
            totalRefund += Math.floor(originalCost * refundRate);
        }

        setBalance(prev => prev + totalRefund);
        setGenerators(prev => ({
            ...prev,
            [tierId]: prev[tierId] - quantity,
        }));

        return true;
    }, [generators]);

    return {
        // State
        balance,
        totalBaked,
        cps,
        clickPower,
        globalMultiplier,
        generators,
        particles,
        productionTiers,

        // Actions
        handleClick,
        purchaseGenerator,
        sellGenerator,
        canAfford,
        getGeneratorInfo,

        // Upgrade setters (for upgrade system to use)
        setClickPower,
        setCpsMultiplier,
        setGlobalMultiplier,

        // Buff Actions
        applyBuff,
        grantResources,
        modifiers
    };
}

export default useCakeLogic;

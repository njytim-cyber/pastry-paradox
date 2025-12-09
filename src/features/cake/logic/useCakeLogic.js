/**
 * useCakeLogic - Core click handling and balance state management
 * Container Component (NO UI)
 * 
 * Imports from @data/balance.json per Data-Driven Law
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import balanceData from '@data/balance.json';

const { globalConfig, productionTiers } = balanceData;
const COST_MULTIPLIER = globalConfig.costMultiplier || 1.15;
const BASE_CLICK_POWER = balanceData.entities?.player?.baseClickPower || 1;
const SAVE_KEY = 'pastry_paradox_save';

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

    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q'];
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier >= suffixes.length) {
        return num.toExponential(2);
    }

    const scaled = num / Math.pow(1000, tier);
    return scaled.toFixed(scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2) + suffixes[tier];
}

/**
 * Format numbers using words (Thousand, Million, Billion)
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export function formatNumberWord(num) {
    if (num < 1000) return Math.floor(num).toLocaleString();

    const suffixes = [
        '', ' Thousand', ' Million', ' Billion', ' Trillion', ' Quadrillion',
        ' Quintillion', ' Sextillion', ' Septillion', ' Octillion', ' Nonillion', ' Decillion'
    ];

    // Tier 1 = Thousand (10^3), Tier 2 = Million (10^6), etc.
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier >= suffixes.length) {
        return num.toExponential(2);
    }

    const scaled = num / Math.pow(1000, tier);
    // Show up to 2 decimal places, but remove trailing zeros like .00
    // If it's an integer, don't show decimals.
    // e.g. 1.5 Million, 2 Million, 500 Thousand

    // Logic: 
    // If >= 100, show 0 or 1 decimal? Users usually like "250 Million"
    // If < 10, show 2? "1.25 Million"

    const formatted = scaled.toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1');
    return formatted + suffixes[tier];
}

/**
 * Format numbers returning value and suffix separately
 * @param {number} num - Number to format
 * @returns {{value: string, suffix: string}}
 */
export function formatNumberParts(num) {
    if (num < 1000) return { value: Math.floor(num).toLocaleString(), suffix: '' };

    const suffixes = [
        '', ' Thousand', ' Million', ' Billion', ' Trillion', ' Quadrillion',
        ' Quintillion', ' Sextillion', ' Septillion', ' Octillion', ' Nonillion', ' Decillion'
    ];

    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier >= suffixes.length) {
        return { value: num.toExponential(2), suffix: '' };
    }

    const scaled = num / Math.pow(1000, tier);
    const formatted = scaled.toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1');

    return { value: formatted, suffix: suffixes[tier] };
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

    // Click particles for animation
    const [particles, setParticles] = useState([]);
    const particleIdRef = useRef(0);

    // Calculate CpS (Cakes Per Second)
    const cps = productionTiers.reduce((total, tier) => {
        const owned = generators[tier.id] || 0;
        return total + (tier.baseCps * owned);
    }, 0) * cpsMultiplier * globalMultiplier;

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
        const earned = clickPower * globalMultiplier;

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
    }, [clickPower, globalMultiplier]);

    // Purchase a generator (single or bulk)
    const purchaseGenerator = useCallback((tierId, quantity = 1) => {
        const tier = productionTiers.find(t => t.id === tierId);
        if (!tier) return false;

        const owned = generators[tierId] || 0;
        let totalCost = 0;
        let currentOwned = owned;

        // Calculate total cost iteratively to match exact single-buy pricing (with flooring)
        for (let i = 0; i < quantity; i++) {
            totalCost += calculatePrice(tier.baseCost, currentOwned + i);
        }

        if (balance < totalCost) return false;

        setBalance(prev => prev - totalCost);
        setGenerators(prev => ({
            ...prev,
            [tierId]: (prev[tierId] || 0) + quantity,
        }));

        return true;
    }, [balance, generators]);

    // Check if can afford generator
    const canAfford = useCallback((tierId) => {
        const tier = productionTiers.find(t => t.id === tierId);
        if (!tier) return false;

        const owned = generators[tierId] || 0;
        const price = calculatePrice(tier.baseCost, owned);
        return balance >= price;
    }, [balance, generators]);

    // Get generator info
    const getGeneratorInfo = useCallback((tierId) => {
        const tier = productionTiers.find(t => t.id === tierId);
        if (!tier) return null;

        const owned = generators[tierId] || 0;
        return {
            ...tier,
            owned,
            currentPrice: calculatePrice(tier.baseCost, owned),
            contribution: tier.baseCps * owned * cpsMultiplier * globalMultiplier,
        };
    }, [generators, cpsMultiplier, globalMultiplier]);

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
        canAfford,
        getGeneratorInfo,

        // Upgrade setters (for upgrade system to use)
        setClickPower,
        setCpsMultiplier,
        setGlobalMultiplier,
    };
}

export default useCakeLogic;

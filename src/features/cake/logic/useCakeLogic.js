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
 * Main cake logic hook
 * Manages: balance, CpS, click events, generators
 */
export function useCakeLogic() {
    // Core state
    const [balance, setBalance] = useState(0);
    const [totalBaked, setTotalBaked] = useState(0);
    const [clickPower, setClickPower] = useState(BASE_CLICK_POWER);
    const [cpsMultiplier, setCpsMultiplier] = useState(1);
    const [globalMultiplier, setGlobalMultiplier] = useState(1);

    // Generator ownership: { [tierId]: count }
    const [generators, setGenerators] = useState(() => {
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
        }, tickInterval);

        return () => clearInterval(interval);
    }, [cps]);

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

    // Purchase a generator
    const purchaseGenerator = useCallback((tierId) => {
        const tier = productionTiers.find(t => t.id === tierId);
        if (!tier) return false;

        const owned = generators[tierId] || 0;
        const price = calculatePrice(tier.baseCost, owned);

        if (balance < price) return false;

        setBalance(prev => prev - price);
        setGenerators(prev => ({
            ...prev,
            [tierId]: (prev[tierId] || 0) + 1,
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

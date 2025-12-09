
import { describe, it, expect } from 'vitest';
import balanceData from '@data/balance.json';

const COST_MULTIPLIER = 1.15;

function calculatePriceIoop(baseCost, owned, quantity) {
    let total = 0;
    for (let i = 0; i < quantity; i++) {
        total += Math.floor(baseCost * Math.pow(COST_MULTIPLIER, owned + i));
    }
    return total;
}

function calculatePriceFormula(baseCost, owned, quantity) {
    const r = COST_MULTIPLIER;
    // Formula: Sum = a * r^k * (1 - r^n) / (1 - r)
    // But we need to account for Math.floor() effectively being applied per term?
    // Actually, pure formula:
    const firstTerm = baseCost * Math.pow(r, owned);
    const sum = firstTerm * (1 - Math.pow(r, quantity)) / (1 - r);
    return Math.floor(sum);
}

describe('Formula Benchmark', () => {
    it('compares loop vs formula for small N', () => {
        const base = 10;
        const owned = 0;
        const qty = 67;

        const loop = calculatePriceIoop(base, owned, qty);
        const formula = calculatePriceFormula(base, owned, qty);

        console.log(`Qty ${qty}: Loop=${loop}, Formula=${formula}, Diff=${loop - formula}`);

        // We expect some drift, but hopefully small percentage
        const diffPercent = Math.abs(loop - formula) / loop;
        expect(diffPercent).toBeLessThan(0.05); // Allow 5% drift?
    });

    it('handles large N without crashing', () => {
        const base = 10;
        const owned = 100;
        const qty = 6767;
        const formula = calculatePriceFormula(base, owned, qty);
        console.log(`Qty ${qty}: Formula=${formula}`);
        expect(formula).toBeGreaterThan(0);
        // Note: Might be Infinity
    });
});

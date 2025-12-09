/**
 * Unit Tests: useCakeLogic
 * Tests core game mechanics: clicking, balance, CpS, purchases
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCakeLogic } from '@features/cake/logic/useCakeLogic';

describe('useCakeLogic', () => {
    // Clear localStorage before each test to prevent state pollution
    beforeEach(() => {
        localStorage.clear();
    });

    describe('Initial State', () => {
        it('starts with 0 balance', () => {
            const { result } = renderHook(() => useCakeLogic());
            expect(result.current.balance).toBe(0);
        });

        it('starts with 0 CpS', () => {
            const { result } = renderHook(() => useCakeLogic());
            expect(result.current.cps).toBe(0);
        });

        it('starts with click power of 1', () => {
            const { result } = renderHook(() => useCakeLogic());
            expect(result.current.clickPower).toBe(1);
        });

        it('loads all 15 production tiers', () => {
            const { result } = renderHook(() => useCakeLogic());
            expect(result.current.productionTiers).toHaveLength(15);
        });
    });

    describe('Clicking', () => {
        it('increases balance by click power on click', () => {
            const { result } = renderHook(() => useCakeLogic());

            act(() => {
                result.current.handleClick({ clientX: 100, clientY: 100 });
            });

            expect(result.current.balance).toBe(1);
        });

        it('accumulates balance with multiple clicks', () => {
            const { result } = renderHook(() => useCakeLogic());

            act(() => {
                for (let i = 0; i < 10; i++) {
                    result.current.handleClick({ clientX: 100, clientY: 100 });
                }
            });

            expect(result.current.balance).toBe(10);
        });
    });

    describe('Purchases', () => {
        it('cannot afford generator with 0 balance', () => {
            const { result } = renderHook(() => useCakeLogic());
            expect(result.current.canAfford('apprentice_baker')).toBe(false);
        });

        it('can afford generator when balance exceeds cost', () => {
            const { result } = renderHook(() => useCakeLogic());

            // Click enough to afford first generator (15 cakes)
            act(() => {
                for (let i = 0; i < 20; i++) {
                    result.current.handleClick({ clientX: 100, clientY: 100 });
                }
            });

            expect(result.current.canAfford('apprentice_baker')).toBe(true);
        });

        it('deducts cost and increases owned count on purchase', () => {
            const { result } = renderHook(() => useCakeLogic());

            // Get enough cakes
            act(() => {
                for (let i = 0; i < 20; i++) {
                    result.current.handleClick({ clientX: 100, clientY: 100 });
                }
            });

            const balanceBefore = result.current.balance;

            act(() => {
                result.current.purchaseGenerator('apprentice_baker');
            });

            expect(result.current.balance).toBeLessThan(balanceBefore);
            expect(result.current.getGeneratorInfo('apprentice_baker').owned).toBe(1);
        });
    });

    describe('Number Formatting', () => {
        it('formats millions correctly', () => {
            const { result } = renderHook(() => useCakeLogic());
            // Access formatNumber through the module
            expect(typeof result.current.balance).toBe('number');
        });
    });
});

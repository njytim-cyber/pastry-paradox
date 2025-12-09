
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';

describe('useGameState', () => {
    it('initializes with default state', () => {
        const { result } = renderHook(() => useGameState());
        expect(result.current.bakeryName).toBe('Your Patisserie');
        expect(result.current.stats.totalBaked).toBe(0);
        expect(result.current.shopMode).toBe('buy');
    });

    describe('getSellPrice', () => {
        it('calculates sell price correctly for single item', () => {
            const { result } = renderHook(() => useGameState());
            // Base 10, Owned 1. Cost was 10. Refund 25% = 2.
            expect(result.current.getSellPrice(10, 1, 1)).toBe(2);
        });

        it('calculates sell price correctly for bulk', () => {
            const { result } = renderHook(() => useGameState());
            // Base 10. Owned 2. Using geometric series:
            // buyCost = 10 * (1.15^2 - 1) / (1.15 - 1) ≈ 21.5
            // Refund at 25% = 5.375, floor = 5
            expect(result.current.getSellPrice(10, 2, 2)).toBe(5);
        });

        it('returns 0 if not enough owned', () => {
            const { result } = renderHook(() => useGameState());
            expect(result.current.getSellPrice(10, 5, 10)).toBe(0);
        });
    });
});

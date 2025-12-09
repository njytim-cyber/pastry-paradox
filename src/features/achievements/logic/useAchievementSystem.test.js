
import { renderHook, act } from '@testing-library/react';
import { useAchievementSystem } from './useAchievementSystem';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useAchievementSystem', () => {
    beforeEach(() => {
        // Clear local storage
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('generates achievements correctly', () => {
        const { result } = renderHook(() => useAchievementSystem({}));
        expect(result.current.allAchievements.length).toBeGreaterThan(100);

        // Check finding a specific achievement
        const firstBuildingAch = result.current.allAchievements.find(a => a.type === 'building');
        expect(firstBuildingAch).toBeDefined();
        expect(firstBuildingAch.targetValue).toBe(1);
    });

    it('unlocks total baked achievements', () => {
        const { result, rerender } = renderHook(({ totalBaked }) => useAchievementSystem({ totalBaked }), {
            initialProps: { totalBaked: 0 }
        });

        expect(result.current.unlockedIds).toHaveLength(0);

        // Update props to trigger unlock (1000 baked)
        rerender({ totalBaked: 1001 });

        act(() => {
            vi.runAllTimers(); // Effects might run
        });

        const unlocked = result.current.allAchievements.find(a => a.targetValue === 1000 && a.type === 'totalBaked');
        expect(result.current.unlockedIds).toContain(unlocked.id);
        expect(result.current.newUnlockQueue).toHaveLength(1);
    });

    it('unlocks building achievements', () => {
        const initialGenerators = [{ id: 'apprentice_baker', owned: 0 }];
        const { result, rerender } = renderHook(({ generators }) => useAchievementSystem({ generators }), {
            initialProps: { generators: initialGenerators }
        });

        expect(result.current.unlockedIds).toHaveLength(0);

        // Buy 10 bakers
        const updatedGenerators = [{ id: 'apprentice_baker', owned: 10 }];
        rerender({ generators: updatedGenerators });

        act(() => {
            vi.runAllTimers();
        });

        // Should unlock Tier I (1) and Tier II (10)
        expect(result.current.unlockedIds.length).toBeGreaterThanOrEqual(2);
    });
});

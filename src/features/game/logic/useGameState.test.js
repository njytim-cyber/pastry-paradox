
import { describe, it, expect, vi } from 'vitest'; // beforeEach
import { renderHook, act } from '@testing-library/react'; // act
import { useGameState } from './useGameState';

// Mock balance data for predictability
vi.mock('@data/balance.json', () => ({
    default: {
        globalConfig: { costMultiplier: 1.15, sellRefundRate: 0.25 },
        prestige: { requiredBaked: 1000, cpsBonusPerPoint: 0.1 },
        darkMatterUpgrades: {
            "root_upgrade": {
                id: "root_upgrade",
                cost: 10,
                parent: null
            },
            "child_upgrade": {
                id: "child_upgrade",
                cost: 20,
                parent: "root_upgrade"
            }
        }
    }
}));

describe('useGameState', () => {
    // beforeEach(() => {
    //     // Setup
    // });
    it('initializes with default state', () => {
        const { result } = renderHook(() => useGameState());
        expect(result.current.bakeryName).toBe('Your Patisserie');
        expect(result.current.stats.totalBaked).toBe(0);
        expect(result.current.bakeryName).toBe('Your Patisserie');
        expect(result.current.stats.totalBaked).toBe(0);
        expect(result.current.darkMatter).toBe(0);
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

    describe('buyDarkUpgrade', () => {
        it('can buy affordable root upgrade', async () => {
            const { result } = renderHook(() => useGameState());

            // Give enough dark matter
            act(() => {
                result.current.setDarkMatter(100);
            });

            // Buy root upgrade (cost 10)
            let success;
            act(() => {
                success = result.current.buyDarkUpgrade('root_upgrade');
            });

            expect(success).toBe(true);
            expect(result.current.darkMatter).toBe(90);
            expect(result.current.darkUpgrades).toContain('root_upgrade');
        });

        it('cannot buy upgrade if too expensive', () => {
            const { result } = renderHook(() => useGameState());

            act(() => {
                result.current.setDarkMatter(5); // Cost is 10
            });

            let success;
            act(() => {
                success = result.current.buyDarkUpgrade('root_upgrade');
            });

            expect(success).toBe(false);
            expect(result.current.darkUpgrades).not.toContain('root_upgrade');
        });

        it('cannot buy child upgrade if parent not owned', () => {
            const { result } = renderHook(() => useGameState());

            act(() => {
                result.current.setDarkMatter(100);
            });

            let success;
            act(() => {
                success = result.current.buyDarkUpgrade('child_upgrade');
            });

            expect(success).toBe(false);
            expect(result.current.darkUpgrades).not.toContain('child_upgrade');
        });

        it('can buy child upgrade if parent owned', () => {
            const { result } = renderHook(() => useGameState());

            act(() => {
                result.current.setDarkMatter(100);
                // Manually add parent to upgrades for setup
                result.current.setDarkUpgrades(['root_upgrade']);
            });

            let success;
            act(() => {
                success = result.current.buyDarkUpgrade('child_upgrade');
            });

            expect(success).toBe(true);
            expect(result.current.darkMatter).toBe(80); // 100 - 20
            expect(result.current.darkUpgrades).toContain('child_upgrade');
        });
    });
});

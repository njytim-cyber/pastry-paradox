
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCakeLogic } from './useCakeLogic';

// Mock balance data
vi.mock('@data/balance.json', () => ({
    default: {
        globalConfig: {
            fps: 60,
            costMultiplier: 1.15,
        },
        productionTiers: [
            { id: 'tier1', baseCost: 10, baseCps: 1 }
        ],
        entities: {
            player: { baseClickPower: 1 }
        }
    }
}));

describe('useCakeLogic Bulk Buy Bug', () => {
    it('should prevents buying more than affordable using atomic purchase', async () => {
        const { result } = renderHook(() => useCakeLogic());

        // Give some balance (enough for 1, but not 10)
        act(() => {
            // Cost is 10. Let's give 15 balance.
            for (let i = 0; i < 15; i++) {
                result.current.handleClick({});
            }
        });

        expect(result.current.balance).toBe(15);

        // Try buying 10 items (Atomic)
        act(() => {
            const quantity = 10;
            const tierId = 'tier1';
            result.current.purchaseGenerator(tierId, quantity);
        });

        // Should NOT have bought anything because 15 < Cost of 10
        expect(result.current.balance).toBe(15);
        expect(result.current.balance).toBeGreaterThanOrEqual(0);

        // Verify we can buy when affordable
        act(() => {
            // Give lots of money
            for (let i = 0; i < 200; i++) {
                result.current.handleClick({});
            }
        });

        // Now buy 10
        act(() => {
            // We have ~215 balance. Cost for 10 is ~200-ish? 
            // 10 + 11.5 + ... Geometric sum.
            // S = 10 * (1.15^10 - 1) / (1.15 - 1) ~= 10 * (4.04 - 1) / 0.15 ~= 200.
            // Should be enough.
            result.current.purchaseGenerator('tier1', 10);
        });

        // Should succeed
        expect(result.current.generators['tier1']).toBe(10);
        expect(result.current.balance).toBeGreaterThanOrEqual(0);
    });
});

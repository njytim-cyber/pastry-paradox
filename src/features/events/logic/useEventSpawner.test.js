/**
 * Test: Golden Macaron Event System
 * Verifies spawning and unlocking logic
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEventSpawner } from './useEventSpawner';

describe('Golden Macaron Spawning', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Mock window dimensions for random positioning
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 768,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should not spawn macaron before unlock', () => {
        const onEventClick = vi.fn();
        const { result } = renderHook(() => useEventSpawner({ onEventClick }));

        expect(result.current.isEventActive).toBe(false);
        expect(result.current.isEventUnlocked).toBe(false);
    });

    it('should unlock when upgrade is purchased', () => {
        const onEventClick = vi.fn();
        const { result } = renderHook(() => useEventSpawner({ onEventClick }));

        // Simulate unlock event from upgrade
        act(() => {
            window.dispatchEvent(new CustomEvent('unlockEvent', {
                detail: { eventId: 'goldenCroissant' }
            }));
        });

        expect(result.current.isEventUnlocked).toBe(true);
    });

    it('should spawn macaron after unlock', async () => {
        const onEventClick = vi.fn();
        const { result } = renderHook(() => useEventSpawner({ onEventClick }));

        // Unlock the event
        act(() => {
            result.current.unlockEvent();
        });

        expect(result.current.isEventUnlocked).toBe(true);

        // Fast-forward time to trigger spawn (max interval is 300s)
        act(() => {
            vi.advanceTimersByTime(301 * 1000);
        });

        // Macaron should be spawned
        expect(result.current.isEventActive).toBe(true);
        expect(result.current.activeEvent).toBeDefined();
        expect(result.current.eventPosition).toBeDefined();
    });

    it('should handle macaron click', () => {
        const onEventClick = vi.fn();
        const { result } = renderHook(() => useEventSpawner({ onEventClick }));

        // Unlock and spawn
        act(() => {
            result.current.unlockEvent();
        });

        act(() => {
            vi.advanceTimersByTime(301 * 1000);
        });

        const macaron = result.current.activeEvent;
        expect(macaron).toBeDefined();

        // Click the macaron
        act(() => {
            result.current.clickEvent();
        });

        // Should trigger callback with macaron data
        expect(onEventClick).toHaveBeenCalledWith(macaron);

        // Event should be deactivated
        expect(result.current.isEventActive).toBe(false);
    });
});

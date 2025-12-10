
import { render, act } from '@testing-library/react';
import App from './App';
import React from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Crash Reproduction', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Mock localStorage
        Storage.prototype.getItem = vi.fn(() => null);
        Storage.prototype.setItem = vi.fn();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('renders and survives for 10 seconds of game time', async () => {
        render(<App />);

        console.log('Mount successful, advancing time...');

        // Advance time in 1-second increments to find the crash point
        for (let i = 1; i <= 10; i++) {
            await act(async () => {
                vi.advanceTimersByTime(1000);
            });
            console.log(`Time: ${i}s - still alive`);
        }
    });

    it('does not save excessively', async () => {
        const { unmount } = render(<App />);

        console.log('Mount successful, advancing timers...');

        // Advance 1 second (approx 60 ticks)
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        // Effect cleanup runs on every render/tick if dependencies change.
        // If the bug exists, we expect ~60 saves (one per tick).
        // If fixed, we expect 0 saves (interval is 10s).
        const saveCount = localStorage.setItem.mock.calls.length;
        console.log(`Saved ${saveCount} times in 1 second`);

        expect(saveCount).toBeLessThan(10); // Allow for legitimate hook saves (audio, nav, version, achievements)

        unmount();
    });
});

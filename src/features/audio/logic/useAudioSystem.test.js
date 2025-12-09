/**
 * useAudioSystem.test.js
 * Unit tests for audio system logic
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAudioSystem } from './useAudioSystem';

const STORAGE_KEY = 'pastry_paradox_audio_muted';

describe('useAudioSystem', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('initializes with default layer 1 and unmuted', () => {
        const { result } = renderHook(() => useAudioSystem(0));
        expect(result.current.activeLayer).toBe(1);
        expect(result.current.muted).toBe(false);
    });

    it('switches to layer 2 when threshold crossed', () => {
        const { result, rerender } = renderHook(({ cps }) => useAudioSystem(cps), {
            initialProps: { cps: 0 }
        });

        expect(result.current.activeLayer).toBe(1);

        // Update CpS to 200 (Layer 2 threshold is 100)
        rerender({ cps: 200 });
        expect(result.current.activeLayer).toBe(2);
    });

    it('switches to layer 3 when threshold crossed', () => {
        const { result, rerender } = renderHook(({ cps }) => useAudioSystem(cps), {
            initialProps: { cps: 200 }
        });

        // Update CpS to 2,000,000 (Layer 3 threshold is 1M)
        rerender({ cps: 2000000 });
        expect(result.current.activeLayer).toBe(3);
    });

    it('toggles mute state', () => {
        const { result } = renderHook(() => useAudioSystem(0));

        act(() => {
            result.current.toggleMute();
        });
        expect(result.current.muted).toBe(true);

        act(() => {
            result.current.toggleMute();
        });
        expect(result.current.muted).toBe(false);
    });

    it('persists mute state to localStorage', () => {
        const { result } = renderHook(() => useAudioSystem(0));

        act(() => {
            result.current.toggleMute();
        });

        expect(window.localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, true);
    });

    it('hydrates mute state from localStorage', () => {
        window.localStorage.getItem.mockReturnValue('true');
        const { result } = renderHook(() => useAudioSystem(0));
        expect(result.current.muted).toBe(true);
    });
});

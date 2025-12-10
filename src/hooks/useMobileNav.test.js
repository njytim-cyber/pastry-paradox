
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, /*afterEach,*/ vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMobileNav } from './useMobileNav';

describe('useMobileNav', () => {
    let localStorageData = {};

    beforeEach(() => {
        // Reset localStorage mock
        localStorageData = {};
        global.localStorage = {
            getItem: (key) => localStorageData[key] || null,
            setItem: (key, value) => { localStorageData[key] = value; },
            removeItem: (key) => { delete localStorageData[key]; },
            clear: () => { localStorageData = {}; },
        };
    });

    it('should initialize with default tab', () => {
        const { result } = renderHook(() => useMobileNav());
        expect(result.current.activeTab).toBe('bakery');
    });

    it('should initialize with custom initial tab', () => {
        const { result } = renderHook(() => useMobileNav({ initialTab: 'store' }));
        expect(result.current.activeTab).toBe('store');
    });

    it('should change active tab', () => {
        const { result } = renderHook(() => useMobileNav());

        act(() => {
            result.current.setActiveTab('stats');
        });

        expect(result.current.activeTab).toBe('stats');
    });

    it('should warn on invalid tab', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const { result } = renderHook(() => useMobileNav());

        act(() => {
            result.current.setActiveTab('invalid');
        });

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Invalid tab: invalid')
        );
        expect(result.current.activeTab).toBe('bakery'); // unchanged

        consoleSpy.mockRestore();
    });

    it('should persist tab to localStorage when enabled', () => {
        const { result } = renderHook(() => useMobileNav({ persist: true }));

        act(() => {
            result.current.setActiveTab('store');
        });

        expect(localStorage.getItem('pastry-paradox-active-tab')).toBe('store');
    });

    it('should not persist tab when disabled', () => {
        const { result } = renderHook(() => useMobileNav({ persist: false }));

        act(() => {
            result.current.setActiveTab('store');
        });

        expect(localStorage.getItem('pastry-paradox-active-tab')).toBeNull();
    });

    it('should load persisted tab on initialization', () => {
        localStorage.setItem('pastry-paradox-active-tab', 'stats');

        const { result } = renderHook(() => useMobileNav());
        expect(result.current.activeTab).toBe('stats');
    });

    it('should set isTransitioning during tab change', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useMobileNav());

        expect(result.current.isTransitioning).toBe(false);

        act(() => {
            result.current.setActiveTab('stats');
        });

        expect(result.current.isTransitioning).toBe(true);

        // Fast-forward past transition duration
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(result.current.isTransitioning).toBe(false);

        vi.useRealTimers();
    });

    it('should return all available tabs', () => {
        const { result } = renderHook(() => useMobileNav());
        expect(result.current.tabs).toEqual(['bakery', 'stats', 'store']);
    });

    describe('Swipe gestures', () => {
        it('should provide swipe handlers when enabled', () => {
            const { result } = renderHook(() => useMobileNav({ enableSwipe: true }));

            expect(result.current.swipeHandlers).toHaveProperty('onTouchStart');
            expect(result.current.swipeHandlers).toHaveProperty('onTouchMove');
            expect(result.current.swipeHandlers).toHaveProperty('onTouchEnd');
        });

        it('should not provide swipe handlers when disabled', () => {
            const { result } = renderHook(() => useMobileNav({ enableSwipe: false }));

            expect(result.current.swipeHandlers).toEqual({});
        });

        it('should navigate to next tab on left swipe', () => {
            const { result } = renderHook(() => useMobileNav({ initialTab: 'bakery' }));

            // Simulate left swipe (bakery -> stats)
            act(() => {
                result.current.swipeHandlers.onTouchStart({
                    touches: [{ clientX: 200 }]
                });
                result.current.swipeHandlers.onTouchMove({
                    touches: [{ clientX: 100 }]
                });
                result.current.swipeHandlers.onTouchEnd();
            });

            expect(result.current.activeTab).toBe('stats');
        });

        it('should navigate to previous tab on right swipe', () => {
            const { result } = renderHook(() => useMobileNav({ initialTab: 'stats' }));

            // Simulate right swipe (stats -> bakery)
            act(() => {
                result.current.swipeHandlers.onTouchStart({
                    touches: [{ clientX: 100 }]
                });
                result.current.swipeHandlers.onTouchMove({
                    touches: [{ clientX: 200 }]
                });
                result.current.swipeHandlers.onTouchEnd();
            });

            expect(result.current.activeTab).toBe('bakery');
        });

        it('should not navigate if swipe distance is too small', () => {
            const { result } = renderHook(() => useMobileNav({ initialTab: 'bakery' }));

            // Simulate small swipe (< 50px)
            act(() => {
                result.current.swipeHandlers.onTouchStart({
                    touches: [{ clientX: 150 }]
                });
                result.current.swipeHandlers.onTouchMove({
                    touches: [{ clientX: 130 }]
                });
                result.current.swipeHandlers.onTouchEnd();
            });

            expect(result.current.activeTab).toBe('bakery'); // unchanged
        });

        it('should clamp navigation at first tab', () => {
            const { result } = renderHook(() => useMobileNav({ initialTab: 'bakery' }));

            // Try to swipe right when already at first tab
            act(() => {
                result.current.swipeHandlers.onTouchStart({
                    touches: [{ clientX: 100 }]
                });
                result.current.swipeHandlers.onTouchMove({
                    touches: [{ clientX: 200 }]
                });
                result.current.swipeHandlers.onTouchEnd();
            });

            expect(result.current.activeTab).toBe('bakery'); // stays at first
        });

        it('should clamp navigation at last tab', () => {
            const { result } = renderHook(() => useMobileNav({ initialTab: 'store' }));

            // Try to swipe left when already at last tab
            act(() => {
                result.current.swipeHandlers.onTouchStart({
                    touches: [{ clientX: 200 }]
                });
                result.current.swipeHandlers.onTouchMove({
                    touches: [{ clientX: 100 }]
                });
                result.current.swipeHandlers.onTouchEnd();
            });

            expect(result.current.activeTab).toBe('store'); // stays at last
        });
    });
});

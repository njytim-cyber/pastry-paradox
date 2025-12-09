/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
    useMediaQuery,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    useIsPortrait,
    useIsLandscape
} from './useMediaQuery';

describe('useMediaQuery', () => {
    let matchMediaMock;

    beforeEach(() => {
        // Mock window.matchMedia
        matchMediaMock = vi.fn();
        window.matchMedia = matchMediaMock;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return false initially when media does not match', () => {
        matchMediaMock.mockReturnValue({
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
        expect(result.current).toBe(false);
    });

    it('should return true initially when media matches', () => {
        matchMediaMock.mockReturnValue({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
        expect(result.current).toBe(true);
    });

    it('should update when media query changes', () => {
        let listener;
        const addEventListener = vi.fn((event, callback) => {
            listener = callback;
        });

        matchMediaMock.mockReturnValue({
            matches: false,
            addEventListener,
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
        expect(result.current).toBe(false);

        // Simulate media query change
        act(() => {
            listener({ matches: true });
        });
        expect(result.current).toBe(true);
    });

    it('should clean up event listener on unmount', () => {
        const removeEventListener = vi.fn();
        matchMediaMock.mockReturnValue({
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener,
        });

        const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));
        unmount();

        expect(removeEventListener).toHaveBeenCalled();
    });

    it('should handle legacy browsers without addEventListener', () => {
        let listener;
        const addListener = vi.fn((callback) => {
            listener = callback;
        });
        const removeListener = vi.fn();

        matchMediaMock.mockReturnValue({
            matches: false,
            addListener,
            removeListener,
        });

        const { result, unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));
        expect(result.current).toBe(false);

        // Simulate change
        act(() => {
            listener({ matches: true });
        });
        expect(result.current).toBe(true);

        unmount();
        expect(removeListener).toHaveBeenCalled();
    });
});

describe('Preset breakpoint hooks', () => {
    beforeEach(() => {
        window.matchMedia = vi.fn();
    });

    it('useIsMobile should detect mobile viewport', () => {
        window.matchMedia.mockReturnValue({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
        expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)');
    });

    it('useIsTablet should detect tablet viewport', () => {
        window.matchMedia.mockReturnValue({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => useIsTablet());
        expect(result.current).toBe(true);
        expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 769px) and (max-width: 1024px)');
    });

    it('useIsDesktop should detect desktop viewport', () => {
        window.matchMedia.mockReturnValue({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => useIsDesktop());
        expect(result.current).toBe(true);
        expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1025px)');
    });

    it('useIsPortrait should detect portrait orientation', () => {
        window.matchMedia.mockReturnValue({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => useIsPortrait());
        expect(result.current).toBe(true);
        expect(window.matchMedia).toHaveBeenCalledWith('(orientation: portrait)');
    });

    it('useIsLandscape should detect landscape orientation', () => {
        window.matchMedia.mockReturnValue({
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => useIsLandscape());
        expect(result.current).toBe(false);
        expect(window.matchMedia).toHaveBeenCalledWith('(orientation: landscape)');
    });
});

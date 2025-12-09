/**
 * useMobileNav - Hook for mobile navigation state and swipe gestures
 * 
 * Manages tab state, swipe gesture detection, and localStorage persistence
 * for the mobile tabbed navigation interface.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

const TABS = ['bakery', 'stats', 'store'];
const STORAGE_KEY = 'pastry-paradox-active-tab';
const MIN_SWIPE_DISTANCE = 50; // Minimum px for swipe to register

/**
 * @typedef {'bakery'|'stats'|'store'} TabId
 * 
 * @typedef {Object} MobileNavState
 * @property {TabId} activeTab - Currently active tab
 * @property {(tab: TabId) => void} setActiveTab - Change active tab
 * @property {Object} swipeHandlers - Touch event handlers for swipe detection
 * @property {boolean} isTransitioning - Whether tab transition is in progress
 */

/**
 * Mobile navigation hook with swipe support
 * 
 * @param {Object} options
 * @param {TabId} [options.initialTab='bakery'] - Initial active tab
 * @param {boolean} [options.enableSwipe=true] - Enable swipe gestures
 * @param {boolean} [options.persist=true] - Persist tab to localStorage
 * @returns {MobileNavState}
 */
export function useMobileNav({
    initialTab = 'bakery',
    enableSwipe = true,
    persist = true
} = {}) {
    // Load persisted tab or use initial
    const [activeTab, setActiveTabState] = useState(() => {
        if (persist && typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored && TABS.includes(stored)) {
                return stored;
            }
        }
        return initialTab;
    });

    const [isTransitioning, setIsTransitioning] = useState(false);

    // Touch tracking for swipe detection
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Persist tab changes to localStorage
    useEffect(() => {
        if (persist && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, activeTab);
        }
    }, [activeTab, persist]);

    // Set active tab with transition state
    const setActiveTab = useCallback((tab) => {
        if (!TABS.includes(tab)) {
            console.warn(`Invalid tab: ${tab}. Must be one of: ${TABS.join(', ')}`);
            return;
        }

        setIsTransitioning(true);
        setActiveTabState(tab);

        // Reset transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 300); // Matches CSS transition duration
    }, []);

    // Navigate to next/previous tab
    const navigateTab = useCallback((direction) => {
        const currentIndex = TABS.indexOf(activeTab);
        let nextIndex;

        if (direction === 'next') {
            nextIndex = currentIndex + 1;
            if (nextIndex >= TABS.length) nextIndex = TABS.length - 1; // Clamp to last
        } else {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) nextIndex = 0; // Clamp to first
        }

        if (nextIndex !== currentIndex) {
            setActiveTab(TABS[nextIndex]);
        }
    }, [activeTab, setActiveTab]);

    // Touch event handlers for swipe detection
    const handleTouchStart = useCallback((e) => {
        if (!enableSwipe) return;
        touchStartX.current = e.touches[0].clientX;
    }, [enableSwipe]);

    const handleTouchMove = useCallback((e) => {
        if (!enableSwipe) return;
        touchEndX.current = e.touches[0].clientX;
    }, [enableSwipe]);

    const handleTouchEnd = useCallback(() => {
        if (!enableSwipe) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
        const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

        if (isLeftSwipe) {
            navigateTab('next');
        } else if (isRightSwipe) {
            navigateTab('prev');
        }

        // Reset
        touchStartX.current = 0;
        touchEndX.current = 0;
    }, [enableSwipe, navigateTab]);

    const swipeHandlers = {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
    };

    return {
        activeTab,
        setActiveTab,
        swipeHandlers: enableSwipe ? swipeHandlers : {},
        isTransitioning,
        tabs: TABS,
    };
}

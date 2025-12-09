/**
 * useEventSpawner - Golden Croissant random event system
 * Container Component (NO UI)
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import balanceData from '@data/balance.json';

const { events } = balanceData;
const goldenCroissant = events?.goldenCroissant;

/**
 * Main event spawner hook
 */
export function useEventSpawner({ setGlobalMultiplier }) {
    const [isEventActive, setIsEventActive] = useState(false);
    const [eventPosition, setEventPosition] = useState({ x: 0, y: 0 });
    const [isEventUnlocked, setIsEventUnlocked] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);

    const spawnTimeoutRef = useRef(null);
    const durationTimeoutRef = useRef(null);
    const countdownRef = useRef(null);

    // Listen for unlock event (from upgrade system)
    useEffect(() => {
        const handleUnlock = (e) => {
            if (e.detail?.eventId === 'goldenCroissant') {
                setIsEventUnlocked(true);
            }
        };

        window.addEventListener('unlockEvent', handleUnlock);
        return () => window.removeEventListener('unlockEvent', handleUnlock);
    }, []);

    // Spawn event at random intervals
    useEffect(() => {
        if (!isEventUnlocked || !goldenCroissant) return;
        if (isEventActive) return;

        const scheduleSpawn = () => {
            const { spawnIntervalMin, spawnIntervalMax } = goldenCroissant;
            const delay = (Math.random() * (spawnIntervalMax - spawnIntervalMin) + spawnIntervalMin) * 1000;

            spawnTimeoutRef.current = setTimeout(() => {
                // Random position on screen
                const x = Math.random() * (window.innerWidth - 100) + 50;
                const y = Math.random() * (window.innerHeight - 200) + 100;

                setEventPosition({ x, y });
                setIsEventActive(true);
                setTimeRemaining(goldenCroissant.duration);

                // Auto-expire after duration
                durationTimeoutRef.current = setTimeout(() => {
                    setIsEventActive(false);
                }, goldenCroissant.duration * 1000);

                // Countdown timer
                countdownRef.current = setInterval(() => {
                    setTimeRemaining(prev => Math.max(0, prev - 1));
                }, 1000);
            }, delay);
        };

        scheduleSpawn();

        return () => {
            if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
            if (durationTimeoutRef.current) clearTimeout(durationTimeoutRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [isEventUnlocked, isEventActive]);

    // Handle clicking the golden croissant
    const clickEvent = useCallback(() => {
        if (!isEventActive || !goldenCroissant) return;

        // Clear timers
        if (durationTimeoutRef.current) clearTimeout(durationTimeoutRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);

        setIsEventActive(false);

        // Apply multiplier
        const multiplier = goldenCroissant.multiplier;
        const duration = goldenCroissant.duration * 1000;

        setGlobalMultiplier(multiplier);
        setTimeRemaining(goldenCroissant.duration);

        // Start countdown for multiplier effect
        countdownRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current);
                    setGlobalMultiplier(1);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Reset multiplier after duration
        setTimeout(() => {
            setGlobalMultiplier(1);
            setTimeRemaining(0);
        }, duration);

        return multiplier;
    }, [isEventActive, setGlobalMultiplier]);

    return {
        isEventActive,
        isEventUnlocked,
        eventPosition,
        timeRemaining,
        multiplier: goldenCroissant?.multiplier || 1,
        clickEvent,

        // Dev/testing: manually unlock
        unlockEvent: () => setIsEventUnlocked(true),
    };
}

export default useEventSpawner;

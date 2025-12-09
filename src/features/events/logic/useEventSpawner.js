/**
 * useEventSpawner - Golden Macaron random event system
 * Container Component (NO UI)
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import balanceData from '@data/balance.json';
import { getRandomMacaron } from './macaronConstants';

const { events } = balanceData;
const goldenCroissant = events?.goldenCroissant; // Re-use timing config

/**
 * Main event spawner hook
 */
export function useEventSpawner({ onEventClick }) {
    const [isEventActive, setIsEventActive] = useState(false);
    const [eventPosition, setEventPosition] = useState({ x: 0, y: 0 });
    const [isEventUnlocked, setIsEventUnlocked] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [activeEvent, setActiveEvent] = useState(null);

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

                // Pick a random macaron
                setActiveEvent(getRandomMacaron());
                setEventPosition({ x, y });
                setIsEventActive(true);
                setTimeRemaining(goldenCroissant.duration);

                // Auto-expire after duration
                durationTimeoutRef.current = setTimeout(() => {
                    setIsEventActive(false);
                    setActiveEvent(null);
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

    // Handle clicking the golden macaron
    const clickEvent = useCallback(() => {
        if (!isEventActive || !activeEvent) return;

        // Clear timers
        if (durationTimeoutRef.current) clearTimeout(durationTimeoutRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);

        setIsEventActive(false);

        // Execute effect callback
        if (onEventClick) {
            onEventClick(activeEvent);
        }

        // Removed internal multiplier logic here to delegate to App.jsx
        // But we might need to handle Duration based buffs display? 
        // For now, let App handle actual game logic updates.

    }, [isEventActive, activeEvent, onEventClick]);

    return {
        isEventActive,
        isEventUnlocked,
        eventPosition,
        timeRemaining,
        activeEvent, // Return the full object for rendering
        clickEvent,

        // Dev/testing: manually unlock
        unlockEvent: () => setIsEventUnlocked(true),
    };
}


export default useEventSpawner;

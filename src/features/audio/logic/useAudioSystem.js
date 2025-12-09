/**
 * useAudioSystem.js
 * Logic container for the Adaptive Audio Engine.
 * Monitors Game State (CpS) and determines the active audio layer.
 */
import { useState, useEffect } from 'react';

// Thresholds for audio layers (CpS)
const THRESHOLDS = {
    LAYER_1: 0,       // Start: Piano
    LAYER_2: 100,     // Mid: Orchestral
    LAYER_3: 1000000, // End: Space Opera (1M)
};

const STORAGE_KEY = 'pastry_paradox_audio_muted';

export const useAudioSystem = (cakesPerSecond) => {
    const [muted, setMuted] = useState(() => {
        // Hydrate from storage
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEY) === 'true';
        }
        return false;
    });

    const [activeLayer, setActiveLayer] = useState(1);

    // Persist mute state
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, muted);
        }
    }, [muted]);

    // Determine active layer based on CpS
    useEffect(() => {
        let targetLayer = 1;

        if (cakesPerSecond >= THRESHOLDS.LAYER_3) {
            targetLayer = 3;
        } else if (cakesPerSecond >= THRESHOLDS.LAYER_2) {
            targetLayer = 2;
        }

        setActiveLayer(targetLayer);
    }, [cakesPerSecond]);

    const toggleMute = () => setMuted(prev => !prev);

    return {
        muted,
        activeLayer,
        toggleMute,
        THRESHOLDS
    };
};

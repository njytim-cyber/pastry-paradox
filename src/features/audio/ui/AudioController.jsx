/**
 * AudioController.jsx
 * View component for the Adaptive Audio Engine.
 * Renders hidden audio elements and handles cross-fading.
 */
import React, { useEffect, useRef } from 'react';
import { useAudioSystem } from '../logic/useAudioSystem';
import bgm1 from '../../../assets/audio/bgm_layer_01.mp3';
import bgm2 from '../../../assets/audio/bgm_layer_02.mp3';
import bgm3 from '../../../assets/audio/bgm_layer_03.mp3';
import './AudioController.css';

export const AudioController = ({ cakesPerSecond }) => {
    const { muted, activeLayer, toggleMute } = useAudioSystem(cakesPerSecond);

    // Audio refs
    const audioRefs = {
        1: useRef(null),
        2: useRef(null),
        3: useRef(null)
    };

    // Handle cross-fading and playback
    useEffect(() => {
        Object.entries(audioRefs).forEach(([layerId, ref]) => {
            const audio = ref.current;
            if (!audio) return;

            // Mute handling
            audio.muted = muted;

            // Target volume based on active layer
            // Logic: Active layer gets volume 1, others 0
            // Enhancement: Layer 2 implies Layer 1 + 2? Or distinct?
            // PRD: "Piano -> String Quartet -> Opera". Usually implies replacement or addition.
            // Let's go with Replacement for clear distinction, or Addition for richness.
            // "String quartet joining the piano" -> Addition.
            // "Operatic vocals ... space opera" -> Maybe replacement or full add.
            // Let's implement ADDITIVE layering for richness.

            const layer = parseInt(layerId);
            let targetVolume = 0;

            if (activeLayer >= layer) {
                targetVolume = 0.6; // Max volume 60% to not overpower SFX
            }

            // Simple volume fade effect
            const fadeInterval = setInterval(() => {
                const current = audio.volume;
                const delta = 0.05;

                if (Math.abs(current - targetVolume) < delta) {
                    audio.volume = targetVolume;
                    clearInterval(fadeInterval);

                    // Pause if volume is 0 to save performance
                    if (targetVolume === 0) {
                        audio.pause();
                    } else if (audio.paused) {
                        audio.play().catch(e => console.log("Audio play failed (interaction needed)", e));
                    }
                } else {
                    if (current < targetVolume) {
                        audio.volume = Math.min(1, current + delta);
                        // Ensure playing if fading in
                        if (audio.paused) audio.play().catch(() => { });
                    } else {
                        audio.volume = Math.max(0, current - delta);
                    }
                }
            }, 100); // 100ms * 20 steps = 2s approx fade

            return () => clearInterval(fadeInterval);
        });
    }, [activeLayer, muted]);

    // Initial play attempt (requires user interaction usually)
    useEffect(() => {
        const handleInteraction = () => {
            if (!muted) {
                Object.values(audioRefs).forEach(ref => {
                    if (ref.current && ref.current.volume > 0) {
                        ref.current.play().catch(() => { });
                    }
                });
            }
        };

        window.addEventListener('click', handleInteraction, { once: true });
        return () => window.removeEventListener('click', handleInteraction);
    }, [muted]);

    return (
        <div className="audio-controller">
            <button
                className={`mute-btn ${muted ? 'muted' : ''}`}
                onClick={toggleMute}
                aria-label={muted ? "Unmute Audio" : "Mute Audio"}
            >
                {muted ? '🔇' : '🔊'}
            </button>

            <audio ref={audioRefs[1]} src={bgm1} loop preload="auto" />
            <audio ref={audioRefs[2]} src={bgm2} loop preload="auto" />
            <audio ref={audioRefs[3]} src={bgm3} loop preload="auto" />
        </div>
    );
};

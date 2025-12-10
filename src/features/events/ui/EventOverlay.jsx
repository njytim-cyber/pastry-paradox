
import React, { useEffect, useRef } from 'react';
import { useEventStore } from '../logic/useEventStore';
import { DoomScrollBar } from './BrainRotComponents';

/**
 * GENERIC EVENT OVERLAY
 * Wraps the app to apply:
 * 1. Theme CSS variables (Fonts, Colors).
 * 2. Visual Filters (Brain Rot Saturation, Christmas Snow).
 * 3. Mechanics HUD (Doom Scroll Bar, Santa Tracker).
 * 4. Background Audio.
 */
export function EventOverlay({ children }) {
    const { isActive, config } = useEventStore();
    const audioRef = useRef(null);

    // Initialize Event System on Mount
    useEffect(() => {
        useEventStore.getState().initEvent();
    }, []);

    // Audio Management
    useEffect(() => {
        if (!isActive || !config?.audio?.bgMusic) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            return;
        }

        const bgMusic = config.audio.bgMusic;
        if (!audioRef.current) {
            audioRef.current = new Audio(bgMusic.src);
            audioRef.current.loop = bgMusic.loop !== false;
            audioRef.current.volume = bgMusic.volume || 0.5;
            // User interaction usually required, we'll try play
            audioRef.current.play().catch(e => console.log("Audio autoplay blocked:", e));
        }

    }, [isActive, config]);

    // Apply CSS variables to document root for global theming
    // Must be before early return to run when theme changes
    useEffect(() => {
        const root = document.documentElement;

        if (isActive && config?.theme?.cssVars) {
            console.log('🎨 Applying theme CSS vars:', config.theme.cssVars);
            Object.entries(config.theme.cssVars).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
            // Add event class for additional CSS hooks
            root.classList.add('event-active', `event-${config.eventId}`);
        }

        return () => {
            // Cleanup: remove CSS variables and classes
            if (config?.theme?.cssVars) {
                Object.keys(config.theme.cssVars).forEach(key => {
                    root.style.removeProperty(key);
                });
            }
            if (config?.eventId) {
                root.classList.remove('event-active', `event-${config.eventId}`);
            }
        };
    }, [isActive, config]);

    if (!isActive || !config) return <>{children}</>;

    const themeStyle = {
        '--event-font': config.theme?.fontFamily || 'inherit',
        '--event-primary': config.theme?.primaryColor || 'inherit',
        '--event-secondary': config.theme?.secondaryColor || 'inherit',
        '--event-highlight': config.theme?.highlightColor || '#ffff00',
    };

    return (
        <div
            id="event-system-wrapper"
            style={themeStyle}
            className="relative w-full h-full overflow-hidden"
        >
            {/* 1. Main Content with Filter */}
            <div
                className="w-full h-full transition-all duration-500"
                style={{ filter: config.theme?.bgFilter || 'none' }}
            >
                {children}
            </div>

            {/* 2. Visual Overlays (Noise, Snow, etc) */}
            {/* For Brain Rot: Noise Overlay */}
            {config.theme?.bgFilter && config.theme.bgFilter.includes('contrast') && (
                <div className="pointer-events-none fixed inset-0 z-[9999] opacity-10 mix-blend-overlay bg-[url('/assets/events/brain_rot/noise.png')] animate-pulse" />
            )}

            {/* 3. Mechanics HUD */}
            {/* DOOM SCROLL (Brain Rot) */}
            {config.mechanics?.doomScrollDecayRate && (
                <DoomScrollBar />
            )}
        </div>
    );
}

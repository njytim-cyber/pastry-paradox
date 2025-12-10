
import React from 'react';
import { useEventStore } from '../logic/useEventStore';

/**
 * DoomScrollBar
 * Mechanic: Fills up when user scrolls or clicks it. Decays over time.
 * Visual: Green -> Yellow -> Red -> Dead color shift.
 */
export const DoomScrollBar = () => {
    const { mechanicValue, updateMechanicValue, isActive, config } = useEventStore();

    const handleScroll = () => {
        // "Scroll" action adds to the meter
        updateMechanicValue(0.1); // Add 10% per tick
    };

    if (!isActive || !config) return null;

    // Dynamic Color Logic: Red (Low) -> Yellow -> Green (High)
    const getColor = (val) => {
        // HSL: 0 (Red) to 120 (Green)
        const hue = Math.floor(val * 120);
        return `hsl(${hue}, 100%, 50%)`;
    };

    return (
        <div
            className="fixed right-4 top-1/4 h-1/2 w-8 md:w-12 bg-gray-900 border-2 border-white rounded-lg overflow-hidden z-[10000] select-none shadow-[0_0_15px_rgba(255,0,255,0.7)]"
            onWheel={handleScroll}
            onTouchMove={handleScroll}
            onClick={handleScroll} // Mobile fallback
        >
            {/* The Fill Bar */}
            <div
                className="absolute bottom-0 w-full transition-all duration-100 ease-linear"
                style={{
                    height: `${mechanicValue * 100}%`,
                    backgroundColor: getColor(mechanicValue)
                }}
            />

            {/* Label Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-black -rotate-90 whitespace-nowrap drop-shadow-md">
                    {mechanicValue <= 0.01 ? "DEAD 💀" : "DOOM METER"}
                </span>
            </div>

            {/* Status Text (Optional popup) */}
            {mechanicValue <= 0.01 && (
                <div className="absolute top-0 w-full text-[0.6rem] text-white text-center bg-black/50">
                    SCROLL!
                </div>
            )}
        </div>
    );
};

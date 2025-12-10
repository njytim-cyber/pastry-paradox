
import React, { useState } from 'react';
import { useEventStore } from '../logic/useEventStore';

/**
 * DoomScrollBar
 * PURELY VISUAL - Fun interactive element for Brain Rot theme
 * No game effect - just cosmetic fun
 */
export const DoomScrollBar = () => {
    const { isActive, config } = useEventStore();
    const [meterValue, setMeterValue] = useState(0.5); // Local visual state only

    const handleScroll = () => {
        // Visual only - adds to the meter display
        setMeterValue(prev => Math.min(1, prev + 0.1));
    };

    // Decay the meter slowly (visual effect only)
    React.useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => {
            setMeterValue(prev => Math.max(0, prev - 0.02));
        }, 100);
        return () => clearInterval(interval);
    }, [isActive]);

    // Only show for Brain Rot theme
    if (!isActive || config?.eventId !== 'event_brain_rot_v1') return null;

    // Dynamic Color Logic: Red (Low) -> Yellow -> Green (High)
    const getColor = (val) => {
        const hue = Math.floor(val * 120);
        return `hsl(${hue}, 100%, 50%)`;
    };

    return (
        <div
            className="fixed right-4 top-1/4 h-1/2 w-8 md:w-12 bg-gray-900 border-2 border-white rounded-lg overflow-hidden z-[10000] select-none shadow-[0_0_15px_rgba(255,0,255,0.7)]"
            onWheel={handleScroll}
            onTouchMove={handleScroll}
            onClick={handleScroll}
        >
            {/* The Fill Bar */}
            <div
                className="absolute bottom-0 w-full transition-all duration-100 ease-linear"
                style={{
                    height: `${meterValue * 100}%`,
                    backgroundColor: getColor(meterValue)
                }}
            />

            {/* Label Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-black -rotate-90 whitespace-nowrap drop-shadow-md">
                    {meterValue <= 0.01 ? "DEAD 💀" : "DOOM METER"}
                </span>
            </div>

            {/* Status Text */}
            {meterValue <= 0.01 && (
                <div className="absolute top-0 w-full text-[0.6rem] text-white text-center bg-black/50">
                    SCROLL!
                </div>
            )}
        </div>
    );
};

/**
 * GoldenFloater - The Golden Macaron event view
 * View Component (NO LOGIC)
 */
import React from 'react';
import { MACARON_TYPES } from '../logic/macaronConstants';

// Macaron SVG Component
const MacaronIcon = ({ type }) => {
    // Default to rose if not found
    const macaron = type || MACARON_TYPES[0];

    return (
        <svg viewBox="0 0 100 100" aria-label={`${macaron.name} - ${macaron.description}`}>
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Bottom Cookie */}
            <path
                d="M10 65 Q 10 85 50 85 Q 90 85 90 65 Q 90 55 50 55 Q 10 55 10 65"
                fill={macaron.color}
                stroke="#000"
                strokeWidth="1"
                filter="url(#glow)"
            />
            {/* Feet (The ruffles) */}
            <path
                d="M12 65 Q 15 70 20 65 Q 25 70 30 65 Q 35 70 40 65 Q 45 70 50 65 Q 55 70 60 65 Q 65 70 70 65 Q 75 70 80 65 Q 85 70 88 65"
                fill="none"
                stroke={macaron.color}
                strokeWidth="2"
                strokeDasharray="2 1"
            />

            {/* Filling */}
            <path
                d="M15 60 Q 15 50 50 50 Q 85 50 85 60 Q 85 65 50 65 Q 15 65 15 60"
                fill={macaron.filling}
            />

            {/* Top Cookie */}
            <path
                d="M10 45 Q 10 20 50 20 Q 90 20 90 45 Q 90 55 50 55 Q 10 55 10 45"
                fill={macaron.color}
                stroke="#000"
                strokeWidth="1"
                filter="url(#glow)"
            />

            {/* Shine/Reflection */}
            <ellipse cx="65" cy="35" rx="15" ry="8" fill="#FFF" opacity="0.3" transform="rotate(-15 65 35)" />
        </svg>
    );
};

/**
 * Golden Floater Component
 * @param {Object} props
 * @param {boolean} props.isActive - Whether event is spawned
 * @param {Object} props.position - { x, y } screen position
 * @param {Function} props.onClick - Click handler
 * @param {Object} props.type - Macaron definition object
 */
export function GoldenFloater({
    isActive = false,
    position = { x: 0, y: 0 },
    onClick,
    type
}) {
    if (!isActive) return null;

    return (
        <button
            className="golden-croissant" // Keeping class name for existing animations
            style={{
                left: position.x,
                top: position.y,
                width: '80px', // Slightly larger for macaron detail
                height: '80px'
            }}
            onClick={onClick}
            aria-label={`${type?.name || 'Macaron'} - Click for bonus!`}
        >
            <MacaronIcon type={type} />
        </button>
    );
}

/**
 * Multiplier Indicator - Shows when multiplier is active
 */
export function MultiplierIndicator({
    multiplier = 1,
    timeRemaining = 0,
    isActive = false,
}) {
    if (!isActive || multiplier <= 1) return null;

    return (
        <div className="multiplier-active" role="status" aria-live="polite">
            🥐 {multiplier}x BONUS! ({timeRemaining}s)
        </div>
    );
}

export default GoldenFloater;

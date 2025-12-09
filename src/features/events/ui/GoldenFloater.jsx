/**
 * GoldenFloater - The Golden Croissant event view
 * View Component (NO LOGIC)
 */
import React from 'react';

// Golden Croissant SVG
const GoldenCroissantIcon = () => (
    <svg viewBox="0 0 80 80" aria-label="Golden Croissant - Click for bonus!">
        <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Croissant body */}
        <path
            d="M10 50 Q5 40 15 30 Q25 20 40 25 Q55 20 65 30 Q75 40 70 50 Q65 60 55 55 Q45 65 40 60 Q35 65 25 55 Q15 60 10 50"
            fill="url(#goldGradient)"
            stroke="#B8860B"
            strokeWidth="2"
            filter="url(#glow)"
        />

        {/* Croissant ridges */}
        <path d="M20 45 Q25 35 35 40" stroke="#B8860B" strokeWidth="1.5" fill="none" />
        <path d="M35 50 Q40 38 50 42" stroke="#B8860B" strokeWidth="1.5" fill="none" />
        <path d="M48 48 Q55 38 62 45" stroke="#B8860B" strokeWidth="1.5" fill="none" />

        {/* Sparkles */}
        <circle cx="15" cy="25" r="2" fill="#FFF" opacity="0.8" />
        <circle cx="65" cy="20" r="1.5" fill="#FFF" opacity="0.7" />
        <circle cx="40" cy="15" r="2" fill="#FFF" opacity="0.9" />
        <circle cx="70" cy="55" r="1.5" fill="#FFF" opacity="0.6" />
    </svg>
);

/**
 * Golden Floater Component
 * @param {Object} props
 * @param {boolean} props.isActive - Whether event is spawned
 * @param {Object} props.position - { x, y } screen position
 * @param {Function} props.onClick - Click handler
 */
export function GoldenFloater({
    isActive = false,
    position = { x: 0, y: 0 },
    onClick,
}) {
    if (!isActive) return null;

    return (
        <button
            className="golden-croissant"
            style={{
                left: position.x,
                top: position.y,
            }}
            onClick={onClick}
            aria-label="Golden Croissant bonus! Click for 67x multiplier!"
        >
            <GoldenCroissantIcon />
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

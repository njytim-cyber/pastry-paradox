/**
 * MainCake - The clickable cake view
 * View Component (NO LOGIC)
 */
import React, { useState, useCallback } from 'react';
import { formatNumberWord } from '../logic/useCakeLogic';

// Placeholder cake SVG until assets are generated
const PlaceholderCake = () => (
    <svg viewBox="0 0 200 200" className="cake" role="img" aria-label="Delicious cake">
        {/* Plate */}
        <ellipse cx="100" cy="180" rx="90" ry="15" fill="#E8D5C4" stroke="#8B5A2B" strokeWidth="2" />

        {/* Bottom layer */}
        <rect x="30" y="120" width="140" height="55" rx="8" fill="#F5D89A" stroke="#8B5A2B" strokeWidth="2" />
        <rect x="35" y="125" width="130" height="10" fill="#C4956A" opacity="0.5" />

        {/* Middle layer */}
        <rect x="40" y="75" width="120" height="50" rx="6" fill="#FFB6C1" stroke="#8B5A2B" strokeWidth="2" />
        <rect x="45" y="80" width="110" height="8" fill="#E8A0A0" opacity="0.5" />

        {/* Top layer */}
        <rect x="50" y="40" width="100" height="40" rx="5" fill="#FFF8DC" stroke="#8B5A2B" strokeWidth="2" />

        {/* Frosting drips */}
        <path d="M50 40 Q45 50 50 55 L50 40" fill="#FFF8DC" stroke="#8B5A2B" strokeWidth="1" />
        <path d="M80 40 Q75 55 80 60 L80 40" fill="#FFF8DC" stroke="#8B5A2B" strokeWidth="1" />
        <path d="M120 40 Q125 52 120 58 L120 40" fill="#FFF8DC" stroke="#8B5A2B" strokeWidth="1" />
        <path d="M150 40 Q155 48 150 53 L150 40" fill="#FFF8DC" stroke="#8B5A2B" strokeWidth="1" />

        {/* Strawberries */}
        <ellipse cx="65" cy="35" rx="10" ry="12" fill="#E8A0A0" stroke="#8B5A2B" strokeWidth="1.5" />
        <path d="M63 25 L65 20 L67 25" fill="#7CB342" stroke="#558B2F" strokeWidth="1" />

        <ellipse cx="100" cy="32" rx="12" ry="14" fill="#C97070" stroke="#8B5A2B" strokeWidth="1.5" />
        <path d="M98 20 L100 14 L102 20" fill="#7CB342" stroke="#558B2F" strokeWidth="1" />

        <ellipse cx="135" cy="35" rx="10" ry="12" fill="#E8A0A0" stroke="#8B5A2B" strokeWidth="1.5" />
        <path d="M133 25 L135 20 L137 25" fill="#7CB342" stroke="#558B2F" strokeWidth="1" />

        {/* Cherry on top */}
        <circle cx="100" cy="18" r="8" fill="#B24C63" stroke="#8B5A2B" strokeWidth="1.5" />
        <ellipse cx="97" cy="15" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.6" />
        <path d="M100 10 Q105 5 108 8" stroke="#558B2F" strokeWidth="2" fill="none" />
    </svg>
);

/**
 * MainCake Component
 * @param {Object} props
 * @param {Function} props.onCakeClick - Click handler from useCakeLogic
 * @param {Array} props.particles - Click particles to render
 * @param {number} props.balance - Current cake balance
 * @param {number} props.cps - Cakes per second
 * @param {string} props.currencyName - Currency name from balance.json
 */
export function MainCake({
    onCakeClick,
    particles = [],
    balance = 0,
    cps = 0,
    currencyName = 'Delicious Cakes'
}) {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = useCallback((e) => {
        setIsClicked(true);
        onCakeClick?.(e);

        // Reset animation
        setTimeout(() => setIsClicked(false), 150);
    }, [onCakeClick]);

    return (
        <div className="cake-container game-area">
            {/* Clickable Cake */}
            <div
                className={`cake-wrapper ${isClicked ? 'clicked' : ''}`}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                aria-label="Click to bake cakes"
                onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
            >
                <div className="cake">
                    <PlaceholderCake />
                </div>
            </div>

            {/* Click Particles */}
            {particles.map(particle => (
                <span
                    key={particle.id}
                    className="click-particle"
                    style={{
                        left: particle.x,
                        top: particle.y,
                    }}
                >
                    +{formatNumberWord(particle.value)}
                </span>
            ))}
        </div>
    );
}

export default MainCake;

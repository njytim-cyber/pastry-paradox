/**
 * MainCake - The clickable cake view
 * View Component (NO LOGIC)
 */
import React, { useState, useCallback } from 'react';
import { formatNumberWord } from '../logic/useCakeLogic';
import { useEventStore } from '../../events/logic/useEventStore';

// Import Christmas Yule Log
// import yuleLogImage from '@assets/events/christmas/yule_log.png'; // Unused now

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

// Christmas Yule Log Cake SVG (Translucent and Cute)
const YuleLogSVG = () => (
    <svg viewBox="0 0 200 200" className="cake christmas-cake" role="img" aria-label="Cute Yule Log Cake">
        {/* Main Log Body (Chocolate) */}
        <path d="M40 70 L40 130 C40 150 70 160 100 160 C130 160 160 150 160 130 L160 70" fill="#5D4037" stroke="#3E2723" strokeWidth="3" />
        <ellipse cx="100" cy="70" rx="60" ry="25" fill="#795548" stroke="#3E2723" strokeWidth="3" />

        {/* Swirl End Cap (Light Cream Spiral) */}
        <ellipse cx="100" cy="70" rx="50" ry="20" fill="#D7CCC8" />
        <path d="M100 70 m-35 0 a 35 12 0 1 0 70 0 a 35 12 0 1 0 -70 0" stroke="#5D4037" strokeWidth="4" fill="none" opacity="0.8" />
        <path d="M100 70 m-20 0 a 20 7 0 1 0 40 0 a 20 7 0 1 0 -40 0" stroke="#5D4037" strokeWidth="4" fill="none" opacity="0.8" />

        {/* Bark Texture Details */}
        <path d="M50 90 Q60 110 50 130" stroke="#3E2723" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M80 100 Q90 120 80 140" stroke="#3E2723" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M120 90 Q130 110 120 130" stroke="#3E2723" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M150 100 Q140 120 150 140" stroke="#3E2723" strokeWidth="2" fill="none" opacity="0.5" />

        {/* Snow Icing on Top */}
        <path d="M40 75 Q70 65 100 75 Q130 65 160 75 Q160 90 150 95 Q130 90 120 100 Q100 90 80 100 Q60 90 40 95 Z" fill="#FFF" opacity="0.9" />

        {/* Holly Leaves & Berries */}
        <path d="M85 65 Q80 50 90 45 Q100 50 95 65 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1" />
        <path d="M115 65 Q120 50 110 45 Q100 50 105 65 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1" />
        <circle cx="95" cy="65" r="5" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1" />
        <circle cx="105" cy="65" r="5" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1" />
        <circle cx="100" cy="58" r="5" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1" />

        {/* Cute Face */}
        <circle cx="80" cy="110" r="4" fill="#000" />
        <circle cx="120" cy="110" r="4" fill="#000" />
        <path d="M95 115 Q100 120 105 115" stroke="#000" strokeWidth="2" fill="none" />
        <ellipse cx="75" cy="115" rx="3" ry="1.5" fill="#FFCDD2" opacity="0.6" />
        <ellipse cx="125" cy="115" rx="3" ry="1.5" fill="#FFCDD2" opacity="0.6" />

        {/* Meringue Mushrooms */}
        <path d="M50 140 Q60 130 70 140 L65 150 L55 150 Z" fill="#FFF8E1" stroke="#FBC02D" strokeWidth="1" />
        <ellipse cx="60" cy="140" rx="12" ry="6" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1" />

        <path d="M140 140 Q150 130 160 140 L155 150 L145 150 Z" fill="#FFF8E1" stroke="#FBC02D" strokeWidth="1" />
        <ellipse cx="150" cy="140" rx="12" ry="6" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1" />
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
    const { isActive, config } = useEventStore();

    // Check if Christmas theme is active
    const isChristmas = isActive && config?.eventId === 'event_christmas_2025';

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
                    {isChristmas ? <YuleLogSVG /> : <PlaceholderCake />}
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

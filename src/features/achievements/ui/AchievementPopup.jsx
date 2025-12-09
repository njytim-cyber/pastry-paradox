/**
 * AchievementPopup.jsx
 * Displays a toast notification when an achievement is unlocked
 */
import React, { useEffect, useState } from 'react';
import './AchievementPopup.css';

// Asset helper removed for now
// import { getAssetPath } from '@assets/asset_helper';

// Import icons
const iconAssets = import.meta.glob('@assets/icons/*.{png,svg}', { eager: true, import: 'default' });
const getIconResult = (id) => {
    const match = Object.keys(iconAssets).find(path => path.includes(id + '.') || path.includes(id));
    return match ? iconAssets[match] : null;
};

export function AchievementPopup({
    queue = [],
    onDismiss
}) {
    const [current, setCurrent] = useState(null);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (!current && queue.length > 0) {
            setCurrent(queue[0]);
            setIsExiting(false);

            // Auto dismiss after 3 seconds (User request)
            const timer = setTimeout(() => {
                handleDismiss();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [queue, current]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => {
            setCurrent(null);
            onDismiss?.();
        }, 500); // Wait for exit animation
    };

    if (!current) return null;

    const iconUrl = getIconResult(current.id);

    return (
        <div className={`achievement-popup ${isExiting ? 'achievement-popup--exit' : ''}`}>
            <div className="achievement-popup__icon">
                {iconUrl ? (
                    <img src={iconUrl} alt="Trohpy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                    '🏆'
                )}
            </div>
            <div className="achievement-popup__content">
                <div className="achievement-popup__title">Achievement Unlocked!</div>
                <div className="achievement-popup__name">{current.name}</div>
                <div className="achievement-popup__desc">{current.description}</div>
            </div>
        </div>
    );
}

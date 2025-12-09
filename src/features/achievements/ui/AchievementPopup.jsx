/**
 * AchievementPopup.jsx
 * Displays a toast notification when an achievement is unlocked
 */
import React, { useEffect, useState } from 'react';
import './AchievementPopup.css';

// Asset helper removed for now
// import { getAssetPath } from '@assets/asset_helper';

// NOTE: We don't have getAssetPath yet, so we will use inline SVGs/images or passed URLs
// For now, assume iconUrl is passed

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

    return (
        <div className={`achievement-popup ${isExiting ? 'achievement-popup--exit' : ''}`}>
            <div className="achievement-popup__icon">
                {/* Placeholder or real icon */}
                🏆
            </div>
            <div className="achievement-popup__content">
                <div className="achievement-popup__title">Achievement Unlocked!</div>
                <div className="achievement-popup__name">{current.name}</div>
                <div className="achievement-popup__desc">{current.description}</div>
            </div>
        </div>
    );
}

/**
 * StatsPanel - Middle pane stats dashboard
 * View Component
 */
import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../cake/logic/useCakeLogic';

// Import all icons from assets folder
const iconAssets = import.meta.glob('@assets/icons/*.{png,svg}', { eager: true, import: 'default' });

/**
 * Get the icon URL for a given upgrade ID
 * @param {string} id - Upgrade ID
 */
const getIconResult = (id) => {
    const match = Object.keys(iconAssets).find(path => path.includes(id + '.') || path.includes(id));
    return match ? iconAssets[match] : null;
};

/**
 * Stats Panel Component
 */
export function StatsPanel({
    stats = {},
    cps = 0,
    legacyPoints = 0,
    legacyMultiplier = 1,
    potentialLegacyPoints = 0,
    canPrestige = false,
    onPrestige,
    achievements = [],
    unlockedIds = [],
    upgrades = []
}) {
    const [showDetails, setShowDetails] = useState(false);

    // Update time display every second
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const sessionTime = Date.now() - (stats.sessionStart || Date.now());

    /**
     * Format time duration
     */
    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    };

    return (
        <div className="panel stats-panel">
            <div className="panel-header">
                <h2 className="panel-title">Your Bakery</h2>
                <button
                    className="btn btn--small"
                    onClick={() => setShowDetails(!showDetails)}
                    style={{ marginLeft: 'auto' }}
                >
                    {showDetails ? '📊 Stats' : '📜 Details'}
                </button>
            </div>

            {!showDetails ? (
                <div className="stats-grid">
                    {/* Production Stats */}
                    <div className="stats-section">
                        <h3 className="stats-section-title">Production</h3>
                        <div className="stat-row">
                            <span className="stat-label">Total Baked</span>
                            <span className="stat-value">{formatNumber(stats.totalBaked || 0)}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">All-Time Baked</span>
                            <span className="stat-value">{formatNumber(stats.allTimeBaked || 0)}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Per Second</span>
                            <span className="stat-value">{formatNumber(cps)}</span>
                        </div>
                    </div>

                    {/* Session Stats */}
                    <div className="stats-section">
                        <h3 className="stats-section-title">Session</h3>
                        <div className="stat-row">
                            <span className="stat-label">Time Played</span>
                            <span className="stat-value">{formatTime(sessionTime)}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Total Clicks</span>
                            <span className="stat-value">{formatNumber(stats.totalClicks || 0)}</span>
                        </div>
                    </div>

                    {/* Legacy Stats */}
                    <div className="stats-section stats-section--legacy">
                        <h3 className="stats-section-title">🌟 Cosmic History</h3>
                        <div className="stat-row">
                            <span className="stat-label">Dark Matter</span>
                            <span className="stat-value stat-value--gold">{legacyPoints}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">CpS Bonus</span>
                            <span className="stat-value stat-value--gold">+{Math.round((legacyMultiplier - 1) * 100)}%</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Universe Resets</span>
                            <span className="stat-value">{stats.prestigeCount || 0}</span>
                        </div>
                    </div>
                </div>
            ) : (
                // DETAILS VIEW (Achievements & Upgrades)
                <div className="details-view">

                    {/* ACHIEVEMENTS SECTION */}
                    {/* UPGRADES SECTION */}
                    <div className="details-section" style={{ marginTop: '1rem' }}>
                        <h3>⚡ Upgrades</h3>
                        <div className="upgrade-list-text" style={{
                            fontSize: '0.9rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            padding: '8px',
                            background: 'rgba(0,0,0,0.05)',
                            borderRadius: '8px'
                        }}>
                            {upgrades.filter(u => u.isPurchased).length === 0 ? (
                                <p style={{ opacity: 0.8, fontStyle: 'italic', width: '100%' }}>
                                    Active upgrades are listed in the Upgrade Grid. Buy some!
                                </p>
                            ) : (
                                upgrades.filter(u => u.isPurchased).map(u => {
                                    const iconUrl = getIconResult(u.id);
                                    return (
                                        <div
                                            key={u.id}
                                            className="upgrade-icon-small"
                                            title={`${u.name}\n${u.description}`}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                background: 'var(--color-cream)',
                                                border: '2px solid var(--color-caramel)',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'help',
                                                fontSize: '1.5rem',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {iconUrl ? (
                                                <img src={iconUrl} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                '⚡'
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Prestige Button - Only show in Stats mode */}
            {!showDetails && (
                <div className="prestige-section">
                    <div className="prestige-info">
                        {canPrestige ? (
                            <span className="prestige-available">
                                🌌 Trigger <strong>The Big Crunch</strong> for <strong>+{potentialLegacyPoints}</strong> Dark Matter!
                            </span>
                        ) : (
                            <span className="prestige-requirement">
                                Bake 1 trillion cakes to collapse the universe
                            </span>
                        )}
                    </div>
                    <button
                        className={`btn btn--prestige ${canPrestige ? '' : 'btn--disabled'}`}
                        onClick={onPrestige}
                        disabled={!canPrestige}
                    >
                        💥 The Big Crunch
                    </button>
                </div>
            )}
        </div>
    );
}

export default StatsPanel;

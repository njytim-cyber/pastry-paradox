/**
 * StatsPanel - Middle pane stats dashboard
 * View Component
 */
import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../cake/logic/useCakeLogic';

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
    unlockedIds = []
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
                        <h3 className="stats-section-title">🌟 Franchise History</h3>
                        <div className="stat-row">
                            <span className="stat-label">Reputation</span>
                            <span className="stat-value stat-value--gold">{legacyPoints}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">CpS Bonus</span>
                            <span className="stat-value stat-value--gold">+{Math.round((legacyMultiplier - 1) * 100)}%</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Prestiges</span>
                            <span className="stat-value">{stats.prestigeCount || 0}</span>
                        </div>
                    </div>
                </div>
            ) : (
                // DETAILS VIEW (Achievements & Upgrades)
                <div className="details-view">

                    {/* ACHIEVEMENTS SECTION */}
                    <div className="details-section">
                        <h3>🏆 Achievements ({unlockedIds.length}/{achievements.length})</h3>
                        <div className="achievement-grid" style={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                            gap: '8px',
                            padding: '8px',
                            background: 'rgba(0,0,0,0.05)',
                            borderRadius: '8px'
                        }}>
                            {achievements.map(ach => {
                                const isUnlocked = unlockedIds.includes(ach.id);
                                return (
                                    <div
                                        key={ach.id}
                                        className={`achievement-icon ${isUnlocked ? 'unlocked' : 'locked'}`}
                                        title={isUnlocked ? `${ach.name}\n${ach.description}` : 'Locked'}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            background: isUnlocked ? 'var(--color-gold)' : '#ccc',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.2rem',
                                            opacity: isUnlocked ? 1 : 0.3,
                                            cursor: 'help',
                                            border: '2px solid rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {isUnlocked ? (ach.material === 'Gold' ? '🥇' : ach.material === 'Silver' ? '🥈' : '🥉') : '🔒'}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* UPGRADES SECTION */}
                    <div className="details-section" style={{ marginTop: '1rem' }}>
                        <h3>⚡ Upgrades</h3>
                        <div className="upgrade-list-text" style={{ fontSize: '0.9rem', opacity: 0.8, fontStyle: 'italic' }}>
                            <p>Active upgrades are listed in the Upgrade Grid.</p>
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
                                🌟 Franchise now for <strong>+{potentialLegacyPoints}</strong> Reputation!
                            </span>
                        ) : (
                            <span className="prestige-requirement">
                                Bake 1 trillion cakes to unlock Franchising
                            </span>
                        )}
                    </div>
                    <button
                        className={`btn btn--prestige ${canPrestige ? '' : 'btn--disabled'}`}
                        onClick={onPrestige}
                        disabled={!canPrestige}
                    >
                        🔄 Franchise
                    </button>
                </div>
            )}
        </div>
    );
}

export default StatsPanel;

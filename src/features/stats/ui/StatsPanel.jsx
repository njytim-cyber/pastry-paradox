/**
 * StatsPanel - Middle pane stats dashboard
 * View Component (NO LOGIC)
 */
import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../cake/logic/useCakeLogic';

/**
 * Format time duration
 */
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

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
}) {
    // Update time display every second
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const sessionTime = Date.now() - (stats.sessionStart || Date.now());

    return (
        <div className="panel stats-panel">
            <div className="panel-header">
                <h2 className="panel-title">📊 Statistics</h2>
            </div>

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
                    <div className="stat-row">
                        <span className="stat-label">Total Spent</span>
                        <span className="stat-value">{formatNumber(stats.totalSpent || 0)}</span>
                    </div>
                </div>

                {/* Legacy Stats */}
                <div className="stats-section stats-section--legacy">
                    <h3 className="stats-section-title">🌟 Legacy</h3>
                    <div className="stat-row">
                        <span className="stat-label">Legacy Points</span>
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

            {/* Prestige Button */}
            <div className="prestige-section">
                <div className="prestige-info">
                    {canPrestige ? (
                        <span className="prestige-available">
                            🌟 Prestige now for <strong>+{potentialLegacyPoints}</strong> Legacy Points!
                        </span>
                    ) : (
                        <span className="prestige-requirement">
                            Bake 1 trillion cakes to unlock Legacy
                        </span>
                    )}
                </div>
                <button
                    className={`btn btn--prestige ${canPrestige ? '' : 'btn--disabled'}`}
                    onClick={onPrestige}
                    disabled={!canPrestige}
                >
                    🔄 Ascend
                </button>
            </div>
        </div>
    );
}

export default StatsPanel;

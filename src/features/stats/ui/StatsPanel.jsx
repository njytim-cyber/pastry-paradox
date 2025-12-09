/**
 * StatsPanel - Middle pane stats dashboard
 * View Component
 */
import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../cake/logic/useCakeLogic';
import { Tooltip } from '../../shared/ui/Tooltip';

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
 * Helper: Paged List Component
 */
/**
 * Helper: Scrollable List Component (Fixed Height)
 */
const ScrollableSection = ({ title, items = [], renderItem, emptyMessage, totalCount, unlockedCount, style }) => {
    // Display counts: "Title (Unlocked/Total)" OR just "Title (Total)"
    const countDisplay = unlockedCount !== undefined
        ? `(${unlockedCount}/${totalCount || items.length})`
        : `(${items.length})`;

    return (
        <div className="details-section" style={{ display: 'flex', flexDirection: 'column', ...style }}>
            <h3 style={{ margin: '0 0 8px 0', flexShrink: 0 }}>{title} {countDisplay}</h3>

            <div className="scrollable-list-container" style={{
                fontSize: '0.9rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '8px',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '8px',
                minHeight: '60px',    // Prevent layout jumping
                alignContent: 'flex-start' // Ensure items stick to top
            }}>
                {items.length === 0 ? (
                    <p style={{ opacity: 0.8, fontStyle: 'italic', width: '100%' }}>{emptyMessage}</p>
                ) : (
                    items.map(renderItem)
                )}
            </div>
        </div>
    );
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
        <div className="panel stats-panel" style={{
            flex: 1, // Fill available space in parent flex container
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', // Prevent internal overflow leaking
            minHeight: 0 // Allow shrinking below content size
        }}>
            <div className="panel-header">
                <h2 className="panel-title">Your Patisserie</h2>
                <button
                    className="btn btn--small"
                    onClick={() => setShowDetails(!showDetails)}
                    style={{ marginLeft: 'auto' }}
                >
                    {showDetails ? '📊 Stats' : '📜 Details'}
                </button>
            </div>

            {!showDetails ? (
                <div className="stats-grid" style={{ overflowY: 'auto' }}>
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
                <div className="details-view" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',  // Single scrollbar for entire Details view
                    gap: '12px',
                    paddingRight: '4px' // Space for scrollbar
                }}>

                    {/* UPGRADES SECTION */}
                    <ScrollableSection
                        title="⚡ Secret Ingredients"
                        items={upgrades.filter(u => u.isPurchased)}
                        emptyMessage="Active upgrades are listed in the Upgrade Grid. Buy some!"
                        renderItem={(u) => {
                            const iconUrl = getIconResult(u.id);
                            const tooltipContent = (
                                <>
                                    <div className="tooltip-rich-header">{u.name}</div>
                                    <div className="tooltip-rich-body">{u.description}</div>
                                    <div className="tooltip-rich-stats">
                                        <span>Cost: {formatNumber(u.cost)} cakes</span>
                                    </div>
                                </>
                            );
                            return (
                                <Tooltip key={u.id} content={tooltipContent}>
                                    <div style={{
                                        width: '40px', height: '40px', background: 'var(--color-cream)',
                                        border: '2px solid var(--color-caramel)', borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'help', fontSize: '1.5rem', overflow: 'hidden'
                                    }}>
                                        {iconUrl ? <img src={iconUrl} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '⚡'}
                                    </div>
                                </Tooltip>
                            );
                        }}
                    />

                    {/* ACHIEVEMENTS SECTION */}
                    <ScrollableSection
                        title="🏆 Sweet Success"
                        items={achievements}
                        totalCount={achievements.length}
                        unlockedCount={unlockedIds?.length || 0}
                        emptyMessage="No achievements yet."
                        renderItem={(ach) => {
                            const isUnlocked = unlockedIds.includes(ach.id);
                            const tooltipContent = (
                                <>
                                    <div className="tooltip-rich-header">{ach.name}</div>
                                    <div className="tooltip-rich-body">{ach.description}</div>
                                    {!isUnlocked && <div style={{ color: 'var(--color-sell)', fontSize: '0.8rem' }}>🔒 Locked</div>}
                                    {isUnlocked && <div style={{ color: 'var(--color-mint)', fontSize: '0.8rem' }}>✅ Unlocked</div>}
                                </>
                            );
                            return (
                                <Tooltip key={ach.id} content={tooltipContent}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        background: isUnlocked ? 'var(--color-cream)' : '#e0e0e0',
                                        border: isUnlocked ? '2px solid var(--color-gold)' : '2px dashed #aaa',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'help', fontSize: '1.5rem', overflow: 'hidden',
                                        opacity: isUnlocked ? 1 : 0.5, filter: isUnlocked ? 'none' : 'grayscale(100%)'
                                    }}>
                                        <span>{ach.icon || '🏆'}</span>
                                    </div>
                                </Tooltip>
                            );
                        }}
                    />
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

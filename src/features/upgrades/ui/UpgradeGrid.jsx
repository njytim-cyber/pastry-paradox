/**
 * UpgradeGrid - Display and purchase upgrades
 * View Component (NO LOGIC)
 */
import React, { useState } from 'react';
import { formatNumberWord } from '../../cake/logic/useCakeLogic';
import balanceData from '@data/balance.json';

// Import all icons from assets folder
// Import all icons from assets folder
const iconAssets = import.meta.glob('@assets/icons/*.{png,svg}', { eager: true, import: 'default' });

/**
 * Get the icon URL for a given upgrade ID
 * @param {string} id - Upgrade ID
 */
const getIconResult = (id) => {
    // Check if any asset contains the ID in its name
    // Upgrades seem to have 'upgrade_' prefix in assets sometimes, or not.
    // We check looser match.
    // e.g. ID 'butter_blessing' -> file 'upgrade_butter_blessing.png'
    const match = Object.keys(iconAssets).find(path => path.includes(id + '.') || path.includes(id));
    return match ? iconAssets[match] : null;
};

// Fallback icons map to ensure uniqueness
// Fallback icons map to ensure uniqueness
const FALLBACK_ICONS = {
    'the_vibe_check': '🙌',
    'butter_blessing': '🧈',
    'flour_power': '🌾',
    'sugar_rush': '⚡',
    'grandmas_approval': '👵',
    'preheated': '🔥',
    'turbo_whisk': '🥣',
    'viral_resonance': '🥐',
    'click_mastery': '👆',
    'double_tap': '✌️',
    'franchise_fever': '🏪',
    'factory_overdrive': '🏭',
    'frosting_flood': '🌊',
    'printer_perfection': '🖨️',
    'robot_uprising': '🤖',
    'clone_perfection': '🧬',
    'zero_g_frosting': '🪐',
    'nano_swarm': '🦠',
    'temporal_baking': '⏳',
    'reality_dough': '🌌'
};

// Upgrade icon based on type
const UpgradeIcon = ({ upgrade, isPurchased }) => {
    const iconUrl = getIconResult(upgrade.id);

    if (iconUrl) {
        return (
            <img
                src={iconUrl}
                alt={upgrade.name}
                className="upgrade-card__icon"
                style={{
                    width: '42px',
                    height: '42px',
                    objectFit: 'contain',
                    opacity: isPurchased ? 0.6 : 1,
                    // Removed filter to avoid coloring issues
                }}
            />
        );
    }

    return (
        <div
            className="upgrade-card__icon"
            style={{
                fontSize: '2rem',
                opacity: isPurchased ? 0.6 : 1,
            }}
        >
            {FALLBACK_ICONS[upgrade.id] || '⬆️'}
        </div>
    );
};

/**
 * Upgrade Grid Component
 * @param {Object} props
 * @param {Array} props.upgrades - List of upgrades
 * @param {number} props.balance - Current balance
 * @param {Function} props.canPurchase - Check if can purchase
 * @param {Function} props.onPurchase - Purchase handler
 */
export function UpgradeGrid({
    upgrades = [],
    balance = 0,
    canPurchase,
    onPurchase,
}) {
    if (upgrades.length === 0) {
        return null;
    }

    // View Mode: 'available' | 'owned'
    const [viewMode, setViewMode] = useState('available');

    // Progressive unlocking: show upgrade when you have at least 50% of its cost
    const visibilityThreshold = balanceData.globalConfig?.upgradeVisibilityThreshold || 0.5;

    const visibleUpgrades = upgrades.filter(u => {
        if (viewMode === 'owned') {
            return u.isPurchased;
        }
        // 'available' mode: show unpurchased that are visible
        return !u.isPurchased && (balance >= u.cost * visibilityThreshold);
    });

    // Buy All: purchase from first to last until can't afford
    const handleBuyAll = () => {
        // Sort by cost ascending so we buy cheapest first
        const affordableUpgrades = visibleUpgrades
            .filter(u => canPurchase?.(u.id, balance))
            .sort((a, b) => a.cost - b.cost);

        affordableUpgrades.forEach(upgrade => {
            onPurchase?.(upgrade.id);
        });
    };

    const hasAffordableUpgrades = visibleUpgrades.some(u => canPurchase?.(u.id, balance));

    // Tooltip state
    const [hoveredUpgrade, setHoveredUpgrade] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className="panel upgrade-panel">
            <div className="panel-header">
                <h2 className="panel-title">Upgrades</h2>
                {hasAffordableUpgrades && (
                    <button
                        className="btn btn--small"
                        onClick={handleBuyAll}
                        title="Buy all affordable upgrades"
                    >
                        Buy All
                    </button>
                )}
            </div>

            <div className="upgrade-grid-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '8px', padding: '10px' }}>
                {visibleUpgrades.length === 0 && (
                    <div className="empty-state">
                        <p>No upgrades available right now.</p>
                        <small>Bake more cakes!</small>
                    </div>
                )}

                {visibleUpgrades.map(upgrade => {
                    const canAfford = canPurchase?.(upgrade.id, balance);
                    return (
                        <button
                            key={upgrade.id}
                            className={`upgrade-card ${canAfford ? '' : 'upgrade-card--expensive'}`}
                            onClick={() => onPurchase?.(upgrade.id)}
                            disabled={!canAfford}
                            onMouseEnter={(e) => {
                                setHoveredUpgrade(upgrade);
                                handleMouseMove(e);
                            }}
                            onMouseLeave={() => setHoveredUpgrade(null)}
                            onMouseMove={handleMouseMove}
                            aria-label={`Buy ${upgrade.name}`}
                        >
                            <UpgradeIcon upgrade={upgrade} isPurchased={upgrade.isPurchased} />
                        </button>
                    );
                })}
            </div>

            {hoveredUpgrade && (
                <div
                    className="upgrade-tooltip-fixed"
                    style={{
                        top: mousePos.y + 15,
                        left: mousePos.x - 125,
                        zIndex: 1000
                    }}
                >
                    <div className="tooltip-header">
                        <strong>{hoveredUpgrade.name}</strong>
                    </div>
                    <div className="tooltip-body">
                        {hoveredUpgrade.description}
                    </div>
                    <div className={`tooltip-cost ${balance >= hoveredUpgrade.cost ? 'affordable' : 'expensive'}`}>
                        Cost: {formatNumberWord(hoveredUpgrade.cost)}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpgradeGrid;

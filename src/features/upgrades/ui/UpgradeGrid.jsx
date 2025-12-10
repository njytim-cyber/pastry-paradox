/**
 * UpgradeGrid - Display and purchase upgrades
 * View Component (NO LOGIC)
 */
import React, { useState } from 'react';
import { formatNumberWord } from '../../cake/logic/useCakeLogic';
import { Tooltip } from '../../shared/ui/Tooltip';
import balanceData from '@data/balance.json';

// Import all icons from assets folder
// Pre-compute icon map for O(1) lookup
const iconAssets = import.meta.glob('@assets/icons-optimized/*.{webp,png,svg}', { eager: true, import: 'default' });

const ICON_MAP = Object.keys(iconAssets).reduce((acc, path) => {
    // Extract ID from path: .../upgrade_butter_blessing.png -> butter_blessing
    const fileName = path.split('/').pop().split('.')[0];
    // Handle "upgrade_" prefix if present
    const id = fileName.replace(/^upgrade_/, '');
    acc[id] = iconAssets[path];
    return acc;
}, {});

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

// Memoized Icon Component
const UpgradeIcon = React.memo(({ id, isPurchased, name }) => {
    const iconUrl = ICON_MAP[id];

    if (iconUrl) {
        return (
            <img
                src={iconUrl}
                alt={name}
                className="upgrade-card__icon"
                style={{
                    width: '42px',
                    height: '42px',
                    objectFit: 'contain',
                    opacity: isPurchased ? 0.6 : 1,
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
            {FALLBACK_ICONS[id] || '⬆️'}
        </div>
    );
});
UpgradeIcon.displayName = 'UpgradeIcon';

// Memoized Card Component to prevent tooltip churn
const UpgradeCard = React.memo(({ upgrade, balance, onPurchase, canPurchase }) => {
    const canAfford = canPurchase?.(upgrade.id, balance);
    const isAffordable = balance >= upgrade.cost;

    const tooltipContent = (
        <>
            <div className="tooltip-rich-header">{upgrade.name}</div>
            <div className="tooltip-rich-body">{upgrade.description}</div>
            <div className="tooltip-rich-stats">
                <span className={isAffordable ? 'tooltip-stat-cost affordable' : 'tooltip-stat-cost expensive'}>
                    Cost: {formatNumberWord(upgrade.cost)}
                </span>
                {upgrade.isPurchased && <span style={{ color: 'var(--color-mint)' }}>Purchased</span>}
            </div>
        </>
    );

    return (
        <Tooltip content={tooltipContent}>
            <button
                className={`upgrade-card ${canAfford ? '' : 'upgrade-card--expensive'}`}
                onClick={() => onPurchase(upgrade.id)}
                disabled={!canAfford}
                aria-label={`Buy ${upgrade.name}`}
            >
                <UpgradeIcon id={upgrade.id} isPurchased={upgrade.isPurchased} name={upgrade.name} />
            </button>
        </Tooltip>
    );
}, (prev, next) => {
    // Custom comparison for performance
    // Only re-render if:
    // 1. Purchased state changes
    // 2. Affordability status changes (crossing the cost threshold)
    // 3. canPurchase result changes (redundant with 2 usually, but safe to keep)

    // Check if affordability bucket changed (switching between affordable/expensive class)
    const prevCanAfford = prev.canPurchase(prev.upgrade.id, prev.balance);
    const nextCanAfford = next.canPurchase(next.upgrade.id, next.balance);

    // Check if visual "Cost" color class needs to change
    const prevAffordable = prev.balance >= prev.upgrade.cost;
    const nextAffordable = next.balance >= next.upgrade.cost;

    return (
        prev.upgrade.isPurchased === next.upgrade.isPurchased &&
        prevCanAfford === nextCanAfford &&
        prevAffordable === nextAffordable
    );
});
UpgradeCard.displayName = 'UpgradeCard';

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
    // View Mode: 'available' | 'owned' - must be before any early returns (rules-of-hooks)
    const [viewMode] = useState('available');

    // Progressive unlocking: show upgrade when you have at least 50% of its cost
    const visibilityThreshold = balanceData.globalConfig?.upgradeVisibilityThreshold || 0.5;

    // Memoize the filtered list to avoid O(N) filter on every tick if balance changes small amounts
    // Note: We depend on 'balance' but the filtering condition is broad (threshold), 
    // so it might still run often. However, the child UpgradeCard is memoized, so re-rendering the list is cheap.
    const visibleUpgrades = React.useMemo(() => {
        if (upgrades.length === 0) return [];

        return upgrades.filter(u => {
            if (viewMode === 'owned') {
                return u.isPurchased;
            }
            // 'available' mode: show unpurchased that are visible
            return !u.isPurchased && (balance >= u.cost * visibilityThreshold);
        });
    }, [upgrades, viewMode, balance, visibilityThreshold]);

    if (upgrades.length === 0) {
        return null;
    }

    // Buy All Logic
    const handleBuyAll = () => {
        const affordableUpgrades = visibleUpgrades
            .filter(u => canPurchase?.(u.id, balance))
            .sort((a, b) => a.cost - b.cost);

        affordableUpgrades.forEach(upgrade => {
            onPurchase?.(upgrade.id);
        });
    };

    const hasAffordableUpgrades = visibleUpgrades.some(u => canPurchase?.(u.id, balance));

    return (
        <div className="panel upgrade-panel">
            <div className="panel-header">
                <h2 className="panel-title">Secret Ingredients</h2>
                {hasAffordableUpgrades && (
                    <button
                        className="btn btn--small"
                        onClick={handleBuyAll}
                        title="Buy all affordable secret ingredients"
                    >
                        Buy All
                    </button>
                )}
            </div>

            <div className="upgrade-grid-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '8px', padding: '10px' }}>
                {visibleUpgrades.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', fontStyle: 'italic', color: 'var(--ink-secondary)' }}>
                        No secret ingredients available right now. Bake more cakes!
                    </div>
                )}

                {visibleUpgrades.map(upgrade => (
                    <UpgradeCard
                        key={upgrade.id}
                        upgrade={upgrade}
                        balance={balance}
                        canPurchase={canPurchase}
                        onPurchase={onPurchase}
                    />
                ))}
            </div>
        </div>
    );
}

export default UpgradeGrid;

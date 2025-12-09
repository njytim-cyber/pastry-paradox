/**
 * UpgradeGrid - Display and purchase upgrades
 * View Component (NO LOGIC)
 */
import React from 'react';
import { formatNumber } from '../../cake/logic/useCakeLogic';

// Upgrade icon based on type
const UpgradeIcon = ({ upgrade, isPurchased }) => {
    const getEmoji = () => {
        if (upgrade.id === 'the_vibe_check') return '🙌';
        if (upgrade.id === 'viral_resonance') return '🥐';
        return '⬆️';
    };

    return (
        <div
            className="upgrade-card__icon"
            style={{
                fontSize: '1.5rem',
                opacity: isPurchased ? 0.6 : 1,
            }}
        >
            {getEmoji()}
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

    // Progressive unlocking: show upgrade when you have at least 50% of its cost
    // Hide purchased upgrades to reduce clutter
    const visibilityThreshold = 0.5; // 50% of cost required to see
    const visibleUpgrades = upgrades.filter(u => {
        if (u.isPurchased) return false; // Hide purchased
        return balance >= u.cost * visibilityThreshold; // Show if >= 50% of cost
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

    return (
        <div className="panel upgrade-panel">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="panel-title">✨ Upgrades</h2>
                {hasAffordableUpgrades && (
                    <button
                        className="upgrade-buy-all"
                        onClick={handleBuyAll}
                    >
                        Buy All
                    </button>
                )}
            </div>

            <div className="upgrade-grid">
                {visibleUpgrades.map(upgrade => {
                    const affordable = canPurchase?.(upgrade.id, balance) ?? false;

                    return (
                        <button
                            key={upgrade.id}
                            className={`upgrade-card ${upgrade.isPurchased ? 'upgrade-card--owned' :
                                !affordable ? 'upgrade-card--disabled' : ''
                                }`}
                            onClick={() => !upgrade.isPurchased && affordable && onPurchase?.(upgrade.id)}
                            disabled={upgrade.isPurchased || !affordable}
                        >
                            <UpgradeIcon upgrade={upgrade} isPurchased={upgrade.isPurchased} />

                            <div className="upgrade-card__tooltip">
                                <strong>{upgrade.name}</strong>
                                <br />
                                {upgrade.description}
                                <br />
                                <em>Cost: {formatNumber(upgrade.cost)}</em>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default UpgradeGrid;

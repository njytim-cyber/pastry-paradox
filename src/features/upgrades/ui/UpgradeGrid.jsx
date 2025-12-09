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

    // Filter to only show available upgrades (not purchased, or affordable)
    const visibleUpgrades = upgrades.filter(u => !u.isPurchased || balance >= u.cost * 0.5);

    if (visibleUpgrades.length === 0) {
        return null;
    }

    return (
        <div className="panel upgrade-panel">
            <div className="panel-header">
                <h2 className="panel-title">✨ Upgrades</h2>
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

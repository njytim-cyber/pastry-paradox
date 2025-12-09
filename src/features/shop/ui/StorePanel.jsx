/**
 * StorePanel - Shop for purchasing generators
 * View Component (NO LOGIC)
 */
import React from 'react';
import { formatNumber } from '../../cake/logic/useCakeLogic';

// Placeholder icons for generators
const GeneratorIcon = ({ tier }) => {
    const colors = [
        '#F5D89A', '#E8D5C4', '#C4956A', '#A8D5BA', '#7B8CDE',
        '#E8A0A0', '#B24C63', '#FFB6C1', '#9B59B6', '#3498DB',
        '#1ABC9C', '#F39C12', '#E74C3C', '#9B59B6', '#2ECC71',
    ];

    return (
        <svg viewBox="0 0 48 48" className="shop-item__icon" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill={colors[tier - 1] || '#DDD'} stroke="#5D3A1A" strokeWidth="2" />
            <text x="24" y="28" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#5D3A1A">
                {tier}
            </text>
        </svg>
    );
};

/**
 * Store Panel Component
 * @param {Object} props
 * @param {Array} props.generators - List of generator tiers
 * @param {Function} props.getGeneratorInfo - Get info for a generator
 * @param {Function} props.canAfford - Check if can afford
 * @param {Function} props.onPurchase - Purchase handler
 */
export function StorePanel({
    generators = [],
    getGeneratorInfo,
    canAfford,
    onPurchase,
}) {
    return (
        <div className="panel store-panel">
            <div className="panel-header">
                <h2 className="panel-title">🧁 Bakery</h2>
            </div>

            <div className="shop-list">
                {generators.map((tier, index) => {
                    const info = getGeneratorInfo?.(tier.id) || tier;
                    const affordable = canAfford?.(tier.id) ?? false;

                    return (
                        <button
                            key={tier.id}
                            className={`shop-item ${!affordable ? 'shop-item--disabled' : ''}`}
                            onClick={() => affordable && onPurchase?.(tier.id)}
                            disabled={!affordable}
                            title={tier.description}
                        >
                            <GeneratorIcon tier={index + 1} />

                            <div className="shop-item__info">
                                <div className="shop-item__name">{tier.name}</div>
                                <div className="shop-item__cost">
                                    🍰 {formatNumber(info.currentPrice || tier.baseCost)}
                                </div>
                            </div>

                            <div className="shop-item__owned">
                                {info.owned || 0}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default StorePanel;

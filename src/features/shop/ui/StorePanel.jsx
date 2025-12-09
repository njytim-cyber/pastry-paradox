/**
 * StorePanel - Shop for purchasing/selling generators
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
 */
export function StorePanel({
    generators = [],
    getGeneratorInfo,
    canAfford,
    onPurchase,
    onSell,
    shopMode = 'buy',
    setShopMode,
    buyQuantity = 1,
    setBuyQuantity,
    getSellPrice,
}) {
    return (
        <div className="panel store-panel">
            {/* Header with Buy/Sell Toggle */}
            <div className="panel-header store-header">
                <h2 className="panel-title">🧁 Store</h2>
                <div className="store-mode-toggle">
                    <button
                        className={`store-mode-btn ${shopMode === 'buy' ? 'store-mode-btn--active' : ''}`}
                        onClick={() => setShopMode?.('buy')}
                    >
                        Buy
                    </button>
                    <button
                        className={`store-mode-btn ${shopMode === 'sell' ? 'store-mode-btn--active store-mode-btn--sell' : ''}`}
                        onClick={() => setShopMode?.('sell')}
                    >
                        Sell
                    </button>
                </div>
            </div>

            {/* Quantity Selector - 67 themed! */}
            {shopMode === 'buy' && (
                <div className="quantity-selector">
                    {[1, 67, 6767].map((qty) => (
                        <button
                            key={qty}
                            className={`quantity-btn ${buyQuantity === qty ? 'quantity-btn--active' : ''}`}
                            onClick={() => setBuyQuantity?.(qty)}
                        >
                            {qty}
                        </button>
                    ))}
                </div>
            )}

            {/* Generator List */}
            <div className="shop-list">
                {generators.map((tier, index) => {
                    const info = getGeneratorInfo?.(tier.id) || tier;
                    const owned = info.owned || 0;

                    if (shopMode === 'buy') {
                        const affordable = canAfford?.(tier.id) ?? false;

                        return (
                            <button
                                key={tier.id}
                                className={`shop-item ${!affordable ? 'shop-item--disabled' : ''}`}
                                onClick={() => {
                                    for (let i = 0; i < buyQuantity; i++) {
                                        if (!canAfford?.(tier.id)) break;
                                        onPurchase?.(tier.id);
                                    }
                                }}
                                disabled={!affordable}
                                title={tier.description}
                            >
                                <GeneratorIcon tier={index + 1} />
                                <div className="shop-item__info">
                                    <div className="shop-item__name">{tier.name}</div>
                                    <div className="shop-item__cost">
                                        🍰 {formatNumber(info.currentPrice || tier.baseCost)}
                                        {buyQuantity > 1 && (
                                            <span className="shop-item__bulk"> (×{buyQuantity})</span>
                                        )}
                                    </div>
                                </div>
                                <div className="shop-item__owned">{owned}</div>
                            </button>
                        );
                    } else {
                        // Sell mode
                        const sellPrice = getSellPrice?.(tier.baseCost, owned) || 0;
                        const canSell = owned > 0;

                        return (
                            <button
                                key={tier.id}
                                className={`shop-item shop-item--sell ${!canSell ? 'shop-item--disabled' : ''}`}
                                onClick={() => canSell && onSell?.(tier.id)}
                                disabled={!canSell}
                                title={`Sell for ${formatNumber(sellPrice)} cakes`}
                            >
                                <GeneratorIcon tier={index + 1} />
                                <div className="shop-item__info">
                                    <div className="shop-item__name">{tier.name}</div>
                                    <div className="shop-item__cost shop-item__cost--sell">
                                        💰 +{formatNumber(sellPrice)}
                                    </div>
                                </div>
                                <div className="shop-item__owned">{owned}</div>
                            </button>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default StorePanel;

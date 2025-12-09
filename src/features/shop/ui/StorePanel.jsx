/**
 * StorePanel - Shop for purchasing/selling generators
 * View Component (NO LOGIC)
 * 
 * Progressive tier unlocking:
 * - Show owned tiers (purchased at least once)
 * - Show next unlockable tier (can afford or nearly afford)
 * - Show one mystery tier (???)
 * - Hide all other tiers
 */
import React from 'react';
import { formatNumber } from '../../cake/logic/useCakeLogic';

// Map tier ID to icon file
const tierIdMap = [
    'tier1_apprentice_baker',
    'tier2_grandma_recipe',
    'tier3_convection_oven',
    'tier4_professional_mixer',
    'tier5_bakery_franchise',
    'tier6_cake_factory',
    'tier7_frosting_hose',
    'tier8_3d_printer',
    'tier9_robotic_chef',
    'tier10_cloning_vat',
    'tier11_orbital_bakery',
    'tier12_nanobot_yeast',
    'tier13_time_warp_oven',
    'tier14_matter_replicator',
    'tier15_multiverse_portal',
];

// Generator icon using external PNG files from Vertex AI
const GeneratorIcon = ({ tier, isMystery }) => {
    if (isMystery) {
        return (
            <svg viewBox="0 0 64 64" className="shop-item__icon shop-item__icon--mystery" aria-hidden="true">
                <rect width="64" height="64" fill="#444" rx="8" />
                <text x="32" y="42" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#777">?</text>
            </svg>
        );
    }

    const iconId = tierIdMap[tier - 1] || `tier${tier}`;

    return (
        <img
            src={`/assets/icons/${iconId}.svg`}
            alt={`Tier ${tier}`}
            className="shop-item__icon"
            width="40"
            height="40"
        />
    );
};

/**
 * Determine which tiers to show based on current ownership
 * @param {Array} generators - All generators
 * @param {Function} getGeneratorInfo - Get owned count for generator
 * @returns {{ visible: Array, mystery: Object|null }}
 */
function getVisibleTiers(generators, getGeneratorInfo) {
    // Find the highest unlocked (owned > 0) tier index
    let highestOwnedIndex = -1;

    for (let i = 0; i < generators.length; i++) {
        const info = getGeneratorInfo?.(generators[i].id) || generators[i];
        if ((info.owned || 0) > 0) {
            highestOwnedIndex = i;
        }
    }

    // If nothing owned, show first tier + mystery
    if (highestOwnedIndex === -1) {
        return {
            visible: [{ ...generators[0], tierIndex: 0 }],
            mystery: generators[1] ? { ...generators[1], tierIndex: 1 } : null,
        };
    }

    // Show all owned tiers + next unlockable + mystery
    const visible = [];
    for (let i = 0; i <= highestOwnedIndex + 1 && i < generators.length; i++) {
        visible.push({ ...generators[i], tierIndex: i });
    }

    // Mystery tier is the one after visible
    const mysteryIndex = highestOwnedIndex + 2;
    const mystery = generators[mysteryIndex]
        ? { ...generators[mysteryIndex], tierIndex: mysteryIndex }
        : null;

    return { visible, mystery };
}

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
    const { visible, mystery } = getVisibleTiers(generators, getGeneratorInfo);

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
                {/* Visible Tiers */}
                {visible.map((tier) => {
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
                                <GeneratorIcon tier={tier.tierIndex + 1} />
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
                                <GeneratorIcon tier={tier.tierIndex + 1} />
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

                {/* Mystery Tier */}
                {mystery && (
                    <div className="shop-item shop-item--mystery shop-item--disabled">
                        <GeneratorIcon tier={mystery.tierIndex + 1} isMystery />
                        <div className="shop-item__info">
                            <div className="shop-item__name shop-item__name--mystery">???</div>
                            <div className="shop-item__cost">🍰 {formatNumber(mystery.baseCost)}</div>
                        </div>
                        <div className="shop-item__owned">0</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StorePanel;

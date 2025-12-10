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
import { formatNumber, formatNumberWordCompact } from '../../cake/logic/useCakeLogic';
import { Tooltip } from '../../shared/ui/Tooltip';

// Placeholder icons for generators - inline SVGs
// Import all icons from assets folder
const iconAssets = import.meta.glob('@assets/icons-optimized/*.{webp,png,svg}', { eager: true, import: 'default' });

/**
 * Get the icon URL for a given tier ID
 * @param {string} id - Tier ID (e.g. tier1_apprentice_baker)
 */
const getIconResult = (id) => {
    // Match if path contains the ID.
    // Files are like: .../tier1_apprentice_baker.png
    // ID is: apprentice_baker
    // So we check if path includes the ID.
    const match = Object.keys(iconAssets).find(path => path.includes(id + '.'));
    return match ? iconAssets[match] : null;
};

// Generator Icon Component
const GeneratorIcon = ({ tier, id, isMystery }) => {
    const colors = [
        '#F5D89A', '#E8D5C4', '#C4956A', '#A8D5BA', '#7B8CDE',
        '#E8A0A0', '#B24C63', '#FFB6C1', '#9B59B6', '#3498DB',
        '#1ABC9C', '#F39C12', '#E74C3C', '#9B59B6', '#2ECC71',
    ];

    if (isMystery) {
        return (
            <svg viewBox="0 0 48 48" className="shop-item__icon shop-item__icon--mystery" aria-hidden="true">
                <circle cx="24" cy="24" r="20" fill="#555" stroke="#333" strokeWidth="2" />
                <text x="24" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#888">?</text>
            </svg>
        );
    }

    const iconUrl = id ? getIconResult(id) : null;

    if (iconUrl) {
        return (
            <img
                src={iconUrl}
                alt={`Tier ${tier}`}
                className="shop-item__icon"
                style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
        );
    }

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
    getBulkCost
}) {
    const { visible, mystery } = getVisibleTiers(generators, getGeneratorInfo);

    // Phone detection for compact layout (tablets use full layout)
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

    // Quantity options for cycling
    const quantityOptions = [1, 67, 6767];

    // Cycle to next quantity
    const cycleQuantity = () => {
        const currentIndex = quantityOptions.indexOf(buyQuantity);
        const nextIndex = (currentIndex + 1) % quantityOptions.length;
        setBuyQuantity?.(quantityOptions[nextIndex]);
    };

    // Toggle buy/sell mode
    const toggleMode = () => {
        setShopMode?.(shopMode === 'buy' ? 'sell' : 'buy');
    };

    // Check if quantity is valid for current mode
    const canUseQuantity = (qty) => {
        if (shopMode === 'buy') {
            return visible.some(tier => canAfford?.(tier.id, qty));
        } else {
            return visible.some(tier => {
                const info = getGeneratorInfo?.(tier.id) || tier;
                return (info.owned || 0) >= qty;
            });
        }
    };

    return (
        <div className="panel store-panel">
            {/* Mobile: Compact single-line header */}
            {isMobile ? (
                <div className="panel-header store-header store-header--compact">
                    <h2 className="panel-title">🧁 Market</h2>
                    <div className="store-compact-controls">
                        <button
                            className={`store-compact-btn ${shopMode === 'sell' ? 'store-compact-btn--sell' : ''}`}
                            onClick={toggleMode}
                        >
                            {shopMode === 'buy' ? 'Buy' : 'Sell'}
                        </button>
                        <button
                            className="store-compact-btn"
                            onClick={cycleQuantity}
                        >
                            ×{buyQuantity}
                        </button>
                    </div>
                </div>
            ) : (
                /* Desktop: Original two-row layout */
                <>
                    <div className="panel-header store-header">
                        <h2 className="panel-title">🧁 Market</h2>
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

                    {/* Quantity Selector (Desktop only) */}
                    <div className="quantity-selector">
                        {quantityOptions.map((qty) => {
                            const isAvailable = canUseQuantity(qty);
                            return (
                                <button
                                    key={qty}
                                    className={`quantity-btn ${buyQuantity === qty ? 'quantity-btn--active' : ''} ${!isAvailable ? 'quantity-btn--disabled' : ''}`}
                                    onClick={() => setBuyQuantity?.(qty)}
                                    disabled={!isAvailable}
                                >
                                    {qty}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}


            {/* Generator List */}
            <div className="shop-list">
                {/* Visible Tiers */}
                {visible.map((tier) => {
                    const info = getGeneratorInfo?.(tier.id) || tier;
                    const owned = info.owned || 0;

                    if (shopMode === 'buy') {
                        const affordable = canAfford?.(tier.id, buyQuantity) ?? false;
                        const displayCost = getBulkCost?.(tier.id, buyQuantity) || info.currentPrice || tier.baseCost;

                        return (
                            <Tooltip key={tier.id} content={
                                <>
                                    <div className="tooltip-rich-header">{tier.name}</div>
                                    <div className="tooltip-rich-body">{tier.description}</div>
                                    <div className="tooltip-rich-stats">
                                        <span className={affordable ? 'tooltip-stat-cost affordable' : 'tooltip-stat-cost expensive'}>
                                            🍰 {formatNumberWordCompact(displayCost)}
                                        </span>
                                        <span>Owned: {owned}</span>
                                    </div>
                                    {tier.baseCps > 0 && (
                                        <div style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--ink-secondary)' }}>
                                            Total: {formatNumberWordCompact(tier.baseCps * owned)} CpS
                                        </div>
                                    )}
                                </>
                            }>
                                <button
                                    className={`shop-item ${!affordable ? 'shop-item--disabled' : ''}`}
                                    onClick={() => {
                                        // Make atomic bulk purchase
                                        onPurchase?.(tier.id, buyQuantity);
                                    }}
                                    disabled={!affordable}
                                // Removed native title to allow Tooltip
                                >
                                    <GeneratorIcon tier={tier.tierIndex + 1} id={tier.id} />
                                    <div className="shop-item__info">
                                        <div className="shop-item__name">{tier.name}</div>
                                        <div className="shop-item__cost">
                                            {formatNumberWordCompact(displayCost)}
                                        </div>
                                    </div>
                                    <div className="shop-item__owned">{owned}</div>
                                </button>
                            </Tooltip>
                        );
                    } else {
                        // Sell mode
                        const sellPrice = getSellPrice?.(tier.baseCost, owned) || 0;
                        const canSell = owned > 0;

                        return (
                            <button
                                key={tier.id}
                                className={`shop-item shop-item--sell ${!canSell ? 'shop-item--disabled' : ''}`}
                                onClick={() => canSell && onSell?.(tier.id, buyQuantity)}
                                disabled={!canSell}
                                title={`Sell for ${formatNumber(sellPrice)} cakes`}
                            >
                                <GeneratorIcon tier={tier.tierIndex + 1} id={tier.id} />
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
                            <div className="shop-item__cost">🍰 {(mystery.baseCost).toLocaleString()}</div>
                        </div>
                        <div className="shop-item__owned">0</div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default StorePanel;

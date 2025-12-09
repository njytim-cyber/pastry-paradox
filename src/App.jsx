/**
 * App.jsx - Main Game Composition
 * Assembles all feature containers and views
 */
import React from 'react';
import balanceData from '@data/balance.json';

// Feature Containers
import { useCakeLogic } from '@features/cake/logic/useCakeLogic';
import { useUpgradeSystem } from '@features/upgrades/logic/useUpgradeSystem';
import { useEventSpawner } from '@features/events/logic/useEventSpawner';

// Feature Views
import { MainCake } from '@features/cake/ui/MainCake';
import { StorePanel } from '@features/shop/ui/StorePanel';
import { UpgradeGrid } from '@features/upgrades/ui/UpgradeGrid';
import { GoldenFloater, MultiplierIndicator } from '@features/events/ui/GoldenFloater';

const { globalConfig } = balanceData;

function App() {
    // Initialize core game logic
    const cakeLogic = useCakeLogic();

    // Initialize upgrade system (connected to cake logic)
    const upgradeSystem = useUpgradeSystem({
        totalBaked: cakeLogic.totalBaked,
        setCpsMultiplier: cakeLogic.setCpsMultiplier,
    });

    // Initialize event system (connected to multiplier)
    const eventSystem = useEventSpawner({
        setGlobalMultiplier: cakeLogic.setGlobalMultiplier,
    });

    // Handle upgrade purchase (needs balance access)
    const handleUpgradePurchase = (upgradeId) => {
        upgradeSystem.purchaseUpgrade(
            upgradeId,
            cakeLogic.balance,
            (updater) => {
                // This is a bit of a workaround since we don't expose setBalance directly
                // In a real app, we'd use a proper state manager like Zustand
                cakeLogic.handleClick({ preventDefault: () => { } }); // Temporary hack
            }
        );
    };

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                    🎂 Pastry Paradox
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--ink-secondary)', fontSize: '0.9rem' }}>
                        The "67" Weighing Gesture
                    </span>
                    {/* Dev: Unlock golden croissant */}
                    {!eventSystem.isEventUnlocked && (
                        <button
                            className="btn"
                            onClick={eventSystem.unlockEvent}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                            🔓 Unlock Event (Dev)
                        </button>
                    )}
                </div>
            </header>

            {/* Main Game Area */}
            <main className="main-game">
                <MainCake
                    onCakeClick={cakeLogic.handleClick}
                    particles={cakeLogic.particles}
                    balance={cakeLogic.balance}
                    cps={cakeLogic.cps}
                    currencyName={globalConfig.currencyName}
                />
            </main>

            {/* Sidebar: Shop & Upgrades */}
            <aside className="sidebar">
                <UpgradeGrid
                    upgrades={upgradeSystem.upgradeList}
                    balance={cakeLogic.balance}
                    canPurchase={upgradeSystem.canPurchaseUpgrade}
                    onPurchase={handleUpgradePurchase}
                />

                <StorePanel
                    generators={cakeLogic.productionTiers}
                    getGeneratorInfo={cakeLogic.getGeneratorInfo}
                    canAfford={cakeLogic.canAfford}
                    onPurchase={cakeLogic.purchaseGenerator}
                />
            </aside>

            {/* Golden Croissant Event */}
            <GoldenFloater
                isActive={eventSystem.isEventActive}
                position={eventSystem.eventPosition}
                onClick={eventSystem.clickEvent}
            />

            {/* Multiplier Indicator */}
            <MultiplierIndicator
                multiplier={eventSystem.multiplier}
                timeRemaining={eventSystem.timeRemaining}
                isActive={cakeLogic.globalMultiplier > 1}
            />
        </div>
    );
}

export default App;

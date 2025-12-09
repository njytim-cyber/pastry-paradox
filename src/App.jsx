/**
 * App.jsx - Main Game Composition (3-Pane Layout)
 * Assembles all feature containers and views
 */
import React, { useCallback } from 'react';
import balanceData from '@data/balance.json';

// Feature Containers
import { useCakeLogic } from '@features/cake/logic/useCakeLogic';
import { useUpgradeSystem } from '@features/upgrades/logic/useUpgradeSystem';
import { useEventSpawner } from '@features/events/logic/useEventSpawner';
import { useGameState } from '@features/game/logic/useGameState';

// Feature Views
import { MainCake } from '@features/cake/ui/MainCake';
import { StorePanel } from '@features/shop/ui/StorePanel';
import { UpgradeGrid } from '@features/upgrades/ui/UpgradeGrid';
import { GoldenFloater, MultiplierIndicator } from '@features/events/ui/GoldenFloater';
import { StatsPanel } from '@features/stats/ui/StatsPanel';
import { BakeryHeader } from '@features/bakery/ui/BakeryHeader';
import { FlavorText } from '@features/flavor/ui/FlavorText';
import { useAchievementSystem } from '@features/achievements/logic/useAchievementSystem';
import { AchievementPopup } from '@features/achievements/ui/AchievementPopup';

const { globalConfig } = balanceData;

function App() {
    // Initialize game state (prestige, stats, shop mode)
    const gameState = useGameState();

    // Initialize core game logic with stats sync
    const cakeLogic = useCakeLogic({
        onTick: (amount) => gameState.recordBaked(amount)
    });

    // Initialize upgrade system (connected to cake logic)
    const upgradeSystem = useUpgradeSystem({
        totalBaked: gameState.stats.totalBaked,
        setCpsMultiplier: cakeLogic.setCpsMultiplier,
    });

    // Initialize event system (connected to multiplier)
    const eventSystem = useEventSpawner({
        setGlobalMultiplier: cakeLogic.setGlobalMultiplier,
    });

    // Initialize Achievement System
    const achievementSystem = useAchievementSystem({
        totalBaked: gameState.stats.totalBaked,
        totalClicks: gameState.stats.totalClicks,
        generators: cakeLogic.productionTiers
    });

    // Enhanced click handler with stats tracking
    const handleCakeClick = useCallback((event) => {
        const earned = cakeLogic.handleClick(event);
        gameState.recordClick();
        gameState.recordBaked(earned || 1);
    }, [cakeLogic, gameState]);

    // Handle generator purchase with stats tracking
    const handlePurchase = useCallback((tierId) => {
        const info = cakeLogic.getGeneratorInfo(tierId);
        if (info && cakeLogic.purchaseGenerator(tierId)) {
            gameState.recordSpent(info.currentPrice);
        }
    }, [cakeLogic, gameState]);

    // Handle generator sale
    const handleSell = useCallback((tierId) => {
        const tier = cakeLogic.productionTiers.find(t => t.id === tierId);
        const info = cakeLogic.getGeneratorInfo(tierId);
        if (!tier || !info || info.owned <= 0) return;

        const sellPrice = gameState.getSellPrice(tier.baseCost, info.owned);
        // Add sell price to balance (we need to expose a way to add balance)
        // For now, simulate by clicking equivalent times
        // TODO: Add proper setBalance to useCakeLogic
    }, [cakeLogic, gameState]);

    // Handle prestige
    const handlePrestige = useCallback(() => {
        gameState.performPrestige(gameState.stats.totalBaked, () => {
            // Reset game state - would need to expose reset in useCakeLogic
            // For now, just do the prestige tracking
        });
    }, [gameState]);

    // Apply legacy multiplier to CpS
    const effectiveCps = cakeLogic.cps * gameState.legacyMultiplier;

    return (
        <div className="app-container">
            {/* Top Flavor Text Banner */}
            <div className="flavor-banner">
                <FlavorText
                    cps={effectiveCps}
                    totalBaked={gameState.stats.totalBaked}
                    isGoldenActive={cakeLogic.globalMultiplier > 1}
                    has67Pattern={upgradeSystem.has67Pattern}
                />
            </div>

            {/* Left Pane: Cake Click Zone */}
            <div className="pane-left">
                <BakeryHeader
                    bakeryName={gameState.bakeryName}
                    onNameChange={gameState.setBakeryName}
                    balance={cakeLogic.balance}
                    cps={effectiveCps}
                    currencyName={globalConfig.currencyName}
                />

                <MainCake
                    onCakeClick={handleCakeClick}
                    particles={cakeLogic.particles}
                    balance={cakeLogic.balance}
                    cps={effectiveCps}
                    currencyName={globalConfig.currencyName}
                />
            </div>

            {/* Center Pane: Stats & Upgrades */}
            <div className="pane-center">
                <UpgradeGrid
                    upgrades={upgradeSystem.upgradeList}
                    balance={cakeLogic.balance}
                    canPurchase={upgradeSystem.canPurchaseUpgrade}
                    onPurchase={(upgradeId) => {
                        // Simple upgrade purchase
                        upgradeSystem.purchaseUpgrade(upgradeId, cakeLogic.balance, () => { });
                    }}
                />

                <StatsPanel
                    stats={gameState.stats}
                    cps={effectiveCps}
                    legacyPoints={gameState.legacyPoints}
                    legacyMultiplier={gameState.legacyMultiplier}
                    potentialLegacyPoints={gameState.potentialLegacyPoints}
                    canPrestige={gameState.canPrestige}
                    onPrestige={handlePrestige}
                    achievements={achievementSystem.allAchievements}
                    unlockedIds={achievementSystem.unlockedIds}
                />

                {/* Dev: Unlock golden croissant for testing */}
                {!eventSystem.isEventUnlocked && (
                    <button
                        className="btn"
                        onClick={eventSystem.unlockEvent}
                        style={{ marginTop: '1rem' }}
                    >
                        🔓 Unlock Golden Croissant (Dev)
                    </button>
                )}
            </div>

            {/* Right Pane: Store */}
            <div className="pane-right">
                <StorePanel
                    generators={cakeLogic.productionTiers}
                    getGeneratorInfo={cakeLogic.getGeneratorInfo}
                    canAfford={cakeLogic.canAfford}
                    onPurchase={handlePurchase}
                    onSell={handleSell}
                    shopMode={gameState.shopMode}
                    setShopMode={gameState.setShopMode}
                    buyQuantity={gameState.buyQuantity}
                    setBuyQuantity={gameState.setBuyQuantity}
                    getSellPrice={gameState.getSellPrice}
                />
            </div>

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

            {/* Achievement Toast */}
            <AchievementPopup
                queue={achievementSystem.newUnlockQueue}
                onDismiss={achievementSystem.popNotification}
            />
        </div>
    );
}

export default App;

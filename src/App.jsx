/**
 * App.jsx - Main Game Composition (3-Pane Layout + Mobile Responsive)
 * Assembles all feature containers and views with mobile tab navigation
 */
import React, { useCallback } from 'react';
import balanceData from '@data/balance.json';

// Responsive Utilities
import { useIsMobile } from '@hooks/useMediaQuery';
import { useMobileNav } from '@hooks/useMobileNav';

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
import { MobileTabBar } from '@features/navigation/ui/MobileTabBar';
import { useAchievementSystem } from '@features/achievements/logic/useAchievementSystem';
import { AchievementPopup } from '@features/achievements/ui/AchievementPopup';
import { useVersionSplash } from '@features/splash/logic/useVersionSplash';
import { VersionSplash } from '@features/splash/ui/VersionSplash';
import packageJson from '../package.json';

const { globalConfig } = balanceData;

function App() {
    // Responsive & Mobile Navigation
    const isMobile = useIsMobile();
    const mobileNav = useMobileNav({
        initialTab: 'bakery',
        enableSwipe: true,
        persist: true
    });

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

    // Initialize Version Splash
    const versionSplash = useVersionSplash(packageJson.version);

    // Enhanced click handler with stats tracking
    const handleCakeClick = useCallback((event) => {
        const earned = cakeLogic.handleClick(event);
        gameState.recordClick();
        gameState.recordBaked(earned || 1);
    }, [cakeLogic, gameState]);

    // Handle generator purchase with stats tracking
    const handlePurchase = useCallback((tierId, quantity = 1) => {
        const info = cakeLogic.getGeneratorInfo(tierId);
        if (info && cakeLogic.purchaseGenerator(tierId, quantity)) {
            // Calculate total cost for stats tracking
            let totalCost = 0;
            for (let i = 0; i < quantity; i++) {
                totalCost += info.currentPrice * Math.pow(1.15, i);
            }
            gameState.recordSpent(totalCost);
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

    // Render bakery pane (shared between mobile/desktop)
    const renderBakeryPane = () => (
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
    );

    // Render stats pane (shared between mobile/desktop)
    const renderStatsPane = () => (
        <div className="pane-center">
            <UpgradeGrid
                upgrades={upgradeSystem.upgradeList}
                balance={cakeLogic.balance}
                canPurchase={upgradeSystem.canPurchaseUpgrade}
                onPurchase={(upgradeId) => {
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
                upgrades={upgradeSystem.upgradeList}
            />
        </div>
    );

    // Render store pane (shared between mobile/desktop)
    const renderStorePane = () => (
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
    );

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

            {/* Mobile Tabbed Layout */}
            {isMobile ? (
                <>
                    <div className="mobile-content" {...mobileNav.swipeHandlers}>
                        <div className={mobileNav.activeTab === 'bakery' ? 'active' : ''}>
                            {renderBakeryPane()}
                        </div>
                        <div className={mobileNav.activeTab === 'stats' ? 'active' : ''}>
                            {renderStatsPane()}
                        </div>
                        <div className={mobileNav.activeTab === 'store' ? 'active' : ''}>
                            {renderStorePane()}
                        </div>
                    </div>
                    <MobileTabBar
                        activeTab={mobileNav.activeTab}
                        onTabChange={mobileNav.setActiveTab}
                    />
                </>
            ) : (
                /* Desktop 3-Pane Layout */
                <>
                    {renderBakeryPane()}
                    {renderStatsPane()}
                    {renderStorePane()}
                </>
            )}

            {/* Global Overlays (Both Mobile & Desktop) */}
            <GoldenFloater
                isActive={eventSystem.isEventActive}
                position={eventSystem.eventPosition}
                onClick={eventSystem.clickEvent}
            />
            <MultiplierIndicator
                multiplier={eventSystem.multiplier}
                timeRemaining={eventSystem.timeRemaining}
                isActive={cakeLogic.globalMultiplier > 1}
            />
            <AchievementPopup
                queue={achievementSystem.newUnlockQueue}
                onDismiss={achievementSystem.popNotification}
            />
            <VersionSplash
                version={packageJson.version}
                features={[
                    '📱 NEW: Mobile-first responsive design with tab navigation!',
                    '👆 Swipe left/right to switch between tabs on mobile',
                    '🎯 Optimized touch targets for better mobile UX',
                    '🎨 Smoother balance counter - updates only 4 times per second',
                    '📝 Improved flavor text timing - shows for 10s, then hides for 3 min',
                    '🛒 Buy in bulk with ×67 and ×6767 quantity buttons',
                    '🚫 Quantity buttons auto-disable when unaffordable',
                    '🏆 Achievement popups now auto-dismiss after 3 seconds'
                ]}
                isVisible={versionSplash.isVisible}
                onClose={versionSplash.onClose}
            />
        </div>
    );
}

export default App;

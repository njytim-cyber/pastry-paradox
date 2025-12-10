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
import { useEventStore } from '@features/events/logic/useEventStore';
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
import { AudioController } from '@features/audio/ui/AudioController';
import packageJson from '../package.json';

const { globalConfig } = balanceData;

// Helper: Determine if a color is light (needs dark text)
const isLightColor = (hexColor) => {
    if (!hexColor) return false;
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Luminance formula (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.65; // Threshold for "light" color
};

function App() {
    // Responsive & Mobile Navigation
    const isMobile = useIsMobile();
    const mobileNav = useMobileNav({
        initialTab: 'store',
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

    // Notification State for Events
    const [currentBuffInfo, setCurrentBuffInfo] = React.useState(null);
    const [instantNotification, setInstantNotification] = React.useState(null);
    const [showBuffNotification, setShowBuffNotification] = React.useState(false);

    // Initialize event system (connected to multipliers)
    const eventSystem = useEventSpawner({
        onEventClick: (macaron) => {
            const { type, value, duration } = macaron.buff;

            if (type === 'production_multiplier' || type === 'click_multiplier' || type === 'global_multiplier' || type === 'discount') {
                cakeLogic.applyBuff(type, value, duration);
                setCurrentBuffInfo(macaron);
                setShowBuffNotification(true);
                setTimeout(() => setShowBuffNotification(false), 2000);
            } else if (type === 'instant_production') {
                cakeLogic.grantResources(value);
                setInstantNotification({ name: macaron.name, desc: macaron.description, color: macaron.color, filling: macaron.filling });
                setTimeout(() => setInstantNotification(null), 2000);
            } else if (type === 'time_warp') {
                cakeLogic.grantResources(value);
                setInstantNotification({ name: macaron.name, desc: macaron.description, color: macaron.color, filling: macaron.filling });
                setTimeout(() => setInstantNotification(null), 2000);
            }
        }
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
            // Approximation for stats since exact calculation is complex with bulk
            // and we care mostly about "lots of money spent"
            totalCost = info.currentPrice * quantity;
            gameState.recordSpent(totalCost);
        }
    }, [cakeLogic, gameState]);

    // Handle generator sale
    const handleSell = useCallback((tierId, quantity = 1) => {
        cakeLogic.sellGenerator(tierId, quantity);
    }, [cakeLogic]);

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
            <div style={{ maxHeight: '50%', overflowY: 'auto', flexShrink: 0 }}>
                <UpgradeGrid
                    upgrades={upgradeSystem.upgradeList}
                    balance={cakeLogic.balance}
                    canPurchase={upgradeSystem.canPurchaseUpgrade}
                    onPurchase={(upgradeId) => {
                        upgradeSystem.purchaseUpgrade(upgradeId, cakeLogic.balance, () => { });
                    }}
                />
            </div>
            <StatsPanel
                stats={gameState.stats}
                cps={effectiveCps}
                legacyPoints={gameState.darkMatter}
                legacyMultiplier={gameState.legacyMultiplier}
                potentialLegacyPoints={gameState.potentialDarkMatter}
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

    // Calculate active multiplier for UI
    const activeMultiplier = cakeLogic.modifiers.global * cakeLogic.modifiers.production;
    const isBuffActive = activeMultiplier > 1 || cakeLogic.modifiers.click > 1 || cakeLogic.modifiers.costScale < 1;

    // Helper to clear buff label when buff expires
    React.useEffect(() => {
        if (!isBuffActive) {
            setCurrentBuffInfo(null);
        }
    }, [isBuffActive]);

    return (
        <div className="app-container">
            {/* Top Flavor Text Banner with Theme Toggles */}
            <div className="flavor-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FlavorText
                    cps={effectiveCps}
                    totalBaked={gameState.stats.totalBaked}
                    isGoldenActive={isBuffActive}
                    has67Pattern={upgradeSystem.has67Pattern}
                />

                {/* Theme Toggle Icons */}
                <div style={{ display: 'flex', gap: '8px', marginRight: '12px' }}>
                    {/* Seasonal Theme Toggle (Calendar-aware) */}
                    <button
                        id="theme-toggle-seasonal"
                        onClick={() => {
                            // Determine seasonal event ID based on current month
                            const month = new Date().getMonth();
                            let seasonalEventId = 'event_christmas_2025'; // Dec-Jan default
                            if (month >= 9 && month <= 10) seasonalEventId = 'event_halloween_2025'; // Oct-Nov (placeholder)
                            // Toggle: if already active, deactivate; else activate
                            const current = useEventStore.getState().config?.eventId;
                            if (current === seasonalEventId) {
                                useEventStore.setState({ isActive: false, config: null });
                            } else {
                                useEventStore.getState().initEvent(seasonalEventId);
                            }
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                            transition: 'transform 0.2s'
                        }}
                        title="Toggle Seasonal Theme"
                        aria-label="Toggle seasonal theme"
                    >
                        {/* Calendar-aware icon: Christmas Dec-Jan, Halloween Oct-Nov, etc. */}
                        {(() => {
                            const month = new Date().getMonth();
                            if (month === 11 || month === 0) return '🎄'; // Dec-Jan
                            if (month >= 9 && month <= 10) return '🎃'; // Oct-Nov
                            if (month >= 1 && month <= 2) return '💘'; // Feb-Mar (Valentine)
                            if (month >= 3 && month <= 4) return '🐰'; // Apr-May (Easter)
                            return '🌞'; // Default summer
                        })()}
                    </button>

                    {/* Brain Rot Toggle (67) */}
                    <button
                        id="theme-toggle-brainrot"
                        onClick={() => {
                            const current = useEventStore.getState().config?.eventId;
                            if (current === 'event_brain_rot_v1') {
                                useEventStore.setState({ isActive: false, config: null });
                            } else {
                                useEventStore.getState().initEvent('event_brain_rot_v1');
                            }
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #ff00ff, #00ff00)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: '#000',
                            cursor: 'pointer',
                            fontFamily: "'Comic Sans MS', cursive",
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                            transition: 'transform 0.2s'
                        }}
                        title="Toggle Brain Rot Mode"
                        aria-label="Toggle brain rot theme"
                    >
                        🫶
                    </button>
                </div>
            </div>

            {/* Mobile Split Viewport Layout */}
            {isMobile ? (
                <>
                    <div className="mobile-content">
                        {/* Fixed Clicker Zone (always visible - 35%) */}
                        <div className="clicker-zone">
                            {renderBakeryPane()}
                        </div>

                        {/* Scrollable Management Zone (65%) - tabbed content */}
                        <div className="management-zone" {...mobileNav.swipeHandlers}>
                            {mobileNav.activeTab === 'stats' && renderStatsPane()}
                            {mobileNav.activeTab === 'store' && renderStorePane()}
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
                type={eventSystem.activeEvent}
            />

            {/* Instant Event Notification */}
            {
                instantNotification && (
                    <div
                        className="multiplier-active"
                        role="status"
                        aria-live="polite"
                        style={{
                            flexDirection: 'column',
                            gap: '4px',
                            background: `linear-gradient(135deg, ${instantNotification.color}, ${instantNotification.filling})`,
                            color: isLightColor(instantNotification.color) ? '#333333' : '#FFFFFF',
                            textShadow: isLightColor(instantNotification.color) ? '0 1px 2px rgba(255,255,255,0.5)' : '0 2px 4px rgba(0,0,0,0.8)',
                            border: '2px solid rgba(255,255,255,0.8)'
                        }}
                    >
                        <div style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{instantNotification.name}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'normal', opacity: 1 }}>{instantNotification.desc}</div>
                    </div>
                )
            }

            {/* Persistent Buff Indicator (shows for 2s after activation) */}
            {
                !instantNotification && showBuffNotification && currentBuffInfo && (
                    <div
                        className="multiplier-active"
                        role="status"
                        aria-live="polite"
                        style={{
                            flexDirection: 'column',
                            gap: '4px',
                            background: currentBuffInfo
                                ? `linear-gradient(135deg, ${currentBuffInfo.color}, ${currentBuffInfo.filling})`
                                : undefined,
                            color: currentBuffInfo
                                ? (isLightColor(currentBuffInfo.color) ? '#333333' : '#FFFFFF')
                                : undefined,
                            textShadow: currentBuffInfo
                                ? (isLightColor(currentBuffInfo.color) ? '0 1px 2px rgba(255,255,255,0.5)' : '0 2px 4px rgba(0,0,0,0.8)')
                                : undefined,
                            border: currentBuffInfo ? '2px solid rgba(255,255,255,0.8)' : undefined
                        }}
                    >
                        {currentBuffInfo && (
                            <div style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                                {currentBuffInfo.name}
                            </div>
                        )}
                        <div style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>
                            ✨ {currentBuffInfo?.description || 'BONUS ACTIVE!'}
                        </div>
                    </div>
                )
            }

            {/* Audio Engine Disabled for v1.4.0 (Pending Assets) */}
            {/* <AudioController cakesPerSecond={effectiveCps} /> */}
            <AchievementPopup
                queue={achievementSystem.newUnlockQueue}
                onDismiss={achievementSystem.popNotification}
            />
            <VersionSplash
                version={packageJson.version}
                features={[
                    '🥐 NEW: "Your Patisserie" rebranding!',
                    '🍪 NEW: 10 Types of Golden Macarons with unique buffs!',
                    '📱 NEW: Streamlined specific-stats panel (No scrolling!)',
                    '👆 Swipe left/right to switch between tabs on mobile',
                    '🛒 Buy in bulk with ×67 and ×6767 quantity buttons',
                    '🏆 Achievement popups now auto-dismiss after 3 seconds'
                ]}
                isVisible={versionSplash.isVisible}
                onClose={versionSplash.onClose}
            />
        </div >
    );
}

export default App;

# Component Glossary

> Auto-generated on 2025-12-09T23:02:00Z

## UI Components (Views)

| Component | Path | Key Props |
|-----------|------|-----------|
| **App** | `src/App.jsx` | Root compositor, 3-pane desktop + mobile tab layout |
| **MainCake** | `src/features/cake/ui/MainCake.jsx` | `onCakeClick`, `particles`, `balance`, `cps` |
| **BakeryHeader** | `src/features/bakery/ui/BakeryHeader.jsx` | `balance`, `cps`, `currencyName` |
| **StorePanel** | `src/features/shop/ui/StorePanel.jsx` | `productionTiers`, `generators`, `onPurchase`, `onSell` |
| **StatsPanel** | `src/features/stats/ui/StatsPanel.jsx` | `stats`, `generators`, `productionTiers` |
| **UpgradeGrid** | `src/features/upgrades/ui/UpgradeGrid.jsx` | `upgrades`, `onPurchase`, `canAfford` |
| **FlavorText** | `src/features/flavor/ui/FlavorText.jsx` | `cps`, `totalBaked`, `isGoldenActive` |
| **GoldenFloater** | `src/features/events/ui/GoldenFloater.jsx` | `event`, `onClick` |
| **MobileTabBar** | `src/features/navigation/ui/MobileTabBar.jsx` | `activeTab`, `onTabChange` |
| **AchievementPopup** | `src/features/achievements/ui/AchievementPopup.jsx` | `achievement`, `onClose` |
| **VersionSplash** | `src/features/splash/ui/VersionSplash.jsx` | `version`, `onDismiss` |
| **AudioController** | `src/features/audio/ui/AudioController.jsx` | Audio playback controls |
| **Tooltip** | `src/features/shared/ui/Tooltip.jsx` | `content`, `children`, `position` |

## Logic Containers (Hooks)

| Hook | Path | Purpose |
|------|------|---------|
| **useCakeLogic** | `src/features/cake/logic/useCakeLogic.js` | Core click handling, balance, CPS, generators |
| **useUpgradeSystem** | `src/features/upgrades/logic/useUpgradeSystem.js` | Upgrade purchasing, "67" pattern detection |
| **useEventSpawner** | `src/features/events/logic/useEventSpawner.js` | Macaron event spawning and click handling |
| **useGameState** | `src/features/game/logic/useGameState.js` | Prestige, stats, shop mode persistence |
| **useAchievementSystem** | `src/features/achievements/logic/useAchievementSystem.js` | Achievement tracking and popup triggers |
| **useAudioSystem** | `src/features/audio/logic/useAudioSystem.js` | Sound effects and music playback |
| **useVersionSplash** | `src/features/splash/logic/useVersionSplash.js` | Version detection and splash display |
| **useMediaQuery** | `src/hooks/useMediaQuery.js` | Responsive breakpoint detection |
| **useMobileNav** | `src/hooks/useMobileNav.js` | Mobile tab navigation with swipe gestures |

## Utility Modules

| Module | Path | Purpose |
|--------|------|---------|
| **format.js** | `src/features/cake/logic/format.js` | Number formatting utilities |
| **macaronConstants.js** | `src/features/events/logic/macaronConstants.js` | Macaron type definitions |

## Data Files

| File | Path | Purpose |
|------|------|---------|
| **balance.json** | `src/data/balance.json` | Game balance config (costs, CPS, multipliers) |
| **asset-manifest.json** | `src/assets/asset-manifest.json` | Generated asset registry |

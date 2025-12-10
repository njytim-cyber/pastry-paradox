# Component Glossary

> Auto-generated on 2025-12-10T16:39:00Z

## UI Components

| Component | Path | Description |
|-----------|------|-------------|
| **App** | `src/App.jsx` | Main game composition, 3-pane layout |
| **MainCake** | `src/features/cake/ui/MainCake.jsx` | Clickable cake with Christmas Yule Log variant |
| **StorePanel** | `src/features/shop/ui/StorePanel.jsx` | Building purchase interface |
| **UpgradeGrid** | `src/features/upgrades/ui/UpgradeGrid.jsx` | Upgrade display and purchase |
| **StatsPanel** | `src/features/stats/ui/StatsPanel.jsx` | Production/session/legacy stats |
| **BakeryHeader** | `src/features/bakery/ui/BakeryHeader.jsx` | Bakery name and balance display |
| **DarkMatterTree** | `src/features/prestige/ui/DarkMatterTree.jsx` | Prestige upgrade tree (pan/zoom) |
| **FlavorText** | `src/features/flavor/ui/FlavorText.jsx` | Random quotes with event overrides |
| **GoldenFloater** | `src/features/events/ui/GoldenFloater.jsx` | Golden macaron spawner |
| **AchievementPopup** | `src/features/achievements/ui/AchievementPopup.jsx` | Achievement notification |
| **VersionSplash** | `src/features/splash/ui/VersionSplash.jsx` | Version changelog modal |
| **AudioController** | `src/features/audio/ui/AudioController.jsx` | Music layer controller |
| **MobileTabBar** | `src/features/navigation/ui/MobileTabBar.jsx` | Mobile navigation tabs |
| **Tooltip** | `src/features/shared/ui/Tooltip.jsx` | Shared tooltip component |
| **EventOverlay** | `src/features/events/ui/EventOverlay.jsx` | Event CSS variable injector |
| **BigCrunchButton** | `src/features/bakery/ui/BigCrunchButton.jsx` | Prestige trigger button |

## Logic Hooks

| Hook | Path | Description |
|------|------|-------------|
| **useCakeLogic** | `src/features/cake/logic/useCakeLogic.js` | Core game math, generators, CPS |
| **useUpgradeSystem** | `src/features/upgrades/logic/useUpgradeSystem.js` | Upgrade state and purchases |
| **useGameState** | `src/features/game/logic/useGameState.js` | Prestige, stats, shop mode |
| **useEventSpawner** | `src/features/events/logic/useEventSpawner.js` | Golden macaron spawning |
| **useEventStore** | `src/features/events/logic/useEventStore.js` | Event/theme state (Zustand) |
| **useAchievementSystem** | `src/features/achievements/logic/useAchievementSystem.js` | Achievement tracking |
| **useAudioSystem** | `src/features/audio/logic/useAudioSystem.js` | Music layer transitions |
| **useVersionSplash** | `src/features/splash/logic/useVersionSplash.js` | Version modal visibility |

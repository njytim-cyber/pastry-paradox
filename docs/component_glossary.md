# Component Glossary

> Auto-generated on 2025-12-10T19:23:00Z

## UI Components

- **App** - `src/App.jsx` - Main game composition with 3-pane layout and mobile responsive
- **MainCake** - `src/features/cake/ui/MainCake.jsx` - Clickable cake with animation effects
- **StorePanel** - `src/features/shop/ui/StorePanel.jsx` - Building/generator purchase panel
- **UpgradeGrid** - `src/features/upgrades/ui/UpgradeGrid.jsx` - Secret Ingredients upgrade display
- **StatsPanel** - `src/features/stats/ui/StatsPanel.jsx` - Statistics and prestige panel
- **BakeryHeader** - `src/features/bakery/ui/BakeryHeader.jsx` - Balance display with flavor text
- **FlavorText** - `src/features/flavor/ui/FlavorText.jsx` - Context-aware funny messages
- **GoldenFloater** - `src/features/events/ui/GoldenFloater.jsx` - Golden croissant spawn
- **AchievementPopup** - `src/features/achievements/ui/AchievementPopup.jsx` - Achievement notifications
- **VersionSplash** - `src/features/splash/ui/VersionSplash.jsx` - Version changelog modal
- **DarkMatterTree** - `src/features/prestige/ui/DarkMatterTree.jsx` - Prestige skill tree with pan/zoom
- **MobileTabBar** - `src/features/navigation/ui/MobileTabBar.jsx` - Mobile tab navigation
- **AudioController** - `src/features/audio/ui/AudioController.jsx` - Audio settings UI
- **Tooltip** - `src/features/shared/ui/Tooltip.jsx` - Reusable tooltip component
- **BigCrunchButton** - `src/features/bakery/ui/BigCrunchButton.jsx` - Prestige trigger button
- **BigCrunchImplosion** - `src/features/bakery/ui/BigCrunchImplosion.jsx` - Prestige animation

## Event Components

- **EventOverlay** - `src/features/events/ui/EventOverlay.jsx` - Event wrapper with theme application
- **BrainRotComponents** - `src/features/events/ui/BrainRotComponents.jsx` - Brain Rot theme UI (DoomScrollBar)

## Logic Hooks

- **useCakeLogic** - `src/features/cake/logic/useCakeLogic.js` - Core clicker economy
- **useUpgradeSystem** - `src/features/upgrades/logic/useUpgradeSystem.js` - Upgrade purchasing
- **useEventSpawner** - `src/features/events/logic/useEventSpawner.js` - Golden event spawning
- **useEventStore** - `src/features/events/logic/useEventStore.js` - Theme/event state (cosmetic only)
- **useGameState** - `src/features/game/logic/useGameState.js` - Game state persistence
- **useAchievementSystem** - `src/features/achievements/logic/useAchievementSystem.js` - Achievement tracking
- **useVersionSplash** - `src/features/splash/logic/useVersionSplash.js` - Version detection
- **useDarkMatter** - `src/features/prestige/logic/useDarkMatter.js` - Prestige currency
- **useAudioSystem** - `src/features/audio/logic/useAudioSystem.js` - Audio management

## Utility Hooks

- **useIsMobile** - `src/hooks/useMediaQuery.js` - Responsive breakpoint detection
- **useMobileNav** - `src/hooks/useMobileNav.js` - Mobile tab state management

## Data

- **balance.json** - `src/data/balance.json` - All game balance constants
- **events.json** - `src/data/events.json` - Event/theme configurations
- **event_config_schema.js** - `src/data/event_config_schema.js` - Event schema validation
- **macaronConstants.js** - `src/features/events/logic/macaronConstants.js` - Event constants

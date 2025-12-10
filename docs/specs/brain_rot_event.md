
# Project: Brain Rot Event - Master Implementation Plan

**Version:** 1.0
**Objective:** Implement a temporary, high-engagement "Brain Rot" event layer that sits on top of the existing game engine without permanently altering core game logic.

## Summary of the "Super Detailed" Plan

This implementation separates the event into Content (JSON), Logic (Hooks/State), and View (Components).

**Configuration (event_config_schema.ts):** Defined a strict TypeScript schema for the event data. This allows you to add future events (e.g., "Christmas", "Halloween") by just swapping the JSON file.

**State Management (event_hook_system.ts):** Created a Zustand store `useEventStore` that handles the specific math of the event (the Doom Scroll decay). It also exports a `useBuildingData` hook that your existing UI components can use to automatically "reskin" themselves without you rewriting the component HTML.

**UI Components (BrainRotComponents.tsx):**
*   **DoomScrollBar:** A self-contained widget handling the "scroll to survive" mechanic.
*   **BrainRotOverlay:** A wrapper that applies the global CSS variables and the "noise" overlay.

**Roadmap (implementation_roadmap.md):** Addresses the critical invisible parts: Asset loading strategies, Audio sprites (essential for performance with many sounds), and Save Data structure to prevent corruption.

**Immediate Next Step:** Copy the `event_config_schema.ts` into your project and try to fill out the BrainRotConfig object with your specific meme references. Then, wrap your building component text rendering with the `useBuildingData` hook.

---

## Part 1: Executive Roadmap & Asset Strategy

### 1.1 Asset Pipeline Strategy (Pre-Production)
**Objective:** Prevent bundle bloat and ensure high performance.
*   **Lazy Loading:** Do not import event assets in the main `index.js`. Fetch them only when `EventConfig.active` is true.
*   **Directory Structure:**
    *   `/public/assets/events/brain_rot/icons/` (Bitcrushed/Low-poly PNGs)
    *   `/public/assets/events/brain_rot/sfx/` (MP3s)
*   **Audio Optimization:** Create a single Audio Sprite (one large .mp3 file containing all meme sounds) to reduce HTTP requests.

### 1.2 Development Phase 1: Core Logic (Days 1-2)
*   **Install State Store:** Set up the `useEventStore` (Zustand).
*   **Modify Game Loop:** Inject `useEventStore.getState().tickEvent(dt)` into the main tick.
*   **Inject Multiplier:** Wrap the production calculation:
    ```javascript
    const finalProduction = baseProduction * prestigeMult * useEventProductionModifier();
    ```

### 1.3 Development Phase 2: UI Integration (Days 3-4)
*   **Global Wrapper:** Wrap `<App />` with `<BrainRotOverlay>`.
*   **Component Reskinning:** In `BuildingRow.tsx` and `UpgradeItem.tsx`, replace static prop access with the `useBuildingData` hook.
*   **Mechanic Implementation:** Add `<DoomScrollBar />` to the HUD.

### 1.4 Development Phase 3: Persistence (Day 5)
*   **Save Data Structure:**
    ```json
    {
      "save_version": 4,
      "events": {
        "brain_rot_2025": {
           "doom_scroll_level": 0.8,
           "total_rot_currency_earned": 50000
        }
      }
    }
    ```
*   **Sanity Check:** On load, if the event is inactive (server-side flag), ignore the events block but strictly preserve earned rewards.

---

## Part 2: Data Schema & Configuration

**File Reference:** `src/data/event_config_schema.ts`

```typescript
export type EventTriggerType = 'click' | 'purchase' | 'unlock' | 'tick';

export interface AudioCue {
  id: string;
  src: string;
  volume: number;
  pitchVar: number; // Random pitch variation (0.0 - 1.0)
  overlap: boolean; // Allow multiple instances to play simultaneously
}

export interface BuildingOverride {
  originalId: string; // Maps to existing building IDs (e.g., "b_grandma")
  newName: string;
  newDescription: string;
  newIconUrl: string; // SVG or GIF path
  productionModifier: number; // Visual multiplier
}

export interface UpgradeOverride {
  originalId: string;
  newName: string;
  effectDescription: string;
  triggerSoundId?: string;
}

export interface EventConfig {
  eventId: string; 
  active: boolean;
  theme: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    bgFilter: string; // CSS filter string
  };
  localization: {
    currencyName: string; // "Aura"
    currencyPerSec: string; // "Yapping/sec"
    resetBtnLabel: string; // "Lobotomy"
  };
  mechanics: {
    doomScrollDecayRate: number; // % lost per second
    doomScrollRecovery: number; // % gained per scroll pixel
  };
  overrides: {
    buildings: BuildingOverride[];
    upgrades: UpgradeOverride[];
  };
  audio: AudioCue[];
}

export const BrainRotConfig: EventConfig = {
  eventId: "event_brain_rot_v1",
  active: true,
  theme: {
    fontFamily: "'Comic Sans MS', 'Impact', fantasy",
    primaryColor: "#FF00FF",
    secondaryColor: "#00FF00",
    bgFilter: "contrast(140%) saturate(200%) hue-rotate(15deg)"
  },
  localization: {
    currencyName: "Dopamine Hits",
    currencyPerSec: "Rot/sec",
    resetBtnLabel: "LOBOTOMIZE (Prestige)"
  },
  mechanics: {
    doomScrollDecayRate: 0.05, // 5% decay per second
    doomScrollRecovery: 0.15   // 15% recovery per scroll unit
  },
  overrides: {
    buildings: [
      {
        originalId: "cursor",
        newName: "Auto-Tapper",
        newDescription: "Automated engagement farming script.",
        newIconUrl: "/assets/events/brain_rot/icons/cursor_glitch.gif",
        productionModifier: 1.0
      },
      {
        originalId: "grandma",
        newName: "Trad Wife Baker",
        newDescription: "Baking sourdough for TikTok clout.",
        newIconUrl: "/assets/events/brain_rot/icons/trad_wife.png",
        productionModifier: 1.2
      },
      {
        originalId: "farm",
        newName: "Content Farm",
        newDescription: "Generates 1000 AI videos per minute.",
        newIconUrl: "/assets/events/brain_rot/icons/server_rack.png",
        productionModifier: 1.5
      }
    ],
    upgrades: [
      {
        originalId: "u_plastic_mouse",
        newName: "RGB Gaming Mouse",
        effectDescription: "Clicking is 1% more efficient due to LEDs.",
        triggerSoundId: "sfx_keyboard_clack"
      }
    ]
  },
  audio: [
    { id: "sfx_vine_boom", src: "/assets/events/brain_rot/sfx/boom.mp3", volume: 1.0, pitchVar: 0.0, overlap: true },
    { id: "sfx_bruh", src: "/assets/events/brain_rot/sfx/bruh.wav", volume: 0.8, pitchVar: 0.2, overlap: true }
  ]
};
```

---

## Part 3: Logic & State Management

**File Reference:** `src/hooks/event_hook_system.ts`

```typescript
import { create } from 'zustand';
import { BrainRotConfig, EventConfig } from '../data/event_config_schema';

// --- STORE ---

interface EventState {
  isActive: boolean;
  doomScrollValue: number; // 0.0 to 1.0
  currentMultiplier: number;
  config: EventConfig | null;
  
  // Actions
  activateEvent: () => void;
  updateDoomScroll: (delta: number) => void;
  tickEvent: (deltaTimeSeconds: number) => void; // Called by game loop
}

export const useEventStore = create<EventState>((set, get) => ({
  isActive: false,
  doomScrollValue: 1.0, // Starts full
  currentMultiplier: 1.0,
  config: null,

  activateEvent: () => set({ isActive: true, config: BrainRotConfig }),

  updateDoomScroll: (scrollDelta) => {
    const { config, doomScrollValue } = get();
    if (!config) return;

    // ScrollDelta is abstract units.
    const recovery = scrollDelta * (config.mechanics.doomScrollRecovery / 100);
    
    set({ 
      doomScrollValue: Math.min(1.0, doomScrollValue + recovery) 
    });
  },

  tickEvent: (dt) => {
    const { isActive, config, doomScrollValue } = get();
    if (!isActive || !config) return;

    // 1. Apply Decay
    const decay = config.mechanics.doomScrollDecayRate * dt;
    const newValue = Math.max(0, doomScrollValue - decay);

    // 2. Calculate Global Multiplier
    // > 80% = 1.5x (Hype) | < 20% = 0.5x (Boredom) | 0% = 0x (Dead)
    let mult = 1.0;
    if (newValue > 0.8) mult = 1.5;
    else if (newValue < 0.2 && newValue > 0) mult = 0.5;
    else if (newValue === 0) mult = 0.0;

    set({ 
      doomScrollValue: newValue, 
      currentMultiplier: mult 
    });
  }
}));

// --- HOOKS ---

export const useBuildingData = (originalId: string, defaultData: any) => {
  const { isActive, config } = useEventStore();

  if (!isActive || !config) return defaultData;

  const override = config.overrides.buildings.find(b => b.originalId === originalId);
  
  if (override) {
    return {
      ...defaultData,
      name: override.newName,
      description: override.newDescription,
      icon: override.newIconUrl,
    };
  }
  return defaultData;
};

export const useEventProductionModifier = () => {
  const { isActive, currentMultiplier } = useEventStore();
  return isActive ? currentMultiplier : 1.0;
};
```

---

## Part 4: UI Components

**File Reference:** `src/components/BrainRotComponents.tsx`

```tsx
import React, { useRef } from 'react';
import { useEventStore } from '../hooks/event_hook_system';

// --- DOOM SCROLL COMPONENT ---
export const DoomScrollBar = () => {
  const { doomScrollValue, updateDoomScroll, isActive } = useEventStore();

  const handleScroll = () => {
    updateDoomScroll(20); 
  };

  if (!isActive) return null;

  const getColor = (val: number) => {
    if (val > 0.5) return `rgb(${255 * (1-val) * 2}, 255, 0)`; 
    return `rgb(255, ${255 * val * 2}, 0)`;
  };

  return (
    <div 
      className="fixed right-4 top-1/4 h-1/2 w-12 bg-gray-900 border-2 border-white rounded-lg overflow-hidden z-50 select-none"
      onWheel={handleScroll}
      onTouchMove={handleScroll} 
      style={{ boxShadow: '0 0 15px rgba(255,0,255,0.7)' }}
    >
      <div 
        className="absolute bottom-0 w-full transition-all duration-100 ease-linear"
        style={{ 
          height: `${doomScrollValue * 100}%`, 
          backgroundColor: getColor(doomScrollValue) 
        }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-bold text-black rotate-90 whitespace-nowrap">
          {doomScrollValue === 0 ? "DEAD 💀" : "DOOM METER"}
        </span>
      </div>
      
       <div 
        className="absolute inset-0 z-10"
        onClick={handleScroll}
      />
    </div>
  );
};

// --- GLOBAL OVERLAY COMPONENT ---
export const BrainRotOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isActive, config } = useEventStore();

  if (!isActive || !config) return <>{children}</>;

  const themeStyle = {
    '--event-font': config.theme.fontFamily,
    '--event-primary': config.theme.primaryColor,
    '--event-secondary': config.theme.secondaryColor,
  } as React.CSSProperties;

  return (
    <div 
      id="brain-rot-wrapper" 
      style={themeStyle}
      className="relative w-full h-full overflow-hidden"
    >
      <div 
        className="w-full h-full transition-all duration-500"
        style={{ filter: config.theme.bgFilter }}
      >
        {children}
      </div>

      <div className="pointer-events-none fixed inset-0 z-[9999] opacity-10 mix-blend-overlay bg-[url('/assets/events/brain_rot/noise.png')] animate-pulse" />
      
      <DoomScrollBar />
    </div>
  );
};
```

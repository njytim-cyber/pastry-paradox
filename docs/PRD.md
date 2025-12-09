# 📜 Product Requirement Document: Pastry Paradox (v1.0)

> Synthesized according to the **Senior Game Architect Protocol (v3.0)** and adheres to the **Strict Agentic Game Architecture**.

---

## 1. Executive Overview

**Pastry Paradox** is a premium "Idle Incremental" simulation game.

| Aspect | Description |
|--------|-------------|
| **Core Loop** | Player manually bakes cakes to earn currency, investing in automatic "generators" that scale from a humble kitchen to cosmic domination |
| **Visual Identity** | "Vintage Patisserie" - high-fidelity watercolor/ink aesthetic contrasting with increasingly sci-fi gameplay |
| **The Hook** | Utilizes the "67 Weighing Gesture" viral cultural reference as a central rhythmic and mathematical motif |

---

## 2. Architectural Constraints (Strict v3.0)

The execution agent must adhere to the **Senior Game Architect Protocol**.

### 2.1 The Container/View Pattern

The codebase must be strictly separated:

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Containers** | `src/features/*/logic` | ECS logic, State Management, Data Subscriptions. **NO UI rendering** |
| **Views** | `src/features/*/ui` | React 19 UI Composition, WebGPU/Canvas rendering. **NO game logic** |

> [!CAUTION]
> **Data-Driven Law**: Hardcoded numeric constants (costs, multipliers, spawn rates) are **FORBIDDEN** in source code. All values must be imported from `src/data/balance.json`.

---

## 3. Data Foundation (`src/data/balance.json`)

The game balance is externalized.

### 3.1 Global Config

| Key | Value | Description |
|-----|-------|-------------|
| `universalConstant` | `67` | The core mathematical seed |
| `currencyName` | `"Delicious Cakes"` | In-game currency |
| `fps` | `60` | Target frame rate |

### 3.2 Production Tiers (The Generators)

| Tier | ID | Base Cost | Description |
|------|----|-----------|-------------|
| 01 | `apprentice_baker` | 15 | "He creates cakes with the power of the 67 gesture." |
| 02 | `grandmas_secret_recipe` | 100 | A family tradition |
| 03 | `convection_oven` | 1,100 | Even heat distribution |
| 04 | `professional_mixer` | 12,000 | Industrial mixing |
| 05 | `local_bakery_franchise` | 130,000 | Neighborhood expansion |
| 06 | `cake_factory` | 1.4M | Assembly lines |
| 07 | `industrial_frosting_hose` | 20M | Gallons per second |
| 08 | `3d_cake_printer` | 330M | Layer-by-layer printing |
| 09 | `robotic_pastry_chef` | 5.1B | AI-powered precision |
| 10 | `cloning_vat` | 75B | Infinite duplication |
| 11 | `orbital_bakery_station` | 1T | Zero-gravity baking |
| 12 | `nanobot_yeast` | 14T | Molecular fermentation |
| 13 | `time_warp_oven` | 170T | Hours in seconds |
| 14 | `matter_replicator` | 2.1Q | Energy to matter |
| 15 | `multiverse_portal` | 75Q | "Stealing cakes from other dimensions." |

---

## 4. Asset Pipeline (Rich Media Ops)

All assets must be defined in `assets/asset-manifest.json` and generated via **Vertex AI (Imagen 4 Ultra)**.

### 4.1 Global Technical Constraints

| Type | Prompt |
|------|--------|
| **Style** | Vintage Patisserie |
| **Positive** | `watercolor painting, ink outline, pastel colors, white paper texture, isolated subject, high quality, illustration style, soft lighting` |
| **Negative** | `photo, 3d render, clay, realistic, dark, blurry, pixel art, vector, modern UI` |

### 4.2 Core Asset Definitions

| Asset ID | Description |
|----------|-------------|
| `ui_cursor_tool` | Fancy silver antique cake fork, ornate handle, hand-drawn ink style, pointing diagonally |
| `ui_main_cake` | Colossal, multi-layered decadent cake with strawberries and whipped cream |
| `ui_currency_icon` | Delicate slice of strawberry shortcake on porcelain plate, golden aura |
| `gen_tier_01_apprentice` | Young baker performing the "67 weighing gesture" |
| `gen_tier_15_portal` | Swirling vortex of frosting and dough tearing reality |
| `event_golden_croissant` | Glowing magical croissant made of pure gold light |

---

## 5. Feature Contracts (Functional Scope)

Development must proceed via **Atomic Implementation**.

### 📜 Contract 01: The Manual Bake

**Logic Container** (`useCakeLogic`):
- Listens for interaction events
- Calculates `newTotal = current + clickPower`
- Dispatches "Success" event

**View** (`MainCake.jsx`):
- Renders `ui_main_cake`
- Renders `ui_cursor_tool` (Silver Fork) replacing system mouse
- Animation: Fork "pokes" cake (CSS Transform), Cake squishes
- Sound: Soft "squish" or "crunch"

---

### 📜 Contract 02: The Shop & Inflation

**Logic Container** (`useShopSystem`):
- Price: `BaseCost * (1.15 ^ OwnedCount)`
- Validates: `if (balance >= price)`
- Updates `OwnedCount` in state

**View** (`StorePanel.jsx`):
- Renders list of 15 Tiers
- Displays: Asset Image, Name, Cost, Owned Qty
- State: Greys out unaffordable items

---

### 📜 Contract 03: The "67" Meme Upgrades

**Logic Container** (`useUpgradeSystem`):
- Monitors `TotalCakes` for "67" patterns

| Upgrade | Cost | Effect |
|---------|------|--------|
| "The Vibe Check" | 670 | CpS × 1.67 |
| "Viral Resonance" | 67,670 | Unlocks Golden Croissant |

**View** (`UpgradeGrid.jsx`):
- Displays upgrade icons
- Tooltip: "Palms up. Palms down. The dough understands."

---

### 📜 Contract 04: The Golden Croissant Event

**Logic Container** (`useEventSpawner`):
- Timer: Random interval (67-120 seconds)
- State: `isEventActive = true`
- Effect: `GlobalMultiplier = 67` for 30 seconds

**View** (`GoldenFloater.jsx`):
- Renders `event_golden_croissant`
- Movement: Sine wave float pattern
- Interaction: Click → particle explosion + disappear

---

### 📜 Contract 05: Adaptive Audio Engine

**Logic**:
- Monitors `CakesPerSecond` (CpS)
- Triggers cross-fades between tracks

**Asset Layers** (Lyria Generated):

| Layer | Trigger | Style |
|-------|---------|-------|
| `bgm_layer_01` | Start | Solo Piano |
| `bgm_layer_02` | Mid-Game | String Quartet |
| `bgm_layer_03` | End-Game/Portal | Operatic Vocals |

---

## 6. Implementation Roadmap

| Phase | Workflow Trigger | Action |
|-------|------------------|--------|
| **Initialization** | `@project-init.md` | Scaffold React 19, Vite, Rust (Tauri) environment |
| **Data Configuration** | `@data-config.md` | Create `balance.json` with 15 tiers and "67" constants |
| **Asset Generation** | `@generate-asset.md` | Run `scripts/generate-media.js` for watercolor assets |
| **Core Logic** | `@new-feature.md` | Build Contracts 01-03 with Container/View separation |
| **Polishing** | `@optimize-module.md` | Implement Audio Engine and CSS Animations |

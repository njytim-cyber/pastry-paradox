# Balance Schema

> Auto-generated on 2025-12-09T08:12:46.858Z
> Source: `src/data/balance.json`

## Version
1.0

## Global Configuration
| Property | Value | Description |
|----------|-------|-------------|
| Universal Constant | 67 | The sacred number 67 |
| Currency Name | Delicious Cakes | In-game currency |
| FPS | 4 | Game loop frame rate |
| Cost Multiplier | 1.15 | Price scaling factor |
| Sell Refund Rate | 0.25 | Percentage refunded on sale |
| Upgrade Visibility Threshold | 1 | When upgrades become visible |

## Production Tiers
Total tiers: 15

| Tier | ID | Name | Base Cost | Base CPS |
|------|-----|------|-----------|----------|
| 1 | `apprentice_baker` | Apprentice Baker | 15 | 0.1 |
| 2 | `grandmas_secret_recipe` | Grandma's Secret Recipe | 100 | 1 |
| 3 | `convection_oven` | Convection Oven | 1,100 | 8 |
| 4 | `professional_mixer` | Professional Mixer | 12,000 | 47 |
| 5 | `local_bakery_franchise` | Local Bakery Franchise | 130,000 | 260 |
| 6 | `cake_factory` | Cake Factory | 1,400,000 | 1,400 |
| 7 | `industrial_frosting_hose` | Industrial Frosting Hose | 20,000,000 | 7,800 |
| 8 | `3d_cake_printer` | 3D Cake Printer | 330,000,000 | 44,000 |
| 9 | `robotic_pastry_chef` | Robotic Pastry Chef | 5,100,000,000 | 260,000 |
| 10 | `cloning_vat` | Cloning Vat | 75,000,000,000 | 1,600,000 |
| 11 | `orbital_bakery_station` | Orbital Bakery Station | 1,000,000,000,000 | 10,000,000 |
| 12 | `nanobot_yeast` | Nanobot Yeast | 14,000,000,000,000 | 65,000,000 |
| 13 | `time_warp_oven` | Time Warp Oven | 170,000,000,000,000 | 430,000,000 |
| 14 | `matter_replicator` | Matter Replicator | 2,100,000,000,000,000 | 2,900,000,000 |
| 15 | `multiverse_portal` | Multiverse Portal | 75,000,000,000,000,000 | 21,000,000,000 |

## Upgrades
Total upgrades: 20

### The Vibe Check
- **ID**: `the_vibe_check`
- **Cost**: 100
- **Effect**: cpsMultiplier - 1.67x
- **Description**: Palms up. Palms down. The dough understands.

### Butter Blessing
- **ID**: `butter_blessing`
- **Cost**: 500
- **Effect**: cpsMultiplier - 1.5x
- **Description**: European butter hits different.

### Flour Power
- **ID**: `flour_power`
- **Cost**: 1,000
- **Effect**: cpsMultiplier - 1.4x
- **Description**: Ban refined flour. Go whole wheat. Just kidding.

### Sugar Rush
- **ID**: `sugar_rush`
- **Cost**: 5,000
- **Effect**: tierBonus (Tier 1) - 2x
- **Description**: Your apprentices vibrate with energy.

### Grandma's Approval
- **ID**: `grandmas_approval`
- **Cost**: 10,000
- **Effect**: tierBonus (Tier 2) - 2x
- **Description**: She finally admits the recipe needed updating.

### Always Preheated
- **ID**: `preheated`
- **Cost**: 50,000
- **Effect**: tierBonus (Tier 3) - 2x
- **Description**: Ovens so ready they predict your thoughts.

### Turbo Whisk
- **ID**: `turbo_whisk`
- **Cost**: 100,000
- **Effect**: tierBonus (Tier 4) - 2x
- **Description**: The sound breaks windows.

### Viral Resonance
- **ID**: `viral_resonance`
- **Cost**: 67,670
- **Effect**: unlockEvent - goldenCroissantx
- **Description**: Your fame reaches the golden dimension.

### Click Mastery
- **ID**: `click_mastery`
- **Cost**: 200,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Your fingers move faster than sound.

### Double Tap
- **ID**: `double_tap`
- **Cost**: 500,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Each click counts twice. It just does.

### Franchise Fever
- **ID**: `franchise_fever`
- **Cost**: 1,000,000
- **Effect**: tierBonus (Tier 5) - 2x
- **Description**: Open bakeries in your sleep.

### Factory Overdrive
- **ID**: `factory_overdrive`
- **Cost**: 5,000,000
- **Effect**: tierBonus (Tier 6) - 2x
- **Description**: OSHA? Never heard of them.

### Frosting Flood
- **ID**: `frosting_flood`
- **Cost**: 20,000,000
- **Effect**: tierBonus (Tier 7) - 2x
- **Description**: A deluge of deliciousness.

### Printer Perfection
- **ID**: `printer_perfection`
- **Cost**: 100,000,000
- **Effect**: tierBonus (Tier 8) - 2x
- **Description**: 4K resolution cakes. Yes, really.

### Robot Uprising (Good Kind)
- **ID**: `robot_uprising`
- **Cost**: 500,000,000
- **Effect**: tierBonus (Tier 9) - 2x
- **Description**: They only want to bake.

### Clone Perfection
- **ID**: `clone_perfection`
- **Cost**: 5,000,000,000
- **Effect**: tierBonus (Tier 10) - 2x
- **Description**: Each copy improves upon the last.

### Zero-G Frosting
- **ID**: `zero_g_frosting`
- **Cost**: 50,000,000,000
- **Effect**: tierBonus (Tier 11) - 2x
- **Description**: Perfect spherical layers.

### Nano Swarm
- **ID**: `nano_swarm`
- **Cost**: 500,000,000,000
- **Effect**: tierBonus (Tier 12) - 2x
- **Description**: They're everywhere. EVERYWHERE.

### Temporal Baking
- **ID**: `temporal_baking`
- **Cost**: 5,000,000,000,000
- **Effect**: tierBonus (Tier 13) - 2x
- **Description**: The cake was ready yesterday.

### Reality Dough
- **ID**: `reality_dough`
- **Cost**: 50,000,000,000,000
- **Effect**: cpsMultiplier - 67x
- **Description**: The universe is your ingredient list.

## Events
### Golden Croissant
- **ID**: `golden_croissant`
- **Spawn Interval**: 67s - 120s
- **Duration**: 30s
- **Multiplier**: 67x
- **Description**: A mystical pastry from another realm!

## Entities
### player
- **Base Click Power**: 1
- **Base Speed**: 10

## Prestige System
- **Required Baked**: 1,000,000,000,000
- **CPS Bonus Per Point**: 0.01

# Balance Schema

> Auto-generated on 2025-12-09T21:48:49.774Z
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
Total upgrades: 120

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

### Sturdy Apprentice Baker
- **ID**: `apprentice_baker_upgrade_1`
- **Cost**: 75
- **Effect**: tierBonus (Tier 1) - 2x
- **Description**: Reinforced foundation. Apprentice Bakers production x2.

### Efficient Apprentice Baker
- **ID**: `apprentice_baker_upgrade_2`
- **Cost**: 750
- **Effect**: tierBonus (Tier 1) - 2x
- **Description**: Improved efficiency. Apprentice Bakers production x2.

### Advanced Apprentice Baker
- **ID**: `apprentice_baker_upgrade_3`
- **Cost**: 7,500
- **Effect**: tierBonus (Tier 1) - 2x
- **Description**: High-tech integration. Apprentice Bakers production x2.

### Super Apprentice Baker
- **ID**: `apprentice_baker_upgrade_4`
- **Cost**: 75,000
- **Effect**: tierBonus (Tier 1) - 2x
- **Description**: Maximum overdrive. Apprentice Bakers production x2.

### Mega Apprentice Baker
- **ID**: `apprentice_baker_upgrade_5`
- **Cost**: 750,000
- **Effect**: tierBonus (Tier 1) - 2x
- **Description**: Quantum enhancement. Apprentice Bakers production x2.

### Hyper Apprentice Baker
- **ID**: `apprentice_baker_upgrade_6`
- **Cost**: 7,500,000
- **Effect**: tierBonus (Tier 1) - 2x
- **Description**: Divine perfection. Apprentice Bakers production x2.

### Sturdy Grandma's Secret Recipe
- **ID**: `grandmas_secret_recipe_upgrade_1`
- **Cost**: 500
- **Effect**: tierBonus (Tier 2) - 2x
- **Description**: Reinforced foundation. Grandma's Secret Recipes production x2.

### Efficient Grandma's Secret Recipe
- **ID**: `grandmas_secret_recipe_upgrade_2`
- **Cost**: 5,000
- **Effect**: tierBonus (Tier 2) - 2x
- **Description**: Improved efficiency. Grandma's Secret Recipes production x2.

### Advanced Grandma's Secret Recipe
- **ID**: `grandmas_secret_recipe_upgrade_3`
- **Cost**: 50,000
- **Effect**: tierBonus (Tier 2) - 2x
- **Description**: High-tech integration. Grandma's Secret Recipes production x2.

### Super Grandma's Secret Recipe
- **ID**: `grandmas_secret_recipe_upgrade_4`
- **Cost**: 500,000
- **Effect**: tierBonus (Tier 2) - 2x
- **Description**: Maximum overdrive. Grandma's Secret Recipes production x2.

### Mega Grandma's Secret Recipe
- **ID**: `grandmas_secret_recipe_upgrade_5`
- **Cost**: 5,000,000
- **Effect**: tierBonus (Tier 2) - 2x
- **Description**: Quantum enhancement. Grandma's Secret Recipes production x2.

### Hyper Grandma's Secret Recipe
- **ID**: `grandmas_secret_recipe_upgrade_6`
- **Cost**: 50,000,000
- **Effect**: tierBonus (Tier 2) - 2x
- **Description**: Divine perfection. Grandma's Secret Recipes production x2.

### Sturdy Convection Oven
- **ID**: `convection_oven_upgrade_1`
- **Cost**: 5,500
- **Effect**: tierBonus (Tier 3) - 2x
- **Description**: Reinforced foundation. Convection Ovens production x2.

### Efficient Convection Oven
- **ID**: `convection_oven_upgrade_2`
- **Cost**: 55,000
- **Effect**: tierBonus (Tier 3) - 2x
- **Description**: Improved efficiency. Convection Ovens production x2.

### Advanced Convection Oven
- **ID**: `convection_oven_upgrade_3`
- **Cost**: 550,000
- **Effect**: tierBonus (Tier 3) - 2x
- **Description**: High-tech integration. Convection Ovens production x2.

### Super Convection Oven
- **ID**: `convection_oven_upgrade_4`
- **Cost**: 5,500,000
- **Effect**: tierBonus (Tier 3) - 2x
- **Description**: Maximum overdrive. Convection Ovens production x2.

### Mega Convection Oven
- **ID**: `convection_oven_upgrade_5`
- **Cost**: 55,000,000
- **Effect**: tierBonus (Tier 3) - 2x
- **Description**: Quantum enhancement. Convection Ovens production x2.

### Hyper Convection Oven
- **ID**: `convection_oven_upgrade_6`
- **Cost**: 550,000,000
- **Effect**: tierBonus (Tier 3) - 2x
- **Description**: Divine perfection. Convection Ovens production x2.

### Sturdy Professional Mixer
- **ID**: `professional_mixer_upgrade_1`
- **Cost**: 60,000
- **Effect**: tierBonus (Tier 4) - 2x
- **Description**: Reinforced foundation. Professional Mixers production x2.

### Efficient Professional Mixer
- **ID**: `professional_mixer_upgrade_2`
- **Cost**: 600,000
- **Effect**: tierBonus (Tier 4) - 2x
- **Description**: Improved efficiency. Professional Mixers production x2.

### Advanced Professional Mixer
- **ID**: `professional_mixer_upgrade_3`
- **Cost**: 6,000,000
- **Effect**: tierBonus (Tier 4) - 2x
- **Description**: High-tech integration. Professional Mixers production x2.

### Super Professional Mixer
- **ID**: `professional_mixer_upgrade_4`
- **Cost**: 60,000,000
- **Effect**: tierBonus (Tier 4) - 2x
- **Description**: Maximum overdrive. Professional Mixers production x2.

### Mega Professional Mixer
- **ID**: `professional_mixer_upgrade_5`
- **Cost**: 600,000,000
- **Effect**: tierBonus (Tier 4) - 2x
- **Description**: Quantum enhancement. Professional Mixers production x2.

### Hyper Professional Mixer
- **ID**: `professional_mixer_upgrade_6`
- **Cost**: 6,000,000,000
- **Effect**: tierBonus (Tier 4) - 2x
- **Description**: Divine perfection. Professional Mixers production x2.

### Sturdy Local Bakery Franchise
- **ID**: `local_bakery_franchise_upgrade_1`
- **Cost**: 650,000
- **Effect**: tierBonus (Tier 5) - 2x
- **Description**: Reinforced foundation. Local Bakery Franchises production x2.

### Efficient Local Bakery Franchise
- **ID**: `local_bakery_franchise_upgrade_2`
- **Cost**: 6,500,000
- **Effect**: tierBonus (Tier 5) - 2x
- **Description**: Improved efficiency. Local Bakery Franchises production x2.

### Advanced Local Bakery Franchise
- **ID**: `local_bakery_franchise_upgrade_3`
- **Cost**: 65,000,000
- **Effect**: tierBonus (Tier 5) - 2x
- **Description**: High-tech integration. Local Bakery Franchises production x2.

### Super Local Bakery Franchise
- **ID**: `local_bakery_franchise_upgrade_4`
- **Cost**: 650,000,000
- **Effect**: tierBonus (Tier 5) - 2x
- **Description**: Maximum overdrive. Local Bakery Franchises production x2.

### Mega Local Bakery Franchise
- **ID**: `local_bakery_franchise_upgrade_5`
- **Cost**: 6,500,000,000
- **Effect**: tierBonus (Tier 5) - 2x
- **Description**: Quantum enhancement. Local Bakery Franchises production x2.

### Hyper Local Bakery Franchise
- **ID**: `local_bakery_franchise_upgrade_6`
- **Cost**: 65,000,000,000
- **Effect**: tierBonus (Tier 5) - 2x
- **Description**: Divine perfection. Local Bakery Franchises production x2.

### Sturdy Cake Factory
- **ID**: `cake_factory_upgrade_1`
- **Cost**: 7,000,000
- **Effect**: tierBonus (Tier 6) - 2x
- **Description**: Reinforced foundation. Cake Factorys production x2.

### Efficient Cake Factory
- **ID**: `cake_factory_upgrade_2`
- **Cost**: 70,000,000
- **Effect**: tierBonus (Tier 6) - 2x
- **Description**: Improved efficiency. Cake Factorys production x2.

### Advanced Cake Factory
- **ID**: `cake_factory_upgrade_3`
- **Cost**: 700,000,000
- **Effect**: tierBonus (Tier 6) - 2x
- **Description**: High-tech integration. Cake Factorys production x2.

### Super Cake Factory
- **ID**: `cake_factory_upgrade_4`
- **Cost**: 7,000,000,000
- **Effect**: tierBonus (Tier 6) - 2x
- **Description**: Maximum overdrive. Cake Factorys production x2.

### Mega Cake Factory
- **ID**: `cake_factory_upgrade_5`
- **Cost**: 70,000,000,000
- **Effect**: tierBonus (Tier 6) - 2x
- **Description**: Quantum enhancement. Cake Factorys production x2.

### Hyper Cake Factory
- **ID**: `cake_factory_upgrade_6`
- **Cost**: 700,000,000,000
- **Effect**: tierBonus (Tier 6) - 2x
- **Description**: Divine perfection. Cake Factorys production x2.

### Sturdy Industrial Frosting Hose
- **ID**: `industrial_frosting_hose_upgrade_1`
- **Cost**: 100,000,000
- **Effect**: tierBonus (Tier 7) - 2x
- **Description**: Reinforced foundation. Industrial Frosting Hoses production x2.

### Efficient Industrial Frosting Hose
- **ID**: `industrial_frosting_hose_upgrade_2`
- **Cost**: 1,000,000,000
- **Effect**: tierBonus (Tier 7) - 2x
- **Description**: Improved efficiency. Industrial Frosting Hoses production x2.

### Advanced Industrial Frosting Hose
- **ID**: `industrial_frosting_hose_upgrade_3`
- **Cost**: 10,000,000,000
- **Effect**: tierBonus (Tier 7) - 2x
- **Description**: High-tech integration. Industrial Frosting Hoses production x2.

### Super Industrial Frosting Hose
- **ID**: `industrial_frosting_hose_upgrade_4`
- **Cost**: 100,000,000,000
- **Effect**: tierBonus (Tier 7) - 2x
- **Description**: Maximum overdrive. Industrial Frosting Hoses production x2.

### Mega Industrial Frosting Hose
- **ID**: `industrial_frosting_hose_upgrade_5`
- **Cost**: 1,000,000,000,000
- **Effect**: tierBonus (Tier 7) - 2x
- **Description**: Quantum enhancement. Industrial Frosting Hoses production x2.

### Hyper Industrial Frosting Hose
- **ID**: `industrial_frosting_hose_upgrade_6`
- **Cost**: 10,000,000,000,000
- **Effect**: tierBonus (Tier 7) - 2x
- **Description**: Divine perfection. Industrial Frosting Hoses production x2.

### Sturdy 3D Cake Printer
- **ID**: `3d_cake_printer_upgrade_1`
- **Cost**: 1,650,000,000
- **Effect**: tierBonus (Tier 8) - 2x
- **Description**: Reinforced foundation. 3D Cake Printers production x2.

### Efficient 3D Cake Printer
- **ID**: `3d_cake_printer_upgrade_2`
- **Cost**: 16,500,000,000
- **Effect**: tierBonus (Tier 8) - 2x
- **Description**: Improved efficiency. 3D Cake Printers production x2.

### Advanced 3D Cake Printer
- **ID**: `3d_cake_printer_upgrade_3`
- **Cost**: 165,000,000,000
- **Effect**: tierBonus (Tier 8) - 2x
- **Description**: High-tech integration. 3D Cake Printers production x2.

### Super 3D Cake Printer
- **ID**: `3d_cake_printer_upgrade_4`
- **Cost**: 1,650,000,000,000
- **Effect**: tierBonus (Tier 8) - 2x
- **Description**: Maximum overdrive. 3D Cake Printers production x2.

### Mega 3D Cake Printer
- **ID**: `3d_cake_printer_upgrade_5`
- **Cost**: 16,500,000,000,000
- **Effect**: tierBonus (Tier 8) - 2x
- **Description**: Quantum enhancement. 3D Cake Printers production x2.

### Hyper 3D Cake Printer
- **ID**: `3d_cake_printer_upgrade_6`
- **Cost**: 165,000,000,000,000
- **Effect**: tierBonus (Tier 8) - 2x
- **Description**: Divine perfection. 3D Cake Printers production x2.

### Sturdy Robotic Pastry Chef
- **ID**: `robotic_pastry_chef_upgrade_1`
- **Cost**: 25,500,000,000
- **Effect**: tierBonus (Tier 9) - 2x
- **Description**: Reinforced foundation. Robotic Pastry Chefs production x2.

### Efficient Robotic Pastry Chef
- **ID**: `robotic_pastry_chef_upgrade_2`
- **Cost**: 255,000,000,000
- **Effect**: tierBonus (Tier 9) - 2x
- **Description**: Improved efficiency. Robotic Pastry Chefs production x2.

### Advanced Robotic Pastry Chef
- **ID**: `robotic_pastry_chef_upgrade_3`
- **Cost**: 2,550,000,000,000
- **Effect**: tierBonus (Tier 9) - 2x
- **Description**: High-tech integration. Robotic Pastry Chefs production x2.

### Super Robotic Pastry Chef
- **ID**: `robotic_pastry_chef_upgrade_4`
- **Cost**: 25,500,000,000,000
- **Effect**: tierBonus (Tier 9) - 2x
- **Description**: Maximum overdrive. Robotic Pastry Chefs production x2.

### Mega Robotic Pastry Chef
- **ID**: `robotic_pastry_chef_upgrade_5`
- **Cost**: 255,000,000,000,000
- **Effect**: tierBonus (Tier 9) - 2x
- **Description**: Quantum enhancement. Robotic Pastry Chefs production x2.

### Hyper Robotic Pastry Chef
- **ID**: `robotic_pastry_chef_upgrade_6`
- **Cost**: 2,550,000,000,000,000
- **Effect**: tierBonus (Tier 9) - 2x
- **Description**: Divine perfection. Robotic Pastry Chefs production x2.

### Sturdy Cloning Vat
- **ID**: `cloning_vat_upgrade_1`
- **Cost**: 375,000,000,000
- **Effect**: tierBonus (Tier 10) - 2x
- **Description**: Reinforced foundation. Cloning Vats production x2.

### Efficient Cloning Vat
- **ID**: `cloning_vat_upgrade_2`
- **Cost**: 3,750,000,000,000
- **Effect**: tierBonus (Tier 10) - 2x
- **Description**: Improved efficiency. Cloning Vats production x2.

### Advanced Cloning Vat
- **ID**: `cloning_vat_upgrade_3`
- **Cost**: 37,500,000,000,000
- **Effect**: tierBonus (Tier 10) - 2x
- **Description**: High-tech integration. Cloning Vats production x2.

### Super Cloning Vat
- **ID**: `cloning_vat_upgrade_4`
- **Cost**: 375,000,000,000,000
- **Effect**: tierBonus (Tier 10) - 2x
- **Description**: Maximum overdrive. Cloning Vats production x2.

### Mega Cloning Vat
- **ID**: `cloning_vat_upgrade_5`
- **Cost**: 3,750,000,000,000,000
- **Effect**: tierBonus (Tier 10) - 2x
- **Description**: Quantum enhancement. Cloning Vats production x2.

### Hyper Cloning Vat
- **ID**: `cloning_vat_upgrade_6`
- **Cost**: 37,500,000,000,000,000
- **Effect**: tierBonus (Tier 10) - 2x
- **Description**: Divine perfection. Cloning Vats production x2.

### Sturdy Orbital Bakery Station
- **ID**: `orbital_bakery_station_upgrade_1`
- **Cost**: 5,000,000,000,000
- **Effect**: tierBonus (Tier 11) - 2x
- **Description**: Reinforced foundation. Orbital Bakery Stations production x2.

### Efficient Orbital Bakery Station
- **ID**: `orbital_bakery_station_upgrade_2`
- **Cost**: 50,000,000,000,000
- **Effect**: tierBonus (Tier 11) - 2x
- **Description**: Improved efficiency. Orbital Bakery Stations production x2.

### Advanced Orbital Bakery Station
- **ID**: `orbital_bakery_station_upgrade_3`
- **Cost**: 500,000,000,000,000
- **Effect**: tierBonus (Tier 11) - 2x
- **Description**: High-tech integration. Orbital Bakery Stations production x2.

### Super Orbital Bakery Station
- **ID**: `orbital_bakery_station_upgrade_4`
- **Cost**: 5,000,000,000,000,000
- **Effect**: tierBonus (Tier 11) - 2x
- **Description**: Maximum overdrive. Orbital Bakery Stations production x2.

### Mega Orbital Bakery Station
- **ID**: `orbital_bakery_station_upgrade_5`
- **Cost**: 50,000,000,000,000,000
- **Effect**: tierBonus (Tier 11) - 2x
- **Description**: Quantum enhancement. Orbital Bakery Stations production x2.

### Hyper Orbital Bakery Station
- **ID**: `orbital_bakery_station_upgrade_6`
- **Cost**: 500,000,000,000,000,000
- **Effect**: tierBonus (Tier 11) - 2x
- **Description**: Divine perfection. Orbital Bakery Stations production x2.

### Sturdy Nanobot Yeast
- **ID**: `nanobot_yeast_upgrade_1`
- **Cost**: 70,000,000,000,000
- **Effect**: tierBonus (Tier 12) - 2x
- **Description**: Reinforced foundation. Nanobot Yeasts production x2.

### Efficient Nanobot Yeast
- **ID**: `nanobot_yeast_upgrade_2`
- **Cost**: 700,000,000,000,000
- **Effect**: tierBonus (Tier 12) - 2x
- **Description**: Improved efficiency. Nanobot Yeasts production x2.

### Advanced Nanobot Yeast
- **ID**: `nanobot_yeast_upgrade_3`
- **Cost**: 7,000,000,000,000,000
- **Effect**: tierBonus (Tier 12) - 2x
- **Description**: High-tech integration. Nanobot Yeasts production x2.

### Super Nanobot Yeast
- **ID**: `nanobot_yeast_upgrade_4`
- **Cost**: 70,000,000,000,000,000
- **Effect**: tierBonus (Tier 12) - 2x
- **Description**: Maximum overdrive. Nanobot Yeasts production x2.

### Mega Nanobot Yeast
- **ID**: `nanobot_yeast_upgrade_5`
- **Cost**: 700,000,000,000,000,000
- **Effect**: tierBonus (Tier 12) - 2x
- **Description**: Quantum enhancement. Nanobot Yeasts production x2.

### Hyper Nanobot Yeast
- **ID**: `nanobot_yeast_upgrade_6`
- **Cost**: 7,000,000,000,000,000,000
- **Effect**: tierBonus (Tier 12) - 2x
- **Description**: Divine perfection. Nanobot Yeasts production x2.

### Sturdy Time Warp Oven
- **ID**: `time_warp_oven_upgrade_1`
- **Cost**: 850,000,000,000,000
- **Effect**: tierBonus (Tier 13) - 2x
- **Description**: Reinforced foundation. Time Warp Ovens production x2.

### Efficient Time Warp Oven
- **ID**: `time_warp_oven_upgrade_2`
- **Cost**: 8,500,000,000,000,000
- **Effect**: tierBonus (Tier 13) - 2x
- **Description**: Improved efficiency. Time Warp Ovens production x2.

### Advanced Time Warp Oven
- **ID**: `time_warp_oven_upgrade_3`
- **Cost**: 85,000,000,000,000,000
- **Effect**: tierBonus (Tier 13) - 2x
- **Description**: High-tech integration. Time Warp Ovens production x2.

### Super Time Warp Oven
- **ID**: `time_warp_oven_upgrade_4`
- **Cost**: 850,000,000,000,000,000
- **Effect**: tierBonus (Tier 13) - 2x
- **Description**: Maximum overdrive. Time Warp Ovens production x2.

### Mega Time Warp Oven
- **ID**: `time_warp_oven_upgrade_5`
- **Cost**: 8,500,000,000,000,000,000
- **Effect**: tierBonus (Tier 13) - 2x
- **Description**: Quantum enhancement. Time Warp Ovens production x2.

### Hyper Time Warp Oven
- **ID**: `time_warp_oven_upgrade_6`
- **Cost**: 85,000,000,000,000,000,000
- **Effect**: tierBonus (Tier 13) - 2x
- **Description**: Divine perfection. Time Warp Ovens production x2.

### Sturdy Matter Replicator
- **ID**: `matter_replicator_upgrade_1`
- **Cost**: 10,500,000,000,000,000
- **Effect**: tierBonus (Tier 14) - 2x
- **Description**: Reinforced foundation. Matter Replicators production x2.

### Efficient Matter Replicator
- **ID**: `matter_replicator_upgrade_2`
- **Cost**: 105,000,000,000,000,000
- **Effect**: tierBonus (Tier 14) - 2x
- **Description**: Improved efficiency. Matter Replicators production x2.

### Advanced Matter Replicator
- **ID**: `matter_replicator_upgrade_3`
- **Cost**: 1,050,000,000,000,000,000
- **Effect**: tierBonus (Tier 14) - 2x
- **Description**: High-tech integration. Matter Replicators production x2.

### Super Matter Replicator
- **ID**: `matter_replicator_upgrade_4`
- **Cost**: 10,500,000,000,000,000,000
- **Effect**: tierBonus (Tier 14) - 2x
- **Description**: Maximum overdrive. Matter Replicators production x2.

### Mega Matter Replicator
- **ID**: `matter_replicator_upgrade_5`
- **Cost**: 105,000,000,000,000,000,000
- **Effect**: tierBonus (Tier 14) - 2x
- **Description**: Quantum enhancement. Matter Replicators production x2.

### Hyper Matter Replicator
- **ID**: `matter_replicator_upgrade_6`
- **Cost**: 1,050,000,000,000,000,000,000
- **Effect**: tierBonus (Tier 14) - 2x
- **Description**: Divine perfection. Matter Replicators production x2.

### Sturdy Multiverse Portal
- **ID**: `multiverse_portal_upgrade_1`
- **Cost**: 375,000,000,000,000,000
- **Effect**: tierBonus (Tier 15) - 2x
- **Description**: Reinforced foundation. Multiverse Portals production x2.

### Efficient Multiverse Portal
- **ID**: `multiverse_portal_upgrade_2`
- **Cost**: 3,750,000,000,000,000,000
- **Effect**: tierBonus (Tier 15) - 2x
- **Description**: Improved efficiency. Multiverse Portals production x2.

### Advanced Multiverse Portal
- **ID**: `multiverse_portal_upgrade_3`
- **Cost**: 37,500,000,000,000,000,000
- **Effect**: tierBonus (Tier 15) - 2x
- **Description**: High-tech integration. Multiverse Portals production x2.

### Super Multiverse Portal
- **ID**: `multiverse_portal_upgrade_4`
- **Cost**: 375,000,000,000,000,000,000
- **Effect**: tierBonus (Tier 15) - 2x
- **Description**: Maximum overdrive. Multiverse Portals production x2.

### Mega Multiverse Portal
- **ID**: `multiverse_portal_upgrade_5`
- **Cost**: 3,750,000,000,000,000,000,000
- **Effect**: tierBonus (Tier 15) - 2x
- **Description**: Quantum enhancement. Multiverse Portals production x2.

### Hyper Multiverse Portal
- **ID**: `multiverse_portal_upgrade_6`
- **Cost**: 37,500,000,000,000,000,000,000
- **Effect**: tierBonus (Tier 15) - 2x
- **Description**: Divine perfection. Multiverse Portals production x2.

### Plastic Mouse
- **ID**: `click_upgrade_new_1`
- **Cost**: 500
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Better than a trackpad.

### Mechanic Switch
- **ID**: `click_upgrade_new_2`
- **Cost**: 5,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Clicky sounds.

### Gaming Mouse
- **ID**: `click_upgrade_new_3`
- **Cost**: 50,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: RGB boosts FPS.

### Macro Script
- **ID**: `click_upgrade_new_4`
- **Cost**: 1,000,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Automated efficiency.

### Neural Link
- **ID**: `click_upgrade_new_5`
- **Cost**: 50,000,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Mind over matter.

### Cybernetic Finger
- **ID**: `click_upgrade_new_6`
- **Cost**: 1,000,000,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Steel tendons.

### Quantum Click
- **ID**: `click_upgrade_new_7`
- **Cost**: 50,000,000,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Superposition poking.

### Time Clicks
- **ID**: `click_upgrade_new_8`
- **Cost**: 1,000,000,000,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Clicking yesterday.

### Reality Touch
- **ID**: `click_upgrade_new_9`
- **Cost**: 50,000,000,000,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Molding the universe.

### God Hand
- **ID**: `click_upgrade_new_10`
- **Cost**: 1,000,000,000,000,000
- **Effect**: clickPowerMultiplier - 2x
- **Description**: Divine intervention.

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

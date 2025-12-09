const fs = require('fs');

/* 
    STANDALONE DATA COPY 
    To avoid file reading issues
*/
const productionTiers = [
    { id: "apprentice_baker", tier: 1, name: "Apprentice Baker", baseCost: 15 },
    { id: "grandmas_secret_recipe", tier: 2, name: "Grandma's Secret Recipe", baseCost: 100 },
    { id: "convection_oven", tier: 3, name: "Convection Oven", baseCost: 1100 },
    { id: "professional_mixer", tier: 4, name: "Professional Mixer", baseCost: 12000 },
    { id: "local_bakery_franchise", tier: 5, name: "Local Bakery Franchise", baseCost: 130000 },
    { id: "cake_factory", tier: 6, name: "Cake Factory", baseCost: 1400000 },
    { id: "industrial_frosting_hose", tier: 7, name: "Industrial Frosting Hose", baseCost: 20000000 },
    { id: "3d_cake_printer", tier: 8, name: "3D Cake Printer", baseCost: 330000000 },
    { id: "robotic_pastry_chef", tier: 9, name: "Robotic Pastry Chef", baseCost: 5100000000 },
    { id: "cloning_vat", tier: 10, name: "Cloning Vat", baseCost: 75000000000 },
    { id: "orbital_bakery_station", tier: 11, name: "Orbital Bakery Station", baseCost: 1000000000000 },
    { id: "nanobot_yeast", tier: 12, name: "Nanobot Yeast", baseCost: 14000000000000 },
    { id: "time_warp_oven", tier: 13, name: "Time Warp Oven", baseCost: 170000000000000 },
    { id: "matter_replicator", tier: 14, name: "Matter Replicator", baseCost: 2100000000000000 },
    { id: "multiverse_portal", tier: 15, name: "Multiverse Portal", baseCost: 75000000000000000 }
];

const newUpgrades = {};

// Helper to add upgrade
const addUpgrade = (id, name, desc, cost, effect, unlockCondition) => {
    newUpgrades[id] = {
        id,
        name,
        description: desc,
        cost: Math.floor(cost),
        effect,
        // We'll trust the game logic to handle unlock conditions via magic or hardcode logic later
        // But the current game engine seems to 'discover' upgrades based on balance? 
        // Logic check: The UpgradeGrid checks `balance >= cost * 0.5`. 
        // It doesn't strictly enforce "Must own 10 buildings". 
        // Cookie Clicker does. 
        // For now, we will RELY on cost gating as the primary mechanism, 
        // as implementing specific unlock conditions for 100 items might require engine changes.
        // HOWEVER, `StatsPanel` shows them.
        // Let's stick balance-only visibility for now as per existing engine.
    };
};

/* 
    GENERATOR UPGRADES 
*/
const tiers = [
    { suffix: "Base", mult: 5, desc: "Reinforced foundation.", namePre: "Sturdy" },
    { suffix: "II", mult: 50, desc: "Improved efficiency.", namePre: "Efficient" },
    { suffix: "III", mult: 500, desc: "High-tech integration.", namePre: "Advanced" },
    { suffix: "IV", mult: 5000, desc: "Maximum overdrive.", namePre: "Super" },
    { suffix: "V", mult: 50000, desc: "Quantum enhancement.", namePre: "Mega" },
    { suffix: "VI", mult: 500000, desc: "Divine perfection.", namePre: "Hyper" }
];

productionTiers.forEach(tier => {
    tiers.forEach((upgradeTier, index) => {
        const id = `${tier.id}_upgrade_${index + 1}`;
        const name = `${upgradeTier.namePre} ${tier.name}`;
        const cost = tier.baseCost * upgradeTier.mult;
        const desc = `${upgradeTier.desc} ${tier.name}s production x2.`;

        addUpgrade(id, name, desc, cost, {
            type: "tierBonus",
            tier: tier.tier,
            value: 2.0
        });
    });
});

/* 
    CLICK UPGRADES
*/
const clickUpgrades = [
    { name: "Plastic Mouse", cost: 500, desc: "Better than a trackpad." },
    { name: "Mechanic Switch", cost: 5000, desc: "Clicky sounds." },
    { name: "Gaming Mouse", cost: 50000, desc: "RGB boosts FPS." },
    { name: "Macro Script", cost: 1000000, desc: "Automated efficiency." },
    { name: "Neural Link", cost: 50000000, desc: "Mind over matter." },
    { name: "Cybernetic Finger", cost: 1000000000, desc: "Steel tendons." },
    { name: "Quantum Click", cost: 50000000000, desc: "Superposition poking." },
    { name: "Time Clicks", cost: 1000000000000, desc: "Clicking yesterday." },
    { name: "Reality Touch", cost: 50000000000000, desc: "Molding the universe." },
    { name: "God Hand", cost: 1000000000000000, desc: "Divine intervention." }
];

clickUpgrades.forEach((u, i) => {
    const id = `click_upgrade_new_${i + 1}`;
    addUpgrade(id, u.name, u.desc, u.cost, {
        type: "clickPowerMultiplier",
        value: 2.0
    });
});

// console.log(JSON.stringify(newUpgrades, null, 4));
process.stdout.write(JSON.stringify(newUpgrades, null, 4));

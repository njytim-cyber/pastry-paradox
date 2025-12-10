import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BALANCE_PATH = path.join(__dirname, '../src/data/balance.json');
// Dynamic import or fs read for JSON in ESM
const balanceData = JSON.parse(fs.readFileSync(BALANCE_PATH, 'utf-8'));

// Configuration for the 4 branches
const BRANCHES = {
    matter: {
        idPrefix: 'dark_matter',
        namePrefix: 'Matter',
        direction: { x: -1, y: 0 }, // Left
        effects: ['costReduction', 'productionMultiplier'],
        colors: '#e74c3c'
    },
    time: {
        idPrefix: 'dark_time',
        namePrefix: 'Time',
        direction: { x: 1, y: 0 }, // Right
        effects: ['cpsMultiplier', 'gameSpeed'],
        colors: '#3498db'
    },
    cosmic: {
        idPrefix: 'dark_cosmic',
        namePrefix: 'Cosmic',
        direction: { x: 0, y: -1 }, // Up
        effects: ['clickPowerMult', 'critChance'],
        colors: '#9b59b6'
    },
    void: {
        idPrefix: 'dark_void',
        namePrefix: 'Void',
        direction: { x: 0, y: 1 }, // Down
        effects: ['offlineGain', 'passiveGeneration'],
        colors: '#2c3e50'
    }
};

const UPGRADES_PER_BRANCH = 25;

const generateUpgrades = () => {
    const upgrades = {};

    // 1. Center Node
    upgrades['dark_core'] = {
        id: 'dark_core',
        name: 'Dark Singularity',
        description: 'The beginning of the end.',
        cost: 1,
        position: { x: 0, y: 0 },
        parent: null,
        effect: { type: 'cpsMultiplier', value: 2.0 }
    };

    // 2. Connector to Big Crunch handled in 'the_end_is_nigh' in normal upgrades

    Object.entries(BRANCHES).forEach(([branchKey, config]) => {
        let previousId = 'dark_core';

        for (let i = 1; i <= UPGRADES_PER_BRANCH; i++) {
            const id = `${config.idPrefix}_${i}`;

            // Procedural generation
            const tier = Math.ceil(i / 5);
            // Cost curve: exponential
            const cost = Math.floor(Math.pow(2.2, i) * 10);

            // Position radiates out
            const spread = 120; // pixels, ample space
            const variance = (i % 2 === 0 ? 40 : -40);
            const posX = (config.direction.x * i * spread) + (config.direction.y !== 0 ? variance : 0);
            const posY = (config.direction.y * i * spread) + (config.direction.x !== 0 ? variance : 0);

            // Effect logic
            let effect = {};
            const effectType = config.effects[(i % config.effects.length)];

            switch (effectType) {
                case 'costReduction':
                    // Diminishing cost scale: 0.99, 0.98, etc. careful not to go too low too fast
                    // i=1 -> 0.99, i=25 -> 0.87 roughly
                    effect = { type: 'globalCostScale', value: Math.max(0.5, 0.99 - (i * 0.002)) };
                    break;
                case 'productionMultiplier':
                    effect = { type: 'globalProductionMult', value: 1 + (i * 0.1) };
                    break;
                case 'cpsMultiplier':
                    effect = { type: 'cpsMultiplier', value: 1 + (i * 0.15) };
                    break;
                case 'gameSpeed':
                    // Just flavor for now unless we implement tick speed
                    effect = { type: 'timeWarp', value: 1 + (i * 0.05) };
                    break;
                case 'clickPowerMult':
                    effect = { type: 'clickPowerMult', value: 1 + (i * 0.5) };
                    break;
                case 'critChance':
                    effect = { type: 'critChance', value: 0.01 * i };
                    break;
                case 'offlineGain':
                    effect = { type: 'offlineBonus', value: 1 + (i * 0.2) };
                    break;
                case 'passiveGeneration':
                    // Passive dark matter gain?
                    effect = { type: 'passiveDarkMatter', value: i * 0.01 };
                    break;
            }

            upgrades[id] = {
                id,
                name: `${config.namePrefix} Node ${i}`,
                description: `Tier ${tier} ${config.namePrefix} enhancement.`,
                cost,
                position: { x: posX, y: posY },
                parent: previousId,
                branch: branchKey,
                effect
            };

            previousId = id;
        }
    });

    return upgrades;
};

const darkUpgrades = generateUpgrades();

// Add 'the_end_is_nigh' to STANDARD upgrades if not present
if (!balanceData.upgrades['the_end_is_nigh']) {
    balanceData.upgrades['the_end_is_nigh'] = {
        id: 'the_end_is_nigh',
        name: 'The End is Nigh',
        description: 'The universe trembles. Unlocks The Big Crunch. (Requires 1T Cakes)',
        cost: 1000000000000,
        effect: {
            type: 'unlockFeature',
            value: 'bigCrunch'
        },
        reqType: 'totalBaked',
        reqValue: 800000000000
    };
}

// Assign to balance data
balanceData.darkMatterUpgrades = darkUpgrades;

fs.writeFileSync(BALANCE_PATH, JSON.stringify(balanceData, null, 4));
console.log(`Generated ${Object.keys(darkUpgrades).length} Dark Matter upgrades and updated balance.json`);

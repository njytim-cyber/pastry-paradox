
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const BALANCE_PATH = path.join(__dirname, '../src/data/balance.json');
const MANIFEST_PATH = path.join(__dirname, '../src/assets/asset-manifest.json');

// Constants matching useAchievementSystem.js
const TIERS = [
    { count: 1, suffix: 'I', material: 'Bronze' },
    { count: 10, suffix: 'II', material: 'Silver' },
    { count: 25, suffix: 'III', material: 'Gold' },
    { count: 50, suffix: 'IV', material: 'Diamond' },
    { count: 100, suffix: 'V', material: 'Neon' },
    { count: 200, suffix: 'VI', material: 'Cosmic' },
    { count: 500, suffix: 'VII', material: 'Ethereal' },
];

const BAKED_MILESTONES = [
    { value: 1000, name: "Thousand", material: "Bronze" },
    { value: 1000000, name: "Million", material: "Silver" },
    { value: 1000000000, name: "Billion", material: "Gold" },
    { value: 1000000000000, name: "Trillion", material: "Diamond" },
    { value: 1000000000000000, name: "Quadrillion", material: "Neon" },
    { value: 1000000000000000000, name: "Quintillion", material: "Cosmic" },
];

const CLICK_MILESTONES = [100, 1000, 10000, 100000];
const CLICK_MATERIALS = ['Bronze', 'Silver', 'Gold', 'Diamond'];

// Load Data
const balanceData = JSON.parse(fs.readFileSync(BALANCE_PATH, 'utf-8'));
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

// Generate Achievement List
const achievements = [];

// 1. Building Achievements
balanceData.productionTiers.forEach(building => {
    TIERS.forEach(tier => {
        achievements.push({
            id: `ach_build_${building.id}_${tier.count}`,
            prompt: `${tier.material} medal featuring ${building.name} icon, 3d render, game icon style`
        });
    });
});

// 2. Total Baked Achievements
BAKED_MILESTONES.forEach((milestone, index) => {
    achievements.push({
        id: `ach_bake_${index}`,
        prompt: `${milestone.material} trophy cup, 3d render, game icon style`
    });
});

// 3. Click Achievements
CLICK_MILESTONES.forEach((val, idx) => {
    const material = CLICK_MATERIALS[idx] || 'Gold';
    achievements.push({
        id: `ach_click_${idx}`,
        prompt: `${material} cursor medal, 3d render, game icon style`
    });
});

// Update Manifest
manifest.achievements = achievements;

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(`✅ Populated ${achievements.length} achievements into asset-manifest.json`);

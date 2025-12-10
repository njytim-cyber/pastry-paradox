
/**
 * scripts/fill-dummy-assets.js
 * Creates placeholder SVGs for any missing Dark Matter icons
 * ensuring the game doesn't crash or look broken while generation finishes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.join(__dirname, '../src/assets/icons');

const balanceData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/balance.json'), 'utf-8'));
const upgrades = balanceData.darkMatterUpgrades || {};

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

console.log('🛡️  Checking for missing assets...');

Object.values(upgrades).forEach(u => {
    // Check if any valid image exists
    const extensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
    const exists = extensions.some(ext => fs.existsSync(path.join(ASSETS_DIR, `${u.id}${ext}`)));

    if (!exists) {
        // Create dummy SVG
        const svgContent = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" fill="#1a1a2e" />
    <circle cx="64" cy="64" r="40" stroke="#4a4ae2" stroke-width="4" fill="none" />
    <text x="64" y="70" font-family="Arial" font-size="40" fill="#4a4ae2" text-anchor="middle">?</text>
</svg>`;

        fs.writeFileSync(path.join(ASSETS_DIR, `${u.id}.svg`), svgContent.trim());
        console.log(`✅ Created placeholder for ${u.id}`);
    }
});

console.log('✨ Asset check complete.');

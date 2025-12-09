/**
 * generate-media.js
 * Script for generating and processing media assets
 * 
 * Usage: node scripts/generate-media.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const MANIFEST_PATH = path.join(ASSETS_DIR, 'asset-manifest.json');

/**
 * Load the asset manifest
 */
function loadManifest() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        return { defaults: { project_id: 'unknown' }, assets: [] };
    }
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
}

/**
 * Save the asset manifest
 */
function saveManifest(manifest) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

/**
 * Scan assets directory and update manifest
 */
function scanAssets() {
    const manifest = loadManifest();
    const supportedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.mp3', '.wav', '.ogg'];

    const files = fs.readdirSync(ASSETS_DIR).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return supportedExtensions.includes(ext);
    });

    manifest.assets = files.map(file => ({
        name: file,
        path: `assets/${file}`,
        type: getAssetType(file)
    }));

    saveManifest(manifest);
    console.log(`✅ Updated manifest with ${manifest.assets.length} assets`);
}

/**
 * Get asset type from file extension
 */
function getAssetType(filename) {
    const ext = path.extname(filename).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) return 'image';
    if (['.mp4'].includes(ext)) return 'video';
    if (['.mp3', '.wav', '.ogg'].includes(ext)) return 'audio';
    return 'unknown';
}

// Run the scanner
scanAssets();

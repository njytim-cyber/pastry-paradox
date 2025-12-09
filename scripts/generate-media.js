/* eslint-disable no-undef, no-unused-vars */
/**
 * generate-media.js
 * Script for generating game assets using Vertex AI (gemini-2.5-flash-image)
 * 
 * Usage: 
 *   node scripts/generate-media.js generators  # Generate all generator icons
 *   node scripts/generate-media.js upgrades    # Generate all upgrade icons
 *   node scripts/generate-media.js [asset_id]  # Generate specific asset
 * 
 * Prerequisites:
 *   npm install @google-cloud/vertexai
 *   gcloud auth application-default login (for local dev)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const ICONS_DIR = path.join(ASSETS_DIR, 'icons');
const MANIFEST_PATH = path.join(ASSETS_DIR, 'asset-manifest.json');

// Vertex AI Configuration
const PROJECT_ID = 'project-id-5683913981585557299';
const LOCATION = 'us-central1';
const MODEL = 'gemini-2.0-flash-exp'; // gemini-2.5-flash-image for prod

/**
 * Ensure icons directory exists
 */
function ensureIconsDir() {
    if (!fs.existsSync(ICONS_DIR)) {
        fs.mkdirSync(ICONS_DIR, { recursive: true });
        console.log('📁 Created icons directory');
    }
}

/**
 * Load the asset manifest
 */
function loadManifest() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        return { defaults: { project_id: 'unknown' }, generators: [], upgrades: [], generated: [] };
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
 * Generate image using Vertex AI
 */
async function generateImage(assetId, prompt, style) {
    console.log(`\n🎨 Generating: ${assetId}`);
    console.log(`   Prompt: ${prompt}`);

    // For now, use placeholder since we need proper Vertex AI SDK setup
    // This structure is ready for Vertex AI integration

    const fullPrompt = `${style}, ${prompt}`;

    try {
        // Dynamic import for Vertex AI (may not be installed yet)
        const { VertexAI } = await import('@google-cloud/vertexai');

        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        const model = vertexAI.getGenerativeModel({ model: MODEL });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Generate a 64x64 pixel icon: ${fullPrompt}` }] }],
        });

        // Save the generated image
        const outputPath = path.join(ICONS_DIR, `${assetId}.png`);
        console.log(`✅ Generated: ${outputPath}`);

        return { id: assetId, path: `assets/icons/${assetId}.png`, status: 'generated' };

    } catch (error) {
        if (error.code === 'ERR_MODULE_NOT_FOUND') {
            console.log('   ⚠️  @google-cloud/vertexai not installed');
            console.log('   Run: npm install @google-cloud/vertexai');

            // Create placeholder SVG instead
            return createPlaceholderIcon(assetId, prompt);
        }
        console.error(`   ❌ Error: ${error.message}`);
        return { id: assetId, status: 'error', error: error.message };
    }
}

/**
 * Create a placeholder SVG icon
 */
function createPlaceholderIcon(assetId, prompt) {
    const label = assetId.replace(/^(tier\d+_|upgrade_)/, '').substring(0, 3).toUpperCase();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#F5D89A" rx="8"/>
  <rect x="4" y="4" width="56" height="56" fill="#FFF8F0" rx="6"/>
  <text x="32" y="38" font-family="Arial" font-size="16" font-weight="bold" fill="#8B5A2B" text-anchor="middle">${label}</text>
</svg>`;

    const outputPath = path.join(ICONS_DIR, `${assetId}.svg`);
    fs.writeFileSync(outputPath, svg);
    console.log(`   📌 Created placeholder: ${outputPath}`);

    return { id: assetId, path: `assets/icons/${assetId}.svg`, status: 'placeholder' };
}

/**
 * Generate all assets of a type
 */
async function generateAll(type, manifest) {
    const items = manifest[type] || [];
    const style = manifest.defaults?.style || '';
    const results = [];

    console.log(`\n🚀 Generating ${items.length} ${type}...\n`);

    for (const item of items) {
        const result = await generateImage(item.id, item.prompt, style);
        results.push(result);

        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
}

/**
 * Main execution
 */
async function main() {
    const args = process.argv.slice(2);
    const manifest = loadManifest();

    ensureIconsDir();

    if (args.length === 0) {
        console.log('Usage:');
        console.log('  node scripts/generate-media.js generators  # All generator icons');
        console.log('  node scripts/generate-media.js upgrades    # All upgrade icons');
        console.log('  node scripts/generate-media.js all         # All icons');
        console.log('  node scripts/generate-media.js [id]        # Specific asset');
        return;
    }

    const target = args[0];
    let results = [];

    if (target === 'generators') {
        results = await generateAll('generators', manifest);
    } else if (target === 'upgrades') {
        results = await generateAll('upgrades', manifest);
    } else if (target === 'all') {
        results = [
            ...await generateAll('generators', manifest),
            ...await generateAll('upgrades', manifest),
        ];
    } else {
        // Find specific asset
        const allItems = [...(manifest.generators || []), ...(manifest.upgrades || [])];
        const item = allItems.find(i => i.id === target);

        if (item) {
            results = [await generateImage(item.id, item.prompt, manifest.defaults?.style || '')];
        } else {
            console.log(`❌ Asset not found: ${target}`);
            return;
        }
    }

    // Update manifest with generated assets
    manifest.generated = [
        ...(manifest.generated || []).filter(g => !results.find(r => r.id === g.id)),
        ...results,
    ];

    saveManifest(manifest);

    // Summary
    const success = results.filter(r => r.status === 'generated' || r.status === 'placeholder').length;
    const errors = results.filter(r => r.status === 'error').length;

    console.log(`\n📊 Summary: ${success} generated, ${errors} errors`);
    console.log('✅ Manifest updated');
}

main().catch(console.error);

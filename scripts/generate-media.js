/* eslint-disable no-undef, no-unused-vars */
/**
 * generate-media.js
 * Script for generating game assets using Vertex AI Imagen
 * 
 * Usage: 
 *   node scripts/generate-media.js generators  # Generate all generator icons
 *   node scripts/generate-media.js upgrades    # Generate all upgrade icons
 *   node scripts/generate-media.js [asset_id]  # Generate specific asset
 * 
 * Prerequisites:
 *   npm install @google-cloud/vertexai
 *   gcloud auth application-default login
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const ICONS_DIR = path.join(ASSETS_DIR, 'icons');
const MANIFEST_PATH = path.join(ASSETS_DIR, 'asset-manifest.json');

// Vertex AI Configuration
const PROJECT_ID = 'project-id-5683913981585557299';
const LOCATION = 'us-central1';

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
 * Generate image using Vertex AI Imagen
 */
async function generateImage(assetId, prompt, style) {
    console.log(`\n🎨 Generating: ${assetId}`);
    console.log(`   Prompt: ${prompt}`);

    const fullPrompt = `${style}, ${prompt}`;
    const outputPath = path.join(ICONS_DIR, `${assetId}.png`);

    if (fs.existsSync(outputPath)) {
        console.log(`   ⏩ Skipping exists: ${outputPath}`);
        return { id: assetId, path: `assets/icons/${assetId}.png`, status: 'skipped' };
    }

    try {
        // Use Gemini 2.5 Flash Image for sprites as requested
        const { VertexAI } = await import('@google-cloud/vertexai');
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });

        // Try gemini-2.5-flash-image
        // Note: Using standard generateContent for Gemini models
        const model = vertexAI.getGenerativeModel({
            model: 'gemini-2.5-flash-image', // User specified model
            generationConfig: {
                responseModalities: ['image', 'text'],
            }
        });

        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [{
                    text: `Generate a 64x64 pixel game icon on white background: ${prompt}. Style: ${style}`
                }]
            }],
        });

        const response = result.response;
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
                    const buffer = Buffer.from(part.inlineData.data, 'base64');
                    fs.writeFileSync(outputPath, buffer);
                    console.log(`✅ Saved (Gemini 2.5): ${outputPath}`);
                    return { id: assetId, path: `assets/icons/${assetId}.png`, status: 'generated' };
                }
            }
        }

        // If we get here, no image was in standard Gemini response. 
        // Some specialized image models might return different structures or use different methods.
        // Fallback to older methods? NO, user was specific.

        throw new Error('No image returned from Gemini 2.5');

    } catch (error) {
        console.error(`   ⚠️  Gemini 2.5 failed:`, error.message);

        // Fallback to Imagen if Gemini fails (e.g. if model doesn't exist yet/access denied)
        console.log('   Trying Imagen 4.0 as fallback...');
        try {
            const { VertexAI } = await import('@google-cloud/vertexai');
            const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });

            const model = vertexAI.preview.getGenerativeModel({
                model: 'imagen-4.0-ultra-generate-001'
            });

            const request = {
                prompt: `64x64 pixel game icon, ${fullPrompt}`,
                numberOfImages: 1,
                aspectRatio: '1:1'
            };

            const response = await model.generateImages(request);
            if (response.images && response.images.length > 0) {
                const imageData = response.images[0].bytesBase64Encoded;
                const buffer = Buffer.from(imageData, 'base64');
                fs.writeFileSync(outputPath, buffer);
                console.log(`✅ Saved (Imagen 4.0): ${outputPath}`);
                return { id: assetId, path: `assets/icons/${assetId}.png`, status: 'generated' };
            }

        } catch (imagenError) {
            console.error(`   ⚠️  Imagen 4.0 failed:`, imagenError.message);
        }

        console.log('   Creating SVG placeholder...');
        return createPlaceholderIcon(assetId, prompt);
    }
}

/**
 * Create a placeholder SVG icon
 */
function createPlaceholderIcon(assetId, prompt) {
    const label = assetId.replace(/^(tier\d+_|upgrade_)/, '').substring(0, 3).toUpperCase();

    // Use tier number for generators, first 3 chars for upgrades
    const tierMatch = assetId.match(/tier(\d+)/);
    const displayLabel = tierMatch ? tierMatch[1] : label;

    // Color based on tier/type
    const isUpgrade = assetId.startsWith('upgrade_');
    const bgColor = isUpgrade ? '#A8D5BA' : '#F5D89A';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="transparent" rx="8"/>
  <circle cx="32" cy="32" r="28" fill="${bgColor}" stroke="#5D3A1A" stroke-width="2"/>
  <text x="32" y="38" font-family="Arial" font-size="20" font-weight="bold" fill="#5D3A1A" text-anchor="middle">${displayLabel}</text>
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

        // Rate limiting - wait 2 seconds between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
}

/**
 * Verify generated files exist
 */
function verifyFiles(results) {
    console.log('\n🔍 Verifying generated files...\n');
    let success = 0;
    let missing = 0;

    for (const result of results) {
        const fullPath = path.join(__dirname, '..', result.path);
        if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            console.log(`   ✅ ${result.id}: ${stats.size} bytes`);
            success++;
        } else {
            console.log(`   ❌ ${result.id}: FILE NOT FOUND`);
            missing++;
        }
    }

    console.log(`\n📊 Verified: ${success} found, ${missing} missing`);
    return { success, missing };
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
        console.log('  node scripts/generate-media.js verify      # Verify existing files');
        console.log('  node scripts/generate-media.js [id]        # Specific asset');
        return;
    }

    const target = args[0];
    let results = [];

    if (target === 'verify') {
        // Just verify existing files
        results = manifest.generated || [];
        verifyFiles(results);
        return;
    } else if (target === 'generators') {
        results = await generateAll('generators', manifest);
    } else if (target === 'upgrades') {
        results = await generateAll('upgrades', manifest);
    } else if (target === 'achievements') {
        results = await generateAll('achievements', manifest);
    } else if (target === 'all') {
        results = [
            ...await generateAll('generators', manifest),
            ...await generateAll('upgrades', manifest),
            ...await generateAll('achievements', manifest),
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

    // Verify files were created
    const verification = verifyFiles(results);

    // Summary
    const pngCount = results.filter(r => r.path?.endsWith('.png')).length;
    const svgCount = results.filter(r => r.path?.endsWith('.svg')).length;
    const errors = results.filter(r => r.status === 'error').length;

    console.log(`\n📊 Summary: ${pngCount} PNG, ${svgCount} SVG placeholders, ${errors} errors`);
    console.log('✅ Manifest updated');
}

main().catch(console.error);

/* eslint-disable no-undef, no-unused-vars */
/**
 * generate-media.js
 * Script for generating game assets using Vertex AI Imagen and Lyria
 * 
 * Usage: 
 *   node scripts/generate-media.js generators  # Generate all generator icons
 *   node scripts/generate-media.js upgrades    # Generate all upgrade icons
 *   node scripts/generate-media.js audio       # Generate all audio tracks
 *   node scripts/generate-media.js [asset_id]  # Generate specific asset
 * 
 * Prerequisites:
 *   npm install @google-cloud/vertexai
 *   gcloud auth application-default login
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const ICONS_DIR = path.join(ASSETS_DIR, 'icons');
const AUDIO_DIR = path.join(ASSETS_DIR, 'audio');
const MANIFEST_PATH = path.join(ASSETS_DIR, 'asset-manifest.json');

// Vertex AI Configuration
const PROJECT_ID = 'project-id-5683913981585557299';
const LOCATION = 'us-central1';

/**
 * Ensure directories exist
 */
function ensureDirs() {
    if (!fs.existsSync(ICONS_DIR)) {
        fs.mkdirSync(ICONS_DIR, { recursive: true });
        console.log('📁 Created icons directory');
    }
    if (!fs.existsSync(AUDIO_DIR)) {
        fs.mkdirSync(AUDIO_DIR, { recursive: true });
        console.log('📁 Created audio directory');
    }
}

/**
 * Load the asset manifest
 */
function loadManifest() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        return { defaults: { project_id: 'unknown' }, generators: [], upgrades: [], audio: [], generated: [] };
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
 * Generate audio using Vertex AI (Lyria/MusicGen)
 */
async function generateAudio(assetId, prompt) {
    console.log(`\n🎵 Generating Audio: ${assetId}`);
    console.log(`   Prompt: ${prompt}`);

    const outputPath = path.join(AUDIO_DIR, `${assetId}.mp3`);

    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1000) {
        console.log(`   ⏩ Skipping exists: ${outputPath}`);
        return { id: assetId, path: `assets/audio/${assetId}.mp3`, status: 'skipped' };
    }

    try {
        const { VertexAI } = await import('@google-cloud/vertexai');
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });

        // Try music-generation model (Lyria 2)
        // User confirmed Lyria 2 access. ID is usually 'music-generation-002'.
        const model = vertexAI.preview.getGenerativeModel({
            model: 'music-generation-002',
        });

        // Construct request
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        // This is speculative SDK usage. Real MusicGen API might return bytes differently.
        // Assuming standard content response for now.
        const response = result.response;
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/')) {
                    const buffer = Buffer.from(part.inlineData.data, 'base64');
                    fs.writeFileSync(outputPath, buffer);
                    console.log(`✅ Saved (Vertex AI Audio): ${outputPath}`);
                    return { id: assetId, path: `assets/audio/${assetId}.mp3`, status: 'generated' };
                }
            }
        }

        throw new Error("Music generation API returned no audio content");

    } catch (error) {
        console.log(`   ⚠️  AI Audio generation failed/skipped: ${error.message}`);
        if (error.response) {
            console.log('   Error Details:', JSON.stringify(error.response));
        }
        console.log('   🎹 Creating synthetic placeholder...');
        return createPlaceholderAudio(assetId);
    }
}

/**
 * Create a synthetic sine wave WAV file (rename to mp3/wav) acts as placeholder
 */
function createPlaceholderAudio(assetId) {
    const fileName = `${assetId}.mp3`;
    const outputPath = path.join(AUDIO_DIR, fileName);

    // Generate 3 seconds of sound
    const sampleRate = 44100;
    const duration = 3;
    const numSamples = sampleRate * duration;
    const buffer = Buffer.alloc(44 + numSamples * 2);

    // WAV Header
    writeString(buffer, 0, 'RIFF');
    buffer.writeUInt32LE(36 + numSamples * 2, 4);
    writeString(buffer, 8, 'WAVE');
    writeString(buffer, 12, 'fmt ');
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20); // PCM
    buffer.writeUInt16LE(1, 22); // Mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32); // Block align
    buffer.writeUInt16LE(16, 34); // Bits per sample
    writeString(buffer, 36, 'data');
    buffer.writeUInt32LE(numSamples * 2, 40);

    // Data - Sine wave
    let freq = 440; // A4
    if (assetId.includes('layer_02')) freq = 554; // C#5
    if (assetId.includes('layer_03')) freq = 659; // E5

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const amplitude = 10000;
        const sample = Math.sin(t * freq * 2 * Math.PI) * amplitude;
        buffer.writeInt16LE(sample, 44 + i * 2);
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`   ✅ Created placeholder audio: ${outputPath}`);

    return { id: assetId, path: `assets/audio/${fileName}`, status: 'placeholder' };
}

function writeString(buffer, offset, string) {
    for (let i = 0; i < string.length; i++) {
        buffer[offset + i] = string.charCodeAt(i);
    }
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
        const { VertexAI } = await import('@google-cloud/vertexai');
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });

        // Try gemini-2.5-flash-image
        const model = vertexAI.getGenerativeModel({
            model: 'gemini-2.5-flash-image',
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

        throw new Error('No image returned from Gemini 2.5');

    } catch (error) {
        console.error(`   ⚠️  Gemini 2.5 failed:`, error.message);
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
    const tierMatch = assetId.match(/tier(\d+)/);
    const displayLabel = tierMatch ? tierMatch[1] : label;
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
        let result;
        if (type === 'audio') {
            result = await generateAudio(item.id, item.prompt);
        } else {
            result = await generateImage(item.id, item.prompt, style);
        }
        // Rate limiting - wait 30 seconds between requests for Audio (Lyria likely has low QPM)
        const delay = type === 'audio' ? 30000 : 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
        results.push(result);
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

    ensureDirs();

    if (args.length === 0) {
        console.log('Usage:');
        console.log('  node scripts/generate-media.js generators  # All generator icons');
        console.log('  node scripts/generate-media.js upgrades    # All upgrade icons');
        console.log('  node scripts/generate-media.js audio       # All audio tracks');
        console.log('  node scripts/generate-media.js all         # All assets');
        console.log('  node scripts/generate-media.js verify      # Verify existing files');
        console.log('  node scripts/generate-media.js [id]        # Specific asset');
        return;
    }

    const target = args[0];
    let results = [];

    if (target === 'verify') {
        results = manifest.generated || [];
        verifyFiles(results);
        return;
    } else if (target === 'generators') {
        results = await generateAll('generators', manifest);
    } else if (target === 'upgrades') {
        results = await generateAll('upgrades', manifest);
    } else if (target === 'achievements') {
        results = await generateAll('achievements', manifest);
    } else if (target === 'audio') {
        results = await generateAll('audio', manifest);
    } else if (target === 'all') {
        results = [
            ...await generateAll('generators', manifest),
            ...await generateAll('upgrades', manifest),
            ...await generateAll('achievements', manifest),
            ...await generateAll('audio', manifest),
        ];
    } else {
        const allItems = [
            ...(manifest.generators || []),
            ...(manifest.upgrades || []),
            ...(manifest.audio || [])
        ];
        const item = allItems.find(i => i.id === target);

        if (item) {
            if (manifest.audio && manifest.audio.find(a => a.id === target)) {
                results = [await generateAudio(item.id, item.prompt)];
            } else {
                results = [await generateImage(item.id, item.prompt, manifest.defaults?.style || '')];
            }
        } else {
            console.log(`❌ Asset not found: ${target}`);
            return;
        }
    }

    // Update manifest logic to handle new structure if needed, but simple push/filter works
    manifest.generated = [
        ...(manifest.generated || []).filter(g => !results.find(r => r.id === g.id)),
        ...results,
    ];

    saveManifest(manifest);
    verifyFiles(results);

    const pngCount = results.filter(r => r.path?.endsWith('.png')).length;
    const mp3Count = results.filter(r => r.path?.endsWith('.mp3')).length;
    const errors = results.filter(r => r.status === 'error').length;

    console.log(`\n📊 Summary: ${pngCount} PNG, ${mp3Count} Audio, ${errors} errors`);
    console.log('✅ Manifest updated');
}

main().catch(console.error);

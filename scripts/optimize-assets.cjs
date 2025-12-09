#!/usr/bin/env node
/**
 * Asset Optimization Script
 * 
 * Optimizes generated PNG icons by:
 * 1. Resizing to target dimensions (default 128x128)
 * 2. Converting to WebP for better compression
 * 3. Optionally keeping optimized PNG as fallback
 * 
 * Usage:
 *   node scripts/optimize-assets.js [options]
 * 
 * Options:
 *   --size=256       Target size in pixels (default: 128)
 *   --quality=80     WebP quality 1-100 (default: 80)
 *   --keep-png       Keep optimized PNG alongside WebP
 *   --dry-run        Show what would be done without changes
 */

const fs = require('fs');
const path = require('path');

// Paths
const ICONS_DIR = path.join(__dirname, '../src/assets/icons');
const OPTIMIZED_DIR = path.join(__dirname, '../src/assets/icons-optimized');

// Parse command line args
const args = process.argv.slice(2);
const getArg = (name, defaultVal) => {
    const arg = args.find(a => a.startsWith(`--${name}=`));
    return arg ? arg.split('=')[1] : defaultVal;
};
const hasFlag = (name) => args.includes(`--${name}`);

const CONFIG = {
    size: parseInt(getArg('size', '128')),
    quality: parseInt(getArg('quality', '80')),
    keepPng: hasFlag('keep-png'),
    dryRun: hasFlag('dry-run'),
};

async function main() {
    console.log('🎨 Asset Optimization Script');
    console.log('━'.repeat(50));
    console.log(`   Target Size: ${CONFIG.size}x${CONFIG.size}`);
    console.log(`   WebP Quality: ${CONFIG.quality}%`);
    console.log(`   Keep PNG: ${CONFIG.keepPng}`);
    console.log(`   Dry Run: ${CONFIG.dryRun}`);
    console.log('━'.repeat(50));

    // Check for sharp
    let sharp;
    try {
        sharp = require('sharp');
    } catch (e) {
        console.error('\n❌ ERROR: sharp is not installed.');
        console.error('   Run: npm install sharp --save-dev\n');
        process.exit(1);
    }

    // Get all PNG files
    if (!fs.existsSync(ICONS_DIR)) {
        console.error(`\n❌ ERROR: Icons directory not found: ${ICONS_DIR}\n`);
        process.exit(1);
    }

    const pngFiles = fs.readdirSync(ICONS_DIR)
        .filter(f => f.endsWith('.png'))
        .map(f => path.join(ICONS_DIR, f));

    console.log(`\n📁 Found ${pngFiles.length} PNG files\n`);

    if (pngFiles.length === 0) {
        console.log('Nothing to optimize.');
        return;
    }

    // Create optimized directory
    if (!CONFIG.dryRun && !fs.existsSync(OPTIMIZED_DIR)) {
        fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
    }

    // Stats
    let totalOriginal = 0;
    let totalOptimized = 0;
    let processed = 0;
    let errors = 0;

    // Process each file
    for (const inputPath of pngFiles) {
        const fileName = path.basename(inputPath);
        const baseName = fileName.replace('.png', '');
        const webpPath = path.join(OPTIMIZED_DIR, `${baseName}.webp`);
        const pngPath = path.join(OPTIMIZED_DIR, `${baseName}.png`);

        try {
            const originalSize = fs.statSync(inputPath).size;
            totalOriginal += originalSize;

            if (CONFIG.dryRun) {
                console.log(`[DRY] Would optimize: ${fileName}`);
                processed++;
                continue;
            }

            // Resize and convert to WebP
            await sharp(inputPath)
                .resize(CONFIG.size, CONFIG.size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .webp({ quality: CONFIG.quality })
                .toFile(webpPath);

            const webpSize = fs.statSync(webpPath).size;
            totalOptimized += webpSize;

            // Optionally keep optimized PNG
            if (CONFIG.keepPng) {
                await sharp(inputPath)
                    .resize(CONFIG.size, CONFIG.size, {
                        fit: 'contain',
                        background: { r: 255, g: 255, b: 255, alpha: 0 }
                    })
                    .png({ compressionLevel: 9 })
                    .toFile(pngPath);
            }

            const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);
            console.log(`✅ ${fileName} → ${(webpSize / 1024).toFixed(0)}KB (${reduction}% smaller)`);
            processed++;

        } catch (err) {
            console.error(`❌ Error processing ${fileName}: ${err.message}`);
            errors++;
        }
    }

    // Summary
    console.log('\n' + '━'.repeat(50));
    console.log('📊 Summary');
    console.log('━'.repeat(50));
    console.log(`   Files Processed: ${processed}/${pngFiles.length}`);
    console.log(`   Errors: ${errors}`);

    if (!CONFIG.dryRun && totalOptimized > 0) {
        const originalMB = (totalOriginal / 1024 / 1024).toFixed(2);
        const optimizedMB = (totalOptimized / 1024 / 1024).toFixed(2);
        const reduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);

        console.log(`   Original Size: ${originalMB} MB`);
        console.log(`   Optimized Size: ${optimizedMB} MB`);
        console.log(`   Total Reduction: ${reduction}%`);
        console.log(`\n   Output: ${OPTIMIZED_DIR}`);
    }

    console.log('');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});

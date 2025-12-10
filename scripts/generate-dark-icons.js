
/**
 * scripts/generate-dark-icons.js
 * Generates icons for Dark Matter upgrades using Vertex AI (Gemini 2.5)
 * Enforces 128x128 size via Sharp optimization.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
/* eslint-env node */
import { VertexAI } from '@google-cloud/vertexai';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const ICONS_DIR = path.join(ASSETS_DIR, 'icons');
const BALANCE_PATH = path.join(__dirname, '../src/data/balance.json');

// Configuration
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'project-id-5683913981585557299';
const LOCATION = 'us-central1';
const MODEL_NAME = 'gemini-2.5-flash-image';

// Ensure directories
if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Load upgrades
const balanceData = JSON.parse(fs.readFileSync(BALANCE_PATH, 'utf-8'));
const upgrades = balanceData.darkMatterUpgrades || {};

// Helper for delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateIcon(id, name, description) {
    const finalPath = path.join(ICONS_DIR, `${id}.jpeg`);

    if (fs.existsSync(finalPath)) {
        console.log(`⏩ Skipping ${id}: Exists`);
        return;
    }

    // Check if optimized webp exists from previous workflows
    const webpPath = path.join(ICONS_DIR, `${id}.webp`);
    if (fs.existsSync(webpPath)) {
        console.log(`⏩ Skipping ${id}: Optimized WebP exists`);
        return;
    }

    console.log(`🎨 Generating ${id}: ${name}...`);

    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });

            const model = vertexAI.getGenerativeModel({
                model: MODEL_NAME,
                generationConfig: {
                    responseModalities: ['image', 'text']
                }
            });

            const prompt = `64x64 pixel game icon, ${name}, ${description}, dark matter theme, cosmic style, on black background, pixel art or 3d render style, high contrast icon`;

            const result = await model.generateContent({
                contents: [{
                    role: 'user',
                    parts: [{ text: prompt }]
                }]
            });

            const response = result.response;
            let saved = false;

            if (response.candidates && response.candidates[0].content.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
                        const rawBuffer = Buffer.from(part.inlineData.data, 'base64');

                        try {
                            // Process with Sharp: Resize & Convert to JPEG
                            // We use .jpeg() with custom quality to suppress file size
                            const finalBuffer = await sharp(rawBuffer)
                                .resize(128, 128, { fit: 'cover' })
                                .jpeg({ quality: 80, mozjpeg: true })
                                .toBuffer();

                            fs.writeFileSync(finalPath, finalBuffer);
                            console.log(`✅ Saved optimized JPEG: ${finalPath}`);
                            saved = true;
                        } catch (sharpError) {
                            console.error(`⚠️ Sharp failed for ${id}:`, sharpError.message);
                            // Fallback to raw if sharp fails
                            const ext = part.inlineData.mimeType === 'image/png' ? '.png' : '.jpeg';
                            const fallbackPath = path.join(ICONS_DIR, `${id}${ext}`);
                            fs.writeFileSync(fallbackPath, rawBuffer);
                            console.log(`✅ Saved RAW (Fallback): ${fallbackPath}`);
                            saved = true;
                        }

                        if (saved) break; // Exit loop over parts
                    }
                }
            }

            if (saved) return; // Success, exit function

            console.error(`❌ No image returned for ${id}`);
            return; // Logic error (no image in response), don't retry blindly without change

        } catch (error) {
            // Check for 429 or quota errors
            if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
                attempts++;
                const delay = 10000 * Math.pow(2, attempts); // 20s, 40s, 80s... aggressive backoff
                console.warn(`⏳ Rate limited on ${id}. Retrying in ${delay / 1000}s (Attempt ${attempts}/${maxAttempts})...`);
                await sleep(delay);
            } else {
                console.error(`❌ Error generating ${id}:`, error.message);
                return; // Non-retriable?
            }
        }
    }
    if (attempts >= maxAttempts) {
        console.error(`❌ Failed to generate ${id} after ${maxAttempts} attempts.`);
    }
}

async function main() {
    console.log(`🚀 Starting Dark Matter Icon Generation for ${Object.keys(upgrades).length} items...`);

    // Process in chunks to avoid rate limits (1 at a time to be safe)
    const CHUNK_SIZE = 1;
    const items = Object.values(upgrades); // Iterate values

    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
        const chunk = items.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(u => generateIcon(u.id, u.name, u.description)));

        if (i + CHUNK_SIZE < items.length) {
            // console.log('⏳ Cooling down...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log('✨ Generation Complete. Run `node scripts/optimize-assets.cjs` next.');
}

main().catch(console.error);

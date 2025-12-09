const fs = require('fs');
const path = require('path');

const BALANCE_PATH = path.join(__dirname, '../src/data/balance.json');
const MANIFEST_PATH = path.join(__dirname, '../src/assets/asset-manifest.json');

try {
    const balance = JSON.parse(fs.readFileSync(BALANCE_PATH, 'utf8'));
    let manifest = { generators: [], upgrades: [], achievements: [], audio: [], defaults: { style: "flat vector art, cute, vibrant colors, white background" } };

    if (fs.existsSync(MANIFEST_PATH)) {
        manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    }

    const existingIds = new Set((manifest.upgrades || []).map(u => u.id));
    let addedCount = 0;

    // Process Upgrades
    for (const [id, upgrade] of Object.entries(balance.upgrades)) {
        if (!existingIds.has(id)) {
            // Generate a prompt based on name and description
            const prompt = `${upgrade.name} icon. ${upgrade.description}. High quality game asset.`;

            if (!manifest.upgrades) manifest.upgrades = [];
            manifest.upgrades.push({
                id: id,
                prompt: prompt
            });
            addedCount++;
        }
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`Synced ${addedCount} new upgrades to manifest.`);

} catch (e) {
    console.error("Error syncing manifest:", e);
}

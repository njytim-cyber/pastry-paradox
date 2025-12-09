/* eslint-env node */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import balanceData from './data/balance.json';

const ASSETS_DIR = path.resolve(process.cwd(), 'src/assets/icons');

describe('Asset Coverage', () => {
    // Helper to check if file exists with supported extensions
    const assetExists = (id) => {
        const extensions = ['.png', '.svg', '.jpg', '.jpeg'];
        // Check for direct match or fuzzy match (since generation script might use exact IDs)
        // StorePanel logic matches if filename *includes* ID.
        // But for strict coverage, we should expect a file named `{id}.{ext}` or similar.

        // Let's check strict existence first
        for (const ext of extensions) {
            if (fs.existsSync(path.join(ASSETS_DIR, `${id}${ext}`))) return true;
        }

        // Check fallback: file starting with `upgrade_` if id doesn't have it? 
        // Or file having `upgrade_` prefix.
        if (fs.existsSync(path.join(ASSETS_DIR, `upgrade_${id}.png`))) return true;
        if (fs.existsSync(path.join(ASSETS_DIR, `upgrade_${id}.svg`))) return true;

        // Check loose match in directory (slower but accurate to app logic)
        try {
            const files = fs.readdirSync(ASSETS_DIR);
            return files.some(file => file.includes(id));
        } catch (e) {
            return false;
        }
    };

    it('should have an icon for every generator tier', () => {
        const missing = [];
        // Handle potentially wrapped default export
        const tiers = balanceData.productionTiers || balanceData.default?.productionTiers || [];

        tiers.forEach(tier => {
            if (!assetExists(tier.id)) {
                missing.push(tier.id);
            }
        });

        if (missing.length > 0) {
            console.warn('Missing Upgrade Icons:', missing);
        }
        expect(missing, `Missing icons for upgrades: ${missing.join(', ')}`).toEqual([]);
    });
});

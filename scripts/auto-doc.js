/**
 * auto-doc.js
 * Script for generating project documentation
 * 
 * Usage: npm run docs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');

/**
 * Ensure docs directory exists
 */
function ensureDocsDir() {
    if (!fs.existsSync(DOCS_DIR)) {
        fs.mkdirSync(DOCS_DIR, { recursive: true });
    }
}

/**
 * Generate component glossary from src directory
 */
function generateComponentGlossary() {
    const srcDir = path.join(PROJECT_ROOT, 'src');
    const components = [];

    function scanDir(dir, prefix = '') {
        if (!fs.existsSync(dir)) return;

        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                scanDir(fullPath, `${prefix}${item}/`);
            } else if (item.endsWith('.jsx') || item.endsWith('.tsx')) {
                components.push({
                    name: item.replace(/\.(jsx|tsx)$/, ''),
                    path: `${prefix}${item}`
                });
            }
        });
    }

    scanDir(srcDir);

    const glossaryContent = `# Component Glossary

> Auto-generated on ${new Date().toISOString()}

## Components

${components.map(c => `- **${c.name}** - \`src/${c.path}\``).join('\n')}
`;

    fs.writeFileSync(path.join(DOCS_DIR, 'component_glossary.md'), glossaryContent);
    console.log(`✅ Generated component glossary with ${components.length} components`);
}

/**
 * Generate balance schema documentation from balance.json
 */
function generateBalanceSchema() {
    const balancePath = path.join(PROJECT_ROOT, 'src', 'data', 'balance.json');

    if (!fs.existsSync(balancePath)) {
        console.warn('⚠️  balance.json not found, skipping schema generation');
        return;
    }

    const balanceData = JSON.parse(fs.readFileSync(balancePath, 'utf8'));
    const dataDir = path.join(DOCS_DIR, 'data');

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const schemaContent = `# Balance Schema

> Auto-generated on ${new Date().toISOString()}
> Source: \`src/data/balance.json\`

## Version
${balanceData.version}

## Global Configuration
| Property | Value | Description |
|----------|-------|-------------|
| Universal Constant | ${balanceData.globalConfig.universalConstant} | The sacred number 67 |
| Currency Name | ${balanceData.globalConfig.currencyName} | In-game currency |
| FPS | ${balanceData.globalConfig.fps} | Game loop frame rate |
| Cost Multiplier | ${balanceData.globalConfig.costMultiplier} | Price scaling factor |
| Sell Refund Rate | ${balanceData.globalConfig.sellRefundRate} | Percentage refunded on sale |
| Upgrade Visibility Threshold | ${balanceData.globalConfig.upgradeVisibilityThreshold} | When upgrades become visible |

## Production Tiers
Total tiers: ${balanceData.productionTiers.length}

| Tier | ID | Name | Base Cost | Base CPS |
|------|-----|------|-----------|----------|
${balanceData.productionTiers.map(tier =>
        `| ${tier.tier} | \`${tier.id}\` | ${tier.name} | ${tier.baseCost.toLocaleString()} | ${tier.baseCps.toLocaleString()} |`
    ).join('\n')}

## Upgrades
Total upgrades: ${Object.keys(balanceData.upgrades).length}

${Object.entries(balanceData.upgrades).map(([_key, upgrade]) => {
        const effectType = upgrade.effect.type;
        const effectValue = upgrade.effect.value;
        const effectTier = upgrade.effect.tier !== undefined ? ` (Tier ${upgrade.effect.tier})` : '';
        return `### ${upgrade.name}
- **ID**: \`${upgrade.id}\`
- **Cost**: ${upgrade.cost.toLocaleString()}
- **Effect**: ${effectType}${effectTier} - ${effectValue}x
- **Description**: ${upgrade.description}`;
    }).join('\n\n')}

## Events
${Object.entries(balanceData.events).map(([_key, event]) => `### ${event.name}
- **ID**: \`${event.id}\`
- **Spawn Interval**: ${event.spawnIntervalMin}s - ${event.spawnIntervalMax}s
- **Duration**: ${event.duration}s
- **Multiplier**: ${event.multiplier}x
- **Description**: ${event.description}`).join('\n\n')}

## Entities
${Object.entries(balanceData.entities).map(([key, entity]) => `### ${key}
- **Base Click Power**: ${entity.baseClickPower}
- **Base Speed**: ${entity.baseSpeed}`).join('\n\n')}

## Prestige System
- **Required Baked**: ${balanceData.prestige.requiredBaked.toLocaleString()}
- **CPS Bonus Per Point**: ${balanceData.prestige.cpsBonusPerPoint}
`;

    fs.writeFileSync(path.join(dataDir, 'balance_schema.md'), schemaContent);
    console.log('✅ Generated balance schema documentation');
}

// Run documentation generation
ensureDocsDir();
generateComponentGlossary();
generateBalanceSchema();
console.log('📚 Documentation generated successfully!');

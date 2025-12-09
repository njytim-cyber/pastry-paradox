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

// Run documentation generation
ensureDocsDir();
generateComponentGlossary();
console.log('📚 Documentation generated successfully!');

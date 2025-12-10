// Generate 4-arm spiral galaxy positions for Dark Matter Tree
const fs = require('fs');
const path = require('path');

// Read balance.json
const balancePath = path.join(__dirname, '../src/data/balance.json');
const balanceText = fs.readFileSync(balancePath, 'utf8');
const data = JSON.parse(balanceText);

const nodes = Object.entries(data.darkMatterUpgrades || {});
console.log(`Total nodes: ${nodes.length}`);

// Separate core and branches
const core = nodes.filter(([id, node]) => !node.branch);
const branches = {
    matter: nodes.filter(([id, node]) => node.branch === 'matter'),
    energy: nodes.filter(([id, node]) => node.branch === 'energy'),
    time: nodes.filter(([id, node]) => node.branch === 'time'),
    click: nodes.filter(([id, node]) => node.branch === 'click')
};

console.log('Branches:', Object.keys(branches).map(b => `${b}: ${branches[b].length}`).join(', '));

// 4-arm spiral parameters
const SPACING = 120; // Distance between nodes along spiral
const SPIRAL_TIGHTNESS = 0.3; // How tight the spiral is (lower = tighter)
const ARM_OFFSET = (Math.PI * 2) / 4; // 90 degrees for 4 arms

// Logarithmic spiral formula: r = a + b*θ
function spiralPosition(index, armIndex) {
    const theta = index * SPIRAL_TIGHTNESS + (armIndex * ARM_OFFSET);
    const r = SPACING * (1 + index * 0.8); // Start at SPACING, increase

    return {
        x: Math.round(r * Math.cos(theta)),
        y: Math.round(r * Math.sin(theta))
    };
}

// Assign positions
// Core at center
core.forEach(([id, node]) => {
    node.position = { x: 0, y: 0 };
    console.log(`${id}: core -> (0, 0)`);
});

// Distribute branches across 4 arms
const branchNames = ['matter', 'energy', 'time', 'click'];
branchNames.forEach((branch, armIndex) => {
    branches[branch].forEach(([id, node], nodeIndex) => {
        node.position = spiralPosition(nodeIndex, armIndex);
        console.log(`${id}: arm ${armIndex}, index ${nodeIndex} -> (${node.position.x}, ${node.position.y})`);
    });
});

// Write back
fs.writeFileSync(balancePath, JSON.stringify(data, null, 4));
console.log('\n✅ Updated balance.json with spiral positions');

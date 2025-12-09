const fs = require('fs');
const path = require('path');

const balancePath = path.join(__dirname, '../src/data/balance.json');
const newUpgradesPath = path.join(__dirname, '../new_upgrades.json');

try {
    const balance = JSON.parse(fs.readFileSync(balancePath, 'utf8'));
    const newUpgrades = JSON.parse(fs.readFileSync(newUpgradesPath, 'utf8'));

    // Merge upgrades
    // check for collision
    let collisionCount = 0;
    for (const [key, value] of Object.entries(newUpgrades)) {
        if (balance.upgrades[key]) {
            console.warn(`Collision or override for key: ${key}`);
            collisionCount++;
        }
        balance.upgrades[key] = value;
    }

    fs.writeFileSync(balancePath, JSON.stringify(balance, null, 4));
    console.log(`Successfully merged ${Object.keys(newUpgrades).length} upgrades. Collisions: ${collisionCount}`);

} catch (e) {
    console.error("Error merging:", e);
    process.exit(1);
}

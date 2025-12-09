/**
 * useAchievementSystem.js
 * Logic for generating, tracking, and unlocking achievements
 */
import { useState, useEffect } from 'react';
import balanceData from '@data/balance.json';

const { productionTiers } = balanceData;

// Constants for generation
const TIERS = [
    { count: 1, suffix: 'I', material: 'Bronze' },
    { count: 10, suffix: 'II', material: 'Silver' },
    { count: 25, suffix: 'III', material: 'Gold' },
    { count: 50, suffix: 'IV', material: 'Diamond' },
    { count: 100, suffix: 'V', material: 'Neon' },
    { count: 200, suffix: 'VI', material: 'Cosmic' },
    { count: 500, suffix: 'VII', material: 'Ethereal' },
];

const BAKED_MILESTONES = [
    { value: 1000, name: "Thousand", material: "Bronze" },
    { value: 1000000, name: "Million", material: "Silver" },
    { value: 1000000000, name: "Billion", material: "Gold" },
    { value: 1000000000000, name: "Trillion", material: "Diamond" },
    { value: 1000000000000000, name: "Quadrillion", material: "Neon" },
    { value: 1000000000000000000, name: "Quintillion", material: "Cosmic" },
    // Add more as needed for late game
];

/**
 * Generate the static list of all possible achievements
 */
const generateAchievements = () => {
    const list = [];

    // 1. Building Achievements
    productionTiers.forEach(building => {
        TIERS.forEach(tier => {
            list.push({
                id: `ach_build_${building.id}_${tier.count}`,
                name: `${building.name} ${tier.suffix}`,
                description: `Own ${tier.count} ${building.name}s.`,
                type: 'building',
                targetId: building.id,
                targetValue: tier.count,
                iconPrompt: `${tier.material} medal featuring ${building.name} icon, 3d render, game icon style`,
                material: tier.material
            });
        });
    });

    // 2. Total Baked Achievements
    BAKED_MILESTONES.forEach((milestone, index) => {
        list.push({
            id: `ach_bake_${index}`,
            name: `Bake a ${milestone.name}`,
            description: `Bake ${milestone.name} total cakes.`,
            type: 'totalBaked',
            targetValue: milestone.value,
            iconPrompt: `${milestone.material} trophy cup, 3d render, game icon style`,
            material: milestone.material
        });
    });

    // 3. Click Achievements
    const CLICK_MILESTONES = [100, 1000, 10000, 100000];
    const CLICK_MATERIALS = ['Bronze', 'Silver', 'Gold', 'Diamond'];
    CLICK_MILESTONES.forEach((val, idx) => {
        list.push({
            id: `ach_click_${idx}`,
            name: `Clicker ${idx + 1}`,
            description: `Click the big cake ${val} times.`,
            type: 'clicks',
            targetValue: val,
            iconPrompt: `${CLICK_MATERIALS[idx] || 'Gold'} cursor medal, 3d render, game icon style`,
            material: CLICK_MATERIALS[idx] || 'Gold'
        });
    });

    return list;
};

const ALL_ACHIEVEMENTS = generateAchievements();

export function useAchievementSystem({
    totalBaked = 0,
    generators = [],
    totalClicks = 0
}) {
    // Only store IDs of unlocked achievements to save space
    const [unlockedIds, setUnlockedIds] = useState(() => {
        const saved = localStorage.getItem('pastry_achievements');
        return saved ? JSON.parse(saved) : [];
    });

    const [newUnlockQueue, setNewUnlockQueue] = useState([]);

    // Check for unlocks
    useEffect(() => {
        const newUnlocks = [];

        ALL_ACHIEVEMENTS.forEach(ach => {
            if (unlockedIds.includes(ach.id)) return;

            let unlocked = false;

            if (ach.type === 'building') {
                const building = generators.find(g => g.id === ach.targetId);
                if (building && building.owned >= ach.targetValue) {
                    unlocked = true;
                }
            } else if (ach.type === 'totalBaked') {
                if (totalBaked >= ach.targetValue) {
                    unlocked = true;
                }
            } else if (ach.type === 'clicks') {
                if (totalClicks >= ach.targetValue) {
                    unlocked = true;
                }
            }

            if (unlocked) {
                newUnlocks.push(ach.id);
            }
        });

        if (newUnlocks.length > 0) {
            setUnlockedIds(prev => {
                const updated = [...prev, ...newUnlocks];
                localStorage.setItem('pastry_achievements', JSON.stringify(updated));
                return updated;
            });

            // Queue notifications
            const fullAchData = newUnlocks.map(id => ALL_ACHIEVEMENTS.find(a => a.id === id));
            setNewUnlockQueue(prev => [...prev, ...fullAchData]);
        }
    }, [totalBaked, generators, totalClicks, unlockedIds]);

    const popNotification = () => {
        setNewUnlockQueue(prev => prev.slice(1));
    };

    return {
        allAchievements: ALL_ACHIEVEMENTS,
        unlockedIds,
        unlockCount: unlockedIds.length,
        totalCount: ALL_ACHIEVEMENTS.length,
        newUnlockQueue,
        popNotification
    };
}

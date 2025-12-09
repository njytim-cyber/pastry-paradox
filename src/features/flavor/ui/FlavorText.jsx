/**
 * FlavorText - Funny context-aware messages
 * View Component (NO LOGIC)
 */
import React, { useState, useEffect, useMemo } from 'react';

// Message pools based on game state
const MESSAGES = {
    start: [
        "You feel like making cakes. But nobody wants to eat your cakes.",
        "The oven is cold. Your dreams are warm.",
        "A single cake sits on the counter, judging you.",
        "The flour awaits your command.",
        "67 is just a number... for now.",
    ],
    early: [
        "The butter is getting excited.",
        "Your kitchen smells like ambition.",
        "Grandma would be proud. Probably.",
        "The mixer hums a tune of progress.",
        "Cakes per second? More like cakes per LEGEND.",
    ],
    mid: [
        "The factory workers have unionized. They want more frosting breaks.",
        "Your cakes have achieved local fame.",
        "Scientists are studying your flour technique.",
        "The 67 gesture becomes muscle memory.",
        "Somewhere, a croissant weeps with jealousy.",
    ],
    late: [
        "Reality itself bends to your baking prowess.",
        "Philosophers debate the meaning of your cakes.",
        "Time is relative. Cake is absolute.",
        "The universe was created from leftover frosting.",
        "You've transcended mere baking. You are become cake.",
    ],
    prestige: [
        "You reset everything, yet the cakes remember.",
        "Legacy points taste like victory... and vanilla.",
        "Ascension complete. The flour is pleased.",
        "Your past self would be confused, but impressed.",
    ],
    goldenActive: [
        "🥐 THE GOLDEN CROISSANT BLESSES YOU! 🥐",
        "67x EVERYTHING! BAKE LIKE THERE'S NO TOMORROW!",
        "The croissant gods smile upon your bakery!",
    ],
    milestone67: [
        "67! The sacred number appears!",
        "Palms up. Palms down. The dough understands.",
        "The weighing gesture resonates through dimensions.",
    ],
};

/**
 * Get appropriate message pool based on game state
 */
function getMessagePool(cps, totalBaked, isGoldenActive, has67) {
    if (isGoldenActive) return MESSAGES.goldenActive;
    if (has67) return MESSAGES.milestone67;

    const trillion = 1e12;
    const billion = 1e9;
    const million = 1e6;

    if (totalBaked >= trillion) return MESSAGES.prestige;
    if (totalBaked >= billion) return MESSAGES.late;
    if (totalBaked >= million) return MESSAGES.mid;
    if (cps > 0) return MESSAGES.early;
    return MESSAGES.start;
}

/**
 * Flavor Text Component
 */
export function FlavorText({
    cps = 0,
    totalBaked = 0,
    isGoldenActive = false,
    has67Pattern = false,
}) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);

    const messagePool = useMemo(() =>
        getMessagePool(cps, totalBaked, isGoldenActive, has67Pattern),
        [cps, totalBaked, isGoldenActive, has67Pattern]
    );

    // Rotate messages
    useEffect(() => {
        const pickNewMessage = () => {
            const newMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
            setIsTransitioning(true);

            setTimeout(() => {
                setCurrentMessage(newMessage);
                setIsTransitioning(false);
            }, 300);
        };

        // Initial message
        pickNewMessage();

        // Rotate every 10-20 seconds
        const interval = setInterval(pickNewMessage, 10000 + Math.random() * 10000);
        return () => clearInterval(interval);
    }, [messagePool]);

    // Immediately show golden message when active
    useEffect(() => {
        if (isGoldenActive) {
            setCurrentMessage(MESSAGES.goldenActive[Math.floor(Math.random() * MESSAGES.goldenActive.length)]);
        }
    }, [isGoldenActive]);

    return (
        <div className={`flavor-text ${isTransitioning ? 'flavor-text--fade' : ''} ${isGoldenActive ? 'flavor-text--golden' : ''}`}>
            <p className="flavor-text__message">{currentMessage}</p>
        </div>
    );
}

export default FlavorText;

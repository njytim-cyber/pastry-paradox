/**
 * FlavorText - Funny context-aware messages
 * View Component (NO LOGIC)
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useEventStore } from '../../events/logic/useEventStore';

// Message pools based on game state
const MESSAGES = {
    start: [
        "You accidentally baked a shoe. It tasted okay.",
        "The flour is plotting something. You can feel it.",
        "Your first cake was technically a soup.",
        "Grandma is watching. She is always watching.",
        "67 is just a number. Or is it a coordinate?",
    ],
    early: [
        "A local squirrel stole a muffin. It is now their king.",
        "You found a way to bake water. Physicists are concerned.",
        "The health inspector couldn't resist a gift of three croissants.",
        "Your mixer produces a low hum that causes hallucinations.",
        "Cakes per second? We need Cakes per EON.",
    ],
    mid: [
        "News reports a shortage of gravity due to local cake density.",
        "A local dentist has requested a payment in cupcakes.",
        "The 67th dimension has requested a delivery. Do not be late.",
        "Your employees are actually just 400 raccoons in a trench coat.",
        "Somewhere, a quantum physicist cries into a donut.",
    ],
    late: [
        "Space-time is just layers of sponge cake.",
        "You high-fived a deity. They had frosting on their hands.",
        "The stars are sprinkles. The void is chocolate.",
        "You have conquered death. Death is now a baker.",
        "We are all just ingredients in the cosmic batter.",
    ],
    prestige: [
        "The universe collapses under the weight of your pastry.",
        "Time for a fresh batch of reality.",
        "Dark Matter tastes suspiciously like burnt sugar.",
        "Compressing space-time into a single dense muffin.",
    ],
    goldenActive: [
        "🥐 THE GOLDEN CROISSANT SUMMONS YOU! 🥐",
        "67x REALITY WARPING! BAKE IT 'TIL YOU MAKE IT!",
        "THE DOUGH KNOWS. THE DOUGH COMPELS.",
    ],
    milestone67: [
        "67! The sacred number vibrates!",
        "Palms up. Palms down. The geometry is perfect.",
        "It was always 67. It will always be 67.",
    ],
};

/**
 * Get appropriate message pool based on game state
 */
function getMessagePool(cps, totalBaked, isGoldenActive, has67, eventConfig) {
    // Event specific override takes priority if not golden/milestone
    // (Or maybe event should override everything except golden?)
    const eventQuotes = eventConfig?.localization?.flavorText;

    if (isGoldenActive) return MESSAGES.goldenActive;
    if (has67) return MESSAGES.milestone67;

    if (eventQuotes && Array.isArray(eventQuotes) && eventQuotes.length > 0) {
        return eventQuotes;
    }

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
    const { config: eventConfig } = useEventStore();

    const messagePool = useMemo(() =>
        getMessagePool(cps, totalBaked, isGoldenActive, has67Pattern, eventConfig),
        [cps, totalBaked, isGoldenActive, has67Pattern, eventConfig]
    );

    // Message timing: 10s visible, 3 min hidden, repeat
    const VISIBLE_DURATION = 10000;   // 10 seconds visible
    const HIDDEN_DURATION = 180000;   // 3 minutes hidden

    const [isVisible, setIsVisible] = useState(true);

    // Rotate messages with show/hide cycle
    useEffect(() => {
        const pickNewMessage = () => {
            if (!messagePool || messagePool.length === 0) return;
            const newMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
            setIsTransitioning(true);

            setTimeout(() => {
                setCurrentMessage(newMessage);
                setIsTransitioning(false);
                setIsVisible(true);
            }, 300);

            // Hide after VISIBLE_DURATION
            setTimeout(() => {
                setIsVisible(false);
            }, VISIBLE_DURATION);
        };

        // Initial message
        pickNewMessage();

        // Full cycle: visible + hidden duration
        const interval = setInterval(pickNewMessage, VISIBLE_DURATION + HIDDEN_DURATION);
        return () => clearInterval(interval);
    }, [messagePool]);

    // Immediately show golden message when active
    useEffect(() => {
        if (isGoldenActive) {
            setCurrentMessage(MESSAGES.goldenActive[Math.floor(Math.random() * MESSAGES.goldenActive.length)]);
        }
    }, [isGoldenActive]);

    return (
        <div className={`flavor-text ${isTransitioning ? 'flavor-text--fade' : ''} ${isGoldenActive ? 'flavor-text--golden' : ''}`}
            style={{ opacity: isVisible || isGoldenActive ? 1 : 0, transition: 'opacity 0.5s ease' }}>
            <p className="flavor-text__message">{currentMessage}</p>
        </div>
    );
}

export default FlavorText;

/**
 * MODULE: EVENT CONFIGURATION LAYER
 * Strategy: Decouple event content from game logic using a Schema.
 * This allows swapping "Brain Rot" for "Christmas" or "Halloween" easily.
 */

/**
 * @typedef {Object} AudioCue
 * @property {string} id - Unique sound ID
 * @property {string} src - Path to audio file
 * @property {number} volume - 0.0 to 1.0
 * @property {number} pitchVar - Random pitch variation (0.0 - 1.0)
 * @property {boolean} overlap - Allow multiple instances to play simultaneously
 */

/**
 * @typedef {Object} BuildingOverride
 * @property {string} originalId - Maps to existing building IDs (e.g., "b_grandma")
 * @property {string} newName
 * @property {string} newDescription
 * @property {string} newIconUrl - SVG or GIF path
 * @property {number} productionModifier - Visual multiplier
 */

/**
 * @typedef {Object} UpgradeOverride
 * @property {string} originalId
 * @property {string} newName
 * @property {string} effectDescription
 * @property {string} [triggerSoundId]
 */

/**
 * @typedef {Object} EventConfig
 * @property {string} eventId
 * @property {boolean} active
 * @property {Object} theme
 * @property {string} theme.fontFamily
 * @property {string} theme.primaryColor
 * @property {string} theme.secondaryColor
 * @property {string} theme.bgFilter - CSS filter string
 * @property {Object} localization
 * @property {string} localization.currencyName // "Aura"
 * @property {string} localization.currencyPerSec // "Yapping/sec"
 * @property {string} localization.resetBtnLabel // "Lobotomy"
 * @property {Object} mechanics
 * @property {number} mechanics.doomScrollDecayRate // % lost per second
 * @property {number} mechanics.doomScrollRecovery // % gained per scroll pixel
 * @property {Object} overrides
 * @property {BuildingOverride[]} overrides.buildings
 * @property {UpgradeOverride[]} overrides.upgrades
 * @property {AudioCue[]} audio
 */

// Brain Rot Config is now loaded from @data/events.json
// This file serves as a type definition reference (JSDoc) only.

import eventsData from './events.json';

/**
 * Get the currently active event configuration
 * @returns {EventConfig|null}
 */
export const getActiveEventConfig = (overrideId) => {
    // Priority: Override ID > Configured Active ID
    const eventId = (overrideId && eventsData.events[overrideId]) ? overrideId : eventsData.activeEventId;

    // Validate existence
    if (!eventId || !eventsData.events[eventId]) return null;

    // Return merged config
    return {
        eventId,
        active: true, // Implied active if returned
        ...eventsData.events[eventId]
    };
};


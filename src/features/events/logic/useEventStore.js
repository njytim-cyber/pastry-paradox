import { create } from 'zustand';
import { getActiveEventConfig } from '../../../data/event_config_schema';

/**
 * GENERIC EVENT STORE
 * Handles state for ANY active event (Christmas, Brain Rot, etc.)
 * THEMES ARE COSMETIC ONLY - no production multipliers
 */
export const useEventStore = create((set, get) => ({
    isActive: false,
    config: null,

    // --- Actions ---

    /**
     * Initialize/switch to an event theme
     * @param {string} [forcedEventId] - Event ID to activate
     */
    initEvent: (forcedEventId) => {
        // Priority: forcedEventId > URL override > default config
        const params = new URLSearchParams(window.location.search);
        const urlOverrideId = params.get('event_override');

        // Determine which event ID to use
        const eventIdToUse = forcedEventId || urlOverrideId || null;

        // Get config for the specified event (or default if null)
        const config = getActiveEventConfig(eventIdToUse);

        if (config && config.active) {
            // Only log if switching to a different theme
            if (!get().isActive || get().config?.eventId !== config.eventId) {
                console.log(`🎨 Theme Activated: ${config.name}`);
            }
            set({ isActive: true, config: config });
        } else {
            console.log('Theme: Returning to default.');
            set({ isActive: false, config: null });
        }
    },
}));

// --- Consumable Hooks ---

/**
 * Hook to override building data (Name, Description, Icon)
 * @param {string} originalId 
 * @param {object} defaultData 
 */
export const useBuildingData = (originalId, defaultData) => {
    const { isActive, config } = useEventStore();

    if (!isActive || !config || !config.overrides) return defaultData;

    const override = config.overrides.buildings?.find(b => b.originalId === originalId);

    if (override) {
        return {
            ...defaultData,
            name: override.newName,
            description: override.newDescription,
            // Only override icon if provided
            icon: override.newIconUrl || defaultData.icon,
        };
    }
    return defaultData;
};

/**
 * Hook for the global multiplier - ALWAYS returns 1.0
 * Themes are cosmetic only, no production effects
 */
export const useEventProductionModifier = () => {
    return 1.0;
};

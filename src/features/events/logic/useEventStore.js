import { create } from 'zustand';
import { getActiveEventConfig } from '../../../data/event_config_schema';

/**
 * GENERIC EVENT STORE
 * Handles state for ANY active event (Christmas, Brain Rot, etc.)
 * THEMES ARE COSMETIC ONLY - no production multipliers
 */
import { persist } from 'zustand/middleware';

// ... (getActiveEventConfig import)

export const useEventStore = create(
    persist(
        (set, get) => ({
            isActive: false,
            config: null,

            // --- Actions ---

            initEvent: (forcedEventId) => {
                const params = new URLSearchParams(window.location.search);
                const urlOverrideId = params.get('event_override');
                const eventIdToUse = forcedEventId || urlOverrideId || null;
                const config = getActiveEventConfig(eventIdToUse);

                if (config && config.active) {
                    if (!get().isActive || get().config?.eventId !== config.eventId) {
                        console.log(`🎨 Theme Activated: ${config.name}`);
                    }
                    set({ isActive: true, config: config });
                } else {
                    console.log('Theme: Returning to default.');
                    set({ isActive: false, config: null });
                }
            },
        }),
        {
            name: 'pastry-event-storage', // unique name
            partialize: (state) => ({ isActive: state.isActive, config: state.config }), // persist only these
        }
    )
);

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

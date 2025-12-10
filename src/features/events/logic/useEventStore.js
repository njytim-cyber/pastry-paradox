import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getActiveEventConfig } from '../../../data/event_config_schema';

/**
 * GENERIC EVENT STORE
 * Handles state for ANY active event (Christmas, Brain Rot, etc.)
 */
export const useEventStore = create(
    persist(
        (set, get) => ({
            isActive: false,
            config: null,

            // Generic Mechanic State (can be used for "Doom Meter", "Holiday Spirit", etc.)
            mechanicValue: 1.0,
            currentMultiplier: 1.0,

            // --- Actions ---

            /**
             * Initialize the event system. 
             * @param {string} [forcedEventId] - Optional event ID to force-activate
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
                    // Only log if not already active to reduce noise
                    if (!get().isActive || get().config?.eventId !== config.eventId) {
                        console.log(`🎉 Event System Activated: ${config.name}`);
                    }
                    set({ isActive: true, config: config });
                } else {
                    console.log('Event System: No active event found.');
                    set({ isActive: false, config: null });
                }
            },

            /**
             * Update the generic mechanic value (e.g. scrolling adds to the meter)
             * @param {number} delta - Positive or negative change
             */
            updateMechanicValue: (delta) => {
                const { config, mechanicValue } = get();
                if (!config || !config.mechanics) return;

                // Logic depends on the specific mechanics defined in config
                // For Brain Rot: "doomScrollRecovery"
                if (config.mechanics.doomScrollRecovery) {
                    const recovery = delta * (config.mechanics.doomScrollRecovery / 100);
                    set({ mechanicValue: Math.min(1.0, mechanicValue + recovery) });
                }
                // For Christmas: "holidayCheerRecovery"
                else if (config.mechanics.holidayCheerRecovery) {
                    const recovery = delta * (config.mechanics.holidayCheerRecovery / 100);
                    set({ mechanicValue: Math.min(1.0, mechanicValue + recovery) });
                }
            },

            /**
             * Main Game Loop Tick for Events
             * @param {number} dt - Delta time in seconds
             */
            tickEvent: (dt) => {
                const { isActive, config, mechanicValue } = get();
                if (!isActive || !config) return;

                let newVal = mechanicValue;
                let mult = 1.0;

                // --- Per-Event Logic Router ---

                // CASE: DOOM SCROLL (Brain Rot)
                if (config.mechanics.doomScrollDecayRate) {
                    const decay = config.mechanics.doomScrollDecayRate * dt;
                    newVal = Math.max(0, mechanicValue - decay);

                    // Multiplier Logic: 1.5x at High Engagement, 0.5x at Low
                    if (newVal > 0.8) mult = 1.5;
                    else if (newVal < 0.2 && newVal > 0) mult = 0.5;
                    else if (newVal === 0) mult = 0.0;
                }

                // CASE: HOLIDAY CHEER (Christmas)
                else if (config.mechanics.holidayCheerDecay) {
                    const decay = config.mechanics.holidayCheerDecay * dt;
                    newVal = Math.max(0, mechanicValue - decay);

                    // Simple Linear Multiplier: 0.5x to 2.0x based on cheer
                    // 0% cheer = 0.5x, 100% cheer = 2.0x
                    mult = 0.5 + (newVal * 1.5);
                }

                set({
                    mechanicValue: newVal,
                    currentMultiplier: mult
                });
            }
        }),
        {
            name: 'pastry_paradox_event_store', // unique name
            partialize: (state) => ({ mechanicValue: state.mechanicValue }), // only persist mechanic state
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
 * Hook for the global multiplier (Math)
 */
export const useEventProductionModifier = () => {
    const { isActive, currentMultiplier } = useEventStore();
    return isActive ? currentMultiplier : 1.0;
};

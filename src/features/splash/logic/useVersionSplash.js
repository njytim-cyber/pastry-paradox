/**
 * useVersionSplash - Logic for showing version splash on first load
 * Container Component (NO UI)
 */
import { useState, useEffect } from 'react';

const VERSION_KEY = 'pastry_last_seen_version';

/**
 * Hook to manage version splash logic
 * @param {string} currentVersion - Current app version from package.json
 * @returns {Object} Splash state and handlers
 */
export function useVersionSplash(currentVersion) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem(VERSION_KEY);

        // Show splash if version is different from last seen
        if (lastSeenVersion !== currentVersion) {
            setIsVisible(true);
        }
    }, [currentVersion]);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem(VERSION_KEY, currentVersion);
    };

    return {
        isVisible,
        onClose: handleClose,
    };
}

export default useVersionSplash;

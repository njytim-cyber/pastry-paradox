/**
 * MobileTabBar - Bottom navigation tab bar for mobile layout
 * 
 * Presentational component that renders a fixed bottom tab bar with
 * three tabs: Bakery, Stats, and Store. Includes active state indicators
 * and smooth transitions.
 */
import React from 'react';
import './MobileTabBar.css';

/**
 * @typedef {Object} MobileTabBarProps
 * @property {'stats'|'store'} activeTab - Currently active tab
 * @property {(tab: string) => void} onTabChange - Tab change callback
 * @property {boolean} [visible=true] - Show/hide tab bar
 */

const TAB_CONFIG = [
    { id: 'store', label: 'Market', icon: '🛒' },
    { id: 'stats', label: 'Stats', icon: '📊' },
];

/**
 * Mobile tab bar component
 * 
 * @param {MobileTabBarProps} props
 */
export function MobileTabBar({ activeTab, onTabChange, visible = true }) {
    if (!visible) return null;

    return (
        <nav className="mobile-tab-bar" role="navigation" aria-label="Main navigation">
            {TAB_CONFIG.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        className={`mobile-tab ${isActive ? 'mobile-tab--active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                        aria-label={tab.label}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <span className="mobile-tab__icon" role="img" aria-hidden="true">
                            {tab.icon}
                        </span>
                        <span className="mobile-tab__label">{tab.label}</span>
                        {isActive && <span className="mobile-tab__indicator" aria-hidden="true" />}
                    </button>
                );
            })}
        </nav>
    );
}

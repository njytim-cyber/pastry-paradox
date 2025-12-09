/**
 * VersionSplash - Modal splash screen showing new features
 * View Component (NO LOGIC)
 */
import React from 'react';
import './VersionSplash.css';

/**
 * Version Splash Component
 * @param {Object} props
 * @param {string} props.version - Version number
 * @param {Array<string>} props.features - List of new features
 * @param {Function} props.onClose - Close callback
 * @param {boolean} props.isVisible - Visibility state
 */
export function VersionSplash({
    version = '1.0.0',
    features = [],
    onClose,
    isVisible = false,
}) {
    if (!isVisible) return null;

    return (
        <div className="version-splash-overlay" onClick={onClose}>
            <div className="version-splash" onClick={(e) => e.stopPropagation()}>
                <div className="version-splash__header">
                    <h1 className="version-splash__title">🎉 What's New in v{version}</h1>
                    <button
                        className="version-splash__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="version-splash__content">
                    <ul className="version-splash__features">
                        {features.map((feature, index) => (
                            <li key={index} className="version-splash__feature">
                                <span className="version-splash__icon">✨</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="version-splash__footer">
                    <button className="btn" onClick={onClose}>
                        Start Baking!
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VersionSplash;

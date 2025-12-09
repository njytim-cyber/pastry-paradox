import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

/**
 * Shared Tooltip Component
 * Uses React Portal to render tooltip at document root to avoid overflowing/clipping issues.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.content - Content to display in tooltip
 * @param {React.ReactNode} props.children - Target element to hover
 * @param {string} props.className - Optional wrapper class
 */
export function Tooltip({ content, children, className = '' }) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ left: 0, top: 0 });
    const targetRef = useRef(null);
    const tooltipRef = useRef(null);

    // Calculate position
    const updatePosition = () => {
        if (targetRef.current && isVisible) {
            const rect = targetRef.current.getBoundingClientRect();
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;

            // Default: Top centered
            let top = rect.top + scrollY - 10; // 10px px gap above
            let left = rect.left + scrollX + (rect.width / 2);

            // Constraint logic will be handled by CSS transform translate(-50%, -100%) mainly,
            // but we might need JS adjustments near edges.

            // For now, simple positioning:
            setCoords({
                top: rect.top + scrollY,
                left: rect.left + scrollX + (rect.width / 2),
                height: rect.height
            });
        }
    };

    useLayoutEffect(() => {
        if (isVisible) {
            updatePosition();
            // Optional: Add resize/scroll listeners if needed, 
            // but for static hover usually not critical unless scrolling WHILE hovering
        }
    }, [isVisible]);

    return (
        <>
            <div
                className={`tooltip-trigger ${className}`}
                ref={targetRef}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
            >
                {children}
            </div>
            {isVisible && content && createPortal(
                <div
                    className="portal-tooltip"
                    ref={tooltipRef}
                    style={{
                        position: 'absolute',
                        top: coords.top,
                        left: coords.left,
                        transform: 'translate(-50%, -100%) translateY(-12px)',
                        pointerEvents: 'none' // Let clicks pass through if it overlaps? Usually tooltips shouldn't blocking interact
                    }}
                >
                    <div className="portal-tooltip-content">
                        {content}
                        <div className="portal-tooltip-arrow" />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}


import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import balanceData from '@data/balance.json';
import { formatNumberWord } from '@features/cake/logic/useCakeLogic';

const NODE_SIZE = 64; // Icon size (display)
const { darkMatterUpgrades } = balanceData;



// Import all upgrade icons dynamically
const upgradeIcons = import.meta.glob('/src/assets/icons/*.{jpeg,jpg,png}', { eager: true, as: 'url' });

const getIconPath = (id) => {
    // Try to match id with filename (ignoring extension first? No, explicit check)
    // Keys are like "/src/assets/icons/dark_matter_1.jpeg"
    const extensions = ['jpeg', 'jpg', 'png'];
    for (const ext of extensions) {
        const path = `/src/assets/icons/${id}.${ext}`;
        if (upgradeIcons[path]) return upgradeIcons[path];
    }
    return null;
};

export function DarkMatterTree({ darkMatter, darkUpgrades, onBuy, totalGlobalMultiplier }) {
    const containerRef = useRef(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(0.6); // Start zoomed out to see more
    const [selectedNode, setSelectedNode] = useState(null);

    // Calculate tree bounds once
    const nodes = Object.values(darkMatterUpgrades || {});
    const treeBounds = useMemo(() => {
        if (nodes.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
        const xs = nodes.map(n => n.position.x);
        const ys = nodes.map(n => n.position.y);
        const minX = Math.min(...xs) - NODE_SIZE;
        const maxX = Math.max(...xs) + NODE_SIZE;
        const minY = Math.min(...ys) - NODE_SIZE;
        const maxY = Math.max(...ys) + NODE_SIZE;
        return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
    }, [nodes]);

    // Auto-fit to show all nodes on mount
    const fitToView = useCallback(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const { offsetWidth, offsetHeight } = container;
        const padding = 100;

        // Calculate scale to fit
        const scaleX = (offsetWidth - padding * 2) / treeBounds.width;
        const scaleY = (offsetHeight - padding * 2) / treeBounds.height;
        const fitScale = Math.min(scaleX, scaleY, 1); // Don't zoom in past 1x

        // Center the tree
        const centerX = (treeBounds.minX + treeBounds.maxX) / 2;
        const centerY = (treeBounds.minY + treeBounds.maxY) / 2;

        setScale(Math.max(0.25, Math.min(fitScale, 1)));
        setPan({
            x: offsetWidth / 2 - centerX * fitScale,
            y: offsetHeight / 2 - centerY * fitScale
        });
    }, [treeBounds]);

    // Center the view on mount
    useEffect(() => {
        // Small delay to ensure container is measured
        const timer = setTimeout(fitToView, 100);
        return () => clearTimeout(timer);
    }, [fitToView]);

    // Handling Pan
    const handlePointerDown = (e) => {
        if (e.target.closest('.zoom-controls, .node-details-panel')) return; // Don't drag from UI elements
        setIsDragging(true);
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        setScale(prev => Math.min(Math.max(0.25, prev + delta), 3)); // Extended range
    };

    // Zoom controls
    const zoomIn = () => setScale(prev => Math.min(prev * 1.3, 3));
    const zoomOut = () => setScale(prev => Math.max(prev / 1.3, 0.25));

    // Calculate connections (nodes already defined above)
    const connections = nodes
        .filter(n => n.parent)
        .map(n => {
            const parent = darkMatterUpgrades[n.parent];
            if (!parent) return null;
            return {
                id: `${parent.id}-${n.id}`,
                x1: parent.position.x,
                y1: parent.position.y,
                x2: n.position.x,
                y2: n.position.y,
                unlocked: darkUpgrades.includes(parent.id) // Line color based on parent unlock?
            };
        })
        .filter(Boolean);

    // Node Click
    const handleNodeClick = (node) => {
        // If dragging occurred, don't select? (simple threshold check omitted for brevity)
        setSelectedNode(node);
    };

    const canAfford = (node) => {
        if (darkUpgrades.includes(node.id)) return false; // Owned
        if (darkMatter < node.cost) return false;
        if (node.parent && !darkUpgrades.includes(node.parent)) return false;
        return true;
    };

    const isOwned = (id) => darkUpgrades.includes(id);
    const isAvailable = (node) => {
        if (isOwned(node.id)) return true;
        if (!node.parent) return true; // Root
        return isOwned(node.parent); // Visible if parent owned
    };

    return (
        <div className="dark-matter-tree-container"
            style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
        >
            <div className="star-background" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
                {/* Could add CSS stars here */}
            </div>

            <div
                className="transform-layer"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0
                }}
            >
                {/* Connections Layer */}
                <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none' }}>
                    {connections.map(conn => (
                        <line
                            key={conn.id}
                            x1={conn.x1} y1={conn.y1}
                            x2={conn.x2} y2={conn.y2}
                            stroke={conn.unlocked ? '#ecf0f1' : '#34495e'}
                            strokeWidth={4}
                            strokeOpacity={0.6}
                        />
                    ))}
                </svg>

                {/* Nodes Layer */}
                {nodes.map(node => {
                    const available = isAvailable(node);
                    const owned = isOwned(node.id);
                    const affordable = canAfford(node);

                    // Don't render deep invisible nodes to save performance? 
                    // No, 100 nodes is fine.

                    return (
                        <div
                            key={node.id}
                            onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
                            style={{
                                position: 'absolute',
                                left: node.position.x - (NODE_SIZE / 2),
                                top: node.position.y - (NODE_SIZE / 2),
                                width: NODE_SIZE,
                                height: NODE_SIZE,
                                borderRadius: '50%',
                                background: owned ? '#e67e22' : (affordable ? '#f1c40f' : '#7f8c8d'),
                                border: selectedNode?.id === node.id ? '2px solid #fff' : '2px solid #000',
                                boxShadow: owned ? '0 0 15px rgba(230, 126, 34, 0.6)' : 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: available ? 1 : 0.2, // Hide unreachable
                                transition: 'all 0.2s ease',
                                zIndex: 10
                            }}
                        >
                            {/* Icon Image if available, else standard char */}
                            <img
                                src={getIconPath(node.id)}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                                alt={node.name}
                                style={{
                                    width: '80%',
                                    height: '80%',
                                    borderRadius: '50%',
                                    pointerEvents: 'none',
                                    display: getIconPath(node.id) ? 'block' : 'none'
                                }}
                            />
                            {/* Fallback visual if image fails/loads */}
                            <div className="node-fallback" style={{ position: 'absolute', fontSize: '24px', pointerEvents: 'none', zIndex: -1 }}>
                                🔮
                            </div>
                            {(!available) && <span style={{ position: 'absolute' }}>🔒</span>}
                        </div>
                    );
                })}
            </div>

            {/* UI Overlay: Selected Node Details */}
            {selectedNode && (
                <div
                    className="node-details-panel"
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(20, 20, 20, 0.95)',
                        border: '1px solid #444',
                        padding: '16px',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '400px',
                        color: '#fff',
                        zIndex: 20
                    }}
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking panel
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0, color: '#f39c12' }}>{selectedNode.name}</h3>
                        <button onClick={() => setSelectedNode(null)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>✕</button>
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#ccc' }}>{selectedNode.description}</p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="cost-tag" style={{ color: canAfford(selectedNode) ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>
                            {isOwned(selectedNode.id) ? 'OWNED' : `${formatNumberWord(selectedNode.cost)} Dark Matter`}
                        </div>

                        {!isOwned(selectedNode.id) && (
                            <button
                                disabled={!canAfford(selectedNode)}
                                onClick={() => onBuy(selectedNode.id)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: canAfford(selectedNode) ? '#27ae60' : '#444',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    cursor: canAfford(selectedNode) ? 'pointer' : 'not-allowed',
                                    opacity: canAfford(selectedNode) ? 1 : 0.5
                                }}
                            >
                                UNLOCK
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Zoom Controls */}
            <div className="zoom-controls" style={{
                position: 'absolute',
                bottom: selectedNode ? '140px' : '20px',
                right: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 15
            }}>
                <button
                    onClick={zoomIn}
                    style={{
                        width: '36px', height: '36px',
                        background: 'rgba(50, 50, 50, 0.9)',
                        border: '1px solid #555',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '1.2rem',
                        cursor: 'pointer'
                    }}
                    title="Zoom In"
                >+</button>
                <button
                    onClick={zoomOut}
                    style={{
                        width: '36px', height: '36px',
                        background: 'rgba(50, 50, 50, 0.9)',
                        border: '1px solid #555',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '1.2rem',
                        cursor: 'pointer'
                    }}
                    title="Zoom Out"
                >−</button>
                <button
                    onClick={fitToView}
                    style={{
                        width: '36px', height: '36px',
                        background: 'rgba(50, 50, 50, 0.9)',
                        border: '1px solid #555',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '0.7rem',
                        cursor: 'pointer'
                    }}
                    title="Fit All Nodes"
                >FIT</button>
            </div>

            {/* Total Multiplier Badge */}
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', color: '#aaa', fontSize: '0.8rem' }}>
                Prestige Multiplier: ×{totalGlobalMultiplier.toFixed(2)}
            </div>
        </div>
    );
}

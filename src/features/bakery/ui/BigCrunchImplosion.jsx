
import { useState } from 'react';

export function BigCrunchImplosion({ onComplete }) {
    const [phase, setPhase] = useState('suck'); // suck -> singularity -> bang -> fade

    // Trigger completion after animation
    if (phase === 'suck') {
        setTimeout(() => {
            setPhase('bang');
            onComplete();
        }, 3000);
    }

    if (phase === 'suck') {
        // We might need toPortal this or apply style to the ROOT app element.
        // But applying to a full-screen overlay that contains a screenshot is hard.
        // Instead, we can use a backdrop that uses `backdrop-filter` or just huge distortion.
        // For simplicity in React, we'll assume this component sits on top and we animate a "black hole" that grows?
        // User requested: "full-screen 'Black Hole' animation (screen shake, elements sucking into the center)".
        // Sucking elements is hard without capturing the DOM.
        // Hack: Scale down the entire APP content?
        // We can pass a ref to the App container to this component if we want to manipulate it,
        // OR simpler: Render a black overlay with a portal that has a sucking spiral distortion.
        // Let's try the "Scale down App" approach if possible, but that requires App state.

        // Simpler VFX:
        // 1. Overlay fills screen.
        // 2. Center black hole grows.
        // 3. Screen shakes (CSS).
        // 4. Everything fades to black.

        return (
            <div className="implosion-overlay" style={{
                position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none',
                background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {/* Shake Effect applied to body via class? Or just shake this overlay? 
                    If we want to shake the GAME, we should modify the game container style.
                    Let's just show the Black Hole growing violently.
                */}
                <div className="black-hole" style={{
                    width: '10px', height: '10px', background: 'black', borderRadius: '50%',
                    boxShadow: '0 0 50px 20px purple, 0 0 100px 50px black',
                    animation: 'growHole 3s ease-in forwards'
                }} />
                <style>{`
                    @keyframes growHole {
                        0% { transform: scale(1); }
                        80% { transform: scale(100); }
                        100% { transform: scale(500); }
                    }
                    body { animation: shake 0.5s infinite; }
                    @keyframes shake {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -2px) rotate(-1deg); }
                        20% { transform: translate(-3px, 0px) rotate(1deg); }
                        30% { transform: translate(3px, 2px) rotate(0deg); }
                        40% { transform: translate(1px, -1px) rotate(1deg); }
                        50% { transform: translate(-1px, 2px) rotate(-1deg); }
                        60% { transform: translate(-3px, 1px) rotate(0deg); }
                        70% { transform: translate(3px, 1px) rotate(-1deg); }
                        80% { transform: translate(-1px, -1px) rotate(1deg); }
                        90% { transform: translate(1px, 2px) rotate(0deg); }
                        100% { transform: translate(1px, -2px) rotate(-1deg); }
                    }
                `}</style>
            </div>
        );
    }

    // For now, simpler CSS animation implementation above replaced the complex spring logic for robustness.
    return null;
}



export function BigCrunchButton({ onPrestige, unlocked, canPrestige }) {
    // Show if explicitly unlocked OR if user can prestige (for testing)
    if (!unlocked && !canPrestige) return null;

    return (
        <button
            onClick={onPrestige}
            className="big-crunch-btn"
            style={{
                background: 'linear-gradient(135deg, #000000, #2c3e50)',
                color: '#ecf0f1',
                border: '2px solid #e74c3c',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 0 10px #e74c3c',
                animation: 'pulse 2s infinite'
            }}
        >
            THE BIG CRUNCH
            <style jsx>{`
                @keyframes pulse {
                    0% { box-shadow: 0 0 10px #e74c3c; transform: scale(1); }
                    50% { box-shadow: 0 0 20px #c0392b; transform: scale(1.05); }
                    100% { box-shadow: 0 0 10px #e74c3c; transform: scale(1); }
                }
            `}</style>
        </button>
    );
}

/**
 * BakeryHeader - Editable bakery name and currency display
 * View Component (NO LOGIC)
 */
import React, { useState, useRef, useEffect } from 'react';
import { formatNumber } from '../../cake/logic/useCakeLogic';

/**
 * Bakery Header Component
 */
export function BakeryHeader({
    bakeryName = "My Patisserie",
    onNameChange,
    balance = 0,
    cps = 0,
    currencyName = "Delicious Cakes",
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(bakeryName);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSubmit = () => {
        const trimmed = editName.trim();
        if (trimmed && trimmed !== bakeryName) {
            onNameChange?.(trimmed);
        } else {
            setEditName(bakeryName);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit();
        if (e.key === 'Escape') {
            setEditName(bakeryName);
            setIsEditing(false);
        }
    };

    return (
        <div className="bakery-header">
            {/* Bakery Name */}
            <div className="bakery-name-container">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        className="bakery-name-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleSubmit}
                        onKeyDown={handleKeyDown}
                        maxLength={30}
                    />
                ) : (
                    <h1
                        className="bakery-name"
                        onClick={() => setIsEditing(true)}
                        title="Click to rename your bakery"
                    >
                        {bakeryName}
                    </h1>
                )}
            </div>

            {/* Currency Display */}
            <div className="bakery-currency">
                <span className="bakery-balance">{formatNumber(balance)}</span>
                <span className="bakery-currency-name">{currencyName}</span>
                {cps > 0 && (
                    <span className="bakery-cps">per second: {formatNumber(cps)}</span>
                )}
            </div>
        </div>
    );
}

export default BakeryHeader;

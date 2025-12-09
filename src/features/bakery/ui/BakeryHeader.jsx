/**
 * BakeryHeader - Editable bakery name and currency display
 * View Component (NO LOGIC)
 */
import React, { useState, useRef, useEffect } from 'react';
import { formatNumberWord, formatNumberParts } from '../../cake/logic/useCakeLogic';

/**
 * Bakery Header Component
 */
export function BakeryHeader({
    bakeryName = "Your Patisserie",
    onNameChange,
    balance = 0,
    cps = 0,
    currencyName = "Delicious Cakes",
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(bakeryName);
    const inputRef = useRef(null);

    // Throttle display updates to reduce flickering - use interval instead of effect
    const [displayBalance, setDisplayBalance] = useState(balance);
    const balanceRef = useRef(balance);
    balanceRef.current = balance; // Always track latest

    useEffect(() => {
        // Update display every 500ms from the latest balance
        const interval = setInterval(() => {
            setDisplayBalance(balanceRef.current);
        }, 500);
        return () => clearInterval(interval);
    }, []); // Empty deps - interval runs forever

    const { value: balanceValue, suffix: balanceSuffix } = formatNumberParts(displayBalance);

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
                <div className="bakery-balance-container">
                    <span className="bakery-balance">{balanceValue}</span>
                    {balanceSuffix && <div className="bakery-balance-suffix">{balanceSuffix}</div>}
                </div>
                <span className="bakery-currency-name">{currencyName}</span>
                {cps > 0 && (
                    <span className="bakery-cps">per second: {formatNumberWord(cps)}</span>
                )}
            </div>
        </div>
    );
}

export default BakeryHeader;

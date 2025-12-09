
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StorePanel } from '../ui/StorePanel';

describe('StorePanel', () => {
    const mockGenerators = [
        { id: 'tier1', name: 'Baker', baseCost: 10, baseCps: 1 }
    ];

    const mockGetGeneratorInfo = vi.fn((id) => ({
        id: 'tier1',
        owned: 100,
        currentPrice: 15,
        contribution: 5
    }));

    const mockProps = {
        generators: mockGenerators,
        getGeneratorInfo: mockGetGeneratorInfo,
        canAfford: vi.fn(() => true),
        onPurchase: vi.fn(),
        onSell: vi.fn(),
        shopMode: 'buy',
        setShopMode: vi.fn(),
        buyQuantity: 1,
        setBuyQuantity: vi.fn(),
        getSellPrice: vi.fn(() => 5),
    };

    it('renders buy mode correctly', () => {
        render(<StorePanel {...mockProps} />);
        expect(screen.getByText('🧁 Market')).toBeInTheDocument();
        expect(screen.getByText('Buy')).toHaveClass('active');
        expect(screen.getByText('1')).toHaveClass('active');
        // Quantity buttons visible in buy mode
        expect(screen.getByText('67')).toBeInTheDocument();
    });

    it('handles mode switching', () => {
        render(<StorePanel {...mockProps} />);
        fireEvent.click(screen.getByText('Sell'));
        expect(mockProps.setShopMode).toHaveBeenCalledWith('sell');
    });

    it('handles quantity selection', () => {
        render(<StorePanel {...mockProps} />);
        fireEvent.click(screen.getByText('67'));
        expect(mockProps.setBuyQuantity).toHaveBeenCalledWith(67);
    });

    // New Requirement Test
    it('shows quantity buttons in sell mode', () => {
        const sellProps = { ...mockProps, shopMode: 'sell' };
        render(<StorePanel {...sellProps} />);
        expect(screen.getByText('67')).toBeInTheDocument();
        expect(screen.getByText('6767')).toBeInTheDocument();
    });

    it('calls onSell with quantity', () => {
        const sellProps = { ...mockProps, shopMode: 'sell', buyQuantity: 67 };
        render(<StorePanel {...sellProps} />);
        // Find the item row (assuming interaction)
        // StorePanel usually has a list. We need to find the sell button for the item.
        // "Sell" mode changes the row interaction?
        // In StorePanel.jsx: <div className="shop-item" onClick={() => canSell && onSell?.(tier.id)}>

        const item = screen.getByText('Baker').closest('.shop-item');
        fireEvent.click(item);
        expect(mockProps.onSell).toHaveBeenCalledWith('tier1', 67); // Expecting quantity arg now
    });
});

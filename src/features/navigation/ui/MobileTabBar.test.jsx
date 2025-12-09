/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileTabBar } from './MobileTabBar';

describe('MobileTabBar', () => {
    it('should render all three tabs', () => {
        render(<MobileTabBar activeTab="bakery" onTabChange={vi.fn()} />);

        expect(screen.getByLabelText('Bakery')).toBeInTheDocument();
        expect(screen.getByLabelText('Stats')).toBeInTheDocument();
        expect(screen.getByLabelText('Store')).toBeInTheDocument();
    });

    it('should mark active tab with aria-current', () => {
        render(<MobileTabBar activeTab="stats" onTabChange={vi.fn()} />);

        const statsTab = screen.getByLabelText('Stats');
        expect(statsTab).toHaveAttribute('aria-current', 'page');

        const bakeryTab = screen.getByLabelText('Bakery');
        expect(bakeryTab).not.toHaveAttribute('aria-current');
    });

    it('should apply active class to active tab', () => {
        render(<MobileTabBar activeTab="store" onTabChange={vi.fn()} />);

        const storeTab = screen.getByLabelText('Store');
        expect(storeTab).toHaveClass('mobile-tab--active');

        const bakeryTab = screen.getByLabelText('Bakery');
        expect(bakeryTab).not.toHaveClass('mobile-tab--active');
    });

    it('should call onTabChange when tab is clicked', () => {
        const onTabChange = vi.fn();

        render(<MobileTabBar activeTab="bakery" onTabChange={onTabChange} />);

        const statsTab = screen.getByLabelText('Stats');
        fireEvent.click(statsTab);

        expect(onTabChange).toHaveBeenCalledWith('stats');
    });

    it('should not render when visible is false', () => {
        render(<MobileTabBar activeTab="bakery" onTabChange={vi.fn()} visible={false} />);

        expect(screen.queryByLabelText('Bakery')).not.toBeInTheDocument();
    });

    it('should render when visible is true', () => {
        render(<MobileTabBar activeTab="bakery" onTabChange={vi.fn()} visible={true} />);

        expect(screen.getByLabelText('Bakery')).toBeInTheDocument();
    });

    it('should render when visible is not provided (default true)', () => {
        render(<MobileTabBar activeTab="bakery" onTabChange={vi.fn()} />);

        expect(screen.getByLabelText('Bakery')).toBeInTheDocument();
    });

    it('should render tab icons', () => {
        render(<MobileTabBar activeTab="bakery" onTabChange={vi.fn()} />);

        expect(screen.getByText('🎂')).toBeInTheDocument();
        expect(screen.getByText('📊')).toBeInTheDocument();
        expect(screen.getByText('🛒')).toBeInTheDocument();
    });

    it('should render tab labels', () => {
        render(<MobileTabBar activeTab="bakery" onTabChange={vi.fn()} />);

        expect(screen.getByText('Bakery')).toBeInTheDocument();
        expect(screen.getByText('Stats')).toBeInTheDocument();
        expect(screen.getByText('Store')).toBeInTheDocument();
    });

    it('should have navigation role', () => {
        render(<MobileTabBar activeTab="bakery" onTabChange={vi.fn()} />);

        const nav = screen.getByRole('navigation');
        expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('should render active indicator on active tab', () => {
        const { container } = render(<MobileTabBar activeTab="bakery" onTabChange={vi.fn()} />);

        const indicators = container.querySelectorAll('.mobile-tab__indicator');
        expect(indicators).toHaveLength(1);
    });
});

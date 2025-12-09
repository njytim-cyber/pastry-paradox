/**
 * Test for VersionSplash component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VersionSplash } from './VersionSplash';

describe('VersionSplash', () => {
    it('renders without crashing when visible', () => {
        const mockOnClose = vi.fn();
        const features = ['New feature 1', 'New feature 2'];

        render(
            <VersionSplash
                version="1.2.0"
                features={features}
                onClose={mockOnClose}
                isVisible={true}
            />
        );

        expect(screen.getByText(/What's New in v1.2.0/i)).toBeInTheDocument();
        expect(screen.getByText('New feature 1')).toBeInTheDocument();
        expect(screen.getByText('New feature 2')).toBeInTheDocument();
    });

    it('does not render when isVisible is false', () => {
        const mockOnClose = vi.fn();

        const { container } = render(
            <VersionSplash
                version="1.2.0"
                features={['Feature']}
                onClose={mockOnClose}
                isVisible={false}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it('calls onClose when close button is clicked', () => {
        const mockOnClose = vi.fn();

        render(
            <VersionSplash
                version="1.2.0"
                features={['Feature']}
                onClose={mockOnClose}
                isVisible={true}
            />
        );

        const closeButton = screen.getByLabelText('Close');
        closeButton.click();

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});

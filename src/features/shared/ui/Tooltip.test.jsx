import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {
    // Basic test to ensure it renders children
    it('renders children correctly', () => {
        render(
            <Tooltip content="Helper text">
                <button>Hover Me</button>
            </Tooltip>
        );
        expect(screen.getByText('Hover Me')).toBeInTheDocument();
    });

    // Test tooltip appearance on hover
    it('shows tooltip content on hover', async () => {
        render(
            <Tooltip content="Secret Info">
                <button>Target</button>
            </Tooltip>
        );

        // Tooltip should not be visible initially
        expect(screen.queryByText('Secret Info')).not.toBeInTheDocument();

        // Hover
        fireEvent.mouseEnter(screen.getByText('Target'));

        // Should be visible (Portal might render outside standard container, but screen.getByText searches document.body)
        expect(await screen.findByText('Secret Info')).toBeInTheDocument();
    });

    // Test disappearance
    it('hides tooltip on mouse leave', async () => {
        render(
            <Tooltip content="Secret Info">
                <button>Target</button>
            </Tooltip>
        );

        fireEvent.mouseEnter(screen.getByText('Target'));
        expect(await screen.findByText('Secret Info')).toBeInTheDocument();

        fireEvent.mouseLeave(screen.getByText('Target'));
        // Wait for it to disappear? State update is sync in tests usually unless animated delay?
        // Our component sets state immediately.
        expect(screen.queryByText('Secret Info')).not.toBeInTheDocument();
    });
});

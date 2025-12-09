import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Check for something basic that should be there
        // Based on App.jsx, "BakeryHeader" is rendered, maybe check for text or class?
        // App has "flavor-banner", "pane-left", etc classes.

        // Just rendering might be enough to catch a crash.
        // But let's check for a known element to be sure it mounted.
        // There is a title in BakeryHeader probably? Or FlavorText?
        // Let's just check for the container
        const container = document.querySelector('.app-container');
        expect(container).toBeInTheDocument();
    });
});

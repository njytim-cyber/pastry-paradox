import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EventOverlay } from './features/events/ui/EventOverlay';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <EventOverlay>
            <App />
        </EventOverlay>
    </React.StrictMode>
);

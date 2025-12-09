import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@data': path.resolve(__dirname, './src/data'),
            '@features': path.resolve(__dirname, './src/features'),
            '@assets': path.resolve(__dirname, './src/assets'),
        },
    },
    server: {
        port: 5173,
        strictPort: true,
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
    },
});

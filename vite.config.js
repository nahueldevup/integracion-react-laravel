import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx', // Aquí le decimos dónde está el archivo principal
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            // Esto es CRUCIAL: le dice que "@" significa "resources/js"
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
});
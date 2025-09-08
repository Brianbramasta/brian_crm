import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['frontend/src/index.css', 'frontend/src/main.jsx'],
            refresh: true,
        }),
    ],
});

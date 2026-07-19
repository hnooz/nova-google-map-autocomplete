import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
            entry: 'resources/js/field.js',
            name: 'NovaGoogleAutocomplete',
            formats: ['iife'],
            fileName: () => 'js/field.js',
            cssFileName: 'css/field',
        },
        rollupOptions: {
            // Nova exposes Vue on the window; bundling a second copy breaks the app instance.
            external: ['vue'],
            output: { globals: { vue: 'Vue' } },
        },
    },
});

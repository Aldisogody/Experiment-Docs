import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// vite.config.js — shared config used by exp-build per-entry invocations
export default defineConfig(({ mode }) => ({
    plugins: [preact()],
    define: {
        __buildEnv__: JSON.stringify(mode),
        __packageName__: JSON.stringify('sample'),
        __globalObject__: JSON.stringify('sgd'),
        __includeEmergencyBrake__: JSON.stringify('true'),
        __emergencyBrakeConfig__: JSON.stringify('${user.sgdEmergencyBrake}'),
    },
    resolve: {
        alias: {
            '@src': resolve(__dirname, 'src'),
            '@js': resolve(__dirname, 'src/js'),
            '@components': resolve(__dirname, 'src/components'),
            '@services': resolve(__dirname, 'src/services'),
            '@helpers': resolve(__dirname, 'src/helpers'),
        },
    },
    css: {
        modules: {
            localsConvention: 'camelCase',
            generateScopedName: 'sample--[local]',
        },
        preprocessorOptions: {
            scss: {
                loadPaths: [resolve(__dirname, 'node_modules/create-experiment/runtime/scss')],
                additionalData: `
                    @use "media-queries" as *;
                    @use "fluid-property" as *;
                `,
                // Suppress Sass @import deprecation warnings from dependencies
                api: 'modern-compiler',
                quietDeps: true,
            },
        },
    },
    build: {
        rollupOptions: {
            // Preact is bundled — IIFE format evaluates globals synchronously, so external
            // Preact via withPreact/CDN is not compatible with Adobe Target paste workflow
            external: [],
            output: {
                globals: {},
                name: 'exp',
            },
        },
        cssCodeSplit: true,
        sourcemap: mode === 'development',
        minify: false,
        cssMinify: mode === 'production' ? 'esbuild' : false,
    },
}));

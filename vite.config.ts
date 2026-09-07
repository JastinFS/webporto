import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error — plain JS plugin, no types needed
import portfolioContent from './vite-content-plugin.mjs';

export default defineConfig({
  base: './',
  plugins: [react(), portfolioContent()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});

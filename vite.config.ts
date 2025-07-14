import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), cloudflare(), tailwindcss(), sentryVitePlugin({
    org: "nikolovlazar",
    project: "caching-frontend"
  })],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/react-app'),
    },
  },

  build: {
    sourcemap: true
  }
});
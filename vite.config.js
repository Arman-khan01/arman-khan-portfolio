import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png'],
  // Images are imported by main.js so Vite emits them for both dev and build.
  publicDir: false,
  server: {
    host: true,
    middlewareMode: false,
    fs: {
      allow: ['..', '.']
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});


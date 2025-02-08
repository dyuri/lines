// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  build: {
    rollupOptions: {
      input: {
        'repa-lines': './src/repa-lines/index.ts',
        'main': 'index.html',
      }
    }
  }
});

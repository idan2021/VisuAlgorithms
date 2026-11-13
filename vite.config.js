import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  // Relative asset paths support GitHub Pages project URLs and preview hosting.
  base: './',
  plugins: [preact()],
});

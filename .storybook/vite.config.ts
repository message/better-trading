import { defineConfig } from 'vite';
import { WxtVitest } from 'wxt/testing';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    // Add all the vite config from your wxt.config.ts, including the built-in
    // plugins and config WXT sets up automatically.
    WxtVitest(),
    svgr(),
  ],
});

/** @type {import('vite').UserConfig} */
import path from 'path';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      ws: path.resolve(path.join(__dirname, 'node_modules/ws/index.js')),
    },
  },
  plugins: [EnvironmentPlugin('all')],
});

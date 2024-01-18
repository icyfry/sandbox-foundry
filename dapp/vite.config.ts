/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  //root: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      web3: '../../node_modules/web3/dist/web3.min.js',
    },
  },
  test: {
    coverage: {
      reporter: ['lcov', 'text'],
    },
    // reporters: ['html', 'json']
  },
})

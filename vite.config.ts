import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: 'localhost',
    strictPort: true,
    watch: {
      usePolling: true
    },
    cors: true,
    open: true,
    fs: {
      strict: false,
      allow: ['.']
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
})

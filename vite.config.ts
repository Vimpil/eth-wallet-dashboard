import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  base: '/',
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true
    },
    cors: true,
    open: true,
    fs: {
      strict: false,
      allow: ['.']
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── Production build → output goes into backend/public ──────
  // Express will serve this folder as static files in production.
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
  },

  // ── Dev server ───────────────────────────────────────────────
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api calls to the Node.js backend on port 3001
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/generated-pdfs': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})

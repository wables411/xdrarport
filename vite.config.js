import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Ensure manifest JSON is not inlined if it's too large
        manualChunks: undefined,
      }
    }
  },
  // Force Vite to treat the manifest as a static asset that can change
  server: {
    fs: {
      strict: false
    }
  }
})


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Ensure JSON files are properly handled
  assetsInclude: ['**/*.json'],
  json: {
    // Use named exports for JSON
    namedExports: false,
    // Stringify JSON
    stringify: false
  },
  build: {
    // Don't cache the manifest
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
})


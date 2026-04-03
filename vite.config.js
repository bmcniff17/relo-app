import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['jsx']
        }
      }
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ibrali-tours-travel/', // Match your repo name
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssMinify: false,  // Disable CSS minification to avoid Tailwind warnings

  }
})

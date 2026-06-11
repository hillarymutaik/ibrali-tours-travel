import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ibrali-tours-travel/',

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    cssMinify: false,
  },
  css: {
    postcss: './postcss.config.js',
  }
})

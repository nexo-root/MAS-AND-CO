import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // el sitio vive en nexo-root.github.io/MAS-AND-CO/, no en la raiz del dominio
  base: './',
  // GitHub Pages publica desde main, asi que el build va a docs/
  build: { outDir: 'docs', emptyOutDir: true },
})

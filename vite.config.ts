import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Base ABSOLUTA. Con './' los assets se resolvian relativos a la URL, y desde
  // una ruta anidada como /precios/ pedian /precios/assets/... y daban 404. El
  // sitio vive en masandcoweb.com desde el 06/09/2026, asi que la raiz es '/'.
  base: '/',
  // GitHub Pages publica desde main, asi que el build va a docs/
  build: { outDir: 'docs', emptyOutDir: true },
})

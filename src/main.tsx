import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { rutaActual } from './App.tsx'
import { cargarPagina } from './paginas-diferidas'

/* createRoot y NO hydrateRoot, aunque las paginas lleguen prerenderizadas.
   Probado el 26/09/2026: hydrateRoot tira el error #418 en las 16 rutas. El
   prerender (scripts/prerender.mjs) guarda el DOM que dibujo el navegador, no
   el HTML de react-dom/server, y en ese DOM los textos pegados de JSX
   ("Actualizado el {d} de {mes}") quedan fundidos en un solo nodo, sin los
   <!-- --> que React necesita para hidratar. Para hidratar habria que pasar a
   SSR de verdad (ver la memoria masandco-seo-arquitectura: se descarto porque
   Lenis, GSAP y el canvas no corren en Node).

   Antes de dibujar se baja el pedazo de la pagina donde se entro (si no es la
   portada): mientras tanto se sigue viendo el HTML prerenderizado, y React lo
   reemplaza de una vez, sin pantalla en blanco (ver paginas-diferidas.tsx). */
const dibujar = () =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
cargarPagina(rutaActual()).then(dibujar, dibujar)

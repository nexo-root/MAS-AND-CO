import { useEffect, useRef } from "react"

/* ═══════════════════════════════════════════════════════════════
   Curvas de nivel.

   El fondo es el mapa de un terreno: la rama digital de una empresa
   que vende tierra y construye. Geometria pura, sin color, sin brillo.

   Se dibuja un campo de altura suave (suma de senos, que es barato y
   no necesita libreria de ruido) y se trazan las lineas donde ese campo
   cruza cada nivel, con marching squares. El campo se desplaza muy
   despacio, asi que las curvas respiran en vez de quedarse quietas.
   ═══════════════════════════════════════════════════════════════ */

const PASO = 26        // resolucion de la grilla de calculo, en pixeles
const NIVELES = 11     // cuantas curvas
const VELOCIDAD = 0.000035
/* El campo se mueve tan despacio que redibujar 60 veces por segundo no se ve
   distinto que 15, y cuesta el cuadruple de CPU (medido con Lighthouse el
   26/09/2026, con el celular emulado). */
const CADA_MS = 66

export default function Curvas() {
  const lienzo = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const cv = lienzo.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    if (!ctx) return

    let ancho = 0, alto = 0, cols = 0, filas = 0
    let campo = new Float32Array(0)
    let cuadro = 0

    const medir = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5)
      ancho = innerWidth
      alto = innerHeight
      cv.width = Math.round(ancho * dpr)
      cv.height = Math.round(alto * dpr)
      cv.style.width = ancho + "px"
      cv.style.height = alto + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(ancho / PASO) + 1
      filas = Math.ceil(alto / PASO) + 1
      campo = new Float32Array(cols * filas)
    }

    /* Altura del terreno en un punto. Cuatro ondas de periodos que no son
       multiplos entre si: el dibujo no se repite a simple vista. */
    const altura = (x: number, y: number, t: number) =>
      Math.sin(x * 0.0016 + t) * 1.0 +
      Math.sin(y * 0.0021 - t * 0.8) * 0.9 +
      Math.sin((x + y) * 0.0011 + t * 1.3) * 0.7 +
      Math.sin((x - y * 1.7) * 0.0009 - t * 0.6) * 0.6

    const dibujar = (t: number) => {
      for (let f = 0; f < filas; f++)
        for (let c = 0; c < cols; c++)
          campo[f * cols + c] = altura(c * PASO, f * PASO, t)

      ctx.clearRect(0, 0, ancho, alto)
      ctx.lineWidth = 1
      ctx.lineCap = "round"

      // el trazo sigue al tema: tinta sobre papel, hueso sobre navy
      const oscuro = document.documentElement.dataset.tema === "oscuro"
      const trazo = oscuro ? "237,237,231" : "11,18,32"
      // sobre navy el mismo alfa casi no se ve: el trazo claro necesita mas
      const base = oscuro ? 0.17 : 0.06
      const rango = oscuro ? 0.16 : 0.07
      for (let n = 0; n < NIVELES; n++) {
        const nivel = -2.6 + (n / (NIVELES - 1)) * 5.2
        // las del medio se ven un poco mas que las de los extremos
        const centro = 1 - Math.abs(n / (NIVELES - 1) - 0.5) * 2
        ctx.strokeStyle = `rgba(${trazo},${(base + centro * rango).toFixed(3)})`
        ctx.beginPath()

        for (let f = 0; f < filas - 1; f++) {
          for (let c = 0; c < cols - 1; c++) {
            const x = c * PASO, y = f * PASO
            const a = campo[f * cols + c]
            const b = campo[f * cols + c + 1]
            const d = campo[(f + 1) * cols + c + 1]
            const e = campo[(f + 1) * cols + c]

            // en que lado de la celda cruza el nivel, y donde exactamente.
            // Sin arrays por celda: eran miles de objetos nuevos por cuadro.
            const cruce = (p: number, q: number) => (nivel - p) / (q - p)
            let n = 0, x0 = 0, y0 = 0, x1 = 0, y1 = 0
            const punto = (px: number, py: number) => {
              if (n === 0) { x0 = px; y0 = py } else { x1 = px; y1 = py }
              n++
            }
            if ((a > nivel) !== (b > nivel)) punto(x + PASO * cruce(a, b), y)
            if ((b > nivel) !== (d > nivel)) punto(x + PASO, y + PASO * cruce(b, d))
            if ((e > nivel) !== (d > nivel)) punto(x + PASO * cruce(e, d), y + PASO)
            if ((a > nivel) !== (e > nivel)) punto(x, y + PASO * cruce(a, e))

            if (n === 2) {
              ctx.moveTo(x0, y0)
              ctx.lineTo(x1, y1)
            }
          }
        }
        ctx.stroke()
      }
    }

    let ultimo = -Infinity
    const latir = (ms: number) => {
      if (ms - ultimo >= CADA_MS) {
        dibujar(ms * VELOCIDAD)
        ultimo = ms
      }
      cuadro = requestAnimationFrame(latir)
    }

    /* Arranca cuando la pagina ya cargo y el navegador esta libre: las curvas
       son fondo, no pueden competir con el primer pintado. Con "reducir
       movimiento" se dibujan una vez y quedan quietas. */
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches
    let espera = 0
    const arrancar = () => {
      medir()
      if (quieto) dibujar(0)
      else cuadro = requestAnimationFrame(latir)
    }
    const cuandoLibre = () => {
      const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback
      if (ric) espera = ric(arrancar, { timeout: 1500 })
      else espera = window.setTimeout(arrancar, 600)
    }
    if (document.readyState === "complete") cuandoLibre()
    else addEventListener("load", cuandoLibre, { once: true })

    const alRedimensionar = () => {
      medir()
      if (quieto) dibujar(0)
    }
    addEventListener("resize", alRedimensionar, { passive: true })
    return () => {
      cancelAnimationFrame(cuadro)
      clearTimeout(espera)
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback
      if (cic) cic(espera)
      removeEventListener("load", cuandoLibre)
      removeEventListener("resize", alRedimensionar)
    }
  }, [])

  return <canvas className="curvas" ref={lienzo} aria-hidden="true" />
}

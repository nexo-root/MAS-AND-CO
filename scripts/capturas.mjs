/* Capturas de las paginas nuevas para MIRARLAS antes de publicar. Se sirve
   docs/ tal cual, se recorre cada pagina entera (para que la coreografia de
   scroll termine) y se guarda la pagina completa. */

import { createServer } from "node:http"
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs"
import { dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const DOCS = join(RAIZ, "docs")
const SALIDA = "C:/Users/mfeli/AppData/Local/Temp/claude/C--Users-mfeli/5030377c-375f-49f4-8ad9-5cfb5e16ba8a/scratchpad/seo"
mkdirSync(SALIDA, { recursive: true })
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".txt": "text/plain", ".xml": "application/xml" }

const servidor = createServer((req, res) => {
  const ruta = decodeURIComponent((req.url ?? "/").split("?")[0])
  let archivo = join(DOCS, ruta)
  if (existsSync(archivo) && statSync(archivo).isDirectory()) archivo = join(archivo, "index.html")
  if (!existsSync(archivo)) { res.writeHead(404); res.end(readFileSync(join(DOCS, "404.html"))); return }
  res.setHeader("Content-Type", MIME[extname(archivo)] ?? "application/octet-stream")
  res.end(readFileSync(archivo))
})
await new Promise((r) => servidor.listen(0, "127.0.0.1", r))
const B = `http://127.0.0.1:${servidor.address().port}`

const navegador = await chromium.launch({ channel: "chrome" })

async function capturar(path, nombre, ancho, opciones = {}) {
  const p = await navegador.newPage({ viewport: { width: ancho, height: 900 }, reducedMotion: "no-preference" })
  await p.goto(B + path, { waitUntil: "networkidle" })
  await p.waitForTimeout(800)
  if (opciones.abrirFaq) await p.evaluate(() => document.querySelectorAll(".faq details")[0]?.setAttribute("open", ""))
  const alto = await p.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= alto + 400; y += 350) { await p.mouse.wheel(0, 350); await p.waitForTimeout(45) }
  await p.waitForTimeout(1200)
  /* la pagina completa se captura desde donde quedo el scroll: saltar a 0 con
     scrollTo nativo pelea con Lenis y no representa a ningun usuario */
  if (opciones.hasta) {
    await p.evaluate(() => window.scrollTo(0, 0))
    await p.waitForTimeout(700)
    await p.locator(opciones.hasta).scrollIntoViewIfNeeded()
    await p.waitForTimeout(900)
    await p.screenshot({ path: join(SALIDA, `${nombre}.png`) })
  } else {
    await p.screenshot({ path: join(SALIDA, `${nombre}.png`), fullPage: true })
  }
  console.log(`  ${nombre}.png  (${ancho}px, alto ${alto})`)
  await p.close()
}

console.log("capturas:")
await capturar("/precios/", "precios-1440", 1440, { abrirFaq: true })
await capturar("/precios/", "precios-390", 390)
await capturar("/pagina-web-para-restaurantes/", "rubro-1440", 1440)
await capturar("/pagina-web-para-alojamientos/", "rubro-alojamientos-390", 390)
await capturar("/preguntas-frecuentes/", "faq-1440", 1440, { abrirFaq: true })
await capturar("/", "home-que-hacemos", 1440, { hasta: "#que-hacemos" })
await capturar("/", "home-disenos", 1440, { hasta: "#disenos .enlaces" })

await navegador.close()
servidor.close()
console.log("  en", SALIDA)

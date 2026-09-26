/* Capturas de las paginas nuevas del plan de visibilidad en IA (26/09/2026),
   para MIRARLAS antes de publicar. Misma receta que capturas.mjs: se sirve
   docs/ tal cual, se baja con la rueda (Lenis) y se captura la pagina entera
   desde donde quedo el scroll. Uso: node scripts/capturas-geo.mjs <carpeta> */
import { createServer } from "node:http"
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs"
import { dirname, extname, join } from "node:path"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const DOCS = join(RAIZ, "docs")
const SALIDA = process.argv[2] ?? join(tmpdir(), "capturas-geo")
mkdirSync(SALIDA, { recursive: true })
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml",
  ".png": "image/png", ".webp": "image/webp", ".txt": "text/plain", ".xml": "application/xml", ".woff2": "font/woff2" }
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

/* sin argumentos extra, las de la ronda 2; con --todas, tambien las de la 1 */
const PAGINAS = [
  ["/pagina-web-y-whatsapp/", "web-y-whatsapp"],
  ["/como-elegir-quien-hace-tu-pagina-web/", "como-elegir"],
  ["/pagina-web-para-profesionales/", "profesionales"],
  ["/", "inicio"],
  ...(process.argv.includes("--todas") ? [
    ["/pagina-web-gratis-o-pagada/", "gratis-o-pagada"],
    ["/pagina-web-o-instagram/", "web-o-instagram"],
    ["/contacto/", "contacto"],
    ["/pagina-web-para-restaurantes/", "restaurantes"],
  ] : []),
]
for (const [path, nombre] of PAGINAS) {
  for (const [vista, ancho, escala] of [["compu", 1440, 1], ["celu", 390, 2]]) {
    const p = await navegador.newPage({ viewport: { width: ancho, height: 900 }, deviceScaleFactor: escala, reducedMotion: "no-preference" })
    await p.goto(B + path, { waitUntil: "networkidle" })
    await p.waitForTimeout(800)
    await p.evaluate(() => document.querySelectorAll(".faq details")[0]?.setAttribute("open", ""))
    const alto = await p.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y <= alto + 400; y += 350) { await p.mouse.wheel(0, 350); await p.waitForTimeout(45) }
    await p.waitForTimeout(1200)
    const ancho2 = await p.evaluate(() => document.documentElement.scrollWidth)
    await p.screenshot({ path: join(SALIDA, `${nombre}-${vista}.png`), fullPage: true })
    console.log(`${nombre}-${vista}: alto ${alto}px${ancho2 > ancho + 2 ? "  ⚠️ scroll horizontal " + ancho2 : ""}`)
    await p.close()
  }
}
await navegador.close()
servidor.close()

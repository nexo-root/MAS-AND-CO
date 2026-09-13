/* Prerender: vuelca cada ruta a HTML real, para que un bot sin JavaScript lea
   la pagina entera y no diez palabras.

   Por que con un navegador y no con react-dom/server: scroll.ts instancia
   Lenis y registra GSAP a nivel de modulo, y Curvas pinta un canvas. Nada de
   eso corre en Node sin reescribir la app. Un Chrome real la renderiza tal
   cual es, con window.__PRERENDER__ puesto para que la coreografia no deje
   nada en opacidad cero, y guardamos el DOM resultante.

   Corre despues de `vite build` (ver package.json). Genera ademas:
     docs/<ruta>/index.html   una por ruta de src/seo/rutas.json
     docs/index.html          la home prerenderizada (pisa el cascaron)
     docs/404.html            el cascaron original: cualquier ruta desconocida
                              carga la app y esta decide (GitHub la sirve con 404)
     docs/sitemap.xml         todas las rutas, con prioridad
     docs/robots.txt          abierto, con los bots de IA nombrados y CCBot fuera
     docs/llms.txt            resumen del sitio para modelos de lenguaje */

import { createServer } from "node:http"
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const DOCS = join(RAIZ, "docs")
const ORIGEN = "https://masandcoweb.com"
const rutas = JSON.parse(readFileSync(join(RAIZ, "src/seo/rutas.json"), "utf8"))

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
}

/* el cascaron que dejo Vite: se guarda ANTES de pisarlo con la home */
const cascaron = readFileSync(join(DOCS, "index.html"), "utf8")

/* servidor minimo: archivos de docs/, y el cascaron para toda ruta sin extension */
const servidor = createServer((req, res) => {
  const ruta = decodeURIComponent((req.url ?? "/").split("?")[0])
  let archivo = join(DOCS, ruta)
  if (existsSync(archivo) && statSync(archivo).isDirectory()) archivo = join(archivo, "index.html")
  if (!existsSync(archivo) || !extname(archivo)) {
    res.setHeader("Content-Type", MIME[".html"])
    res.end(cascaron)
    return
  }
  res.setHeader("Content-Type", MIME[extname(archivo)] ?? "application/octet-stream")
  res.end(readFileSync(archivo))
})
await new Promise((r) => servidor.listen(0, "127.0.0.1", r))
const puerto = servidor.address().port

const navegador = await chromium.launch({ channel: "chrome" })
const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } })
await contexto.addInitScript(() => {
  window.__PRERENDER__ = true
})

const palabrasDe = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length

console.log("prerender:")
let fallo = false
for (const r of rutas) {
  const pagina = await contexto.newPage()
  const errores = []
  pagina.on("pageerror", (e) => errores.push(e.message))
  await pagina.goto(`http://127.0.0.1:${puerto}${r.path}`, { waitUntil: "networkidle" })
  /* la Cabeza de ESTA ruta tiene que haber escrito su titulo: eso prueba que
     React monto la pagina correcta y termino su efecto */
  await pagina.waitForFunction((t) => document.title === t, r.titulo, { timeout: 15000 })
  await pagina.waitForTimeout(300)
  const html = await pagina.content()
  const carpeta = join(DOCS, r.path)
  mkdirSync(carpeta, { recursive: true })
  writeFileSync(join(carpeta, "index.html"), html, "utf8")
  const n = palabrasDe(html)
  console.log(
    `  ${r.path.padEnd(34)} ${String(n).padStart(5)} palabras${errores.length ? "  ERRORES JS: " + errores.join(" | ") : ""}`,
  )
  if (errores.length || n < 80) fallo = true
  await pagina.close()
}
await navegador.close()
servidor.close()

writeFileSync(join(DOCS, "404.html"), cascaron, "utf8")

const hoy = new Date().toISOString().slice(0, 10)
writeFileSync(
  join(DOCS, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    rutas
      .map(
        (r) =>
          `  <url>\n    <loc>${ORIGEN}${r.path}</loc>\n    <lastmod>${hoy}</lastmod>\n    <priority>${r.prioridad}</priority>\n  </url>`,
      )
      .join("\n") +
    `\n</urlset>\n`,
  "utf8",
)

writeFileSync(
  join(DOCS, "robots.txt"),
  `User-agent: *
Allow: /

# Buscadores con IA: permitidos a proposito. Bloquearlos es renunciar a que
# ChatGPT, Perplexity, Claude, Gemini o Copilot nos citen cuando alguien
# pregunta por hacer una pagina web en Argentina.
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: PerplexityBot
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: anthropic-ai
User-agent: Google-Extended
User-agent: Bingbot
Allow: /

# Common Crawl solo arma datasets de entrenamiento, no cita a nadie.
User-agent: CCBot
Disallow: /

Sitemap: ${ORIGEN}/sitemap.xml
`,
  "utf8",
)

writeFileSync(
  join(DOCS, "llms.txt"),
  `# Mas & Co

> Agencia de diseño y desarrollo de páginas web para negocios en Argentina. Es la rama de tecnología del grupo Mas (CMD y Mas & Sons), una familia que construye en Misiones desde 2010, con base en Posadas y cobertura en todo el país. Cada página se cotiza por presupuesto para el negocio que la pide, se entrega en días, no en meses, y se paga 50% al arrancar y 50% al verla terminada. Diseño propio, no plantillas. Todo el proceso es por WhatsApp.

## Datos clave

- Precio: por presupuesto, según lo que necesite el negocio (catálogo con fichas por producto, tratamiento de fotos). No hay lista de precios: se cotiza por WhatsApp en el día.
- Plazo: días, no semanas; el plazo exacto va en cada presupuesto y se cuenta desde que se recibe el material del negocio.
- Pago: 50% al arrancar, 50% al ver la página terminada. Si no gusta, no se paga el saldo.
- Mantenimiento opcional (dominio, alojamiento, respaldos, soporte): se cotiza junto con la página, primer mes gratis.
- El dominio se registra a nombre del cliente.
- Casos reales: El Arbolito (pehuencoalquileres.com), Crédito Finan (creditofinan.com).

## Páginas

${rutas.map((r) => `- [${r.nombre}](${ORIGEN}${r.path}): ${r.descripcion}`).join("\n")}

## Contacto

- WhatsApp: +54 9 3764 61-5587
- Email: masandco.mas@gmail.com
- Instagram: https://www.instagram.com/masandco.mas
`,
  "utf8",
)

console.log(`  + 404.html, sitemap.xml (${rutas.length} URLs), robots.txt, llms.txt`)
if (fallo) {
  console.error("prerender: alguna ruta salio con errores de JS o con menos de 80 palabras")
  process.exit(1)
}

/* Verificacion del build como lo va a servir GitHub Pages y como lo va a usar
   una persona: archivos estaticos de docs/, redireccion de /ruta a /ruta/,
   404.html para lo desconocido; y despues navegacion CON CLICS, boton atras,
   hash viejo, tema oscuro, imagenes y errores de JS en cada pagina. */

import { createServer } from "node:http"
import { existsSync, readFileSync, statSync } from "node:fs"
import { dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const DOCS = join(RAIZ, "docs")
const rutas = JSON.parse(readFileSync(join(RAIZ, "src/seo/rutas.json"), "utf8"))
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".txt": "text/plain", ".xml": "application/xml" }

/* imita a GitHub Pages: directorio sin barra -> 301 a la barra; desconocido -> 404.html con 404 */
const servidor = createServer((req, res) => {
  const ruta = decodeURIComponent((req.url ?? "/").split("?")[0])
  let archivo = join(DOCS, ruta)
  if (existsSync(archivo) && statSync(archivo).isDirectory()) {
    if (!ruta.endsWith("/")) { res.writeHead(301, { Location: ruta + "/" }); res.end(); return }
    archivo = join(archivo, "index.html")
  }
  if (!existsSync(archivo)) {
    res.writeHead(404, { "Content-Type": MIME[".html"] })
    res.end(readFileSync(join(DOCS, "404.html")))
    return
  }
  res.setHeader("Content-Type", MIME[extname(archivo)] ?? "application/octet-stream")
  res.end(readFileSync(archivo))
})
await new Promise((r) => servidor.listen(0, "127.0.0.1", r))
const B = `http://127.0.0.1:${servidor.address().port}`

const navegador = await chromium.launch({ channel: "chrome" })
let fallas = 0
const falla = (m) => { fallas++; console.log("  ✗", m) }
const ok = (m) => console.log("  ✓", m)

/* ── A. cada ruta cargada directo (como llega alguien desde Google) ── */
console.log("A · carga directa de cada ruta")
for (const r of rutas) {
  const p = await navegador.newPage({ viewport: { width: 1440, height: 900 } })
  const errores = []
  p.on("pageerror", (e) => errores.push(e.message.slice(0, 100)))
  const resp = await p.goto(B + r.path, { waitUntil: "networkidle" })
  await p.waitForTimeout(600)
  /* recorrer la pagina: las imagenes lazy solo cargan al acercarse */
  const alto = await p.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= alto + 400; y += 400) { await p.mouse.wheel(0, 400); await p.waitForTimeout(40) }
  await p.waitForTimeout(900)
  const d = await p.evaluate(() => ({
    titulo: document.title,
    h1: (document.querySelector("h1")?.textContent ?? "").trim().slice(0, 50),
    imgsRotas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
    imgsSinCargar: [...document.images].filter((i) => !i.complete).length,
    canon: document.querySelector('link[rel=canonical]')?.href,
    ld: document.querySelectorAll('script[type="application/ld+json"]').length,
    desborde: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))
  const problemas = []
  if (resp.status() !== 200) problemas.push(`HTTP ${resp.status()}`)
  if (d.titulo !== r.titulo) problemas.push(`title distinto: "${d.titulo}"`)
  if (d.imgsRotas) problemas.push(`${d.imgsRotas} imagenes rotas`)
  if (d.imgsSinCargar) problemas.push(`${d.imgsSinCargar} imagenes sin cargar tras recorrer`)
  if (d.ld < 2) problemas.push(`solo ${d.ld} JSON-LD`)
  if (d.desborde) problemas.push("desborde horizontal")
  if (errores.length) problemas.push("JS: " + errores.join(" | "))
  problemas.length ? falla(`${r.path}  ${problemas.join("; ")}`) : ok(`${r.path.padEnd(34)} ${d.titulo.slice(0, 48)}`)
  await p.close()
}

/* ── B. navegacion con clics: pushState, sin recarga, y boton atras ── */
console.log("\nB · navegacion con clics desde la home")
{
  const p = await navegador.newPage({ viewport: { width: 1440, height: 900 } })
  const errores = []
  p.on("pageerror", (e) => errores.push(e.message.slice(0, 100)))
  await p.goto(B + "/", { waitUntil: "networkidle" })
  await p.evaluate(() => { window.__marca = "sin-recarga" })
  const pasos = [
    ['header a[href="/precios/"]', "/precios/"],
    ['header a[href="/preguntas-frecuentes/"]', "/preguntas-frecuentes/"],
    ['header a[href="/quienes-somos/"]', "/quienes-somos/"],
    ['footer a[href="/pagina-web-para-restaurantes/"]', "/pagina-web-para-restaurantes/"],
    ['a.marca', "/"],
  ]
  for (const [sel, esperado] of pasos) {
    const hay = await p.waitForSelector(sel, { timeout: 4000, state: "visible" }).catch(() => null)
    if (!hay) {
      const diag = await p.evaluate(() => ({
        hijosRoot: document.getElementById("root")?.childElementCount ?? -1,
        header: !!document.querySelector("header"),
        enlacesHeader: [...document.querySelectorAll("header a")].map((a) => a.getAttribute("href")),
        spacers: document.querySelectorAll(".pin-spacer").length,
      }))
      falla(`no aparece ${sel}  -> root:${diag.hijosRoot} hijos, header:${diag.header}, enlaces:${JSON.stringify(diag.enlacesHeader)}, pin-spacers:${diag.spacers}, JS:${errores.join(" | ") || "ninguno"}`)
      break
    }
    await p.click(sel)
    await p.waitForTimeout(900)
    const est = await p.evaluate(() => ({ path: location.pathname, marca: window.__marca, title: document.title, y: Math.round(window.scrollY) }))
    const r = rutas.find((x) => x.path === esperado)
    const prob = []
    if (est.path !== esperado) prob.push(`path ${est.path}`)
    if (est.marca !== "sin-recarga") prob.push("RECARGO la pagina")
    if (est.title !== r.titulo) prob.push(`title "${est.title.slice(0, 40)}"`)
    if (est.y !== 0) prob.push(`la pagina nueva abrio con scroll ${est.y}, no arriba`)
    prob.length ? falla(`click ${sel} -> ${prob.join("; ")}`) : ok(`click -> ${esperado}  (sin recarga, title ok, scroll ${est.y})`)
  }
  await p.goBack(); await p.waitForTimeout(700)
  const atras = await p.evaluate(() => location.pathname)
  atras === "/pagina-web-para-restaurantes/" ? ok(`atras -> ${atras}`) : falla(`atras -> ${atras}`)
  if (errores.length) falla("JS durante la navegacion: " + errores.join(" | "))
  await p.close()
}

/* ── C. hash viejo, /ruta sin barra, desconocida, tema ── */
console.log("\nC · compatibilidad")
{
  const p = await navegador.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(B + "/#/quienes-somos", { waitUntil: "networkidle" }); await p.waitForTimeout(800)
  const h = await p.evaluate(() => ({ path: location.pathname, hash: location.hash, title: document.title }))
  h.path === "/quienes-somos/" && !h.hash ? ok(`#/quienes-somos -> ${h.path}`) : falla(`#/quienes-somos -> ${JSON.stringify(h)}`)

  const r301 = await p.goto(B + "/precios", { waitUntil: "networkidle" })
  const u = new URL(p.url()).pathname
  u === "/precios/" ? ok(`/precios -> ${u} (${r301.request().redirectedFrom() ? "301" : "directo"})`) : falla(`/precios -> ${u}`)

  const r404 = await p.goto(B + "/esto-no-existe/", { waitUntil: "networkidle" }); await p.waitForTimeout(600)
  const c404 = await p.evaluate(() => ({ title: document.title, tieneHeader: !!document.querySelector("header") }))
  r404.status() === 404 && c404.tieneHeader ? ok(`ruta desconocida -> HTTP 404 y la app igual dibuja (title "${c404.title.slice(0, 40)}")`) : falla(`404: status ${r404.status()} header:${c404.tieneHeader}`)

  await p.goto(B + "/precios/", { waitUntil: "networkidle" })
  await p.click(".palanca"); await p.waitForTimeout(500)
  const tema = await p.evaluate(() => document.documentElement.dataset.tema)
  await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(300)
  const temaTrasRecarga = await p.evaluate(() => document.documentElement.dataset.tema)
  tema === "oscuro" && temaTrasRecarga === "oscuro" ? ok("tema oscuro se aplica y persiste tras recargar") : falla(`tema: ${tema} / tras recarga ${temaTrasRecarga}`)
  await p.close()
}

/* ── D. lo que ve un bot sin JavaScript ── */
console.log("\nD · HTML crudo (sin JavaScript)")
for (const r of rutas) {
  const html = await (await fetch(B + r.path)).text()
  const texto = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ")
  const palabras = texto.split(/\s+/).filter(Boolean).length
  const tieneH1 = /<h1[\s>]/.test(html)
  const enlacesInternos = (html.match(/href="\/[a-z-]*\/?"/g) ?? []).length
  ;(palabras >= 250 && tieneH1 && enlacesInternos >= 6) ? ok(`${r.path.padEnd(34)} ${String(palabras).padStart(4)} palabras · h1 · ${enlacesInternos} enlaces internos`) : falla(`${r.path} ${palabras} palabras, h1:${tieneH1}, enlaces:${enlacesInternos}`)
}

await navegador.close()
servidor.close()
console.log(fallas ? `\n${fallas} FALLAS` : "\nTODO OK")
process.exit(fallas ? 1 : 0)

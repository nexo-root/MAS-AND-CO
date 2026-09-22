/* Analiza la web de CUALQUIERA. Para usar antes de una venta.
 *
 * Es lo que hace la extension Detailed SEO, mas la parte que a ella se le
 * escapa y que en una charla de venta es la que pega: comparar lo que baja
 * Google (HTML crudo) contra lo que ve una persona (con JavaScript). En un
 * sitio hecho con React o Wix mal armado, el robot ve doce palabras y el
 * visitante ochocientas. Eso explica solo por que no aparecen en Google.
 *
 * Uso:  npm run analizar -- https://eldelcliente.com.ar
 *       npm run analizar -- eldelcliente.com.ar --guardar informe.txt
 *
 * No toca nada del sitio ajeno: son dos lecturas, una con fetch y otra con un
 * navegador. Lo mismo que hace cualquier visitante.
 */
import { writeFileSync } from "node:fs"
import { chromium } from "playwright"

const args = process.argv.slice(2)
let url = args.find((a) => !a.startsWith("--"))
if (!url) {
  console.log("uso: npm run analizar -- https://sitio.com.ar")
  process.exit(1)
}
if (!/^https?:\/\//i.test(url)) url = "https://" + url
// indexOf devuelve -1 cuando no esta, y args[-1+1] es args[0], o sea la URL:
// sin este guard intentaba guardar el informe en un archivo llamado como el sitio.
const iGuardar = args.indexOf("--guardar")
const guardarEn = iGuardar >= 0 ? args[iGuardar + 1] : null

const salida = []
const L = (t = "") => { salida.push(t); console.log(t) }
const BIEN = (m) => L(`  \x1b[32m✓\x1b[0m ${m}`)
const OJO = (m) => L(`  \x1b[33m!\x1b[0m ${m}`)
const MAL = (m) => L(`  \x1b[31m✗\x1b[0m ${m}`)

const limpio = (s) => (s ?? "")
  .replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/\s+/g, " ").trim()

const palabrasDe = (html) => limpio(html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")).split(" ").filter(Boolean).length

/* ── 1. lo que baja el robot ───────────────────────────────────────────── */
L(`\n══ ${url} ══\n`)
let crudo = "", estado = 0, ms = 0
try {
  const t0 = Date.now()
  const r = await fetch(url, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (compatible; auditoria)" } })
  ms = Date.now() - t0
  estado = r.status
  crudo = await r.text()
} catch (e) {
  MAL(`no se pudo abrir: ${e.message}`)
  process.exit(1)
}
L("HTML crudo (lo que baja Google)")
estado === 200 ? BIEN(`responde ${estado} en ${ms} ms`) : MAL(`responde ${estado}`)
url.startsWith("https://") ? BIEN("va por HTTPS") : MAL("sin HTTPS — el navegador avisa 'no es seguro'")
const palabrasCrudo = palabrasDe(crudo)

/* ── 2. lo que ve una persona ──────────────────────────────────────────── */
const navegador = await chromium.launch({ channel: "chrome" })
const pagina = await navegador.newPage({ viewport: { width: 390, height: 844 } })
await pagina.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {})
const v = await pagina.evaluate(() => {
  const txt = (s) => (s ?? "").replace(/\s+/g, " ").trim()
  const metaDe = (sel) => txt(document.querySelector(sel)?.content)
  return {
    titulo: txt(document.title),
    descripcion: metaDe('meta[name="description"]'),
    canonical: document.querySelector('link[rel=canonical]')?.href ?? null,
    robots: metaDe('meta[name="robots"]'),
    lang: document.documentElement.lang || null,
    viewport: !!document.querySelector('meta[name="viewport"]'),
    palabras: txt(document.body?.innerText).split(" ").filter(Boolean).length,
    encabezados: [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => ({ n: +h.tagName[1], t: txt(h.innerText).slice(0, 60) })),
    imgs: document.querySelectorAll("img").length,
    imgsSinAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
    og: ["og:title", "og:description", "og:image"].filter((k) => !document.querySelector(`meta[property="${k}"]`)),
    schema: [...document.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap((s) => { try { const d = JSON.parse(s.textContent); return (Array.isArray(d) ? d : [d]).map((x) => x["@type"]) } catch { return ["(roto)"] } }).filter(Boolean),
    whatsapp: !!document.querySelector('a[href*="wa.me"],a[href*="api.whatsapp"],a[href*="whatsapp.com/send"]'),
    tel: !!document.querySelector('a[href^="tel:"]'),
    mapa: !!document.querySelector('a[href*="maps.google"],a[href*="goo.gl/maps"],a[href*="maps.app.goo.gl"],iframe[src*="google.com/maps"]'),
    desbordeH: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  }
})
await navegador.close()

/* ── 3. la comparacion que vende ───────────────────────────────────────── */
const ratio = v.palabras ? palabrasCrudo / v.palabras : 1
L("")
L("Google contra el visitante")
if (v.palabras > 120 && ratio < 0.35)
  MAL(`Google ve ${palabrasCrudo} palabras y el visitante ${v.palabras}: el contenido lo arma JavaScript y el buscador se pierde la mayoria`)
else if (v.palabras > 120 && ratio < 0.7)
  OJO(`Google ve ${palabrasCrudo} de las ${v.palabras} palabras que ve el visitante`)
else BIEN(`Google ve ${palabrasCrudo} palabras, el visitante ${v.palabras}: coinciden`)
if (v.palabras < 250) OJO(`solo ${v.palabras} palabras en la pagina: para Google es poco para entender de que se trata`)

/* ── 4. lo que muestra la extension ────────────────────────────────────── */
L("")
L("Lo basico de la pagina")
v.lang ? BIEN(`idioma ${v.lang}`) : MAL("el <html> no declara idioma")
if (!v.titulo) MAL("sin titulo")
else if (v.titulo.length > 60) OJO(`titulo de ${v.titulo.length} caracteres, se corta en el celular: "${v.titulo}"`)
else BIEN(`titulo ${v.titulo.length} car. · "${v.titulo}"`)
if (!v.descripcion) MAL("sin meta description: Google arma el resumen con lo que encuentra")
else if (v.descripcion.length > 160) OJO(`descripcion de ${v.descripcion.length} caracteres, se corta`)
else BIEN(`descripcion ${v.descripcion.length} car.`)
v.canonical ? BIEN(`canonical ${v.canonical}`) : OJO("sin canonical")
if (v.robots && /noindex/i.test(v.robots)) MAL(`robots dice "${v.robots}": le esta pidiendo a Google que NO la muestre`)

const h1 = v.encabezados.filter((h) => h.n === 1)
if (!h1.length) MAL("sin H1: la pagina no le dice a Google de que es")
else if (h1.length > 1) MAL(`${h1.length} H1 — tiene que haber uno: ${h1.slice(0, 4).map((h) => `"${h.t.slice(0, 22)}"`).join(", ")}${h1.length > 4 ? "…" : ""}`)
else BIEN(`1 H1 · "${h1[0].t}"`)
let prev = 0, saltos = 0
for (const h of v.encabezados) { if (prev && h.n > prev + 1) saltos++; prev = h.n }
if (saltos) OJO(`${saltos} salto(s) en la jerarquia de encabezados (de H1 a H3, por ejemplo)`)

v.imgsSinAlt ? MAL(`${v.imgsSinAlt} de ${v.imgs} imagenes sin texto alternativo`) : BIEN(`${v.imgs} imagenes, todas con alt`)
v.og.length ? OJO(`sin ${v.og.join(", ")}: al pegar el link en WhatsApp sale pelado`) : BIEN("Open Graph completo")
v.schema.length ? BIEN(`schema: ${[...new Set(v.schema)].join(", ")}`) : OJO("sin datos estructurados (schema)")

/* ── 5. lo que mira un cliente, no un robot ────────────────────────────── */
L("")
L("Para el que entra desde el celular")
v.viewport ? BIEN("declara viewport (se adapta al celular)") : MAL("sin viewport: en el celular se ve la version de escritorio achicada")
v.desbordeH ? MAL("la pagina se desborda a lo ancho: hay que arrastrar para leer") : BIEN("no se desborda a lo ancho")
v.whatsapp ? BIEN("tiene link de WhatsApp") : MAL("sin link de WhatsApp: el que quiere escribir tiene que copiar el numero")
v.tel ? BIEN("el telefono es clickeable") : OJO("el telefono no es un link tel:")
v.mapa ? BIEN("tiene mapa o link a Google Maps") : OJO("sin mapa ni link a Google Maps")

const fallas = salida.filter((l) => l.includes("✗")).length
const avisos = salida.filter((l) => l.includes("!")).length
L("")
L(fallas ? `${fallas} problema(s) serio(s) y ${avisos} aviso(s)` : `sin problemas serios · ${avisos} aviso(s)`)

if (guardarEn) {
  writeFileSync(guardarEn, salida.join("\n").replace(/\x1b\[[0-9;]*m/g, ""), "utf8")
  console.log(`\nguardado en ${guardarEn}`)
}

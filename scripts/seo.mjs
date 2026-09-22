/* Auditoria SEO de la pagina, ruta por ruta.
 *
 * Es lo mismo que muestra la extension Detailed SEO, pero de las 8 rutas de una
 * y sin depender de que alguien se acuerde de abrirla. La extension sirve para
 * mirar la web de OTRO (un posible cliente, un competidor); esto es para que la
 * propia no se rompa sin que nadie se entere.
 *
 * Lee el HTML ya construido de docs/, que es lo que Google baja de verdad. No
 * levanta navegador: si algo depende de JavaScript para existir, para el robot
 * no existe, y este script tiene que verlo igual que el robot.
 *
 * Uso:  npm run seo        (falla con codigo 1 si hay algun ERROR)
 */
import { readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "docs")

/* Sale de src/seo/rutas.json, que es la unica fuente de verdad del sitio. Cuando
 * la lista estaba escrita a mano aca, se agregaron dos rutas nuevas y la
 * auditoria dijo "TODO OK" sin haberlas mirado: el peor resultado posible. */
const RUTAS = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "src", "seo", "rutas.json"), "utf8"),
).map((r) => [r.path, r.path === "/" ? "index.html" : r.path.replace(/^\/|\/$/g, "") + "/index.html"])

/* Los limites no son gusto: son el ancho con el que Google corta en el celular.
 * Un titulo de 70 caracteres no es peor, es que se ve la mitad. */
const TITULO = [30, 60]
const DESCRIPCION = [70, 160]

let errores = 0
let avisos = 0
const ERROR = (m) => { errores++; console.log(`    \x1b[31m✗ ${m}\x1b[0m`) }
const AVISO = (m) => { avisos++; console.log(`    \x1b[33m! ${m}\x1b[0m`) }
const BIEN = (m) => console.log(`    \x1b[32m✓\x1b[0m ${m}`)

const limpio = (s) => (s ?? "")
  .replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/\s+/g, " ").trim()

const meta = (html, attr, valor) => {
  const re = new RegExp(`<meta[^>]+${attr}=["']${valor}["'][^>]*>`, "i")
  const etiqueta = html.match(re)?.[0]
  return etiqueta ? limpio(etiqueta.match(/content=["']([^"']*)["']/i)?.[1]) : null
}

for (const [ruta, archivo] of RUTAS) {
  const p = join(RAIZ, archivo)
  console.log(`\n  ${ruta}`)
  if (!existsSync(p)) { ERROR(`no existe ${archivo} — ¿corriste npm run build?`); continue }
  const html = readFileSync(p, "utf8")

  /* ── idioma ── */
  const lang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1]
  lang ? BIEN(`idioma ${lang}`) : ERROR("el <html> no declara lang")

  /* ── titulo ── */
  const titulo = limpio(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1])
  if (!titulo) ERROR("sin <title>")
  else if (titulo.length > TITULO[1]) AVISO(`titulo de ${titulo.length} caracteres, Google corta cerca de ${TITULO[1]}: "${titulo}"`)
  else if (titulo.length < TITULO[0]) AVISO(`titulo corto (${titulo.length}): "${titulo}"`)
  else BIEN(`titulo ${titulo.length} car. · "${titulo}"`)

  /* ── descripcion ── */
  const desc = meta(html, "name", "description")
  if (!desc) ERROR("sin meta description — Google inventa el resumen")
  else if (desc.length > DESCRIPCION[1]) AVISO(`descripcion de ${desc.length} caracteres, se corta cerca de ${DESCRIPCION[1]}`)
  else if (desc.length < DESCRIPCION[0]) AVISO(`descripcion corta (${desc.length})`)
  else BIEN(`descripcion ${desc.length} car.`)

  /* ── canonical ── */
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
    ?.match(/href=["']([^"']+)["']/i)?.[1]
  canonical ? BIEN(`canonical ${canonical}`) : ERROR("sin canonical")

  /* ── robots: que no se cuele un noindex ── */
  const robots = meta(html, "name", "robots")
  if (robots && /noindex/i.test(robots)) ERROR(`robots dice "${robots}" — esta pagina NO se va a indexar`)
  else if (robots) BIEN(`robots ${robots}`)

  /* ── encabezados ── */
  const encabezados = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => ({ n: Number(m[1]), txt: limpio(m[2].replace(/<[^>]+>/g, " ")) }))
  const h1 = encabezados.filter((e) => e.n === 1)
  if (h1.length === 0) ERROR("sin H1")
  else if (h1.length > 1) ERROR(`${h1.length} H1 — tiene que haber UNO: ${h1.map((e) => `"${e.txt.slice(0, 28)}"`).join(", ")}`)
  else BIEN(`1 H1 · "${h1[0].txt.slice(0, 55)}"`)

  /* Un salto de h2 a h4 le rompe el indice a Google y al lector de pantalla. */
  let previo = 0
  for (const e of encabezados) {
    if (previo && e.n > previo + 1) AVISO(`salto de H${previo} a H${e.n} en "${e.txt.slice(0, 34)}"`)
    previo = e.n
  }
  const porNivel = [1, 2, 3, 4].map((n) => `${encabezados.filter((e) => e.n === n).length}×H${n}`).join(" ")
  BIEN(`estructura ${porNivel}`)

  /* ── imagenes sin alt (tambien es accesibilidad, ver abogado-web fase 4) ── */
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0])
  const sinAlt = imgs.filter((t) => !/\balt=/i.test(t))
  sinAlt.length
    ? ERROR(`${sinAlt.length} de ${imgs.length} <img> sin atributo alt`)
    : BIEN(`${imgs.length} imagenes, todas con alt`)

  /* ── lo que se ve al compartir el link ── */
  const faltanOG = ["og:title", "og:description", "og:image"].filter((k) => !meta(html, "property", k))
  faltanOG.length
    ? AVISO(`sin ${faltanOG.join(", ")} — al pegar el link en WhatsApp sale pelado`)
    : BIEN("Open Graph completo")

  /* ── datos estructurados ── */
  /* El @type puede estar en la raiz, en una lista, o adentro de un @graph, que es
   * como lo escribe este sitio y es la forma correcta. Mirando solo la raiz daba
   * "sin schema" en las 8 rutas cuando en realidad estaban todas. */
  const tiposDe = (d) => !d || typeof d !== "object" ? []
    : Array.isArray(d) ? d.flatMap(tiposDe)
    : [...(d["@type"] ? [d["@type"]].flat() : []), ...tiposDe(d["@graph"])]
  const tipos = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((m) => { try { return tiposDe(JSON.parse(m[1])) } catch { return ["(JSON roto)"] } })
    .filter(Boolean)
  tipos.length ? BIEN(`schema: ${tipos.join(", ")}`) : AVISO("sin datos estructurados (schema)")
}

/* ── titulos y descripciones repetidos entre rutas ──
 * Dos paginas con el mismo titulo compiten entre ellas por la misma busqueda y
 * Google termina eligiendo una sola. Es el error que no se ve mirando de a una. */
console.log("\n  entre rutas")
for (const [campo, saca] of [["titulo", (h) => limpio(h.match(/<title>([\s\S]*?)<\/title>/i)?.[1])],
                             ["descripcion", (h) => meta(h, "name", "description")]]) {
  const vistos = new Map()
  for (const [ruta, archivo] of RUTAS) {
    const p = join(RAIZ, archivo)
    if (!existsSync(p)) continue
    const v = saca(readFileSync(p, "utf8"))
    if (v) vistos.set(v, [...(vistos.get(v) ?? []), ruta])
  }
  const repes = [...vistos.entries()].filter(([, r]) => r.length > 1)
  repes.length
    ? repes.forEach(([v, r]) => ERROR(`${campo} repetido en ${r.join(" y ")}: "${v.slice(0, 45)}"`))
    : BIEN(`ningun ${campo} repetido`)
}

console.log(errores ? `\n${errores} ERROR(es) y ${avisos} aviso(s)\n` : `\nTODO OK · ${avisos} aviso(s)\n`)
process.exit(errores ? 1 : 0)

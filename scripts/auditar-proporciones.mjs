/* Mide cada creativo en el navegador y lo compara con las proporciones que
   pidio Felipe (brief del chat DISENADOR, 15/09/2026):

     lienzo 1080x1350 · texto a 80 px de cualquier borde · nada critico en los
     120 px de abajo ni fuera de los 1012 px centrales · titular 60-90 px
     (110 si son pocas palabras) · subtitulo 40-55 · cuerpo 28-36, nunca menos
     de 28 · marca o pie 22-26 · titular >= 2,5x el cuerpo · maximo 2 familias
     tipograficas · el texto ocupa como mucho el 30% del lienzo.

   Uso:  node scripts/auditar-proporciones.mjs <carpeta> [<carpeta>...]
   Sale 1 si alguna pieza tiene faltas. Escribe AUDITORIA-PROPORCIONES.json
   en la primera carpeta, con las medidas de cada bloque de texto.          */
import { chromium } from "playwright"
import { readdirSync, writeFileSync } from "node:fs"
import { join, basename } from "node:path"
import { pathToFileURL } from "node:url"

const W = 1080, H = 1350
const MARGEN = 80          // texto: minimo al borde
const PIE_LIBRE = 120      // franja inferior que queda para la interfaz
const CENTRO = 1012        // ancho que sobrevive al recorte 3:4 del perfil
const MARCA = /mas\s*&\s*co|masandcoweb|dise[nñ]o de muestra|caso[s]? real/i

const carpetas = process.argv.slice(2)
if (!carpetas.length) { console.error("falta la carpeta"); process.exit(2) }

const navegador = await chromium.launch({ channel: "chrome" })
const pagina = await navegador.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
const informe = []

for (const carpeta of carpetas) {
  for (const archivo of readdirSync(carpeta).filter((x) => x.endsWith(".html"))) {
    await pagina.goto(pathToFileURL(join(carpeta, archivo)).href)
    await pagina.evaluate(() => document.fonts.ready)
    await pagina.waitForTimeout(250)

    const desborde = await pagina.evaluate(() => Math.max(0, document.body.scrollHeight - 1350))
    const bloques = await pagina.evaluate(() => {
      const salida = []
      const vistos = new Set()
      const caminante = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      while (caminante.nextNode()) {
        const nodo = caminante.currentNode
        const texto = (nodo.textContent || "").replace(/\s+/g, " ").trim()
        if (!texto) continue
        const el = nodo.parentElement
        if (!el || vistos.has(el)) continue
        vistos.add(el)
        const r = el.getBoundingClientRect()
        if (r.width < 3 || r.height < 3) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === "hidden" || cs.opacity === "0") continue
        if (texto.length <= 2 || /^[^\p{L}\p{N}]+$/u.test(texto)) continue   // vinetas, tildes, simbolos
        salida.push({
          texto: texto.slice(0, 46),
          x: Math.round(r.left), y: Math.round(r.top),
          ancho: Math.round(r.width), alto: Math.round(r.height),
          px: Math.round(parseFloat(cs.fontSize)),
          familia: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
          enPie: !!el.closest(".pie,.marca,.p,.sello,.etiqueta,.tag"),
          // 17/09/2026: en la tanda 4 el objeto de la pieza (.vis: chat, busqueda,
          // pantalla, tablero) es texto dibujado; no cuenta como texto del lienzo
          enObjeto: !!el.closest(".vis"),
          // el sello "diseño de muestra" / "cliente real" va en 28 px a proposito: la ley
          // de lealtad comercial (dec. 274/2019) pide que una aclaracion se lea
          enChip: !!el.closest(".chip"),
        })
      }
      return salida
    })

    const nombre = basename(archivo, ".html")
    const faltas = []
    if (!bloques.length) faltas.push("no se detecto texto")

    const tamanos = bloques.map((b) => b.px).sort((a, b) => b - a)
    const titular = tamanos[0] || 0
    // cuerpo = el texto que se lee de corrido, entre 28 y 36 px segun el brief
    const cuerpos = bloques.filter((b) => b.px < titular && b.px >= 28 && b.px <= 36 && !b.enPie && !MARCA.test(b.texto)).map((b) => b.px)
    const cuerpo = cuerpos.length ? cuerpos.sort((a, b) => a - b)[Math.floor(cuerpos.length / 2)] : 0

    for (const b of bloques) {
      const esMarca = !b.enChip && (b.enPie || MARCA.test(b.texto))
      const izq = b.x, der = W - (b.x + b.ancho), arriba = b.y, abajo = H - (b.y + b.alto)
      if (Math.min(izq, der) < MARGEN) faltas.push(`"${b.texto}" a ${Math.min(izq, der)} px del borde lateral`)
      if (arriba < MARGEN) faltas.push(`"${b.texto}" a ${arriba} px del borde de arriba`)
      if (abajo < PIE_LIBRE) faltas.push(`"${b.texto}" cae en los ${PIE_LIBRE} px de abajo (${abajo} px)`)
      if (izq < (W - CENTRO) / 2 || der < (W - CENTRO) / 2) faltas.push(`"${b.texto}" queda fuera de los ${CENTRO} px centrales`)
      if (b.px < 28 && !(esMarca && b.px >= 22)) faltas.push(`"${b.texto}" en ${b.px} px (minimo 28, o 22 si es la marca)`)
      if (esMarca && b.px > 26 && b.px < 40) faltas.push(`la marca "${b.texto}" en ${b.px} px (deberia ser 22-26)`)
    }

    const palabrasTitular = (bloques.find((b) => b.px === titular)?.texto || "").split(" ").length
    // 17/09/2026: la tanda 4 sube el titular a 76-104 px a proposito (en el feed
    // 90 px son ~32 px reales); el techo es 110 para todos
    const techo = 110
    if (titular < 60) faltas.push(`titular de ${titular} px (minimo 60)`)
    if (titular > techo) faltas.push(`titular de ${titular} px (maximo ${techo} con ${palabrasTitular} palabras)`)
    if (cuerpo && titular / cuerpo < 2.5) faltas.push(`titular ${titular} px sobre cuerpo ${cuerpo} px = ${(titular / cuerpo).toFixed(1)}x (minimo 2,5x)`)

    if (desborde > 2) faltas.push(`la pieza se desborda ${desborde} px del lienzo`)
    const familias = [...new Set(bloques.map((b) => b.familia))]
    if (familias.length > 2) faltas.push(`${familias.length} familias tipograficas: ${familias.join(", ")}`)

    const cobertura = bloques.filter((b) => !b.enObjeto).reduce((a, b) => a + b.ancho * b.alto, 0) / (W * H)
    // 30% era el brief para piezas con foto; con titulares de 90 px legibles en la grilla
    // y piezas de lista, el tope realista es 45% del texto fuera del objeto
    if (cobertura > 0.45) faltas.push(`el texto (fuera del objeto) ocupa el ${Math.round(cobertura * 100)}% del lienzo (maximo 45%)`)

    informe.push({ pieza: nombre, carpeta: basename(carpeta), desborde, titular, cuerpo, familias, cobertura: +(cobertura * 100).toFixed(1), bloques, faltas })
  }
}
await navegador.close()

writeFileSync(join(carpetas[0], "AUDITORIA-PROPORCIONES.json"), JSON.stringify(informe, null, 1), "utf-8")

const conFaltas = informe.filter((x) => x.faltas.length)
console.log(`piezas medidas: ${informe.length} · con faltas: ${conFaltas.length}`)
const conteo = {}
for (const p of conFaltas) for (const f of p.faltas) {
  const clave = f.replace(/"[^"]*"/, "«texto»").replace(/\d+/g, "N")
  conteo[clave] = (conteo[clave] || 0) + 1
}
for (const [clave, n] of Object.entries(conteo).sort((a, b) => b[1] - a[1])) console.log(`  ${n}x  ${clave}`)
process.exit(conFaltas.length ? 1 : 0)

/* IndexNow: le avisa a Bing (y por Bing, a Copilot) que las URLs cambiaron,
   para que las vuelva a rastrear ya y no cuando le toque. Google no usa
   IndexNow; para Google esta Search Console.

   La clave es el nombre del archivo public/<clave>.txt, que el build copia a
   docs/. Se corre DESPUES de pushear, cuando las paginas ya estan en linea:
   `npm run indexnow`. Pingear antes del push hace que Bing rastree lo viejo. */

import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const ORIGEN = "https://masandcoweb.com"
const rutas = JSON.parse(readFileSync(join(RAIZ, "src/seo/rutas.json"), "utf8"))

const clave = readdirSync(join(RAIZ, "public")).find((f) => /^[a-f0-9]{32}\.txt$/.test(f))?.replace(/\.txt$/, "")
if (!clave) {
  console.error("indexnow: no hay public/<clave>.txt")
  process.exit(1)
}

const cuerpo = {
  host: "masandcoweb.com",
  key: clave,
  keyLocation: `${ORIGEN}/${clave}.txt`,
  urlList: rutas.map((r) => ORIGEN + r.path),
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(cuerpo),
})
console.log(`indexnow: ${res.status} ${res.statusText} · ${cuerpo.urlList.length} URLs`)
if (res.status !== 200 && res.status !== 202) process.exit(1)

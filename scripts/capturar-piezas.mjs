/* Fotografia cada HTML de una carpeta a PNG 1080x1350, que es el formato 4:5
   que Instagram prefiere. Mismo pipeline con el que se hizo la tanda 1. */
import { chromium } from "playwright"
import { readdirSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

const DIR = process.argv[2]
const b = await chromium.launch({ channel: "chrome" })
const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 })
for (const f of readdirSync(DIR).filter((x) => x.endsWith(".html"))) {
  await p.goto(pathToFileURL(join(DIR, f)).href)
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(600)
  await p.screenshot({ path: join(DIR, f.replace(/\.html$/, ".png")) })
  console.log("  " + f.replace(/\.html$/, ".png"))
}
await b.close()

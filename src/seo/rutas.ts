import datos from "./rutas.json"

/* La unica fuente de verdad de las rutas. La lee React para rutear y armar la
   cabecera de cada pagina, y la lee scripts/prerender.mjs para saber que
   paginas volcar a HTML, que URLs van al sitemap y que entradas lleva llms.txt.
   Si una ruta no esta aca, no existe. */

export const ORIGEN = "https://masandcoweb.com"

export type Ruta = (typeof datos)[number]
export const RUTAS: Ruta[] = datos

/* "/precios" y "/precios/" y "/precios/index.html" son la misma pagina. */
export function normalizar(pathname: string): string {
  let p = pathname.toLowerCase().replace(/\/index\.html$/, "").replace(/\/+$/, "")
  if (!p) return "/"
  p = p.startsWith("/") ? p : "/" + p
  return p + "/"
}

export const rutaPorId = (id: string): Ruta => RUTAS.find((r) => r.id === id) ?? RUTAS[0]
export const rutaPorPath = (pathname: string): Ruta | undefined => {
  const n = normalizar(pathname)
  return RUTAS.find((r) => r.path === n)
}

/* Los enlaces viejos con hash (#/quienes-somos) siguen circulando: perfil de
   Facebook, mensajes, historial. Se traducen a la ruta real. */
export function rutaDesdeHash(hash: string): Ruta | undefined {
  if (hash.startsWith("#/quienes-somos")) return rutaPorId("quienes")
  if (hash.startsWith("#/terminos")) return rutaPorId("terminos")
  return undefined
}

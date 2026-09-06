import { useEffect } from "react"
import { ORIGEN, type Ruta } from "./rutas"
import { ldPagina } from "./ld"

/* La cabecera de cada pagina: title, description, canonical, Open Graph,
   Twitter y el JSON-LD propio de la ruta. Escribe sobre el <head> con
   "upsert": si la etiqueta ya existe la actualiza, si no la crea. Asi nunca
   quedan dos description ni dos canonical, y el prerender captura el head
   correcto de cada pagina. */

function etiqueta<K extends keyof HTMLElementTagNameMap>(
  selector: string,
  crear: () => HTMLElementTagNameMap[K],
): HTMLElementTagNameMap[K] {
  let el = document.head.querySelector(selector) as HTMLElementTagNameMap[K] | null
  if (!el) {
    el = crear()
    document.head.appendChild(el)
  }
  return el
}

function meta(attr: "name" | "property", clave: string, contenido: string) {
  const m = etiqueta<"meta">(`meta[${attr}="${clave}"]`, () => {
    const e = document.createElement("meta")
    e.setAttribute(attr, clave)
    return e
  })
  m.setAttribute("content", contenido)
}

export function Cabeza({
  ruta,
  imagen,
  ld = [],
}: {
  ruta: Ruta
  /** imagen para compartir: por defecto la de El Arbolito */
  imagen?: string
  /** nodos JSON-LD extra de esta pagina (FAQPage, Service...) */
  ld?: object[]
}) {
  const ldClave = JSON.stringify(ld)
  useEffect(() => {
    const url = ORIGEN + ruta.path
    const img = imagen ?? `${ORIGEN}/fotos/arbolito.webp`

    document.title = ruta.titulo
    meta("name", "description", ruta.descripcion)
    etiqueta<"link">('link[rel="canonical"]', () => {
      const l = document.createElement("link")
      l.rel = "canonical"
      return l
    }).href = url

    meta("property", "og:type", "website")
    meta("property", "og:locale", "es_AR")
    meta("property", "og:site_name", "Mas & Co")
    meta("property", "og:url", url)
    meta("property", "og:title", ruta.titulo)
    meta("property", "og:description", ruta.descripcion)
    meta("property", "og:image", img)
    meta("name", "twitter:card", "summary_large_image")
    meta("name", "twitter:title", ruta.titulo)
    meta("name", "twitter:description", ruta.descripcion)
    meta("name", "twitter:image", img)

    const s = etiqueta<"script">("script#ld-pagina", () => {
      const e = document.createElement("script")
      e.id = "ld-pagina"
      e.type = "application/ld+json"
      return e
    })
    s.textContent = JSON.stringify(ldPagina(ruta, JSON.parse(ldClave)))
  }, [ruta, imagen, ldClave])

  return null
}

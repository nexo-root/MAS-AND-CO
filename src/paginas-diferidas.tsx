import type { ComponentType } from "react"

/* Las paginas que no son la portada se bajan recien cuando alguien entra a
   ellas (26/09/2026): eran ~65 KB que la portada cargaba sin usar.

   NO se usa React.lazy. Con createRoot, el primer render de un componente
   lazy muestra el "fallback" y React borra el HTML prerenderizado que ya se
   estaba viendo: la pagina quedaria en blanco hasta que llegue el pedazo. En
   cambio, el modulo se baja ANTES de dibujar (main.tsx, al entrar directo a
   /precios/) o ANTES de cambiar de ruta (App.tsx, al hacer clic), y recien ahi
   React dibuja. Si la bajada falla (por ejemplo, un deploy nuevo borro el
   pedazo viejo), la app recarga la pagina y el servidor da la version nueva. */

type Pagina = ComponentType

const cargadores: Record<string, () => Promise<Pagina>> = {
  precios: () => import("./precios").then((m) => m.Precios),
  preguntas: () => import("./preguntas").then((m) => m.Preguntas),
  "gratis-o-pagada": () => import("./guias").then((m) => m.GratisOPagada),
  "web-o-instagram": () => import("./guias").then((m) => m.WebOInstagram),
  "web-y-whatsapp": () => import("./guias").then((m) => m.WebYWhatsapp),
  "como-elegir": () => import("./guias").then((m) => m.ComoElegir),
  restaurantes: () => import("./rubros").then((m) => () => <m.Rubro id="restaurantes" />),
  inmobiliarias: () => import("./rubros").then((m) => () => <m.Rubro id="inmobiliarias" />),
  alojamientos: () => import("./rubros").then((m) => () => <m.Rubro id="alojamientos" />),
  profesionales: () => import("./rubros").then((m) => () => <m.Rubro id="profesionales" />),
  "caso-arbolito": () => import("./casos").then((m) => () => <m.Caso id="caso-arbolito" />),
  "caso-finan": () => import("./casos").then((m) => () => <m.Caso id="caso-finan" />),
  quienes: () => import("./paginas").then((m) => m.Quienes),
  contacto: () => import("./paginas").then((m) => m.Contacto),
  terminos: () => import("./paginas").then((m) => m.Terminos),
}

const listas = new Map<string, Pagina>()

/* la pagina ya bajada, o undefined (la portada no se baja: va en el paquete) */
export function paginaLista(id: string): Pagina | undefined {
  return listas.get(id)
}

export function cargarPagina(id: string): Promise<void> {
  const cargar = cargadores[id]
  if (!cargar || listas.has(id)) return Promise.resolve()
  return cargar().then((p) => {
    listas.set(id, p)
  })
}

/* Si no se pudo bajar el pedazo, se recarga la pagina UNA vez: el servidor
   manda el HTML prerenderizado con el paquete nuevo. La marca evita un bucle
   de recargas si el problema es la red. */
export function recargarUnaVez() {
  try {
    if (sessionStorage.getItem("recargada") === location.pathname) return
    sessionStorage.setItem("recargada", location.pathname)
  } catch {
    /* sin sessionStorage igual se intenta */
  }
  location.reload()
}

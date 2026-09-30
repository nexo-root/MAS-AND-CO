import { ORIGEN, type Ruta } from "./rutas"

/* JSON-LD por pagina. Lo que es igual en todo el sitio (Organization, WebSite,
   ProfessionalService con su oferta) vive estatico en index.html; aca va lo que
   cambia con la ruta: la WebPage, sus migas y, si corresponde, el FAQPage o el
   Service de ese rubro. Todo referenciado por @id contra los nodos de index.html
   para que Google lo lea como un solo grafo. */

const ORG = `${ORIGEN}/#organization`
const SITIO = `${ORIGEN}/#website`

export type Pregunta = { q: string; a: string }

/* El tipo de pagina que dice schema.org para las que tienen uno propio (30/09/2026). Los
   buscadores y los asistentes de IA reconocen asi "quienes somos", "contacto" y el listado
   de casos sin deducirlo del texto. Todos son subtipos de WebPage. */
const TIPO_PAGINA: Record<string, string> = {
  quienes: "AboutPage",
  contacto: "ContactPage",
  casos: "CollectionPage",
}

export function ldPagina(ruta: Ruta, extra: object[] = []) {
  const url = ORIGEN + ruta.path
  const migas: object[] = [{ "@type": "ListItem", position: 1, name: "Inicio", item: `${ORIGEN}/` }]
  if (ruta.id.startsWith("caso-"))
    migas.push({ "@type": "ListItem", position: 2, name: "Casos reales", item: `${ORIGEN}/casos/` })
  if (ruta.path !== "/") migas.push({ "@type": "ListItem", position: migas.length + 1, name: ruta.nombre, item: url })
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": TIPO_PAGINA[ruta.id] ?? "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: ruta.titulo,
        description: ruta.descripcion,
        inLanguage: "es-AR",
        isPartOf: { "@id": SITIO },
        about: { "@id": ORG },
        /* fecha real de la ultima modificacion (campo "actualizado" de rutas.json):
           los asistentes de IA prefieren lo fresco, pero solo si es verdad */
        ...(ruta.actualizado ? { dateModified: ruta.actualizado } : {}),
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: migas },
      ...extra,
    ],
  }
}

export function ldFaq(preguntas: Pregunta[]) {
  return {
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  }
}

/* Un trabajo hecho para un cliente real. El nodo describe el sitio que hicimos,
   no el negocio del cliente: nosotros somos el creator y ellos el cliente. Se
   enlaza al sitio publicado para que se pueda verificar. */
export function ldCaso(cliente: string, rubro: string, sitio: string, url: string, imagen: string, publicada: string) {
  return {
    "@type": "CreativeWork",
    "@id": `${url}#caso`,
    name: `Página web de ${cliente}`,
    description: `Página web hecha para ${cliente}, ${rubro.toLowerCase()}.`,
    genre: "Diseño y desarrollo de páginas web",
    creator: { "@id": ORG },
    about: { "@type": "Organization", name: cliente, url: sitio },
    /* el mes en que el sitio del cliente quedo en linea (sale de la fecha del repositorio) */
    dateCreated: publicada,
    datePublished: publicada,
    isPartOf: { "@id": `${ORIGEN}/casos/#webpage` },
    url,
    image: imagen,
    inLanguage: "es-AR",
  }
}

/* El listado de /casos/: una ItemList que apunta a cada CreativeWork por @id. */
export function ldColeccion(casos: { url: string; nombre: string }[]) {
  return {
    "@type": "ItemList",
    "@id": `${ORIGEN}/casos/#lista`,
    name: "Casos reales de Mas & Co",
    numberOfItems: casos.length,
    itemListElement: casos.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.nombre,
      url: c.url,
      item: { "@id": `${c.url}#caso` },
    })),
  }
}

/* Un testimonio escrito por un cliente real, con su permiso. NUNCA uno inventado: marcar
   reseñas falsas es motivo de penalizacion en Google y un problema legal (Ley 24.240). */
export type Testimonio = { cliente: string; autor: string; fecha: string; texto: string }

export function ldTestimonio(t: Testimonio) {
  return {
    "@type": "Review",
    itemReviewed: { "@id": ORG },
    author: { "@type": "Person", name: t.autor, affiliation: { "@type": "Organization", name: t.cliente } },
    datePublished: t.fecha,
    reviewBody: t.texto,
  }
}

export function ldServicio(nombre: string, descripcion: string, url: string) {
  return {
    "@type": "Service",
    "@id": `${url}#servicio`,
    name: nombre,
    serviceType: "Diseño y desarrollo de páginas web",
    description: descripcion,
    provider: { "@id": ORG },
    areaServed: { "@type": "Country", name: "Argentina" },
    url,
    offers: {
      "@type": "Offer",
      url: `${ORIGEN}/precios/`,
      availability: "https://schema.org/InStock",
    },
  }
}

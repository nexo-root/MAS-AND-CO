import { ORIGEN, type Ruta } from "./rutas"

/* JSON-LD por pagina. Lo que es igual en todo el sitio (Organization, WebSite,
   ProfessionalService con su oferta) vive estatico en index.html; aca va lo que
   cambia con la ruta: la WebPage, sus migas y, si corresponde, el FAQPage o el
   Service de ese rubro. Todo referenciado por @id contra los nodos de index.html
   para que Google lo lea como un solo grafo. */

const ORG = `${ORIGEN}/#organization`
const SITIO = `${ORIGEN}/#website`

export type Pregunta = { q: string; a: string }

export function ldPagina(ruta: Ruta, extra: object[] = []) {
  const url = ORIGEN + ruta.path
  const migas: object[] = [{ "@type": "ListItem", position: 1, name: "Inicio", item: `${ORIGEN}/` }]
  if (ruta.path !== "/") migas.push({ "@type": "ListItem", position: 2, name: ruta.nombre, item: url })
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: ruta.titulo,
        description: ruta.descripcion,
        inLanguage: "es-AR",
        isPartOf: { "@id": SITIO },
        about: { "@id": ORG },
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
export function ldCaso(cliente: string, rubro: string, sitio: string, url: string, imagen: string) {
  return {
    "@type": "CreativeWork",
    "@id": `${url}#caso`,
    name: `Página web de ${cliente}`,
    description: `Página web hecha para ${cliente}, ${rubro.toLowerCase()}.`,
    genre: "Diseño y desarrollo de páginas web",
    creator: { "@id": ORG },
    about: { "@type": "Organization", name: cliente, url: sitio },
    url,
    image: imagen,
    inLanguage: "es-AR",
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

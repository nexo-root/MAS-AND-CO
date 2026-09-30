import { Cabeza } from "./seo/Cabeza"
import { ORIGEN, rutaPorId } from "./seo/rutas"
import { ldCaso, ldColeccion, ldFaq, ldTestimonio, type Pregunta, type Testimonio } from "./seo/ld"

const BASE = import.meta.env.BASE_URL
const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20una%20p%C3%A1gina%20para%20mi%20negocio"

/* Una pagina por trabajo hecho, y /casos/ que los junta. Existen por dos motivos
 * distintos y los dos cuentan:
 *
 *  1. PRUEBA. Un caso con nombre, direccion propia, fecha y el sitio abierto al
 *     lado pesa mas que cualquier lista de promesas. Es la "evidencia" que miden
 *     las auditorias de visibilidad en IA (Consulia, 29/09/2026: 61 de 100).
 *  2. BUSQUEDAS. Cada caso es una direccion mas que Google guarda, y pesca la
 *     busqueda de ESE rubro.
 *
 * Regla que manda: solo se dice lo que se ve entrando al sitio del cliente y lo
 * que se puede comprobar (la fecha sale de cuando se creo su repositorio en
 * GitHub). Sin cifras de ventas, sin testimonios que nadie escribio, sin plazos
 * con numero.
 */

type Caso = {
  rutaId: string
  h1: string
  /* La respuesta citable: quien, que, cuando y donde, en 40 a 60 palabras. */
  resumen: string
  /* El punto de partida: el problema del rubro, sin ponerle palabras en la boca al cliente. */
  entrada: string
  cliente: { nombre: string; rubro: string; url: string; dominio: string; foto: string }
  publicada: { texto: string; iso: string }
  /* Lo que se ve al entrar al sitio. Se mira y se anota; no se inventa. */
  seVe: string[]
  porQue: string
  faq: Pregunta[]
  rubroRelacionado?: { texto: string; href: string }
}

export const CASOS: Record<string, Caso> = {
  "caso-finan": {
    rutaId: "caso-finan",
    h1: "Caso real: la página de Crédito Finan, consultora de crédito.",
    resumen:
      "Hicimos la página web de Crédito Finan, una consultora de crédito, y está en línea desde julio de 2026 en creditofinan.com. Dice qué hacen en una frase, tiene un formulario de consulta que les llega al correo y el WhatsApp a un toque. Es un cliente real: la página se puede abrir y comprobar.",
    entrada:
      "Cuando alguien busca un préstamo, lo primero que hace es desconfiar. Un perfil de Instagram sin dirección, sin nombre y sin nada que se pueda verificar juega en contra, por más que el negocio sea serio.",
    cliente: {
      nombre: "Crédito Finan",
      rubro: "Consultora de crédito",
      url: "https://creditofinan.com",
      dominio: "creditofinan.com",
      foto: "creditofinan",
    },
    publicada: { texto: "julio de 2026", iso: "2026-07" },
    seVe: [
      "Qué hacen, dicho en una frase, apenas se entra.",
      "Un formulario de consulta que les llega al correo.",
      "El WhatsApp a un toque, para el que prefiere escribir.",
      "Los requisitos para consultar y los datos del negocio a la vista, que es lo que hace que le crean.",
    ],
    porQue:
      "La página le da al que consulta algo que mirar antes de dejar sus datos. Deja de ser un perfil más y pasa a ser un negocio con dirección propia, que además aparece cuando lo buscan por el nombre.",
    faq: [
      {
        q: "¿El formulario adónde llega?",
        a: "Al correo del cliente, con lo que la persona escribió. No hay que entrar a ningún panel a mirar si llegó algo.",
      },
      {
        q: "¿Sirve si ya atiendo todo por WhatsApp?",
        a: "El WhatsApp sigue estando, y con un toque. Lo que cambia es que el que escribe ya leyó de qué se trata, así que la conversación arranca más adelante.",
      },
      {
        q: "¿La página queda a nombre de quién?",
        a: "El dominio queda a nombre del cliente. Lo que compró es suyo.",
      },
    ],
    rubroRelacionado: {
      texto: "Ver qué lleva una página web para profesionales y consultoras",
      href: "/pagina-web-para-profesionales/",
    },
  },

  "caso-arbolito": {
    rutaId: "caso-arbolito",
    h1: "Caso real: la página de El Arbolito, alojamiento en Pehuén-Có.",
    resumen:
      "Hicimos la página web de El Arbolito, un alojamiento en Pehuén-Có, Buenos Aires, y está en línea desde agosto de 2026 en pehuencoalquileres.com. Muestra las fotos del lugar, cómo llegar y un botón para consultar fechas por WhatsApp. Es un cliente real: la página se puede abrir y comprobar.",
    entrada:
      "Un alojamiento se elige mirando fotos. El problema es que las fotos viven en Instagram, donde se pierden entre publicaciones, y en los portales de reservas, donde están al lado de la competencia y con comisión de por medio.",
    cliente: {
      nombre: "El Arbolito",
      rubro: "Alojamiento en Pehuén-Có, Buenos Aires",
      url: "https://pehuencoalquileres.com",
      dominio: "pehuencoalquileres.com",
      foto: "arbolito",
    },
    publicada: { texto: "agosto de 2026", iso: "2026-08" },
    seVe: [
      "Las fotos del lugar en grande, que es lo primero que mira el que busca dónde parar.",
      "Dónde queda y cómo llegar, sin tener que preguntar.",
      "Un botón que abre el WhatsApp para consultar por fechas.",
      "La página entera en el celular, que es desde donde se busca alojamiento.",
    ],
    porQue:
      "Con la página publicada, el que la encuentra ya vio el lugar, ya sabe dónde queda y escribe para preguntar por fechas. No hay comisión de por medio ni competencia en la misma pantalla.",
    faq: [
      {
        q: "¿La página reemplaza a los portales de reservas?",
        a: "No necesariamente. Convive: el portal le trae gente que no lo conoce y la página propia se queda con el que lo busca por el nombre o por la zona, sin comisión.",
      },
      {
        q: "¿Las fotos las pone el dueño?",
        a: "Sí. Nos las pasa por WhatsApp junto con los datos, y nosotros las acomodamos en la página. Nunca usamos fotos de archivo para un lugar real.",
      },
      {
        q: "¿Se puede cambiar algo después?",
        a: "Sí. El primer mes de cambios no se cobra, y el dominio queda a nombre del cliente.",
      },
    ],
    rubroRelacionado: {
      texto: "Ver qué lleva una página web para alojamientos y cabañas",
      href: "/pagina-web-para-alojamientos/",
    },
  },
}

/* Testimonios REALES: escritos por el cliente, con su nombre (o inicial) y la fecha, y con
 * su permiso para publicarlos. Mientras la lista este vacia no se muestra nada ni se marca
 * nada en el JSON-LD. Se suma uno asi:
 *   { cliente: "Crédito Finan", autor: "Soledad", fecha: "2026-10-02", texto: "..." }
 * El texto va tal cual lo escribio el cliente: sin corregirle el estilo ni agregarle nada. */
export const TESTIMONIOS: Testimonio[] = []

function Testimonios({ lista }: { lista: Testimonio[] }) {
  if (!lista.length) return null
  return (
    <>
      <h2>Lo que dicen los clientes</h2>
      {lista.map((t) => (
        <blockquote key={t.autor + t.fecha}>
          <p>{t.texto}</p>
          <footer>
            {t.autor}, {t.cliente} · {t.fecha.split("-").reverse().join("/")}
          </footer>
        </blockquote>
      ))}
    </>
  )
}

export function Caso({ id }: { id: string }) {
  const c = CASOS[id]
  const ruta = rutaPorId(c.rutaId)
  const imagen = `${ORIGEN}${BASE}fotos/${c.cliente.foto}.webp`
  const suyos = TESTIMONIOS.filter((t) => t.cliente === c.cliente.nombre)

  return (
    <section className="pagina">
      <Cabeza
        ruta={ruta}
        imagen={imagen}
        ld={[
          ldCaso(c.cliente.nombre, c.cliente.rubro, c.cliente.url, ORIGEN + ruta.path, imagen, c.publicada.iso),
          ldFaq(c.faq),
          ...suyos.map(ldTestimonio),
        ]}
      />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · <a href="/casos/">Casos reales</a> · {c.cliente.nombre}
        </p>
        <h1 className="titulo">{c.h1}</h1>
        <p className="respuesta">{c.resumen}</p>
        <p className="seccion-bajada">
          <b>Cliente:</b> {c.cliente.nombre} · <b>Rubro:</b> {c.cliente.rubro} · <b>En línea desde:</b>{" "}
          {c.publicada.texto} ·{" "}
          <a href={c.cliente.url} target="_blank" rel="noopener">
            {c.cliente.dominio}
          </a>
        </p>

        <div className="rubro-vitrina">
          <div className="lienzo">
            <img
              className="ancha"
              src={`${BASE}fotos/${c.cliente.foto}.webp`}
              width={1960}
              height={1274}
              alt={`Página web de ${c.cliente.nombre}, ${c.cliente.rubro.toLowerCase()}, vista en computadora`}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="ficha">
            <h2>{c.cliente.nombre}</h2>
            <small>{c.cliente.rubro}</small>
            <a className="ir" href={c.cliente.url} target="_blank" rel="noopener">
              Abrir el sitio
            </a>
          </div>
          <p className="obra-bajada">Cliente real. La página está publicada y se puede entrar.</p>
        </div>

        <div className="prosa">
          <h2>El punto de partida</h2>
          <p>{c.entrada}</p>

          <h2>Qué hicimos</h2>
          <ul>
            {c.seVe.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <h2>El resultado</h2>
          <p>{c.porQue}</p>
          <p>
            La página está en línea desde {c.publicada.texto} y se puede comprobar entrando a{" "}
            <a href={c.cliente.url} target="_blank" rel="noopener">
              {c.cliente.dominio}
            </a>
            .
          </p>

          <h2>Cómo se trabajó</h2>
          <p>
            El cliente nos escribió por WhatsApp, nos pasó las fotos y los datos por ahí mismo, y
            la vio terminada en su celular antes de pagar la segunda mitad. El dominio quedó a su
            nombre.
          </p>

          <Testimonios lista={suyos} />

          <h2>Preguntas sobre este trabajo</h2>
          <div className="faq">
            {c.faq.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>

          <p className="seccion-bajada">
            {c.rubroRelacionado && (
              <>
                <a href={c.rubroRelacionado.href}>{c.rubroRelacionado.texto}</a>
                {" · "}
              </>
            )}
            <a href="/casos/">Ver todos los casos reales</a>
          </p>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Quiero la mía
            </a>
            <a className="boton borde" href="/precios/">
              Ver qué incluye
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* /casos/: el listado. Es la pagina que un asistente de IA puede citar para justificar
 * que el estudio existe y trabaja: cada caso con su nombre, su fecha y su direccion. */
export function Casos() {
  const ruta = rutaPorId("casos")
  const lista = Object.values(CASOS)
  return (
    <section className="pagina">
      <Cabeza
        ruta={ruta}
        imagen={`${ORIGEN}${BASE}fotos/${lista[0].cliente.foto}.webp`}
        ld={[
          ldColeccion(lista.map((c) => ({ url: ORIGEN + rutaPorId(c.rutaId).path, nombre: `Página web de ${c.cliente.nombre}` }))),
          ...TESTIMONIOS.map(ldTestimonio),
        ]}
      />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · Casos reales
        </p>
        <h1 className="titulo">Casos reales: las páginas que hicimos.</h1>
        <p className="respuesta">
          Estas son páginas web que hicimos para negocios reales. Están publicadas y se pueden
          abrir: no son maquetas ni diseños de muestra. En cada caso contamos qué necesitaba el
          negocio, qué hicimos y desde cuándo está en línea.
        </p>

        {lista.map((c) => (
          <div className="rubro-vitrina" key={c.rutaId}>
            <div className="lienzo">
              <img
                className="ancha"
                src={`${BASE}fotos/${c.cliente.foto}.webp`}
                width={1960}
                height={1274}
                alt={`Página web de ${c.cliente.nombre}, ${c.cliente.rubro.toLowerCase()}, vista en computadora`}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="ficha">
              <h2>{c.cliente.nombre}</h2>
              <small>
                {c.cliente.rubro} · en línea desde {c.publicada.texto}
              </small>
              <a className="ir" href={rutaPorId(c.rutaId).path}>
                Ver el caso
              </a>
            </div>
            <p className="obra-bajada">{c.resumen}</p>
          </div>
        ))}

        <div className="prosa">
          <h2>Por qué mostramos solo trabajos reales</h2>
          <p>
            Un diseño de muestra enseña cómo trabajamos; un caso real enseña que el trabajo existe
            y sigue en línea. Por eso en esta lista no hay maquetas: cada página es de un negocio
            que nos la encargó, y se puede abrir para comprobarla. Las muestras que usamos para
            explicar un rubro, como Brasa o Terra, llevan siempre el sello de diseño de muestra.
          </p>

          <h2>Cómo se trabajó en todos</h2>
          <p>
            Cada cliente nos escribió por WhatsApp, nos pasó las fotos y los datos por ahí mismo y
            vio la página terminada en su celular antes de pagar la segunda mitad. El dominio quedó
            siempre a su nombre.
          </p>

          <Testimonios lista={TESTIMONIOS} />

          <h2>¿Tenés un negocio parecido?</h2>
          <p>
            Mirá qué lleva la página de cada rubro:{" "}
            <a href="/pagina-web-para-restaurantes/">restaurantes</a>,{" "}
            <a href="/pagina-web-para-inmobiliarias/">inmobiliarias</a>,{" "}
            <a href="/pagina-web-para-alojamientos/">alojamientos</a> y{" "}
            <a href="/pagina-web-para-profesionales/">profesionales</a>. Si el tuyo es otro, escribinos
            con el rubro y te pasamos ejemplos y el presupuesto en el día.
          </p>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Quiero la mía
            </a>
            <a className="boton borde" href="/precios/">
              Ver qué incluye
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

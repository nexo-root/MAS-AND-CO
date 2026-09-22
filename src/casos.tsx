import { Cabeza } from "./seo/Cabeza"
import { ORIGEN, rutaPorId } from "./seo/rutas"
import { ldCaso, ldFaq, type Pregunta } from "./seo/ld"

const BASE = import.meta.env.BASE_URL
const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20una%20p%C3%A1gina%20para%20mi%20negocio"

/* Una pagina por trabajo hecho. Existen por dos motivos distintos y los dos
 * cuentan:
 *
 *  1. PRUEBA. Un caso con nombre, direccion propia y el sitio abierto al lado
 *     pesa mas que cualquier lista de promesas. Es el pilar que la fabrica
 *     tiene mas flaco.
 *  2. BUSQUEDAS. Cada caso es una direccion mas que Google guarda, y pesca la
 *     busqueda de ESE rubro. Hoy los clientes viven como una tarjeta adentro de
 *     la pagina del rubro, o sea que no tienen direccion propia.
 *
 * Regla que manda: solo se dice lo que se ve entrando al sitio del cliente. Sin
 * cifras de ventas, sin testimonios que nadie escribio, sin plazos con numero.
 */

type Caso = {
  rutaId: string
  h1: string
  entrada: string
  cliente: { nombre: string; rubro: string; url: string; foto: string }
  /* Lo que se ve al entrar al sitio. Se mira y se anota; no se inventa. */
  seVe: string[]
  /* El problema del rubro, contado sin ponerle palabras en la boca al cliente. */
  porQue: string
  faq: Pregunta[]
  rubroRelacionado?: { texto: string; href: string }
}

export const CASOS: Record<string, Caso> = {
  "caso-arbolito": {
    rutaId: "caso-arbolito",
    h1: "El Arbolito: la página de un alojamiento en Pehuén-Có.",
    entrada:
      "Un alojamiento se elige mirando fotos. El problema es que las fotos viven en Instagram, donde se pierden entre publicaciones, y en los portales de reservas, donde están al lado de la competencia y con comisión de por medio.",
    cliente: {
      nombre: "El Arbolito",
      rubro: "Alojamiento en Pehuén-Có, Buenos Aires",
      url: "https://pehuencoalquileres.com",
      foto: "arbolito",
    },
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

  "caso-finan": {
    rutaId: "caso-finan",
    h1: "Crédito Finan: la página de una consultora de crédito.",
    entrada:
      "Cuando alguien busca un préstamo, lo primero que hace es desconfiar. Un perfil de Instagram sin dirección, sin nombre y sin nada que se pueda verificar juega en contra, por más que el negocio sea serio.",
    cliente: {
      nombre: "Crédito Finan",
      rubro: "Consultora de crédito",
      url: "https://creditofinan.com",
      foto: "creditofinan",
    },
    seVe: [
      "Qué hacen, dicho en una frase, apenas se entra.",
      "Un formulario de consulta que les llega al correo.",
      "El WhatsApp a un toque, para el que prefiere escribir.",
      "Los datos del negocio a la vista, que es lo que hace que le crean.",
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
  },
}

export function Caso({ id }: { id: string }) {
  const c = CASOS[id]
  const ruta = rutaPorId(c.rutaId)
  const imagen = `${ORIGEN}${BASE}fotos/${c.cliente.foto}.webp`

  return (
    <section className="pagina">
      <Cabeza
        ruta={ruta}
        imagen={imagen}
        ld={[
          ldCaso(c.cliente.nombre, c.cliente.rubro, c.cliente.url, ORIGEN + ruta.path, imagen),
          ldFaq(c.faq),
        ]}
      />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · {ruta.nombre}
        </p>
        <h1 className="titulo">{c.h1}</h1>
        <p className="respuesta">{c.entrada}</p>

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
          <h2>Lo que se ve al entrar</h2>
          <ul>
            {c.seVe.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <h2>Qué cambia</h2>
          <p>{c.porQue}</p>

          <h2>Cómo se trabajó</h2>
          <p>
            El cliente nos escribió por WhatsApp, nos pasó las fotos y los datos por ahí mismo, y
            la vio terminada en su celular antes de pagar la segunda mitad. El dominio quedó a su
            nombre.
          </p>

          <h2>Preguntas sobre este trabajo</h2>
          <div className="faq">
            {c.faq.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>

          {c.rubroRelacionado && (
            <p className="seccion-bajada">
              <a href={c.rubroRelacionado.href}>{c.rubroRelacionado.texto}</a>
            </p>
          )}

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

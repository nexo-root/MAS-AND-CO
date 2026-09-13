import { Cabeza } from "./seo/Cabeza"
import { ORIGEN, rutaPorId } from "./seo/rutas"
import { ldFaq, ldServicio, type Pregunta } from "./seo/ld"

const BASE = import.meta.env.BASE_URL
const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20una%20p%C3%A1gina%20para%20mi%20negocio"

/* Una pagina por rubro. No son plantillas con la palabra cambiada: cada una
   dice que necesita ESE negocio en internet, muestra un diseno hecho para ese
   rubro y contesta las tres preguntas que ese dueno hace. La honestidad manda:
   Brasa y Terra son disenos propios y se dice; El Arbolito es un cliente real
   y se enlaza. */

type Vitrina =
  | { tipo: "muestra"; id: string; nombre: string }
  | { tipo: "cliente"; id: string; nombre: string; url: string }

type Rubro = {
  rutaId: string
  h1: string
  respuesta: string
  dolores: { titulo: string; texto: string }[]
  resuelve: string[]
  vitrina: Vitrina
  vitrinaTexto: string
  faq: Pregunta[]
}

export const RUBROS: Record<string, Rubro> = {
  restaurantes: {
    rutaId: "restaurantes",
    h1: "Página web para restaurantes y parrillas.",
    respuesta:
      "Una página para un restaurante tiene que hacer tres cosas: mostrar la carta con precios, decir dónde estás y cuándo abrís, y dejar que reserven por WhatsApp sin llamar. Eso, con tus fotos y tu nombre, con presupuesto en el día y lista en días.",
    dolores: [
      {
        titulo: "Te buscan y aparece otro",
        texto:
          "Alguien googlea “parrilla en tu ciudad” y sale la competencia, un portal de reseñas o nada. Tu Instagram no aparece en esa búsqueda.",
      },
      {
        titulo: "Contestás lo mismo cuarenta veces",
        texto:
          "¿Tienen menú? ¿A qué hora abren? ¿Dónde están? ¿Tienen lugar para diez? Cada mensaje es tiempo que no estás en la cocina ni en el salón.",
      },
      {
        titulo: "La carta vive en una foto borrosa",
        texto:
          "Una captura de pantalla de la carta, con precios viejos, reenviada mil veces. La gente decide con eso.",
      },
    ],
    resuelve: [
      "La carta completa, con precios, que actualizás cuando cambian.",
      "Horarios, dirección con mapa y cómo llegar.",
      "Reservas por WhatsApp con un botón, sin formularios.",
      "Fotos grandes de los platos y del lugar, que es lo que vende.",
      "Que aparezcas cuando te buscan en Google por tu nombre o por tu rubro.",
    ],
    vitrina: { tipo: "muestra", id: "brasa", nombre: "Brasa" },
    vitrinaTexto:
      "Brasa es un diseño nuestro para una parrilla: carta, horarios y una mesa que se reserva por mensaje. No es un cliente, es la muestra de cómo resolvemos el rubro.",
    faq: [
      {
        q: "¿Puedo cambiar la carta y los precios yo mismo?",
        a: "Sí. La carta se arma para que la actualices vos cuando cambian los precios o los platos, sin depender de nadie.",
      },
      {
        q: "¿Sirve para tomar reservas?",
        a: "Sí. La reserva llega directo a tu WhatsApp con un botón. Si preferís un sistema de reservas con mesas y horarios, integramos una plataforma de terceros y la suscripción queda a tu nombre.",
      },
      {
        q: "¿Cuánto cuesta una página web para un restaurante?",
        a: "Se cotiza por presupuesto según lo que necesite tu restaurante, y te lo pasamos por WhatsApp en el día. Lista en días: pagás la mitad al arrancar y la otra mitad cuando la ves terminada.",
      },
    ],
  },

  inmobiliarias: {
    rutaId: "inmobiliarias",
    h1: "Página web para inmobiliarias.",
    respuesta:
      "Una inmobiliaria necesita que cada propiedad tenga su propia ficha, que se pueda filtrar por operación, tipo y zona, y que la visita se coordine por WhatsApp desde la misma página. Eso, con tu cartera y tu marca, con presupuesto en el día y lista en días.",
    dolores: [
      {
        titulo: "Tu cartera vive en los portales",
        texto:
          "Publicás en Zonaprop o Argenprop, pagás por destacar, y el cliente termina comparando con otras veinte inmobiliarias en la misma pantalla.",
      },
      {
        titulo: "Cada propiedad es un PDF o una foto",
        texto:
          "El interesado pregunta por WhatsApp, le mandás fotos sueltas, se pierden en el chat, y a la semana te vuelve a preguntar lo mismo.",
      },
      {
        titulo: "No aparecés por barrio",
        texto:
          "Alguien busca “departamento en alquiler en tu barrio” y encuentra portales, no inmobiliarias. Con fichas propias, sí.",
      },
    ],
    resuelve: [
      "Buscador por operación (venta o alquiler), tipo y zona.",
      "Una ficha por propiedad: fotos, superficie, ambientes, precio y ubicación.",
      "Botón para coordinar la visita por WhatsApp desde cada ficha.",
      "Sección de tasaciones y de contacto.",
      "Que cada propiedad pueda aparecer en Google por su barrio y su tipo.",
    ],
    vitrina: { tipo: "muestra", id: "terra", nombre: "Terra Propiedades" },
    vitrinaTexto:
      "Terra es un diseño nuestro para una inmobiliaria: buscador de propiedades y visitas que se coordinan por WhatsApp. No es un cliente, es la muestra de cómo resolvemos el rubro.",
    faq: [
      {
        q: "¿Puedo cargar y sacar propiedades yo mismo?",
        a: "Sí. Las fichas se arman para que las cargues, edites y retires vos cuando una propiedad se vende o se alquila.",
      },
      {
        q: "¿Reemplaza a los portales?",
        a: "No los reemplaza, los complementa. Seguís publicando donde te convenga, pero la página es tuya: sin competencia en la misma pantalla y sin pagar por destacar.",
      },
      {
        q: "¿Cuánto cuesta una página web para una inmobiliaria?",
        a: "Se cotiza por presupuesto según el tamaño de la cartera y si necesitás integración con un sistema propio. Te lo pasamos por WhatsApp en el día; lista en días.",
      },
    ],
  },

  alojamientos: {
    rutaId: "alojamientos",
    h1: "Página web para alojamientos y cabañas.",
    respuesta:
      "Un alojamiento necesita que reserven directo, sin pagar comisión a una plataforma por cada noche. Fotos grandes, ubicación, qué incluye, reseñas y un botón de WhatsApp. Eso es lo que hicimos para El Arbolito en Pehuén-Có, y lo que hacemos con presupuesto en el día, en días.",
    dolores: [
      {
        titulo: "Pagás comisión por cada reserva",
        texto:
          "Las plataformas se llevan un porcentaje de cada noche. Con una página propia, el que ya te conoce reserva directo y ese porcentaje queda en tu casa.",
      },
      {
        titulo: "El huésped decide con las fotos",
        texto:
          "Una foto chica en un portal compite con cien más. En tu página las fotos son grandes, son tuyas y cuentan el lugar.",
      },
      {
        titulo: "Contestás disponibilidad todo el día",
        texto:
          "¿Tienen para el fin de semana largo? ¿Aceptan mascotas? ¿Está cerca de la playa? Con la información ordenada, las preguntas bajan y las reservas suben.",
      },
    ],
    resuelve: [
      "Fotos grandes de cada unidad y del lugar.",
      "Qué incluye: pileta, parrilla, WiFi, mascotas, estacionamiento.",
      "Ubicación con mapa y distancia a lo que importa (la playa, el centro).",
      "Tus reseñas de Google a la vista.",
      "Consulta y reserva directa por WhatsApp, sin comisión.",
    ],
    vitrina: {
      tipo: "cliente",
      id: "arbolito",
      nombre: "El Arbolito",
      url: "https://pehuencoalquileres.com/",
    },
    vitrinaTexto:
      "El Arbolito es un cliente real: cuatro alojamientos a 35 metros de la playa en Pehuén-Có, con dominio propio y consulta directa por WhatsApp. Podés abrirlo y recorrerlo.",
    faq: [
      {
        q: "¿Puedo seguir usando Booking o Airbnb?",
        a: "Sí. La página no te saca de las plataformas: te da un lugar propio donde el que ya te conoce, o te encuentra en Google, reserva directo sin comisión.",
      },
      {
        q: "¿Se puede mostrar la disponibilidad?",
        a: "La consulta llega a tu WhatsApp y la confirmás vos. Si querés calendario con disponibilidad en vivo, integramos una plataforma de reservas y la suscripción queda a tu nombre.",
      },
      {
        q: "¿Cuánto cuesta una página web para un alojamiento?",
        a: "Se cotiza por presupuesto según lo que necesite tu alojamiento, y te lo pasamos por WhatsApp en el día. Lista en días: pagás la mitad al arrancar y la otra mitad cuando la ves terminada.",
      },
    ],
  },
}

export function Rubro({ id }: { id: keyof typeof RUBROS }) {
  const r = RUBROS[id]
  const ruta = rutaPorId(r.rutaId)
  const imagen = `${ORIGEN}/fotos/${r.vitrina.id}.webp`
  return (
    <section className="pagina">
      <Cabeza
        ruta={ruta}
        imagen={imagen}
        ld={[ldFaq(r.faq), ldServicio(r.h1.replace(/\.$/, ""), r.respuesta, ORIGEN + ruta.path)]}
      />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · {ruta.nombre}
        </p>
        <h1 className="titulo">{r.h1}</h1>
        <p className="respuesta">{r.respuesta}</p>

        <div className="rubro-vitrina">
          <div className="lienzo">
            <img
              className="ancha"
              src={`${BASE}fotos/${r.vitrina.id}.webp`}
              width={1960}
              height={1274}
              alt={`${r.vitrina.nombre}: ${r.h1.replace(/\.$/, "").toLowerCase()} vista en computadora`}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="ficha">
            <h3>{r.vitrina.nombre}</h3>
            {r.vitrina.tipo === "cliente" ? (
              <a className="ir" href={r.vitrina.url} target="_blank" rel="noopener">
                Abrir sitio
              </a>
            ) : (
              <span className="muestra">Diseño de muestra</span>
            )}
          </div>
          <p className="obra-bajada">{r.vitrinaTexto}</p>
        </div>

        <div className="prosa">
          <h2>Lo que le pasa a tu negocio sin página</h2>
          <div className="dos">
            {r.dolores.map((d) => (
              <div key={d.titulo}>
                <h3>{d.titulo}</h3>
                <p>{d.texto}</p>
              </div>
            ))}
          </div>

          <h2>Lo que armamos</h2>
          <ul>
            {r.resuelve.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <h2>Lo que sale</h2>
          <div className="placa">
            <div><b>Por presupuesto</b><span>Te lo pasamos en el día</span></div>
            <div><b>50% y 50%</b><span>Al arrancar y al verla</span></div>
            <div><b>En días</b><span>De principio a fin</span></div>
          </div>
          <p className="seccion-bajada">
            Pagás la mitad al arrancar y la otra mitad recién cuando la ves terminada. Si no te
            gusta, no la pagás. <a href="/precios/">Ver qué incluye y qué va aparte.</a>
          </p>

          <h2>Preguntas de este rubro</h2>
          <div className="faq">
            {r.faq.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Quiero la mía
            </a>
          </div>
          <p className="enlaces">
            {Object.values(RUBROS)
              .filter((o) => o.rutaId !== r.rutaId)
              .map((o) => {
                const rr = rutaPorId(o.rutaId)
                return (
                  <a key={rr.id} href={rr.path}>
                    {rr.nombre}
                  </a>
                )
              })}
            <a href="/preguntas-frecuentes/">Preguntas frecuentes</a>
          </p>
        </div>
      </div>
    </section>
  )
}

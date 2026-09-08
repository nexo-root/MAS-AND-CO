import { Cabeza } from "./seo/Cabeza"
import { ORIGEN, rutaPorId } from "./seo/rutas"
import { ldFaq, ldServicio, type Pregunta } from "./seo/ld"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20consultar%20el%20precio"

/* La pagina que ataca la busqueda de mayor intencion del rubro: "cuanto cuesta
   una pagina web en Argentina". Todos los estudios que rankean ahi contestan
   con un rango; nosotros contestamos con un numero, y abajo del numero, con
   la comparacion contra lo que ellos mismos publican.

   Las cifras de terceros son las que cada estudio publica en su propio sitio,
   con nombre y fecha. No se inventa ni se redondea: si cambian, se actualiza
   aca. */

const MERCADO = [
  {
    que: "Landing page (una sola pantalla)",
    faro: "$80.000 a $150.000",
    dwc: "$250.000 a $1.200.000",
    nos: "",
  },
  {
    que: "Página institucional (varias secciones)",
    faro: "$180.000 a $350.000",
    dwc: "$1.000.000 a $3.000.000",
    nos: "desde $95.000",
  },
  {
    que: "Tienda online",
    faro: "$350.000 a $700.000",
    dwc: "$750.000 a $6.000.000",
    nos: "A cotizar",
  },
  {
    que: "Mantenimiento mensual",
    faro: "$15.000 a $40.000",
    dwc: "$60.000 a $200.000",
    nos: "$30.000, el primer mes gratis",
  },
]

const FAQ: Pregunta[] = [
  {
    q: "¿Cuánto cuesta una página web en Argentina en 2026?",
    a: "Según los estudios que publican sus precios, una página institucional cuesta entre $180.000 y $350.000 en los estudios más accesibles y hasta $3.000.000 en agencias corporativas. En Mas & Co arrancan en $95.000 y el precio final depende de lo que necesite tu negocio: un catálogo con fichas por producto o el tratamiento de fotos suman sobre esa base. Se cotiza en el primer mensaje, lista en 7 días.",
  },
  {
    q: "¿Por qué Mas & Co cobra menos que el promedio?",
    a: "Porque sacamos lo que encarece sin mejorar la página: no hay oficina, ni reuniones, ni intermediarios. Nos contás qué necesitás por WhatsApp, lo armamos con tus fotos y tu información, y lo ves terminado en tu celular antes de pagar el saldo. El diseño es propio, no una plantilla.",
  },
  {
    q: "¿Los $95.000 son el precio de todas las páginas?",
    a: "Son el piso: la página institucional a medida, con diseño y desarrollo completos, listos para publicar. De ahí sube según lo que necesite tu negocio, y las dos cosas que más suman son un catálogo con una ficha por producto y el tratamiento de fotos. El número exacto te lo pasamos en el primer mensaje, antes de que pagues nada. Aparte van solo las suscripciones a plataformas de terceros (turnos, reservas, tienda) y el mantenimiento mensual, y solo si las querés.",
  },
  {
    q: "¿Cómo se paga?",
    a: "La mitad al arrancar y la otra mitad recién cuando ves la página terminada. Si no te gusta, no pagás el saldo.",
  },
  {
    q: "¿Qué es el mantenimiento mensual y cuánto cuesta?",
    a: "Es un abono de $30.000 por mes que cubre el dominio, el alojamiento, los respaldos y el soporte. El primer mes es gratis. Si lo interrumpís, el sitio puede salir de línea y se retoma cuando quieras.",
  },
  {
    q: "¿Cuánto tarda?",
    a: "7 días desde que recibimos tus fotos y la información del negocio.",
  },
]

export function Precios() {
  const ruta = rutaPorId("precios")
  return (
    <section className="pagina">
      <Cabeza
        ruta={ruta}
        ld={[
          ldFaq(FAQ),
          ldServicio(
            "Página web institucional a medida",
            "Diseño y desarrollo de una página web institucional para un negocio, con diseño propio, lista en 7 días. Desde $95.000.",
            ORIGEN + ruta.path,
          ),
        ]}
      />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · Precios
        </p>
        <h1 className="titulo">Cuánto cuesta una página web en Argentina.</h1>

        <p className="respuesta">
          Una página institucional para un negocio cuesta entre $180.000 y $350.000 en los
          estudios más accesibles del país, y arriba de $1.000.000 en las agencias
          corporativas. En Mas &amp; Co arrancan en <b>$95.000</b>, listas en 7 días: pagás la mitad al
          arrancar y la otra mitad cuando la ves terminada. El precio del tuyo depende de
          lo que necesite, y te lo decimos en el primer mensaje.
        </p>

        <div className="placa">
          <div><b>desde $95.000</b><span>El tuyo se cotiza</span></div>
          <div><b>50% y 50%</b><span>Al arrancar y al verla</span></div>
          <div><b>7 días</b><span>De principio a fin</span></div>
        </div>

        <div className="prosa">
          <h2>Lo que cotiza el mercado, y lo que cotizamos nosotros</h2>
          <p>
            Los números de la izquierda no son nuestros: son los que cada estudio publica en su
            propio sitio, con su nombre y su fecha. Los ponemos al lado para que la comparación
            la hagas vos.
          </p>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Qué</th>
                  <th>Faro Studio (2026)</th>
                  <th>Diseño Web Córdoba (2025)</th>
                  <th>Mas &amp; Co</th>
                </tr>
              </thead>
              <tbody>
                {MERCADO.map((f) => (
                  <tr key={f.que}>
                    <td>{f.que}</td>
                    <td data-col="Faro Studio">{f.faro}</td>
                    <td data-col="Diseño Web Córdoba">{f.dwc}</td>
                    <td data-col="Mas &amp; Co" className="nos">{f.nos || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="nota">
            Precios en pesos argentinos publicados por Faro Studio (Fabián Serrudo, mayo de 2026,
            actualizado en agosto) y por Diseño Web Córdoba (octubre de 2025) en sus propios
            sitios. Un dominio .com.ar cuesta además unos $8.500 por año.
          </p>

          <h2>Qué incluyen los $95.000</h2>
          <ul>
            <li>El diseño, hecho para tu negocio. No es una plantilla con tu logo encima.</li>
            <li>El desarrollo completo: la página funcionando, rápida y lista para publicar.</li>
            <li>Que se vea bien en el celular, que es donde la va a abrir casi todo el mundo.</li>
            <li>Botón de WhatsApp, ubicación, horarios, tus fotos y tu información ordenada.</li>
            <li>El dominio se registra a tu nombre: la página es tuya, no nuestra.</li>
            <li>La ves terminada antes de pagar el saldo. Si no te gusta, no lo pagás.</li>
          </ul>

          <h2>Qué va aparte, y por qué</h2>
          <p>
            Dos cosas, y solo si las necesitás. <b>Las plataformas de terceros</b>: si querés
            turnos, reservas o una tienda, la suscripción a esa plataforma queda a tu nombre y la
            paga tu negocio, no nosotros. Y <b>el mantenimiento</b>: $30.000 por mes por el
            dominio, el alojamiento, los respaldos y el soporte, con el primer mes gratis. Si
            algún día lo cortás, el sitio puede salir de línea y se retoma cuando quieras.
          </p>

          <h2>Por qué cuesta menos que el promedio</h2>
          <p>
            Porque sacamos todo lo que encarece una página sin mejorarla. No hay oficina que
            pagar, no hay reuniones, no hay vendedor en el medio. Nos contás qué necesitás por
            WhatsApp, lo armamos con tus fotos y tu información, y lo ves terminado en tu celular
            antes de pagar el saldo. Del otro lado contesta una persona.
          </p>

          <h2>Preguntas sobre el precio</h2>
          <div className="faq">
            {FAQ.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Consultá tu página
            </a>
          </div>
          <p className="enlaces">
            <a href="/preguntas-frecuentes/">Todas las preguntas frecuentes</a>
            <a href="/pagina-web-para-restaurantes/">Para restaurantes</a>
            <a href="/pagina-web-para-inmobiliarias/">Para inmobiliarias</a>
            <a href="/pagina-web-para-alojamientos/">Para alojamientos</a>
          </p>
        </div>
      </div>
    </section>
  )
}

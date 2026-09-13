import { Cabeza } from "./seo/Cabeza"
import { ORIGEN, rutaPorId } from "./seo/rutas"
import { ldFaq, ldServicio, type Pregunta } from "./seo/ld"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20pedir%20presupuesto%20para%20la%20p%C3%A1gina%20de%20mi%20negocio"

/* La pagina que ataca la busqueda de mayor intencion del rubro: "cuanto cuesta
   una pagina web en Argentina". Los estudios que rankean ahi contestan con un
   rango. Nosotros no publicamos precio (decision de Felipe, 11/09/2026: cada
   pagina se cotiza por presupuesto y el numero se pasa por WhatsApp), asi que
   la pagina contesta con lo que publica el mercado y con como se cotiza la tuya.

   Las cifras de terceros son las que cada estudio publica en su propio sitio,
   con nombre y fecha. No se inventa ni se redondea: si cambian, se actualiza
   aca. */

const MERCADO = [
  {
    que: "Landing page (una sola pantalla)",
    faro: "$80.000 a $150.000",
    dwc: "$250.000 a $1.200.000",
    nos: "Por presupuesto",
  },
  {
    que: "Página institucional (varias secciones)",
    faro: "$180.000 a $350.000",
    dwc: "$1.000.000 a $3.000.000",
    nos: "Por presupuesto, en el día",
  },
  {
    que: "Tienda online",
    faro: "$350.000 a $700.000",
    dwc: "$750.000 a $6.000.000",
    nos: "Por presupuesto",
  },
  {
    que: "Mantenimiento mensual",
    faro: "$15.000 a $40.000",
    dwc: "$60.000 a $200.000",
    nos: "Se cotiza con la página; el primer mes es gratis",
  },
]

const FAQ: Pregunta[] = [
  {
    q: "¿Cuánto cuesta una página web en Argentina en 2026?",
    a: "Según los estudios que publican sus precios, una página institucional cuesta entre $180.000 y $350.000 en los estudios más accesibles y hasta $3.000.000 en agencias corporativas. En Mas & Co no hay lista de precios: cada página se cotiza según lo que necesite tu negocio (un catálogo con fichas por producto o el tratamiento de fotos cambian el trabajo), y el presupuesto te lo pasamos por WhatsApp en el día. Lista en 7 días.",
  },
  {
    q: "¿Qué define el precio de tu página?",
    a: "Tres cosas: cuántas secciones lleva, si tiene catálogo con una ficha por producto, y cuánto trabajo piden las fotos. Lo que no lo encarece: no hay oficina, ni reuniones, ni intermediarios. Nos contás qué necesitás por WhatsApp, lo armamos con tus fotos y tu información, y lo ves terminado en tu celular antes de pagar el saldo. El diseño es propio, no una plantilla.",
  },
  {
    q: "¿Tienen lista de precios?",
    a: "No. Cada página se presupuesta para el negocio que la pide, y el número te lo pasamos antes de que pagues nada, por escrito y sin letra chica: qué incluye, qué no y cuánto sale. Aparte van solo las suscripciones a plataformas de terceros (turnos, reservas, tienda) y el mantenimiento, y solo si los querés.",
  },
  {
    q: "¿Cómo se paga?",
    a: "La mitad al arrancar y la otra mitad recién cuando ves la página terminada. Si no te gusta, no pagás el saldo.",
  },
  {
    q: "¿Qué es el mantenimiento y cuánto cuesta?",
    a: "Cubre el dominio, el alojamiento, los respaldos y el soporte. Se cotiza junto con la página y el primer mes es gratis. Si lo interrumpís, el sitio puede salir de línea y se retoma cuando quieras.",
  },
  {
    q: "¿Cuánto tarda?",
    a: "Días, no semanas: depende de lo que lleve la página y de cuándo nos pasás las fotos y la información. El plazo exacto va en el presupuesto.",
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
            "Diseño y desarrollo de una página web institucional para un negocio, con diseño propio, lista en días. Se cotiza por presupuesto.",
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
          corporativas. En Mas &amp; Co no hay lista de precios: <b>cada página se cotiza para
          el negocio que la pide</b>, te pasamos el presupuesto por WhatsApp en el día, y pagás
          la mitad al arrancar y la otra mitad cuando la ves terminada. Lista en días.
        </p>

        <div className="placa">
          <div><b>Por presupuesto</b><span>Te lo pasamos en el día</span></div>
          <div><b>50% y 50%</b><span>Al arrancar y al verla</span></div>
          <div><b>En días</b><span>De principio a fin</span></div>
        </div>

        <div className="prosa">
          <h2>Lo que cotiza el mercado</h2>
          <p>
            Los números no son nuestros: son los que cada estudio publica en su propio sitio,
            con su nombre y su fecha. Los ponemos para que sepas contra qué comparar el
            presupuesto que te pasemos.
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
                    <td data-col="Mas &amp; Co" className="nos">{f.nos}</td>
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

          <h2>Qué incluye el presupuesto</h2>
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
            paga tu negocio, no nosotros. Y <b>el mantenimiento</b>: el dominio, el alojamiento,
            los respaldos y el soporte, que se cotiza junto con la página, con el primer mes
            gratis. Si algún día lo cortás, el sitio puede salir de línea y se retoma cuando
            quieras.
          </p>

          <h2>Por qué no cuesta lo que cobra una agencia</h2>
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
              Pedí tu presupuesto
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

import { Cabeza } from "./seo/Cabeza"
import { rutaPorId } from "./seo/rutas"
import { ldFaq, type Pregunta } from "./seo/ld"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20una%20p%C3%A1gina%20para%20mi%20negocio"

/* Guias para las dos dudas que un dueno de negocio tiene ANTES de pedir
   presupuesto: si puede hacerla gratis y si le alcanza con Instagram. El
   estudio de visibilidad en IA (Consulia, 26/09/2026) mostro que ChatGPT y
   Gemini contestan la primera con Wix y WordPress, y que en "web o Instagram"
   no nombran a nadie.

   Reglas de estas paginas: la respuesta va en el primer parrafo y se sostiene
   sola; la comparacion es honesta y en tabla; los datos de terceros llevan
   fuente y fecha; no hay precio propio (decision de Felipe, 11/09/2026). */

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
  "septiembre", "octubre", "noviembre", "diciembre"]

/* "2026-09-26" → "26 de septiembre de 2026". Se arma a mano: con Date, el
   huso horario puede correr el dia. */
export function Actualizado({ iso }: { iso?: string }) {
  if (!iso) return null
  const [a, m, d] = iso.split("-").map(Number)
  return <p className="nota">Actualizado el {d} de {MESES[m - 1]} de {a}.</p>
}

const GRATIS_FAQ: Pregunta[] = [
  {
    q: "¿Puedo hacer mi página web gratis?",
    a: "Sí. Wix y WordPress.com tienen planes gratis: la página sale con la marca de la plataforma en la dirección (por ejemplo, tunegocio.wixsite.com), muestra su publicidad y la armás y la mantenés vos. Sirve para probar una idea. Para usar tu propio dominio hay que pasar a un plan pago.",
  },
  {
    q: "¿Qué diferencia hay entre usar Wix y contratar a alguien?",
    a: "Con Wix la armás vos sobre una plantilla y pagás un plan, por mes o por año, para tener tu dominio y sacar la publicidad. Si la contratás, la hace otra persona: pagás el trabajo y, si querés, el mantenimiento. Cambia quién pone el tiempo y quién decide el diseño.",
  },
  {
    q: "¿Cuánto cuesta que me hagan una página web?",
    a: "Según lo que publican los estudios de Argentina, una página institucional cuesta entre $180.000 y $350.000 en los más accesibles y más de $1.000.000 en las agencias grandes. En Mas & Co se cotiza por presupuesto y te lo pasamos en el día.",
  },
  {
    q: "¿Qué conviene si quiero vender online con carrito?",
    a: "Una plataforma de tiendas. En agosto de 2026, Tiendanube arrancaba en $26.999 por mes con el plan Esencial (su plan gratis no permite dominio propio) y Empretienda cobraba $10.490 por mes en un plan único, sin comisión por venta. Mercado Shops cerró el 31 de diciembre de 2025.",
  },
  {
    q: "¿Hay algo gratis que le sirva de verdad a mi negocio?",
    a: "Sí: el Perfil de Empresa de Google, la ficha que aparece en Google Maps. Es gratis, muestra horarios, ubicación, fotos y reseñas, y aparece cuando alguien busca un negocio como el tuyo en tu zona. Conviene tenerlo con página web o sin ella.",
  },
]

export function GratisOPagada() {
  const ruta = rutaPorId("gratis-o-pagada")
  return (
    <section className="pagina">
      <Cabeza ruta={ruta} ld={[ldFaq(GRATIS_FAQ)]} />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · ¿Gratis o pagada?
        </p>
        <h1 className="titulo">¿Página web gratis o pagada?</h1>

        <p className="respuesta">
          Una página gratis en Wix o en WordPress.com sirve para probar: sale con la marca de la
          plataforma en la dirección, muestra su publicidad y la armás vos. Para tener tu propio
          dominio y sacar esa publicidad hay que pagar un plan. Y si no querés armarla vos, se
          paga el trabajo de alguien que te la haga.
        </p>
        <Actualizado iso={ruta.actualizado} />

        <div className="prosa">
          <h2>Las tres opciones, lado a lado</h2>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Qué</th>
                  <th>Plan gratis</th>
                  <th>Plan pago de Wix o WordPress</th>
                  <th>Que te la hagan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>La dirección</td>
                  <td data-col="Plan gratis">tunegocio.wixsite.com</td>
                  <td data-col="Plan pago">Tu dominio: tunegocio.com.ar</td>
                  <td data-col="Que te la hagan" className="nos">Tu dominio, registrado a tu nombre</td>
                </tr>
                <tr>
                  <td>Publicidad de la plataforma</td>
                  <td data-col="Plan gratis">Sí, siempre visible</td>
                  <td data-col="Plan pago">No</td>
                  <td data-col="Que te la hagan" className="nos">No</td>
                </tr>
                <tr>
                  <td>Quién la arma</td>
                  <td data-col="Plan gratis">Vos</td>
                  <td data-col="Plan pago">Vos</td>
                  <td data-col="Que te la hagan" className="nos">La persona o el estudio que contratás</td>
                </tr>
                <tr>
                  <td>El diseño</td>
                  <td data-col="Plan gratis">Una plantilla</td>
                  <td data-col="Plan pago">Una plantilla</td>
                  <td data-col="Que te la hagan" className="nos">Según quién la haga: plantilla o diseño propio</td>
                </tr>
                <tr>
                  <td>Qué pagás</td>
                  <td data-col="Plan gratis">Nada, pero ponés tu tiempo</td>
                  <td data-col="Plan pago">El plan, por mes o por año</td>
                  <td data-col="Que te la hagan" className="nos">El trabajo y, si lo querés, el mantenimiento</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Cuándo alcanza con una página gratis</h2>
          <ul>
            <li>Si recién arrancás y querés probar una idea antes de invertir.</li>
            <li>Si no te molesta que la dirección diga wixsite o wordpress, ni la publicidad arriba.</li>
            <li>Si tenés tiempo para armarla, escribir los textos y tenerla al día.</li>
          </ul>

          <h2>Cuándo conviene pagar un plan de la plataforma</h2>
          <ul>
            <li>Si te gusta armarla vos y querés tu propio dominio, sin publicidad.</li>
            <li>Si vas a cambiar cosas seguido y preferís no depender de nadie.</li>
          </ul>

          <h2>Cuándo conviene que te la hagan</h2>
          <ul>
            <li>Si no tenés tiempo para armarla ni para aprender la herramienta.</li>
            <li>Si querés un diseño pensado para tu negocio y no una plantilla.</li>
            <li>
              Si querés que la dejen preparada para los buscadores: títulos, descripciones, la
              ficha de Google y que cargue rápido en el celular.
            </li>
            <li>Si preferís que, cuando necesites un cambio, te conteste una persona.</li>
          </ul>

          <h2>Lo gratis que sí conviene hacer hoy</h2>
          <p>
            El <b>Perfil de Empresa de Google</b>, la ficha que aparece en Google Maps. Es gratis,
            muestra tus horarios, tu ubicación, tus fotos y tus reseñas, y aparece cuando alguien
            busca un negocio como el tuyo en tu zona. Sirve con página web o sin ella, y es lo
            primero que te recomendamos armar.
          </p>

          <h2>Preguntas</h2>
          <div className="faq">
            {GRATIS_FAQ.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>
          <p className="nota">
            Los precios de Tiendanube y Empretienda son los que cada plataforma publicaba en su
            sitio en agosto de 2026. Los de los estudios, los que publican Faro Studio (2026) y
            Diseño Web Córdoba (2025): están en <a href="/precios/">cuánto cuesta una página web</a>.
          </p>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Contanos de qué es tu negocio
            </a>
          </div>
          <p className="enlaces">
            <a href="/pagina-web-o-instagram/">¿Página web o Instagram?</a>
            <a href="/precios/">Cuánto cuesta una página web</a>
            <a href="/preguntas-frecuentes/">Preguntas frecuentes</a>
          </p>
        </div>
      </div>
    </section>
  )
}

const INSTAGRAM_FAQ: Pregunta[] = [
  {
    q: "Ya tengo Instagram, ¿necesito una página web?",
    a: "Depende de cómo te llegan los clientes. Si te buscan por Google, sí: cuando alguien busca por rubro y zona, Google muestra fichas de Google Maps y páginas web, y un perfil de Instagram rara vez aparece ahí. Si todo te llega por tus seguidores, por ahora te alcanza con Instagram y la ficha de Google.",
  },
  {
    q: "¿Instagram aparece en Google?",
    a: "A veces, cuando te buscan por el nombre exacto de tu cuenta. Cuando buscan por rubro y zona, como «parrilla en Rosario», Google muestra primero fichas de Google Maps y páginas web.",
  },
  {
    q: "¿Qué pongo en el link de la bio de Instagram?",
    a: "Tu página web. Ahí la persona encuentra de una vez precios, horarios, ubicación y el botón para escribirte por WhatsApp, sin tener que buscar entre publicaciones e historias.",
  },
  {
    q: "¿Cuánto cuesta tener las dos?",
    a: "Instagram es gratis, salvo que pagues anuncios. La página web cuesta el trabajo de hacerla y el dominio: un .com.ar sale $8.500 por año en NIC Argentina (agosto de 2026). En Mas & Co la página se cotiza por presupuesto y te lo pasamos en el día.",
  },
]

export function WebOInstagram() {
  const ruta = rutaPorId("web-o-instagram")
  return (
    <section className="pagina">
      <Cabeza ruta={ruta} ld={[ldFaq(INSTAGRAM_FAQ)]} />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · ¿Web o Instagram?
        </p>
        <h1 className="titulo">¿Página web o Instagram para tu negocio?</h1>

        <p className="respuesta">
          Las dos, porque hacen trabajos distintos. Instagram le muestra lo que publicás a quien
          ya te sigue y a quien el algoritmo elige. La página web aparece cuando alguien te busca
          en Google, junta precios, horarios y ubicación en un solo lugar, y lleva a que te
          escriban por WhatsApp.
        </p>
        <Actualizado iso={ruta.actualizado} />

        <div className="prosa">
          <h2>Qué hace cada una</h2>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Qué</th>
                  <th>Instagram</th>
                  <th>Página web</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quién te ve</td>
                  <td data-col="Instagram">Tus seguidores y quien el algoritmo elige</td>
                  <td data-col="Página web" className="nos">Quien te busca en Google y quien entra desde tu Instagram</td>
                </tr>
                <tr>
                  <td>Precios, horarios y ubicación</td>
                  <td data-col="Instagram">Repartidos entre publicaciones, historias y mensajes</td>
                  <td data-col="Página web" className="nos">En un solo lugar, siempre a mano</td>
                </tr>
                <tr>
                  <td>De quién es</td>
                  <td data-col="Instagram">La cuenta depende de las reglas de Instagram</td>
                  <td data-col="Página web" className="nos">El dominio y la página, a tu nombre</td>
                </tr>
                <tr>
                  <td>Para qué sirve más</td>
                  <td data-col="Instagram">Mostrar novedades y que te sigan</td>
                  <td data-col="Página web" className="nos">Que te encuentren y te escriban</td>
                </tr>
                <tr>
                  <td>Cuánto cuesta</td>
                  <td data-col="Instagram">Nada, salvo que pagues anuncios</td>
                  <td data-col="Página web" className="nos">El trabajo de hacerla y el dominio ($8.500 por año un .com.ar)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Lo que dicen los datos</h2>
          <p>
            En la encuesta anual de BrightLocal a consumidores de Estados Unidos (febrero de 2026,
            1.002 personas), <b>el 71 % usó Google para encontrar un negocio local</b>, el 97 % leyó
            reseñas antes de elegir uno y el 45 % ya le pide recomendaciones a herramientas de
            inteligencia artificial como ChatGPT. Para Argentina no hay una medición pública igual.
          </p>

          <h2>Cuándo alcanza con Instagram solo</h2>
          <ul>
            <li>Si casi todo lo que vendés se lo vendés a gente que ya te sigue.</li>
            <li>Si todavía estás probando qué vender y cambiás la oferta todas las semanas.</li>
            <li>Si ya tenés tu ficha de Google con horarios, ubicación y reseñas.</li>
          </ul>

          <h2>Cómo se complementan</h2>
          <ul>
            <li>En la bio de Instagram va el link a tu página.</li>
            <li>En la página, el botón de WhatsApp y el link a tu Instagram.</li>
            <li>La ficha de Google lleva a la página, y la página muestra lo que en la ficha no entra.</li>
          </ul>

          <h2>Preguntas</h2>
          <div className="faq">
            {INSTAGRAM_FAQ.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>
          <p className="nota">
            Fuente de los datos: BrightLocal, Local Consumer Review Survey 2026, según el{" "}
            <a href="https://www.pinmeto.com/news/brightlocal-local-consumer-review-survey-2026/"
               target="_blank" rel="noopener">resumen de PinMeTo</a>. El precio del dominio es el
            de NIC Argentina en agosto de 2026.
          </p>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Contanos de qué es tu negocio
            </a>
          </div>
          <p className="enlaces">
            <a href="/pagina-web-gratis-o-pagada/">¿Página web gratis o pagada?</a>
            <a href="/pagina-web-y-whatsapp/">¿Web si vendés por WhatsApp?</a>
            <a href="/precios/">Cuánto cuesta una página web</a>
            <a href="/preguntas-frecuentes/">Preguntas frecuentes</a>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── ¿Vale la pena la web si vendés por WhatsApp? ───────────────────────
   La tercera pregunta de la zona "Objecion" del estudio (26/09/2026), donde
   los asistentes no nombran a nadie. El dato de WhatsApp es del informe
   NubeCommerce 2026 de Tiendanube, con fuente al pie. */

const WHATSAPP_FAQ: Pregunta[] = [
  {
    q: "¿Vale la pena tener página web si vendo por WhatsApp?",
    a: "Sí, si te escribe gente que todavía no te conoce: la página le muestra qué vendés, precios, horarios y ubicación antes de escribirte, y el chat arranca con la persona ya decidida. Si todo te llega de clientes que ya te conocen, por ahora te alcanza con WhatsApp.",
  },
  {
    q: "¿La página reemplaza a WhatsApp?",
    a: "No. La página lleva a WhatsApp: cada sección tiene el botón para escribirte, y el mensaje puede llegar con el producto o la consulta ya escrita. Lo que cambia es que las preguntas de siempre ya están contestadas en la página.",
  },
  {
    q: "¿Puedo mostrar un catálogo y que me pidan por WhatsApp?",
    a: "Sí: un catálogo con fotos y precios que actualizás desde una planilla de Google, y un botón en cada producto que abre WhatsApp con el pedido ya escrito. Sin carrito ni pago online, que para muchos negocios es más de lo que necesitan.",
  },
  {
    q: "¿Cuánto cuesta una página web que lleve a WhatsApp?",
    a: "Se cotiza por presupuesto según lo que necesite tu negocio, y te lo pasamos por WhatsApp en el día. Pagás la mitad al arrancar y la otra mitad cuando la ves terminada.",
  },
]

export function WebYWhatsapp() {
  const ruta = rutaPorId("web-y-whatsapp")
  return (
    <section className="pagina">
      <Cabeza ruta={ruta} ld={[ldFaq(WHATSAPP_FAQ)]} />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · ¿Web si vendés por WhatsApp?
        </p>
        <h1 className="titulo">¿Vale la pena tener página web si vendés por WhatsApp?</h1>

        <p className="respuesta">
          Sí, si te escribe gente que todavía no te conoce. La página le muestra qué vendés,
          precios, horarios y ubicación antes de escribirte, y el chat arranca con la persona ya
          decidida. Si todo te llega de clientes que ya te conocen, por ahora te alcanza con
          WhatsApp.
        </p>
        <Actualizado iso={ruta.actualizado} />

        <div className="prosa">
          <h2>Qué hace cada uno</h2>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Qué</th>
                  <th>WhatsApp solo</th>
                  <th>Página web + WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quién te escribe</td>
                  <td data-col="WhatsApp solo">Quien ya tiene tu número</td>
                  <td data-col="Página + WhatsApp" className="nos">También quien te encontró en Google</td>
                </tr>
                <tr>
                  <td>Lo primero que te preguntan</td>
                  <td data-col="WhatsApp solo">Precios, horarios, dónde estás</td>
                  <td data-col="Página + WhatsApp" className="nos">Lo que la página no contesta</td>
                </tr>
                <tr>
                  <td>Qué ve antes de escribirte</td>
                  <td data-col="WhatsApp solo">Tu foto de perfil y tu estado</td>
                  <td data-col="Página + WhatsApp" className="nos">Tus productos, tus fotos y tus reseñas</td>
                </tr>
                <tr>
                  <td>Tu catálogo</td>
                  <td data-col="WhatsApp solo">Fotos sueltas que reenviás en cada chat</td>
                  <td data-col="Página + WhatsApp" className="nos">Ordenado, con precios, siempre al día</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Lo que dicen los datos</h2>
          <p>
            Según el informe NubeCommerce 2026 de Tiendanube, <b>el 71,5 % de los emprendedores
            de Argentina usó WhatsApp como canal de venta en 2025</b>, el segundo más usado
            después de Instagram. En WhatsApp se cierra la venta; en la página, la persona decide
            escribirte.
          </p>

          <h2>Cómo se usan juntas</h2>
          <ul>
            <li>Un botón de WhatsApp en cada sección de la página, siempre a mano.</li>
            <li>El mensaje llega con el producto o la consulta ya escrita.</li>
            <li>El catálogo vive en la página y el pedido se cierra por WhatsApp.</li>
            <li>El link de la página va en tu perfil de WhatsApp Business y en tus respuestas rápidas.</li>
          </ul>

          <h2>Cuándo te alcanza con WhatsApp solo</h2>
          <ul>
            <li>Si casi todos tus clientes ya te conocen o vienen recomendados.</li>
            <li>Si vendés pocas cosas y las explicás en un mensaje.</li>
            <li>Si no te buscan por Google, ni por tu nombre ni por tu rubro.</li>
          </ul>

          <h2>Preguntas</h2>
          <div className="faq">
            {WHATSAPP_FAQ.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>
          <p className="nota">
            Fuente del dato: informe NubeCommerce 2026 de Tiendanube, citado en su{" "}
            <a href="https://www.tiendanube.com/blog/whatsapp-business/" target="_blank"
               rel="noopener">guía de WhatsApp Business</a>.
          </p>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Contanos de qué es tu negocio
            </a>
          </div>
          <p className="enlaces">
            <a href="/pagina-web-o-instagram/">¿Página web o Instagram?</a>
            <a href="/pagina-web-gratis-o-pagada/">¿Página web gratis o pagada?</a>
            <a href="/precios/">Cuánto cuesta una página web</a>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── ¿Cómo elegir quién te hace la página web? ─────────────────────────
   La zona "Captacion" del estudio es la mas grande: 10 de 40 respuestas son
   "¿qué agencia me recomendás?". Los asistentes contestan con criterios y con
   directorios; esta pagina da los criterios, honestos y verificables, y dice
   donde buscar (incluidos los directorios que ellos leen). Sin precio propio. */

const ELEGIR_FAQ: Pregunta[] = [
  {
    q: "¿Qué agencia de diseño web recomiendan en Argentina?",
    a: "No hay una sola respuesta: depende de tu negocio y de tu presupuesto. Elegí la que pase cinco pruebas: trabajos publicados que puedas abrir, dominio a tu nombre, presupuesto por escrito con lo que incluye, pago en partes y alguien que te conteste después de la entrega.",
  },
  {
    q: "¿Conviene contratar una agencia, un estudio o un freelance?",
    a: "Una agencia grande suma equipo y procesos, y cobra más. Un estudio chico o un freelance suelen ser más directos y más baratos, y conviene mirar bien quién te va a responder después. Para un negocio chico, lo que más pesa es que la página quede a tu nombre y que haya alguien que la mantenga.",
  },
  {
    q: "¿Qué tiene que decir el presupuesto de una página web?",
    a: "Qué páginas o secciones lleva, si el diseño es propio o una plantilla, a nombre de quién queda el dominio, cuánto cuesta y cómo se paga, qué pasa con el mantenimiento y qué va aparte. Si algo de eso no está por escrito, preguntalo antes de pagar.",
  },
  {
    q: "¿Dónde busco quién me haga la página web?",
    a: "En Google Maps, mirando las reseñas; en directorios de agencias como Clutch o Sortlist; y por recomendación de otros negocios. En todos los casos, pedí ver trabajos publicados y abrilos desde tu celular.",
  },
]

export function ComoElegir() {
  const ruta = rutaPorId("como-elegir")
  return (
    <section className="pagina">
      <Cabeza ruta={ruta} ld={[ldFaq(ELEGIR_FAQ)]} />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · ¿Cómo elegir quién te la hace?
        </p>
        <h1 className="titulo">¿Cómo elegir quién te hace la página web?</h1>

        <p className="respuesta">
          Antes de pagar, mirá cinco cosas: que tenga trabajos publicados que puedas abrir, que el
          dominio quede a tu nombre, que el presupuesto diga por escrito qué incluye, que el pago
          sea en partes y que sepas quién te contesta después de la entrega. Vale igual para una
          agencia, un estudio o un freelance.
        </p>
        <Actualizado iso={ruta.actualizado} />

        <div className="prosa">
          <h2>Las cinco preguntas antes de pagar</h2>
          <ol>
            <li><b>¿Puedo ver trabajos publicados?</b> Páginas reales, andando, que puedas abrir desde tu celular. Un diseño de muestra está bien si se dice que es de muestra.</li>
            <li><b>¿A nombre de quién queda el dominio?</b> Tiene que quedar a tu nombre. Si queda a nombre de quien te hace la página, el día que quieras irte vas a depender de esa persona.</li>
            <li><b>¿Qué incluye el presupuesto?</b> Secciones, diseño, dominio, mantenimiento y lo que va aparte, por escrito.</li>
            <li><b>¿Cómo se paga?</b> En partes, con una al final, cuando la ves terminada. Si pagás todo por adelantado, te quedás sin nada para negociar.</li>
            <li><b>¿Quién me contesta después?</b> Una página necesita cambios. Preguntá quién los hace, cuánto tarda y cuánto cuesta.</li>
          </ol>

          <h2>Agencia, estudio, freelance o hacerla vos</h2>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Qué</th>
                  <th>Agencia grande</th>
                  <th>Estudio chico o freelance</th>
                  <th>Hacerla vos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lo que suele costar</td>
                  <td data-col="Agencia grande">Más de $1.000.000</td>
                  <td data-col="Estudio o freelance">Desde $180.000 en los estudios más accesibles</td>
                  <td data-col="Hacerla vos">El plan de la plataforma y tu tiempo</td>
                </tr>
                <tr>
                  <td>Quién te atiende</td>
                  <td data-col="Agencia grande">Un equipo, con un contacto de cuentas</td>
                  <td data-col="Estudio o freelance">La persona que la hace</td>
                  <td data-col="Hacerla vos">Vos, con la ayuda de la plataforma</td>
                </tr>
                <tr>
                  <td>El diseño</td>
                  <td data-col="Agencia grande">Propio</td>
                  <td data-col="Estudio o freelance">Propio o plantilla, según quién</td>
                  <td data-col="Hacerla vos">Una plantilla</td>
                </tr>
                <tr>
                  <td>Mejor para</td>
                  <td data-col="Agencia grande">Empresas con presupuesto y proyectos grandes</td>
                  <td data-col="Estudio o freelance">Negocios que quieren su página sin armarla</td>
                  <td data-col="Hacerla vos">Probar una idea o aprender</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="nota">
            Los rangos de precio son los que publican los propios estudios argentinos (Faro
            Studio, 2026; Diseño Web Córdoba, 2025): están en{" "}
            <a href="/precios/">cuánto cuesta una página web</a>.
          </p>

          <h2>Señales para desconfiar</h2>
          <ul>
            <li>Te piden el total por adelantado.</li>
            <li>No te muestran ninguna página publicada.</li>
            <li>El dominio queda a nombre de ellos y no lo dicen.</li>
            <li>El presupuesto es un número sin detalle.</li>
            <li>Te venden una plantilla como si fuera diseño propio.</li>
          </ul>

          <h2>Preguntas</h2>
          <div className="faq">
            {ELEGIR_FAQ.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Hacenos esas cinco preguntas
            </a>
          </div>
          <p className="enlaces">
            <a href="/precios/">Cuánto cuesta una página web</a>
            <a href="/pagina-web-gratis-o-pagada/">¿Página web gratis o pagada?</a>
            <a href="/quienes-somos/">Quiénes somos</a>
          </p>
        </div>
      </div>
    </section>
  )
}

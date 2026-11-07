import { useEffect, useState } from "react"
import Curvas from "./Curvas"
import VariableFontCursorProximity from "./components/originkit/dynamic-weight"
import { cargarPagina, paginaLista, recargarUnaVez } from "./paginas-diferidas"
import { Cabeza } from "./seo/Cabeza"
import { RUTAS, normalizar, rutaDesdeHash, rutaPorId, rutaPorPath } from "./seo/rutas"
import { useScroll, lenis, revertirScroll } from "./scroll"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20consultar"
const BASE = import.meta.env.BASE_URL

/* ═══════════════════════════════════════════════════════════════
   Mas & Co — papel y tinta.

   Ocho vistas, todas con RUTA REAL: /, /precios/, /preguntas-frecuentes/,
   tres paginas por rubro, /quienes-somos/ y /terminos/. El inicio es el
   recorrido con scroll; el resto vive fuera del recorrido.

   Antes el ruteo era por hash (#/quienes-somos) porque GitHub Pages no
   tiene servidor. El precio era que Google veia UNA sola URL. Ahora cada
   ruta se prerenderiza a docs/<ruta>/index.html (scripts/prerender.mjs),
   asi que GitHub la sirve como archivo y la app la toma con pushState.
   Los hashes viejos se traducen al cargar, para que ningun enlace muera.
   ═══════════════════════════════════════════════════════════════ */

export function rutaActual(): string {
  const vieja = rutaDesdeHash(location.hash)
  if (vieja) {
    history.replaceState(null, "", vieja.path)
    return vieja.id
  }
  return rutaPorPath(location.pathname)?.id ?? "inicio"
}

function usarRuta(): string {
  const [ruta, setRuta] = useState<string>(rutaActual)
  useEffect(() => {
    /* La pagina de destino se baja ANTES de cambiar (paginas-diferidas.tsx):
       mientras llega, sigue a la vista la anterior. Si se hace clic en dos
       enlaces seguidos, gana el ultimo. */
    let pedido = 0
    const cambiar = () => {
      const n = ++pedido
      const destino = rutaActual()
      cargarPagina(destino).then(
        () => {
          if (n !== pedido) return
          revertirScroll() // ver scroll.ts: sin esto React revienta al desmontar la portada clavada
          setRuta(destino)
        },
        recargarUnaVez,
      )
    }
    /* Los enlaces internos no recargan: un solo oyente en el documento
       intercepta cualquier <a href="/..."> sin target y hace pushState. */
    const alClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return
      const href = a.getAttribute("href") ?? ""
      if (!href.startsWith("/") || href.startsWith("//")) return
      e.preventDefault()
      if (normalizar(location.pathname) !== normalizar(href)) history.pushState(null, "", href)
      cambiar()
    }
    addEventListener("popstate", cambiar)
    document.addEventListener("click", alClick)
    return () => {
      removeEventListener("popstate", cambiar)
      document.removeEventListener("click", alClick)
    }
  }, [])
  return ruta
}

/* La palanca de tema, de Uiverse (Uncannypotato69), tal cual su marcado.
   Al cambiarla, toda la pagina cruza de papel a tinta con una transicion
   de color; la eleccion queda guardada. */
function Palanca({ oscuro, alternar }: { oscuro: boolean; alternar: () => void }) {
  return (
    <span className="palanca">
      {/* From Uiverse.io by Uncannypotato69 */}
      <label className="cursor-pointer relative h-[3em] w-[6em] rounded-full bg-[hsl(0,0%,7%)] shadow-[0px_2px_4px_0px_rgb(18,18,18,0.25),0px_4px_8px_0px_rgb(18,18,18,0.35)]">
        <span className="absolute inset-[0.1em] rounded-full border-[1px] border-[hsl(0,0%,25%)]"></span>
        <div className="absolute left-[0.5em] top-1/2 flex h-[2em] w-[2em] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[inset_0px_2px_2px_0px_hsl(0,0%,85%)]">
          <div className="h-[1.5em] w-[1.5em] rounded-full bg-[hsl(0,0%,7%)] shadow-[0px_2px_2px_0px_hsl(0,0%,85%)]"></div>
        </div>
        <div className="absolute right-[0.5em] top-1/2 h-[0.25em] w-[1.5em] -translate-y-1/2 rounded-full bg-[hsl(0,0%,50%)] shadow-[inset_0px_2px_1px_0px_hsl(0,0%,40%)]"></div>
        <input
          className="peer h-[1em] w-[1em] opacity-0"
          type="checkbox"
          checked={oscuro}
          onChange={alternar}
          aria-label="Cambiar entre tema claro y oscuro"
        />
        <span className="absolute left-[0.25em] top-1/2 flex h-[2.5em] w-[2.5em] -translate-y-1/2 items-center justify-center rounded-full bg-[rgb(26,26,26)] shadow-[inset_4px_4px_4px_0px_rgba(64,64,64,0.25),inset_-4px_-4px_4px_0px_rgba(16,16,16,0.5)] duration-300 peer-checked:left-[calc(100%-2.75em)]">
          <span className="relative h-full w-full rounded-full">
            <span className="absolute inset-[0.1em] rounded-full border-[1px] border-[hsl(0,0%,50%)]"></span>
          </span>
        </span>
      </label>
    </span>
  )
}

/* La captura de escritorio va SOLA dentro del marco. Antes tenia el celular
   montado abajo a la derecha, que probaba que el sitio es responsive pero
   tapaba desde el 45% del alto: en El Arbolito se comia el ultimo item de la
   tira de comodidades y en Terra la mitad del buscador. Felipe lo pidio limpio
   y a tamano completo, igual en las cuatro.

   Las capturas van al DOBLE de lo que miden en pantalla. A 980 px se
   mostraban a 1238 y quedaban estiradas un 26% —en retina, la mitad de eso—
   y la letra de las barras de navegacion salia lavada. A 1960 sobra densidad
   y siguen pesando menos de 140 KB cada una. */
function Obra({ id, url, titulo, rubro, bajada }: {
  id: string; url: string; titulo: string; rubro: string; bajada: string
}) {
  return (
    <a className="obra" href={url} target="_blank" rel="noopener">
      <div className="lienzo">
        <img className="ancha" src={`${BASE}fotos/${id}.webp`} srcSet={`${BASE}fotos/${id}-1000.webp 1000w, ${BASE}fotos/${id}.webp 1960w`} sizes="(max-width:760px) 330px, 1240px" width={1960} height={1274}
             loading="lazy" decoding="async" alt={`Sitio de ${titulo} visto en computadora`} />
      </div>
      <div className="ficha">
        <h3>{titulo}</h3>
        <small>{rubro}</small>
        <span className="ir">Abrir sitio</span>
      </div>
      <p className="obra-bajada">{bajada}</p>
    </a>
  )
}

/* Los disenos de muestra son trabajo propio, no encargos: van sin enlace y
   rotulados como lo que son. Mezclarlos con los clientes reales seria vender
   como antecedente algo que nadie pago, y es la linea que no se cruza. */
function Diseno({ id, titulo, rubro, bajada, enlace }: {
  id: string; titulo: string; rubro: string; bajada: string; enlace: string
}) {
  return (
    <div className="obra obra-muestra">
      <div className="lienzo">
        <img className="ancha" src={`${BASE}fotos/${id}.webp`} srcSet={`${BASE}fotos/${id}-1000.webp 1000w, ${BASE}fotos/${id}.webp 1960w`} sizes="(max-width:760px) 330px, 1240px" width={1960} height={1274}
             loading="lazy" decoding="async" alt={`Diseno de muestra ${titulo} en computadora`} />
      </div>
      <div className="ficha">
        <h3><a href={enlace}>{titulo}</a></h3>
        <small>{rubro}</small>
        <span className="muestra">Diseño de muestra</span>
      </div>
      <p className="obra-bajada">{bajada}</p>
    </div>
  )
}

function Inicio() {
  // celu: el texto de «Páginas web para negocios» se pliega; queda entero en el HTML para Google
  const [abierto, setAbierto] = useState(false)
  return (
    <>
      <Cabeza ruta={rutaPorId("inicio")} />
      <section className="portada">
        <div className="eje">
          {/* El logotipo es decoracion, no el titulo de la pagina. Cuando era el
              H1, lo mas importante que leia Google en el inicio era la marca
              repetida (ya esta en el <title>, en el schema y en la barra) en
              lugar de lo que vendemos. El H1 real es la bajada. */}
          <div className="gigante" aria-hidden="true">
            <VariableFontCursorProximity
              label="MAS & CO"
              fromWeight={200}
              toWeight={850}
              strength={42}
              fontSize="clamp(3.4rem, 12.2vw, 12rem)"
              color="var(--tinta)"
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              style={{ overflow: "visible" }}
            />
          </div>
          <div className="piso" />
          <div className="bajo-piso">
            <p className="lugar">Para negocios de toda Argentina</p>
            <h1 className="bajada">Páginas web para negocios <em>que trabajan por vos.</em></h1>
          </div>
          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">Escribinos</a>
          </div>
        </div>
      </section>

      {/* Lo que hacemos, dicho con las palabras con las que la gente lo busca.
          La portada tiene 40 palabras; Google necesita texto para saber de que
          va la pagina, y el visitante que baja necesita saber que estamos
          vendiendo antes de ver las capturas. */}
      <section id="que-hacemos" className={abierto ? "abierto" : undefined}>
        <div className="eje">
          <h2 className="titulo">Páginas web para negocios.</h2>
          <div className="prosa dos">
            <div>
              <p>
                Hacemos la página web de tu negocio o tu comercio: la que aparece cuando alguien te busca en
                Google y adonde mandás a la gente desde Instagram para que vea precios, horarios
                y ubicación, y te escriba por WhatsApp sin que tengas que explicar todo cada vez.
              </p>
              <button type="button" className="leer-mas" onClick={() => setAbierto(true)}>Leer más</button>
              <p className="solo-abierto">
                Diseño web propio para cada negocio, no una plantilla con tu logo encima. Lista en
                días desde que recibimos tus fotos y tu información. El presupuesto, en el día.
              </p>
            </div>
            <div>
              <p className="solo-abierto">
                Trabajamos para todo el país, por WhatsApp. Nos contás qué necesitás, lo armamos,
                lo ves terminado en tu celular, y recién ahí lo pagás. Del otro lado
                contesta una persona, no un formulario.
              </p>
              <p className="enlaces">
                <a href="/precios/">Cuánto cuesta una página web</a>
                <a href="/preguntas-frecuentes/">Preguntas frecuentes</a>
                <a href="/como-elegir-quien-hace-tu-pagina-web/">Cómo elegir quién te la hace</a>
                <a href="/casos/">Ejemplos por rubro</a>
                <a href="/quienes-somos/">Quiénes somos</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Además de la página (7/11/2026). Mas & Co ya hace sistemas (los paneles de Yoyobeach y Festus) y no se veía.
          Fichas con una línea de estado en el color vivo: el servicio andando, no una lista de palabras. */}
      <section id="ademas">
        <div className="eje">
          <h2 className="titulo">Además de la página.</h2>
          <p className="seccion-bajada">La página es la base. Si tu negocio lo necesita, le sumamos herramientas para que trabaje solo.</p>
          <div className="extras">
            <article className="extra">
              <p className="extra-rotulo">La base</p>
              <h3>Tu página web</h3>
              <p>La que aparece en Google y adonde mandás a la gente desde Instagram, con tu dominio.</p>
              <p className="extra-estado"><i></i>Publicada · tunegocio.com.ar</p>
              <a className="extra-ir" href="/casos/">Ver ejemplos</a>
            </article>
            <article className="extra">
              <p className="extra-rotulo">Se suma</p>
              <h3>Turnos, reservas y cuotas</h3>
              <p>La gente ve qué hay libre y pide su lugar; vos lo confirmás desde el celular. También grupos fijos y cuotas del mes.</p>
              <p className="extra-estado"><i></i>Hoy · 4 turnos libres</p>
              <a className="extra-ir" href="/muestras/yoyobeach/#panel">Ver un panel de ejemplo</a>
            </article>
            <article className="extra">
              <p className="extra-rotulo">Se suma</p>
              <h3>Asistente de WhatsApp con IA</h3>
              <p>Contesta precios, horarios y disponibilidad a cualquier hora, y te pasa las consultas de los que quieren comprar.</p>
              <p className="extra-estado"><i></i>Respondió a las 23:41</p>
            </article>
          </div>
        </div>
      </section>

      <section id="trabajos">
        <div className="eje">
          <h2 className="titulo">Publicado y andando.</h2>
          <Obra id="creditofinan" url="https://creditofinan.com/"
                titulo="Crédito Finan" rubro="Créditos"
                bajada="Formulario que llega al correo y a una planilla, sin intermediarios." />
          {/* Los casos tenian pagina propia pero solo se llegaba por el pie: el
              estudio de visibilidad en IA (26/09) ni los encontro. */}
          <p className="enlaces">
            <a href="/casos/">Ejemplos de todos los rubros</a>
            <a href="/caso/credito-finan/">El caso de Crédito Finan</a>
          </p>
        </div>
      </section>

      <section id="disenos">
        <div className="eje">
          <h2 className="titulo">Diseños de muestra, por rubro.</h2>
          <p className="seccion-bajada">
            Estos no son encargos: los hicimos nosotros para mostrar cómo
            resolvemos un rubro cuando arrancamos de cero.
          </p>
          <div className="fila-muestras">
          <Diseno id="brasa" titulo="Brasa" rubro="Parrilla" enlace="/pagina-web-para-restaurantes/"
                  bajada="Carta, horarios y una mesa que se reserva por mensaje." />
          <Diseno id="terra" titulo="Terra Propiedades" rubro="Inmobiliaria" enlace="/pagina-web-para-inmobiliarias/"
                  bajada="Buscador de propiedades y visitas que se coordinan por WhatsApp." />
          </div>
        </div>
      </section>

      {/* Así trabajamos (7/11/2026): los mismos pasos del video del proceso, en filas grandes para leer de un vistazo. */}
      <section id="como">
        <div className="eje">
          <h2 className="titulo">Así trabajamos.</h2>
          <ol className="pasos">
            <li><span>01</span><div><b>Diseños para elegir</b><p>Armamos diseños para tu negocio y elegís el que más te gusta.</p></div></li>
            <li><span>02</span><div><b>Presupuesto en el día</b><p>Te pasamos el precio por WhatsApp antes de arrancar, y no cambia después.</p></div></li>
            <li><span>03</span><div><b>Lista en días</b><p>La ves andando en tu celular, en un link de prueba, con tus fotos y tus datos.</p></div></li>
            <li><span>04</span><div><b>Un solo pago, al final</b><p>Si te gusta, la pagás y se publica con tu dominio. Las consultas te llegan a tu correo y a tu WhatsApp.</p></div></li>
          </ol>
        </div>
      </section>

      {/* El precio va acá y no en la portada: leido despues de cuatro trabajos
          es lo que sale hacer eso, y leido antes es un numero suelto que el
          visitante compara contra seguir con el Instagram, que es gratis. */}
      <section id="precio">
        <div className="eje">
          <h2 className="titulo">Lo que sale una página web.</h2>
          <div className="placa">
            <div><b>Por presupuesto</b><span>Te lo pasamos en el día</span></div>
            <div><b>Un solo pago</b><span>Al final, cuando la ves</span></div>
            <div><b>En días</b><span>De principio a fin</span></div>
          </div>
          <p className="seccion-bajada">
            Te la armamos completa y la ves andando en un link de prueba. Si te gusta, la
            pagás en un solo pago y se publica con tu dominio. Si no te gusta, no pagás.{" "}
            <a href="/precios/">Ver qué incluye y qué cotiza el mercado.</a>
          </p>
        </div>
      </section>
    </>
  )
}

export default function App() {
  const ruta = usarRuta()
  useScroll(ruta)

  /* Normalmente la pagina ya esta bajada (main.tsx y el clic la bajan antes).
     Si no, se baja aca y se vuelve a dibujar al llegar. */
  const Pagina = ruta === "inicio" ? undefined : paginaLista(ruta)
  const [, redibujar] = useState(0)
  useEffect(() => {
    if (ruta === "inicio" || paginaLista(ruta)) return
    cargarPagina(ruta).then(() => redibujar((x) => x + 1), recargarUnaVez)
  }, [ruta])

  /* Arriba de todo en cada ruta nueva. Va en un efecto sobre `ruta` y no
     dentro de cambiar(): ahi la pagina nueva todavia no existe, y medido, un
     clic en el pie dejaba la ruta siguiente abierta en el scroll 2954. Ademas
     Lenis pierde la cuenta cuando el scroll lo movio otro (el navegador al
     enfocar un enlace, por ejemplo), asi que se le pide con force y se
     acompana con el scrollTo nativo. */
  useEffect(() => {
    window.scrollTo(0, 0)
    lenis.scrollTo(0, { immediate: true, force: true })
  }, [ruta])

  const [oscuro, setOscuro] = useState(() => {
    try { return localStorage.getItem("tema") === "oscuro" } catch { return false }
  })
  useEffect(() => {
    document.documentElement.dataset.tema = oscuro ? "oscuro" : "claro"
    try { localStorage.setItem("tema", oscuro ? "oscuro" : "claro") } catch { /* privado */ }
  }, [oscuro])

  /* la barra gana fondo apenas se scrollea: mira un centinela de 1px */
  useEffect(() => {
    const cab = document.querySelector("header")
    const c = document.getElementById("centinela")
    if (!cab || !c) return
    const ob = new IntersectionObserver(
      (e) => cab.classList.toggle("pegada", !e[0].isIntersecting),
      { threshold: 0 }
    )
    ob.observe(c)
    return () => ob.disconnect()
  }, [])

  return (
    <>
      <Curvas />
      <div id="centinela" style={{ position: "absolute", top: 0, height: 1, width: 1 }} />
      <div className="progreso" aria-hidden="true" />

      <header>
        <div className="eje barra">
          <a className="marca" href="/">MAS &amp; CO</a>
          <nav className="menu">
            <a href="/precios/">Precios</a>
            <a href="/casos/">Ejemplos</a>
            <a href="/quienes-somos/">Quiénes somos</a>
            <a href="/preguntas-frecuentes/">Preguntas</a>
          </nav>
          <Palanca oscuro={oscuro} alternar={() => setOscuro(!oscuro)} />
        </div>
      </header>

      <main>
        {ruta === "inicio" ? <Inicio /> : Pagina && <Pagina />}

        <section className="tinta" id="contacto">
          <div className="eje">
            <p className="rama">La rama de tecnología del grupo Mas, junto a CMD y Mas &amp; Sons.</p>
            <h2 className="titulo enorme">Contanos qué<br />necesitás.</h2>
            <div className="acciones">
              <a className="boton claro" href={WA} target="_blank" rel="noopener">Escribinos por WhatsApp</a>
            </div>
            <div className="vias">
              <a href="https://wa.me/5493764615587" target="_blank" rel="noopener">+54 9 3764 61-5587</a>
              <a href="mailto:masandco.mas@gmail.com">masandco.mas@gmail.com</a>
              <a href="https://instagram.com/masandco.mas" target="_blank" rel="noopener">@masandco.mas</a>
            </div>
          </div>
          <footer>
            <div className="eje pie">
              <span className="logo-pie">MAS &amp; CO</span>
              <nav className="pie-enlaces">
                {RUTAS.filter((r) => r.path !== "/").map((r) => (
                  <a key={r.id} href={r.path}>{r.nombre}</a>
                ))}
              </nav>
              <span>Argentina</span>
            </div>
          </footer>
        </section>
      </main>

      <a className="fijo" href={WA} target="_blank" rel="noopener">Escribinos por WhatsApp</a>
    </>
  )
}

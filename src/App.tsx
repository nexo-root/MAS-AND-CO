import { useEffect, useState } from "react"
import Curvas from "./Curvas"
import VariableFontCursorProximity from "./components/originkit/dynamic-weight"
import { Quienes, Terminos } from "./paginas"
import { Precios } from "./precios"
import { Preguntas } from "./preguntas"
import { Rubro } from "./rubros"
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

function rutaActual(): string {
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
    const cambiar = () => {
      revertirScroll() // ver scroll.ts: sin esto React revienta al desmontar la portada clavada
      setRuta(rutaActual())
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
        <img className="ancha" src={`${BASE}fotos/${id}.webp`} width={1960} height={1274}
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
        <img className="ancha" src={`${BASE}fotos/${id}.webp`} width={1960} height={1274}
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
  return (
    <>
      <Cabeza ruta={rutaPorId("inicio")} />
      <section className="portada">
        <div className="eje">
          <h1 className="gigante">
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
          </h1>
          <div className="piso" />
          <div className="bajo-piso">
            <p className="lugar">Desde Posadas, para todo el país</p>
            <p className="bajada">Sitios web <em>que trabajan por vos.</em></p>
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
      <section id="que-hacemos">
        <div className="eje">
          <h2 className="titulo">Páginas web para negocios que venden por WhatsApp.</h2>
          <div className="prosa dos">
            <div>
              <p>
                Hacemos la página web de tu negocio: la que aparece cuando alguien te busca en
                Google y adonde mandás a la gente desde Instagram para que vea precios, horarios
                y ubicación, y te escriba por WhatsApp sin que tengas que explicar todo cada vez.
              </p>
              <p>
                Diseño propio para cada negocio, no una plantilla con tu logo encima. Lista en 7
                días desde que recibimos tus fotos y tu información. Desde $95.000, precio final.
              </p>
            </div>
            <div>
              <p>
                Trabajamos para todo el país, por WhatsApp. Nos contás qué necesitás, lo armamos,
                lo ves terminado en tu celular, y recién ahí pagás el saldo. Del otro lado
                contesta una persona, no un formulario.
              </p>
              <p className="enlaces">
                <a href="/precios/">Cuánto cuesta una página web</a>
                <a href="/preguntas-frecuentes/">Preguntas frecuentes</a>
                <a href="/quienes-somos/">Quiénes somos</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="trabajos">
        <div className="eje">
          <h2 className="titulo">Sitios publicados y andando.</h2>
          <Obra id="arbolito" url="https://pehuencoalquileres.com/"
                titulo="El Arbolito" rubro="Alojamientos · Pehuén-Có"
                bajada="Cuatro alojamientos frente al mar. Dominio propio y consulta directa por WhatsApp." />
          <Obra id="creditofinan" url="https://creditofinan.com/"
                titulo="Crédito Finan" rubro="Créditos · Posadas"
                bajada="Formulario que llega al correo y a una planilla, sin intermediarios." />
        </div>
      </section>

      <section id="disenos">
        <div className="eje">
          <h2 className="titulo">Diseños de muestra, por rubro.</h2>
          <p className="seccion-bajada">
            Estos no son encargos: los hicimos nosotros para mostrar cómo
            resolvemos un rubro cuando arrancamos de cero.
          </p>
          <Diseno id="brasa" titulo="Brasa" rubro="Parrilla" enlace="/pagina-web-para-restaurantes/"
                  bajada="Carta, horarios y una mesa que se reserva por mensaje." />
          <Diseno id="terra" titulo="Terra Propiedades" rubro="Inmobiliaria" enlace="/pagina-web-para-inmobiliarias/"
                  bajada="Buscador de propiedades y visitas que se coordinan por WhatsApp." />
        </div>
      </section>

      {/* El precio va acá y no en la portada: leido despues de cuatro trabajos
          es lo que sale hacer eso, y leido antes es un numero suelto que el
          visitante compara contra seguir con el Instagram, que es gratis. */}
      <section id="precio">
        <div className="eje">
          <h2 className="titulo">Lo que sale una página web.</h2>
          <div className="placa">
            <div><b>$95.000</b><span>Desde</span></div>
            <div><b>50% y 50%</b><span>Al arrancar y al verlo</span></div>
            <div><b>7 días</b><span>De principio a fin</span></div>
          </div>
          <p className="seccion-bajada">
            Pagás la mitad al arrancar y la otra mitad recién cuando la ves
            terminada. Si no te gusta, no la pagás.{" "}
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
            <a href="/quienes-somos/">Quiénes somos</a>
            <a href="/preguntas-frecuentes/">Preguntas</a>
            <span className="destacado" title="Muy pronto">MAS &amp; SONS</span>
          </nav>
          <Palanca oscuro={oscuro} alternar={() => setOscuro(!oscuro)} />
        </div>
      </header>

      <main>
        {ruta === "inicio" && <Inicio />}
        {ruta === "precios" && <Precios />}
        {ruta === "preguntas" && <Preguntas />}
        {ruta === "restaurantes" && <Rubro id="restaurantes" />}
        {ruta === "inmobiliarias" && <Rubro id="inmobiliarias" />}
        {ruta === "alojamientos" && <Rubro id="alojamientos" />}
        {ruta === "quienes" && <Quienes />}
        {ruta === "terminos" && <Terminos />}

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
                <span className="destacado" title="Muy pronto">MAS &amp; SONS</span>
              </nav>
              <span>Posadas, Misiones, Argentina</span>
            </div>
          </footer>
        </section>
      </main>

      <a className="fijo" href={WA} target="_blank" rel="noopener">Escribinos por WhatsApp</a>
    </>
  )
}

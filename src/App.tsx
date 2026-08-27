import { useEffect, useState } from "react"
import Curvas from "./Curvas"
import VariableFontCursorProximity from "./components/originkit/dynamic-weight"
import { Quienes, Terminos } from "./paginas"
import { useScroll, lenis } from "./scroll"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20consultar"
const BASE = import.meta.env.BASE_URL

/* ═══════════════════════════════════════════════════════════════
   Mas & Co — papel y tinta.

   Tres vistas: el inicio (el recorrido con scroll), Quiénes somos y
   Términos, que viven fuera del recorrido y se llega solo por la
   barra o el pie. El ruteo es por hash, que es lo único que aguanta
   GitHub Pages sin servidor: #/quienes-somos y #/terminos son rutas,
   cualquier otro hash es un ancla comun.
   ═══════════════════════════════════════════════════════════════ */

type Ruta = "inicio" | "quienes" | "terminos"

function rutaActual(): Ruta {
  const h = location.hash
  if (h.startsWith("#/quienes-somos")) return "quienes"
  if (h.startsWith("#/terminos")) return "terminos"
  return "inicio"
}

function usarRuta(): Ruta {
  const [ruta, setRuta] = useState<Ruta>(rutaActual)
  useEffect(() => {
    const cambiar = () => {
      const r = rutaActual()
      setRuta(r)
      if (r !== "inicio" || location.hash === "#/" ) lenis.scrollTo(0, { immediate: true })
    }
    addEventListener("hashchange", cambiar)
    return () => removeEventListener("hashchange", cambiar)
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

function Obra({ id, url, titulo, rubro, bajada }: {
  id: string; url: string; titulo: string; rubro: string; bajada: string
}) {
  return (
    <a className="obra" href={url} target="_blank" rel="noopener">
      <div className="lienzo">
        <img className="ancha" src={`${BASE}fotos/${id}.webp`} width={980} height={637}
             loading="lazy" decoding="async" alt={`Sitio de ${titulo} visto en computadora`} />
        <img className="movil" src={`${BASE}fotos/${id}-movil.webp`} width={585} height={1266}
             loading="lazy" decoding="async" alt="El mismo sitio en un celular" />
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

function Inicio() {
  return (
    <>
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
            <p className="lugar"><span className="punto" /> Desde Posadas, para todo el país</p>
            <p className="bajada">Sitios web <em>que trabajan por vos.</em></p>
          </div>
          <div className="placa">
            <div><b>$95.000</b><span>Desde</span></div>
            <div><b>50% y 50%</b><span>Al arrancar y al verlo</span></div>
          </div>
          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">Escribinos</a>
          </div>
        </div>
      </section>

      <section id="trabajos">
        <div className="eje">
          <h2 className="titulo">Publicados y andando.</h2>
          <Obra id="arbolito" url="https://pehuencoalquileres.com/"
                titulo="El Arbolito" rubro="Alojamientos · Pehuén-Có"
                bajada="Cuatro alojamientos frente al mar. Dominio propio y consulta directa por WhatsApp." />
          <Obra id="creditofinan" url="https://creditofinan.com/"
                titulo="Crédito Finan" rubro="Créditos · Posadas"
                bajada="Formulario que llega al correo y a una planilla, sin intermediarios." />
        </div>
      </section>
    </>
  )
}

export default function App() {
  const ruta = usarRuta()
  useScroll(ruta)

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
          <a className="marca" href="#/">MAS &amp; CO</a>
          <nav className="menu">
            <a href="#/quienes-somos">Quiénes somos</a>
            <a href="#/terminos">Términos</a>
            <span className="destacado" title="Muy pronto">MAS &amp; SONS</span>
          </nav>
          <Palanca oscuro={oscuro} alternar={() => setOscuro(!oscuro)} />
          <a className="boton borde" href={WA} target="_blank" rel="noopener">Hablemos</a>
        </div>
      </header>

      <main>
        {ruta === "inicio" && <Inicio />}
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
              <a href="mailto:masandcoo@gmail.com">masandcoo@gmail.com</a>
              <a href="https://instagram.com/mas.and.co" target="_blank" rel="noopener">@mas.and.co</a>
            </div>
          </div>
          <footer>
            <div className="eje pie">
              <span className="logo-pie">MAS &amp; CO</span>
              <nav className="pie-enlaces">
                <a href="#/quienes-somos">Quiénes somos</a>
                <a href="#/terminos">Términos y condiciones</a>
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

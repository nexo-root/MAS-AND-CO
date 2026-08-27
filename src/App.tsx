import { useEffect, useRef } from "react"
import JuiceEffect from "./components/originkit/juiceeffect"
import Curvas from "./Curvas"
import { useScroll } from "./scroll"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20consultar"
const BASE = import.meta.env.BASE_URL

function useBarraPegada() {
  const centinela = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const cab = document.getElementById("cabecera")
    const c = centinela.current
    if (!cab || !c) return
    const ob = new IntersectionObserver(
      (ent) => cab.classList.toggle("pegada", !ent[0].isIntersecting),
      { threshold: 0 }
    )
    ob.observe(c)
    return () => ob.disconnect()
  }, [])
  return centinela
}

function Obra({ id, url, titulo, rubro }: { id: string; url: string; titulo: string; rubro: string }) {
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
    </a>
  )
}

export default function App() {
  useScroll()
  const centinela = useBarraPegada()

  return (
    <>
      <Curvas />
      <div className="progreso" aria-hidden="true" />
      <div ref={centinela} style={{ position: "absolute", top: 0, height: 1, width: 1 }} />

      <header id="cabecera">
        <div className="eje barra">
          <a className="marca" href="#">MAS &amp; CO</a>
          <a className="boton borde" href={WA} target="_blank" rel="noopener">Hablemos</a>
        </div>
      </header>

      <main>
        <section className="portada">
          <div className="eje">
            <h1 className="sr-only">Mas &amp; Co</h1>
            <div className="marca-viva" aria-hidden="true">
              <JuiceEffect
                imageConfig={{ image: `${BASE}fotos/wordmark.png`, mode: "fit", scale: 10 }}
                colorMode="custom"
                particleColor="#EDEDE7"
                particleSize={12}
                density={100}
                movementArea="inbounds"
                speed={4}
                hoverEnabled={true}
                hoverRadius={120}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <p className="lugar">
              <span className="punto" /> Desde Posadas, para todo el país
            </p>
            <p className="bajada">
              Sitios web y asistentes <em>que contestan por vos.</em>
            </p>
            <div className="placa">
              <div><b>$95.000</b><span>Desde</span></div>
              <div><b>2 semanas</b><span>Entrega</span></div>
              <div><b>50% y 50%</b><span>Al arrancar y al verlo</span></div>
            </div>
            <div className="acciones">
              <a className="boton lleno" href={WA} target="_blank" rel="noopener">Escribinos</a>
              <a className="boton borde" href="#trabajos">Ver trabajos</a>
            </div>
          </div>
        </section>

        <section id="trabajos">
          <div className="eje">
            <h2>Publicados y andando.</h2>
            <Obra id="arbolito" url="https://pehuencoalquileres.com/" titulo="El Arbolito" rubro="Alojamientos · Pehuén-Có" />
            <Obra id="creditofinan" url="https://creditofinan.com/" titulo="Crédito Finan" rubro="Créditos · Posadas" />
          </div>
        </section>

        <section className="chapa">
          <div className="eje">
            <h2>Qué hacemos.</h2>
            <div className="lista">
              <div className="item"><h3>Sitio web</h3><span className="precio">desde $95.000</span></div>
              <div className="item"><h3>Turnos y reservas</h3><span className="precio">desde $60.000</span></div>
              <div className="item"><h3>Asistente de WhatsApp</h3><span className="precio">a medida</span></div>
              <div className="item"><h3>Automatizaciones</h3><span className="precio">a medida</span></div>
            </div>
          </div>
        </section>

        <section>
          <div className="eje">
            <h2>La rama digital del grupo Mas.</h2>
            <div className="placa">
              <div><b>CMD</b><span>Desarrollos, Misiones</span></div>
              <div><b>Mas &amp; Sons</b><span>Internacional</span></div>
              <div><b>Mas &amp; Co</b><span>Tecnología</span></div>
            </div>
          </div>
        </section>

        <section className="chapa" id="contacto">
          <div className="eje">
            <h2>Contanos qué necesitás.</h2>
            <div className="acciones" style={{ justifyContent: "flex-start" }}>
              <a className="boton lleno" href={WA} target="_blank" rel="noopener">Escribinos por WhatsApp</a>
            </div>
            <div className="vias">
              <a href="https://wa.me/5493764615587" target="_blank" rel="noopener">+54 9 3764 61-5587</a>
              <a href="mailto:masandcoo@gmail.com">masandcoo@gmail.com</a>
              <a href="https://instagram.com/mas.and.co" target="_blank" rel="noopener">@mas.and.co</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="eje pie">
          <span style={{ fontVariationSettings: "'wdth' 125,'wght' 200", letterSpacing: ".22em", color: "var(--hueso)" }}>
            MAS &amp; CO
          </span>
          <span>Posadas, Misiones, Argentina</span>
        </div>
      </footer>

      <a className="fijo" href={WA} target="_blank" rel="noopener">Escribinos por WhatsApp</a>
    </>
  )
}

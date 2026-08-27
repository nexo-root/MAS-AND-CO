import { useEffect, useRef } from "react"
import JuiceEffect from "./components/originkit/juiceeffect"
import ProximityHover from "./components/originkit/reactivegrid"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20consultar"
const BASE = import.meta.env.BASE_URL

/* Revela los bloques al entrar en pantalla. El margen enorme hacia arriba es
   la red de seguridad: hace que todo lo que quedo por encima de la pantalla
   cuente como visible. Sin eso, el que llega con un ancla deja bloques que
   nunca cruzan el borde y quedarian invisibles para siempre. */
function useRevelado() {
  useEffect(() => {
    document.documentElement.classList.add("con-js")
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches
    const piezas = Array.from(document.querySelectorAll<HTMLElement>(".sube"))
    if (quieto) {
      piezas.forEach((el) => el.classList.add("visible"))
      return
    }
    const mirador = new IntersectionObserver(
      (ent) => {
        ent.forEach((e) => {
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            e.target.classList.add("visible")
            mirador.unobserve(e.target)
          }
        })
      },
      { rootMargin: "99999px 0px -10% 0px", threshold: 0.06 }
    )
    piezas.forEach((el) => mirador.observe(el))
    return () => mirador.disconnect()
  }, [])
}

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

/* Fondo de toda la pagina.

   Dos cosas que resuelve este envoltorio, sin tocar el componente:

   1. El componente escucha el mouse sobre su propio div, y viviendo detras del
      contenido nunca lo recibiria. Se lo reenviamos desde la ventana.
   2. Por si solo las particulas quedan quietas hasta que alguien mueve el mouse.
      Le pasamos un punto que deambula solo, con dos senos de periodos distintos
      para que no se note el bucle. Cuando la persona mueve el mouse manda ella,
      y el deambular vuelve tres segundos despues de que suelta. */
function FondoVivo() {
  const caja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const destino = caja.current?.firstElementChild as HTMLElement | null
    if (!destino) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let ultimoMouse = -Infinity
    let cuadro = 0

    const empujar = (x: number, y: number) => {
      destino.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y }))
    }

    const deMano = (e: PointerEvent) => {
      ultimoMouse = performance.now()
      empujar(e.clientX, e.clientY)
    }

    const paso = (t: number) => {
      if (t - ultimoMouse > 3000) {
        const w = innerWidth
        const h = innerHeight
        // periodos primos entre si: el recorrido no se repite a simple vista
        const x = w * (0.5 + 0.42 * Math.sin(t / 9700))
        const y = h * (0.5 + 0.36 * Math.sin(t / 6100 + 1.3))
        empujar(x, y)
      }
      cuadro = requestAnimationFrame(paso)
    }
    cuadro = requestAnimationFrame(paso)
    addEventListener("pointermove", deMano, { passive: true })

    return () => {
      cancelAnimationFrame(cuadro)
      removeEventListener("pointermove", deMano)
    }
  }, [])

  return (
    <div className="fondo-vivo" ref={caja} aria-hidden="true">
      <ProximityHover
        shape="circle"
        fill="solid"
        particleColor="rgba(237,237,231,0.17)"
        backgroundColor="#0B1220"
        maxSize={11}
        minSize={2.5}
        gap={30}
        influence={260}
      />
    </div>
  )
}

function Obra({ id, url, titulo, rubro }: { id: string; url: string; titulo: string; rubro: string }) {
  return (
    <a className="obra sube" href={url} target="_blank" rel="noopener">
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
  useRevelado()
  const centinela = useBarraPegada()

  return (
    <>
      <FondoVivo />
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
            <div className="marca-viva sube" aria-hidden="true">
              <JuiceEffect
                imageConfig={{ image: `${BASE}fotos/wordmark.png`, mode: "fit", scale: 10 }}
                colorMode="custom"
                particleColor="#EDEDE7"
                particleSize={10}
                density={100}
                movementArea="inbounds"
                speed={4}
                hoverEnabled={true}
                hoverRadius={120}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <p className="lugar sube" style={{ "--espera": "80ms" } as React.CSSProperties}>
              <span className="punto" /> Desde Posadas, para todo el país
            </p>
            <p className="bajada sube" style={{ "--espera": "140ms" } as React.CSSProperties}>
              Sitios web y asistentes <em>que contestan por vos.</em>
            </p>
            <div className="placa sube" style={{ "--espera": "200ms" } as React.CSSProperties}>
              <div><b>$95.000</b><span>Desde</span></div>
              <div><b>2 semanas</b><span>Entrega</span></div>
              <div><b>50% y 50%</b><span>Al arrancar y al verlo</span></div>
            </div>
            <div className="acciones sube" style={{ "--espera": "260ms" } as React.CSSProperties}>
              <a className="boton lleno" href={WA} target="_blank" rel="noopener">Escribinos</a>
              <a className="boton borde" href="#trabajos">Ver trabajos</a>
            </div>
          </div>
        </section>

        <section id="trabajos">
          <div className="eje">
            <h2 className="sube">Publicados y andando.</h2>
            <Obra id="arbolito" url="https://pehuencoalquileres.com/" titulo="El Arbolito" rubro="Alojamientos · Pehuén-Có" />
            <Obra id="creditofinan" url="https://creditofinan.com/" titulo="Crédito Finan" rubro="Créditos · Posadas" />
          </div>
        </section>

        <section className="chapa">
          <div className="eje">
            <h2 className="sube">Qué hacemos.</h2>
            <div className="lista">
              <div className="item sube"><h3>Sitio web</h3><span className="precio">desde $95.000</span></div>
              <div className="item sube" style={{ "--espera": "60ms" } as React.CSSProperties}><h3>Turnos y reservas</h3><span className="precio">desde $60.000</span></div>
              <div className="item sube" style={{ "--espera": "120ms" } as React.CSSProperties}><h3>Asistente de WhatsApp</h3><span className="precio">a medida</span></div>
              <div className="item sube" style={{ "--espera": "180ms" } as React.CSSProperties}><h3>Automatizaciones</h3><span className="precio">a medida</span></div>
            </div>
          </div>
        </section>

        <section>
          <div className="eje">
            <h2 className="sube">La rama digital del grupo Mas.</h2>
            <div className="placa sube" style={{ "--espera": "100ms" } as React.CSSProperties}>
              <div><b>CMD</b><span>Desarrollos, Misiones</span></div>
              <div><b>Mas &amp; Sons</b><span>Internacional</span></div>
              <div><b>Mas &amp; Co</b><span>Tecnología</span></div>
            </div>
          </div>
        </section>

        <section className="chapa" id="contacto">
          <div className="eje">
            <h2 className="sube">Contanos qué necesitás.</h2>
            <div className="acciones sube" style={{ "--espera": "80ms", justifyContent: "flex-start" } as React.CSSProperties}>
              <a className="boton lleno" href={WA} target="_blank" rel="noopener">Escribinos por WhatsApp</a>
            </div>
            <div className="vias sube" style={{ "--espera": "150ms" } as React.CSSProperties}>
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

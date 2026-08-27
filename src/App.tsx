import { useEffect, useRef } from "react"
import Curvas from "./Curvas"
import { useScroll } from "./scroll"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20consultar"
const BASE = import.meta.env.BASE_URL

/* ═══════════════════════════════════════════════════════════════
   Mas & Co — papel y tinta.

   Referencia: plano de arquitecto sobre papel. Hueso de fondo, navy
   como tinta, las curvas de nivel de fondo como el plano de un
   terreno. Un solo momento navy al final, que por contraste ahora
   pesa. Una sola familia (Archivo variable) en tres voces: finisima
   y ancha para la marca, negra y ancha para los titulos, normal
   para leer.
   ═══════════════════════════════════════════════════════════════ */

function Obra({ id, url, titulo, rubro, num, bajada }: {
  id: string; url: string; titulo: string; rubro: string; num: string; bajada: string
}) {
  return (
    <a className="obra" href={url} target="_blank" rel="noopener">
      <span className="obra-num" aria-hidden="true">{num}</span>
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

const LETRAS = ["M", "A", "S", " ", "&", " ", "C", "O"]

export default function App() {
  useScroll()
  const marca = useRef<HTMLHeadingElement>(null)

  /* La entrada del nombre: cada letra sube desde atras de la linea de piso,
     escalonada. Es la unica animacion de carga; el resto es del scroll. */
  useEffect(() => {
    const el = marca.current
    if (!el) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("lista")
      return
    }
    const t = setTimeout(() => el.classList.add("lista"), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Curvas />
      <div className="progreso" aria-hidden="true" />

      <header>
        <div className="eje barra">
          <a className="marca" href="#">MAS &amp; CO</a>
          <a className="boton borde" href={WA} target="_blank" rel="noopener">Hablemos</a>
        </div>
      </header>

      <main>
        <section className="portada">
          <div className="eje">
            <h1 className="gigante" ref={marca} aria-label="Mas & Co">
              {LETRAS.map((l, i) => (
                <span className="tapa" key={i}>
                  <span className="letra" style={{ transitionDelay: `${i * 55}ms` }}>
                    {l === " " ? " " : l}
                  </span>
                </span>
              ))}
            </h1>
            <div className="piso" />
            <div className="bajo-piso">
              <p className="lugar"><span className="punto" /> Desde Posadas, para todo el país</p>
              <p className="bajada">Sitios web y asistentes <em>que contestan por vos.</em></p>
            </div>
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

        <div className="cinta" aria-hidden="true">
          <div className="cinta-tira">
            <span>Sitios web&ensp;·&ensp;Automatización&ensp;·&ensp;Asistentes de IA&ensp;·&ensp;Mini apps&ensp;·&ensp;</span>
            <span>Sitios web&ensp;·&ensp;Automatización&ensp;·&ensp;Asistentes de IA&ensp;·&ensp;Mini apps&ensp;·&ensp;</span>
          </div>
        </div>

        <section id="trabajos">
          <div className="eje">
            <h2 className="titulo">Publicados y andando.</h2>
            <Obra id="arbolito" num="01" url="https://pehuencoalquileres.com/"
                  titulo="El Arbolito" rubro="Alojamientos · Pehuén-Có"
                  bajada="Cuatro alojamientos frente al mar. Dominio propio y consulta directa por WhatsApp." />
            <Obra id="creditofinan" num="02" url="https://creditofinan.com/"
                  titulo="Crédito Finan" rubro="Créditos · Posadas"
                  bajada="Formulario que llega al correo y a una planilla, sin intermediarios." />
          </div>
        </section>

        <section className="banda" id="hacemos">
          <div className="eje">
            <h2 className="titulo">Qué hacemos.</h2>
            <div className="lista">
              <div className="item"><i>01</i><h3>Sitio web</h3><span className="precio">desde $95.000</span></div>
              <div className="item"><i>02</i><h3>Turnos y reservas</h3><span className="precio">desde $60.000</span></div>
              <div className="item"><i>03</i><h3>Asistente de WhatsApp</h3><span className="precio">a medida</span></div>
              <div className="item"><i>04</i><h3>Automatizaciones</h3><span className="precio">a medida</span></div>
            </div>
          </div>
        </section>

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
              <span>Posadas, Misiones, Argentina</span>
            </div>
          </footer>
        </section>
      </main>

      <a className="fijo" href={WA} target="_blank" rel="noopener">Escribinos por WhatsApp</a>
    </>
  )
}

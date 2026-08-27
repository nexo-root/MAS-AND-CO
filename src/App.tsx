import Curvas from "./Curvas"
import VariableFontCursorProximity from "./components/originkit/dynamic-weight"
import { useScroll } from "./scroll"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20consultar"
const BASE = import.meta.env.BASE_URL

/* ═══════════════════════════════════════════════════════════════
   Mas & Co — papel y tinta.

   Referencia: plano de arquitecto sobre papel. Hueso de fondo, navy
   como tinta, las curvas de nivel de fondo como el plano de un
   terreno. Un solo momento navy al final, que por contraste pesa.
   El nombre del hero es el Dynamic Weight de Originkit: cada letra
   engorda cuando el cursor se le acerca, en la misma Archivo variable
   del logo.
   ═══════════════════════════════════════════════════════════════ */

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

export default function App() {
  useScroll()

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
            <h1 className="gigante">
              <VariableFontCursorProximity
                label="MAS & CO"
                fromWeight={200}
                toWeight={800}
                strength={30}
                fontSize="clamp(3.4rem, 12.2vw, 12rem)"
                color="#0B1220"
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
              <div><b>2 semanas</b><span>Entrega</span></div>
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

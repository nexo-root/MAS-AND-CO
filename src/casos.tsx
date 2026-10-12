import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import gsap from "gsap"
import { lenis } from "./scroll"
import { Cabeza } from "./seo/Cabeza"
import { ORIGEN, rutaPorId } from "./seo/rutas"
import { ldCaso, ldColeccion, ldFaq, ldTestimonio, type Pregunta, type Testimonio } from "./seo/ld"

const BASE = import.meta.env.BASE_URL
const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20una%20p%C3%A1gina%20para%20mi%20negocio"

/* Una pagina por trabajo hecho, y /casos/ que los junta. Existen por dos motivos
 * distintos y los dos cuentan:
 *
 *  1. PRUEBA. Un caso con nombre, direccion propia, fecha y el sitio abierto al
 *     lado pesa mas que cualquier lista de promesas. Es la "evidencia" que miden
 *     las auditorias de visibilidad en IA (Consulia, 29/09/2026: 61 de 100).
 *  2. BUSQUEDAS. Cada caso es una direccion mas que Google guarda, y pesca la
 *     busqueda de ESE rubro.
 *
 * Regla que manda: solo se dice lo que se ve entrando al sitio del cliente y lo
 * que se puede comprobar (la fecha sale de cuando se creo su repositorio en
 * GitHub). Sin cifras de ventas, sin testimonios que nadie escribio, sin plazos
 * con numero.
 */

type Caso = {
  rutaId: string
  h1: string
  /* La respuesta citable: quien, que, cuando y donde, en 40 a 60 palabras. */
  resumen: string
  /* El punto de partida: el problema del rubro, sin ponerle palabras en la boca al cliente. */
  entrada: string
  cliente: { nombre: string; rubro: string; url: string; dominio: string; foto: string }
  publicada: { texto: string; iso: string }
  /* Lo que se ve al entrar al sitio. Se mira y se anota; no se inventa. */
  seVe: string[]
  porQue: string
  faq: Pregunta[]
  rubroRelacionado?: { texto: string; href: string }
}

export const CASOS: Record<string, Caso> = {
  "caso-finan": {
    rutaId: "caso-finan",
    h1: "Caso real: la página de Crédito Finan, consultora de crédito.",
    resumen:
      "Hicimos la página web de Crédito Finan, una consultora de crédito, y está en línea desde julio de 2026 en creditofinan.com. Dice qué hacen en una frase, tiene un formulario de consulta que les llega al correo y el WhatsApp a un toque. Es un cliente real: la página se puede abrir y comprobar.",
    entrada:
      "Cuando alguien busca un préstamo, lo primero que hace es desconfiar. Un perfil de Instagram sin dirección, sin nombre y sin nada que se pueda verificar juega en contra, por más que el negocio sea serio.",
    cliente: {
      nombre: "Crédito Finan",
      rubro: "Consultora de crédito",
      url: "https://creditofinan.com",
      dominio: "creditofinan.com",
      foto: "creditofinan",
    },
    publicada: { texto: "julio de 2026", iso: "2026-07" },
    seVe: [
      "Qué hacen, dicho en una frase, apenas se entra.",
      "Un formulario de consulta que les llega al correo.",
      "El WhatsApp a un toque, para el que prefiere escribir.",
      "Los requisitos para consultar y los datos del negocio a la vista, que es lo que hace que le crean.",
    ],
    porQue:
      "La página le da al que consulta algo que mirar antes de dejar sus datos. Deja de ser un perfil más y pasa a ser un negocio con dirección propia, que además aparece cuando lo buscan por el nombre.",
    faq: [
      {
        q: "¿El formulario adónde llega?",
        a: "Al correo del cliente, con lo que la persona escribió. No hay que entrar a ningún panel a mirar si llegó algo.",
      },
      {
        q: "¿Sirve si ya atiendo todo por WhatsApp?",
        a: "El WhatsApp sigue estando, y con un toque. Lo que cambia es que el que escribe ya leyó de qué se trata, así que la conversación arranca más adelante.",
      },
      {
        q: "¿La página queda a nombre de quién?",
        a: "El dominio queda a nombre del cliente. Lo que compró es suyo.",
      },
    ],
    rubroRelacionado: {
      texto: "Ver qué lleva una página web para profesionales y consultoras",
      href: "/pagina-web-para-profesionales/",
    },
  },

  "caso-arbolito": {
    rutaId: "caso-arbolito",
    h1: "Caso real: la página de El Arbolito, alojamiento en Pehuén-Có.",
    resumen:
      "Hicimos la página web de El Arbolito, un alojamiento en Pehuén-Có, Buenos Aires, y está en línea desde agosto de 2026 en pehuencoalquileres.com. Muestra las fotos del lugar, cómo llegar y un botón para consultar fechas por WhatsApp. Es un cliente real: la página se puede abrir y comprobar.",
    entrada:
      "Un alojamiento se elige mirando fotos. El problema es que las fotos viven en Instagram, donde se pierden entre publicaciones, y en los portales de reservas, donde están al lado de la competencia y con comisión de por medio.",
    cliente: {
      nombre: "El Arbolito",
      rubro: "Alojamiento en Pehuén-Có, Buenos Aires",
      url: "https://pehuencoalquileres.com",
      dominio: "pehuencoalquileres.com",
      foto: "arbolito",
    },
    publicada: { texto: "agosto de 2026", iso: "2026-08" },
    seVe: [
      "Las fotos del lugar en grande, que es lo primero que mira el que busca dónde parar.",
      "Dónde queda y cómo llegar, sin tener que preguntar.",
      "Un botón que abre el WhatsApp para consultar por fechas.",
      "La página entera en el celular, que es desde donde se busca alojamiento.",
    ],
    porQue:
      "Con la página publicada, el que la encuentra ya vio el lugar, ya sabe dónde queda y escribe para preguntar por fechas. No hay comisión de por medio ni competencia en la misma pantalla.",
    faq: [
      {
        q: "¿La página reemplaza a los portales de reservas?",
        a: "No necesariamente. Convive: el portal le trae gente que no lo conoce y la página propia se queda con el que lo busca por el nombre o por la zona, sin comisión.",
      },
      {
        q: "¿Las fotos las pone el dueño?",
        a: "Sí. Nos las pasa por WhatsApp junto con los datos, y nosotros las acomodamos en la página. Nunca usamos fotos de archivo para un lugar real.",
      },
      {
        q: "¿Se puede cambiar algo después?",
        a: "Sí. El primer mes de cambios no se cobra, y el dominio queda a nombre del cliente.",
      },
    ],
    rubroRelacionado: {
      texto: "Ver qué lleva una página web para alojamientos y cabañas",
      href: "/pagina-web-para-alojamientos/",
    },
  },
}

/* Testimonios REALES: escritos por el cliente, con su nombre (o inicial) y la fecha, y con
 * su permiso para publicarlos. Mientras la lista este vacia no se muestra nada ni se marca
 * nada en el JSON-LD. Se suma uno asi:
 *   { cliente: "Crédito Finan", autor: "Soledad", fecha: "2026-10-02", texto: "..." }
 * El texto va tal cual lo escribio el cliente: sin corregirle el estilo ni agregarle nada. */
export const TESTIMONIOS: Testimonio[] = []

function Testimonios({ lista }: { lista: Testimonio[] }) {
  if (!lista.length) return null
  return (
    <>
      <h2>Lo que dicen los clientes</h2>
      {lista.map((t) => (
        <blockquote key={t.autor + t.fecha}>
          <p>{t.texto}</p>
          <footer>
            {t.autor}, {t.cliente} · {t.fecha.split("-").reverse().join("/")}
          </footer>
        </blockquote>
      ))}
    </>
  )
}

export function Caso({ id }: { id: string }) {
  const c = CASOS[id]
  const ruta = rutaPorId(c.rutaId)
  const imagen = `${ORIGEN}${BASE}fotos/${c.cliente.foto}.webp`
  const suyos = TESTIMONIOS.filter((t) => t.cliente === c.cliente.nombre)

  return (
    <section className="pagina">
      <Cabeza
        ruta={ruta}
        imagen={imagen}
        ld={[
          ldCaso(c.cliente.nombre, c.cliente.rubro, c.cliente.url, ORIGEN + ruta.path, imagen, c.publicada.iso),
          ldFaq(c.faq),
          ...suyos.map(ldTestimonio),
        ]}
      />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · <a href="/casos/">Ejemplos</a> · {c.cliente.nombre}
        </p>
        <h1 className="titulo">{c.h1}</h1>
        <p className="respuesta">{c.resumen}</p>
        <p className="seccion-bajada">
          <b>Cliente:</b> {c.cliente.nombre} · <b>Rubro:</b> {c.cliente.rubro} · <b>En línea desde:</b>{" "}
          {c.publicada.texto} ·{" "}
          <a href={c.cliente.url} target="_blank" rel="noopener">
            {c.cliente.dominio}
          </a>
        </p>

        <div className="rubro-vitrina">
          <div className="lienzo">
            <img
              className="ancha"
              src={`${BASE}fotos/${c.cliente.foto}.webp`}
              width={1960}
              height={1274}
              alt={`Página web de ${c.cliente.nombre}, ${c.cliente.rubro.toLowerCase()}, vista en computadora`}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="ficha">
            <h2>{c.cliente.nombre}</h2>
            <small>{c.cliente.rubro}</small>
            <a className="ir" href={c.cliente.url} target="_blank" rel="noopener">
              Abrir el sitio
            </a>
          </div>
          <p className="obra-bajada">Cliente real. La página está publicada y se puede entrar.</p>
        </div>

        <div className="prosa">
          <h2>El punto de partida</h2>
          <p>{c.entrada}</p>

          <h2>Qué hicimos</h2>
          <ul>
            {c.seVe.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <h2>El resultado</h2>
          <p>{c.porQue}</p>
          <p>
            La página está en línea desde {c.publicada.texto} y se puede comprobar entrando a{" "}
            <a href={c.cliente.url} target="_blank" rel="noopener">
              {c.cliente.dominio}
            </a>
            .
          </p>

          <h2>Cómo se trabajó</h2>
          <p>
            El cliente nos escribió por WhatsApp, nos pasó las fotos y los datos por ahí mismo, y
            la vio terminada en su celular antes de pagar la segunda mitad. El dominio quedó a su
            nombre.
          </p>

          <Testimonios lista={suyos} />

          <h2>Preguntas sobre este trabajo</h2>
          <div className="faq">
            {c.faq.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>

          <p className="seccion-bajada">
            {c.rubroRelacionado && (
              <>
                <a href={c.rubroRelacionado.href}>{c.rubroRelacionado.texto}</a>
                {" · "}
              </>
            )}
            <a href="/casos/">Ver los ejemplos de todos los rubros</a>
          </p>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Quiero la mía
            </a>
            <a className="boton borde" href="/precios/">
              Ver qué incluye
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* /casos/: la vitrina (12/10/2026). Felipe: «son solo 2 casos... poné todas las paginas de
 * muestra, no a lo largo sino como tarjetas interactivas que se agrandan». Cada tarjeta es una
 * pagina de muestra completa (las de masandcoweb.com/muestras/<rubro>/) y la de Credito Finan,
 * que es un cliente real. Al tocarla se agranda hasta ocupar la pantalla y adentro se ve la
 * pagina andando, en compu o en celular, y se puede probar con el nombre del negocio (?n=).
 *
 * Regla que manda: una muestra se rotula siempre como muestra. Sin negocios reales de la lista
 * en las capturas (se ven con "Su salon", "Su restaurante"...), sin notas ni opiniones inventadas.
 * Las fichas de los casos reales (/caso/...) siguen existiendo y el JSON-LD lista solo esas. */

type Muestra = {
  id: string
  rubro: string
  titulo: string
  url: string
  real?: { desde: string; caso: string; dominio: string }
  bajada: string
  tiene: string[]
  pedido: string
}

const MUESTRAS: Muestra[] = [
  {
    id: "creditofinan", rubro: "Consultora de crédito", titulo: "Crédito Finan", url: "https://creditofinan.com/",
    real: { desde: "julio de 2026", caso: "/caso/credito-finan/", dominio: "creditofinan.com" },
    bajada: "Dice qué hacen en una frase, tiene un formulario que les llega al correo y el WhatsApp a un toque.",
    tiene: CASOS["caso-finan"].seVe.slice(0, 3),
    pedido: "Hola, vi la página de Crédito Finan y quiero una así para mi negocio",
  },
  {
    id: "salones", rubro: "Salones de eventos", titulo: "Su salón", url: "/muestras/salones/?t=general",
    bajada: "Elegís qué vas a festejar y la página entera cambia. Las fechas libres arman el mensaje de WhatsApp.",
    tiene: ["Cuatro puertas: cumpleaños, quince, casamiento y empresa", "La noche contada hora por hora", "Fechas libres y cantidad de invitados que escriben la consulta"],
    pedido: "Hola, vi la página de muestra para salones de eventos y quiero una así para mi salón",
  },
  {
    id: "alojamientos", rubro: "Alojamientos y cabañas", titulo: "Su alojamiento", url: "/muestras/alojamientos/",
    bajada: "La cámara entra por la ventana y el calendario de llegada y salida escribe la consulta.",
    tiene: ["El calendario de noches, con lo ocupado tachado", "Una llave por cabaña, con sus fotos", "Una postal del lugar con lo que hay cerca"],
    pedido: "Hola, vi la página de muestra para alojamientos y quiero una así para el mío",
  },
  {
    id: "muebles", rubro: "Mueblerías", titulo: "Su mueblería", url: "/muestras/muebles/",
    bajada: "Un living que se toca y un armador de sillones que te dice si entra en tu pared.",
    tiene: ["Cada mueble del living con su ficha y su medida", "Armá tu sillón: medida, tela y color", "Del taller a tu casa, con una cortina que se arrastra"],
    pedido: "Hola, vi la página de muestra para mueblerías y quiero una así para la mía",
  },
  {
    id: "restaurantes", rubro: "Restaurantes", titulo: "Su restaurante", url: "/muestras/restaurantes/",
    bajada: "El nombre en neón, la carta en una bandeja que gira y la reserva en el plano del salón.",
    tiene: ["El cartel de abierto, según la hora", "La carta en una bandeja que se gira con el dedo", "El plano del salón para elegir la mesa"],
    pedido: "Hola, vi la página de muestra para restaurantes y quiero una así para el mío",
  },
  {
    id: "inmobiliarias", rubro: "Inmobiliarias", titulo: "Su inmobiliaria", url: "/muestras/inmobiliarias/",
    bajada: "Las propiedades que te gustan van a una carpeta y la tasación arma una maqueta.",
    tiene: ["Comprá, alquilá o vendé desde la portada", "Las propiedades se deslizan y se guardan", "Cuatro preguntas para pedir una tasación"],
    pedido: "Hola, vi la página de muestra para inmobiliarias y quiero una así para la mía",
  },
  {
    id: "agencias", rubro: "Agencias de viajes", titulo: "Su agencia", url: "/muestras/agencias/",
    bajada: "El tablero de partidas, el mapa con las rutas y el pasaje que se completa solo.",
    tiene: ["El tablero con las próximas salidas", "El mapa: el avión vuela a cada destino", "El pasaje con todo lo que incluye el viaje"],
    pedido: "Hola, vi la página de muestra para agencias de viajes y quiero una así para la mía",
  },
  {
    id: "corralones", rubro: "Corralones", titulo: "Su corralón", url: "/muestras/corralones/",
    bajada: "La calculadora de materiales levanta la pared y el camión lleva el pedido a la obra.",
    tiene: ["Ladrillos, cemento, cal y arena calculados", "La pared dibujada a escala", "El pedido listo para pedir presupuesto"],
    pedido: "Hola, vi la página de muestra para corralones y quiero una así para el mío",
  },
]

const wa = (texto: string) => `https://wa.me/5493764615587?text=${encodeURIComponent(texto)}`

function Tarjeta({ m, abrir, refBoton }: { m: Muestra; abrir: () => void; refBoton: (b: HTMLButtonElement | null) => void }) {
  return (
    <article className="vit-tarjeta" data-id={m.id}>
      <div className="vit-img">
        <img src={`${BASE}fotos/vitrina/${m.id}.webp`} width={760} height={1235} loading="lazy" decoding="async"
             alt={m.real ? `Página web de ${m.titulo}, vista en computadora` : `Página de muestra para ${m.rubro.toLowerCase()}, vista en computadora`} />
      </div>
      <div className="vit-pie">
        <span className={m.real ? "vit-chip real" : "vit-chip"}>{m.real ? "Cliente real" : "Diseño de muestra"}</span>
        <h2>
          {/* el boton se estira sobre la tarjeta entera: se toca en cualquier parte */}
          <button type="button" ref={refBoton} onClick={abrir} aria-haspopup="dialog">
            {m.real ? m.titulo : m.rubro}
          </button>
        </h2>
        <p>{m.bajada}</p>
        <span className="vit-abrir" aria-hidden="true">Abrir en grande →</span>
      </div>
    </article>
  )
}

/* El panel grande. Nace con el recorte de la tarjeta (clip-path) y se abre hasta ocupar la
 * pantalla: la tarjeta "se agranda" sin deformar nada. Adentro, la pagina de muestra andando. */
function Panel({ m, desde, alCerrar }: { m: Muestra; desde: HTMLElement | null; alCerrar: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const fondo = useRef<HTMLDivElement>(null)
  const info = useRef<HTMLDivElement>(null)
  const vista = useRef<HTMLDivElement>(null)
  const boton = useRef<HTMLButtonElement>(null)
  const angosto = matchMedia("(max-width:860px)").matches
  const [modo, setModo] = useState<"compu" | "celu">(angosto ? "celu" : "compu")
  const [nombre, setNombre] = useState("")
  const [aplicado, setAplicado] = useState("")
  const [cargado, setCargado] = useState(false)
  const [caja, setCaja] = useState({ w: 0, h: 0 })
  const cerrando = useRef(false)

  const src = aplicado.trim() ? `${m.url}${m.url.includes("?") ? "&" : "?"}n=${encodeURIComponent(aplicado.trim())}` : m.url
  useEffect(() => setCargado(false), [src])

  const recorte = () => {
    const c = desde?.closest(".vit-tarjeta")?.getBoundingClientRect()
    const p = panel.current?.getBoundingClientRect()
    if (!c || !p) return "inset(0px 0px 0px 0px)"
    return `inset(${c.top - p.top}px ${p.right - c.right}px ${p.bottom - c.bottom}px ${c.left - p.left}px)`
  }

  useLayoutEffect(() => {
    lenis.stop()
    document.documentElement.classList.add("vit-quieto")
    const tl = gsap.timeline()
    tl.fromTo(panel.current, { clipPath: recorte() }, { clipPath: "inset(0px 0px 0px 0px)", duration: 0.75, ease: "power3.inOut" })
      .fromTo(fondo.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0)
      .fromTo(info.current ? [...info.current.children] : [], { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.045, ease: "power3.out" }, 0.45)
    boton.current?.focus({ preventScroll: true })
    return () => {
      tl.kill()
      lenis.start()
      document.documentElement.classList.remove("vit-quieto")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cerrar = () => {
    if (cerrando.current) return
    cerrando.current = true
    gsap.timeline({ onComplete: () => { alCerrar(); desde?.focus({ preventScroll: true }) } })
      .to(info.current ? [...info.current.children] : [], { autoAlpha: 0, duration: 0.15 })
      .to(panel.current, { clipPath: recorte(), duration: 0.55, ease: "power3.inOut" }, 0.05)
      .to(fondo.current, { opacity: 0, duration: 0.4 }, 0.15)
  }

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => { if (e.key === "Escape") cerrar() }
    addEventListener("keydown", tecla)
    return () => removeEventListener("keydown", tecla)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // lo que mide el lugar de la vista: con eso se escala la pagina de 1440 o de 390 px
  useEffect(() => {
    const el = vista.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setCaja({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // el nombre se aplica cuando se deja de escribir: cada cambio recarga la pagina de adentro
  useEffect(() => {
    const t = setTimeout(() => setAplicado(nombre), 900)
    return () => clearTimeout(t)
  }, [nombre])

  const BARRA = 34
  let marco: CSSProperties = {}, pantalla: CSSProperties = {}, escala = 1, ancho = 1440, alto = 900
  if (caja.w && caja.h) {
    if (modo === "compu") {
      escala = caja.w / 1440
      ancho = 1440
      alto = (caja.h - BARRA) / escala
      marco = { width: caja.w, height: caja.h }
      pantalla = { width: caja.w, height: caja.h - BARRA }
    } else {
      const BISEL = angosto ? 0 : 12
      // en el celular la pagina ocupa todo el ancho; en la compu, un telefono entero que entre en la vista
      escala = angosto ? caja.w / 390 : Math.min((caja.h - 2 * BISEL) / 844, (caja.w - 2 * BISEL) / 390, 1)
      ancho = 390
      alto = angosto ? (caja.h - 2 * BISEL) / escala : 844
      marco = { width: 390 * escala + 2 * BISEL, height: alto * escala + 2 * BISEL, padding: BISEL }
      pantalla = { width: 390 * escala, height: alto * escala }
    }
  }

  // va directo al body: adentro de <main> (z-index 1) la barra y el boton fijo de WhatsApp le quedaban encima
  return createPortal(
    <div className="vit-capa" role="dialog" aria-modal="true" aria-label={m.real ? m.titulo : `Muestra para ${m.rubro.toLowerCase()}`}>
      <div className="vit-fondo" ref={fondo} onClick={cerrar} />
      <div className="vit-panel" ref={panel}>
        <div className="vit-vista" ref={vista}>
          <div className={`vit-marco ${modo}`} style={marco}>
            {modo === "compu" && (
              <div className="vit-navegador" style={{ height: BARRA }}>
                <i /><i /><i />
                <span>{m.real ? m.real.dominio : `masandcoweb.com${m.url.split("?")[0]}`}</span>
              </div>
            )}
            <div className="vit-pantalla" style={pantalla}>
              {modo === "compu" && <img className="vit-previa" src={`${BASE}fotos/vitrina/${m.id}.webp`} alt="" />}
              {caja.w > 0 && (
                <iframe key={modo} src={src} title={m.real ? `Página de ${m.titulo}` : `Muestra para ${m.rubro.toLowerCase()}`}
                        onLoad={() => setCargado(true)} className={cargado ? "listo" : ""}
                        style={{ width: ancho, height: alto, transform: `scale(${escala})` }} />
              )}
              {!cargado && <span className="vit-cargando">Cargando la página…</span>}
            </div>
          </div>
        </div>
        <div className="vit-info" ref={info}>
          <button type="button" className="vit-cerrar" ref={boton} onClick={cerrar} aria-label="Cerrar">×</button>
          <span className={m.real ? "vit-chip real" : "vit-chip"}>
            {m.real ? `Cliente real · en línea desde ${m.real.desde}` : "Diseño de muestra"}
          </span>
          <h2>{m.real ? m.titulo : m.rubro}</h2>
          <p className="vit-bajada">{m.real ? `${m.rubro}. ${m.bajada}` : m.bajada}</p>
          <ul>{m.tiene.map((x) => <li key={x}>{x}</li>)}</ul>
          {!m.real && (
            <form className="vit-probar" onSubmit={(e) => { e.preventDefault(); setAplicado(nombre) }}>
              <label htmlFor="vit-nombre">Probala con el nombre de tu negocio</label>
              <div>
                <input id="vit-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40}
                       placeholder={m.titulo.replace("Su ", "Ej.: tu ")} autoComplete="organization" />
                <button type="submit">Ver</button>
              </div>
            </form>
          )}
          {!angosto && (
            <div className="vit-dispo" role="group" aria-label="Cómo verla">
              <button type="button" className={modo === "compu" ? "on" : ""} onClick={() => setModo("compu")}>En la compu</button>
              <button type="button" className={modo === "celu" ? "on" : ""} onClick={() => setModo("celu")}>En el celular</button>
            </div>
          )}
          <div className="vit-acciones">
            <a className="boton lleno" href={wa(m.pedido)} target="_blank" rel="noopener">Quiero una así</a>
            <a className="boton borde" href={src} target="_blank" rel="noopener">
              {m.real ? `Abrir ${m.real.dominio}` : "Abrir en pantalla completa"}
            </a>
            {m.real && <a className="vit-caso" href={m.real.caso}>Ver el caso completo →</a>}
          </div>
          {!m.real && <p className="vit-nota">Las fotos y los datos son de ejemplo: con los tuyos queda tu página.</p>}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function Casos() {
  const ruta = rutaPorId("casos")
  const [abierta, setAbierta] = useState<string | null>(null)
  const botones = useRef<Record<string, HTMLButtonElement | null>>({})
  const reales = Object.values(CASOS).filter((c) => c.rutaId === "caso-finan")
  const m = MUESTRAS.find((x) => x.id === abierta)

  return (
    <section className="pagina">
      <Cabeza
        ruta={ruta}
        imagen={`${ORIGEN}${BASE}fotos/creditofinan.webp`}
        ld={[
          ldColeccion(reales.map((c) => ({ url: ORIGEN + rutaPorId(c.rutaId).path, nombre: `Página web de ${c.cliente.nombre}` }))),
          ...TESTIMONIOS.map(ldTestimonio),
        ]}
      />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · Ejemplos
        </p>
        <h1 className="titulo">Así puede quedar la página de tu negocio.</h1>
        <p className="respuesta">
          Para cada rubro con el que trabajamos armamos una página de muestra completa. Tocá una
          para abrirla en grande, recorrela como la vería un cliente tuyo y probala con el nombre de
          tu negocio. Las fotos y los datos son de ejemplo. Crédito Finan es un cliente real: su
          página está publicada y se puede abrir.
        </p>

        <div className="vit-grilla">
          {MUESTRAS.map((x) => (
            <Tarjeta key={x.id} m={x} abrir={() => setAbierta(x.id)} refBoton={(b) => { botones.current[x.id] = b }} />
          ))}
        </div>

        <div className="prosa">
          <h2>¿Tu rubro no está?</h2>
          <p>
            Hacemos páginas para cualquier negocio. Escribinos por WhatsApp con tu rubro y te pasamos
            ejemplos y el presupuesto en el día.
          </p>
          <Testimonios lista={TESTIMONIOS} />
          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Quiero la mía
            </a>
            <a className="boton borde" href="/precios/">
              Ver qué incluye
            </a>
          </div>
        </div>
      </div>
      {m && <Panel key={m.id} m={m} desde={botones.current[m.id] ?? null} alCerrar={() => setAbierta(null)} />}
    </section>
  )
}

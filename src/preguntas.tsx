import { Cabeza } from "./seo/Cabeza"
import { rutaPorId } from "./seo/rutas"
import { ldFaq, type Pregunta } from "./seo/ld"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20tengo%20una%20consulta"

/* Preguntas escritas como las hace la gente, con la respuesta directa en la
   primera oracion. Es lo que extraen los buscadores con IA y lo que lee una
   persona que llego con una duda concreta. Cada respuesta se sostiene sola,
   sin el contexto del resto. */

export const PREGUNTAS: Pregunta[] = [
  {
    q: "¿Cuánto cuesta hacer una página web para mi negocio?",
    a: "No hay lista de precios: cada página se cotiza según lo que necesite tu negocio, y el presupuesto te lo pasamos por WhatsApp en el día, antes de que pagues nada. Se paga la mitad al arrancar y la otra mitad cuando la ves terminada.",
  },
  {
    q: "¿Cuánto tarda?",
    a: "Días, no semanas: depende de lo que lleve la página y de cuándo nos pasás las fotos y la información. El plazo exacto va en el presupuesto. Si algo se demora es porque falta material, y te lo avisamos ese mismo día.",
  },
  {
    q: "¿Cómo se paga?",
    a: "50% al arrancar y 50% cuando ves la página terminada en tu celular. Si no te gusta, no pagás el saldo. No hay letra chica en eso.",
  },
  {
    q: "Ya tengo Instagram, ¿para qué necesito una página web?",
    a: "Porque cuando alguien te busca en Google aparece tu competencia, no vos. Instagram no sale en las búsquedas, no muestra precios ni horarios de forma clara, y el algoritmo decide quién te ve. La página es tuya, aparece cuando te buscan y ordena los pedidos que hoy contestás uno por uno.",
  },
  {
    q: "¿El dominio queda a mi nombre?",
    a: "Sí. El dominio se registra a tu nombre y, con el pago total, la página y su contenido son tuyos. Si un día querés llevártela a otro lado, podés.",
  },
  {
    q: "¿Qué pasa después de la entrega?",
    a: "Podés contratar el mantenimiento, que cubre el dominio, el alojamiento, los respaldos y el soporte. Se cotiza junto con la página y el primer mes es gratis. Si lo interrumpís, el sitio puede salir de línea y se retoma cuando vos decidas.",
  },
  {
    q: "¿Hacen tiendas online, turnos o reservas?",
    a: "Sí, integrando plataformas de terceros que ya funcionan bien para eso. La suscripción a esa plataforma queda a tu nombre y se cotiza aparte, por cada una.",
  },
  {
    q: "¿Trabajan solo en Posadas?",
    a: "No. Trabajamos para todo el país. Todo el proceso es por WhatsApp: nos mandás la información, te mostramos avances y la página queda publicada sin que nadie tenga que viajar.",
  },
  {
    q: "¿Qué tengo que mandar para empezar?",
    a: "Fotos de tu negocio o de lo que vendés, los textos o la información que quieras que aparezca (precios, horarios, ubicación, cómo te contactan) y el logo si tenés. Si no tenés fotos buenas, te decimos cómo sacarlas con el celular.",
  },
  {
    q: "¿Puedo arrepentirme después de contratar?",
    a: "Sí. Por la Ley 24.240 de Defensa del Consumidor podés arrepentirte dentro de los 10 días corridos de contratado el servicio, sin dar motivo. Si el trabajo ya arrancó a tu pedido, se descuenta la parte proporcional de lo hecho.",
  },
  {
    q: "¿Quiénes hacen la página?",
    a: "El equipo de Mas & Co, la rama de tecnología del grupo Mas, una familia que construye en Misiones desde 2010 con CMD y Mas & Sons. Del otro lado del WhatsApp contesta una persona, no un formulario.",
  },
]

export function Preguntas() {
  return (
    <section className="pagina">
      <Cabeza ruta={rutaPorId("preguntas")} ld={[ldFaq(PREGUNTAS)]} />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · Preguntas frecuentes
        </p>
        <h1 className="titulo">Preguntas frecuentes.</h1>
        <p className="respuesta">
          Lo que nos preguntan antes de encargar una página, contestado como lo contestaríamos
          por WhatsApp: directo y sin vueltas.
        </p>

        <div className="prosa">
          <div className="faq">
            {PREGUNTAS.map((p) => (
              <details key={p.q}>
                <summary>{p.q}</summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">
              Hacenos la tuya
            </a>
          </div>
          <p className="enlaces">
            <a href="/precios/">Cuánto cuesta una página web</a>
            <a href="/quienes-somos/">Quiénes somos</a>
            <a href="/terminos/">Términos y condiciones</a>
          </p>
        </div>
      </div>
    </section>
  )
}

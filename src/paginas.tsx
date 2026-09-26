import { Cabeza } from "./seo/Cabeza"
import { rutaPorId } from "./seo/rutas"

const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20consultar"

/* Las paginas que no estan en el recorrido principal: se llega solo
   desde la barra o el pie, nunca scrolleando. */

export function Quienes() {
  return (
    <section className="pagina">
      <Cabeza ruta={rutaPorId("quienes")} />
      <div className="eje">
        <a className="volver" href="/">← Volver al inicio</a>
        <h1 className="titulo">Quiénes somos.</h1>
        <div className="prosa">
          <p>
            Somos la rama de tecnología de la familia Mas, que construye desde
            2010. Lo que empezó como una empresa
            constructora se convirtió en un grupo de dos generaciones
            trabajando juntas: el padre y los hijos, cada uno al frente de una
            parte del negocio.
          </p>
          <p>
            Primero fue <b>CMD</b>, Cia Misionera de Desarrollos, que
            construye y desarrolla en la provincia: loteos, viviendas y
            desarrollos propios como Solares de Loreto. Después el trabajo
            cruzó la frontera y nació <b>Mas &amp; Sons</b>, la marca
            internacional del grupo, con construcción, real estate y comercio.
            Y en 2026 llegó <b>Mas &amp; Co</b>: la generación más joven
            aplicando tecnología a lo que el grupo siempre hizo, que es
            ayudar a otros a levantar algo propio.
          </p>
          <p>
            Acá hacemos los sitios, los sistemas de turnos y las
            automatizaciones con los que un negocio vende y atiende. Y
            trabajamos distinto a una agencia grande: nos cuenta qué necesita
            por WhatsApp, lo armamos con sus fotos y su información, y lo ve
            terminado en su celular antes de pagar el saldo. Del otro lado
            contesta una persona, no un formulario.
          </p>
        </div>

        <div className="grupo-grande">
          <article>
            <h2>Mas &amp; Sons</h2>
            <p className="grupo-rol">Internacional</p>
            <p>La marca internacional del grupo: construcción, real estate y
            comercio.</p>
          </article>
          <article>
            <h2>CMD</h2>
            <p className="grupo-rol">Desarrollos</p>
            <p>Cia Misionera de Desarrollos: construcción, loteos y
            desarrollos propios en la provincia desde 2010.</p>
          </article>
          <article>
            <h2>Mas &amp; Co</h2>
            <p className="grupo-rol">Tecnología</p>
            <p>Los sitios, los turnos y las automatizaciones con los que un
            negocio vende y atiende todos los días.</p>
          </article>
        </div>

        <div className="acciones">
          <a className="boton lleno" href={WA} target="_blank" rel="noopener">Escribinos</a>
        </div>
      </div>
    </section>
  )
}

export function Terminos() {
  return (
    <section className="pagina">
      <Cabeza ruta={rutaPorId("terminos")} />
      <div className="eje">
        <a className="volver" href="/">← Volver al inicio</a>
        <h1 className="titulo">Términos y condiciones.</h1>
        <div className="prosa legal">
          <p className="fecha">Última actualización: agosto de 2026</p>

          <h2>1. Titular</h2>
          <p>
            Mas &amp; Co, rama de tecnología del grupo Mas, con asiento en
            Posadas, Misiones, Argentina. Contacto: masandco.mas@gmail.com o
            WhatsApp +54 9 3764 61-5587.
          </p>

          <h2>2. Aceptación</h2>
          <p>
            Al usar este sitio aceptás estos términos. Si no estás de acuerdo,
            no uses el sitio.
          </p>

          <h2>3. Servicios</h2>
          <p>
            Diseño y desarrollo de sitios web, implementación de sistemas de
            turnos y reservas de plataformas de terceros, y automatizaciones a
            medida. Los servicios se contratan por WhatsApp o correo, sin
            venta online en este sitio.
          </p>

          <h2>4. Presupuestos y pagos</h2>
          <p>
            Los precios se expresan en pesos argentinos y los presupuestos
            tienen una validez de 7 días. Los trabajos se abonan 50% al
            comenzar y 50% contra entrega, una vez que el cliente vio el
            trabajo terminado. El mantenimiento es un abono mensual que cubre
            dominio, alojamiento, respaldos y soporte; si se interrumpe, el
            sitio puede salir de línea y el servicio puede retomarse cuando el
            cliente lo decida.
          </p>

          <h2>5. Derecho de arrepentimiento</h2>
          <p>
            En contrataciones a distancia rige la Ley 24.240 de Defensa del
            Consumidor: el cliente puede arrepentirse dentro de los 10 días
            corridos de contratado el servicio, sin expresión de causa. Si el
            trabajo ya comenzó a pedido del cliente, se descuenta la parte
            proporcional de lo ya realizado.
          </p>

          <h2>6. Plazos y materiales</h2>
          <p>
            El plazo de entrega de un sitio se indica en el presupuesto y se cuenta desde la
            recepción de las fotos y la información del negocio. El cliente
            garantiza tener derecho a usar los materiales que entrega; Mas
            &amp; Co no se responsabiliza por reclamos de terceros sobre
            materiales provistos por el cliente.
          </p>

          <h2>7. Propiedad del trabajo</h2>
          <p>
            Con el pago total, el sitio y su contenido son del cliente. El
            dominio se registra a nombre del cliente. Las suscripciones a
            plataformas de terceros (turnos, reservas, tiendas) quedan a
            nombre del cliente y se facturan aparte, por cada plataforma.
          </p>

          <h2>8. Propiedad intelectual de este sitio</h2>
          <p>
            El contenido de este sitio (textos, diseño, código, marca) es
            propiedad de Mas &amp; Co y del grupo Mas. Las capturas de
            trabajos publicadas pertenecen a sus respectivos titulares y se
            muestran como referencia del trabajo realizado.
          </p>

          <h2>9. Uso del sitio</h2>
          <p>
            Está prohibido usar este sitio para actividades ilegales, intentar
            accesos no autorizados, introducir código malicioso o realizar
            extracción masiva y automatizada de contenido sin autorización.
          </p>

          <h2>10. Datos personales</h2>
          <p>
            Este sitio no tiene formularios de registro. Los datos de contacto
            que recibimos por WhatsApp o correo se usan solo para responder la
            consulta y llevar adelante el trabajo, no se ceden a terceros y se
            conservan mientras dure la relación comercial, conforme a la Ley
            25.326 de Protección de Datos Personales. El titular de los datos
            puede pedir acceso, rectificación o supresión escribiendo a
            masandco.mas@gmail.com; respondemos dentro de los 10 días hábiles.
            También puede reclamar ante la Agencia de Acceso a la Información
            Pública (AAIP), autoridad de control de la Ley 25.326. Para
            visitantes de la Unión Europea aplican además los derechos del
            RGPD, con las mismas vías de contacto.
          </p>

          <h2>11. Cookies y almacenamiento local</h2>
          <p>
            Este sitio no usa cookies de publicidad ni de seguimiento, ni
            píxeles de redes sociales. Lo único que guarda es la preferencia
            de tema claro u oscuro, en el almacenamiento local del navegador
            del visitante: ese dato no sale de su dispositivo y puede borrarse
            limpiando los datos del navegador. Si en el futuro se incorporara
            medición de visitas, esta política se actualizará antes y se
            pedirá el consentimiento que corresponda.
          </p>

          <h2>12. Alojamiento y transferencia internacional</h2>
          <p>
            El sitio se aloja en GitHub Pages (GitHub Inc., Estados Unidos),
            que como todo servidor web puede registrar direcciones IP en sus
            registros técnicos de acceso, bajo sus propias políticas de
            privacidad. Mas &amp; Co no accede a esos registros.
          </p>

          <h2>13. Menores</h2>
          <p>
            Este sitio ofrece servicios a negocios y no está dirigido a
            menores de edad. No recolectamos conscientemente datos de menores.
          </p>

          <h2>14. Responsabilidad</h2>
          <p>
            Los sitios se entregan funcionando y verificados. No garantizamos
            resultados comerciales ni posiciones en buscadores, que dependen
            de factores ajenos a este servicio. El sitio se ofrece tal cual,
            con esfuerzos razonables de disponibilidad. Nada de lo dicho acá
            limita los derechos irrenunciables del consumidor.
          </p>

          <h2>15. Enlaces a terceros</h2>
          <p>
            Este sitio enlaza a sitios de clientes y a plataformas de
            terceros. No controlamos ni respondemos por su contenido ni por
            sus prácticas de privacidad.
          </p>

          <h2>16. Modificaciones</h2>
          <p>
            Podemos actualizar estos términos; la fecha de arriba indica la
            última revisión. Los cambios rigen desde su publicación en esta
            página.
          </p>

          <h2>17. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de la República Argentina.
            Cualquier controversia se somete a los tribunales ordinarios de
            Posadas, Misiones, salvo los derechos irrenunciables del
            consumidor. Si alguna cláusula resultara inválida, el resto
            conserva su vigencia.
          </p>

          <p className="aviso-legal">
            Aviso: este documento es una plantilla generada automáticamente
            sobre boilerplate estándar y buenas prácticas. No constituye
            asesoramiento legal. Antes de considerarlo definitivo debe
            revisarlo un abogado matriculado en la jurisdicción.
          </p>
        </div>
      </div>
    </section>
  )
}

/* Contacto con pagina propia: el estudio de visibilidad en IA (26/09/2026)
   marco que los datos de contacto solo vivian en el pie, y un asistente cita
   paginas, no pies. Horario de la ficha de Google Business; zona: todo el pais
   (nunca la ciudad, ver la regla de la marca nacional). */
export function Contacto() {
  return (
    <section className="pagina">
      <Cabeza ruta={rutaPorId("contacto")} />
      <div className="eje">
        <p className="miga">
          <a href="/">Inicio</a> · Contacto
        </p>
        <h1 className="titulo">Contacto.</h1>
        <p className="respuesta">
          Escribinos por WhatsApp al +54 9 3764 61-5587 y te contesta una persona. Atendemos
          todos los días de 9 a 20, hora de Argentina, y trabajamos con negocios de todo el país.
        </p>
        <div className="prosa">
          <ul>
            <li><b>WhatsApp:</b> <a href="https://wa.me/5493764615587" target="_blank" rel="noopener">+54 9 3764 61-5587</a></li>
            <li><b>Correo:</b> <a href="mailto:masandco.mas@gmail.com">masandco.mas@gmail.com</a></li>
            <li><b>Instagram:</b> <a href="https://instagram.com/masandco.mas" target="_blank" rel="noopener">@masandco.mas</a></li>
            <li><b>Horario:</b> todos los días, de 9 a 20 (hora de Argentina).</li>
            <li><b>Zona:</b> todo el país. El trabajo completo se hace por WhatsApp.</li>
          </ul>

          <h2>Qué pasa cuando nos escribís</h2>
          <ol>
            <li>Te preguntamos de qué es tu negocio y qué necesitás que haga la página.</li>
            <li>Te mostramos ejemplos de tu rubro y te pasamos el presupuesto por escrito, en el día.</li>
            <li>Si te sirve, arrancamos con la mitad. La otra mitad la pagás cuando ves la página terminada, y si no te gusta, no la pagás.</li>
          </ol>

          <h2>Qué conviene tener a mano</h2>
          <p>
            Fotos de tu negocio o de lo que vendés, la información que querés que aparezca
            (precios, horarios, ubicación y cómo te contactan) y el logo, si tenés. Si no tenés
            fotos buenas, te decimos cómo sacarlas con el celular. Con eso armamos el presupuesto
            y, si arrancamos, la página.
          </p>

          <div className="acciones">
            <a className="boton lleno" href={WA} target="_blank" rel="noopener">Escribinos por WhatsApp</a>
          </div>
          <p className="enlaces">
            <a href="/precios/">Cuánto cuesta una página web</a>
            <a href="/preguntas-frecuentes/">Preguntas frecuentes</a>
            <a href="/quienes-somos/">Quiénes somos</a>
          </p>
        </div>
      </div>
    </section>
  )
}

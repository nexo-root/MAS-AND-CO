const WA = "https://wa.me/5493764615587?text=Hola%2C%20quiero%20consultar"

/* Las paginas que no estan en el recorrido principal: se llega solo
   desde la barra o el pie, nunca scrolleando. */

export function Quienes() {
  return (
    <section className="pagina">
      <div className="eje">
        <a className="volver" href="#/">← Volver al inicio</a>
        <h2 className="titulo">Quiénes somos.</h2>
        <div className="prosa">
          <p>
            Somos la rama de tecnología de la familia Mas, que construye desde
            Posadas, Misiones, desde 2010. Lo que empezó como una empresa
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
            <h3>Mas &amp; Sons</h3>
            <p className="grupo-rol">Internacional</p>
            <p>La marca internacional del grupo: construcción, real estate y
            comercio, desde Posadas hacia afuera.</p>
          </article>
          <article>
            <h3>CMD</h3>
            <p className="grupo-rol">Desarrollos · Misiones</p>
            <p>Cia Misionera de Desarrollos: construcción, loteos y
            desarrollos propios en la provincia desde 2010.</p>
          </article>
          <article>
            <h3>Mas &amp; Co</h3>
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
      <div className="eje">
        <a className="volver" href="#/">← Volver al inicio</a>
        <h2 className="titulo">Términos y condiciones.</h2>
        <div className="prosa legal">
          <p className="fecha">Última actualización: agosto de 2026</p>

          <h3>1. Titular</h3>
          <p>
            Mas &amp; Co, rama de tecnología del grupo Mas, con asiento en
            Posadas, Misiones, Argentina. Contacto: masandcoo@gmail.com o
            WhatsApp +54 9 3764 61-5587.
          </p>

          <h3>2. Aceptación</h3>
          <p>
            Al usar este sitio aceptás estos términos. Si no estás de acuerdo,
            no uses el sitio.
          </p>

          <h3>3. Servicios</h3>
          <p>
            Diseño y desarrollo de sitios web, implementación de sistemas de
            turnos y reservas de plataformas de terceros, y automatizaciones a
            medida. Los servicios se contratan por WhatsApp o correo, sin
            venta online en este sitio.
          </p>

          <h3>4. Presupuestos y pagos</h3>
          <p>
            Los precios se expresan en pesos argentinos y los presupuestos
            tienen una validez de 7 días. Los trabajos se abonan 50% al
            comenzar y 50% contra entrega, una vez que el cliente vio el
            trabajo terminado. El mantenimiento es un abono mensual que cubre
            dominio, alojamiento, respaldos y soporte; si se interrumpe, el
            sitio puede salir de línea y el servicio puede retomarse cuando el
            cliente lo decida.
          </p>

          <h3>5. Derecho de arrepentimiento</h3>
          <p>
            En contrataciones a distancia rige la Ley 24.240 de Defensa del
            Consumidor: el cliente puede arrepentirse dentro de los 10 días
            corridos de contratado el servicio, sin expresión de causa. Si el
            trabajo ya comenzó a pedido del cliente, se descuenta la parte
            proporcional de lo ya realizado.
          </p>

          <h3>6. Plazos y materiales</h3>
          <p>
            El plazo estimado de entrega de un sitio es de dos semanas desde
            la recepción de las fotos y la información del negocio. El cliente
            garantiza tener derecho a usar los materiales que entrega; Mas
            &amp; Co no se responsabiliza por reclamos de terceros sobre
            materiales provistos por el cliente.
          </p>

          <h3>7. Propiedad del trabajo</h3>
          <p>
            Con el pago total, el sitio y su contenido son del cliente. El
            dominio se registra a nombre del cliente. Las suscripciones a
            plataformas de terceros (turnos, reservas, tiendas) quedan a
            nombre del cliente y se facturan aparte, por cada plataforma.
          </p>

          <h3>8. Propiedad intelectual de este sitio</h3>
          <p>
            El contenido de este sitio (textos, diseño, código, marca) es
            propiedad de Mas &amp; Co y del grupo Mas. Las capturas de
            trabajos publicadas pertenecen a sus respectivos titulares y se
            muestran como referencia del trabajo realizado.
          </p>

          <h3>9. Uso del sitio</h3>
          <p>
            Está prohibido usar este sitio para actividades ilegales, intentar
            accesos no autorizados, introducir código malicioso o realizar
            extracción masiva y automatizada de contenido sin autorización.
          </p>

          <h3>10. Datos personales</h3>
          <p>
            Este sitio no tiene formularios de registro. Los datos de contacto
            que recibimos por WhatsApp o correo se usan solo para responder la
            consulta y llevar adelante el trabajo, no se ceden a terceros y se
            conservan mientras dure la relación comercial, conforme a la Ley
            25.326 de Protección de Datos Personales. El titular de los datos
            puede pedir acceso, rectificación o supresión escribiendo a
            masandcoo@gmail.com; respondemos dentro de los 10 días hábiles.
            También puede reclamar ante la Agencia de Acceso a la Información
            Pública (AAIP), autoridad de control de la Ley 25.326. Para
            visitantes de la Unión Europea aplican además los derechos del
            RGPD, con las mismas vías de contacto.
          </p>

          <h3>11. Cookies y almacenamiento local</h3>
          <p>
            Este sitio no usa cookies de publicidad ni de seguimiento, ni
            píxeles de redes sociales. Lo único que guarda es la preferencia
            de tema claro u oscuro, en el almacenamiento local del navegador
            del visitante: ese dato no sale de su dispositivo y puede borrarse
            limpiando los datos del navegador. Si en el futuro se incorporara
            medición de visitas, esta política se actualizará antes y se
            pedirá el consentimiento que corresponda.
          </p>

          <h3>12. Alojamiento y transferencia internacional</h3>
          <p>
            El sitio se aloja en GitHub Pages (GitHub Inc., Estados Unidos),
            que como todo servidor web puede registrar direcciones IP en sus
            registros técnicos de acceso, bajo sus propias políticas de
            privacidad. Mas &amp; Co no accede a esos registros.
          </p>

          <h3>13. Menores</h3>
          <p>
            Este sitio ofrece servicios a negocios y no está dirigido a
            menores de edad. No recolectamos conscientemente datos de menores.
          </p>

          <h3>14. Responsabilidad</h3>
          <p>
            Los sitios se entregan funcionando y verificados. No garantizamos
            resultados comerciales ni posiciones en buscadores, que dependen
            de factores ajenos a este servicio. El sitio se ofrece tal cual,
            con esfuerzos razonables de disponibilidad. Nada de lo dicho acá
            limita los derechos irrenunciables del consumidor.
          </p>

          <h3>15. Enlaces a terceros</h3>
          <p>
            Este sitio enlaza a sitios de clientes y a plataformas de
            terceros. No controlamos ni respondemos por su contenido ni por
            sus prácticas de privacidad.
          </p>

          <h3>16. Modificaciones</h3>
          <p>
            Podemos actualizar estos términos; la fecha de arriba indica la
            última revisión. Los cambios rigen desde su publicación en esta
            página.
          </p>

          <h3>17. Ley aplicable y jurisdicción</h3>
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

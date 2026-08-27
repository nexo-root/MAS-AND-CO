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
            Mas &amp; Co es la rama de tecnología del grupo Mas, una empresa
            familiar que construye y desarrolla desde Posadas, Misiones. El
            grupo tiene tres patas: <b>CMD</b>, los desarrollos inmobiliarios
            en la provincia; <b>Mas &amp; Sons</b>, la marca internacional; y
            <b> Mas &amp; Co</b>, que hace los sitios, los sistemas de turnos
            y las automatizaciones con los que un negocio vende y atiende.
          </p>
          <p>
            Trabajamos distinto a una agencia grande: nos cuenta qué necesita
            por WhatsApp, lo armamos con sus fotos y su información, y lo ve
            terminado en su celular antes de pagar el saldo. Del otro lado
            contesta una persona, no un formulario.
          </p>
        </div>
        <div className="placa">
          <div><b>CMD</b><span>Desarrollos, Misiones</span></div>
          <div><b>Mas &amp; Sons</b><span>Internacional</span></div>
          <div><b>Mas &amp; Co</b><span>Tecnología</span></div>
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

          <h3>2. Servicios</h3>
          <p>
            Diseño y desarrollo de sitios web, implementación de sistemas de
            turnos y reservas de plataformas de terceros, y automatizaciones a
            medida. Los servicios se contratan por WhatsApp o correo, sin
            venta online en este sitio.
          </p>

          <h3>3. Presupuestos y pagos</h3>
          <p>
            Los precios se expresan en pesos argentinos y los presupuestos
            tienen una validez de 7 días. Los trabajos se abonan 50% al
            comenzar y 50% contra entrega, una vez que el cliente vio el
            trabajo terminado. El mantenimiento es un abono mensual que cubre
            dominio, alojamiento, respaldos y soporte; si se interrumpe, el
            sitio puede salir de línea y el servicio puede retomarse cuando el
            cliente lo decida.
          </p>

          <h3>4. Plazos y materiales</h3>
          <p>
            El plazo estimado de entrega de un sitio es de dos semanas desde
            la recepción de las fotos y la información del negocio. El cliente
            garantiza tener derecho a usar los materiales que entrega.
          </p>

          <h3>5. Propiedad</h3>
          <p>
            Con el pago total, el sitio y su contenido son del cliente. El
            dominio se registra a nombre del cliente. Las suscripciones a
            plataformas de terceros (turnos, reservas) quedan a nombre del
            cliente y se facturan aparte, por cada plataforma.
          </p>

          <h3>6. Datos personales</h3>
          <p>
            Este sitio no tiene formularios ni cookies de seguimiento. Los
            datos de contacto que recibimos por WhatsApp o correo se usan solo
            para responder la consulta y llevar adelante el trabajo, y no se
            ceden a terceros, conforme a la Ley 25.326 de Protección de Datos
            Personales. El titular de los datos puede pedir acceso,
            rectificación o supresión escribiendo a masandcoo@gmail.com, y
            puede reclamar ante la Agencia de Acceso a la Información Pública.
          </p>

          <h3>7. Responsabilidad</h3>
          <p>
            Los sitios se entregan funcionando y verificados. No garantizamos
            resultados comerciales ni posiciones en buscadores, que dependen
            de factores ajenos a este servicio. Nada de lo dicho acá limita
            los derechos irrenunciables del consumidor.
          </p>

          <h3>8. Ley aplicable y jurisdicción</h3>
          <p>
            Estos términos se rigen por las leyes de la República Argentina.
            Cualquier controversia se somete a los tribunales ordinarios de
            Posadas, Misiones, salvo los derechos irrenunciables del
            consumidor.
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

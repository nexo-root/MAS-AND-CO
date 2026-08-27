import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════════════
   Las animaciones de scroll.

   Cuatro movimientos, cada uno con un motivo:

   1. La portada se hunde y se apaga al bajar. Da profundidad y despide
      el hero en vez de cortarlo de golpe.
   2. Los titulos se revelan con una mascara que sube, no con un fade.
      La diferencia entre una web con direccion y una con "fade in".
   3. Las capturas hacen parallax DENTRO de su marco: la imagen se mueve
      mas lento que el marco que la contiene. Es lo que mas se nota.
   4. Las filas y las celdas entran escalonadas, con su linea dibujandose.

   Con prefers-reduced-motion no se registra nada: todo queda visible y
   quieto, que es lo que corresponde.
   ═══════════════════════════════════════════════════════════════ */
export function useScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      // 1 · la portada se hunde
      gsap.to(".portada .eje", {
        y: 130,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".portada",
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      })

      // 2 · titulos: mascara que sube
      gsap.utils.toArray<HTMLElement>("h2").forEach((t) => {
        gsap.fromTo(
          t,
          { yPercent: 108, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: t, start: "top 88%" },
          }
        )
      })

      // 3 · parallax dentro del marco
      gsap.utils.toArray<HTMLElement>(".lienzo").forEach((marco) => {
        const foto = marco.querySelector<HTMLElement>("img.ancha")
        const cel = marco.querySelector<HTMLElement>("img.movil")
        if (foto) {
          gsap.fromTo(
            foto,
            { yPercent: -7, scale: 1.14 },
            {
              yPercent: 7,
              ease: "none",
              scrollTrigger: { trigger: marco, start: "top bottom", end: "bottom top", scrub: 0.8 },
            }
          )
        }
        if (cel) {
          gsap.fromTo(
            cel,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: marco, start: "top 76%" },
            }
          )
        }
      })

      // 4 · filas y celdas, escalonadas
      gsap.utils.toArray<HTMLElement>(".lista").forEach((lista) => {
        gsap.fromTo(
          lista.querySelectorAll(".item"),
          { x: -34, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.09,
            ease: "expo.out",
            scrollTrigger: { trigger: lista, start: "top 82%" },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>(".placa").forEach((placa) => {
        gsap.fromTo(
          placa.querySelectorAll("div"),
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: placa, start: "top 90%" },
          }
        )
      })

      // 5 · el resto sube al entrar
      gsap.utils.toArray<HTMLElement>(".ficha, .vias, .acciones").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        )
      })

      // 6 · toda la pagina deriva: cada seccion entra desde abajo y sigue
      //     subiendo un poco mientras se scrollea, asi nada queda estatico
      gsap.utils.toArray<HTMLElement>("section:not(.portada) .eje").forEach((eje) => {
        gsap.fromTo(
          eje,
          { y: 64 },
          {
            y: -34,
            ease: "none",
            scrollTrigger: { trigger: eje, start: "top bottom", end: "bottom top", scrub: 0.9 },
          }
        )
      })

      // 7 · los numeros gigantes de obra se mueven a su propio ritmo
      gsap.utils.toArray<HTMLElement>(".obra-num").forEach((n) => {
        gsap.fromTo(
          n,
          { yPercent: 46 },
          {
            yPercent: -30,
            ease: "none",
            scrollTrigger: { trigger: n.parentElement, start: "top bottom", end: "bottom top", scrub: 0.7 },
          }
        )
      })

      // 8 · la bajada de cada obra
      gsap.utils.toArray<HTMLElement>(".obra-bajada").forEach((b) => {
        gsap.fromTo(
          b,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: b, start: "top 92%" },
          }
        )
      })

      // 9 · la entrada del hero al cargar: todo sube escalonado
      gsap.fromTo(
        ".portada .eje > *",
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.1, ease: "expo.out", delay: 0.08 }
      )

      // 10 · la barra de progreso del scroll
      gsap.to(".progreso", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
      })
    })

    /* Las medidas cambian cuando termina de cargar la tipografia y cuando
       entran las imagenes: sin este refresco las animaciones disparan en el
       lugar equivocado. */
    const refrescar = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refrescar)
    addEventListener("load", refrescar)

    return () => {
      ctx.revert()
      removeEventListener("load", refrescar)
    }
  }, [])
}

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════════════
   La coreografia de scroll. Cuatro actos, todos NOTORIOS:

   1. EL HERO SE DESARMA. La portada queda clavada en pantalla y,
      mientras se scrollea, cada letra de MAS & CO vuela hacia arriba
      escalonada, la linea de piso se repliega y la ficha se apaga.
      En el celular no se clava: se hunde, que pesa menos.
   2. LAS CAPTURAS ENTRAN CON CORTINA. El marco se descubre de abajo
      hacia arriba, la imagen respira de 1.3 a 1 mientras pasa, y
      cada obra deriva desde su costado: la primera desde la
      izquierda, la segunda desde la derecha.
   3. LA PLACA SE DA VUELTA. Cada celda entra girando en 3D desde
      arriba, una tras otra.
   4. EL BLOQUE NAVY CRECE. Llega chico y levantado, y al entrar se
      expande hasta ocupar todo el ancho, como una tapa que cae.

   ═══════════════════════════════════════════════════════════════ */
export function useScroll(ruta?: string) {
  useEffect(() => {
    /* Ojo: aca NO se respeta prefers-reduced-motion a proposito. Windows con
       "efectos de animacion" apagados (muy comun) lo reporta activo y dejaba
       la web sin UNA sola animacion. Decision del dueno: el sitio se anima
       siempre. */

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // ── 1 · el hero se desarma ────────────────────────────────
      mm.add("(min-width: 861px)", () => {
        const letras = document.querySelectorAll(
          '.gigante span[aria-hidden] > span'
        )
        if (!letras.length) return
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".portada",
              start: "top top",
              end: "+=85%",
              scrub: 0.5,
              pin: true,
              anticipatePin: 1,
            },
          })
          .to(".bajo-piso, .placa, .acciones", {
            y: -50,
            opacity: 0,
            stagger: 0.05,
            ease: "power1.in",
          }, 0)
          .to(letras, {
            yPercent: -150,
            opacity: 0,
            stagger: { each: 0.05, from: "start" },
            ease: "power1.in",
          }, 0.05)
          .to(".piso", {
            scaleX: 0,
            transformOrigin: "0 50%",
            ease: "none",
          }, 0.1)
      })
      mm.add("(max-width: 860px)", () => {
        gsap.to(".portada .eje", {
          y: 110,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".portada",
            start: "top top",
            end: "bottom 35%",
            scrub: 0.6,
          },
        })
      })

      // ── titulos: suben rotando apenas, con peso ───────────────
      gsap.utils.toArray<HTMLElement>("h2.titulo").forEach((t) => {
        gsap.fromTo(
          t,
          { yPercent: 120, rotate: 4, opacity: 0 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: t, start: "top 88%" },
          }
        )
      })

      // ── 2 · las capturas: cortina, respiracion y deriva ───────
      gsap.utils.toArray<HTMLElement>(".obra").forEach((obra, i) => {
        const marco = obra.querySelector<HTMLElement>(".lienzo")
        const foto = obra.querySelector<HTMLElement>("img.ancha")
        const cel = obra.querySelector<HTMLElement>("img.movil")

        // la cortina que descubre el marco
        if (marco) {
          gsap.fromTo(
            marco,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.3,
              ease: "expo.inOut",
              scrollTrigger: { trigger: obra, start: "top 82%" },
            }
          )
        }
        // la imagen respira mientras el marco cruza la pantalla
        if (foto && marco) {
          gsap.fromTo(
            foto,
            { scale: 1.3 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: marco,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            }
          )
        }
        // cada obra deriva desde su costado (solo con pantalla ancha:
        // en el celular ese corrimiento desborda el ancho)
        mm.add("(min-width: 861px)", () => {
          gsap.fromTo(
            obra,
            { x: i % 2 === 0 ? -90 : 90 },
            {
              x: 0,
              ease: "none",
              scrollTrigger: {
                trigger: obra,
                start: "top bottom",
                end: "top 40%",
                scrub: 0.6,
              },
            }
          )
        })
        // el celular sube despues de la cortina
        if (cel) {
          gsap.fromTo(
            cel,
            { y: 150, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: obra, start: "top 62%" },
            }
          )
        }
      })

      // ── 3 · la placa se da vuelta en 3D ───────────────────────
      gsap.utils.toArray<HTMLElement>(".placa").forEach((placa) => {
        const celdas = placa.querySelectorAll("div")
        gsap.set(celdas, { transformPerspective: 650, transformOrigin: "50% 0%" })
        gsap.fromTo(
          celdas,
          { rotateX: -85, opacity: 0 },
          {
            rotateX: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.13,
            ease: "expo.out",
            scrollTrigger: { trigger: placa, start: "top 90%" },
          }
        )
      })

      // ── 4 · el bloque navy crece hasta ocupar todo ────────────
      gsap.utils.toArray<HTMLElement>(".tinta").forEach((bloque) => {
        gsap.fromTo(
          bloque,
          { scale: 0.92, y: 80, transformOrigin: "50% 0%" },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: bloque,
              start: "top 96%",
              end: "top 38%",
              scrub: 0.5,
            },
          }
        )
      })

      // ── el resto: entradas puntuales ──────────────────────────
      gsap.utils.toArray<HTMLElement>(".ficha, .acciones, .rama, .obra-bajada").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>(".vias").forEach((v) => {
        gsap.fromTo(
          v.querySelectorAll("a"),
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.09,
            ease: "expo.out",
            scrollTrigger: { trigger: v, start: "top 93%" },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>(".pie").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: 1, scrollTrigger: { trigger: el, start: "top 98%" } }
        )
      })

      // la entrada del hero al cargar, y la de las paginas sueltas
      gsap.fromTo(
        ".portada .eje > *",
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.1, ease: "expo.out", delay: 0.08 }
      )
      gsap.fromTo(
        ".pagina .eje > *",
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: "expo.out", delay: 0.05 }
      )

      // la barra de progreso
      gsap.to(".progreso", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
      })
    })

    /* Las medidas cambian cuando carga la tipografia y las imagenes:
       sin este refresco los disparos quedan corridos. */
    const refrescar = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refrescar)
    addEventListener("load", refrescar)

    return () => {
      ctx.revert()
      removeEventListener("load", refrescar)
    }
  }, [ruta])
}

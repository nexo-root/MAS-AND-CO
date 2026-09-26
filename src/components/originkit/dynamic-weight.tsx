"use client";

import * as React from "react"
import { useEffect, useRef } from "react"
const useIsStaticRenderer = () => false
/* Sin framer-motion (26/09/2026): el componente solo usaba `motion.span` como
   un span comun y `useAnimationFrame` como un requestAnimationFrame. Eran 118 KB
   del paquete (22 %) para dos cosas que hace el navegador solo. */

/**
 * VariableFontCursorProximity — text whose letters individually morph
 * their `wght` (font-variation-settings) based on proximity to the cursor.
 *
 * Adaptacion minima para este proyecto (el resto quedo tal cual):
 * - La pila tipografica es Archivo variable (la del titulo del hero),
 *   no el Inter empaquetado, porque el pedido es que use la misma letra.
 * - Cada mutacion de fontVariationSettings conserva 'wdth' 125, la voz
 *   ancha del logo; sin eso el ancho saltaria al valor por defecto.
 * - fontSize acepta string (clamp responsivo).
 */
export default function VariableFontCursorProximity(props: Props) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const {
        label,
        fromWeight,
        toWeight,
        strength,
        fontSize,
        color,
        transition,
        style,
    } = props

    const reach = Math.max(
        1,
        (Math.max(1, Math.min(100, strength)) / 100) * MAX_REACH
    )

    const isStatic = useIsStaticRenderer()
    const containerRef = useRef<HTMLDivElement>(null)
    const letterRefs = useRef<Array<HTMLSpanElement | null>>([])
    const letterFactorsRef = useRef<number[]>([])
    const lastFrameRef = useRef(0)
    const mousePositionRef = useRef({ x: -99999, y: -99999 })
    /* Sin puntero fino (celular) no hay proximidad posible: ahi corre una
       onda automatica de peso que recorre las letras. */
    const esTouchRef = useRef(
        typeof matchMedia !== "undefined" && matchMedia("(hover: none)").matches
    )
    /* Fuera de pantalla o con el mouse lejos, el loop no mide nada: medir
       cada letra por frame fuerza layout y pelea con el scroll. */
    const visibleRef = useRef(true)
    const maxFactorRef = useRef(0)
    /* cuando arranca la onda del celular (performance.now); null = todavia no */
    const ondaDesdeRef = useRef<number | null>(null)
    /* el ultimo peso ESCRITO en cada letra. No se compara contra
       el.style.fontVariationSettings porque el navegador lo devuelve con otras
       comillas ("wdth" 125 en vez de 'wdth' 125): nunca daba igual y cada
       cuadro reescribia las ocho letras aunque no cambiaran */
    const ultimoAjusteRef = useRef<string[]>([])
    const escribir = (i: number, el: HTMLSpanElement, valor: string) => {
        if (ultimoAjusteRef.current[i] === valor) return
        ultimoAjusteRef.current[i] = valor
        el.style.fontVariationSettings = valor
    }

    useEffect(() => {
        const el = containerRef.current
        if (!el || typeof IntersectionObserver === "undefined") return
        const ob = new IntersectionObserver(
            (e) => {
                const antes = visibleRef.current
                visibleRef.current = e[0].isIntersecting
                /* el logo vuelve a la pantalla: la onda se repite una vez */
                if (!antes && visibleRef.current && ondaDesdeRef.current !== null) {
                    ondaDesdeRef.current = performance.now() + 250
                }
            },
            { threshold: 0 }
        )
        ob.observe(el)
        return () => ob.disconnect()
    }, [])

    /* La onda del celular arranca 1,2 s despues de que la pagina termino de
       cargar, da dos pasadas y descansa. Antes corria para siempre: cada cuadro
       cambiaba el peso de las letras y el telefono tenia que volver a maquetar el
       texto gigante. Lighthouse lo midio el 26/09/2026: 3,5 s de "estilo y
       layout" en la carga, lo mas caro de toda la pagina en celular. */
    useEffect(() => {
        if (!esTouchRef.current) return
        const arrancar = () => { ondaDesdeRef.current = performance.now() + 1200 }
        if (document.readyState === "complete") arrancar()
        else addEventListener("load", arrancar, { once: true })
        return () => removeEventListener("load", arrancar)
    }, [])

    useEffect(() => {
        if (isStatic) return

        const updatePosition = (clientX: number, clientY: number) => {
            const el = containerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            mousePositionRef.current = {
                x: clientX - rect.left,
                y: clientY - rect.top,
            }
        }

        const handleMouseMove = (ev: MouseEvent) =>
            updatePosition(ev.clientX, ev.clientY)
        const handleTouchMove = (ev: TouchEvent) => {
            if (ev.touches.length === 0) return
            updatePosition(ev.touches[0].clientX, ev.touches[0].clientY)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("touchmove", handleTouchMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("touchmove", handleTouchMove)
        }
    }, [isStatic])

    const fromSettings = "'wdth' 125, 'wght' " + fromWeight

    /* EL CUERPO DEL CUADRO VA EN UN REF y el bucle de requestAnimationFrame se
       engancha UNA sola vez (efecto de mas abajo). Asi un re-render (la palanca
       de tema) actualiza lo que hace cada cuadro sin cortar el bucle. Con
       framer-motion pasaba lo contrario: re-enganchaba al cambiar la identidad
       de la funcion y las letras quedaban congeladas despues del primer toque
       de la palanca ("211 205 200..." para siempre, medido). */
    const cuadroRef = useRef<(now: number) => void>(() => {})
    cuadroRef.current = (now: number) => {
        if (isStatic) return
        const container = containerRef.current
        if (!container || !visibleRef.current) return

        const prevT = lastFrameRef.current || now
        const dtSec = Math.min(0.1, Math.max(0, (now - prevT) / 1000))
        lastFrameRef.current = now

        const tau = Math.max(0.016, transition?.duration ?? 0.3)
        const a = 1 - Math.exp(-dtSec / tau)
        const letras = letterRefs.current
        let maxF = 0

        /* ── celular: onda que viaja por las letras, sin medir nada ──
           Dura ONDA_MS desde que arranca; despues las letras vuelven al peso
           de reposo y el cuadro no toca mas el estilo. */
        if (esTouchRef.current) {
            const desde = ondaDesdeRef.current
            const ahora = performance.now()
            if (desde === null || ahora < desde) return
            const tOnda = ahora - desde
            const activa = tOnda < ONDA_MS
            if (!activa && maxFactorRef.current < 0.001) return
            for (let i = 0; i < letras.length; i++) {
                const letterEl = letras[i]
                if (!letterEl) continue
                const fase = (tOnda / 1000) * 2.1 - i * 0.75
                const target = activa ? Math.max(0, Math.sin(fase)) * 0.8 : 0
                const prev = letterFactorsRef.current[i] ?? 0
                const f = prev + (target - prev) * a
                letterFactorsRef.current[i] = f
                if (f > maxF) maxF = f
                escribir(i, letterEl, f < 0.001
                    ? fromSettings
                    : "'wdth' 125, 'wght' " + pesoEscalonado(fromWeight + (toWeight - fromWeight) * f))
            }
            maxFactorRef.current = maxF
            return
        }

        /* ── escritorio: proximidad al cursor ── */
        const containerRect = container.getBoundingClientRect()
        const mx = mousePositionRef.current.x
        const my = mousePositionRef.current.y

        /* mouse lejos y letras ya en reposo: nada que animar ni medir */
        const lejos =
            mx < -reach || my < -reach ||
            mx > containerRect.width + reach ||
            my > containerRect.height + reach
        if (lejos && maxFactorRef.current < 0.001) return

        for (let i = 0; i < letras.length; i++) {
            const letterEl = letras[i]
            if (!letterEl) continue
            const rect = letterEl.getBoundingClientRect()
            const cx = rect.left + rect.width / 2 - containerRect.left
            const cy = rect.top + rect.height / 2 - containerRect.top
            const dx = mx - cx
            const dy = my - cy
            const dist = Math.sqrt(dx * dx + dy * dy)

            const target = Math.min(Math.max(1 - dist / reach, 0), 1)
            const prev = letterFactorsRef.current[i] ?? 0
            const f = prev + (target - prev) * a
            letterFactorsRef.current[i] = f
            if (f > maxF) maxF = f

            if (f < 0.001) {
                escribir(i, letterEl, fromSettings)
                continue
            }

            escribir(i, letterEl,
                "'wdth' 125, 'wght' " + pesoEscalonado(fromWeight + (toWeight - fromWeight) * f))
        }
        maxFactorRef.current = maxF
    }
    useEffect(() => {
        if (isStatic) return
        let id = 0
        const bucle = (now: number) => {
            cuadroRef.current(now)
            id = requestAnimationFrame(bucle)
        }
        id = requestAnimationFrame(bucle)
        return () => cancelAnimationFrame(id)
    }, [isStatic])

    const srOnlyStyle: React.CSSProperties = {
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
    }

    const innerSpanStyle: React.CSSProperties = {
        fontFamily: VARIABLE_FONT_STACK,
        fontSize,
        color,
        textAlign: "center",
        display: "block",
        width: "100%",
        lineHeight: 1.05,
    }

    const words = label ? label.split(" ") : []

    /* NO se vacia el array: se RECORTA. Cuando las letras eran `motion.span`,
       framer memorizaba los ref y no los volvia a llamar en un re-render:
       vaciando el array, el primer cambio de tema dejaba el bucle sin letras.
       Con spans comunes React si los vuelve a llamar, pero recortar sigue
       siendo lo correcto y no cuesta nada. */
    let letterIndex = 0
    letterRefs.current.length = words.join("").length
    /* por las dudas, tras un re-render el proximo cuadro vuelve a escribir
       el peso de cada letra */
    ultimoAjusteRef.current = []

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isStatic ? undefined : "pointer",
                ...style,
            }}
        >
            {words.length === 0 ? null : (
                <span style={innerSpanStyle}>
                    <span style={srOnlyStyle}>{label}</span>
                    {words.map((word, wi) => {
                        const wordLetters = word.split("")
                        return (
                            <React.Fragment key={wi}>
                                <span
                                    aria-hidden
                                    style={{
                                        display: "inline-block",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {wordLetters.map((letter, li) => {
                                        const idx = letterIndex++
                                        return (
                                            <span
                                                key={li}
                                                ref={(
                                                    el: HTMLSpanElement | null
                                                ) => {
                                                    letterRefs.current[idx] = el
                                                }}
                                                style={{
                                                    display: "inline-block",
                                                    fontVariationSettings:
                                                        fromSettings,
                                                }}
                                            >
                                                {letter}
                                            </span>
                                        )
                                    })}
                                </span>
                                {wi < words.length - 1 && (
                                    <span
                                        aria-hidden
                                        style={{
                                            display: "inline-block",
                                        }}
                                    >
                                        &nbsp;
                                    </span>
                                )}
                            </React.Fragment>
                        )
                    })}
                </span>
            )}
        </div>
    )
}

const VARIABLE_FONT_STACK = "Archivo, system-ui, sans-serif"
/* dos pasadas de la onda en celular (el seno tarda ~3 s en recorrer una letra) */
const ONDA_MS = 6000

/* El peso se redondea de a 25 y no de a 1. Cada peso distinto de una letra
   variable es una "instancia" nueva que el navegador tiene que armar y
   maquetar desde cero; con pesos de a 1 eran cientos de instancias y cada
   cuadro costaba ~25 ms en celular (traza del 26/09/2026, aun con el logo
   aislado). De a 25 son 27 instancias entre 200 y 850 que quedan guardadas, y
   el ojo no ve el escalon porque la onda los recorre en pocos cuadros. */
const PASO_PESO = 25
function pesoEscalonado(w: number) {
    return Math.round(w / PASO_PESO) * PASO_PESO
}

const MAX_REACH = 800

type Props = {
    label: string
    fromWeight: number
    toWeight: number
    strength: number
    fontSize: number | string
    color: string
    transition: any
    style?: React.CSSProperties
}

const COMPONENT_DEFAULTS = {
    label: "Variable Font Proximity",
    fontSize: 48,
    color: "#0B1220",
    fromWeight: 200,
    toWeight: 800,
    strength: 25,
    transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
    },
}

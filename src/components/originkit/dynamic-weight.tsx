"use client";

import * as React from "react"
import { useEffect, useRef } from "react"
const useIsStaticRenderer = () => false
import { motion, useAnimationFrame } from "framer-motion"

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

    useEffect(() => {
        const el = containerRef.current
        if (!el || typeof IntersectionObserver === "undefined") return
        const ob = new IntersectionObserver(
            (e) => { visibleRef.current = e[0].isIntersecting },
            { threshold: 0 }
        )
        ob.observe(el)
        return () => ob.disconnect()
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

    useAnimationFrame((now: number) => {
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

        /* ── celular: onda que viaja por las letras, sin medir nada ── */
        if (esTouchRef.current) {
            for (let i = 0; i < letras.length; i++) {
                const letterEl = letras[i]
                if (!letterEl) continue
                const fase = (now / 1000) * 2.1 - i * 0.75
                const target = Math.max(0, Math.sin(fase)) * 0.8
                const prev = letterFactorsRef.current[i] ?? 0
                const f = prev + (target - prev) * a
                letterFactorsRef.current[i] = f
                const w = Math.round(fromWeight + (toWeight - fromWeight) * f)
                letterEl.style.fontVariationSettings =
                    "'wdth' 125, 'wght' " + w
            }
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
                if (letterEl.style.fontVariationSettings !== fromSettings) {
                    letterEl.style.fontVariationSettings = fromSettings
                }
                continue
            }

            const w = Math.round(fromWeight + (toWeight - fromWeight) * f)
            letterEl.style.fontVariationSettings =
                "'wdth' 125, 'wght' " + w
        }
        maxFactorRef.current = maxF
    })

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

    letterRefs.current = []
    let letterIndex = 0

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
                                            <motion.span
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
                                            </motion.span>
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

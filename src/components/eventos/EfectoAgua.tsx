'use client'

// Estela de agua que sigue al cursor.
//
// Cada movimiento suficientemente largo deja una onda que se expande y se
// desvanece; al hacer clic sale una onda mas grande, como una gota cayendo.
//
// Decisiones que importan:
//  · Las ondas se crean con DOM directo, no con estado de React. Un ripple cada
//    ~70 ms significaria decenas de renders por segundo de toda la pagina; aqui
//    el formulario ni se entera.
//  · Solo se activa con puntero fino (mouse o lapiz). En una pantalla tactil no
//    hay cursor que seguir y el efecto solo gastaria bateria.
//  · Se apaga con prefers-reduced-motion.
//  · La capa es fixed y pointer-events:none, asi que no intercepta ni un clic
//    del formulario.

import React, { useEffect, useRef } from 'react'

/** Distancia minima entre ondas, en px. Evita apelmazarlas al mover despacio. */
const PASO = 26
/** Tiempo minimo entre ondas, en ms. Techo de cuantas pueden existir a la vez. */
const INTERVALO = 70

export default function EfectoAgua() {
  const capaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const capa = capaRef.current
    if (!capa || typeof window === 'undefined') return

    const finoPuntero = window.matchMedia('(pointer: fine)').matches
    const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finoPuntero || menosMovimiento) return

    let ultimoTiempo = 0
    let ultimoX = 0
    let ultimoY = 0

    const onda = (x: number, y: number, tamano: number, duracion: number) => {
      const el = document.createElement('span')
      el.className = 'onda-agua'
      el.style.left = `${x}px`
      el.style.top = `${y}px`
      el.style.width = `${tamano}px`
      el.style.height = `${tamano}px`
      el.style.animationDuration = `${duracion}ms`
      // La onda se borra sola: sin esto la capa acumularia nodos toda la sesion.
      el.addEventListener('animationend', () => el.remove())
      capa.appendChild(el)
    }

    const alMover = (e: PointerEvent) => {
      const ahora = e.timeStamp
      if (ahora - ultimoTiempo < INTERVALO) return
      if (Math.hypot(e.clientX - ultimoX, e.clientY - ultimoY) < PASO) return
      ultimoTiempo = ahora
      ultimoX = e.clientX
      ultimoY = e.clientY
      onda(e.clientX, e.clientY, 26, 1100)
    }

    const alTocar = (e: PointerEvent) => onda(e.clientX, e.clientY, 60, 900)

    window.addEventListener('pointermove', alMover, { passive: true })
    window.addEventListener('pointerdown', alTocar, { passive: true })
    return () => {
      window.removeEventListener('pointermove', alMover)
      window.removeEventListener('pointerdown', alTocar)
      capa.replaceChildren()
    }
  }, [])

  return (
    <>
      <style>
        {`
          @keyframes ondaExpande {
            0%   { transform: translate(-50%, -50%) scale(0.35); opacity: 0.55; }
            70%  { opacity: 0.18; }
            100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
          }
          .onda-agua {
            position: absolute;
            border-radius: 9999px;
            border: 1px solid rgba(0, 163, 255, 0.55);
            background: radial-gradient(
              circle,
              rgba(0, 163, 255, 0.18) 0%,
              rgba(0, 163, 255, 0.06) 45%,
              transparent 70%
            );
            animation-name: ondaExpande;
            animation-timing-function: cubic-bezier(0.16, 0.8, 0.3, 1);
            animation-fill-mode: forwards;
            will-change: transform, opacity;
          }
        `}
      </style>
      <div ref={capaRef} aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" />
    </>
  )
}

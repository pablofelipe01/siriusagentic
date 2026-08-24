'use client'

// Fondo animado de la pagina de registro.
//
// Tres manchas de luz que derivan lentamente, mas un halo fijo detras de la
// cabecera. Los tiempos son largos (24-40 s) y las opacidades bajas a
// proposito: el fondo tiene que dar sensacion de estar vivo, no competir con
// un formulario que la persona esta leyendo. Todo se apaga con
// prefers-reduced-motion.
//
// Se usa transform (no top/left) para que la animacion corra en el compositor
// y no obligue al navegador a recalcular el layout en cada cuadro; en un
// celular de gama baja esa diferencia es la que decide si el scroll va suave.

import React from 'react'

const MANCHAS = [
  {
    color: 'rgba(0,163,255,0.20)',
    tamano: 620,
    left: '-18%',
    top: '-12%',
    animacion: 'derivaA 34s ease-in-out infinite',
  },
  {
    color: 'rgba(0,214,168,0.14)',
    tamano: 540,
    left: '62%',
    top: '8%',
    animacion: 'derivaB 40s ease-in-out infinite',
  },
  {
    color: 'rgba(90,110,255,0.13)',
    tamano: 700,
    left: '10%',
    top: '52%',
    animacion: 'derivaC 30s ease-in-out infinite',
  },
] as const

export default function FondoAnimado() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <style>
        {`
          @keyframes derivaA {
            0%, 100% { transform: translate3d(0,0,0) scale(1); }
            50%      { transform: translate3d(9vw, 6vh, 0) scale(1.15); }
          }
          @keyframes derivaB {
            0%, 100% { transform: translate3d(0,0,0) scale(1.1); }
            50%      { transform: translate3d(-11vw, 8vh, 0) scale(0.92); }
          }
          @keyframes derivaC {
            0%, 100% { transform: translate3d(0,0,0) scale(0.95); }
            50%      { transform: translate3d(7vw, -9vh, 0) scale(1.2); }
          }
          @keyframes respiraHalo {
            0%, 100% { opacity: 0.75; }
            50%      { opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .fondo-mancha, .fondo-halo { animation: none !important; }
          }
        `}
      </style>

      {/* Halo detras de la cabecera, del color de la marca. */}
      <div
        className="fondo-halo absolute inset-x-0 top-0 h-[460px]"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, rgba(0,163,255,0.16) 0%, rgba(0,163,255,0.04) 45%, transparent 75%)',
          animation: 'respiraHalo 12s ease-in-out infinite',
        }}
      />

      {MANCHAS.map((m, i) => (
        <div
          key={i}
          className="fondo-mancha absolute rounded-full"
          style={{
            width: m.tamano,
            height: m.tamano,
            left: m.left,
            top: m.top,
            background: `radial-gradient(circle at 50% 50%, ${m.color} 0%, transparent 68%)`,
            filter: 'blur(28px)',
            animation: m.animacion,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

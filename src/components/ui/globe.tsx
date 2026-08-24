'use client'

// Globo terraqueo animado.
//
// Adaptado del componente original para poder incrustarlo: el original fijaba
// `h-screen` y un tamano de 250 px, lo que solo sirve si ocupa la pantalla
// entera. Aqui el tamano es una prop y el contenedor no impone alto, asi que
// el sitio de llamada decide donde va.
//
// Dos cambios mas respecto al original:
//  · Las estrellas estaban dentro del circulo, que lleva overflow-hidden: las
//    posicionadas en left-[350px] o top-[-50px] quedaban recortadas y no se
//    veian nunca. Ahora viven en el contenedor exterior, alrededor del globo.
//  · Se respeta prefers-reduced-motion. Un disco girando sin parar delante de
//    un formulario es justo lo que esa preferencia existe para apagar.

import React, { useRef, useState } from 'react'

const TEXTURA = 'https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg'

/** Cuanto se inclina como maximo, en grados. Mas que esto se ve caricaturesco. */
const INCLINACION_MAX = 14

/** Posicion de cada estrella en porcentaje del contenedor, y su parpadeo. */
const ESTRELLAS = [
  { left: '-8%', top: '18%', duracion: '3s' },
  { left: '-14%', top: '62%', duracion: '2s' },
  { left: '104%', top: '34%', duracion: '4s' },
  { left: '82%', top: '104%', duracion: '3s' },
  { left: '18%', top: '108%', duracion: '1.5s' },
  { left: '92%', top: '-10%', duracion: '4s' },
  { left: '110%', top: '78%', duracion: '2s' },
] as const

export default function Globe({
  size = 250,
  className = '',
  seguirCursor = false,
}: {
  /** Diametro del globo en pixeles. */
  size?: number
  className?: string
  /** Inclina el globo hacia el cursor mientras esta encima. */
  seguirCursor?: boolean
}) {
  const [giro, setGiro] = useState({ x: 0, y: 0 })
  const cajaRef = useRef<HTMLDivElement>(null)

  // Misma idea que las tarjetas 3D: se mide la posicion del puntero dentro de
  // la caja y se convierte en rotacion. La diferencia es que aqui se normaliza
  // a un maximo fijo, para que el efecto no dependa del tamano del globo.
  const alMover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!seguirCursor) return
    const caja = cajaRef.current?.getBoundingClientRect()
    if (!caja) return
    const dx = (e.clientX - (caja.left + caja.width / 2)) / (caja.width / 2)
    const dy = (e.clientY - (caja.top + caja.height / 2)) / (caja.height / 2)
    setGiro({ x: -dy * INCLINACION_MAX, y: dx * INCLINACION_MAX })
  }

  const alSalir = () => seguirCursor && setGiro({ x: 0, y: 0 })

  return (
    <>
      <style>
        {`
          @keyframes globeRotate {
            0% { background-position: 0 0; }
            100% { background-position: ${size * 1.6}px 0; }
          }
          @keyframes globeTwinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .globo-animado, .globo-estrella { animation: none !important; }
          }
        `}
      </style>

      <div
        ref={cajaRef}
        className={`relative ${className}`}
        style={{ width: size, height: size, perspective: size * 4 }}
        onPointerMove={alMover}
        onPointerLeave={alSalir}
        aria-hidden
      >
        <div
          className="h-full w-full transition-transform duration-200 ease-out"
          style={{ transform: `rotateX(${giro.x}deg) rotateY(${giro.y}deg)` }}
        >
        <div
          className="globo-animado h-full w-full rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2),-5px_0_8px_#c3f4ff_inset,15px_2px_25px_#000_inset,-24px_-2px_34px_#c3f4ff99_inset,250px_0_44px_#00000066_inset,150px_0_38px_#000000aa_inset]"
          style={{
            backgroundImage: `url('${TEXTURA}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'left',
            animation: 'globeRotate 30s linear infinite',
          }}
          />
        </div>

        {/* Las estrellas quedan fuera del bloque que se inclina: son el fondo,
            no parte del planeta. */}
        {ESTRELLAS.map((e, i) => (
          <span
            key={i}
            className="globo-estrella absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: e.left,
              top: e.top,
              animation: `globeTwinkle ${e.duracion} infinite`,
            }}
          />
        ))}
      </div>
    </>
  )
}

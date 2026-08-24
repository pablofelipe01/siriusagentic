'use client'

// Lienzo de firma manuscrita.
//
// Decisiones que importan:
//  · Pointer Events (no mouse + touch por separado): un solo camino de codigo
//    cubre dedo, lapiz y raton, y setPointerCapture evita que el trazo se corte
//    si el dedo se sale del recuadro.
//  · El canvas se dimensiona en pixeles fisicos (devicePixelRatio) y se escala
//    por CSS. Sin esto la firma se ve pixelada en cualquier celular moderno.
//  · touch-action: none sobre el lienzo: si no, el navegador interpreta el
//    trazo como scroll y firmar se vuelve imposible en movil.
//  · En pantalla el trazo va en blanco, para que se vea sobre el formulario
//    oscuro; al exportar se invierte a negro sobre fondo blanco, que es como
//    hay que leer una firma en Airtable, en un PDF o impresa.

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Eraser, PenLine } from 'lucide-react'

const ALTO = 190

export default function CanvasFirma({
  onChange,
  etiqueta = 'Firma aquí con el dedo o el mouse',
}: {
  /** Devuelve el PNG en data URL, o '' cuando el lienzo esta vacio. */
  onChange: (dataUrl: string) => void
  etiqueta?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dibujando = useRef(false)
  const ultimo = useRef<{ x: number; y: number } | null>(null)
  const [tieneTrazo, setTieneTrazo] = useState(false)

  /** Ajusta el buffer del canvas al tamano real en pantalla, conservando lo dibujado. */
  const ajustarTamano = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = window.devicePixelRatio || 1
    const ancho = canvas.clientWidth
    if (!ancho) return

    const previo = tieneTrazo ? canvas.toDataURL('image/png') : null

    canvas.width = Math.round(ancho * ratio)
    canvas.height = Math.round(ALTO * ratio)

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#E8EEF4'

    if (previo) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, ancho, ALTO)
      img.src = previo
    }
  }, [tieneTrazo])

  useEffect(() => {
    ajustarTamano()
    const canvas = canvasRef.current
    if (!canvas || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => ajustarTamano())
    ro.observe(canvas)
    return () => ro.disconnect()
    // Solo al montar: reajustar en cada cambio de estado borraria el trazo en curso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const punto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const inicio = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dibujando.current = true
    ultimo.current = punto(e)
  }

  const mover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujando.current) return
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    const desde = ultimo.current
    if (!ctx || !desde) return

    const hasta = punto(e)
    ctx.beginPath()
    ctx.moveTo(desde.x, desde.y)
    ctx.lineTo(hasta.x, hasta.y)
    ctx.stroke()
    ultimo.current = hasta
    if (!tieneTrazo) setTieneTrazo(true)
  }

  const fin = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujando.current) return
    dibujando.current = false
    ultimo.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    onChange(exportar())
  }

  /** PNG con fondo blanco: asi la firma se lee en Airtable, en un PDF o impresa. */
  const exportar = (): string => {
    const canvas = canvasRef.current
    if (!canvas) return ''

    const plano = document.createElement('canvas')
    plano.width = canvas.width
    plano.height = canvas.height
    const ctx = plano.getContext('2d')
    if (!ctx) return ''

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, plano.width, plano.height)
    // El trazo se guarda en negro sobre blanco, no en el blanco de la pantalla.
    ctx.globalCompositeOperation = 'difference'
    ctx.drawImage(canvas, 0, 0)
    return plano.toDataURL('image/png')
  }

  const limpiar = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setTieneTrazo(false)
    onChange('')
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-white/[0.12] bg-white/[0.03]">
        <canvas
          ref={canvasRef}
          style={{ height: ALTO, touchAction: 'none' }}
          className="block w-full cursor-crosshair"
          onPointerDown={inicio}
          onPointerMove={mover}
          onPointerUp={fin}
          onPointerCancel={fin}
          onPointerLeave={fin}
        />

        {/* Linea de firma y ayuda: se apagan en cuanto empieza el trazo. */}
        {!tieneTrazo && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center pb-7">
            <div className="mb-3 h-px w-[72%] bg-white/15" />
            <span className="flex items-center gap-1.5 text-[12px] text-[#4A6076]">
              <PenLine className="h-3.5 w-3.5" />
              {etiqueta}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[12px] text-[#4A6076]">
          {tieneTrazo ? 'Firma capturada' : 'Sin firmar'}
        </span>
        <button
          type="button"
          onClick={limpiar}
          disabled={!tieneTrazo}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-[12px] text-[#8FA3B5] transition-colors hover:text-[#E8EEF4] disabled:opacity-40 disabled:hover:text-[#8FA3B5]"
        >
          <Eraser className="h-3.5 w-3.5" />
          Borrar y volver a firmar
        </button>
      </div>
    </div>
  )
}

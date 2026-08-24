'use client'

// Formulario de asistencia al evento del Colegio Francisco Walter.
//
// Criterios de diseno:
//  · Sin navbar. Es una pagina de destino unica: cualquier navegacion que no
//    sea "llenar y enviar" solo distrae y baja la tasa de registro.
//  · Cabecera con identidad grande (logo a 56-72 px) sobre un halo azul, para
//    que se lea como una pieza institucional de Sirius y no como un formulario
//    generico. El resto de la pagina es sobrio a proposito.
//  · El cuestionario va en una tarjeta con secciones numeradas: seis campos
//    sueltos se sienten mas largos que seis campos agrupados en tres bloques.
//  · Firma y autorizacion de datos cierran el formulario, en ese orden: se
//    firma lo que ya se leyo.

import React, { useState } from 'react'
import { Check, ChevronDown, Loader2, ShieldCheck, Sprout } from 'lucide-react'
import CanvasFirma from '@/components/eventos/CanvasFirma'
import Globe from '@/components/ui/globe'
import FondoAnimado from '@/components/eventos/FondoAnimado'
import EfectoAgua from '@/components/eventos/EfectoAgua'
import { EVENTO, TIPOS_DOCUMENTO, GRADOS, POLITICA } from '@/lib/eventos/config'

const FUENTE = 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'

const CAMPO =
  'w-full rounded-lg border border-white/[0.10] bg-white/[0.03] px-4 py-3.5 text-[15px] text-[#E8EEF4] placeholder:text-[#41586E] outline-none transition-colors focus:border-[#00A3FF]/70 focus:bg-white/[0.05]'

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function FormularioAsistencia() {
  const [nombre, setNombre] = useState('')
  const [tipoDocumento, setTipoDocumento] = useState<string>('TI')
  const [documento, setDocumento] = useState('')
  const [grado, setGrado] = useState('')
  const [correo, setCorreo] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [firma, setFirma] = useState('')
  const [autoriza, setAutoriza] = useState(false)

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codigo, setCodigo] = useState<string | null>(null)

  const primerNombre = (() => {
    const primera = nombre.trim().split(/\s+/)[0] ?? ''
    return primera ? primera.charAt(0).toUpperCase() + primera.slice(1).toLowerCase() : ''
  })()

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (enviando) return
    setError(null)

    // Validacion en el cliente solo para dar un mensaje inmediato: la ruta de
    // API vuelve a validar todo, porque este formulario es publico.
    if (nombre.trim().split(/\s+/).length < 2) return setError('Escribe tu nombre y apellido.')
    if (documento.replace(/\D/g, '').length < 5) return setError('Revisa tu número de documento.')
    if (!grado) return setError('Selecciona tu grado.')
    // Correo y WhatsApp son opcionales: solo se valida el formato de lo que
    // efectivamente se escribio, para no bloquear a quien no tiene correo.
    if (correo.trim() && !CORREO_RE.test(correo.trim()))
      return setError('Revisa tu correo electrónico o déjalo vacío.')
    if (whatsapp.trim() && whatsapp.replace(/\D/g, '').length < 7)
      return setError('Revisa tu número de WhatsApp o déjalo vacío.')
    if (!firma) return setError('Falta tu firma. Dibújala en el recuadro.')
    if (!autoriza) return setError('Debes autorizar el tratamiento de tus datos para registrarte.')

    setEnviando(true)
    try {
      const res = await fetch('/api/eventos/asistencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          tipoDocumento,
          documento,
          grado,
          correo,
          whatsapp,
          firma,
          autoriza,
        }),
      })
      const data = (await res.json()) as { success: boolean; id?: string; error?: string }
      if (!res.ok || !data.success) {
        setError(data.error ?? 'No se pudo guardar tu registro.')
        return
      }
      setCodigo(data.id ?? 'Registrado')
    } catch {
      setError('No hay conexión. Revisa tu internet e intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  if (codigo) {
    return (
      <Pantalla>
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#00A3FF]/25 bg-gradient-to-b from-[#00A3FF]/[0.10] to-transparent">
          <div className="px-7 py-10 text-center sm:px-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#00A3FF]">
              <Check className="h-6 w-6 text-[#070B12]" strokeWidth={3} />
            </span>
            <h2 className="mt-6 text-[22px] font-semibold tracking-[-0.01em] text-white">
              Asistencia registrada con éxito
            </h2>
            <p className="mx-auto mt-3.5 max-w-[44ch] text-[15px] leading-relaxed text-[#B9C7D4]">
              Gracias, {primerNombre}.
            </p>
          </div>
        </div>
      </Pantalla>
    )
  }

  return (
    <Pantalla>
      <form
        onSubmit={enviar}
        className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.015] px-5 py-2 sm:px-8"
      >
        <Seccion indice={1} titulo="Datos del estudiante">
          <Campo etiqueta="Nombre y apellidos">
            <input
              className={CAMPO}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Como aparece en tu documento"
              autoComplete="name"
              autoCapitalize="words"
            />
          </Campo>

          <Campo etiqueta="Documento de identidad">
            {/* Grid y no flex: la columna del numero es minmax(0,1fr), asi el
                desplegable nunca se come el ancho del input en un celular
                angosto. El select va con appearance-none y flecha propia, que
                ocupa bastante menos que la nativa. */}
            <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2.5">
              <div className="relative">
                <select
                  className={`${CAMPO} w-full appearance-none px-3 pr-7 text-[14px]`}
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  aria-label="Tipo de documento"
                >
                  {TIPOS_DOCUMENTO.map((t) => (
                    <option key={t} value={t} className="bg-[#0B111B]">
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4A6076]" />
              </div>
              <input
                className={`${CAMPO} min-w-0`}
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="Número de documento"
                inputMode="numeric"
              />
            </div>
          </Campo>

          <Campo etiqueta="Grado">
            <Segmentado opciones={GRADOS} valor={grado} onChange={setGrado} />
          </Campo>
        </Seccion>

        <Seccion
          indice={2}
          titulo="Contacto"
          descripcion="Opcional. Si nos dejas un dato, por ahí te confirmamos el cupo."
        >
          <Campo etiqueta="Correo electrónico" opcional>
            <input
              className={CAMPO}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
            />
          </Campo>

          <Campo etiqueta="WhatsApp" opcional>
            <input
              className={CAMPO}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="300 123 4567"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
            />
          </Campo>
        </Seccion>

        <Seccion
          indice={3}
          titulo="Firma"
          descripcion="Tu firma queda asociada a la autorización del punto 4."
        >
          <CanvasFirma onChange={setFirma} />
        </Seccion>

        <Seccion indice={4} titulo="Tratamiento de datos personales">
          <div className="rounded-lg border border-white/[0.09] bg-white/[0.02] p-5">
            <p className="flex items-center gap-2 text-[13px] font-medium text-[#B9C7D4]">
              <ShieldCheck className="h-4 w-4 text-[#00A3FF]" />
              Autorización — {POLITICA.version}
            </p>
            <p className="mt-3.5 text-[13px] leading-relaxed text-[#8FA3B5]">{POLITICA.aviso}</p>
            <a
              href={POLITICA.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[12px] text-[#00A3FF] underline underline-offset-2 hover:opacity-80"
            >
              Leer la política completa de tratamiento de datos de Sirius
            </a>
          </div>

          <label
            className={`mt-4 flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-4 transition-all duration-150 ${
              autoriza
                ? 'border-[#00A3FF]/70 bg-[#00A3FF]/[0.09]'
                : 'border-white/[0.10] bg-white/[0.02] hover:border-white/25'
            }`}
          >
            <input
              type="checkbox"
              checked={autoriza}
              onChange={(e) => setAutoriza(e.target.checked)}
              className="sr-only"
            />
            <span
              className={`mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                autoriza ? 'border-[#00A3FF] bg-[#00A3FF]' : 'border-white/25'
              }`}
            >
              {autoriza && <Check className="h-3 w-3 text-[#070B12]" strokeWidth={3.5} />}
            </span>
            <span className="text-[14px] leading-relaxed text-[#E8EEF4]">
              He leído y autorizo el tratamiento de mis datos personales y de mi firma en los
              términos descritos arriba.
            </span>
          </label>
        </Seccion>

        <div className="border-t border-white/[0.07] py-8">
          {error && (
            <p className="mb-4 rounded-lg border border-red-400/25 bg-red-400/[0.07] px-4 py-3.5 text-[13px] text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00A3FF] px-5 py-4 text-[15px] font-semibold text-[#070B12] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {enviando && <Loader2 className="h-4 w-4 animate-spin" />}
            {enviando ? 'Guardando...' : 'Registrar mi asistencia'}
          </button>

          <p className="mt-4 text-center text-[12px] leading-relaxed text-[#41586E]">
            Tus datos se usan únicamente para organizar la asistencia a esta jornada.
          </p>
        </div>
      </form>
    </Pantalla>
  )
}

// ── Estructura de la pagina ──────────────────────────────────────────────────

function Pantalla({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#070B12] text-[#E8EEF4]"
      style={{ fontFamily: FUENTE }}
    >
      {/* Capas decorativas, ambas por debajo del contenido y sin capturar
          eventos: el formulario se sigue usando exactamente igual. */}
      <FondoAnimado />
      <EfectoAgua />

      <main className="relative z-10 mx-auto w-full max-w-xl px-5 pb-24 pt-14 sm:pt-20">
        <header className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Sirius Regenerative Solutions"
            className="mx-auto h-14 w-auto object-contain sm:h-[72px]"
          />

          {/* Decorativo: la jornada va de suelos y restauracion, y el globo da
              ese contexto sin gastarle una linea de texto al estudiante. */}
          <div className="mt-10 flex justify-center">
            <Globe size={190} seguirCursor />
          </div>

          <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.22em] text-[#00A3FF]">
            Registro de asistencia
          </p>
          <p className="mt-3 text-[13px] text-[#8FA3B5]">{EVENTO.institucion}</p>
          <h1 className="mt-4 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] sm:text-[36px]">
            {EVENTO.nombre}
          </h1>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-relaxed text-[#8FA3B5]">
            {EVENTO.descripcion}
          </p>
        </header>

        {/* Proposito de la actividad: el estudiante decide si viene sabiendo a
            que viene, no solo cuando y donde. */}
        <div className="mt-9 flex gap-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-left">
          <Sprout className="mt-[3px] h-4 w-4 shrink-0 text-[#00A3FF]" />
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#B9C7D4]">
              De qué se trata
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#8FA3B5]">{EVENTO.proposito}</p>
          </div>
        </div>

        {children}

        <footer className="mt-10 text-center text-[11px] leading-relaxed text-[#2E4256]">
          Sirius Regenerative Solutions S.A.S. ZOMAC
        </footer>
      </main>
    </div>
  )
}

function Seccion({
  indice,
  titulo,
  descripcion,
  children,
}: {
  indice: number
  titulo: string
  descripcion?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-white/[0.07] py-8 first:pt-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] text-[#00A3FF]">
          {String(indice).padStart(2, '0')}
        </span>
        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8EEF4]">
            {titulo}
          </h2>
          {descripcion && <p className="mt-1.5 text-[13px] text-[#8FA3B5]">{descripcion}</p>}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </section>
  )
}

function Campo({
  etiqueta,
  opcional,
  children,
}: {
  etiqueta: string
  opcional?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline gap-2">
        <span className="text-[13px] font-medium text-[#B9C7D4]">{etiqueta}</span>
        {opcional && (
          <span className="text-[11px] uppercase tracking-[0.08em] text-[#41586E]">opcional</span>
        )}
      </span>
      {children}
    </label>
  )
}

function Segmentado({
  opciones,
  valor,
  onChange,
}: {
  opciones: readonly string[]
  valor: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-2">
      {opciones.map((opt) => {
        const activo = valor === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 rounded-lg border py-3 text-[15px] transition-all duration-150 ${
              activo
                ? 'border-[#00A3FF]/70 bg-[#00A3FF]/[0.12] font-semibold text-white'
                : 'border-white/[0.10] bg-white/[0.03] text-[#B9C7D4] hover:border-white/25'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

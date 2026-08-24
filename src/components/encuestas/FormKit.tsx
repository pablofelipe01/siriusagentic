'use client'

// src/components/encuestas/FormKit.tsx
//
// Sistema visual de las tres encuestas de tecnología.
//
// Criterios de diseño:
//  · Paleta de la marca Sirius (#00A3FF sobre fondo azul-noche), no un acento
//    genérico. Las encuestas se ven como parte del sitio, no como un formulario
//    pegado encima.
//  · Estructura editorial: barra superior fija con progreso, secciones
//    numeradas y preguntas con numeración monoespaciada. Un cuestionario de 14
//    preguntas sin jerarquía visual se siente el doble de largo.
//  · Controles sobrios: sin estrellas ni emojis. La escala 1-5 es un control
//    segmentado con las etiquetas de los extremos siempre visibles.

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'

const FUENTE = 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'

// ── Contenedor de página ─────────────────────────────────────────────────────

export function SurveyShell({
  titulo,
  intro,
  paso,
  progreso,
  children,
}: {
  titulo: string
  intro: string
  paso: string
  /** Preguntas respondidas sobre el total visible, para la barra de progreso. */
  progreso?: { respondidas: number; total: number }
  children: React.ReactNode
}) {
  const pct =
    progreso && progreso.total > 0
      ? Math.round((progreso.respondidas / progreso.total) * 100)
      : 0

  return (
    <div className="min-h-screen bg-[#070B12] text-[#E8EEF4]" style={{ fontFamily: FUENTE }}>
      {/* Barra superior fija: identidad + avance */}
      <div className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#070B12]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link href="/encuestas" className="flex min-w-0 items-center gap-3">
            <img src="/logo.png" alt="Sirius" className="h-6 w-auto object-contain sm:h-7" />
            <span className="hidden truncate text-xs text-[#8FA3B5] sm:inline">
              Dirección de Tecnología
            </span>
          </Link>
          {progreso && (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs tabular-nums text-[#8FA3B5] sm:inline">
                {progreso.respondidas} de {progreso.total}
              </span>
              <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10 sm:w-32">
                <div
                  className="h-full rounded-full bg-[#00A3FF] transition-[width] duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
        <Link
          href="/encuestas"
          className="inline-flex items-center gap-1.5 text-xs text-[#8FA3B5] transition-colors hover:text-[#E8EEF4]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Todas las encuestas
        </Link>

        <header className="mt-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#00A3FF]">
            {paso}
          </p>
          <h1 className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[38px]">
            {titulo}
          </h1>
          <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-[#8FA3B5]">{intro}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Etiqueta>Requiere nombre y área</Etiqueta>
            <Etiqueta>Uso interno de la Dirección de Tecnología</Etiqueta>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 text-[11px] text-[#8FA3B5]">
      {children}
    </span>
  )
}

// ── Sección del cuestionario ─────────────────────────────────────────────────

export function Section({
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
    <section className="mt-14 first:mt-12">
      <div className="flex items-baseline gap-3 border-b border-white/[0.09] pb-4">
        <span className="font-mono text-xs text-[#00A3FF]">
          {String(indice).padStart(2, '0')}
        </span>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#E8EEF4]">
            {titulo}
          </h2>
          {descripcion && <p className="mt-1.5 text-[13px] text-[#8FA3B5]">{descripcion}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

// ── Pregunta ─────────────────────────────────────────────────────────────────

export function Question({
  numero,
  enunciado,
  ayuda,
  obligatoria,
  children,
}: {
  numero: string
  enunciado: string
  ayuda?: string
  obligatoria?: boolean
  children: React.ReactNode
}) {
  return (
    <fieldset className="border-b border-white/[0.06] py-9 last:border-b-0">
      <legend className="sr-only">{`${numero}. ${enunciado}`}</legend>
      <div className="flex gap-4 sm:gap-5">
        <span className="mt-[3px] w-6 shrink-0 font-mono text-[13px] text-[#4A6076] sm:w-7">
          {numero}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-snug text-[#E8EEF4] sm:text-base">
            {enunciado}
            {obligatoria && (
              <span className="ml-1.5 align-middle text-[10px] uppercase tracking-wider text-[#00A3FF]">
                requerida
              </span>
            )}
          </p>
          {ayuda && (
            <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-[#8FA3B5]">{ayuda}</p>
          )}
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </fieldset>
  )
}

// ── Estilos compartidos de opción ────────────────────────────────────────────

const OPCION_BASE =
  'group relative flex items-center gap-3 rounded-md border px-4 py-3 text-[14px] transition-all duration-150'
const OPCION_INACTIVA =
  'cursor-pointer border-white/[0.09] bg-white/[0.02] text-[#B9C7D4] hover:border-white/25 hover:bg-white/[0.045]'
const OPCION_ACTIVA =
  'cursor-pointer border-[#00A3FF]/70 bg-[#00A3FF]/[0.09] text-white shadow-[inset_2px_0_0_0_#00A3FF]'
const OPCION_BLOQUEADA =
  'cursor-not-allowed border-white/[0.05] bg-white/[0.015] text-[#4A6076]'

// ── Selección única ──────────────────────────────────────────────────────────

export function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {options.map((opt) => {
        const activo = value === opt
        return (
          <label key={opt} className={`${OPCION_BASE} ${activo ? OPCION_ACTIVA : OPCION_INACTIVA}`}>
            <input
              type="radio"
              name={name}
              checked={activo}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            <span
              className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                activo ? 'border-[#00A3FF]' : 'border-white/25 group-hover:border-white/40'
              }`}
            >
              {activo && <span className="h-[7px] w-[7px] rounded-full bg-[#00A3FF]" />}
            </span>
            {opt}
          </label>
        )
      })}
    </div>
  )
}

// ── Selección múltiple ───────────────────────────────────────────────────────

export function CheckboxGroup({
  options,
  values,
  onChange,
  max,
  exclusiva,
}: {
  options: readonly string[]
  values: string[]
  onChange: (v: string[]) => void
  /** Tope de selecciones, si la pregunta lo impone (ej. "elige hasta 2"). */
  max?: number
  /** Opción que anula a las demás (ej. "Ninguna de las anteriores"). */
  exclusiva?: string
}) {
  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt))
      return
    }
    if (exclusiva && opt === exclusiva) {
      onChange([opt])
      return
    }
    const base = exclusiva ? values.filter((v) => v !== exclusiva) : values
    if (max && base.length >= max) return
    onChange([...base, opt])
  }

  const tope = max !== undefined && values.length >= max

  return (
    <div className="flex flex-col gap-1.5">
      {options.map((opt) => {
        const activo = values.includes(opt)
        const bloqueado = tope && !activo && !(exclusiva && opt === exclusiva)
        return (
          <label
            key={opt}
            className={`${OPCION_BASE} ${
              activo ? OPCION_ACTIVA : bloqueado ? OPCION_BLOQUEADA : OPCION_INACTIVA
            }`}
          >
            <input
              type="checkbox"
              checked={activo}
              disabled={bloqueado}
              onChange={() => toggle(opt)}
              className="sr-only"
            />
            <span
              className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                activo
                  ? 'border-[#00A3FF] bg-[#00A3FF]'
                  : bloqueado
                    ? 'border-white/10'
                    : 'border-white/25 group-hover:border-white/40'
              }`}
            >
              {activo && <Check className="h-2.5 w-2.5 text-[#070B12]" strokeWidth={3.5} />}
            </span>
            {opt}
          </label>
        )
      })}
      {max !== undefined && (
        <p className="mt-1.5 text-[12px] tabular-nums text-[#4A6076]">
          {values.length} de {max} seleccionadas
        </p>
      )}
    </div>
  )
}

// ── Escala 1-5 (control segmentado) ──────────────────────────────────────────

export function RatingInput({
  value,
  onChange,
  etiquetaBaja,
  etiquetaAlta,
}: {
  value: number | null
  onChange: (v: number) => void
  etiquetaBaja: string
  etiquetaAlta: string
}) {
  return (
    <div>
      <div className="flex overflow-hidden rounded-md border border-white/[0.09]">
        {[1, 2, 3, 4, 5].map((n) => {
          const activo = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${n} de 5`}
              aria-pressed={activo}
              className={`flex-1 border-r border-white/[0.09] py-3.5 text-[15px] font-medium tabular-nums transition-colors last:border-r-0 ${
                activo
                  ? 'bg-[#00A3FF] text-[#070B12]'
                  : 'bg-white/[0.02] text-[#8FA3B5] hover:bg-white/[0.06] hover:text-[#E8EEF4]'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between gap-4 text-[12px] text-[#4A6076]">
        <span>1 · {etiquetaBaja}</span>
        <span className="text-right">5 · {etiquetaAlta}</span>
      </div>
    </div>
  )
}

// ── Texto ────────────────────────────────────────────────────────────────────

const CAMPO_TEXTO =
  'w-full rounded-md border border-white/[0.09] bg-white/[0.02] px-4 py-3 text-[14px] text-[#E8EEF4] transition-colors placeholder:text-[#3E5266] focus:border-[#00A3FF]/60 focus:bg-white/[0.04] focus:outline-none'

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength = 2000,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`${CAMPO_TEXTO} resize-y leading-relaxed`}
      />
      {value.length > maxLength * 0.75 && (
        <p className="mt-1.5 text-right text-[12px] tabular-nums text-[#4A6076]">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  maxLength = 200,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={CAMPO_TEXTO}
    />
  )
}

// ── Identificación ───────────────────────────────────────────────────────────
//
// Reemplaza al antiguo "código de participante": desde que la encuesta pide el
// nombre, un código anónimo no aporta nada para cruzar las tres respuestas.

export function Identificacion({
  nombre,
  onNombre,
  area,
  onArea,
  areas,
}: {
  nombre: string
  onNombre: (v: string) => void
  area: string
  onArea: (v: string) => void
  areas: readonly string[]
}) {
  return (
    <>
      <Question
        numero="—"
        enunciado="¿Cuál es tu nombre?"
        ayuda="Nombre y apellido. Permite cruzar tus respuestas entre las tres encuestas y hacer seguimiento contigo si algo de lo que escribes necesita más contexto."
        obligatoria
      >
        <div className="max-w-md">
          <TextInput
            value={nombre}
            onChange={onNombre}
            placeholder="Ej. David Hernández"
            maxLength={120}
          />
        </div>
      </Question>

      <Question numero="—" enunciado="¿En qué área trabajas?" obligatoria>
        <RadioGroup name="area" options={areas} value={area} onChange={onArea} />
      </Question>
    </>
  )
}

// ── Envío ────────────────────────────────────────────────────────────────────

export function SubmitBar({
  enviando,
  error,
  texto = 'Enviar respuesta',
}: {
  enviando: boolean
  error: string | null
  texto?: string
}) {
  return (
    <div className="mt-12 border-t border-white/[0.09] pt-8">
      {error && (
        <p className="mb-5 rounded-md border border-[#FF5A5A]/30 bg-[#FF5A5A]/[0.08] px-4 py-3 text-[13px] text-[#FFB3B3]">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={enviando}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#00A3FF] px-7 py-3.5 text-[14px] font-semibold text-[#04121E] transition-colors hover:bg-[#3AB8FF] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {enviando && <Loader2 className="h-4 w-4 animate-spin" />}
          {enviando ? 'Guardando…' : texto}
        </button>
      </div>
    </div>
  )
}

// ── Confirmación ─────────────────────────────────────────────────────────────

export function Gracias({
  id,
  siguiente,
}: {
  id: string
  siguiente?: { href: string; texto: string }
}) {
  return (
    <div className="mt-12 rounded-lg border border-white/[0.09] bg-white/[0.02] p-8 sm:p-10">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00A3FF]/15">
        <Check className="h-4 w-4 text-[#00A3FF]" strokeWidth={2.5} />
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-[-0.01em]">Respuesta registrada</h2>
      <p className="mt-2.5 max-w-[52ch] text-[14px] leading-relaxed text-[#8FA3B5]">
        Quedó guardada como <span className="font-mono text-[#00A3FF]">{id}</span>. Gracias por el
        tiempo: esto es lo que decide en qué herramientas invierte Sirius.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {siguiente && (
          <Link
            href={siguiente.href}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#00A3FF] px-6 py-3 text-[14px] font-semibold text-[#04121E] transition-colors hover:bg-[#3AB8FF]"
          >
            {siguiente.texto}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        <Link
          href="/encuestas"
          className="inline-flex items-center justify-center rounded-md border border-white/[0.12] px-6 py-3 text-[14px] text-[#B9C7D4] transition-colors hover:border-white/30 hover:text-white"
        >
          Volver a las encuestas
        </Link>
      </div>
    </div>
  )
}

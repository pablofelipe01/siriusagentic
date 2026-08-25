'use client'

// src/components/encuestas/Dashboard.tsx
//
// Dashboard de resultados de las tres encuestas de tecnología. Vive dentro de
// /encuestas, debajo de los enlaces a los formularios.
//
// Criterios de diseño:
//  · Misma paleta y tipografía que FormKit: el dashboard es la otra cara de la
//    encuesta, no un panel aparte.
//  · Barras horizontales en CSS, sin librería de gráficas. Las distribuciones
//    son de 2 a 7 categorías con etiquetas largas en español: una barra
//    horizontal con la etiqueta a la izquierda se lee mejor que un pastel y no
//    añade 100 kB de JavaScript.
//  · Toda barra muestra su conteo. Las opciones con cero respuestas se dibujan
//    igual: "nadie eligió esto" es un hallazgo, no un hueco.
//  · Las respuestas de texto van con nombre y área, dentro de un bloque
//    plegable: son lo más valioso y lo más largo, así que no compiten con las
//    métricas por el espacio visible.

import { useCallback, useEffect, useState } from 'react'
import {
  BarChart3,
  ChevronDown,
  Loader2,
  RefreshCw,
  Users,
  Check,
  Minus,
} from 'lucide-react'

// ── Tipos del payload de /api/encuestas/resultados ───────────────────────────

type Barra = { opcion: string; n: number }
type Escala = { promedio: number | null; n: number; dist: Barra[] }
type Abierta = { nombre: string; area: string; texto: string }

type Participante = {
  nombre: string
  area: string
  claude: boolean
  alma: boolean
  herramientas: boolean
  completadas: number
  ultima: string | null
}

type Resultados = {
  totales: {
    personas: number
    claude: number
    alma: number
    herramientas: number
    lasTres: number
  }
  participantes: Participante[]
  porArea: {
    area: string
    personas: number
    claude: number
    alma: number
    herramientas: number
  }[]
  claude: {
    respuestas: number
    c1: Barra[]
    c2: Barra[]
    c3: Barra[]
    c5: Barra[]
    c6: Barra[]
    c7: Barra[]
    c9: Escala
    horas: { n: number; totalSemana: number; promedioSemana: number | null }
    abiertas: { c4: Abierta[]; c8: Abierta[]; c10: Abierta[] }
  }
  alma: {
    respuestas: number
    a1: Barra[]
    a2: Barra[]
    a3: Barra[]
    a4: Barra[]
    a6: Escala
    a7: Barra[]
    abiertas: { a5: Abierta[]; a8: Abierta[]; a9: Abierta[] }
  }
  herramientas: {
    respuestas: number
    sinApps: number
    apps: {
      nombre: string
      respuestas: number
      abandono: number
      activos: number
      valor: number | null
    }[]
    frecuenciaApps: Barra[]
    h4: Barra[]
    h6: Barra[]
    h8: Barra[]
    h9: Escala
    h10: Barra[]
    h12: Barra[]
    abiertas: {
      h5: Abierta[]
      h7: Abierta[]
      h11: Abierta[]
      h13: Abierta[]
      h14: Abierta[]
    }
  }
}

type Pestana = 'resumen' | 'participantes' | 'claude' | 'alma' | 'herramientas'

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: 'resumen', etiqueta: 'Resumen' },
  { id: 'participantes', etiqueta: 'Quién respondió' },
  { id: 'claude', etiqueta: 'Claude' },
  { id: 'alma', etiqueta: 'Alma' },
  { id: 'herramientas', etiqueta: 'Herramientas' },
]

// ── Piezas visuales ──────────────────────────────────────────────────────────

function Metrica({
  valor,
  etiqueta,
  nota,
}: {
  valor: string | number
  etiqueta: string
  nota?: string
}) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-4">
      <p className="text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-[#E8EEF4]">
        {valor}
      </p>
      <p className="mt-2 text-[12px] leading-snug text-[#8FA3B5]">{etiqueta}</p>
      {nota && <p className="mt-1 text-[11px] text-[#4A6076]">{nota}</p>}
    </div>
  )
}

function Bloque({
  titulo,
  pregunta,
  nota,
  children,
}: {
  titulo: string
  pregunta?: string
  nota?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-white/[0.07] pt-7">
      <h4 className="text-[14px] font-medium tracking-[-0.01em] text-[#E8EEF4]">
        {pregunta && <span className="mr-2 font-mono text-[12px] text-[#00A3FF]">{pregunta}</span>}
        {titulo}
      </h4>
      {nota && <p className="mt-1.5 text-[12px] leading-relaxed text-[#4A6076]">{nota}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

/**
 * Lista de barras horizontales. El ancho se calcula sobre el máximo de la
 * serie, no sobre el total: con distribuciones planas (4 opciones de ~25%) las
 * diferencias reales quedarían invisibles si todo midiera un cuarto de barra.
 * El porcentaje que se imprime sí es sobre el total de respuestas.
 */
function Barras({ datos, base }: { datos: Barra[]; base: number }) {
  const max = Math.max(1, ...datos.map((d) => d.n))

  return (
    <ul className="space-y-2">
      {datos.map(({ opcion, n }) => {
        const pct = base > 0 ? Math.round((n / base) * 100) : 0
        return (
          <li key={opcion} className="flex items-center gap-3">
            <span
              className={`w-[46%] shrink-0 truncate text-[13px] sm:w-[38%] ${
                n === 0 ? 'text-[#4A6076]' : 'text-[#B9C8D6]'
              }`}
              title={opcion}
            >
              {opcion}
            </span>
            <span className="h-[7px] min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
              <span
                className="block h-full rounded-full bg-[#00A3FF]/85"
                style={{ width: `${(n / max) * 100}%` }}
              />
            </span>
            <span className="w-[62px] shrink-0 text-right text-[12px] tabular-nums text-[#8FA3B5]">
              {n}
              <span className="ml-1 text-[#4A6076]">{pct}%</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function EscalaVista({ escala, extremos }: { escala: Escala; extremos: [string, string] }) {
  if (escala.n === 0) {
    return <p className="text-[13px] text-[#4A6076]">Sin respuestas todavía.</p>
  }
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-semibold leading-none tabular-nums text-[#00A3FF]">
          {escala.promedio?.toFixed(1)}
        </span>
        <span className="text-[13px] text-[#8FA3B5]">
          de 5 · {escala.n} {escala.n === 1 ? 'respuesta' : 'respuestas'}
        </span>
      </div>
      <div className="mt-4 flex items-end gap-1.5">
        {escala.dist.map(({ opcion, n }) => {
          const max = Math.max(1, ...escala.dist.map((d) => d.n))
          return (
            <div key={opcion} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] tabular-nums text-[#8FA3B5]">{n}</span>
              <span
                className="w-full rounded-t-sm bg-[#00A3FF]/80"
                style={{ height: `${8 + (n / max) * 56}px` }}
              />
              <span className="text-[11px] tabular-nums text-[#4A6076]">{opcion}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[#4A6076]">
        <span>1 · {extremos[0]}</span>
        <span>5 · {extremos[1]}</span>
      </div>
    </div>
  )
}

function Abiertas({
  titulo,
  pregunta,
  respuestas,
}: {
  titulo: string
  pregunta: string
  respuestas: Abierta[]
}) {
  if (respuestas.length === 0) return null

  return (
    <details className="group border-t border-white/[0.07]">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-[13px] text-[#B9C8D6] transition-colors hover:text-[#E8EEF4] [&::-webkit-details-marker]:hidden">
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#4A6076] transition-transform group-open:rotate-180" />
        <span className="mr-1 font-mono text-[12px] text-[#00A3FF]">{pregunta}</span>
        <span className="min-w-0 flex-1 truncate">{titulo}</span>
        <span className="shrink-0 text-[12px] tabular-nums text-[#4A6076]">
          {respuestas.length}
        </span>
      </summary>
      <ul className="space-y-3 pb-5 pl-[26px]">
        {respuestas.map((r, i) => (
          <li key={`${r.nombre}-${i}`} className="border-l border-white/[0.09] pl-4">
            <p className="whitespace-pre-line text-[13px] leading-relaxed text-[#B9C8D6]">
              {r.texto}
            </p>
            <p className="mt-1.5 text-[11px] text-[#4A6076]">
              {r.nombre}
              {r.area && ` · ${r.area}`}
            </p>
          </li>
        ))}
      </ul>
    </details>
  )
}

/** Marca de encuesta respondida / pendiente en la tabla de participantes. */
function Marca({ activo }: { activo: boolean }) {
  return activo ? (
    <Check className="mx-auto h-3.5 w-3.5 text-[#00A3FF]" strokeWidth={2.5} />
  ) : (
    <Minus className="mx-auto h-3.5 w-3.5 text-[#2C3C4C]" />
  )
}

// ── Pestañas ─────────────────────────────────────────────────────────────────

function Resumen({ d }: { d: Resultados }) {
  const { totales, porArea } = d
  const maxArea = Math.max(1, ...porArea.map((a) => a.personas))

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metrica valor={totales.personas} etiqueta="Personas que respondieron al menos una" />
        <Metrica
          valor={totales.lasTres}
          etiqueta="Respondieron las tres encuestas"
          nota={
            totales.personas > 0
              ? `${Math.round((totales.lasTres / totales.personas) * 100)}% de participantes`
              : undefined
          }
        />
        <Metrica
          valor={totales.claude + totales.alma + totales.herramientas}
          etiqueta="Respuestas registradas en total"
        />
        <Metrica
          valor={
            d.claude.horas.promedioSemana !== null
              ? `${d.claude.horas.promedioSemana} h`
              : '—'
          }
          etiqueta="Ahorro semanal promedio con Claude"
          nota={`${d.claude.horas.n} personas estimaron un rango`}
        />
      </div>

      <Bloque
        titulo="Respuestas por encuesta"
        nota="Cada encuesta se responde por separado; una persona puede haber contestado solo una."
      >
        <Barras
          datos={[
            { opcion: '01 · Uso de Claude', n: totales.claude },
            { opcion: '02 · Agente Alma', n: totales.alma },
            { opcion: '03 · Herramientas', n: totales.herramientas },
          ]}
          base={totales.personas}
        />
      </Bloque>

      <Bloque
        titulo="Participación por área"
        nota="El área es la de la respuesta más reciente de cada persona."
      >
        {porArea.length === 0 ? (
          <p className="text-[13px] text-[#4A6076]">Sin respuestas todavía.</p>
        ) : (
          <ul className="space-y-3">
            {porArea.map((a) => (
              <li key={a.area} className="flex items-center gap-3">
                <span
                  className="w-[46%] shrink-0 truncate text-[13px] text-[#B9C8D6] sm:w-[38%]"
                  title={a.area}
                >
                  {a.area}
                </span>
                <span className="h-[7px] min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <span
                    className="block h-full rounded-full bg-[#00A3FF]/85"
                    style={{ width: `${(a.personas / maxArea) * 100}%` }}
                  />
                </span>
                <span className="w-[92px] shrink-0 text-right text-[12px] tabular-nums text-[#8FA3B5]">
                  {a.personas}
                  <span className="ml-1.5 text-[#4A6076]">
                    {a.claude}/{a.alma}/{a.herramientas}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[11px] text-[#4A6076]">
          Personas · desglose Claude / Alma / Herramientas
        </p>
      </Bloque>

      <Bloque
        titulo="Escalas de satisfacción"
        nota="Promedios comparables entre las tres encuestas."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { etiqueta: 'Claude cubre lo que necesitas', e: d.claude.c9 },
            { etiqueta: 'Utilidad de Alma', e: d.alma.a6 },
            { etiqueta: 'Microsoft 365 resuelve tu trabajo', e: d.herramientas.h9 },
          ].map(({ etiqueta, e }) => (
            <div
              key={etiqueta}
              className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-4"
            >
              <p className="text-[24px] font-semibold leading-none tabular-nums text-[#00A3FF]">
                {e.promedio !== null ? e.promedio.toFixed(1) : '—'}
                <span className="ml-1 text-[13px] font-normal text-[#4A6076]">/5</span>
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[#8FA3B5]">{etiqueta}</p>
              <p className="mt-1 text-[11px] text-[#4A6076]">n = {e.n}</p>
            </div>
          ))}
        </div>
      </Bloque>
    </div>
  )
}

function Participantes({ d }: { d: Resultados }) {
  if (d.participantes.length === 0) {
    return <p className="text-[13px] text-[#4A6076]">Todavía nadie ha respondido.</p>
  }

  return (
    <div>
      <p className="text-[13px] leading-relaxed text-[#8FA3B5]">
        {d.participantes.length} {d.participantes.length === 1 ? 'persona' : 'personas'} han
        respondido. El cruce entre encuestas se hace por nombre, así que dos grafías distintas
        del mismo nombre aparecen como dos filas.
      </p>

      <div className="mt-5 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[540px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.12] text-[11px] uppercase tracking-[0.1em] text-[#4A6076]">
              <th className="pb-2.5 pr-3 font-medium">Nombre</th>
              <th className="pb-2.5 pr-3 font-medium">Área</th>
              <th className="pb-2.5 px-2 text-center font-medium">Claude</th>
              <th className="pb-2.5 px-2 text-center font-medium">Alma</th>
              <th className="pb-2.5 px-2 text-center font-medium">Herram.</th>
              <th className="pb-2.5 pl-3 text-right font-medium">Última</th>
            </tr>
          </thead>
          <tbody>
            {d.participantes.map((p) => (
              <tr
                key={p.nombre}
                className="border-b border-white/[0.05] transition-colors hover:bg-white/[0.02]"
              >
                <td className="py-3 pr-3 text-[13px] text-[#E8EEF4]">
                  {p.nombre}
                  {p.completadas === 3 && (
                    <span className="ml-2 rounded-sm bg-[#00A3FF]/12 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#00A3FF]">
                      3/3
                    </span>
                  )}
                </td>
                <td className="py-3 pr-3 text-[12px] text-[#8FA3B5]">{p.area || '—'}</td>
                <td className="px-2 py-3">
                  <Marca activo={p.claude} />
                </td>
                <td className="px-2 py-3">
                  <Marca activo={p.alma} />
                </td>
                <td className="px-2 py-3">
                  <Marca activo={p.herramientas} />
                </td>
                <td className="py-3 pl-3 text-right text-[12px] tabular-nums text-[#4A6076]">
                  {p.ultima ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function VistaClaude({ d }: { d: Resultados['claude'] }) {
  const n = d.respuestas
  if (n === 0) return <p className="text-[13px] text-[#4A6076]">Sin respuestas todavía.</p>

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metrica valor={n} etiqueta="Respuestas a la encuesta de Claude" />
        <Metrica
          valor={
            d.horas.promedioSemana !== null ? `${d.horas.promedioSemana} h` : '—'
          }
          etiqueta="Ahorro semanal promedio por persona"
        />
        <Metrica
          valor={`${d.horas.totalSemana} h`}
          etiqueta="Ahorro semanal declarado en total"
          nota={`${d.horas.n} de ${n} estimaron un rango`}
        />
        <Metrica
          valor={d.c9.promedio !== null ? `${d.c9.promedio}/5` : '—'}
          etiqueta="Qué tanto cubre lo que necesitan"
        />
      </div>

      <Bloque titulo="Frecuencia de uso" pregunta="C1">
        <Barras datos={d.c1} base={n} />
      </Bloque>

      <Bloque
        titulo="Para qué lo usan"
        pregunta="C2"
        nota="Selección múltiple: los porcentajes suman más de 100%."
      >
        <Barras datos={d.c2} base={n} />
      </Bloque>

      <Bloque titulo="Plan que tienen asignado" pregunta="C3">
        <Barras datos={d.c3} base={n} />
      </Bloque>

      <Bloque titulo="Funciones que conocen y usan" pregunta="C5" nota="Selección múltiple.">
        <Barras datos={d.c5} base={n} />
      </Bloque>

      <Bloque titulo="Horas que estiman ahorrar por semana" pregunta="C6">
        <Barras datos={d.c6} base={n} />
      </Bloque>

      <Bloque
        titulo="Qué los frena para usarlo más"
        pregunta="C7"
        nota="Hasta dos opciones por persona."
      >
        <Barras datos={d.c7} base={n} />
      </Bloque>

      <Bloque titulo="Qué tanto cubre lo que necesitan" pregunta="C9">
        <EscalaVista escala={d.c9} extremos={['Nada', 'Del todo']} />
      </Bloque>

      <div className="pt-1">
        <h4 className="text-[14px] font-medium text-[#E8EEF4]">Respuestas abiertas</h4>
        <div className="mt-3">
          <Abiertas pregunta="C4" titulo="La tarea concreta en que más ayuda" respuestas={d.abiertas.c4} />
          <Abiertas pregunta="C8" titulo="Qué le falta o qué mejorarían" respuestas={d.abiertas.c8} />
          <Abiertas
            pregunta="C10"
            titulo="Si recomendarían ampliar la inversión, y por qué"
            respuestas={d.abiertas.c10}
          />
        </div>
      </div>
    </div>
  )
}

function VistaAlma({ d }: { d: Resultados['alma'] }) {
  const n = d.respuestas
  if (n === 0) return <p className="text-[13px] text-[#4A6076]">Sin respuestas todavía.</p>

  const usan = d.a1.find((b) => b.opcion === 'Sí')?.n ?? 0
  const abandonaron =
    (d.a3.find((b) => b.opcion === 'La usé una vez y no volví')?.n ?? 0) +
    (d.a3.find((b) => b.opcion === 'Nunca la he usado')?.n ?? 0)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metrica valor={n} etiqueta="Respuestas a la encuesta de Alma" />
        <Metrica
          valor={usan}
          etiqueta="La han usado alguna vez"
          nota={`${Math.round((usan / n) * 100)}% de quienes respondieron`}
        />
        <Metrica valor={n - usan} etiqueta="Nunca la han usado" />
        <Metrica
          valor={d.a6.promedio !== null ? `${d.a6.promedio}/5` : '—'}
          etiqueta="Utilidad percibida"
          nota={`n = ${d.a6.n}`}
        />
      </div>

      <Bloque titulo="¿La han usado?" pregunta="A1">
        <Barras datos={d.a1} base={n} />
      </Bloque>

      <Bloque titulo="Cuándo la usaron por última vez" pregunta="A2">
        <Barras datos={d.a2} base={n} />
      </Bloque>

      <Bloque
        titulo="Frecuencia de uso"
        pregunta="A3"
        nota={`${abandonaron} personas la abandonaron o nunca la usaron.`}
      >
        <Barras datos={d.a3} base={n} />
      </Bloque>

      <Bloque titulo="Para qué la usan" pregunta="A4" nota="Selección múltiple.">
        <Barras datos={d.a4} base={n} />
      </Bloque>

      <Bloque titulo="Utilidad percibida" pregunta="A6">
        <EscalaVista escala={d.a6} extremos={['Nada útil', 'Muy útil']} />
      </Bloque>

      <Bloque
        titulo="Por qué no la usan más"
        pregunta="A7"
        nota="Hasta dos opciones por persona."
      >
        <Barras datos={d.a7} base={n} />
      </Bloque>

      <div className="pt-1">
        <h4 className="text-[14px] font-medium text-[#E8EEF4]">Respuestas abiertas</h4>
        <div className="mt-3">
          <Abiertas pregunta="A5" titulo="Un caso en que les sirvió" respuestas={d.abiertas.a5} />
          <Abiertas pregunta="A8" titulo="Qué tendría que cambiar para usarla más" respuestas={d.abiertas.a8} />
          <Abiertas
            pregunta="A9"
            titulo="Por qué no la usan o la dejaron de usar"
            respuestas={d.abiertas.a9}
          />
        </div>
      </div>
    </div>
  )
}

function VistaHerramientas({ d }: { d: Resultados['herramientas'] }) {
  const n = d.respuestas
  if (n === 0) return <p className="text-[13px] text-[#4A6076]">Sin respuestas todavía.</p>

  const maxApp = Math.max(1, ...d.apps.map((a) => a.respuestas))
  const duplicidad = d.h12.find((b) => b.opcion === 'Sí')?.n ?? 0

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metrica valor={n} etiqueta="Respuestas a la encuesta de herramientas" />
        <Metrica
          valor={d.apps.length}
          etiqueta="Apps internas con al menos una valoración"
        />
        <Metrica
          valor={d.sinApps}
          etiqueta="No usan ninguna app interna"
          nota={`${Math.round((d.sinApps / n) * 100)}% de quienes respondieron`}
        />
        <Metrica
          valor={duplicidad}
          etiqueta="Detectan herramientas duplicadas"
          nota="Respondieron Sí a H12"
        />
      </div>

      <Bloque
        titulo="Uso y valor por aplicación interna"
        pregunta="H2/H3"
        nota="Usuarios activos frente a quienes la abandonaron, y el valor percibido de 1 a 5."
      >
        {d.apps.length === 0 ? (
          <p className="text-[13px] text-[#4A6076]">Todavía nadie ha valorado una app.</p>
        ) : (
          <ul className="space-y-2.5">
            {d.apps.map((a) => (
              <li key={a.nombre} className="flex items-center gap-3">
                <span
                  className="w-[40%] shrink-0 truncate text-[13px] text-[#B9C8D6] sm:w-[32%]"
                  title={a.nombre}
                >
                  {a.nombre}
                </span>
                <span className="flex h-[7px] min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <span
                    className="block h-full bg-[#00A3FF]/85"
                    style={{ width: `${(a.activos / maxApp) * 100}%` }}
                  />
                  {/* El tramo de abandono va en el mismo riel: la barra completa
                      es "gente que la conoció", y el color separa quién sigue. */}
                  <span
                    className="block h-full bg-[#8FA3B5]/30"
                    style={{ width: `${(a.abandono / maxApp) * 100}%` }}
                  />
                </span>
                <span className="w-[104px] shrink-0 text-right text-[12px] tabular-nums text-[#8FA3B5]">
                  {a.activos}
                  {a.abandono > 0 && (
                    <span className="ml-1 text-[#4A6076]">−{a.abandono}</span>
                  )}
                  <span className="ml-2 text-[#00A3FF]">
                    {a.valor !== null ? a.valor.toFixed(1) : '—'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[11px] text-[#4A6076]">
          Activos · −abandonaron · valor percibido /5
        </p>
      </Bloque>

      <Bloque
        titulo="Frecuencia de uso de las apps internas"
        pregunta="H2"
        nota="Todas las apps juntas: una fila por persona × aplicación."
      >
        <Barras
          datos={d.frecuenciaApps}
          base={d.frecuenciaApps.reduce((s, b) => s + b.n, 0)}
        />
      </Bloque>

      <Bloque
        titulo="Por qué dejaron de usar una app"
        pregunta="H4"
        nota="Selección múltiple."
      >
        <Barras datos={d.h4} base={n} />
      </Bloque>

      <Bloque titulo="Uso de Airtable" pregunta="H6">
        <Barras datos={d.h6} base={n} />
      </Bloque>

      <Bloque titulo="Qué usan de Microsoft 365" pregunta="H8" nota="Selección múltiple.">
        <Barras datos={d.h8} base={n} />
      </Bloque>

      <Bloque titulo="Qué tanto resuelve Microsoft 365 su trabajo" pregunta="H9">
        <EscalaVista escala={d.h9} extremos={['Nada', 'Del todo']} />
      </Bloque>

      <Bloque titulo="Uso de Google Workspace" pregunta="H10">
        <Barras datos={d.h10} base={n} />
      </Bloque>

      <Bloque titulo="¿Ven herramientas que hacen lo mismo?" pregunta="H12">
        <Barras datos={d.h12} base={n} />
      </Bloque>

      <div className="pt-1">
        <h4 className="text-[14px] font-medium text-[#E8EEF4]">Respuestas abiertas</h4>
        <div className="mt-3">
          <Abiertas pregunta="H5" titulo="Qué app interna les falta" respuestas={d.abiertas.h5} />
          <Abiertas pregunta="H7" titulo="Qué mejorarían de Airtable" respuestas={d.abiertas.h7} />
          <Abiertas pregunta="H11" titulo="Comentarios sobre Microsoft y Google" respuestas={d.abiertas.h11} />
          <Abiertas pregunta="H13" titulo="Qué herramientas se duplican" respuestas={d.abiertas.h13} />
          <Abiertas
            pregunta="H14"
            titulo="Qué herramienta contratada eliminarían"
            respuestas={d.abiertas.h14}
          />
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function Dashboard() {
  const [datos, setDatos] = useState<Resultados | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [pestana, setPestana] = useState<Pestana>('resumen')

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/encuestas/resultados', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'No se pudieron cargar los resultados.')
      }
      setDatos(json as Resultados)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los resultados.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  return (
    <section className="mt-16 border-t border-white/[0.12] pt-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#00A3FF]">
            <BarChart3 className="h-3.5 w-3.5" />
            Resultados en vivo
          </p>
          <h2 className="mt-3 text-[24px] font-semibold leading-tight tracking-[-0.02em] sm:text-[30px]">
            Dashboard de respuestas
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-[#8FA3B5]">
            Todo lo que se ha respondido hasta ahora, leído directamente de Airtable. Se actualiza
            cada vez que abres esta página.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void cargar()}
          disabled={cargando}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/[0.12] px-3.5 py-2 text-[12px] text-[#B9C8D6] transition-colors hover:border-white/25 hover:text-[#E8EEF4] disabled:opacity-45"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${cargando ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {cargando && !datos && (
        <div className="mt-10 flex items-center gap-2.5 text-[13px] text-[#8FA3B5]">
          <Loader2 className="h-4 w-4 animate-spin text-[#00A3FF]" />
          Leyendo las respuestas…
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-lg border border-[#FF6B6B]/25 bg-[#FF6B6B]/[0.06] px-4 py-3.5 text-[13px] text-[#FFB4B4]">
          {error}
        </div>
      )}

      {datos && (
        <>
          <nav className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <div className="flex min-w-max gap-1 border-b border-white/[0.09]">
              {PESTANAS.map(({ id, etiqueta }) => {
                const activa = pestana === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPestana(id)}
                    className={`-mb-px flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[13px] transition-colors ${
                      activa
                        ? 'border-[#00A3FF] text-[#E8EEF4]'
                        : 'border-transparent text-[#8FA3B5] hover:text-[#E8EEF4]'
                    }`}
                  >
                    {id === 'participantes' && <Users className="h-3.5 w-3.5" />}
                    {etiqueta}
                  </button>
                )
              })}
            </div>
          </nav>

          <div className="mt-8">
            {pestana === 'resumen' && <Resumen d={datos} />}
            {pestana === 'participantes' && <Participantes d={datos} />}
            {pestana === 'claude' && <VistaClaude d={datos.claude} />}
            {pestana === 'alma' && <VistaAlma d={datos.alma} />}
            {pestana === 'herramientas' && <VistaHerramientas d={datos.herramientas} />}
          </div>
        </>
      )}
    </section>
  )
}

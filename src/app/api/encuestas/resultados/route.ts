// src/app/api/encuestas/resultados/route.ts
//
// Lee las tres tablas de respuestas (más "Uso por Aplicación" y el catálogo) y
// devuelve el agregado que consume el dashboard de /encuestas.
//
// Se agrega EN EL SERVIDOR a propósito: el navegador nunca ve el token de
// Airtable ni los IDs de campo, solo conteos y las respuestas abiertas ya
// asociadas a su autor.
//
// El orden de las categorías en cada distribución es el de schema.ts, no el que
// salga de los datos: así una opción con cero respuestas sigue siendo visible
// (un cero es información: nadie eligió esa opción).

import { NextResponse } from 'next/server'
import { listRecords, checkRateLimit, clientIp } from '@/lib/encuestas/airtable'
import { TABLES, F_CLAUDE, F_ALMA, F_HER, F_USO, F_CATALOGO } from '@/lib/encuestas/ids'
import {
  AREAS,
  C1_FRECUENCIA,
  C2_AREAS_USO,
  C3_PLAN,
  C5_FUNCIONES,
  C6_AHORRO,
  C6_PUNTO_MEDIO,
  C7_FRENOS,
  A1_HA_USADO,
  A2_RANGO,
  A3_FRECUENCIA,
  A4_TAREAS,
  A7_FRENOS,
  H2_FRECUENCIA,
  H2_ABANDONO,
  H4_RAZONES,
  H6_AIRTABLE,
  H8_M365,
  H10_GOOGLE,
  H12_DUPLICIDAD,
} from '@/lib/encuestas/schema'

export const dynamic = 'force-dynamic'

// ── Tipos que viajan al cliente ──────────────────────────────────────────────

export type Barra = { opcion: string; n: number }
export type Escala = { promedio: number | null; n: number; dist: Barra[] }
export type Abierta = { nombre: string; area: string; texto: string }

export type Participante = {
  nombre: string
  area: string
  claude: boolean
  alma: boolean
  herramientas: boolean
  completadas: number
  ultima: string | null
}

// ── Utilidades de agregación ─────────────────────────────────────────────────

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const num = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null

/** Distribución de un campo de selección única, en el orden del catálogo. */
function distUnica(
  filas: Record<string, unknown>[],
  fieldId: string,
  opciones: readonly string[]
): Barra[] {
  const conteo = new Map<string, number>(opciones.map((o) => [o, 0]))
  for (const f of filas) {
    const v = str(f[fieldId])
    if (v && conteo.has(v)) conteo.set(v, conteo.get(v)! + 1)
  }
  return opciones.map((o) => ({ opcion: o, n: conteo.get(o) ?? 0 }))
}

/** Distribución de un campo de selección múltiple. La suma puede pasar del total. */
function distMultiple(
  filas: Record<string, unknown>[],
  fieldId: string,
  opciones: readonly string[]
): Barra[] {
  const conteo = new Map<string, number>(opciones.map((o) => [o, 0]))
  for (const f of filas) {
    const v = f[fieldId]
    if (!Array.isArray(v)) continue
    for (const item of v) {
      const s = str(item)
      if (s && conteo.has(s)) conteo.set(s, conteo.get(s)! + 1)
    }
  }
  return opciones.map((o) => ({ opcion: o, n: conteo.get(o) ?? 0 }))
}

/** Promedio y distribución de una escala 1-5. Ignora las respuestas vacías. */
function escala(filas: Record<string, unknown>[], fieldId: string): Escala {
  const valores: number[] = []
  const dist = [1, 2, 3, 4, 5].map((v) => ({ opcion: String(v), n: 0 }))

  for (const f of filas) {
    const v = num(f[fieldId])
    if (v === null || v < 1 || v > 5) continue
    valores.push(v)
    dist[Math.round(v) - 1].n++
  }

  const promedio =
    valores.length > 0
      ? Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 10) / 10
      : null
  return { promedio, n: valores.length, dist }
}

/** Respuestas de texto libre, con su autor. */
function abiertas(
  filas: Record<string, unknown>[],
  fieldId: string,
  nombreId: string,
  areaId: string
): Abierta[] {
  return filas
    .map((f) => ({
      nombre: str(f[nombreId]) || 'Sin nombre',
      area: str(f[areaId]),
      texto: str(f[fieldId]),
    }))
    .filter((a) => a.texto.length > 0)
}

/** Cuenta cuántas filas tienen `true` en un checkbox. */
function cuentaSi(filas: Record<string, unknown>[], fieldId: string): number {
  return filas.filter((f) => f[fieldId] === true).length
}

/**
 * Normaliza un nombre para cruzar las tres encuestas: sin acentos, sin dobles
 * espacios y en minúsculas. El cruce es por nombre (así se diseñaron las
 * encuestas) y la gente no lo escribe idéntico las tres veces.
 */
function clave(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export async function GET(request: Request) {
  if (!checkRateLimit(`resultados:${clientIp(request)}`, 40, 60_000)) {
    return NextResponse.json(
      { success: false, error: 'Demasiadas solicitudes. Espera un minuto.' },
      { status: 429 }
    )
  }

  try {
    const [rClaude, rAlma, rHer, rUso, rCatalogo] = await Promise.all([
      listRecords(TABLES.claude),
      listRecords(TABLES.alma),
      listRecords(TABLES.herramientas),
      listRecords(TABLES.usoPorApp, {
        fieldIds: [F_USO.h2, F_USO.h3, F_USO.abandono, F_USO.herramienta],
      }),
      listRecords(TABLES.catalogo, { fieldIds: [F_CATALOGO.nombre, F_CATALOGO.tipo] }),
    ])

    const fClaude = rClaude.map((r) => r.fields)
    const fAlma = rAlma.map((r) => r.fields)
    const fHer = rHer.map((r) => r.fields)

    // ── Participantes: una fila por persona, con qué encuestas respondió ─────
    const personas = new Map<string, Participante>()

    const registrar = (
      filas: Record<string, unknown>[],
      nombreId: string,
      areaId: string,
      fechaId: string,
      encuesta: 'claude' | 'alma' | 'herramientas'
    ) => {
      for (const f of filas) {
        const nombre = str(f[nombreId])
        if (!nombre) continue
        const k = clave(nombre)
        const fecha = str(f[fechaId]) || null
        const area = str(f[areaId])

        const actual: Participante =
          personas.get(k) ?? {
            nombre,
            area,
            claude: false,
            alma: false,
            herramientas: false,
            completadas: 0,
            ultima: null,
          }

        if (!actual[encuesta]) {
          actual[encuesta] = true
          actual.completadas++
        }
        // El área de la respuesta más reciente gana: si alguien cambió de área
        // entre encuestas, la última es la información más fresca.
        if (fecha && (!actual.ultima || fecha >= actual.ultima)) {
          actual.ultima = fecha
          if (area) actual.area = area
        }
        personas.set(k, actual)
      }
    }

    registrar(fClaude, F_CLAUDE.nombre, F_CLAUDE.area, F_CLAUDE.fecha, 'claude')
    registrar(fAlma, F_ALMA.nombre, F_ALMA.area, F_ALMA.fecha, 'alma')
    registrar(fHer, F_HER.nombre, F_HER.area, F_HER.fecha, 'herramientas')

    const participantes = [...personas.values()].sort(
      (a, b) => b.completadas - a.completadas || a.nombre.localeCompare(b.nombre, 'es')
    )

    // ── Participación por área ──────────────────────────────────────────────
    const porArea = AREAS.map((area) => {
      const gente = participantes.filter((p) => p.area === area)
      return {
        area,
        personas: gente.length,
        claude: gente.filter((p) => p.claude).length,
        alma: gente.filter((p) => p.alma).length,
        herramientas: gente.filter((p) => p.herramientas).length,
      }
    }).filter((a) => a.personas > 0)

    // ── Horas ahorradas por Claude (C6, punto medio del rango) ──────────────
    const horas: number[] = []
    for (const f of fClaude) {
      // Se prefiere el campo numérico que se calculó al guardar; si la fila es
      // anterior a que existiera, se recalcula desde el rango.
      const n = num(f[F_CLAUDE.c6Num]) ?? C6_PUNTO_MEDIO[str(f[F_CLAUDE.c6])] ?? null
      if (n !== null) horas.push(n)
    }
    const horasTotal = horas.reduce((a, b) => a + b, 0)

    // ── Uso por aplicación interna (H2/H3 ya desglosados al guardar) ─────────
    const nombreApp = new Map(
      rCatalogo.map((r) => [r.id, str(r.fields[F_CATALOGO.nombre])])
    )

    type AppAcc = { nombre: string; respuestas: number; abandono: number; valores: number[] }
    const apps = new Map<string, AppAcc>()

    for (const r of rUso) {
      const link = r.fields[F_USO.herramienta]
      const appId = Array.isArray(link) && typeof link[0] === 'string' ? link[0] : ''
      const nombre = nombreApp.get(appId)
      if (!nombre) continue

      const acc = apps.get(appId) ?? { nombre, respuestas: 0, abandono: 0, valores: [] }
      acc.respuestas++
      if (r.fields[F_USO.abandono] === true || str(r.fields[F_USO.h2]) === H2_ABANDONO) {
        acc.abandono++
      }
      const v = num(r.fields[F_USO.h3])
      if (v !== null) acc.valores.push(v)
      apps.set(appId, acc)
    }

    const usoApps = [...apps.values()]
      .map((a) => ({
        nombre: a.nombre,
        respuestas: a.respuestas,
        abandono: a.abandono,
        activos: a.respuestas - a.abandono,
        valor:
          a.valores.length > 0
            ? Math.round((a.valores.reduce((x, y) => x + y, 0) / a.valores.length) * 10) / 10
            : null,
      }))
      .sort((a, b) => b.activos - a.activos || a.nombre.localeCompare(b.nombre, 'es'))

    // Frecuencia de uso agregada de todas las apps internas juntas.
    const frecuenciaApps = distUnica(
      rUso.map((r) => r.fields),
      F_USO.h2,
      H2_FRECUENCIA
    )

    const abrir = (filas: Record<string, unknown>[], campo: string, n: string, ar: string) =>
      abiertas(filas, campo, n, ar)

    return NextResponse.json({
      success: true,
      totales: {
        personas: participantes.length,
        claude: fClaude.length,
        alma: fAlma.length,
        herramientas: fHer.length,
        lasTres: participantes.filter((p) => p.completadas === 3).length,
      },
      participantes,
      porArea,
      claude: {
        respuestas: fClaude.length,
        c1: distUnica(fClaude, F_CLAUDE.c1, C1_FRECUENCIA),
        c2: distMultiple(fClaude, F_CLAUDE.c2, C2_AREAS_USO),
        c3: distUnica(fClaude, F_CLAUDE.c3, C3_PLAN),
        c5: distMultiple(fClaude, F_CLAUDE.c5, C5_FUNCIONES),
        c6: distUnica(fClaude, F_CLAUDE.c6, C6_AHORRO),
        c7: distMultiple(fClaude, F_CLAUDE.c7, C7_FRENOS),
        c9: escala(fClaude, F_CLAUDE.c9),
        horas: {
          n: horas.length,
          totalSemana: Math.round(horasTotal * 10) / 10,
          promedioSemana:
            horas.length > 0 ? Math.round((horasTotal / horas.length) * 10) / 10 : null,
        },
        abiertas: {
          c4: abrir(fClaude, F_CLAUDE.c4, F_CLAUDE.nombre, F_CLAUDE.area),
          c8: abrir(fClaude, F_CLAUDE.c8, F_CLAUDE.nombre, F_CLAUDE.area),
          c10: abrir(fClaude, F_CLAUDE.c10Justificacion, F_CLAUDE.nombre, F_CLAUDE.area),
        },
      },
      alma: {
        respuestas: fAlma.length,
        a1: distUnica(fAlma, F_ALMA.a1, A1_HA_USADO),
        a2: distUnica(fAlma, F_ALMA.a2Rango, A2_RANGO),
        a3: distUnica(fAlma, F_ALMA.a3, A3_FRECUENCIA),
        a4: distMultiple(fAlma, F_ALMA.a4, A4_TAREAS),
        a6: escala(fAlma, F_ALMA.a6),
        a7: distMultiple(fAlma, F_ALMA.a7, A7_FRENOS),
        abiertas: {
          a5: abrir(fAlma, F_ALMA.a5, F_ALMA.nombre, F_ALMA.area),
          a8: abrir(fAlma, F_ALMA.a8, F_ALMA.nombre, F_ALMA.area),
          a9: abrir(fAlma, F_ALMA.a9, F_ALMA.nombre, F_ALMA.area),
        },
      },
      herramientas: {
        respuestas: fHer.length,
        sinApps: cuentaSi(fHer, F_HER.h1Ninguna),
        apps: usoApps,
        frecuenciaApps,
        h4: distMultiple(fHer, F_HER.h4, H4_RAZONES),
        h6: distUnica(fHer, F_HER.h6, H6_AIRTABLE),
        h8: distMultiple(fHer, F_HER.h8, H8_M365),
        h9: escala(fHer, F_HER.h9),
        h10: distUnica(fHer, F_HER.h10, H10_GOOGLE),
        h12: distUnica(fHer, F_HER.h12, H12_DUPLICIDAD),
        abiertas: {
          h5: abrir(fHer, F_HER.h5, F_HER.nombre, F_HER.area),
          h7: abrir(fHer, F_HER.h7, F_HER.nombre, F_HER.area),
          h11: abrir(fHer, F_HER.h11, F_HER.nombre, F_HER.area),
          h13: abrir(fHer, F_HER.h13, F_HER.nombre, F_HER.area),
          h14: abrir(fHer, F_HER.h14, F_HER.nombre, F_HER.area),
        },
      },
    })
  } catch (error) {
    console.error('Error al agregar los resultados de las encuestas:', error)
    return NextResponse.json(
      { success: false, error: 'No se pudieron cargar los resultados.' },
      { status: 500 }
    )
  }
}

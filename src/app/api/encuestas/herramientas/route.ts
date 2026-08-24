// src/app/api/encuestas/herramientas/route.ts
//
// ENCUESTA 3 — Aplicaciones internas y herramientas contratadas.
//
// Escribe en DOS tablas:
//   1. "Respuestas Herramientas" — una fila por persona (H1, H4-H14).
//   2. "Uso por Aplicación"      — una fila por persona × aplicación (H2, H3).
//
// Las cuadrículas H2/H3 se descomponen aquí, no en el análisis: guardar el grid
// como texto en una sola celda haría imposible calcular el valor percibido por
// aplicación, que es la métrica con la que se decide qué mantener y qué cancelar.

import { NextResponse } from 'next/server'
import {
  listRecords,
  createRecords,
  deleteRecords,
  nextCorrelativeId,
  checkRateLimit,
  clientIp,
  sanitizeText,
  pickOne,
  pickMany,
  pickRating,
  compact,
  today,
} from '@/lib/encuestas/airtable'
import { TABLES, F_HER, F_USO, F_CATALOGO } from '@/lib/encuestas/ids'
import {
  AREAS,
  H2_FRECUENCIA,
  H2_ABANDONO,
  H4_RAZONES,
  H6_AIRTABLE,
  H8_M365,
  H10_GOOGLE,
  H12_DUPLICIDAD,
  ESTADO_SIN_PROCESAR,
} from '@/lib/encuestas/schema'

export const dynamic = 'force-dynamic'

type UsoEntrada = { appId: string; h2: string; h3: number | null }

export async function POST(request: Request) {
  if (!checkRateLimit(`enc-her:${clientIp(request)}`, 5, 60 * 60_000)) {
    return NextResponse.json(
      { success: false, error: 'Demasiados envíos desde esta conexión. Intenta más tarde.' },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ success: false, error: 'Cuerpo inválido' }, { status: 400 })
  }

  const nombre = sanitizeText(body.nombre, 120)
  if (nombre.length < 2) {
    return NextResponse.json({ success: false, error: 'Falta tu nombre.' }, { status: 400 })
  }

  const area = pickOne(body.area, AREAS)
  if (!area) {
    return NextResponse.json(
      { success: false, error: 'Falta indicar el área en la que trabajas.' },
      { status: 400 }
    )
  }

  const ninguna = body.h1Ninguna === true
  const h4 = pickMany(body.h4, H4_RAZONES)

  try {
    // Se valida contra el catálogo real: nunca se enlaza un ID de registro que
    // venga del navegador sin comprobar que existe y que es una app de encuesta.
    const catalogo = await listRecords(TABLES.catalogo, {
      fieldIds: [F_CATALOGO.nombre, F_CATALOGO.tipo, F_CATALOGO.incluirEnEncuesta],
    })
    const appsValidas = new Map(
      catalogo
        .filter(
          (r) =>
            r.fields[F_CATALOGO.incluirEnEncuesta] === true &&
            r.fields[F_CATALOGO.tipo] === 'App interna Sirius'
        )
        .map((r) => [r.id, String(r.fields[F_CATALOGO.nombre] ?? '')])
    )

    const usos: UsoEntrada[] = []
    if (!ninguna && Array.isArray(body.usos)) {
      for (const raw of body.usos as unknown[]) {
        if (typeof raw !== 'object' || raw === null) continue
        const u = raw as Record<string, unknown>
        const appId = typeof u.appId === 'string' ? u.appId : ''
        if (!appsValidas.has(appId)) continue
        if (usos.some((x) => x.appId === appId)) continue

        const h2 = pickOne(u.h2, H2_FRECUENCIA)
        const h3 = pickRating(u.h3)
        if (!h2 && h3 === undefined) continue // fila del grid sin datos: se ignora

        usos.push({ appId, h2: h2 ?? '', h3: h3 ?? null })
      }
    }

    const appIds = usos.map((u) => u.appId)

    const id = await nextCorrelativeId(TABLES.herramientas, F_HER.id, 'HER')

    const fields = compact({
      [F_HER.id]: id,
      [F_HER.fecha]: today(),
      [F_HER.nombre]: nombre,
      [F_HER.area]: area,
      [F_HER.h1Ninguna]: ninguna,
      [F_HER.h1Apps]: appIds,
      [F_HER.h4]: h4,
      [F_HER.h4Otro]: h4.includes('Otro') ? sanitizeText(body.h4Otro, 200) : undefined,
      [F_HER.h5]: sanitizeText(body.h5),
      [F_HER.h6]: pickOne(body.h6, H6_AIRTABLE),
      [F_HER.h7]: sanitizeText(body.h7),
      [F_HER.h8]: pickMany(body.h8, H8_M365),
      [F_HER.h9]: pickRating(body.h9),
      [F_HER.h10]: pickOne(body.h10, H10_GOOGLE),
      [F_HER.h11]: sanitizeText(body.h11),
      [F_HER.h12]: pickOne(body.h12, H12_DUPLICIDAD),
      // H13 solo tiene sentido si respondió "Sí" a H12.
      [F_HER.h13]: pickOne(body.h12, H12_DUPLICIDAD) === 'Sí' ? sanitizeText(body.h13) : '',
      [F_HER.h14]: sanitizeText(body.h14, 200),
      [F_HER.codigo]: sanitizeText(body.codigo, 40),
      [F_HER.estado]: ESTADO_SIN_PROCESAR,
    })

    const [respuesta] = await createRecords(TABLES.herramientas, [{ fields }])

    if (usos.length > 0) {
      const filasUso = usos.map((u) => ({
        fields: compact({
          [F_USO.registro]: `${id} × ${appsValidas.get(u.appId)}`,
          [F_USO.h2]: u.h2 || undefined,
          [F_USO.h3]: u.h3 ?? undefined,
          [F_USO.abandono]: u.h2 === H2_ABANDONO,
          [F_USO.respuesta]: [respuesta.id],
          [F_USO.herramienta]: [u.appId],
        }),
      }))

      try {
        await createRecords(TABLES.usoPorApp, filasUso)
      } catch (error) {
        // Si el desglose de la cuadrícula falla, se borra la fila principal:
        // una respuesta sin H2/H3 daría un conteo engañoso al analizar.
        await deleteRecords(TABLES.herramientas, [respuesta.id])
        throw error
      }
    }

    return NextResponse.json({ success: true, id, apps: usos.length })
  } catch (error) {
    console.error('Error al guardar respuesta de la Encuesta Herramientas:', error)
    return NextResponse.json(
      { success: false, error: 'No se pudo guardar la respuesta. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}

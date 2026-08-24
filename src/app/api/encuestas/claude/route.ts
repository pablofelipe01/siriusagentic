// src/app/api/encuestas/claude/route.ts
//
// ENCUESTA 1 — Uso de Claude. Crea una fila en "Respuestas Claude".
// La respuesta va identificada con nombre y área. El cruce entre las tres
// encuestas se hace por nombre, no por el "Código de participante" (ese campo
// sigue existiendo en Airtable, pero el formulario web ya no lo pide).
// No se guarda la IP: solo se usa en memoria para el límite de envíos.

import { NextResponse } from 'next/server'
import {
  createRecords,
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
import { TABLES, F_CLAUDE } from '@/lib/encuestas/ids'
import {
  AREAS,
  C1_FRECUENCIA,
  C2_AREAS_USO,
  C3_PLAN,
  C5_FUNCIONES,
  C6_AHORRO,
  C6_PUNTO_MEDIO,
  C7_FRENOS,
  ESTADO_SIN_PROCESAR,
} from '@/lib/encuestas/schema'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!checkRateLimit(`enc-claude:${clientIp(request)}`, 5, 60 * 60_000)) {
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

  // Obligatorias: nombre, área y C1. El resto puede quedar vacío y así se
  // registra — no se infiere nada que la persona no haya respondido.
  const nombre = sanitizeText(body.nombre, 120)
  if (nombre.length < 2) {
    return NextResponse.json(
      { success: false, error: 'Falta tu nombre.' },
      { status: 400 }
    )
  }

  const area = pickOne(body.area, AREAS)
  if (!area) {
    return NextResponse.json(
      { success: false, error: 'Falta indicar el área en la que trabajas.' },
      { status: 400 }
    )
  }

  const c1 = pickOne(body.c1, C1_FRECUENCIA)
  if (!c1) {
    return NextResponse.json(
      { success: false, error: 'Falta responder la pregunta 1 (frecuencia de uso).' },
      { status: 400 }
    )
  }

  const c6 = pickOne(body.c6, C6_AHORRO)
  const c6Num = c6 ? C6_PUNTO_MEDIO[c6] : null

  const c2 = pickMany(body.c2, C2_AREAS_USO)
  const c7 = pickMany(body.c7, C7_FRENOS).slice(0, 2) // C7 dice "elige hasta 2"

  try {
    const id = await nextCorrelativeId(TABLES.claude, F_CLAUDE.id, 'CLA')

    const fields = compact({
      [F_CLAUDE.id]: id,
      [F_CLAUDE.fecha]: today(),
      [F_CLAUDE.nombre]: nombre,
      [F_CLAUDE.area]: area,
      [F_CLAUDE.c1]: c1,
      [F_CLAUDE.c2]: c2,
      [F_CLAUDE.c2Otro]: c2.includes('Otro') ? sanitizeText(body.c2Otro, 200) : undefined,
      [F_CLAUDE.c3]: pickOne(body.c3, C3_PLAN),
      [F_CLAUDE.c4]: sanitizeText(body.c4),
      [F_CLAUDE.c5]: pickMany(body.c5, C5_FUNCIONES),
      [F_CLAUDE.c6]: c6,
      // Punto medio de C6. "No estoy seguro/a" → null → se omite en compact().
      [F_CLAUDE.c6Num]: c6Num ?? undefined,
      [F_CLAUDE.c7]: c7,
      [F_CLAUDE.c7Otro]: c7.includes('Otro') ? sanitizeText(body.c7Otro, 200) : undefined,
      [F_CLAUDE.c8]: sanitizeText(body.c8),
      [F_CLAUDE.c9]: pickRating(body.c9),
      // C10 llega como texto abierto. La postura (Sí / No / Depende) la codifica
      // quien analiza, no el formulario: aquí solo se guarda la justificación.
      [F_CLAUDE.c10Justificacion]: sanitizeText(body.c10),
      [F_CLAUDE.codigo]: sanitizeText(body.codigo, 40),
      [F_CLAUDE.estado]: ESTADO_SIN_PROCESAR,
    })

    await createRecords(TABLES.claude, [{ fields }])
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error al guardar respuesta de la Encuesta Claude:', error)
    return NextResponse.json(
      { success: false, error: 'No se pudo guardar la respuesta. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}

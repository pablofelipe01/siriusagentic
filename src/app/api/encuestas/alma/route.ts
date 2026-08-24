// src/app/api/encuestas/alma/route.ts
//
// ENCUESTA 2 — Uso del agente Alma. Crea una fila en "Respuestas Alma".
//
// Lógica condicional: si A1 = "No", el formulario salta a A9 y las preguntas
// A2-A8 no se muestran. Aquí se descartan explícitamente esos valores para que
// una respuesta a medio llenar en el navegador no ensucie el análisis.

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
import { TABLES, F_ALMA } from '@/lib/encuestas/ids'
import {
  AREAS,
  A1_HA_USADO,
  A2_RANGO,
  A3_FRECUENCIA,
  A4_TAREAS,
  A7_FRENOS,
  ESTADO_SIN_PROCESAR,
} from '@/lib/encuestas/schema'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!checkRateLimit(`enc-alma:${clientIp(request)}`, 5, 60 * 60_000)) {
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

  const a1 = pickOne(body.a1, A1_HA_USADO)
  if (!a1) {
    return NextResponse.json(
      { success: false, error: 'Falta responder la pregunta 1 (¿has usado Alma?).' },
      { status: 400 }
    )
  }

  const usoAlma = a1 === 'Sí'
  const a3 = usoAlma ? pickOne(body.a3, A3_FRECUENCIA) : undefined
  const a4 = usoAlma ? pickMany(body.a4, A4_TAREAS) : []
  const a7 = usoAlma ? pickMany(body.a7, A7_FRENOS).slice(0, 2) : []

  // A9 solo aplica a quien nunca la usó o dejó de usarla.
  const aplicaA9 = !usoAlma || a3 === 'Nunca la he usado' || a3 === 'La usé una vez y no volví'

  try {
    const id = await nextCorrelativeId(TABLES.alma, F_ALMA.id, 'ALM')

    const fields = compact({
      [F_ALMA.id]: id,
      [F_ALMA.fecha]: today(),
      [F_ALMA.nombre]: nombre,
      [F_ALMA.area]: area,
      [F_ALMA.a1]: a1,
      // El formulario pregunta A2 por rangos (más fiable que pedir una fecha
      // exacta de memoria). El campo de fecha queda vacío a propósito.
      [F_ALMA.a2Rango]: usoAlma ? pickOne(body.a2, A2_RANGO) : undefined,
      [F_ALMA.a3]: a3,
      [F_ALMA.a4]: a4,
      [F_ALMA.a4Otro]: a4.includes('Otro') ? sanitizeText(body.a4Otro, 200) : undefined,
      [F_ALMA.a5]: usoAlma ? sanitizeText(body.a5) : '',
      [F_ALMA.a6]: usoAlma ? pickRating(body.a6) : undefined,
      [F_ALMA.a7]: a7,
      [F_ALMA.a7Otro]: a7.includes('Otro') ? sanitizeText(body.a7Otro, 200) : undefined,
      [F_ALMA.a8]: usoAlma ? sanitizeText(body.a8) : '',
      [F_ALMA.a9]: aplicaA9 ? sanitizeText(body.a9) : '',
      [F_ALMA.codigo]: sanitizeText(body.codigo, 40),
      [F_ALMA.estado]: ESTADO_SIN_PROCESAR,
    })

    await createRecords(TABLES.alma, [{ fields }])
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error al guardar respuesta de la Encuesta Alma:', error)
    return NextResponse.json(
      { success: false, error: 'No se pudo guardar la respuesta. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}

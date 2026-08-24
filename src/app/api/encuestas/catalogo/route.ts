// src/app/api/encuestas/catalogo/route.ts
//
// Devuelve las aplicaciones internas que deben aparecer en las cuadrículas
// H1/H2/H3 de la Encuesta 3. La lista vive en el Catálogo de Herramientas de
// Airtable, no en el código: cuando Tecnología agrega o retira una app del
// catálogo, el formulario cambia solo.

import { NextResponse } from 'next/server'
import { listRecords, checkRateLimit, clientIp } from '@/lib/encuestas/airtable'
import { TABLES, F_CATALOGO } from '@/lib/encuestas/ids'
import { type AppCatalogo } from '@/lib/encuestas/schema'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (!checkRateLimit(`catalogo:${clientIp(request)}`, 60, 60_000)) {
    return NextResponse.json(
      { success: false, error: 'Demasiadas solicitudes. Espera un minuto.' },
      { status: 429 }
    )
  }

  try {
    // El catálogo es pequeño (decenas de filas), así que se trae completo y se
    // filtra aquí en vez de con filterByFormula: evita depender de los nombres
    // de campo, que sí pueden cambiar en Airtable.
    const records = await listRecords(TABLES.catalogo, {
      fieldIds: [
        F_CATALOGO.nombre,
        F_CATALOGO.descripcion,
        F_CATALOGO.tipo,
        F_CATALOGO.incluirEnEncuesta,
      ],
    })

    const apps: AppCatalogo[] = records
      .filter(
        (r) =>
          r.fields[F_CATALOGO.incluirEnEncuesta] === true &&
          r.fields[F_CATALOGO.tipo] === 'App interna Sirius'
      )
      .map((r) => ({
        id: r.id,
        nombre: String(r.fields[F_CATALOGO.nombre] ?? ''),
        descripcion: r.fields[F_CATALOGO.descripcion]
          ? String(r.fields[F_CATALOGO.descripcion])
          : undefined,
      }))
      .filter((a) => a.nombre !== '')
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

    return NextResponse.json({ success: true, apps })
  } catch (error) {
    console.error('Error al leer el Catálogo de Herramientas:', error)
    return NextResponse.json(
      { success: false, error: 'No se pudo cargar la lista de aplicaciones.' },
      { status: 500 }
    )
  }
}

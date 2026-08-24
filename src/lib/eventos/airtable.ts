// src/lib/eventos/airtable.ts
//
// Cliente REST minimo de Airtable para la base de asistencia a eventos.
// Misma forma que src/lib/encuestas/airtable.ts (fetch a la API v0 con
// returnFieldsByFieldId), pero con credenciales propias: es otra base y otro
// token, y conviene que revocar uno no tumbe al otro.
//
// Los helpers puros de saneamiento y rate limit se reutilizan del modulo de
// encuestas en vez de duplicarlos; no leen credenciales al importarse.
//
// SOLO SERVIDOR: este modulo lee el token de Airtable.

export {
  checkRateLimit,
  clientIp,
  sanitizeText,
  pickOne,
  compact,
  today,
} from '@/lib/encuestas/airtable'

const API = 'https://api.airtable.com/v0'

type AirtableRecord = {
  id: string
  createdTime: string
  fields: Record<string, unknown>
}

function credentials() {
  const token = process.env.AIRTABLE_EVENTOS_TOKEN
  const baseId = process.env.AIRTABLE_EVENTOS_BASE_ID

  if (!token || !baseId) {
    throw new Error('Faltan AIRTABLE_EVENTOS_TOKEN o AIRTABLE_EVENTOS_BASE_ID en el entorno')
  }
  return { token, baseId }
}

/** Lista registros de una tabla, paginando hasta agotarlos. */
export async function listRecords(
  tableId: string,
  opts: {
    fieldIds?: string[]
    filterByFormula?: string
    maxRecords?: number
    /** Orden del servidor, para no traerse la tabla entera cuando basta una fila. */
    sort?: { field: string; direction: 'asc' | 'desc' }
  } = {}
): Promise<AirtableRecord[]> {
  const { token, baseId } = credentials()
  const out: AirtableRecord[] = []
  let offset: string | undefined

  do {
    const params = new URLSearchParams()
    params.set('returnFieldsByFieldId', 'true')
    params.set('pageSize', '100')
    if (opts.maxRecords) params.set('maxRecords', String(opts.maxRecords))
    if (opts.filterByFormula) params.set('filterByFormula', opts.filterByFormula)
    if (opts.sort) {
      params.set('sort[0][field]', opts.sort.field)
      params.set('sort[0][direction]', opts.sort.direction)
    }
    if (offset) params.set('offset', offset)
    for (const f of opts.fieldIds ?? []) params.append('fields[]', f)

    const res = await fetch(`${API}/${baseId}/${tableId}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`Airtable list ${tableId} -> ${res.status}: ${body}`)
      throw new Error(`Airtable respondio ${res.status} al leer ${tableId}`)
    }

    const data = (await res.json()) as { records: AirtableRecord[]; offset?: string }
    out.push(...data.records)
    offset = data.offset
    if (opts.maxRecords && out.length >= opts.maxRecords) break
  } while (offset)

  return out
}

/** Crea registros en lotes de 10 (limite de la API de Airtable por request). */
export async function createRecords(
  tableId: string,
  records: { fields: Record<string, unknown> }[]
): Promise<AirtableRecord[]> {
  const { token, baseId } = credentials()
  const created: AirtableRecord[] = []

  for (let i = 0; i < records.length; i += 10) {
    const chunk = records.slice(i, i + 10)
    const res = await fetch(`${API}/${baseId}/${tableId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: chunk, returnFieldsByFieldId: true }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`Airtable create ${tableId} -> ${res.status}: ${body}`)
      throw new Error(`Airtable respondio ${res.status} al escribir en ${tableId}`)
    }

    const data = (await res.json()) as { records: AirtableRecord[] }
    created.push(...data.records)
  }

  return created
}

/**
 * Siguiente ID correlativo (FW-001, FW-002...). Toma el maximo existente + 1,
 * asi no se reutilizan IDs si alguien borra una fila intermedia.
 *
 * Pide una sola fila ordenada por ID descendente en vez de escanear la tabla:
 * con esto cada registro cuesta una peticion a Airtable y no una por cada 100
 * asistentes, que es lo que importa cuando llegan muchos envios a la vez.
 * El orden alfabetico coincide con el numerico solo mientras el relleno de
 * ceros alcance (hasta 999); pasado ese punto se cae al conteo completo.
 *
 * Se compara sin expresiones regulares a proposito: construir una RegExp desde
 * un template literal se presta a que un `\d` se convierta en `d` al editar, y
 * el fallo es silencioso (todos los registros salen con el mismo codigo).
 */
const RELLENO = 3
const TOPE_ORDEN_ALFABETICO = 10 ** RELLENO - 1

function mayorConsecutivo(
  records: { fields: Record<string, unknown> }[],
  idFieldId: string,
  prefix: string
): number {
  const inicio = `${prefix}-`
  let max = 0
  for (const r of records) {
    const value = r.fields[idFieldId]
    if (typeof value !== 'string' || !value.startsWith(inicio)) continue
    const n = Number(value.slice(inicio.length))
    if (Number.isInteger(n) && n > max) max = n
  }
  return max
}

// Ultimo consecutivo entregado por esta instancia. Airtable tarda unos
// milisegundos en reflejar una fila recien creada en el endpoint de listado:
// sin esta memoria, dos envios seguidos leen el mismo maximo y salen con el
// mismo codigo. Se toma el mayor entre lo que dice Airtable y lo ya entregado,
// asi que reiniciar el proceso no reutiliza codigos (se relee de la tabla).
const entregados = new Map<string, number>()

export async function nextCorrelativeId(
  tableId: string,
  idFieldId: string,
  prefix: string
): Promise<string> {
  const ultima = await listRecords(tableId, {
    fieldIds: [idFieldId],
    maxRecords: 1,
    sort: { field: idFieldId, direction: 'desc' },
  })

  let max = mayorConsecutivo(ultima, idFieldId, prefix)
  if (max >= TOPE_ORDEN_ALFABETICO) {
    max = mayorConsecutivo(await listRecords(tableId, { fieldIds: [idFieldId] }), idFieldId, prefix)
  }

  const siguiente = Math.max(max, entregados.get(prefix) ?? 0) + 1
  entregados.set(prefix, siguiente)

  return `${prefix}-${String(siguiente).padStart(RELLENO, '0')}`
}

// ── Serializacion de las escrituras ──────────────────────────────────────────
//
// Calcular el consecutivo y escribir la fila son dos pasos: si dos estudiantes
// envian al mismo tiempo, ambos pueden leer el mismo maximo y quedarse con el
// mismo codigo. Esta cola encadena las escrituras para que eso no pase dentro
// de una instancia. Entre instancias distintas (serverless) la ventana sigue
// existiendo, pero es de milisegundos y el peor caso es un codigo repetido en
// el comprobante, no un registro perdido.

let cola: Promise<unknown> = Promise.resolve()

export function enSerie<T>(tarea: () => Promise<T>): Promise<T> {
  const resultado = cola.then(tarea, tarea)
  cola = resultado.catch(() => undefined)
  return resultado
}

/** Normaliza un documento a solo digitos/letras, para comparar sin puntos. */
export function normalizarDocumento(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[^0-9A-Za-z]/g, '').toUpperCase().slice(0, 20)
}

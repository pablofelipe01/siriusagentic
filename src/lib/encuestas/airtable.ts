// src/lib/encuestas/airtable.ts
//
// Cliente REST mínimo de Airtable para las encuestas de tecnología.
// Sigue el mismo patrón que src/app/api/mediaAuth/route.ts: fetch directo a la
// API v0 con returnFieldsByFieldId, en vez del SDK, para trabajar siempre con
// IDs de campo (los nombres de campo en Airtable pueden cambiar; los IDs no).
//
// SOLO SERVIDOR: este módulo lee el token de Airtable. No importarlo desde
// componentes de cliente.

// Nota: no se usa el paquete 'server-only' (no está instalado); la protección
// es que este módulo solo se importa desde rutas de API bajo src/app/api.

const API = 'https://api.airtable.com/v0'

type AirtableRecord = {
  id: string
  createdTime: string
  fields: Record<string, unknown>
}

function credentials() {
  const token = process.env.AIRTABLE_ENCUESTAS_TOKEN
  const baseId = process.env.AIRTABLE_ENCUESTAS_BASE_ID

  if (!token || !baseId) {
    throw new Error(
      'Faltan AIRTABLE_ENCUESTAS_TOKEN o AIRTABLE_ENCUESTAS_BASE_ID en el entorno'
    )
  }
  return { token, baseId }
}

/** Lista todos los registros de una tabla, paginando hasta agotarlos. */
export async function listRecords(
  tableId: string,
  opts: { fieldIds?: string[]; filterByFormula?: string; pageSize?: number } = {}
): Promise<AirtableRecord[]> {
  const { token, baseId } = credentials()
  const out: AirtableRecord[] = []
  let offset: string | undefined

  do {
    const params = new URLSearchParams()
    params.set('returnFieldsByFieldId', 'true')
    params.set('pageSize', String(opts.pageSize ?? 100))
    if (opts.filterByFormula) params.set('filterByFormula', opts.filterByFormula)
    if (offset) params.set('offset', offset)
    for (const f of opts.fieldIds ?? []) params.append('fields[]', f)

    const res = await fetch(`${API}/${baseId}/${tableId}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`Airtable list ${tableId} → ${res.status}: ${body}`)
      throw new Error(`Airtable respondió ${res.status} al leer ${tableId}`)
    }

    const data = (await res.json()) as { records: AirtableRecord[]; offset?: string }
    out.push(...data.records)
    offset = data.offset
  } while (offset)

  return out
}

/** Crea registros en lotes de 10 (límite de la API de Airtable por request). */
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
      console.error(`Airtable create ${tableId} → ${res.status}: ${body}`)
      throw new Error(`Airtable respondió ${res.status} al escribir en ${tableId}`)
    }

    const data = (await res.json()) as { records: AirtableRecord[] }
    created.push(...data.records)
  }

  return created
}

/** Borra registros (se usa para revertir una respuesta a medio escribir). */
export async function deleteRecords(tableId: string, ids: string[]): Promise<void> {
  if (ids.length === 0) return
  const { token, baseId } = credentials()

  for (let i = 0; i < ids.length; i += 10) {
    const params = new URLSearchParams()
    for (const id of ids.slice(i, i + 10)) params.append('records[]', id)

    const res = await fetch(`${API}/${baseId}/${tableId}?${params.toString()}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`Airtable delete ${tableId} → ${res.status}: ${await res.text()}`)
    }
  }
}

/**
 * Calcula el siguiente ID correlativo (CLA-001, ALM-001, HER-001).
 * Lee los existentes y toma el máximo + 1, así no se reutilizan IDs si alguien
 * borra una fila intermedia.
 */
export async function nextCorrelativeId(
  tableId: string,
  idFieldId: string,
  prefix: string
): Promise<string> {
  const records = await listRecords(tableId, { fieldIds: [idFieldId] })
  let max = 0

  for (const r of records) {
    const value = r.fields[idFieldId]
    if (typeof value !== 'string') continue
    const m = value.match(new RegExp(`^${prefix}-(\\d+)$`))
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }

  return `${prefix}-${String(max + 1).padStart(3, '0')}`
}

// ── Rate limiting en memoria, por IP ─────────────────────────────────────────
// Mismo enfoque que src/app/api/media/route.ts. Es por instancia: en serverless
// no es una barrera dura, solo frena el envío repetido accidental o trivial.

const _rl = new Map<string, { count: number; reset: number }>()

export function checkRateLimit(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = _rl.get(ip)

  if (!entry || now > entry.reset) {
    _rl.set(ip, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count++
  return true
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'desconocida'
}

// ── Saneamiento de entrada ───────────────────────────────────────────────────

/** Texto libre: recorta y limita longitud. Conserva saltos de línea. */
export function sanitizeText(value: unknown, maxLen = 2000): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[<>]/g, '').trim().slice(0, maxLen)
}

/** Devuelve el valor solo si está dentro de la lista permitida. */
export function pickOne<T extends string>(
  value: unknown,
  allowed: readonly T[]
): T | undefined {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined
}

/** Filtra un arreglo dejando solo opciones válidas, sin duplicados. */
export function pickMany<T extends string>(
  value: unknown,
  allowed: readonly T[],
  maxItems = 20
): T[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const out: T[] = []
  for (const v of value) {
    if (typeof v !== 'string') continue
    if (!(allowed as readonly string[]).includes(v)) continue
    if (seen.has(v)) continue
    seen.add(v)
    out.push(v as T)
    if (out.length >= maxItems) break
  }
  return out
}

/** Rating 1-5. Cualquier otra cosa queda vacía (no se inventa un valor). */
export function pickRating(value: unknown): number | undefined {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : undefined
}

/** Elimina claves con valor undefined antes de enviarlas a Airtable. */
export function compact(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue
    if (typeof v === 'string' && v === '') continue
    if (Array.isArray(v) && v.length === 0) continue
    out[k] = v
  }
  return out
}

/** Fecha de hoy en formato ISO corto, que es lo que espera un campo date. */
export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

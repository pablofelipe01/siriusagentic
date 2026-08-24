// src/lib/eventos/ids.ts
//
// IDs de tabla y campo de la base de Airtable de asistencia a eventos.
//
// SOLO SERVIDOR y FUERA DEL REPOSITORIO: igual que en las encuestas, el mapa de
// la base se lee de la variable de entorno AIRTABLE_EVENTOS_IDS (un JSON), no
// se escribe aqui. Ver .env.eventos.example.
//
// La lectura es diferida (Proxy) para que la falta de la variable falle en la
// primera peticion que la necesite, y no durante `next build`.

const ASISTENTES_KEYS = [
  'id', 'nombre', 'tipoDocumento', 'documento', 'grado', 'curso',
  'correo', 'whatsapp', 'evento', 'fecha', 'estado', 'origen', 'notas',
  'autoriza', 'politica', 'firma',
] as const

type Ids = {
  tables: { asistentes: string }
  asistentes: Record<(typeof ASISTENTES_KEYS)[number], string>
}

const GRUPOS: { grupo: keyof Ids; claves: readonly string[] }[] = [
  { grupo: 'tables', claves: ['asistentes'] },
  { grupo: 'asistentes', claves: ASISTENTES_KEYS },
]

let cache: Ids | undefined

function parse(): Ids {
  if (cache) return cache

  const raw = process.env.AIRTABLE_EVENTOS_IDS
  if (!raw) {
    throw new Error('Falta AIRTABLE_EVENTOS_IDS en el entorno (ver .env.eventos.example)')
  }

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error('AIRTABLE_EVENTOS_IDS no es JSON valido')
  }
  if (typeof json !== 'object' || json === null) {
    throw new Error('AIRTABLE_EVENTOS_IDS debe ser un objeto JSON')
  }

  // Se valida completo de una vez: un ID faltante escribiria en el campo
  // equivocado (o en ninguno) sin error visible de Airtable.
  const obj = json as Record<string, unknown>
  const faltantes: string[] = []

  for (const { grupo, claves } of GRUPOS) {
    const sub = obj[grupo]
    if (typeof sub !== 'object' || sub === null) {
      faltantes.push(grupo)
      continue
    }
    const s = sub as Record<string, unknown>
    for (const clave of claves) {
      if (typeof s[clave] !== 'string' || !s[clave]) faltantes.push(`${grupo}.${clave}`)
    }
  }

  if (faltantes.length) {
    throw new Error(`AIRTABLE_EVENTOS_IDS incompleto: faltan ${faltantes.join(', ')}`)
  }

  cache = json as Ids
  return cache
}

function grupo<K extends keyof Ids>(nombre: K): Ids[K] {
  return new Proxy({} as Ids[K], {
    get: (_t, prop: string | symbol) =>
      typeof prop === 'string' ? (parse()[nombre] as Record<string, string>)[prop] : undefined,
    ownKeys: () => Object.keys(parse()[nombre] as object),
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
    has: (_t, prop) => prop in (parse()[nombre] as object),
  })
}

export const TABLES = grupo('tables')
export const F_ASISTENTES = grupo('asistentes')

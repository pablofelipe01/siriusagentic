// src/lib/encuestas/ids.ts
//
// IDs de tabla y campo de la base de Airtable de las encuestas de tecnología.
//
// SOLO SERVIDOR y FUERA DEL REPOSITORIO: los IDs no se escriben aquí, se leen
// de la variable de entorno AIRTABLE_ENCUESTAS_IDS (un JSON). Así el mapa de la
// base no queda publicado en el código. Ver .env.encuestas.example para la
// forma que debe tener el JSON.
//
// Nota: no se usa el paquete 'server-only' (no está instalado); la protección
// es que este módulo solo se importa desde rutas de API bajo src/app/api.
//
// La lectura es diferida (Proxy) para que la falta de la variable falle en la
// primera petición que la necesite, y no durante `next build`.

const TABLE_KEYS = ['claude', 'alma', 'herramientas', 'catalogo', 'usoPorApp'] as const

const CLAUDE_KEYS = [
  'id', 'fecha', 'nombre', 'area',
  'c1', 'c2', 'c2Otro', 'c3', 'c4', 'c5', 'c6', 'c6Num', 'c7', 'c7Otro', 'c8', 'c9',
  'c10Justificacion', 'codigo', 'estado',
] as const

const ALMA_KEYS = [
  'id', 'fecha', 'nombre', 'area',
  'a1', 'a2Fecha', 'a2Rango', 'a3', 'a4', 'a4Otro', 'a5', 'a6', 'a7', 'a7Otro', 'a8', 'a9',
  'codigo', 'estado',
] as const

const HER_KEYS = [
  'id', 'fecha', 'nombre', 'area',
  'h1Ninguna', 'h1Apps', 'h4', 'h4Otro', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'h11',
  'h12', 'h13', 'h14', 'codigo', 'estado',
] as const

const USO_KEYS = ['registro', 'h2', 'h3', 'abandono', 'respuesta', 'herramienta'] as const

const CATALOGO_KEYS = ['nombre', 'tipo', 'estado', 'descripcion', 'incluirEnEncuesta'] as const

type Ids = {
  tables: Record<(typeof TABLE_KEYS)[number], string>
  claude: Record<(typeof CLAUDE_KEYS)[number], string>
  alma: Record<(typeof ALMA_KEYS)[number], string>
  herramientas: Record<(typeof HER_KEYS)[number], string>
  usoPorApp: Record<(typeof USO_KEYS)[number], string>
  catalogo: Record<(typeof CATALOGO_KEYS)[number], string>
}

const GRUPOS: { grupo: keyof Ids; claves: readonly string[] }[] = [
  { grupo: 'tables', claves: TABLE_KEYS },
  { grupo: 'claude', claves: CLAUDE_KEYS },
  { grupo: 'alma', claves: ALMA_KEYS },
  { grupo: 'herramientas', claves: HER_KEYS },
  { grupo: 'usoPorApp', claves: USO_KEYS },
  { grupo: 'catalogo', claves: CATALOGO_KEYS },
]

let cache: Ids | undefined

function parse(): Ids {
  if (cache) return cache

  const raw = process.env.AIRTABLE_ENCUESTAS_IDS
  if (!raw) {
    throw new Error(
      'Falta AIRTABLE_ENCUESTAS_IDS en el entorno (ver .env.encuestas.example)'
    )
  }

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error('AIRTABLE_ENCUESTAS_IDS no es JSON válido')
  }
  if (typeof json !== 'object' || json === null) {
    throw new Error('AIRTABLE_ENCUESTAS_IDS debe ser un objeto JSON')
  }

  // Se valida completo de una vez: un ID faltante escribiría en el campo
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
    throw new Error(`AIRTABLE_ENCUESTAS_IDS incompleto: faltan ${faltantes.join(', ')}`)
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
export const F_CLAUDE = grupo('claude')
export const F_ALMA = grupo('alma')
export const F_HER = grupo('herramientas')
export const F_USO = grupo('usoPorApp')
export const F_CATALOGO = grupo('catalogo')

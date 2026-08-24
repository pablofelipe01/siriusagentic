// src/lib/encuestas/schema.ts
//
// Opciones y tipos compartidos por las tres encuestas de tecnologia.
//
// Este archivo lo importan tanto las rutas de API (servidor) como los
// formularios (cliente), de modo que las opciones que ve el equipo y las que se
// escriben en Airtable no puedan desincronizarse.
//
// Los nombres de las opciones deben coincidir EXACTAMENTE con los choices
// configurados en Airtable; si se cambian alla, hay que cambiarlos aqui.
//
// Los IDs de tabla y campo NO viven aqui: estan en src/lib/encuestas/ids.ts,
// que los lee de la variable de entorno AIRTABLE_ENCUESTAS_IDS.

// ── Opciones (deben coincidir literalmente con los choices de Airtable) ───────

export const AREAS = [
  'Tecnología / Desarrollo',
  'Operaciones',
  'Comercial',
  'Administrativa / Financiera',
  'SG-SST / Gestión Humana',
  'Dirección',
  'Prefiere no decir',
] as const

// Opciones de área que se muestran en el formulario. "Prefiere no decir" se
// mantiene en Airtable por compatibilidad con lo ya cargado, pero no se ofrece
// en la web: desde que la encuesta pide el nombre, esa opción no oculta nada.
export const AREAS_FORM = AREAS.filter((a) => a !== 'Prefiere no decir')

// Encuesta 1 — Claude
export const C1_FRECUENCIA = [
  'Todos los días',
  'Varias veces por semana',
  'Una vez por semana',
  'Rara vez',
  'Casi nunca / nunca',
] as const

export const C2_AREAS_USO = [
  'Código / desarrollo',
  'Documentación técnica',
  'Análisis de datos',
  'Redacción / comunicación',
  'Investigación / búsqueda de información',
  'Planificación / estrategia',
  'Otro',
] as const

export const C3_PLAN = ['Claude Max', 'Claude Pro', 'Versión gratuita', 'No lo uso'] as const

export const C5_FUNCIONES = [
  'Claude Code',
  'Artifacts',
  'Proyectos (Projects)',
  'Conectores (Drive, Slack, GitHub...)',
  'Búsqueda web integrada',
  'Ninguna de las anteriores',
] as const

export const C6_AHORRO = [
  '0-1 hora',
  '1-3 horas',
  '3-6 horas',
  'Más de 6 horas',
  'No estoy seguro/a',
] as const

// C6 → horas/semana (punto medio). "No estoy seguro/a" queda vacío a propósito:
// no se infiere un valor que la persona no dio.
export const C6_PUNTO_MEDIO: Record<string, number | null> = {
  '0-1 hora': 0.5,
  '1-3 horas': 2,
  '3-6 horas': 4.5,
  'Más de 6 horas': 7,
  'No estoy seguro/a': null,
}

export const C7_FRENOS = [
  'No conozco suficientes casos de uso',
  'Desconfío de la calidad de las respuestas',
  'Falta contexto de la empresa',
  'No tengo tiempo para aprender a usarlo bien',
  'Prefiero hacerlo yo mismo/a',
  'Otro',
] as const

// Encuesta 2 — Alma
export const A1_HA_USADO = ['Sí', 'No'] as const

export const A2_RANGO = [
  'Esta semana',
  'Este mes',
  'Hace 1-3 meses',
  'Hace más de 3 meses',
  'Nunca la he usado',
] as const

export const A3_FRECUENCIA = [
  'Todos los días',
  'Varias veces por semana',
  'Una vez por semana o menos',
  'La usé una vez y no volví',
  'Nunca la he usado',
] as const

export const A4_TAREAS = [
  'Consultas internas / documentación de la empresa',
  'Soporte a clientes',
  'Automatización de procesos',
  'Análisis de datos internos',
  'Otro',
] as const

export const A7_FRENOS = [
  'No sé exactamente para qué sirve',
  'Prefiero usar Claude directamente',
  'Las respuestas no son confiables o precisas',
  'Es lento o poco práctico de usar',
  'No la conocía / no sabía que existía',
  'Otro',
] as const

// Encuesta 3 — Herramientas
export const H2_FRECUENCIA = [
  'Todos los días',
  'Varias veces por semana',
  'Una vez por semana',
  'Rara vez',
  'Ya no la uso',
] as const

export const H2_ABANDONO = 'Ya no la uso'

export const H4_RAZONES = [
  'No sabía que existía',
  'No resuelve lo que necesito',
  'Es lenta o poco intuitiva',
  'Encontré otra forma de hacer lo mismo',
  'No aplica — no he dejado de usar ninguna',
  'Otro',
] as const

export const H6_AIRTABLE = [
  'Sí, todos los días',
  'Sí, varias veces por semana',
  'Sí, ocasionalmente',
  'Lo he usado muy poco',
  'No lo uso / no sé qué es',
] as const

export const H8_M365 = [
  'Correo electrónico (Outlook)',
  'Teams (chat y videollamadas)',
  'SharePoint',
  'Excel / Word / PowerPoint',
  'Ninguna de las anteriores',
] as const

export const H10_GOOGLE = [
  'Sí, lo uso más que Microsoft',
  'Sí, los uso ambos por igual',
  'Sí, pero poco',
  'No lo uso',
] as const

export const H12_DUPLICIDAD = ['Sí', 'No', 'No estoy seguro/a'] as const

export const ESTADO_SIN_PROCESAR = 'Sin procesar'

// ── Tipos compartidos cliente/servidor ───────────────────────────────────────

export type AppCatalogo = {
  id: string
  nombre: string
  descripcion?: string
}

export type UsoPorApp = {
  appId: string
  h2: string
  h3: number | null
}

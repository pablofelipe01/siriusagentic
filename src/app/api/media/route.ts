import { NextRequest, NextResponse } from 'next/server'
import {
  subirArchivo,
  buscarArchivos,
  obtenerUrl,
  archivarArchivo,
  eliminarArchivo,
  listarCarpeta,
} from '@/agent/mediaAgent'

// ── Rate limiting (in-memory, per IP) ────────────────────────────────────────
const _rl = new Map<string, { count: number; reset: number }>()
const RL_WINDOW = 60_000
const RL_MAX = 30
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const e = _rl.get(ip)
  if (!e || now > e.reset) { _rl.set(ip, { count: 1, reset: now + RL_WINDOW }); return true }
  if (e.count >= RL_MAX) return false
  e.count++
  return true
}

// ── Input sanitization ───────────────────────────────────────────────────────
function sanitize(value: string, maxLen = 200): string {
  return value.replace(/[<>"'`]/g, '').trim().slice(0, maxLen)
}

// ── Folder keywords — must not be captured as author in NLP ─────────────────
const FOLDER_KEYWORDS = new Set([
  'pirolisis', 'pirólisis', 'laboratorio', 'lab', 'sgsst', 'sg', 'sst',
  'seguridad', 'general', 'archivado', 'archived', 'video', 'videos', 'foto', 'fotos',
])

// ── Allowed upload types / sizes ─────────────────────────────────────────────
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic',
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mpeg',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB

type Carpeta =
  | 'fotos/pirolisis'
  | 'fotos/laboratorio'
  | 'fotos/sg-sst'
  | 'fotos/general'
  | 'videos/pirolisis'
  | 'videos/laboratorio'
  | 'archived'

const CARPETAS_VALIDAS: Carpeta[] = [
  'fotos/pirolisis',
  'fotos/laboratorio',
  'fotos/sg-sst',
  'fotos/general',
  'videos/pirolisis',
  'videos/laboratorio',
  'archived',
]

function detectarCarpeta(texto: string): Carpeta | undefined {
  const t = texto.toLowerCase()
  const esVideo = t.includes('video')
  if (t.includes('pirolisis') || t.includes('pirólisis'))
    return esVideo ? 'videos/pirolisis' : 'fotos/pirolisis'
  if (t.includes('laboratorio') || t.includes(' lab ') || t.endsWith('lab'))
    return esVideo ? 'videos/laboratorio' : 'fotos/laboratorio'
  if (t.includes('sg-sst') || t.includes('sgsst') || t.includes('seguridad') || t.includes(' sst'))
    return 'fotos/sg-sst'
  if (t.includes('general')) return 'fotos/general'
  if (esVideo) return 'videos/pirolisis'
  if (t.includes('archiv')) return 'archived'
  return undefined
}

const ENRICH_LIMIT = 48

function enrichFiles(files: Awaited<ReturnType<typeof listarCarpeta>>) {
  return files.slice(0, ENRICH_LIMIT).map((f) => ({
    id: f.id,
    name: f.name,
    cid: f.cid,
    url: obtenerUrl(f.cid),
    autor: (f.keyvalues as Record<string, string> | undefined)?.autor,
    descripcion: (f.keyvalues as Record<string, string> | undefined)?.descripcion,
    fecha: (f.keyvalues as Record<string, string> | undefined)?.fecha,
    carpeta: (f.keyvalues as Record<string, string> | undefined)?.carpeta,
  }))
}

export async function POST(request: NextRequest) {
  // Rate limit check
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta en un minuto.' }, { status: 429 })
  }

  try {
    const contentType = request.headers.get('content-type') ?? ''

    // ── File upload (multipart) ──────────────────────────────────────────────
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      const carpeta = formData.get('carpeta') as string | null
      const autor = formData.get('autor') as string | null
      const descripcion = formData.get('descripcion') as string | null

      if (!file || !carpeta || !autor || !descripcion) {
        return NextResponse.json({ error: 'Faltan campos: file, carpeta, autor, descripcion' }, { status: 400 })
      }
      if (!CARPETAS_VALIDAS.includes(carpeta as Carpeta)) {
        return NextResponse.json({ error: 'Carpeta inválida' }, { status: 400 })
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'El archivo supera el límite de 100 MB.' }, { status: 400 })
      }
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json({ error: 'Tipo de archivo no permitido.' }, { status: 400 })
      }

      const safeAutor = sanitize(autor, 80)
      const safeDesc  = sanitize(descripcion, 300)

      const result = await subirArchivo(file, carpeta as Carpeta, { autor: safeAutor, descripcion: safeDesc })
      const url = obtenerUrl(result.cid)

      return NextResponse.json({
        action: 'upload',
        success: true,
        file: { id: result.id, name: result.name, cid: result.cid, url, carpeta },
        message: `Archivo **${file.name}** subido a **${carpeta}** correctamente.`,
      })
    }

    // ── JSON commands ────────────────────────────────────────────────────────
    const body = await request.json()
    const { action, carpeta, autor, nombre, fileId, cid, comando } = body as {
      action?: string
      carpeta?: string
      autor?: string
      nombre?: string
      fileId?: string
      cid?: string
      comando?: string
    }

    // Natural language parsing
    if (comando) {
      const t = comando.toLowerCase()
      const carpetaDetectada = detectarCarpeta(t)

      // LIST / SHOW
      if (/lista|listar|ver|mostra|muestra|muéstrame|dame/.test(t)) {
        if (!carpetaDetectada) {
          return NextResponse.json({
            action: 'unknown',
            message:
              'Especifica la carpeta. Ej: *"lista fotos de laboratorio"*, *"muéstrame videos de pirólisis"*.',
          })
        }
        const files = await listarCarpeta(carpetaDetectada)
        const enriched = enrichFiles(files)
        return NextResponse.json({
          action: 'list',
          carpeta: carpetaDetectada,
          files: enriched,
          message:
            files.length === 0
              ? `No hay archivos en **${carpetaDetectada}** todavía.`
              : `${files.length} archivo(s) en **${carpetaDetectada}**:`,
        })
      }

      // SEARCH
      if (/busca|buscar|encuentra|encontrar|filtra/.test(t)) {
        // Extract author only if the word after 'de/por' is not a folder keyword
        const matches = [...t.matchAll(/(?:de|por)\s+([a-záéíóúüñ]+)/gi)]
        const autorBuscado = matches
          .map(m => m[1].toLowerCase())
          .find(w => !FOLDER_KEYWORDS.has(w))
        const result = await buscarArchivos({ carpeta: carpetaDetectada, autor: autorBuscado })
        const enriched = enrichFiles(result)
        return NextResponse.json({
          action: 'search',
          files: enriched,
          message:
            result.length === 0
              ? 'No encontré archivos con esos criterios.'
              : `${result.length} archivo(s) encontrado(s):`,
        })
      }

      // ARCHIVE
      if (/archiva|archivar/.test(t)) {
        const idMatch = t.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
        if (idMatch) {
          await archivarArchivo(idMatch[0])
          return NextResponse.json({ action: 'archive', success: true, message: 'Archivo movido a **archived**.' })
        }
        return NextResponse.json({
          action: 'archive',
          success: false,
          message: 'Por favor incluye el ID del archivo. Ej: *"archiva 01959f12-xxxx-..."*',
        })
      }

      // URL
      if (/url|link|enlace|obtener/.test(t)) {
        const cidMatch = t.match(/\b[A-Za-z0-9]{46}\b/)
        if (cidMatch) {
          const url = await obtenerUrl(cidMatch[0])
          return NextResponse.json({ action: 'url', url, message: `URL generada: ${url}` })
        }
      }

      return NextResponse.json({
        action: 'unknown',
        message:
          'No entendí el comando. Puedes pedirme:\n- *"lista fotos de laboratorio"*\n- *"busca videos de pirólisis de esta semana"*\n- *"archiva [ID]"*\n\nPara subir archivos usa el botón 📎.',
      })
    }

    // Direct structured actions
    switch (action) {
      case 'list': {
        if (!carpeta || !CARPETAS_VALIDAS.includes(carpeta as Carpeta))
          return NextResponse.json({ error: 'Carpeta inválida' }, { status: 400 })
        const files = await listarCarpeta(carpeta as Carpeta)
        const enriched = enrichFiles(files)
        return NextResponse.json({ action: 'list', carpeta, files: enriched })
      }
      case 'search': {
        const result = await buscarArchivos({ carpeta: carpeta as Carpeta | undefined, autor, nombre })
        const enriched = enrichFiles(result)
        return NextResponse.json({ action: 'search', files: enriched })
      }
      case 'archive': {
        if (!fileId) return NextResponse.json({ error: 'fileId requerido' }, { status: 400 })
        await archivarArchivo(fileId)
        return NextResponse.json({ action: 'archive', success: true })
      }
      case 'delete': {
        if (!fileId) return NextResponse.json({ error: 'fileId requerido' }, { status: 400 })
        await eliminarArchivo(fileId)
        return NextResponse.json({ action: 'delete', success: true })
      }
      case 'url': {
        if (!cid) return NextResponse.json({ error: 'cid requerido' }, { status: 400 })
        const url = obtenerUrl(cid)
        return NextResponse.json({ action: 'url', url })
      }
      default:
        return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 })
    }
  } catch (err) {
    console.error('[media API]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// src/app/api/eventos/asistencia/route.ts
//
// Registro de asistencia al evento del Colegio Francisco Walter.
// Crea una fila en la tabla "Asistentes" de la base de eventos.
//
// Lo llena un estudiante desde una pagina publica pero no enlazada, asi que la
// ruta no confia en nada del cliente: valida contra las listas de config.ts,
// limita envios por IP y rechaza documentos ya registrados.

import { NextResponse } from 'next/server'
import {
  createRecords,
  enSerie,
  listRecords,
  nextCorrelativeId,
  normalizarDocumento,
  clientIp,
  sanitizeText,
  pickOne,
  compact,
  today,
} from '@/lib/eventos/airtable'
import { permitir, mensaje } from '@/lib/eventos/rateLimit'
import { TABLES, F_ASISTENTES } from '@/lib/eventos/ids'
import {
  EVENTO,
  TIPOS_DOCUMENTO,
  GRADOS,
  POLITICA,
  ESTADO_INICIAL,
  ORIGEN_FORMULARIO,
} from '@/lib/eventos/config'

export const dynamic = 'force-dynamic'

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// La firma llega como data URL de PNG. Se acota por arriba porque un campo de
// texto largo de Airtable no admite mas de 100.000 caracteres, y por abajo
// porque un PNG en blanco (nadie firmo, solo tocaron el lienzo) pesa poquisimo.
const FIRMA_RE = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/
const FIRMA_MIN = 800
const FIRMA_MAX = 95_000

/** Deja solo digitos y el + inicial; Airtable acepta el telefono como texto. */
function normalizarTelefono(value: unknown): string {
  if (typeof value !== 'string') return ''
  const limpio = value.replace(/[^\d+]/g, '')
  return limpio.startsWith('+') ? `+${limpio.slice(1).replace(/\+/g, '')}` : limpio
}

// Tope del cuerpo de la peticion. Lo unico que puede ser grande es la firma, y
// el limite de esta ya es FIRMA_MAX; el resto son campos cortos. Cortar aqui
// evita gastar CPU parseando JSON de megabytes.
const CUERPO_MAX = 150_000

function error(texto: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ success: false, error: texto }, { status, headers })
}

export async function POST(request: Request) {
  const veredicto = permitir(clientIp(request))
  if (!veredicto.permitido) {
    // Retry-After le dice al navegador (y a un cliente honesto) cuando volver,
    // en vez de dejarlo reintentar a ciegas.
    return error(mensaje(veredicto.motivo), 429, {
      'Retry-After': String(Math.max(1, veredicto.reintentarEn)),
    })
  }

  // Cortar por tamano antes de leer el cuerpo: una peticion gigante no debe
  // llegar siquiera a JSON.parse.
  const declarado = Number(request.headers.get('content-length') ?? 0)
  if (declarado > CUERPO_MAX) {
    return error('El envío es demasiado grande.', 413)
  }

  let body: Record<string, unknown>
  try {
    const crudo = await request.text()
    if (crudo.length > CUERPO_MAX) return error('El envío es demasiado grande.', 413)
    body = JSON.parse(crudo) as Record<string, unknown>
  } catch {
    return error('Cuerpo inválido', 400)
  }
  if (typeof body !== 'object' || body === null) {
    return error('Cuerpo inválido', 400)
  }

  const nombre = sanitizeText(body.nombre, 120)
  if (nombre.trim().split(/\s+/).length < 2) {
    return error('Escribe tu nombre y apellidos completos.', 400)
  }

  const tipoDocumento = pickOne(body.tipoDocumento, TIPOS_DOCUMENTO)
  if (!tipoDocumento) return error('Falta el tipo de documento.', 400)

  const documento = normalizarDocumento(body.documento)
  if (documento.length < 5) return error('El número de documento no parece válido.', 400)

  const grado = pickOne(body.grado, GRADOS)
  if (!grado) return error('Falta indicar tu grado.', 400)

  // Correo y WhatsApp son opcionales. Si vienen vacios se omiten del registro
  // (compact() los descarta); si vienen con algo, tiene que ser algo valido:
  // un correo mal escrito en la lista de asistencia no sirve para nada.
  const correo = sanitizeText(body.correo, 120).toLowerCase()
  if (correo && !CORREO_RE.test(correo)) {
    return error('Revisa tu correo electrónico o déjalo vacío.', 400)
  }

  const whatsapp = normalizarTelefono(body.whatsapp)
  if (whatsapp && whatsapp.replace(/\D/g, '').length < 7) {
    return error('Revisa tu número de WhatsApp o déjalo vacío.', 400)
  }

  // El consentimiento se verifica en el servidor: es el requisito legal del
  // registro, no una casilla decorativa del formulario.
  if (body.autoriza !== true) {
    return error('Debes autorizar el tratamiento de tus datos para registrarte.', 400)
  }

  const firma = typeof body.firma === 'string' ? body.firma.trim() : ''
  if (!FIRMA_RE.test(firma) || firma.length < FIRMA_MIN) {
    return error('Falta tu firma. Dibújala en el recuadro antes de enviar.', 400)
  }
  if (firma.length > FIRMA_MAX) {
    return error('La firma quedó demasiado pesada. Bórrala y firma de nuevo.', 400)
  }

  try {
    // Un estudiante que toca "enviar" dos veces no debe aparecer dos veces en
    // la lista de asistencia. El documento es la llave natural.
    const yaRegistrado = await listRecords(TABLES.asistentes, {
      fieldIds: [F_ASISTENTES.documento],
      // documento ya viene reducido a letras y digitos, asi que no puede traer
      // comillas; el escape queda igual como red de seguridad de la formula.
      filterByFormula: `{${F_ASISTENTES.documento}} = '${documento.replace(/'/g, "\\'")}'`,
      maxRecords: 1,
    })
    if (yaRegistrado.length > 0) {
      return error('Ese documento ya está registrado para esta jornada.', 409)
    }

    // El consecutivo y la escritura van encadenados: ver enSerie().
    const id = await enSerie(async () => {
      const siguiente = await nextCorrelativeId(TABLES.asistentes, F_ASISTENTES.id, 'FW')
      await crear(siguiente)
      return siguiente
    })

    return NextResponse.json({ success: true, id })
  } catch (e) {
    console.error('Error al registrar asistencia al evento:', e)
    return error('No se pudo guardar tu registro. Intenta de nuevo.', 500)
  }

  async function crear(id: string) {
    const fields = compact({
      [F_ASISTENTES.id]: id,
      [F_ASISTENTES.nombre]: nombre,
      [F_ASISTENTES.tipoDocumento]: tipoDocumento,
      [F_ASISTENTES.documento]: documento,
      [F_ASISTENTES.grado]: grado,
      [F_ASISTENTES.correo]: correo,
      [F_ASISTENTES.whatsapp]: whatsapp,
      [F_ASISTENTES.evento]: EVENTO.nombre,
      [F_ASISTENTES.fecha]: today(),
      [F_ASISTENTES.estado]: ESTADO_INICIAL,
      [F_ASISTENTES.origen]: ORIGEN_FORMULARIO,
      [F_ASISTENTES.autoriza]: true,
      [F_ASISTENTES.politica]: `${POLITICA.version} — aceptada el ${today()}`,
      [F_ASISTENTES.firma]: firma,
    })

    await createRecords(TABLES.asistentes, [{ fields }])
  }
}

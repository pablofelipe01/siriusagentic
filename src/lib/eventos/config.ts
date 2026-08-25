// src/lib/eventos/config.ts
//
// Datos del evento y opciones validas del formulario de asistencia.
//
// Este archivo NO tiene secretos: lo importan tanto la pagina (cliente) como la
// ruta de API (servidor), para que las opciones que se muestran y las que se
// aceptan al guardar sean literalmente la misma lista. Si divergen, Airtable
// rechaza el valor y la respuesta del estudiante se pierde.
//
// Para el proximo evento basta con editar EVENTO: la estructura de Airtable
// no cambia.

export const EVENTO = {
  /** Titulo de la actividad. Es lo que queda escrito en la columna "Evento". */
  nombre: 'Taller de regeneración de suelos y conservación ambiental',
  /** Institucion con la que se hace el relacionamiento. */
  institucion: 'Institución Educativa Francisco Walter',
  /** Frase corta bajo el titulo. */
  descripcion:
    'Jornada participativa de siembra de plántulas con aplicación de biochar y recuperación del sendero ecológico de la institución. Registra tu asistencia para reservar tu cupo: toma menos de un minuto.',
  /**
   * Proposito del relacionamiento, resumido para el estudiante. El texto formal
   * completo vive en el acta de relacionamiento con partes interesadas; aqui va
   * la version que alguien de 14 anos lee sin abandonar el formulario.
   */
  proposito:
    'Vas a fortalecer tus conocimientos sobre conservación y regeneración de suelos, restauración ecológica y aprovechamiento de residuos orgánicos, y a participar directamente en la recuperación del entorno de tu colegio.',
} as const

// ── Interruptor del formulario ───────────────────────────────────────────────
//
// Cuando la jornada termina (o se aplaza) se pone en false: la pagina deja de
// mostrar el formulario y la ruta de API rechaza cualquier envio, incluso uno
// hecho a mano contra el endpoint. Los registros ya guardados no se tocan.
//
// Se deja como constante y no como variable de entorno a proposito: el estado
// del formulario queda versionado en el repo, visible en el historial.
export const INSCRIPCIONES_ABIERTAS = false

/** Mensaje que ve quien abre el link con las inscripciones cerradas. */
export const CIERRE = {
  titulo: 'Registro cerrado',
  detalle:
    'El registro de asistencia para esta jornada ya no está disponible. Si necesitas ayuda con tu inscripción, escribe a david@siriusregenerative.com.',
} as const

export const TIPOS_DOCUMENTO = ['TI', 'CC', 'CE', 'PPT', 'Pasaporte'] as const
export const GRADOS = ['9', '10', '11'] as const

// ── Tratamiento de datos ─────────────────────────────────────────────────────
//
// La autorizacion se guarda junto con la version del aviso que se mostro. Si
// manana cambia el texto, las autorizaciones viejas siguen diciendo a que
// texto exacto dijo que si cada estudiante, que es lo que exige la Ley 1581.

export const POLITICA = {
  version: 'v1 (2026-08-24)',
  url: 'https://www.siriusregenerative.com/politica-de-tratamiento-de-datos',
  /** Correo de contacto para consulta, actualizacion o supresion de datos. */
  correo: 'david@siriusregenerative.com',
  /** Texto del aviso, sobre el checkbox de autorizacion. */
  aviso:
    'Autorizo a Sirius Regenerative Solutions S.A.S. ZOMAC a recolectar y tratar mis datos personales y mi firma con el único fin de gestionar mi inscripción, el control de asistencia y la comunicación relacionada con esta actividad de relacionamiento con la comunidad educativa. Conozco que puedo consultar, actualizar o solicitar la supresión de mis datos escribiendo a david@siriusregenerative.com, conforme a la Ley 1581 de 2012.',
} as const

/** Estado inicial de todo registro creado desde el formulario. */
export const ESTADO_INICIAL = 'Registrado'
export const ORIGEN_FORMULARIO = 'Formulario web'

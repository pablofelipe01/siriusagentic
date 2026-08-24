// src/lib/eventos/rateLimit.ts
//
// Limitador de peticiones para el formulario publico de asistencia.
//
// Que si resuelve y que no:
//  · SI frena el abuso de una IP (scripts, envios repetidos, un curso entero
//    dandole al boton) y protege la cuota de Airtable, que es el recurso caro
//    y el primero en caerse.
//  · NO sustituye un WAF. Un DDoS real, distribuido en miles de IPs, hay que
//    cortarlo antes de que llegue a la funcion: en Vercel es Firewall/Attack
//    Challenge Mode, o Cloudflare delante. En serverless este contador vive en
//    memoria de cada instancia, asi que el limite efectivo se multiplica por el
//    numero de instancias activas.
//
// Tres capas, en orden de coste:
//  1. Rafaga por IP: pocas peticiones por minuto.
//  2. Sostenido por IP: tope por hora, para el goteo lento.
//  3. Global: techo de escrituras por segundo contra Airtable, sin importar de
//     donde vengan. Es lo unico que salva la base cuando el ataque es
//     distribuido y ninguna IP individual pasa de su limite.

type Marca = number[]

const RAFAGA = { max: 4, ventanaMs: 60_000 }
const SOSTENIDO = { max: 20, ventanaMs: 60 * 60_000 }
const GLOBAL = { max: 12, ventanaMs: 10_000 }

// Tope de IPs vigiladas. El mapa en si es superficie de ataque: sin este tope,
// un atacante con IPs falsificadas en X-Forwarded-For podria hacerlo crecer
// hasta agotar la memoria de la instancia.
const MAX_CLAVES = 5_000

const porIp = new Map<string, Marca>()
let global: Marca = []

function limpiar(marcas: Marca, ventanaMs: number, ahora: number): Marca {
  const desde = ahora - ventanaMs
  // Las marcas se guardan en orden ascendente: basta con cortar el prefijo viejo.
  let i = 0
  while (i < marcas.length && marcas[i] <= desde) i++
  return i === 0 ? marcas : marcas.slice(i)
}

/** Descarta las IPs cuyas marcas ya expiraron; si aun sobra, suelta las mas viejas. */
function podar(ahora: number) {
  for (const [ip, marcas] of porIp) {
    const vivas = limpiar(marcas, SOSTENIDO.ventanaMs, ahora)
    if (vivas.length === 0) porIp.delete(ip)
    else if (vivas !== marcas) porIp.set(ip, vivas)
  }
  if (porIp.size <= MAX_CLAVES) return

  // Map conserva el orden de insercion: las primeras claves son las mas viejas.
  const sobran = porIp.size - MAX_CLAVES
  let n = 0
  for (const ip of porIp.keys()) {
    porIp.delete(ip)
    if (++n >= sobran) break
  }
}

export type Veredicto =
  | { permitido: true }
  | { permitido: false; motivo: 'rafaga' | 'sostenido' | 'global'; reintentarEn: number }

/**
 * Registra un intento de la IP dada y dice si se le permite pasar.
 * `reintentarEn` va en segundos, para la cabecera Retry-After.
 */
export function permitir(ip: string, ahora = Date.now()): Veredicto {
  global = limpiar(global, GLOBAL.ventanaMs, ahora)
  if (global.length >= GLOBAL.max) {
    return {
      permitido: false,
      motivo: 'global',
      reintentarEn: Math.ceil((global[0] + GLOBAL.ventanaMs - ahora) / 1000),
    }
  }

  if (porIp.size > MAX_CLAVES) podar(ahora)

  const marcas = limpiar(porIp.get(ip) ?? [], SOSTENIDO.ventanaMs, ahora)

  const rafaga = limpiar(marcas, RAFAGA.ventanaMs, ahora)
  if (rafaga.length >= RAFAGA.max) {
    porIp.set(ip, marcas)
    return {
      permitido: false,
      motivo: 'rafaga',
      reintentarEn: Math.ceil((rafaga[0] + RAFAGA.ventanaMs - ahora) / 1000),
    }
  }

  if (marcas.length >= SOSTENIDO.max) {
    porIp.set(ip, marcas)
    return {
      permitido: false,
      motivo: 'sostenido',
      reintentarEn: Math.ceil((marcas[0] + SOSTENIDO.ventanaMs - ahora) / 1000),
    }
  }

  marcas.push(ahora)
  porIp.set(ip, marcas)
  global.push(ahora)
  return { permitido: true }
}

/** Mensaje para el estudiante. No revela los limites exactos. */
export function mensaje(motivo: 'rafaga' | 'sostenido' | 'global'): string {
  if (motivo === 'global') {
    return 'Hay muchos registros llegando al tiempo. Espera unos segundos y vuelve a enviar.'
  }
  return 'Demasiados intentos desde esta conexión. Espera unos minutos e intenta de nuevo.'
}

/** Solo para pruebas: reinicia los contadores. */
export function reiniciar() {
  porIp.clear()
  global = []
}

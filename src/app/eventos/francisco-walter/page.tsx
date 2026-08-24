// Pagina OCULTA: registro de asistencia al evento del Colegio Francisco Walter.
//
// "Oculta" aqui significa no enlazada desde ningun menu del sitio y marcada
// noindex/nofollow, de modo que solo llega quien recibe el link. No lleva
// autenticacion a proposito: son estudiantes de 9 a 11 llenandola desde el
// celular, y cualquier paso extra se traduce en registros perdidos.

import type { Metadata } from 'next'
import FormularioAsistencia from './FormularioAsistencia'

export const metadata: Metadata = {
  title: 'Registro de asistencia',
  robots: { index: false, follow: false, nocache: true },
}

export default function RegistroEventoPage() {
  return <FormularioAsistencia />
}

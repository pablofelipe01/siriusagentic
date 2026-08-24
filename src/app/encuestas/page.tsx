// src/app/encuestas/page.tsx
//
// Portada de las tres encuestas de tecnología. Es la URL que se comparte con el
// equipo: siriusagentic.com/encuestas

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Encuestas de Tecnología · Sirius',
  description:
    'Tres encuestas cortas sobre el uso de Claude, Alma y las herramientas internas de Sirius.',
}

const FUENTE = 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'

const ENCUESTAS = [
  {
    href: '/encuestas/claude',
    indice: '01',
    titulo: 'Uso de Claude',
    duracion: '5 min',
    preguntas: '10 preguntas',
    descripcion:
      'Con qué frecuencia lo usas, para qué te sirve de verdad y qué te frena para usarlo más.',
  },
  {
    href: '/encuestas/alma',
    indice: '02',
    titulo: 'Uso del agente Alma',
    duracion: '3 min',
    preguntas: '9 preguntas',
    descripcion:
      'Si la usas, cómo te va. Si no la usas o la abandonaste, por qué: esa respuesta es la más útil de todas.',
  },
  {
    href: '/encuestas/herramientas',
    indice: '03',
    titulo: 'Aplicaciones internas y herramientas',
    duracion: '7 min',
    preguntas: '14 preguntas',
    descripcion:
      'Qué apps de Sirius usas realmente, qué tanto te ayudan y qué herramienta contratada eliminarías.',
  },
]

export default function EncuestasPage() {
  return (
    <div className="min-h-screen bg-[#070B12] text-[#E8EEF4]" style={{ fontFamily: FUENTE }}>
      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#8FA3B5] transition-colors hover:text-[#E8EEF4]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          siriusagentic.com
        </Link>

        <header className="mt-7 border-b border-white/[0.09] pb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#00A3FF]">
            Diagnóstico interno · 2026
          </p>
          <h1 className="mt-3 text-[30px] font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[42px]">
            Encuestas de tecnología
          </h1>
          <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-[#8FA3B5]">
            Estas tres encuestas nos dicen qué herramientas están sirviendo y cuáles no. Con eso
            decidimos en qué invertir más y qué dejar de pagar. Cada una pide tu nombre y el área
            en la que trabajas.
          </p>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-[#8FA3B5]">
            Si puedes, respóndelas las tres. Al cruzarlas aparecen cosas que por separado no se
            ven: por ejemplo, quiénes usan Claude a diario pero nunca abrieron Alma. Los resultados
            se presentan de forma agregada, por área y por herramienta.
          </p>
        </header>

        <ol className="mt-2">
          {ENCUESTAS.map(({ href, indice, titulo, duracion, preguntas, descripcion }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-start gap-5 border-b border-white/[0.07] py-7 transition-colors hover:bg-white/[0.02]"
              >
                <span className="mt-1 font-mono text-[13px] text-[#00A3FF]">{indice}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-medium tracking-[-0.01em] text-[#E8EEF4] transition-colors group-hover:text-white sm:text-[19px]">
                    {titulo}
                  </span>
                  <span className="mt-2 block max-w-[58ch] text-[14px] leading-relaxed text-[#8FA3B5]">
                    {descripcion}
                  </span>
                  <span className="mt-3 flex items-center gap-3 text-[12px] text-[#4A6076]">
                    <span>{preguntas}</span>
                    <span aria-hidden>·</span>
                    <span>{duracion}</span>
                  </span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#4A6076] transition-all group-hover:translate-x-1 group-hover:text-[#00A3FF]" />
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  )
}

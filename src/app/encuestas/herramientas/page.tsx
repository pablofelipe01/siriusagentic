'use client'

// ENCUESTA 3 — Aplicaciones internas y herramientas tecnológicas.
//
// La lista de apps de la sección 1 NO está escrita en el código: se lee del
// Catálogo de Herramientas de Airtable. Así, cuando Tecnología publica una app
// nueva, aparece en la encuesta sin tocar este archivo.
//
// Las cuadrículas H2 y H3 del cuestionario original se muestran solo para las
// apps que la persona marcó en H1: preguntar por 17 apps que no usa es la forma
// más rápida de que abandone el formulario.

import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  SurveyShell,
  Section,
  Question,
  RadioGroup,
  CheckboxGroup,
  RatingInput,
  TextArea,
  TextInput,
  Identificacion,
  SubmitBar,
  Gracias,
} from '@/components/encuestas/FormKit'
import {
  AREAS_FORM,
  H2_FRECUENCIA,
  H4_RAZONES,
  H6_AIRTABLE,
  H8_M365,
  H10_GOOGLE,
  H12_DUPLICIDAD,
  type AppCatalogo,
} from '@/lib/encuestas/schema'

const NINGUNA = 'Ninguna de las anteriores'

export default function EncuestaHerramientasPage() {
  const [apps, setApps] = useState<AppCatalogo[]>([])
  const [cargando, setCargando] = useState(true)
  const [errorCatalogo, setErrorCatalogo] = useState<string | null>(null)

  const [nombre, setNombre] = useState('')
  const [area, setArea] = useState('')
  const [h1, setH1] = useState<string[]>([]) // nombres de apps marcadas
  const [h2, setH2] = useState<Record<string, string>>({}) // appId → frecuencia
  const [h3, setH3] = useState<Record<string, number>>({}) // appId → 1-5
  const [h4, setH4] = useState<string[]>([])
  const [h4Otro, setH4Otro] = useState('')
  const [h5, setH5] = useState('')
  const [h6, setH6] = useState('')
  const [h7, setH7] = useState('')
  const [h8, setH8] = useState<string[]>([])
  const [h9, setH9] = useState<number | null>(null)
  const [h10, setH10] = useState('')
  const [h11, setH11] = useState('')
  const [h12, setH12] = useState('')
  const [h13, setH13] = useState('')
  const [h14, setH14] = useState('')

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idGuardado, setIdGuardado] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true
    fetch('/api/encuestas/catalogo')
      .then((r) => r.json())
      .then((data: { success: boolean; apps?: AppCatalogo[]; error?: string }) => {
        if (!vigente) return
        if (!data.success || !data.apps) throw new Error(data.error ?? 'Error')
        setApps(data.apps)
      })
      .catch(() => {
        if (vigente) setErrorCatalogo('No se pudo cargar la lista de aplicaciones internas.')
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [])

  const opcionesH1 = [...apps.map((a) => a.nombre), NINGUNA]
  const ninguna = h1.includes(NINGUNA)
  const seleccionadas = apps.filter((a) => h1.includes(a.nombre))

  // Las 14 preguntas del cuestionario. La 2 y la 3 cuentan como una sola: son
  // la misma cuadrícula y se responden juntas por aplicación.
  const gridCompleto =
    seleccionadas.length > 0 &&
    seleccionadas.every((a) => h2[a.id] !== undefined && h3[a.id] !== undefined)
  const respondidas = [
    h1.length > 0,
    gridCompleto,
    h4.length > 0,
    h5.trim(),
    h6,
    h7.trim(),
    h8.length > 0,
    h9,
    h10,
    h11.trim(),
    h12,
    h13.trim(),
    h14.trim(),
  ].filter(Boolean).length

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (enviando) return
    setError(null)

    if (nombre.trim().length < 2) {
      setError('Falta tu nombre.')
      return
    }
    if (!area) {
      setError('Falta indicar el área en la que trabajas.')
      return
    }

    setEnviando(true)

    const usos = seleccionadas.map((app) => ({
      appId: app.id,
      h2: h2[app.id] ?? '',
      h3: h3[app.id] ?? null,
    }))

    try {
      const res = await fetch('/api/encuestas/herramientas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          area,
          h1Ninguna: ninguna,
          usos,
          h4,
          h4Otro,
          h5,
          h6,
          h7,
          h8,
          h9,
          h10,
          h11,
          h12,
          h13,
          h14,
        }),
      })
      const data = (await res.json()) as { success: boolean; id?: string; error?: string }
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Error desconocido')
      setIdGuardado(data.id ?? '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la respuesta.')
    } finally {
      setEnviando(false)
    }
  }

  if (idGuardado !== null) {
    return (
      <SurveyShell
        paso="Encuesta 3 de 3"
        titulo="Aplicaciones internas y herramientas"
        intro="Listo."
      >
        <Gracias id={idGuardado} />
      </SurveyShell>
    )
  }

  return (
    <SurveyShell
      paso="Encuesta 3 de 3"
      titulo="Aplicaciones internas y herramientas"
      intro="En Sirius hemos desarrollado varias aplicaciones internas y contratado distintas herramientas. Esta encuesta busca entender qué usas realmente, con qué frecuencia y qué tanto te ayuda, para decidir en qué invertir y qué ajustar. Responder que no usas algo no le hace daño a nadie: es justamente el dato que falta."
      progreso={{ respondidas, total: 13 }}
    >
      <form onSubmit={enviar}>
        <Section indice={1} titulo="Quién responde">
          <Identificacion
            nombre={nombre}
            onNombre={setNombre}
            area={area}
            onArea={setArea}
            areas={AREAS_FORM}
          />
        </Section>

        <Section
          indice={2}
          titulo="Aplicaciones internas de Sirius"
          descripcion="La lista se lee del catálogo de Tecnología, así que siempre está al día."
        >
          <Question
            numero="1"
            enunciado="¿Cuáles de las siguientes aplicaciones internas usas?"
            ayuda="Marca las que uses hoy o hayas usado alguna vez. Puedes marcar varias."
          >
            {cargando ? (
              <p className="flex items-center gap-2 text-[13px] text-[#4A6076]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Cargando aplicaciones…
              </p>
            ) : errorCatalogo ? (
              <p className="rounded-md border border-[#FF5A5A]/30 bg-[#FF5A5A]/[0.08] px-4 py-3 text-[13px] text-[#FFB3B3]">
                {errorCatalogo} Recarga la página; si sigue fallando, avísale a Tecnología.
              </p>
            ) : (
              <CheckboxGroup
                options={opcionesH1}
                values={h1}
                onChange={setH1}
                exclusiva={NINGUNA}
              />
            )}
          </Question>

          {seleccionadas.length > 0 && (
            <Question
              numero="2·3"
              enunciado="Para cada aplicación que marcaste, ¿con qué frecuencia la usas y qué tanto te ayuda?"
              ayuda="Solo aparecen las que marcaste arriba."
            >
              <div className="flex flex-col gap-3">
                {seleccionadas.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-lg border border-white/[0.09] bg-white/[0.02] p-5"
                  >
                    <p className="text-[14px] font-semibold text-[#E8EEF4]">{app.nombre}</p>
                    {app.descripcion && (
                      <p className="mt-1 text-[12px] leading-relaxed text-[#4A6076]">
                        {app.descripcion}
                      </p>
                    )}

                    <p className="mt-5 text-[11px] uppercase tracking-[0.12em] text-[#4A6076]">
                      Frecuencia de uso
                    </p>
                    <div className="mt-3">
                      <RadioGroup
                        name={`h2-${app.id}`}
                        options={H2_FRECUENCIA}
                        value={h2[app.id] ?? ''}
                        onChange={(v) => setH2((prev) => ({ ...prev, [app.id]: v }))}
                      />
                    </div>

                    <p className="mt-6 text-[11px] uppercase tracking-[0.12em] text-[#4A6076]">
                      ¿Qué tanto te ayuda?
                    </p>
                    <div className="mt-3">
                      <RatingInput
                        value={h3[app.id] ?? null}
                        onChange={(v) => setH3((prev) => ({ ...prev, [app.id]: v }))}
                        etiquetaBaja="no me aporta nada"
                        etiquetaAlta="es indispensable"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Question>
          )}

          <Question
            numero="4"
            enunciado="Si dejaste de usar alguna aplicación interna, ¿por qué?"
            ayuda="Puedes marcar varias."
          >
            <CheckboxGroup
              options={H4_RAZONES}
              values={h4}
              onChange={setH4}
              exclusiva="No aplica — no he dejado de usar ninguna"
            />
            {h4.includes('Otro') && (
              <div className="mt-3">
                <TextInput value={h4Otro} onChange={setH4Otro} placeholder="¿Por qué otra razón?" />
              </div>
            )}
          </Question>

          <Question
            numero="5"
            enunciado="¿Qué funcionalidad te gustaría que tuviera alguna de estas aplicaciones y hoy no tiene?"
          >
            <TextArea
              value={h5}
              onChange={setH5}
              placeholder="Di cuál app y qué le falta. Esto se convierte directamente en backlog."
            />
          </Question>
        </Section>

        <Section indice={3} titulo="Herramientas externas contratadas">
          <Question numero="6" enunciado="¿Usas Airtable?">
            <RadioGroup name="h6" options={H6_AIRTABLE} value={h6} onChange={setH6} />
          </Question>

          {h6 !== '' && h6 !== 'No lo uso / no sé qué es' && (
            <Question
              numero="7"
              enunciado="¿Para qué usas Airtable principalmente?"
              ayuda="Opcional."
            >
              <TextArea value={h7} onChange={setH7} rows={3} />
            </Question>
          )}

          <Question
            numero="8"
            enunciado="¿Usas las herramientas de Microsoft 365 / Teams?"
            ayuda="Puedes marcar varias."
          >
            <CheckboxGroup
              options={H8_M365}
              values={h8}
              onChange={setH8}
              exclusiva="Ninguna de las anteriores"
            />
          </Question>

          <Question
            numero="9"
            enunciado="Del 1 al 5, ¿qué tan esencial es Microsoft 365 / Teams para tu trabajo diario?"
          >
            <RatingInput
              value={h9}
              onChange={setH9}
              etiquetaBaja="nada esencial"
              etiquetaAlta="totalmente esencial"
            />
          </Question>

          <Question
            numero="10"
            enunciado="¿Usas Google Workspace (Drive, Docs, Sheets, Gmail) además o en lugar de Microsoft?"
          >
            <RadioGroup name="h10" options={H10_GOOGLE} value={h10} onChange={setH10} />
          </Question>
        </Section>

        <Section
          indice={4}
          titulo="Visión general del stack"
          descripcion="Aquí es donde suelen aparecer las duplicidades y las herramientas que nadie usa."
        >
          <Question
            numero="11"
            enunciado="Además de lo mencionado, ¿qué otras herramientas o software pagos usas regularmente para trabajar?"
            ayuda="Ej. Slack, Notion, Zoom, Figma, un CRM. Incluye las que pagas tú y las que paga la empresa."
          >
            <TextArea value={h11} onChange={setH11} rows={3} />
          </Question>

          <Question
            numero="12"
            enunciado="¿Sientes que hay herramientas duplicadas en la empresa (dos que hacen lo mismo)?"
          >
            <RadioGroup name="h12" options={H12_DUPLICIDAD} value={h12} onChange={setH12} />
          </Question>

          {h12 === 'Sí' && (
            <Question numero="13" enunciado="¿Cuáles crees que se duplican?">
              <TextArea value={h13} onChange={setH13} rows={3} />
            </Question>
          )}

          <Question
            numero="14"
            enunciado="Si tuvieras que eliminar UNA herramienta de las que usas hoy sin afectar tu trabajo, ¿cuál sería?"
            ayuda="Pregunta incómoda a propósito: obliga a priorizar. Responde con criterio de negocio, no de gusto personal."
          >
            <div className="max-w-md">
              <TextInput value={h14} onChange={setH14} placeholder="Nombre de la herramienta" />
            </div>
          </Question>
        </Section>

        <SubmitBar enviando={enviando} error={error} />
      </form>
    </SurveyShell>
  )
}

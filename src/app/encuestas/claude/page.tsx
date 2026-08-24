'use client'

// ENCUESTA 1 — Uso de Claude en el equipo.
// Las 10 preguntas del cuestionario original, en el mismo orden y agrupadas en
// las secciones que ya traía el documento, precedidas por la identificación de
// quien responde. Escribe en "Respuestas Claude".

import React, { useState } from 'react'
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
  C1_FRECUENCIA,
  C2_AREAS_USO,
  C3_PLAN,
  C5_FUNCIONES,
  C6_AHORRO,
  C7_FRENOS,
} from '@/lib/encuestas/schema'

export default function EncuestaClaudePage() {
  const [nombre, setNombre] = useState('')
  const [area, setArea] = useState('')
  const [c1, setC1] = useState('')
  const [c2, setC2] = useState<string[]>([])
  const [c2Otro, setC2Otro] = useState('')
  const [c3, setC3] = useState('')
  const [c4, setC4] = useState('')
  const [c5, setC5] = useState<string[]>([])
  const [c6, setC6] = useState('')
  const [c7, setC7] = useState<string[]>([])
  const [c7Otro, setC7Otro] = useState('')
  const [c8, setC8] = useState('')
  const [c9, setC9] = useState<number | null>(null)
  const [c10, setC10] = useState('')

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idGuardado, setIdGuardado] = useState<string | null>(null)

  // Progreso sobre las 10 preguntas del cuestionario. Nombre y área no cuentan:
  // son identificación, no respuestas.
  const respondidas = [
    c1,
    c2.length > 0,
    c3,
    c4.trim(),
    c5.length > 0,
    c6,
    c7.length > 0,
    c8.trim(),
    c9,
    c10.trim(),
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
    if (!c1) {
      setError('Falta responder la pregunta 1: con qué frecuencia usas Claude.')
      return
    }

    setEnviando(true)
    try {
      const res = await fetch('/api/encuestas/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          area,
          c1,
          c2,
          c2Otro,
          c3,
          c4,
          c5,
          c6,
          c7,
          c7Otro,
          c8,
          c9,
          c10,
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
      <SurveyShell paso="Encuesta 1 de 3" titulo="Uso de Claude en el equipo" intro="Listo.">
        <Gracias
          id={idGuardado}
          siguiente={{ href: '/encuestas/alma', texto: 'Continuar con la encuesta de Alma' }}
        />
      </SurveyShell>
    )
  }

  return (
    <SurveyShell
      paso="Encuesta 1 de 3"
      titulo="Uso de Claude en el equipo"
      intro="Queremos entender cómo usas Claude de verdad en tu día a día, no cómo debería usarse. Responde con honestidad: si casi no lo usas, esa también es una respuesta útil. Toma unos 5 minutos."
      progreso={{ respondidas, total: 10 }}
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
          titulo="Frecuencia y contexto"
          descripcion="Dónde encaja Claude en tu trabajo hoy."
        >
          <Question numero="1" enunciado="¿Con qué frecuencia usas Claude?" obligatoria>
            <RadioGroup name="c1" options={C1_FRECUENCIA} value={c1} onChange={setC1} />
          </Question>

          <Question
            numero="2"
            enunciado="¿En qué áreas de tu trabajo lo usas más?"
            ayuda="Puedes marcar varias."
          >
            <CheckboxGroup options={C2_AREAS_USO} values={c2} onChange={setC2} />
            {c2.includes('Otro') && (
              <div className="mt-3">
                <TextInput value={c2Otro} onChange={setC2Otro} placeholder="¿Cuál otra área?" />
              </div>
            )}
          </Question>

          <Question numero="3" enunciado="¿Qué plan usas actualmente?">
            <RadioGroup name="c3" options={C3_PLAN} value={c3} onChange={setC3} />
          </Question>
        </Section>

        <Section
          indice={3}
          titulo="Para qué lo usas realmente"
          descripcion="Un ejemplo concreto vale más que cualquier promedio."
        >
          <Question
            numero="4"
            enunciado="Describe en 1-2 frases la tarea más útil que resolviste con Claude la última semana."
            ayuda="Concreta, no general. Un caso real dice mucho más que una descripción abstracta."
          >
            <TextArea
              value={c4}
              onChange={setC4}
              placeholder="Ej. Revisé el contrato de un proveedor y saqué en 10 minutos las cláusulas que había que negociar."
            />
          </Question>

          <Question
            numero="5"
            enunciado="¿Usas alguna función o integración específica?"
            ayuda="Puedes marcar varias."
          >
            <CheckboxGroup
              options={C5_FUNCIONES}
              values={c5}
              onChange={setC5}
              exclusiva="Ninguna de las anteriores"
            />
          </Question>
        </Section>

        <Section
          indice={4}
          titulo="Fricción y valor"
          descripcion="Qué te está costando y qué te está ahorrando."
        >
          <Question
            numero="6"
            enunciado="¿Cuánto tiempo estimas que te ahorra por semana?"
            ayuda="Un estimado a ojo está bien. Si no sabes, dilo: es mejor que inventar una cifra."
          >
            <RadioGroup name="c6" options={C6_AHORRO} value={c6} onChange={setC6} />
          </Question>

          <Question numero="7" enunciado="¿Qué te frena para usarlo más?" ayuda="Elige hasta 2.">
            <CheckboxGroup options={C7_FRENOS} values={c7} onChange={setC7} max={2} />
            {c7.includes('Otro') && (
              <div className="mt-3">
                <TextInput
                  value={c7Otro}
                  onChange={setC7Otro}
                  placeholder="¿Qué otra cosa te frena?"
                />
              </div>
            )}
          </Question>

          <Question numero="8" enunciado="¿Qué te gustaría poder hacer con Claude que hoy no haces?">
            <TextArea
              value={c8}
              onChange={setC8}
              placeholder="Lo que sea: algo que intentaste y no funcionó, o algo que ni has intentado."
            />
          </Question>
        </Section>

        <Section indice={5} titulo="Percepción general">
          <Question
            numero="9"
            enunciado="Del 1 al 5, ¿qué tan indispensable sientes que es Claude en tu flujo de trabajo actual?"
          >
            <RatingInput
              value={c9}
              onChange={setC9}
              etiquetaBaja="prescindible"
              etiquetaAlta="indispensable"
            />
          </Question>

          <Question
            numero="10"
            enunciado="¿Recomendarías que más compañeros tuvieran acceso a un plan pago (Pro/Max)? ¿Por qué?"
          >
            <TextArea
              value={c10}
              onChange={setC10}
              placeholder="Responde sí o no y explica por qué. El 'por qué' es lo que se usa para decidir."
            />
          </Question>
        </Section>

        <SubmitBar enviando={enviando} error={error} />
      </form>
    </SurveyShell>
  )
}

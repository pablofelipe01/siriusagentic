'use client'

// ENCUESTA 2 — Uso del agente Alma.
// Reproduce la lógica condicional del cuestionario original: si A1 = "No", se
// ocultan A2-A8 y se muestra directamente A9. A9 también aparece cuando la
// persona dice que la usó una vez y no volvió, o que nunca la ha usado.

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
  A1_HA_USADO,
  A2_RANGO,
  A3_FRECUENCIA,
  A4_TAREAS,
  A7_FRENOS,
} from '@/lib/encuestas/schema'

export default function EncuestaAlmaPage() {
  const [nombre, setNombre] = useState('')
  const [area, setArea] = useState('')
  const [a1, setA1] = useState('')
  const [a2, setA2] = useState('')
  const [a3, setA3] = useState('')
  const [a4, setA4] = useState<string[]>([])
  const [a4Otro, setA4Otro] = useState('')
  const [a5, setA5] = useState('')
  const [a6, setA6] = useState<number | null>(null)
  const [a7, setA7] = useState<string[]>([])
  const [a7Otro, setA7Otro] = useState('')
  const [a8, setA8] = useState('')
  const [a9, setA9] = useState('')

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idGuardado, setIdGuardado] = useState<string | null>(null)

  const usoAlma = a1 === 'Sí'
  const mostrarA9 =
    a1 === 'No' || a3 === 'Nunca la he usado' || a3 === 'La usé una vez y no volví'

  // El total cambia según la rama: quien nunca usó Alma responde 2 preguntas,
  // no 9. Mostrar "1 de 9" a esa persona sería desalentador y además falso.
  const total = usoAlma ? (mostrarA9 ? 9 : 8) : 2
  const respondidas = usoAlma
    ? [a1, a2, a3, a4.length > 0, a5.trim(), a6, a7.length > 0, a8.trim(), mostrarA9 && a9.trim()]
        .slice(0, total)
        .filter(Boolean).length
    : [a1, a9.trim()].filter(Boolean).length

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
    if (!a1) {
      setError('Falta responder la pregunta 1: ¿has usado Alma alguna vez?')
      return
    }

    setEnviando(true)
    try {
      const res = await fetch('/api/encuestas/alma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          area,
          a1,
          a2,
          a3,
          a4,
          a4Otro,
          a5,
          a6,
          a7,
          a7Otro,
          a8,
          a9,
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
      <SurveyShell paso="Encuesta 2 de 3" titulo="Uso del agente Alma" intro="Listo.">
        <Gracias
          id={idGuardado}
          siguiente={{
            href: '/encuestas/herramientas',
            texto: 'Continuar con la encuesta de herramientas',
          }}
        />
      </SurveyShell>
    )
  }

  return (
    <SurveyShell
      paso="Encuesta 2 de 3"
      titulo="Uso del agente Alma"
      intro="Alma es el asistente interno de Sirius. Nos interesa tanto saber de quienes la usan como de quienes no: si nunca la has abierto, la encuesta te toma menos de un minuto y esa respuesta es igual de valiosa."
      progreso={{ respondidas, total }}
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

        <Section indice={2} titulo="Uso y frecuencia">
          <Question numero="1" enunciado="¿Has usado Alma alguna vez?" obligatoria>
            <RadioGroup name="a1" options={A1_HA_USADO} value={a1} onChange={setA1} />
          </Question>

          {usoAlma && (
            <>
              <Question
                numero="2"
                enunciado="¿Cuándo fue la última vez que usaste Alma?"
                ayuda="Aproximado, como lo recuerdes."
              >
                <RadioGroup name="a2" options={A2_RANGO} value={a2} onChange={setA2} />
              </Question>

              <Question numero="3" enunciado="¿Con qué frecuencia usas Alma?">
                <RadioGroup name="a3" options={A3_FRECUENCIA} value={a3} onChange={setA3} />
              </Question>
            </>
          )}
        </Section>

        {usoAlma && (
          <>
            <Section indice={3} titulo="Para qué la usas">
              <Question
                numero="4"
                enunciado="¿Para qué tareas usas Alma principalmente?"
                ayuda="Puedes marcar varias."
              >
                <CheckboxGroup options={A4_TAREAS} values={a4} onChange={setA4} />
                {a4.includes('Otro') && (
                  <div className="mt-3">
                    <TextInput
                      value={a4Otro}
                      onChange={setA4Otro}
                      placeholder="¿Para qué otra cosa?"
                    />
                  </div>
                )}
              </Question>

              <Question
                numero="5"
                enunciado="Describe en 1-2 frases el último caso concreto en que usaste Alma."
                ayuda="Un caso real, aunque sea pequeño."
              >
                <TextArea
                  value={a5}
                  onChange={setA5}
                  placeholder="Ej. Le pedí el procedimiento de solicitud de vacaciones y me lo resumió."
                />
              </Question>
            </Section>

            <Section indice={4} titulo="Valor y fricción">
              <Question numero="6" enunciado="¿Qué tan bien resuelve Alma lo que le pides?">
                <RatingInput
                  value={a6}
                  onChange={setA6}
                  etiquetaBaja="casi nunca da lo que necesito"
                  etiquetaAlta="siempre resuelve bien"
                />
              </Question>

              <Question
                numero="7"
                enunciado="¿Qué te frena para usar Alma más seguido?"
                ayuda="Elige hasta 2."
              >
                <CheckboxGroup options={A7_FRENOS} values={a7} onChange={setA7} max={2} />
                {a7.includes('Otro') && (
                  <div className="mt-3">
                    <TextInput
                      value={a7Otro}
                      onChange={setA7Otro}
                      placeholder="¿Qué otra cosa te frena?"
                    />
                  </div>
                )}
              </Question>

              <Question
                numero="8"
                enunciado="¿Qué te gustaría que Alma pudiera hacer que hoy no hace?"
              >
                <TextArea
                  value={a8}
                  onChange={setA8}
                  placeholder="Sin filtro. Esto alimenta directamente su backlog."
                />
              </Question>
            </Section>
          </>
        )}

        {mostrarA9 && (
          <Section
            indice={usoAlma ? 5 : 3}
            titulo="Si no la usas"
            descripcion="La pregunta más importante de esta encuesta."
          >
            <Question
              numero="9"
              enunciado="Si nunca has usado Alma o dejaste de usarla, ¿por qué?"
              ayuda="'No sabía que existía' es una respuesta perfectamente válida, y de hecho es la más accionable de todas."
            >
              <TextArea
                value={a9}
                onChange={setA9}
                placeholder="Cuéntanos qué pasó: no la conocías, la probaste y no te sirvió, prefieres otra cosa…"
              />
            </Question>
          </Section>
        )}

        <SubmitBar enviando={enviando} error={error} />
      </form>
    </SurveyShell>
  )
}

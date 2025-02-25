// app/chat/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Message, WebhookResponse } from '@/types/chat'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'

const N8N_WEBHOOK_URL = 'https://primary-production-41b1.up.railway.app/webhook-test/alma'

// Componente de formulario de login
function LoginForm({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor, introduce un email válido')
      return
    }
    onLogin(email)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center font-bold text-gray-800">Bienvenido al chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">Tu email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg text-gray-800"
              placeholder="ejemplo@dominio.com"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
          >
            Comenzar chat
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Recuperar email guardado
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      setUserEmail(savedEmail)
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (email: string) => {
    setUserEmail(email)
    localStorage.setItem('userEmail', email)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    setUserEmail('')
    setIsLoggedIn(false)
    setMessages([])
  }

  // Función para convertir Blob a base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // reader.result es algo como 'data:audio/webm;base64,AAAA...'
          // split(',')[1] da el 'AAAA...' 
          const base64 = reader.result.split(',')[1] || ''
          resolve(base64)
        } else {
          reject(new Error('No se pudo convertir blob a base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Ahora podemos recibir un audioBlob opcional
  const handleSendMessage = async (text: string, audioBlob?: Blob) => {
    if ((!text.trim() && !audioBlob) || isLoading) return
    setIsLoading(true)

    // 1. Crear el mensaje local
    let newUserMessage: Message
    if (audioBlob) {
      // Mensaje de audio
      const audioUrl = URL.createObjectURL(audioBlob)
      newUserMessage = {
        type: 'audio',
        sender: 'user',
        content: '',
        audioUrl,
        timestamp: new Date()
      }
    } else {
      // Mensaje de texto
      newUserMessage = {
        type: 'text',
        sender: 'user',
        content: text,
        timestamp: new Date()
      }
    }
    setMessages(prev => [...prev, newUserMessage])

    try {
      // 2. Preparar el body para el POST
      let bodyToSend
      if (audioBlob) {
        // Convertir audio a base64
        const base64Audio = await blobToBase64(audioBlob)

        bodyToSend = {
          body: {
            messages: [
              {
                type: 'audio',
                audio: base64Audio, // Aquí enviamos el base64
                from: userEmail
              }
            ],
            contacts: [
              {
                wa_id: userEmail
              }
            ]
          }
        }
      } else {
        // Mensaje de texto
        bodyToSend = {
          body: {
            messages: [
              {
                type: 'text',
                text,
                from: userEmail
              }
            ],
            contacts: [
              {
                wa_id: userEmail
              }
            ]
          }
        }
      }

      // 3. Hacer fetch al webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(bodyToSend)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 4. Procesar la respuesta de n8n
      const data: WebhookResponse = await response.json()
      if (data.success && data.response) {
        // El bot contesta con texto (asumimos)
        const botMessage: Message = {
          type: 'text',
          sender: 'bot',
          content: data.response,
          timestamp: new Date(data.metadata.timestamp)
        }
        setMessages(prev => [...prev, botMessage])
      }

    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      const errorMessage: Message = {
        type: 'text',
        sender: 'bot',
        content: 'Lo siento, ocurrió un error al procesar tu mensaje.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Interfaz de login
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  // Interfaz de chat
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-blue-500 text-white p-3 flex flex-wrap justify-between items-center">
        <h1 className="text-xl font-bold">Alma</h1>
        <div className="flex items-center flex-wrap gap-2">
          <span className="truncate max-w-[200px]" title={userEmail}>
            {userEmail.length > 20 ? userEmail.substring(0, 17) + '...' : userEmail}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm whitespace-nowrap"
          >
            Cerrar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>¡Bienvenido! Escribe un mensaje o graba un audio para comenzar la conversación.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}

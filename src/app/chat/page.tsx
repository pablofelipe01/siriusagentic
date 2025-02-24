// app/chat/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Message, WebhookResponse } from '@/types/chat'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'

const N8N_WEBHOOK_URL = 'https://primary-production-41b1.up.railway.app/webhook/alma'

// Componente de formulario de login
function LoginForm({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación básica de email
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
            <label className="block text-gray-800 font-medium mb-2">
              Tu email:
            </label>
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

  // Intenta recuperar el email guardado al cargar la página
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      setUserEmail(savedEmail)
      setIsLoggedIn(true)
    }
  }, [])

  // Función para manejar el login
  const handleLogin = (email: string) => {
    setUserEmail(email)
    localStorage.setItem('userEmail', email)
    setIsLoggedIn(true)
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    setUserEmail('')
    setIsLoggedIn(false)
    setMessages([])
  }

  // Función para enviar mensajes
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return
    
    setIsLoading(true)
    
    // Añadir mensaje del usuario a la interfaz
    const userMessage: Message = {
      sender: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    
    try {
      // Enviar mensaje al webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          body: {
            messages: [{
              type: 'text',
              text: content,
              from: userEmail
            }],
            contacts: [{
              wa_id: userEmail
            }]
          }
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Procesar respuesta
      const data: WebhookResponse = await response.json()
      
      if (data.success && data.response) {
        const botMessage: Message = {
          sender: 'bot',
          content: data.response,
          timestamp: new Date(data.metadata.timestamp)
        }
        setMessages(prev => [...prev, botMessage])
      }
      
    } catch (error) {
      console.error('Error sending message:', error)
      // Añadir mensaje de error en la interfaz
      const errorMessage: Message = {
        sender: 'bot',
        content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Si no está logueado, mostrar formulario de login
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  // Interfaz del chat
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
            <p>¡Bienvenido! Escribe un mensaje para comenzar la conversación.</p>
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
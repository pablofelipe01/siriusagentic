'use client'

import { useState, useEffect } from 'react'
import { Message, WebhookResponse } from '@/types/chat'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'
import { LoginForm } from '@/components/LoginForm'
import Link from 'next/link'
import Image from 'next/image'
import { Home, User } from 'lucide-react'

const N8N_WEBHOOK_URL = 'https://n8n-sirius-agentic.onrender.com/webhook/directo'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [userPhoto, setUserPhoto] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Recuperar datos guardados
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail')
    const savedName = localStorage.getItem('userName')
    const savedPhoto = localStorage.getItem('userPhoto')
    
    if (savedEmail) {
      setUserEmail(savedEmail)
      setUserName(savedName || '')
      setUserPhoto(savedPhoto || '')
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (email: string, name: string, photoUrl: string) => {
    setUserEmail(email)
    setUserName(name)
    setUserPhoto(photoUrl)
    
    // Guardar en localStorage
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userName', name)
    localStorage.setItem('userPhoto', photoUrl)
    
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userPhoto')
    
    setUserEmail('')
    setUserName('')
    setUserPhoto('')
    setIsLoggedIn(false)
    setMessages([])
  }

  // Función para convertir Blob o File a base64
  const fileToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // reader.result es algo como 'data:audio/webm;base64,AAAA...'
          // split(',')[1] da el 'AAAA...' 
          const base64 = reader.result.split(',')[1] || ''
          resolve(base64)
        } else {
          reject(new Error('No se pudo convertir a base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Función para determinar el tipo MIME de la imagen
  const getImageMimeType = (file: File): string => {
    // Si el navegador proporciona el tipo MIME, úsalo
    if (file.type.startsWith('image/')) {
      return file.type
    }
    
    // Si no, intentamos inferir del nombre de archivo
    const extension = file.name.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'gif':
        return 'image/gif'
      case 'webp':
        return 'image/webp'
      case 'heic':
        return 'image/heic'
      default:
        return 'image/jpeg' // Valor predeterminado
    }
  }

  // Manejar envío de mensajes (texto, audio, imagen o documento)
  const handleSendMessage = async (text: string, audioBlob?: Blob, imageFile?: File, documentFile?: File) => {
    if ((!text.trim() && !audioBlob && !imageFile && !documentFile) || isLoading) return
    
    // Log para depuración
    console.log('Tipo de mensaje a enviar:', {
      hasText: !!text.trim(),
      hasAudio: !!audioBlob,
      hasImage: !!imageFile,
      hasDocument: !!documentFile,
      documentName: documentFile?.name
    })
    
    setIsLoading(true)

    // 1. Crear el mensaje local según el tipo
    let newUserMessage: Message

    if (documentFile) {
      // Mensaje con documento PDF
      const documentUrl = URL.createObjectURL(documentFile)
      newUserMessage = {
        type: 'document',
        sender: 'user',
        content: text || `Documento: ${documentFile.name}`,
        documentUrl,
        documentName: documentFile.name,
        fileSize: documentFile.size,
        mimeType: documentFile.type,
        timestamp: new Date()
      }
    } else if (imageFile) {
      // Mensaje con imagen
      const imageUrl = URL.createObjectURL(imageFile)
      newUserMessage = {
        type: 'image',
        sender: 'user',
        content: text || '', // Comentario opcional con la imagen
        imageUrl,
        fileSize: imageFile.size,
        mimeType: getImageMimeType(imageFile),
        timestamp: new Date()
      }
    } else if (audioBlob) {
      // Mensaje de audio
      const audioUrl = URL.createObjectURL(audioBlob)
      newUserMessage = {
        type: 'audio',
        sender: 'user',
        content: text || '', // Comentario opcional con el audio
        audioUrl,
        fileSize: audioBlob.size,
        mimeType: audioBlob.type,
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
      // 2. Preparar el body para el POST según el tipo
      interface WebhookBody {
        body: {
          messages: Array<{
            from: string;
            type?: string;
            text?: string;
            document?: string;
            image?: string;
            audio?: string;
            mime_type?: string;
            filename?: string;
            caption?: string;
          }>;
          contacts: Array<{
            wa_id: string;
          }>;
        };
      }

      const bodyToSend: WebhookBody = {
        body: {
          messages: [
            {
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

      // Completar el mensaje según el tipo
      if (documentFile) {
        // Convertir documento a base64
        const base64Document = await fileToBase64(documentFile)
        
        bodyToSend.body.messages[0].type = 'document'
        bodyToSend.body.messages[0].document = base64Document
        bodyToSend.body.messages[0].mime_type = 'application/pdf'
        bodyToSend.body.messages[0].filename = documentFile.name
        
        // Si hay texto, lo incluimos como caption
        if (text.trim()) {
          bodyToSend.body.messages[0].caption = text.trim()
        }
      } else if (imageFile) {
        // Convertir imagen a base64
        const base64Image = await fileToBase64(imageFile)
        const mimeType = getImageMimeType(imageFile)
        
        bodyToSend.body.messages[0].type = 'image'
        bodyToSend.body.messages[0].image = base64Image
        bodyToSend.body.messages[0].mime_type = mimeType
        
        // Si hay texto, lo incluimos como caption
        if (text.trim()) {
          bodyToSend.body.messages[0].caption = text.trim()
        }
      } else if (audioBlob) {
        // Convertir audio a base64
        const base64Audio = await fileToBase64(audioBlob)
        
        bodyToSend.body.messages[0].type = 'audio'
        bodyToSend.body.messages[0].audio = base64Audio
        
        // Si hay texto, lo incluimos como caption (aunque n8n tendrá que manejarlo)
        if (text.trim()) {
          bodyToSend.body.messages[0].caption = text.trim()
        }
      } else {
        // Mensaje de texto
        bodyToSend.body.messages[0].type = 'text'
        bodyToSend.body.messages[0].text = text
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

  // Interfaz de chat con imagen de fondo
  return (
    <div className="flex flex-col h-screen chat-container relative">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/h6.png"
          alt="Background"
          fill
          priority
          className="object-cover opacity-09"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30" />
      </div>
      
      {/* Contenido del chat */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="bg-blue-500 text-white p-3 flex items-center justify-between chat-header">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <Home size={24} className="text-white hover:text-blue-100" />
            </Link>
            <h1 className="text-xl font-bold">Alma</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Foto del usuario */}
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt={userName} 
                className="w-8 h-8 rounded-full object-cover border border-white"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            )}
            
            {/* Nombre del usuario */}
            <span className="hidden sm:inline truncate max-w-[200px]" title={userName || userEmail}>
              {userName || (userEmail.length > 20 ? userEmail.substring(0, 17) + '...' : userEmail)}
            </span>
            <span className="sm:hidden truncate max-w-[120px]" title={userName || userEmail}>
              {userName || (userEmail.length > 10 ? userEmail.substring(0, 7) + '...' : userEmail)}
            </span>
            
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm whitespace-nowrap"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages bg-white/5 backdrop-blur-sm">
          {messages.length === 0 ? (
            <div className="text-center text-white mt-10 bg-blue-900/30 p-6 rounded-xl border border-blue-500/20 shadow-lg">
              <p>¡Bienvenido {userName}! Escribe un mensaje, graba un audio, envía una imagen o sube un documento PDF para comenzar la conversación.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}
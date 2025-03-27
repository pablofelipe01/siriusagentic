import { Message } from '@/types/chat'
import { CustomAudioPlayer } from './CustomAudioPlayer'
import { useState, useEffect } from 'react'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user'
  const [isImageExpanded, setIsImageExpanded] = useState(false)
  const [isDocumentExpanded, setIsDocumentExpanded] = useState(false)

  // Reproducir automáticamente el audio del bot (opcional)
  useEffect(() => {
    // Si es un mensaje de audio del bot, reproducir automáticamente
    if (message.type === 'audio' && !isUser && message.audioUrl) {
      const audio = new Audio(message.audioUrl);
      
      // Opcional: puedes comentar estas líneas si prefieres no reproducir automáticamente
      // audio.play().catch(e => console.log('Error al reproducir audio del bot:', e));
    }
  }, [message, isUser]);

  // Manejar clic en la imagen para expandir/colapsar
  const handleImageClick = () => {
    setIsImageExpanded(!isImageExpanded)
  }

  // Manejar clic en el documento para expandir/colapsar o abrir en nueva pestaña
  const handleDocumentClick = () => {
    if (message.documentUrl) {
      window.open(message.documentUrl, '_blank')
    }
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`rounded-lg p-3 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        } ${message.type === 'image' ? 'max-w-xs sm:max-w-sm' : 'max-w-[90%] sm:max-w-[70%]'} message-bubble`}
      >
        {/* Mensaje de texto */}
        {message.type === 'text' && (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}

        {/* Mensaje de audio con reproductor personalizado */}
        {message.type === 'audio' && message.audioUrl && (
          <div>
            <CustomAudioPlayer 
              srcWebm={message.audioUrl} 
              isUser={isUser} 
            />
            {/* Mostrar etiqueta para audio del bot */}
            {!isUser && (
              <div className="text-xs mt-1 text-gray-500">Respuesta por voz</div>
            )}
            {message.content && (
              <p className="mt-2 whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        )}

        {/* Mensaje de imagen - con vista modal mejorada para móvil */}
        {message.type === 'image' && message.imageUrl && (
          <div>
            <div className="cursor-pointer">
              <img 
                src={message.imageUrl} 
                alt="Imagen enviada" 
                className="rounded max-h-60 w-full object-cover"
                onClick={handleImageClick}
              />
            </div>
            {isImageExpanded && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 file-preview"
                onClick={() => setIsImageExpanded(false)}
              >
                <img 
                  src={message.imageUrl} 
                  alt="Imagen ampliada" 
                  className="max-h-[80vh] max-w-full object-contain"
                />
                <button
                  className="absolute top-4 right-4 bg-white bg-opacity-25 text-white rounded-full p-2"
                  onClick={() => setIsImageExpanded(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {message.content && (
              <p className="mt-2 whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        )}

        {/* Mensaje de documento - diseño mejorado para móvil */}
        {message.type === 'document' && message.documentUrl && (
          <div>
            <div 
              className="cursor-pointer flex items-center p-2 bg-white bg-opacity-20 rounded"
              onClick={handleDocumentClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke={isUser ? "white" : "red"}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="overflow-hidden">
                <div className="font-medium truncate">{message.documentName || "Documento PDF"}</div>
                <div className="text-xs opacity-80">Click para abrir</div>
              </div>
            </div>
            {message.content && (
              <p className="mt-2 whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        )}

        <div className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
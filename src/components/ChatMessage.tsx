import { Message } from '@/types/chat'
import { CustomAudioPlayer } from './CustomAudioPlayer'
import { useState } from 'react'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user'
  const [isImageExpanded, setIsImageExpanded] = useState(false)
  const [isDocumentExpanded, setIsDocumentExpanded] = useState(false)

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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-lg p-3 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        } ${message.type === 'image' ? 'max-w-xs md:max-w-sm' : 'max-w-[70%]'}`}
      >
        {/* Mensaje de texto */}
        {message.type === 'text' && (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}

        {/* Mensaje de audio con reproductor personalizado */}
        {message.type === 'audio' && message.audioUrl && (
          <div>
            <CustomAudioPlayer 
              srcWebm={message.audioUrl} 
              isUser={isUser} 
            />
            {message.content && (
              <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        )}

        {/* Mensaje de imagen */}
        {message.type === 'image' && message.imageUrl && (
          <div>
            <div 
              className={`cursor-pointer ${isImageExpanded ? 'fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-75 flex items-center justify-center p-4' : ''}`}
              onClick={handleImageClick}
            >
              <img 
                src={message.imageUrl} 
                alt="Imagen enviada" 
                className={`rounded ${
                  isImageExpanded 
                    ? 'max-h-screen max-w-full object-contain' 
                    : 'max-h-60 w-full object-cover'
                }`}
              />
            </div>
            {message.content && (
              <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        )}

        {/* Mensaje de documento */}
        {message.type === 'document' && message.documentUrl && (
          <div>
            <div 
              className="cursor-pointer flex items-center p-2 bg-white bg-opacity-20 rounded"
              onClick={handleDocumentClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke={isUser ? "white" : "red"}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <div className="font-medium">{message.documentName || "Documento PDF"}</div>
                <div className="text-xs opacity-80">Click para abrir</div>
              </div>
            </div>
            {message.content && (
              <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        )}

        <div className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
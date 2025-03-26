import { useState, FormEvent, useRef, useEffect } from 'react'
import { ImageUploader } from './ImageUploader'
import { DocumentUploader } from './DocumentUploader'
import { Mic, Square, Send, Loader2 } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (text: string, audioBlob?: Blob, imageFile?: File, documentFile?: File) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Debug effect para verificar cuando cambia el documento seleccionado
  useEffect(() => {
    console.log('Estado de documento actualizado:', selectedDocument?.name || 'ninguno')
  }, [selectedDocument])

  // Iniciar o parar la grabación
  const handleToggleRecord = async () => {
    if (isRecording) {
      // Si ya estamos grabando, detenemos
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      
      // Enviar automáticamente el audio después de detener la grabación
      setTimeout(() => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          onSendMessage(input.trim(), audioBlob, undefined, undefined)
          
          // Reset
          setInput('')
          audioChunksRef.current = []
        }
      }, 500); // Pequeño retraso para asegurarnos que se captura todo el audio
    } else {
      // Intentar acceder al micrófono
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)

        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        // Cada vez que hay datos disponibles, se agregan a audioChunksRef
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        // Cuando se detiene la grabación
        mediaRecorder.onstop = () => {
          // Detener todas las pistas del stream para liberar el micrófono
          stream.getTracks().forEach(track => track.stop())
        }

        // Iniciar grabación
        mediaRecorder.start()
        setIsRecording(true)
      } catch (error) {
        console.error('Error al acceder al micrófono:', error)
      }
    }
  }

  // Manejar la selección de imagen
  const handleImageSelected = (imageFile: File) => {
    console.log('Imagen seleccionada:', imageFile.name)
    setSelectedImage(imageFile)
    // Si seleccionamos imagen, quitamos documento
    if (selectedDocument) {
      console.log('Limpiando documento previo')
      setSelectedDocument(null)
    }
  }

  // Manejar la selección de documento
  const handleDocumentSelected = (documentFile: File) => {
    // Verificar si es el archivo vacío de limpieza
    if (documentFile.size === 0 && documentFile.name === "empty.pdf") {
      console.log('Limpiando documento seleccionado')
      setSelectedDocument(null)
      return
    }
    
    console.log('Documento seleccionado:', documentFile.name, documentFile.type, documentFile.size)
    setSelectedDocument(documentFile)
    
    // Si seleccionamos documento, quitamos imagen
    if (selectedImage) {
      console.log('Limpiando imagen previa')
      setSelectedImage(null)
    }
  }

  // Enviar mensaje
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    // Determinar qué tenemos para enviar
    const hasText = input.trim().length > 0
    const hasAudio = audioChunksRef.current.length > 0
    const hasImage = selectedImage !== null
    const hasDocument = selectedDocument !== null

    // Log para depuración
    console.log('Enviando mensaje:', { 
      hasText, 
      hasAudio, 
      hasImage, 
      hasDocument,
      documentName: selectedDocument?.name 
    })

    // No hay nada que enviar
    if (!hasText && !hasAudio && !hasImage && !hasDocument) {
      console.log('No hay contenido para enviar')
      return
    }

    // Si hay audio grabado
    if (hasAudio) {
      console.log('Enviando audio')
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      onSendMessage(input.trim(), audioBlob, selectedImage || undefined, selectedDocument || undefined)
      // Reset
      setInput('')
      audioChunksRef.current = []
      setSelectedImage(null)
      setSelectedDocument(null)
      return
    }

    // Si hay imagen o documento
    if (hasImage) {
      console.log('Enviando imagen:', selectedImage?.name)
      onSendMessage(input.trim(), undefined, selectedImage, undefined)
      setInput('')
      setSelectedImage(null)
      return
    }
    
    if (hasDocument) {
      console.log('Enviando documento PDF:', selectedDocument?.name)
      onSendMessage(input.trim(), undefined, undefined, selectedDocument)
      setInput('')
      setSelectedDocument(null)
      return
    }

    // Si solo hay texto
    if (hasText) {
      console.log('Enviando solo texto')
      onSendMessage(input.trim(), undefined, undefined, undefined)
      setInput('')
    }
  }

  return (
    <div className="p-3 w-full">
      {/* File selection indicator */}
      {(selectedDocument || selectedImage) && (
        <div className="bg-blue-50 text-blue-800 p-2 mb-2 rounded-lg border border-blue-200 text-center">
          {selectedDocument && (
            <div className="font-bold">Documento: {selectedDocument.name.length > 20 ? `${selectedDocument.name.substring(0, 20)}...` : selectedDocument.name}</div>
          )}
          {selectedImage && (
            <div className="font-bold">Imagen: {selectedImage.name.length > 20 ? `${selectedImage.name.substring(0, 20)}...` : selectedImage.name}</div>
          )}
        </div>
      )}

      {/* Estilo WhatsApp - Barra de input y botones */}
      <div className="flex flex-col">
        {/* Indicador de grabación si está activa */}
        {isRecording && (
          <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse mr-2"></div>
            <span>Grabando audio...</span>
            <button
              type="button"
              onClick={handleToggleRecord}
              className="ml-auto p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
              disabled={isLoading}
            >
              <Square size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
            {/* Botones para adjuntos (izquierda) */}
            <div className="flex">
              <div className="px-2">
                <DocumentUploader 
                  onDocumentSelected={handleDocumentSelected}
                  disabled={isLoading || isRecording || !!selectedImage}
                />
              </div>
              
              <div className="px-2">
                <ImageUploader 
                  onImageSelected={handleImageSelected}
                  disabled={isLoading || isRecording || !!selectedDocument}
                />
              </div>
            </div>
            
            {/* Input de texto (centro) con mejor contraste */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 py-3 px-2 outline-none bg-transparent text-gray-800 placeholder-gray-500"
              placeholder={
                isRecording 
                  ? 'Grabando audio...'
                  : selectedImage
                    ? 'Añade un comentario...'
                    : selectedDocument
                      ? 'Añade un comentario...'
                      : 'Escribe un mensaje...'
              }
              disabled={isLoading || isRecording}
            />
            
            {/* Botón de acción contextual (derecha) */}
            <div className="pr-2">
              {isLoading ? (
                <button 
                  type="button" 
                  className="p-3 text-blue-500" 
                  disabled
                >
                  <Loader2 size={24} className="animate-spin" />
                </button>
              ) : (
                <>
                  {(input.trim() || selectedImage || selectedDocument) ? (
                    <button 
                      type="submit"
                      className="p-3 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <Send size={24} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleRecord}
                      className={`p-3 focus:outline-none ${isRecording ? 'text-red-600' : 'text-blue-600 hover:text-blue-800'}`}
                      disabled={isLoading}
                    >
                      <Mic size={24} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
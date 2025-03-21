import { useState, FormEvent, useRef, useEffect } from 'react'
import { ImageUploader } from './ImageUploader'
import { DocumentUploader } from './DocumentUploader'
import { Mic, Square } from 'lucide-react'

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
    <div className="border-t p-3 bg-gray-50 relative chat-input-container">
      {/* File selection indicator - improved positioning for mobile */}
      {(selectedDocument || selectedImage) && (
        <div className="absolute bottom-20 left-2 right-2 bg-yellow-100 text-xs p-2 rounded-lg z-40 border border-yellow-300 text-center file-selected-indicator">
          {selectedDocument && (
            <div className="font-bold">Documento: {selectedDocument.name.length > 20 ? `${selectedDocument.name.substring(0, 20)}...` : selectedDocument.name}</div>
          )}
          {selectedImage && (
            <div className="font-bold">Imagen: {selectedImage.name.length > 20 ? `${selectedImage.name.substring(0, 20)}...` : selectedImage.name}</div>
          )}
        </div>
      )}

      {/* Responsive form layout - stack on mobile, row on desktop */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        {/* Control buttons in a row that wraps on narrow screens */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto chat-toolbar">
          {/* Botón GRABAR/DETENER con iconos de Lucide */}
          <button
            type="button"
            onClick={handleToggleRecord}
            className={`flex items-center justify-center px-3 py-2 rounded-lg text-white chat-toolbar-button ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={isLoading}
          >
            <span className="flex items-center">
              {isRecording ? 
                <Square size={18} className="mr-1" /> : 
                <Mic size={18} className="mr-1" />
              }
              <span className="hidden sm:inline">{isRecording ? 'Detener' : 'Grabar'}</span>
            </span>
          </button>

          {/* Componente de subida de imágenes */}
          <ImageUploader 
            onImageSelected={handleImageSelected}
            disabled={isLoading || isRecording || !!selectedDocument}
          />

          {/* Componente de subida de documentos */}
          <DocumentUploader 
            onDocumentSelected={handleDocumentSelected}
            disabled={isLoading || isRecording || !!selectedImage}
          />
        </div>

        {/* Text input and send button */}
        <div className="flex w-full gap-2 mt-2 sm:mt-0">
          {/* Input de texto */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg p-2 text-gray-800 bg-white"
            placeholder={
              isRecording 
                ? 'Grabando audio...'
                : selectedImage
                  ? 'Comentario...'
                  : selectedDocument
                    ? 'Comentario...'
                    : 'Escribe un mensaje...'
            }
            disabled={isLoading || isRecording}
          />

          {/* Botón ENVIAR */}
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              isLoading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="loading-indicator mr-2"></span>
                <span className="hidden sm:inline">Enviando...</span>
              </span>
            ) : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  )
}
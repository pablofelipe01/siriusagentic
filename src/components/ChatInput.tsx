import { useState, FormEvent, useRef, useEffect } from 'react'
import { ImageUploader } from './ImageUploader'
import { DocumentUploader } from './DocumentUploader'

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
    <div className="border-t p-3 bg-gray-50 relative">
      {/* Área de depuración - solo visible durante desarrollo */}
      {(selectedDocument || selectedImage) && (
        <div className="absolute bottom-24 left-4 right-4 bg-yellow-100 text-xs p-2 rounded-lg z-40 border border-yellow-300 text-center">
          {selectedDocument && (
            <div className="font-bold">Documento seleccionado: {selectedDocument.name} ({Math.round(selectedDocument.size/1024)} KB)</div>
          )}
          {selectedImage && (
            <div className="font-bold">Imagen seleccionada: {selectedImage.name} ({Math.round(selectedImage.size/1024)} KB)</div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-2">
        {/* Botón GRABAR/DETENER */}
        <button
          type="button"
          onClick={handleToggleRecord}
          className={`px-3 py-2 rounded-lg text-white ${
            isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={isLoading}
        >
          {isRecording ? 'Detener' : 'Grabar'}
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
                ? 'Añade un comentario a tu imagen...'
                : selectedDocument
                  ? 'Añade un comentario a tu documento...'
                  : 'Escribe un mensaje, graba audio o sube un archivo...'
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
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}
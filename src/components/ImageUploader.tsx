import { useState, useRef } from 'react'

interface ImageUploaderProps {
  onImageSelected: (imageFile: File) => void
  disabled: boolean
}

export function ImageUploader({ onImageSelected, disabled }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido')
      return
    }

    // Limitar el tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Selecciona una imagen menor a 10MB')
      return
    }

    // Crear preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    
    // Enviar la imagen al componente padre
    onImageSelected(file)

    // Limpiar el input de archivo para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  
  const handleClearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      // Notificar al padre que no hay imagen
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <>
      {/* Input de archivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      
      {/* Botón para abrir el selector de archivos */}
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={disabled || !!previewUrl}
        className={`flex items-center px-3 py-2 rounded-lg text-white chat-toolbar-button ${
          disabled || previewUrl
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
        title="Subir imagen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="hidden sm:inline ml-1">Imagen</span>
      </button>
      
      {/* Preview mejorado para móvil - modal en lugar de posición absoluta */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 file-preview" 
             onClick={() => setPreviewUrl(null)}>
          <div className="bg-white p-3 rounded-lg shadow-lg max-w-xs w-full relative file-preview-content" 
               onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full object-contain rounded max-h-40"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearImage();
                }}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                title="Eliminar imagen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button 
              className="w-full mt-2 bg-blue-500 text-white rounded-lg py-1"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewUrl(null);
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
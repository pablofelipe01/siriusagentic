import { useState, useRef, useEffect } from 'react'

interface DocumentUploaderProps {
  onDocumentSelected: (documentFile: File) => void
  disabled: boolean
}

export function DocumentUploader({ onDocumentSelected, disabled }: DocumentUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Para depuración: monitorea cuando cambia el nombre del archivo
  useEffect(() => {
    console.log('DocumentUploader: estado del nombre de archivo', fileName)
  }, [fileName])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limpiar la selección anterior primero
    setFileName(null)
    
    const file = e.target.files?.[0]
    if (!file) {
      console.log('No se seleccionó ningún archivo')
      return
    }

    console.log('DocumentUploader: Archivo seleccionado:', file.name, file.type, file.size)

    // Validar que sea un PDF
    if (file.type !== 'application/pdf') {
      alert('Por favor, selecciona un archivo PDF válido')
      return
    }

    // Limitar el tamaño (20MB máximo)
    if (file.size > 20 * 1024 * 1024) {
      alert('El documento es demasiado grande. Selecciona un PDF menor a 20MB')
      return
    }

    // Guardar nombre del archivo
    setFileName(file.name)
    
    // Enviar el documento al componente padre
    onDocumentSelected(file)
    console.log('DocumentUploader: Documento enviado al componente padre:', file.name)

    // Limpiar el input de archivo para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    console.log('DocumentUploader: Abriendo selector de archivos')
    fileInputRef.current?.click()
  }
  
  const handleClearDocument = () => {
    console.log('DocumentUploader: Limpiando selección de documento')
    setFileName(null)
    
    // Crear un archivo vacío como señal para limpiar el documento en el componente padre
    const emptyFile = new File([], "empty.pdf", { type: "application/pdf" })
    onDocumentSelected(emptyFile)
    
    // Limpiar el input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      {/* Input de archivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
        disabled={disabled}
      />
      
      {/* Botón para abrir el selector de archivos */}
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={disabled || !!fileName}
        className={`px-3 py-2 rounded-lg text-white ${
          disabled || fileName
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700'
        }`}
        title="Subir PDF"
        aria-label="Subir documento PDF"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
      
      {/* Información del documento si existe */}
      {fileName && (
        <div className="absolute bottom-16 left-3 bg-white p-2 rounded-lg shadow-lg z-50 border border-orange-200">
          <div className="relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="max-w-[150px] truncate text-sm font-medium" title={fileName}>
              {fileName}
            </span>
            <button
              type="button"
              onClick={handleClearDocument}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              title="Eliminar documento"
              aria-label="Eliminar documento seleccionado"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
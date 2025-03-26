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
      
      {/* Botón para abrir el selector de archivos - SIN FONDO y con icono azul */}
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={disabled || !!fileName}
        className={`flex items-center px-3 py-2 rounded-lg ${
          disabled || fileName
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-100'
        }`}
        title="Subir PDF"
        aria-label="Subir documento PDF"
      >
        {/* Icono de clip azul */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <span className="hidden sm:inline ml-1 text-blue-600">PDF</span>
      </button>
      
      {/* Información del documento mejorado para móvil con mejor contraste */}
      {fileName && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 file-preview"
             onClick={() => handleClearDocument()}>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs w-full relative file-preview-content"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center mb-2">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-sm">Documento:</h3>
                <p className="text-gray-900 font-medium text-sm break-words" title={fileName}>
                  {fileName}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearDocument();
                }}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 px-2 text-sm font-medium"
                title="Eliminar documento"
              >
                Eliminar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFileName(null);
                }}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 px-2 text-sm font-medium"
                title="Aceptar"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Indicador de documento seleccionado en la parte inferior */}
      {fileName && (
        <div className="absolute bottom-20 left-2 right-2 bg-orange-100 border border-orange-300 p-2 rounded-lg text-xs z-30 text-center">
          <span className="text-orange-800 font-medium">Documento seleccionado</span>
        </div>
      )}
    </>
  )
}
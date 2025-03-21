// components/LoginForm.tsx
import { useState, FormEvent } from 'react'
import { User } from 'lucide-react'

interface LoginFormProps {
  onLogin: (email: string, name: string, photoUrl: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoBase64, setPhotoBase64] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('No se pudo convertir a base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Limitar el tamaño del archivo (por ejemplo, a 1MB)
      if (file.size > 1024 * 1024) {
        setError('La imagen es demasiado grande. El tamaño máximo es 1MB.')
        return
      }
      
      try {
        setIsLoading(true)
        
        // Crear URL para preview
        const previewUrl = URL.createObjectURL(file)
        setPhotoPreview(previewUrl)
        
        // Convertir a base64 para almacenamiento persistente
        const base64 = await fileToBase64(file)
        setPhotoBase64(base64)
        
        setError('')
      } catch (err) {
        console.error('Error al procesar la imagen:', err)
        setError('Error al procesar la imagen. Inténtalo de nuevo.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Validación básica de email
    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor, introduce un email válido')
      return
    }

    if (!name.trim()) {
      setError('Por favor, introduce tu nombre')
      return
    }
    
    // Usamos la versión base64 de la imagen para almacenamiento persistente
    const photoUrl = photoBase64 || ''
    
    onLogin(email, name, photoUrl)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative">
      {/* Fondo opcional para la pantalla de login */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-black/80" />
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 z-10 relative">
        <h2 className="text-2xl mb-6 text-center font-bold text-blue-900">Bienvenido a Alma</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              Tu nombre:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg text-gray-900 bg-white"
              placeholder="Tu nombre"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              Tu email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg text-gray-900 bg-white"
              placeholder="ejemplo@dominio.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-2">
              Tu foto (opcional):
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  className="w-full p-1 text-sm text-gray-900"
                  accept="image/*"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Tamaño máximo: 1MB</p>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <button 
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : 'Comenzar chat'}
          </button>
        </form>
      </div>
    </div>
  )
}
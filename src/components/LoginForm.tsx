// components/LoginForm.tsx
import { useState, FormEvent, useEffect } from 'react'
import { User, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface LoginFormProps {
  onLogin: (email: string, name: string, photoUrl: string) => void
}

// Define interface for authorized user from Airtable
interface AuthorizedUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoBase64, setPhotoBase64] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([])

  // Fetch authorized users from Airtable when component mounts
  useEffect(() => {
    fetchAuthorizedUsers()
  }, [])

  // Function to fetch authorized users from Airtable
  const fetchAuthorizedUsers = async () => {
    try {
      const response = await fetch('/api/authorizedUsers')
      const data = await response.json()
      
      if (data.success) {
        setAuthorizedUsers(data.users)
      } else {
        console.error('Error fetching authorized users:', data.error)
      }
    } catch (err) {
      console.error('Error connecting to API:', err)
    }
  }

  // Check if a user is authorized by their email
  const isEmailAuthorized = (emailToCheck: string): boolean => {
    // Case insensitive comparison
    return authorizedUsers.some(user => 
      user.email.toLowerCase() === emailToCheck.toLowerCase()
    )
  }

  // Redimensionar imagen y convertir a base64
  const resizeAndConvertToBase64 = (file: File, maxWidth = 500, maxHeight = 500): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Crear un objeto URL para la imagen
      const objectUrl = URL.createObjectURL(file)
      
      // Crear un elemento de imagen para cargar el archivo
      const img = new window.Image()
      img.onload = () => {
        // Liberar el objeto URL una vez cargada la imagen
        URL.revokeObjectURL(objectUrl)
        
        // Calcular las nuevas dimensiones manteniendo la proporción
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }
        
        // Crear un canvas con las nuevas dimensiones
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        // Dibujar la imagen redimensionada en el canvas
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir el canvas a base64 (con calidad reducida para JPEG)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
        resolve(dataUrl)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Error al cargar la imagen'))
      }
      
      img.src = objectUrl
    })
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      try {
        setIsLoading(true)
        setError('')
        
        // Crear URL para preview (usamos la original para mejor calidad de preview)
        const previewUrl = URL.createObjectURL(file)
        setPhotoPreview(previewUrl)
        
        // Redimensionar y convertir a base64
        const base64 = await resizeAndConvertToBase64(file)
        setPhotoBase64(base64)
        
        // Para depuración: mostrar el tamaño de la imagen resultante
        const base64Size = Math.round((base64.length * 3) / 4) - 
                          (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0)
        console.log(`Tamaño de imagen original: ${file.size / 1024} KB`)
        console.log(`Tamaño después de redimensionar: ${base64Size / 1024} KB`)
        
      } catch (err) {
        console.error('Error al procesar la imagen:', err)
        setError('Error al procesar la imagen. Inténtalo de nuevo.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
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
    
    setIsCheckingAuth(true)
    setError('')
    
    try {
      // First check locally if we already have the list of authorized users
      if (authorizedUsers.length > 0) {
        if (!isEmailAuthorized(email)) {
          setError('Lo sentimos, este correo electrónico no está autorizado para acceder.')
          setIsCheckingAuth(false)
          return
        }
      } else {
        // Fallback: check authorization directly with the API
        const response = await fetch('/api/authorizedUsers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (!data.authorized) {
          setError('Lo sentimos, este correo electrónico no está autorizado para acceder.')
          setIsCheckingAuth(false)
          return
        }
      }
      
      // Si llegamos aquí, el usuario está autorizado
      // Usamos la versión base64
      const photoUrl = photoBase64 || ''
      onLogin(email, name, photoUrl)
      
    } catch (err) {
      console.error('Error al verificar autorización:', err)
      setError('Error al verificar credenciales. Por favor, inténtalo de nuevo.')
    } finally {
      setIsCheckingAuth(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/dvnuttrox/image/upload/v1752169131/20032025-DSC_3696_1_1_gcsmxy.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Contenedor del formulario con animaciones */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-700 hover:scale-105 hover:shadow-3xl animate-fade-in-up">
          {/* Logo y título con animación */}
          <div className="text-center mb-8 animate-fade-in-down">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:rotate-3">
              <User size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2">
              Bienvenido a Alma
            </h2>
            <p className="text-gray-600 text-sm">Tu asistente de inteligencia artificial</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de nombre con animación */}
            <div className="group animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <label className="block text-gray-700 font-semibold mb-2 transition-colors group-focus-within:text-blue-600">
                Tu nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-gray-300 focus:outline-none placeholder-gray-400"
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>
            
            {/* Campo de email con animación */}
            <div className="group animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <label className="block text-gray-700 font-semibold mb-2 transition-colors group-focus-within:text-blue-600">
                Tu email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-gray-300 focus:outline-none placeholder-gray-400"
                placeholder="ejemplo@dominio.com"
                required
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Solo correos autorizados pueden ingresar
              </p>
            </div>
            
            {/* Campo de foto con animación */}
            <div className="group animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
              <label className="block text-gray-700 font-semibold mb-2 transition-colors group-focus-within:text-blue-600">
                Tu foto (opcional)
              </label>
              <div className="flex items-center space-x-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:bg-white/70">
                <div className="flex-shrink-0">
                  {photoPreview ? (
                    <div className="relative">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-full object-cover border-4 border-blue-500 shadow-lg transform transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-bounce"></div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center transition-all duration-300 hover:from-blue-100 hover:to-blue-200">
                      <User size={32} className="text-gray-400 transition-colors duration-300 hover:text-blue-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    onChange={handlePhotoChange}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:duration-300 cursor-pointer"
                    accept="image/*"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando imagen...
                      </span>
                    ) : (
                      'Se optimizará automáticamente'
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mensaje de error con animación */}
            {error && (
              <div className="flex items-center p-4 bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 rounded-r-xl animate-shake">
                <AlertCircle size={20} className="text-red-500 mr-3 animate-pulse" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
            
            {/* Botón de submit con animación */}
            <div className="animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                disabled={isLoading || isCheckingAuth}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : isCheckingAuth ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verificando...
                    </>
                  ) : (
                    <>
                      Comenzar chat
                      <svg className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Estilos CSS para las animaciones */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out both;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out both;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out both;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}
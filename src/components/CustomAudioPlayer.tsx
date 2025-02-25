import { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
  src: string
  isUser: boolean
}

export function CustomAudioPlayer({ src, isUser }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  // const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Cargar metadatos del audio (duración)
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    // Cuando el audio está listo para reproducirse
    const handleCanPlay = () => {
      setIsReady(true)
      setError(false)
    }

    // Actualizar tiempo actual durante la reproducción
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    // Evento cuando finaliza la reproducción
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    // Manejar errores
    const handleError = (e: Event) => {
      console.error('Error al cargar o reproducir el audio:', e)
      setError(true)
      setIsReady(false)
      setIsPlaying(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    // Safari a veces necesita una carga explícita
    audio.load()

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [src]) // Recargar cuando cambie la fuente

  // Toggle reproducción con manejo específico para Safari
  const togglePlay = () => {
    if (!audioRef.current || !isReady) return

    const playPromise = isPlaying 
      ? audioRef.current.pause() 
      : audioRef.current.play()
    
    // Safari puede devolver undefined en lugar de una promesa
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(!isPlaying)
        })
        .catch(error => {
          console.error('Error al reproducir:', error)
          // Muchos navegadores (incluyendo Safari) requieren interacción del usuario
          // antes de permitir la reproducción automática
          setIsPlaying(false)
        })
    } else {
      // Para navegadores que no devuelven una promesa (como versiones antiguas de Safari)
      setIsPlaying(!isPlaying)
    }
  }

  // Formatear tiempo en MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // Extraer tipo MIME del src (para blob URLs usamos webm como fallback)
  const getMimeType = () => {
    if (src.startsWith('blob:')) {
      return 'audio/webm' // Asumimos WebM para blobs creados en la app
    }
    // Para URLs normales, intentar determinar por extensión
    const extension = src.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'mp3': return 'audio/mpeg'
      case 'm4a': return 'audio/mp4'
      case 'ogg': return 'audio/ogg'
      case 'wav': return 'audio/wav'
      default: return 'audio/webm'
    }
  }

  return (
    <div className="w-full my-1">
      {/* Audio nativo oculto con múltiples fuentes para compatibilidad */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        // Importante: No usar controls aquí ya que usamos nuestra propia UI
      >
        {/* La fuente principal (probablemente webm de la grabación) */}
        <source src={src} type={getMimeType()} />
        {/* Fallback para Safari si tenemos una versión MP3 (en este caso no tenemos) */}
        {/* <source src={src.replace('.webm', '.mp3')} type="audio/mpeg" /> */}
        Tu navegador no soporta la reproducción de audio.
      </audio>
      
      {/* UI simplificada: solo botón play y tiempo */}
      <div 
        className="flex items-center gap-2 w-full"
        style={{ 
          minHeight: '36px',
          backgroundColor: isUser ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
          borderRadius: '12px',
          padding: '4px 8px'
        }}
      >
        {/* Botón de reproducción */}
        <button 
          onClick={togglePlay}
          disabled={!isReady || error}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
            ${(!isReady || error) ? 'opacity-50' : 'opacity-100'}`}
          style={{ 
            backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
          }}
        >
          {error ? (
            // Icono de error
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 4L22 20H2L12 4Z" fill={isUser ? "white" : "black"} />
              <rect x="11" y="10" width="2" height="6" fill={isUser ? "black" : "white"} />
              <rect x="11" y="18" width="2" height="2" fill={isUser ? "black" : "white"} />
            </svg>
          ) : isPlaying ? (
            // Icono de pausa
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="4" width="4" height="16" fill={isUser ? "white" : "black"} />
              <rect x="14" y="4" width="4" height="16" fill={isUser ? "white" : "black"} />
            </svg>
          ) : (
            // Icono de reproducción
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 3L19 12L5 21V3Z" fill={isUser ? "white" : "black"} />
            </svg>
          )}
        </button>
        
        {/* Espacio vacío flexible para ocupar el centro */}
        <div className="flex-1"></div>
        
        {/* Solo tiempo actual */}
        <div className="text-xs opacity-80 min-w-[42px] text-right">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  )
}
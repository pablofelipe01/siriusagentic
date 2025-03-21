import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  // src: string     <--- Si solamente tienes un src, ver ejemplo de “doble <source>” más abajo
  srcWebm: string,   // Ejemplo: URL WebM (puede ser blob:)
  srcMp3?: string,   // Ejemplo: URL MP3 fallback (opcional)
  isUser: boolean
}

export function CustomAudioPlayer({ srcWebm, srcMp3, isUser }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);          // Duración total
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Evento: metadatos cargados (nos da duración, etc.)
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    // Cuando el audio está listo para reproducir
    const handleCanPlay = () => {
      setIsReady(true);
      setError(false);
    };

    // Actualizar tiempo actual
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Al terminar la reproducción
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Manejo de errores
    const handleError = (e: Event) => {
      console.error('Error al cargar/reproducir audio:', e);
      setError(true);
      setIsReady(false);
      setIsPlaying(false);
    };

    // Suscribir eventos
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Safari a veces necesita invocar load() explícitamente
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [srcWebm, srcMp3]);

  // Inicia/pausa la reproducción
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;

    if (!isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error('Error al reproducir:', err);
            setIsPlaying(false);
          });
      } else {
        // Navegadores antiguos (Safari) que no devuelven Promise en .play()
        setIsPlaying(true);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Formatear tiempo M:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full my-1">
      {/* Audio oculto (nuestra UI es custom) */}
      <audio ref={audioRef} preload="metadata">
        {/* Fuente principal: WebM */}
        <source src={srcWebm} type="audio/webm" />
        {/* Fallback MP3 (solo si tenemos srcMp3) */}
        {srcMp3 && <source src={srcMp3} type="audio/mpeg" />}
        Tu navegador no soporta la reproducción de audio.
      </audio>

      {/* Controles custom */}
      <div 
        className="flex items-center gap-2 w-full"
        style={{
          minHeight: '36px',
          backgroundColor: isUser ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
          borderRadius: '12px',
          padding: '4px 8px',
        }}
      >
        {/* Botón Play/Pause/Error */}
        <button
          onClick={togglePlay}
          disabled={!isReady || error}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
            ${(!isReady || error) ? 'opacity-50' : 'opacity-100'}`}
          style={{
            backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
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
            // Icono Pausa
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="4" width="4" height="16" fill={isUser ? "white" : "black"} />
              <rect x="14" y="4" width="4" height="16" fill={isUser ? "white" : "black"} />
            </svg>
          ) : (
            // Icono Play
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 3L19 12L5 21V3Z" fill={isUser ? "white" : "black"} />
            </svg>
          )}
        </button>

        <div className="flex-1"></div>

        {/* currentTime / duration */}
        <div className="text-xs opacity-80 min-w-[42px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}

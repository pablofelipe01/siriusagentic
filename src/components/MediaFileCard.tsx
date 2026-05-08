import { ExternalLink, Archive, Image, FileVideo, FileText, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export interface FileResult {
  id: string
  name: string
  cid: string
  url: string
  autor?: string
  descripcion?: string
  fecha?: string
  carpeta?: string
}

interface MediaFileCardProps {
  file: FileResult
  onArchive?: (id: string) => void
}

function isImage(name: string) {
  return /\.(jpg|jpeg|png|gif|webp|heic)$/i.test(name)
}

function isVideo(name: string) {
  return /\.(mp4|mov|avi|mkv|webm)$/i.test(name)
}

export function MediaFileCard({ file, onArchive }: MediaFileCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(file.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02]"
      style={{ background: 'rgba(0,163,255,0.05)', border: '1px solid rgba(0,163,255,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
    >
      {/* Thumbnail */}
      <div className="h-28 flex items-center justify-center overflow-hidden relative" style={{ background: 'rgba(0,8,20,0.6)' }}>
        {isImage(file.name) ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : isVideo(file.name) ? (
          <div className="flex flex-col items-center gap-1">
            <FileVideo className="text-[#00A3FF]" size={32} />
            <span className="text-[#4A7FA5] text-[9px] uppercase tracking-wider">Video</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <FileText className="text-[#4A7FA5]" size={32} />
            <span className="text-[#4A7FA5] text-[9px] uppercase tracking-wider">Doc</span>
          </div>
        )}
        {/* Gradient overlay en la parte inferior de la imagen */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#000814]/80 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-white truncate" title={file.name} style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
          {file.name}
        </p>
        {file.autor && (
          <p className="text-[10px]" style={{ color: '#4A7FA5' }}>
            {file.autor}
          </p>
        )}
        {file.fecha && (
          <p className="text-[10px]" style={{ color: 'rgba(74,127,165,0.7)' }}>{file.fecha}</p>
        )}
        {file.descripcion && (
          <p className="text-[10px] line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{file.descripcion}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex" style={{ borderTop: '1px solid rgba(0,163,255,0.1)' }}>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-all duration-200"
          style={{ color: '#00A3FF' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,163,255,0.08)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <ExternalLink size={11} />
          Abrir
        </a>
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-all duration-200"
          style={{ color: copied ? '#00A3FF' : '#4A7FA5', borderLeft: '1px solid rgba(0,163,255,0.1)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,163,255,0.08)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copiado' : 'URL'}
        </button>
        {onArchive && (
          <button
            onClick={() => onArchive(file.id)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-all duration-200"
            style={{ color: '#4A7FA5', borderLeft: '1px solid rgba(0,163,255,0.1)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.08)'; (e.currentTarget as HTMLElement).style.color = '#FCD34D' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#4A7FA5' }}
          >
            <Archive size={11} />
            Archivar
          </button>
        )}
      </div>
    </div>
  )
}

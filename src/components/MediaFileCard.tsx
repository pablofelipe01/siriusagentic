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
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="h-28 bg-black/20 flex items-center justify-center overflow-hidden">
        {isImage(file.name) ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : isVideo(file.name) ? (
          <FileVideo className="text-blue-300" size={36} />
        ) : (
          <FileText className="text-gray-400" size={36} />
        )}
      </div>

      {/* Info */}
      <div className="p-2 flex flex-col gap-1 flex-1">
        <p className="text-xs font-medium text-white truncate" title={file.name}>
          {file.name}
        </p>
        {file.autor && (
          <p className="text-[10px] text-white/60">
            Por: {file.autor}
          </p>
        )}
        {file.fecha && (
          <p className="text-[10px] text-white/50">{file.fecha}</p>
        )}
        {file.descripcion && (
          <p className="text-[10px] text-white/60 line-clamp-2">{file.descripcion}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex border-t border-white/10">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] text-blue-300 hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={12} />
          Abrir
        </a>
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] text-white/60 hover:bg-white/5 transition-colors border-l border-white/10"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copiado' : 'URL'}
        </button>
        {onArchive && (
          <button
            onClick={() => onArchive(file.id)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] text-white/40 hover:bg-white/5 hover:text-yellow-400 transition-colors border-l border-white/10"
          >
            <Archive size={12} />
            Archivar
          </button>
        )}
      </div>
    </div>
  )
}

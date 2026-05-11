import { ExternalLink, Archive, Image, FileVideo, FileText, Copy, Check, Trash2 } from 'lucide-react'
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
  onDelete?: (id: string) => void
}

function isImage(name: string) {
  return /\.(jpg|jpeg|png|gif|webp|heic)$/i.test(name)
}

function isVideo(name: string) {
  return /\.(mp4|mov|avi|mkv|webm)$/i.test(name)
}

export function MediaFileCard({ file, onArchive, onDelete }: MediaFileCardProps) {
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(file.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] group relative"
      style={{
        background: 'rgba(0,8,20,0.6)',
        border: '1px solid rgba(0,163,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Thumbnail */}
      <div className="h-36 flex items-center justify-center overflow-hidden relative" style={{ background: 'rgba(0,8,20,0.8)' }}>
        {isImage(file.name) ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : isVideo(file.name) ? (
          <div className="flex flex-col items-center gap-1.5">
            <FileVideo className="text-[#00A3FF]" size={36} />
            <span className="text-[#4A7FA5] text-[9px] uppercase tracking-widest" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Video</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <FileText className="text-[#4A7FA5]" size={36} />
            <span className="text-[#4A7FA5] text-[9px] uppercase tracking-widest" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Doc</span>
          </div>
        )}
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#000814]/90 to-transparent" />
        {/* Hover overlay — Abrir */}
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(0,8,20,0.52)' }}
        >
          <span
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #00A3FF, #0154AC)', boxShadow: '0 4px 20px rgba(0,163,255,0.45)', fontFamily: 'Utile, Arial, sans-serif' }}
          >
            <ExternalLink size={14} />
            Abrir
          </span>
        </a>
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-1.5 flex flex-col gap-1 flex-1">
        <p className="text-xs font-bold text-white truncate" title={file.name} style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
          {file.name}
        </p>
        {file.autor && (
          <p className="text-[10px] font-semibold" style={{ color: '#4A7FA5', fontFamily: 'Utile, Arial, sans-serif' }}>
            {file.autor}
          </p>
        )}
        {file.fecha && (
          <p className="text-[10px]" style={{ color: 'rgba(74,127,165,0.65)', fontFamily: 'Utile, Arial, sans-serif' }}>{file.fecha}</p>
        )}
        {file.descripcion && (
          <p className="text-[10px] line-clamp-2 mt-0.5" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Utile, Arial, sans-serif' }}>{file.descripcion}</p>
        )}
      </div>

      {/* Actions — icon only with tooltips */}
      <div className="flex items-center justify-around px-2 py-2.5" style={{ borderTop: '1px solid rgba(0,163,255,0.12)' }}>
        <button
          onClick={handleCopy}
          title={copied ? 'URL copiada' : 'Copiar URL'}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
          style={{ color: copied ? '#00A3FF' : '#4A7FA5' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,163,255,0.12)'; (e.currentTarget as HTMLElement).style.color = '#00A3FF' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; if (!copied) (e.currentTarget as HTMLElement).style.color = '#4A7FA5' }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>

        {onArchive && (
          <>
            <button
              onClick={() => setConfirmArchive(true)}
              title="Archivar archivo"
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
              style={{ color: '#4A7FA5' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.12)'; (e.currentTarget as HTMLElement).style.color = '#FCD34D' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#4A7FA5' }}
            >
              <Archive size={15} />
            </button>

            {/* Archive confirmation overlay */}
            {confirmArchive && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl z-20 p-4"
                style={{
                  background: 'rgba(0,4,12,0.92)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(251,191,36,0.35)',
                }}
              >
                <Archive size={22} className="text-[#FCD34D]" />
                <p className="text-white text-xs font-bold text-center leading-snug" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
                  ¿Archivar este archivo?
                </p>
                <p className="text-[#FCD34D]/70 text-[10px] text-center leading-snug" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
                  Se moverá a la carpeta archived
                </p>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setConfirmArchive(false)}
                    className="flex-1 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Utile, Arial, sans-serif' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => { onArchive(file.id); setConfirmArchive(false) }}
                    className="flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200"
                    style={{ background: 'rgba(251,191,36,0.2)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.4)', fontFamily: 'Utile, Arial, sans-serif' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.35)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.2)' }}
                  >
                    Archivar
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {onDelete && (
          <>
            <button
              onClick={() => setConfirmDelete(true)}
              title="Eliminar archivo"
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
            style={{
              color: '#4A7FA5',
              background: 'transparent',
              border: '1px solid transparent',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.12)'; (e.currentTarget as HTMLElement).style.color = '#F87171' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#4A7FA5' }}
          >
            <Trash2 size={15} />
          </button>

            {/* Confirmation overlay */}
            {confirmDelete && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl z-20 p-4"
                style={{
                  background: 'rgba(0,4,12,0.92)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(248,113,113,0.35)',
                }}
              >
                <Trash2 size={22} className="text-[#F87171]" />
                <p className="text-white text-xs font-bold text-center leading-snug" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
                  ¿Eliminar este archivo?
                </p>
                <p className="text-[#F87171]/70 text-[10px] text-center leading-snug" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
                  Esta acción no se puede deshacer
                </p>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Utile, Arial, sans-serif' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => { onDelete(file.id); setConfirmDelete(false) }}
                    className="flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200"
                    style={{ background: 'rgba(248,113,113,0.2)', color: '#F87171', border: '1px solid rgba(248,113,113,0.4)', fontFamily: 'Utile, Arial, sans-serif' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.35)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.2)' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

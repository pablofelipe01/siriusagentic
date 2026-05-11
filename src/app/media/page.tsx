'use client'

import React, { useState, useRef, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { Home, Send, Paperclip, X, Loader2, FolderOpen, Bot, User } from 'lucide-react'
import { MediaFileCard, FileResult } from '@/components/MediaFileCard'

// ── Types ──────────────────────────────────────────────────────────────────────

type Carpeta =
  | 'fotos/pirolisis'
  | 'fotos/laboratorio'
  | 'fotos/sg-sst'
  | 'fotos/general'
  | 'videos/pirolisis'
  | 'videos/laboratorio'
  | 'archived'

const CARPETAS: Carpeta[] = [
  'fotos/general',
  'fotos/laboratorio',
  'fotos/pirolisis',
  'fotos/sg-sst',
  'videos/laboratorio',
  'videos/pirolisis',
  'archived',
]

type MediaMessage = {
  id: string
  sender: 'user' | 'bot'
  type: 'text' | 'file-list' | 'upload-confirm'
  text: string
  files?: FileResult[]
  carpeta?: string
  timestamp: Date
}

// ── Upload Modal ──────────────────────────────────────────────────────────────

interface UploadModalProps {
  file: File
  autor: string
  onClose: () => void
  onUpload: (carpeta: Carpeta, descripcion: string) => void
  isUploading: boolean
}

function UploadModal({ file, autor, onClose, onUpload, isUploading }: UploadModalProps) {
  const [carpeta, setCarpeta] = useState<Carpeta>('fotos/general')
  const [descripcion, setDescripcion] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!descripcion.trim()) return
    onUpload(carpeta, descripcion.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,8,20,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(145deg, rgba(10,18,36,0.98) 0%, rgba(1,29,61,0.98) 100%)', border: '1px solid rgba(0,163,255,0.2)', boxShadow: '0 0 60px rgba(0,163,255,0.08), 0 32px 64px rgba(0,0,0,0.5)' }}>
        {/* Acento superior */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#00A3FF] via-[#0154AC] to-[#00A3FF]" />

        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-white font-black flex items-center gap-2.5" style={{ fontFamily: 'Utile, Arial, sans-serif', letterSpacing: '-0.3px' }}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00A3FF]/20 to-[#0154AC]/20 border border-[#00A3FF]/25 flex items-center justify-center">
              <FolderOpen size={15} className="text-[#00A3FF]" />
            </div>
            Subir archivo
          </h2>
          <button onClick={onClose} className="text-[#4A7FA5] hover:text-white transition-all duration-200 p-1.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#00A3FF]/20 to-transparent mb-5" />

        <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col gap-4">
          {/* File info */}
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(0,163,255,0.06)', border: '1px solid rgba(0,163,255,0.15)' }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A3FF]/20 to-[#0154AC]/20 border border-[#00A3FF]/25 flex items-center justify-center flex-shrink-0">
              <Paperclip size={16} className="text-[#00A3FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>{file.name}</p>
              <p className="text-[#4A7FA5] text-xs">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>

          {/* Carpeta */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#7AAECB] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Carpeta destino</label>
            <select
              value={carpeta}
              onChange={(e) => setCarpeta(e.target.value as Carpeta)}
              className="rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-all duration-200"
              style={{ background: 'rgba(0,163,255,0.05)', border: '1.5px solid rgba(0,163,255,0.15)', fontFamily: 'Utile, Arial, sans-serif' }}
            >
              {CARPETAS.map((c) => (
                <option key={c} value={c} style={{ background: '#0A1224' }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#7AAECB] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe brevemente el contenido..."
              rows={3}
              className="rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#2A4A65] outline-none transition-all duration-200 resize-none"
              style={{ background: 'rgba(0,163,255,0.05)', border: '1.5px solid rgba(0,163,255,0.15)', fontFamily: 'Utile, Arial, sans-serif' }}
            />
          </div>

          {/* Autor */}
          <p className="text-[#2A4A65] text-xs" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Autor: <span className="text-[#4A7FA5]">{autor || 'Anónimo'}</span></p>

          <button
            type="submit"
            disabled={isUploading || !descripcion.trim()}
            className="group relative w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #00A3FF 0%, #0154AC 100%)', fontFamily: 'Utile, Arial, sans-serif', boxShadow: '0 4px 20px rgba(0,163,255,0.25)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Subir a Sirius Media
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Message Bubble ─────────────────────────────────────────────────────────────

function parseInline(text: string): React.ReactNode[] {
  return text.split(/(\.\*[^*]+\.\*|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i}>{part.slice(1, -1)}</em>
    return <span key={i}>{part}</span>
  })
}

function renderMarkdown(text: string): React.ReactNode[] {
  return text.split('\n').flatMap((line, lineIdx, arr) => {
    const nodes: React.ReactNode[] = []
    if (line.startsWith('- ') || line.startsWith('\u2022 ')) {
      nodes.push(
        <span key={`li-${lineIdx}`} className="flex gap-1.5 items-start">
          <span className="text-[#00A3FF] flex-shrink-0">•</span>
          <span>{parseInline(line.slice(2))}</span>
        </span>
      )
    } else {
      nodes.push(<span key={`l-${lineIdx}`}>{parseInline(line)}</span>)
    }
    if (lineIdx < arr.length - 1) nodes.push(<br key={`br-${lineIdx}`} />)
    return nodes
  })
}

interface BubbleProps {
  msg: MediaMessage
  onArchive: (id: string, msgId: string) => void
  onDelete: (id: string, msgId: string) => void
}

function MessageBubble({ msg, onArchive, onDelete }: BubbleProps) {
  const isUser = msg.sender === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={isUser
          ? { background: 'linear-gradient(135deg, #00A3FF, #0154AC)', boxShadow: '0 4px 12px rgba(0,163,255,0.3)' }
          : { background: 'rgba(0,163,255,0.1)', border: '1px solid rgba(0,163,255,0.25)' }
        }
      >
        {isUser ? <User size={15} className="text-white" /> : <Bot size={15} className="text-[#00A3FF]" />}
      </div>

      <div className={`flex flex-col gap-1.5 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Text bubble */}
        {msg.text && (
          <div
            className="rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap"
            style={isUser
              ? { background: 'linear-gradient(135deg, #00A3FF, #0154AC)', color: 'white', borderRadius: '18px 4px 18px 18px', boxShadow: '0 4px 16px rgba(0,163,255,0.2)' }
              : { background: 'rgba(0,8,20,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,163,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '4px 18px 18px 18px', fontFamily: 'Utile, Arial, sans-serif' }
            }
          >
            {renderMarkdown(msg.text)}
          </div>
        )}

        {/* File grid */}
        {msg.files && msg.files.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
            {msg.files.map((f) => (
              <MediaFileCard
                key={f.id}
                file={f}
                onArchive={(id) => onArchive(id, msg.id)}
                onDelete={(id) => onDelete(id, msg.id)}
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px]" style={{ color: 'rgba(74,127,165,0.7)', fontFamily: 'Utile, Arial, sans-serif' }}>
          {msg.timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function MediaPage() {
  const [messages, setMessages] = useState<MediaMessage[]>([
    {
      id: '0',
      sender: 'bot',
      type: 'text',
      text: '¡Hola! Soy el agente multimedia de Sirius. Puedo ayudarte a:\n\n- **"lista fotos de laboratorio"**\n- **"busca videos de pirólisis"**\n- **"archiva [ID]"**\n\nPara subir archivos usa el botón 📎.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [userName, setUserName] = useState('Anónimo')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('userName')
    if (saved) setUserName(saved.replace(/[<>"'`]/g, '').trim().slice(0, 50) || 'Anónimo')
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (msg: Omit<MediaMessage, 'id' | 'timestamp'>) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: crypto.randomUUID(), timestamp: new Date() },
    ])
  }

  const handleSend = async (e?: FormEvent, overrideText?: string) => {
    e?.preventDefault()
    const text = (overrideText ?? input).trim()
    if (!text || isLoading) return

    addMessage({ sender: 'user', type: 'text', text })
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comando: text }),
      })
      const data = await res.json()

      addMessage({
        sender: 'bot',
        type: data.files?.length ? 'file-list' : 'text',
        text: data.message ?? data.error ?? 'Respuesta recibida.',
        files: data.files,
        carpeta: data.carpeta,
      })
    } catch {
      addMessage({ sender: 'bot', type: 'text', text: 'Error de conexión. Intenta de nuevo.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPendingFile(file)
    // Reset input so the same file can be selected again
    e.target.value = ''
  }

  const handleUpload = async (carpeta: Carpeta, descripcion: string) => {
    if (!pendingFile) return
    setIsUploading(true)

    const fileName = pendingFile.name
    addMessage({
      sender: 'user',
      type: 'text',
      text: `📎 Subiendo **${fileName}** a **${carpeta}**…`,
    })

    try {
      const formData = new FormData()
      formData.append('file', pendingFile)
      formData.append('carpeta', carpeta)
      formData.append('autor', userName)
      formData.append('descripcion', descripcion)

      const res = await fetch('/api/media', { method: 'POST', body: formData })
      const data = await res.json()

      if (data.success) {
        addMessage({
          sender: 'bot',
          type: 'upload-confirm',
          text: data.message ?? `Archivo subido correctamente.`,
          files: data.file ? [data.file] : undefined,
        })
      } else {
        addMessage({ sender: 'bot', type: 'text', text: data.error ?? 'Error al subir el archivo.' })
      }
    } catch {
      addMessage({ sender: 'bot', type: 'text', text: 'Error de conexión al subir el archivo.' })
    } finally {
      setIsUploading(false)
      setPendingFile(null)
    }
  }

  const handleArchive = async (fileId: string, _msgId: string) => {
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive', fileId }),
      })
      const data = await res.json()
      addMessage({
        sender: 'bot',
        type: 'text',
        text: data.success ? 'Archivo movido a **archived**.' : 'Error al archivar.',
      })
    } catch {
      addMessage({ sender: 'bot', type: 'text', text: 'Error de conexión.' })
    }
  }

  const handleDelete = async (fileId: string, _msgId: string) => {
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', fileId }),
      })
      const data = await res.json()
      addMessage({
        sender: 'bot',
        type: 'text',
        text: data.success ? 'Archivo **eliminado** permanentemente.' : 'Error al eliminar.',
      })
    } catch {
      addMessage({ sender: 'bot', type: 'text', text: 'Error de conexión.' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ── Background: nature photo + dark overlay ─────────────────────────── */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <img
          src="/DSC_3239.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(0,5,15,0.82) 0%, rgba(0,18,40,0.76) 50%, rgba(0,8,20,0.85) 100%)' }}
        />
      </div>
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-3.5 relative" style={{ zIndex: 50, background: 'rgba(0,5,15,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,163,255,0.15)' }}>
        <Link
          href="/"
          className="text-[#4A7FA5] hover:text-white transition-all duration-200 p-1.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10"
        >
          <Home size={17} />
        </Link>
        <div className="w-px h-5" style={{ background: 'rgba(0,163,255,0.2)' }} />
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00A3FF22, #0154AC22)', border: '1px solid rgba(0,163,255,0.25)' }}>
            <Bot size={15} className="text-[#00A3FF]" />
          </div>
          <div>
            <p className="text-white text-sm font-black leading-none" style={{ fontFamily: 'Utile, Arial, sans-serif', letterSpacing: '-0.3px' }}>Sirius Media</p>
            <p className="text-[#4A7FA5] text-xs">Agente multimedia · Sirius Regenerative</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-pulse" />
          <span className="text-[#4A7FA5] text-xs" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Pinata IPFS</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 max-w-3xl w-full mx-auto relative" style={{ zIndex: 10 }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} onArchive={handleArchive} onDelete={handleDelete} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00A3FF22, #0154AC22)', border: '1px solid rgba(0,163,255,0.25)' }}>
              <Bot size={15} className="text-[#00A3FF]" />
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2.5" style={{ background: 'rgba(0,8,20,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,163,255,0.15)' }}>
              <Loader2 size={13} className="animate-spin text-[#00A3FF]" />
              <span className="text-[#4A7FA5] text-sm" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Consultando Pinata…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 relative" style={{ zIndex: 50, background: 'rgba(0,5,15,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderTop: '1px solid rgba(0,163,255,0.15)' }}>
        <form
          onSubmit={handleSend}
          className="max-w-3xl mx-auto flex items-center gap-2"
        >
          {/* File attach */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileSelected}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[#4A7FA5] hover:text-[#00A3FF] p-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/10 flex-shrink-0"
            title="Adjuntar archivo"
          >
            <Paperclip size={18} />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ej: "lista fotos de laboratorio" o "busca videos de pirólisis"'
            disabled={isLoading}
            className="media-chat-input flex-1 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all duration-200 disabled:opacity-50"
            style={{ fontFamily: 'Utile, Arial, sans-serif' }}
          />

          {/* Send */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="text-white p-2.5 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00A3FF, #0154AC)', boxShadow: '0 4px 16px rgba(0,163,255,0.3)' }}
          >
            <Send size={17} />
          </button>
        </form>

        {/* Quick actions */}
        <div className="max-w-3xl mx-auto mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {[
            { label: '📸 Fotos laboratorio', cmd: 'lista fotos de laboratorio' },
            { label: '🎬 Videos pirólisis', cmd: 'lista videos de pirolisis' },
            { label: '⚠️ Fotos SG-SST', cmd: 'lista fotos de sg-sst' },
            { label: '🌿 Fotos generales', cmd: 'lista fotos general' },
          ].map(({ label, cmd }) => (
            <button
              key={cmd}
              onClick={() => handleSend(undefined, cmd)}
              className="media-quick-action whitespace-nowrap text-xs font-medium transition-all duration-200 hover:scale-105 rounded-full px-3.5 py-1.5 flex-shrink-0"
              style={{ fontFamily: 'Utile, Arial, sans-serif' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Upload modal */}
      {pendingFile && (
        <UploadModal
          file={pendingFile}
          autor={userName}
          onClose={() => setPendingFile(null)}
          onUpload={handleUpload}
          isUploading={isUploading}
        />
      )}
    </div>
  )
}

'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <FolderOpen size={18} className="text-blue-400" />
            Subir archivo
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {/* File info */}
          <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Paperclip size={16} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{file.name}</p>
              <p className="text-white/40 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>

          {/* Carpeta */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-sm">Carpeta destino</label>
            <select
              value={carpeta}
              onChange={(e) => setCarpeta(e.target.value as Carpeta)}
              className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            >
              {CARPETAS.map((c) => (
                <option key={c} value={c} className="bg-gray-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-sm">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe brevemente el contenido..."
              rows={3}
              className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>

          {/* Autor (read-only) */}
          <p className="text-white/40 text-xs">Autor: {autor || 'Anónimo'}</p>

          <button
            type="submit"
            disabled={isUploading || !descripcion.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Send size={16} />
                Subir a Pinata
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Message Bubble ─────────────────────────────────────────────────────────────

function renderMarkdown(text: string) {
  // Simple bold: **text** → <strong>text</strong>
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

interface BubbleProps {
  msg: MediaMessage
  onArchive: (id: string, msgId: string) => void
}

function MessageBubble({ msg, onArchive }: BubbleProps) {
  const isUser = msg.sender === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white ${
          isUser ? 'bg-blue-600' : 'bg-emerald-700'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Text bubble */}
        {msg.text && (
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              isUser
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-white/10 text-white/90 rounded-tl-sm'
            }`}
          >
            {renderMarkdown(msg.text)}
          </div>
        )}

        {/* File grid */}
        {msg.files && msg.files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg">
            {msg.files.map((f) => (
              <MediaFileCard
                key={f.id}
                file={f}
                onArchive={(id) => onArchive(id, msg.id)}
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-white/30">
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
    if (saved) setUserName(saved)
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

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault()
    const text = input.trim()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md px-4 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
        >
          <Home size={18} />
        </Link>
        <div className="w-px h-5 bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center">
            <Bot size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Agente Multimedia</p>
            <p className="text-white/40 text-xs">Sirius Regenerative Solutions</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/50 text-xs">Pinata IPFS</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5 max-w-3xl w-full mx-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} onArchive={handleArchive} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-white/60" />
              <span className="text-white/60 text-sm">Consultando Pinata…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-white/10 bg-black/30 backdrop-blur-md px-4 py-3">
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
            className="text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            title="Adjuntar archivo"
          >
            <Paperclip size={20} />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ej: "lista fotos de laboratorio" o "busca videos de pirólisis"'
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-400 disabled:opacity-50"
          />

          {/* Send */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </form>

        {/* Quick actions */}
        <div className="max-w-3xl mx-auto mt-2 flex gap-2 overflow-x-auto pb-1">
          {[
            { label: 'Fotos laboratorio', cmd: 'lista fotos de laboratorio' },
            { label: 'Videos pirólisis', cmd: 'lista videos de pirolisis' },
            { label: 'Fotos SG-SST', cmd: 'lista fotos de sg-sst' },
            { label: 'Fotos generales', cmd: 'lista fotos general' },
          ].map(({ label, cmd }) => (
            <button
              key={cmd}
              onClick={() => { setInput(cmd); }}
              className="whitespace-nowrap text-xs text-white/50 hover:text-white border border-white/15 hover:border-white/30 rounded-full px-3 py-1 transition-colors flex-shrink-0"
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

// Tipos de mensajes admitidos
export type MessageType = 'text' | 'audio' | 'image' | 'document'

// Remitentes posibles
export type MessageSender = 'user' | 'bot'

// Estructura base de mensaje
export interface Message {
  type: MessageType
  sender: MessageSender
  content: string
  timestamp: Date
  audioUrl?: string
  imageUrl?: string
  documentUrl?: string
  documentName?: string
  fileSize?: number
  mimeType?: string
}

// Respuesta del webhook de n8n
export interface WebhookResponse {
  success: boolean
  response: string
  metadata: {
    timestamp: string
    sessionId: string
    [key: string]: any
  }
}

// Input para el componente ChatInput
export interface ChatInputProps {
  onSendMessage: (text: string, audioBlob?: Blob, imageFile?: File, documentFile?: File) => Promise<void>
  isLoading: boolean
}

// Props para el componente ChatMessage
export interface ChatMessageProps {
  message: Message
}

// Props para el componente ImageUploader
export interface ImageUploaderProps {
  onImageSelected: (imageFile: File) => void
  disabled: boolean
}

// Props para el componente DocumentUploader
export interface DocumentUploaderProps {
  onDocumentSelected: (documentFile: File) => void
  disabled: boolean
}

// Props para el componente AudioPlayer
export interface AudioPlayerProps {
  srcWebm: string
  srcMp3?: string
  isUser: boolean
}

// Props para el componente LoginForm
export interface LoginFormProps {
  onLogin: (email: string) => void
}

// Estructura para el body que se envía al webhook
export interface WebhookRequestBody {
  body: {
    messages: [{
      from: string
      type: string
      text?: string
      audio?: string
      image?: string
      document?: string
      mime_type?: string
      filename?: string
      caption?: string
    }]
    contacts: [{
      wa_id: string
    }]
  }
}
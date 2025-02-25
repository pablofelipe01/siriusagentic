// types/chat.ts

export type MessageType = 'text' | 'audio'
export type MessageSender = 'user' | 'bot'

export interface Message {
  type: MessageType
  sender: MessageSender
  content: string           // Texto del mensaje
  audioUrl?: string         // URL (blob:) para reproducir audio
  timestamp: Date
}

// Estructura del body al recibir un POST desde Next a n8n
export interface WebhookRequest {
  body: {
    messages: [{
      type: MessageType
      text?: string
      audio?: string        // base64 en caso de audio
      from: string
    }]
    contacts: [{
      wa_id: string
    }]
  }
}

// Respuesta que esperamos de n8n
export interface WebhookResponse {
  success: boolean
  response: string
  metadata: {
    timestamp: string
    sessionId: string
  }
}

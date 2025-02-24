// types/chat.ts
export type MessageType = 'text' | 'image' | 'audio' | 'video'
export type MessageSender = 'user' | 'bot'

export interface Message {
  type: MessageType
  sender: MessageSender
  content: string
  timestamp: Date
}

export interface WebhookRequest {
  body: {
    messages: [{
      type: MessageType
      text: string
      from: string
    }]
    contacts: [{
      wa_id: string
    }]
  }
}

export interface WebhookResponse {
  success: boolean
  response: string
  metadata: {
    timestamp: string
    sessionId: string
  }
}

// Interfaces auxiliares
export interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export interface ChatMessageProps {
  message: Message
}
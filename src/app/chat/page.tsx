// app/chat/page.tsx
'use client'

import { useState } from 'react'
import { Message, WebhookResponse } from '@/types/chat'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'

const N8N_WEBHOOK_URL = 'https://primary-production-41b1.up.railway.app/webhook-test/alma'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userId] = useState<string>('user-' + Math.random().toString(36).substr(2, 9))

  const handleSendMessage = async (content: string) => {
    setIsLoading(true)
    
    const userMessage: Message = {
      sender: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          body: {
            messages: [{
              type: 'text',
              text: content,
              from: userId
            }],
            contacts: [{
              wa_id: userId
            }]
          }
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: WebhookResponse = await response.json()
      
      if (data.success && data.response) {
        const botMessage: Message = {
          sender: 'bot',
          content: data.response,
          timestamp: new Date(data.metadata.timestamp)
        }
        setMessages(prev => [...prev, botMessage])
      }
      
    } catch (error) {
      console.error('Error sending message:', error)
      // Opcional: Mostrar mensaje de error al usuario
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}

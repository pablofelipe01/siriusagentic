// components/ChatMessage.tsx
import { Message } from '@/types/chat'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-lg p-3 max-w-[70%] ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        {/* Distinguimos si es texto o audio */}
        {message.type === 'text' && (
          <p>{message.content}</p>
        )}

        {message.type === 'audio' && message.audioUrl && (
          <audio controls>
            <source src={message.audioUrl} type="audio/webm" />
            Tu navegador no soporta la reproducción de audio.
          </audio>
        )}

        <div className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

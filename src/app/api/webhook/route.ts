import { NextRequest, NextResponse } from 'next/server'
import { ChatMessage, ApiResponse } from '@/types/chat'
import { sendMessageToWebhook } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const body: ChatMessage = await req.json()
    
    if (!body.message || !body.userId) {
      const errorResponse: ApiResponse = {
        output: '',
        status: 'error',
        metadata: {
          error: 'Message and userId are required'
        }
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const response: ApiResponse = await sendMessageToWebhook(body)
    return NextResponse.json(response)
    
  } catch (error) {
    const errorResponse: ApiResponse = {
      output: '',
      status: 'error',
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
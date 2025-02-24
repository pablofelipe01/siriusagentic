// lib/api.ts
export async function sendMessageToWebhook(message: ChatMessage): Promise<ApiResponse> {
    const response = await fetch('https://primary-production-41b1.up.railway.app/webhook-test/alma', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{
          type: message.type,
          text: message.message,
          from: message.userId,
        }],
        contacts: [{
          wa_id: message.userId
        }]
      })
    })
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  
    return response.json()
  }
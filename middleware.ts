// middleware.ts (opcional, para agregar autenticación)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Aquí puedes implementar tu lógica de autenticación
  const session = request.cookies.get('session')
  
  if (!session && request.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/chat/:path*'
}
// components/LoginForm.tsx
import { useState, FormEvent } from 'react'

interface LoginFormProps {
  onLogin: (email: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Validación básica de email
    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor, introduce un email válido')
      return
    }
    
    onLogin(email)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="!text-2xl !mb-6 !text-center !font-bold !text-blue-900">Bienvenido al chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="!block !text-gray-800 !font-medium !mb-2">
              Tu email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!w-full !p-2 !border !rounded-lg !text-gray-900 !bg-white"
              placeholder="ejemplo@dominio.com"
              required
            />
            {error && <p className="!text-red-500 !text-sm !mt-1">{error}</p>}
          </div>
          <button 
            type="submit"
            className="!w-full !bg-blue-700 !hover:bg-blue-800 !text-white !font-medium !py-2 !rounded-lg"
          >
            Comenzar chat
          </button>
        </form>
      </div>
    </div>
  )
}
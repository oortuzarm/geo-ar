import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../services/authApi'
import { ApiError } from '../../lib/apiFetch'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await forgotPassword(email.trim())
      setSent(true)
    } catch (err) {
      if (err instanceof ApiError && err.status >= 500) {
        setError('Error del servidor. Intenta de nuevo en unos minutos.')
      } else if (!(err instanceof ApiError)) {
        setError('No se pudo conectar con el servidor.')
      } else {
        // 404 / 422 — no revelar si el email existe o no
        setSent(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-10 md:h-12 w-auto object-contain select-none mx-auto"
              draggable={false}
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">

          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/25
                              flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Revisá tu correo</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Si el correo existe en nuestra plataforma, te enviaremos instrucciones para recuperar tu contraseña.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block text-sm text-brand-400 hover:text-brand-300 transition-colors"
              >
                ← Volver al login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-white mb-1">Recuperar contraseña</h2>
              <p className="text-sm text-gray-500 mb-5">
                Ingresa tu email y te enviaremos un link para restablecer tu contraseña.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="bg-gray-800 border border-gray-700 hover:border-gray-600
                               rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                               transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50
                                rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-500 active:bg-brand-700
                             text-white font-semibold py-2.5 rounded-xl text-sm
                             transition-colors disabled:opacity-50 disabled:cursor-wait
                             focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                             focus:ring-offset-gray-900 mt-1"
                >
                  {loading ? 'Enviando…' : 'Enviar instrucciones'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-5">
                <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  ← Volver al login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

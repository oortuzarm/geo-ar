import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../../services/authApi'
import { ApiError } from '../../lib/apiFetch'

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const navigate  = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [done,     setDone]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (!token) {
      setError('Token inválido. Solicitá un nuevo link de recuperación.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(token, password, confirm)
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 3000)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422 || err.status === 400) {
          setError('El link de recuperación es inválido o ya fue utilizado.')
        } else if (err.status === 410 || err.status === 404) {
          setError('El link de recuperación expiró. Solicitá uno nuevo.')
        } else {
          setError('Error del servidor. Intentá de nuevo en unos minutos.')
        }
      } else {
        setError('No se pudo conectar con el servidor.')
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

          {done ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25
                              flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">¡Contraseña actualizada!</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Tu contraseña fue cambiada correctamente. Te redirigimos al login en unos segundos.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full bg-brand-600 hover:bg-brand-500
                           text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Ir al login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-white mb-1">Nueva contraseña</h2>
              <p className="text-sm text-gray-500 mb-5">
                Elegí una contraseña nueva para tu cuenta.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Nueva contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="bg-gray-800 border border-gray-700 hover:border-gray-600
                               rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                               transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirm" className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repetí tu contraseña"
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
                  {loading ? 'Actualizando…' : 'Actualizar contraseña'}
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

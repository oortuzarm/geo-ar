import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ApiError } from '../../lib/apiFetch'
import PasswordInput from '../../components/ui/PasswordInput'

export default function RegisterPage() {
  const { isAuthenticated, isInitialized, register } = useAuthStore()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  if (isInitialized && isAuthenticated) {
    return <Navigate to="/app" replace />
  }

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

    setLoading(true)
    try {
      await register({ email, password, passwordConfirmation: confirm })
      navigate('/app', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          setError('Ese email ya está registrado o los datos son inválidos.')
        } else {
          setError('Error al crear la cuenta. Intentá de nuevo.')
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
          <img
            src="/logo-blanco.png"
            alt="Ubyca"
            className="h-10 md:h-12 w-auto object-contain select-none mx-auto"
            draggable={false}
          />
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-5">Crear cuenta</h2>

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

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Contraseña
              </label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600
                           rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                           transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm" className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Confirmar contraseña
              </label>
              <PasswordInput
                id="confirm"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repetí tu contraseña"
                className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600
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
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tenés cuenta?{' '}
            <Link
              to="/login"
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

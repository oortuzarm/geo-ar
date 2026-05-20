import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ApiError } from '../../lib/apiFetch'
import PasswordInput from '../../components/ui/PasswordInput'

const INPUT_BASE =
  'w-full bg-gray-800/80 border border-gray-700 hover:border-gray-600 rounded-lg px-3 py-2.5 ' +
  'text-sm text-gray-100 placeholder-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 ' +
  'transition-all duration-200'

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
          setError('Error al crear la cuenta. Intenta de nuevo.')
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
        <div className="text-center mb-5">
          <img
            src="/logo-blanco.png"
            alt="Ubyca"
            className="h-10 md:h-12 w-auto object-contain select-none mx-auto"
            draggable={false}
          />
        </div>

        {/* Value proposition */}
        <div className="text-center mb-7 px-2">
          <h1 className="text-[17px] font-bold text-white leading-snug mb-1.5">
            Convierte lugares reales en experiencias interactivas.
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Crea contenido geolocalizado y desbloquéalo según ubicación GPS.
          </p>
        </div>

        {/* Card */}
        <div className={[
          'bg-gray-900 border border-white/[0.07] rounded-2xl p-6',
          'shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_rgba(0,0,0,0.55)]',
        ].join(' ')}>
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
                className={INPUT_BASE}
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
                className={INPUT_BASE}
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
                className={INPUT_BASE}
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
                         text-white font-semibold py-2.5 rounded-xl text-sm mt-1
                         shadow-[0_2px_12px_rgba(2,132,199,0.2)]
                         hover:shadow-[0_4px_20px_rgba(2,132,199,0.35)] hover:-translate-y-px
                         active:translate-y-0
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-wait disabled:hover:translate-y-0
                         disabled:hover:shadow-[0_2px_12px_rgba(2,132,199,0.2)]
                         focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                         focus:ring-offset-gray-900"
            >
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          {/* Trust microcopy */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-3.5">
            <span className="text-[11px] text-gray-600">14 días gratis</span>
            <span className="text-gray-700 text-[9px] leading-none">•</span>
            <span className="text-[11px] text-gray-600">No necesitas tarjeta</span>
            <span className="text-gray-700 text-[9px] leading-none">•</span>
            <span className="text-[11px] text-gray-600">Configuración en minutos</span>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tienes cuenta?{' '}
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

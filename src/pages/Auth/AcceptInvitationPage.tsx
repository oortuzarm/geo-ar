import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getInvitationInfo, acceptInvitation } from '../../services/membersApi'
import type { InvitationTokenInfo } from '../../services/membersApi'
import { useAuthStore } from '../../store/authStore'
import { ApiError } from '../../lib/apiFetch'
import Spinner from '../../components/ui/Spinner'
import PasswordInput from '../../components/ui/PasswordInput'

const ROLE_LABEL: Record<string, string> = {
  editor: 'Editor', viewer: 'Visor',
}

type PageState = 'loading' | 'form' | 'expired' | 'accepted' | 'invalid' | 'success'

export default function AcceptInvitationPage() {
  const { token }      = useParams<{ token: string }>()
  const navigate       = useNavigate()
  const { refreshSession } = useAuthStore()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [info,      setInfo]      = useState<InvitationTokenInfo | null>(null)

  const [name,     setName]     = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    if (!token) { setPageState('invalid'); return }

    getInvitationInfo(token)
      .then((res) => {
        setInfo(res)
        if (res.expired)  { setPageState('expired');  return }
        if (res.accepted) { setPageState('accepted'); return }
        setPageState('form')
      })
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 404 || err.status === 410)) {
          setPageState('expired')
        } else {
          setPageState('invalid')
        }
      })
  }, [token])

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
      await acceptInvitation({
        token: token!,
        password,
        password_confirmation: confirm,
        name: name.trim() || undefined,
      })
      setPageState('success')

      // Try to auto-login via session cookie the backend may have set
      try {
        await refreshSession()
        setTimeout(() => navigate('/app', { replace: true }), 2000)
      } catch {
        setTimeout(() => navigate('/login', { replace: true }), 2000)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404 || err.status === 410) {
          setError('El link de invitación expiró. Pedí que te envíen uno nuevo.')
        } else if (err.status === 422) {
          setError('Los datos ingresados no son válidos. Revisá el formulario.')
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

          {/* Loading */}
          {pageState === 'loading' && (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          )}

          {/* Invalid token */}
          {pageState === 'invalid' && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/25
                              flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Link inválido</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Este link de invitación no es válido. Pedile al propietario que te reenvíe la invitación.
              </p>
              <Link to="/login"
                className="mt-6 inline-block text-sm text-brand-400 hover:text-brand-300 transition-colors">
                Ir al login →
              </Link>
            </div>
          )}

          {/* Expired */}
          {pageState === 'expired' && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25
                              flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Invitación expirada</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Este link ya no es válido. Pedile al propietario de la organización que te reenvíe la invitación.
              </p>
              <Link to="/login"
                className="mt-6 inline-block text-sm text-brand-400 hover:text-brand-300 transition-colors">
                Ir al login →
              </Link>
            </div>
          )}

          {/* Already accepted */}
          {pageState === 'accepted' && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25
                              flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Ya eres miembro</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Esta invitación ya fue aceptada. Iniciá sesión para acceder al dashboard.
              </p>
              <Link to="/login"
                className="mt-6 inline-block text-sm text-brand-400 hover:text-brand-300 transition-colors">
                Iniciar sesión →
              </Link>
            </div>
          )}

          {/* Success */}
          {pageState === 'success' && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25
                              flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">¡Bienvenido a Ubyca!</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Tu cuenta fue creada correctamente. Te redirigimos en unos segundos…
              </p>
            </div>
          )}

          {/* Form */}
          {pageState === 'form' && info && (
            <>
              {/* Invitation context */}
              <div className="mb-5 p-3.5 rounded-xl bg-gray-800/60 border border-gray-700 space-y-1.5">
                {info.organization?.name && (
                  <p className="text-xs text-gray-500">
                    Organización: <span className="text-gray-200 font-medium">{info.organization.name}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Email: <span className="text-gray-200 font-medium">{info.email}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Rol asignado:{' '}
                  <span className="text-brand-300 font-medium">{ROLE_LABEL[info.role] ?? info.role}</span>
                </p>
              </div>

              <h2 className="text-lg font-semibold text-white mb-1">Crear tu cuenta</h2>
              <p className="text-sm text-gray-500 mb-5">
                Configurá tu contraseña para acceder al dashboard.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name"
                    className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Nombre <span className="text-gray-600 normal-case tracking-normal">(opcional)</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="bg-gray-800 border border-gray-700 hover:border-gray-600
                               rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                               transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password"
                    className="text-xs font-medium text-gray-400 uppercase tracking-wide">
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
                  <label htmlFor="confirm"
                    className="text-xs font-medium text-gray-400 uppercase tracking-wide">
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
                  {loading ? 'Creando cuenta…' : 'Crear cuenta y unirme'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-5">
                ¿Ya tenés cuenta?{' '}
                <Link to="/login"
                  className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  Iniciar sesión
                </Link>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

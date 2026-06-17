import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ApiError } from '../../lib/apiFetch'
import PasswordInput from '../../components/ui/PasswordInput'
import { getSiteConfig } from '../../services/siteConfigApi'
import { resendVerificationCode } from '../../services/authApi'

const INPUT =
  'bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg px-3 py-2.5 ' +
  'text-sm text-gray-100 placeholder-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 ' +
  'transition-all duration-200'

const CODE_LENGTH = 6

export default function RegisterPage() {
  const { isAuthenticated, isInitialized, register, verifyEmailCode, pendingVerificationEmail } = useAuthStore()
  const navigate = useNavigate()

  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [trialDays, setTrialDays] = useState<number>(14)

  // Verification step state
  const [digits,        setDigits]        = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [verifyError,   setVerifyError]   = useState<string | null>(null)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    getSiteConfig()
      .then(cfg => setTrialDays(cfg.registerTrialDays))
      .catch(() => { /* keep default 14 */ })
  }, [])

  // Focus first empty digit box when verification step appears
  useEffect(() => {
    if (pendingVerificationEmail) {
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    }
  }, [pendingVerificationEmail])

  if (isInitialized && isAuthenticated) {
    return <Navigate to="/app/live-visits" replace />
  }

  // ── Registration form submit ──────────────────────────────────────────────

  async function handleRegister(e: React.FormEvent) {
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
      // Store sets pendingVerificationEmail — component re-renders into verification step
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

  // ── Verification digit input handlers ────────────────────────────────────

  function handleDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = cleaned
    setDigits(next)
    setVerifyError(null)
    if (cleaned && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleDigitPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < CODE_LENGTH) {
      setVerifyError('Ingresá los 6 dígitos del código.')
      return
    }
    setVerifyLoading(true)
    setVerifyError(null)
    try {
      await verifyEmailCode(pendingVerificationEmail!, code)
      navigate('/app/live-visits', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        let body: { code?: string } = {}
        try { body = JSON.parse(err.message) } catch { /* not JSON */ }
        if (body.code === 'code_expired') {
          setVerifyError('El código expiró. Solicitá uno nuevo.')
        } else {
          setVerifyError('Código incorrecto. Verificá e intentá de nuevo.')
        }
      } else {
        setVerifyError('No se pudo conectar con el servidor.')
      }
      setDigits(Array(CODE_LENGTH).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    } finally {
      setVerifyLoading(false)
    }
  }

  async function handleResend() {
    if (!pendingVerificationEmail) return
    setResendLoading(true)
    setResendMessage(null)
    setVerifyError(null)
    try {
      await resendVerificationCode(pendingVerificationEmail)
      setResendMessage('Código reenviado. Revisá tu correo.')
      setDigits(Array(CODE_LENGTH).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    } catch {
      setResendMessage('No se pudo reenviar. Intentá de nuevo.')
    } finally {
      setResendLoading(false)
    }
  }

  // ── Verification step UI ─────────────────────────────────────────────────

  if (pendingVerificationEmail) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">

          <div className="text-center mb-6">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-10 md:h-12 w-auto object-contain select-none mx-auto"
              draggable={false}
            />
          </div>

          <div className="bg-gray-900 border border-white/[0.07] rounded-2xl p-6
                          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_rgba(0,0,0,0.55)]">
            <h2 className="text-lg font-semibold text-white mb-2">Verificá tu correo</h2>
            <p className="text-sm text-gray-400 mb-1">
              Enviamos un código de verificación a:
            </p>
            <p className="text-sm font-medium text-brand-400 mb-5 truncate">
              {pendingVerificationEmail}
            </p>

            <form onSubmit={handleVerify} className="space-y-5">
              {/* 6 individual digit boxes */}
              <div className="flex gap-2 justify-between">
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={digit}
                    onChange={e => handleDigitChange(i, e.target.value)}
                    onKeyDown={e => handleDigitKeyDown(i, e)}
                    onPaste={i === 0 ? handleDigitPaste : undefined}
                    className="w-full aspect-square text-center text-xl font-bold
                               bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg
                               text-white
                               focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60
                               transition-all duration-200 caret-transparent"
                    autoComplete="off"
                  />
                ))}
              </div>

              <p className="text-xs text-gray-500 text-center">
                Ingresá el código de verificación enviado a tu correo.
              </p>

              {verifyError && (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50
                              rounded-lg px-3 py-2 text-center">
                  {verifyError}
                </p>
              )}

              {resendMessage && (
                <p className="text-sm text-green-400 bg-green-950/40 border border-green-800/50
                              rounded-lg px-3 py-2 text-center">
                  {resendMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={verifyLoading || digits.join('').length < CODE_LENGTH}
                className="w-full bg-brand-600 hover:bg-brand-500 active:bg-brand-700
                           text-white font-semibold py-2.5 rounded-xl text-sm
                           shadow-[0_2px_12px_rgba(2,132,199,0.2)]
                           hover:shadow-[0_4px_20px_rgba(2,132,199,0.35)] hover:-translate-y-px
                           active:translate-y-0
                           transition-all duration-200
                           disabled:opacity-50 disabled:cursor-wait
                           disabled:hover:translate-y-0 disabled:hover:shadow-[0_2px_12px_rgba(2,132,199,0.2)]
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                           focus:ring-offset-gray-900"
              >
                {verifyLoading ? 'Verificando…' : 'Verificar correo'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-500 mb-1">¿No recibiste el código?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-brand-400 hover:text-brand-300 font-medium
                           transition-colors disabled:opacity-50 disabled:cursor-wait"
              >
                {resendLoading ? 'Enviando…' : 'Reenviar correo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Registration form UI ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-6">
          <img
            src="/logo-blanco.png"
            alt="Ubyca"
            className="h-10 md:h-12 w-auto object-contain select-none mx-auto"
            draggable={false}
          />
        </div>

        {/* Conversion hook */}
        <div className="text-center mb-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
            Empieza tu prueba gratis
          </p>
          <p className="text-xs text-gray-500 tracking-wide">
            {trialDays} días gratis&nbsp;·&nbsp;No necesitas tarjeta
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-white/[0.07] rounded-2xl p-6
                        shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_rgba(0,0,0,0.55)]">
          <h2 className="text-lg font-semibold text-white mb-5">Crear cuenta</h2>

          <form onSubmit={handleRegister} className="space-y-4">
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
                className={INPUT}
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
                className={`w-full ${INPUT}`}
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
                className={`w-full ${INPUT}`}
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
                         disabled:opacity-50 disabled:cursor-wait
                         disabled:hover:translate-y-0 disabled:hover:shadow-[0_2px_12px_rgba(2,132,199,0.2)]
                         focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                         focus:ring-offset-gray-900"
            >
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

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

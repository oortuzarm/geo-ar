import { useEffect, useState } from 'react'
import Spinner from '../../components/ui/Spinner'
import Modal   from '../../components/ui/Modal'
import { useGeoStore }       from '../../store/geoStore'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { useAuthStore }      from '../../store/authStore'
import { ApiError }          from '../../lib/apiFetch'
import {
  listCredentials,
  createCredential,
  updateCredential,
  regenerateCredentialSecret,
} from '../../services/integrationsApi'
import type { ApiCredential, ApiCredentialWithSecret } from '../../types/integrations.types'

const BASE_ENDPOINT = 'https://api.ubyca.com/api/v1'

const SCOPES = [
  { value: 'analytics:read',    desc: 'Leer métricas y reportes de ubicaciones' },
  { value: 'presence:validate', desc: 'Validar presencia GPS en tiempo real' },
  { value: 'presence:check',    desc: 'Consultar estado de presencia activa' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function truncateKey(key: string) {
  return key.length > 28 ? `${key.slice(0, 24)}…` : key
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatRelative(iso: string | null) {
  if (!iso) return 'Nunca'
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (mins <  1)  return 'Ahora mismo'
  if (mins < 60)  return `Hace ${mins} min`
  const hrs  = Math.floor(mins  / 60)
  if (hrs  < 24)  return `Hace ${hrs}h`
  const days = Math.floor(hrs   / 24)
  if (days <  7)  return `Hace ${days}d`
  return formatDate(iso)
}

function copyText(
  text: string,
  label: string,
  addToast: (msg: string, type: 'success' | 'error') => void,
) {
  navigator.clipboard.writeText(text)
    .then(()  => addToast(`${label} copiado`, 'success'))
    .catch(() => addToast('No se pudo copiar', 'error'))
}

function buildIframeCode(projectId: string) {
  return [
    `<iframe`,
    `  src="${window.location.origin}/embed/${projectId}"`,
    `  width="100%"`,
    `  height="600"`,
    `  style="border:0;border-radius:16px;overflow:hidden;"`,
    `  allow="geolocation"`,
    `  allowfullscreen`,
    `></iframe>`,
  ].join('\n')
}

// ── Shared Card ───────────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900/70 border border-white/[0.07] rounded-2xl px-6 py-5 ${className}`}>
      {children}
    </div>
  )
}

// ── Scope badge ───────────────────────────────────────────────────────────────

const SCOPE_COLOR: Record<string, string> = {
  'analytics:read':    'bg-brand-900/50 text-brand-300 border-brand-700/40',
  'presence:validate': 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
  'presence:check':    'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
}

function ScopeBadge({ scope }: { scope: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${SCOPE_COLOR[scope] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}>
      {scope}
    </span>
  )
}

// ── Website card (unchanged) ──────────────────────────────────────────────────

function WebsiteCard() {
  const [copied, setCopied] = useState(false)
  const project = useWorkspaceStore((s) => s.project)
  const iframeCode = project ? buildIframeCode(project.id) : ''

  async function handleCopy() {
    if (!project) return
    try { await navigator.clipboard.writeText(iframeCode) }
    catch {
      const ta = document.createElement('textarea')
      ta.value = iframeCode
      ta.style.position = 'fixed'
      ta.style.opacity  = '0'
      document.body.appendChild(ta)
      ta.focus(); ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-100">Sitio web</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Inserta tu mapa interactivo en cualquier sitio web mediante un iframe.
        </p>
      </div>

      {!project ? (
        <p className="text-sm text-gray-600 py-2">
          Carga un workspace para ver el código de integración.
        </p>
      ) : (
        <>
          <textarea
            readOnly
            value={iframeCode}
            rows={8}
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3
                       text-xs font-mono text-gray-300 resize-none focus:outline-none
                       focus:ring-1 focus:ring-brand-500 leading-relaxed mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold',
                'transition-all duration-150 focus:outline-none focus:ring-2',
                'focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-900',
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-brand-600 hover:bg-brand-500 text-white',
              ].join(' ')}
            >
              {copied ? (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar código
                </>
              )}
            </button>
            <button
              onClick={() => window.open(`${window.location.origin}/embed/${project.id}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                         bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-gray-600
                         focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir preview
            </button>
          </div>
        </>
      )}
    </Card>
  )
}

// ── Create credential modal ───────────────────────────────────────────────────

interface CreateModalProps {
  onClose:   () => void
  onSuccess: (cred: ApiCredentialWithSecret) => void
}

function CreateModal({ onClose, onSuccess }: CreateModalProps) {
  const [name,    setName]    = useState('')
  const [scopes,  setScopes]  = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  function toggleScope(scope: string) {
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (scopes.length === 0) { setError('Seleccioná al menos un scope.'); return }
    setError(null)
    setLoading(true)
    try {
      const cred = await createCredential({ name: name.trim(), scopes })
      onSuccess(cred)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 422
          ? 'Nombre inválido o ya utilizado.'
          : 'No se pudo crear la credencial. Intenta de nuevo.')
      } else {
        setError('No se pudo conectar con el servidor.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-1">Nueva credencial</h3>
          <p className="text-sm text-gray-400 mb-5">
            El secret solo se muestra una vez al crear. Guárdalo en un lugar seguro.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Nombre
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Producción, Staging, Mi App…"
                className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg
                           px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                           transition-colors"
              />
            </div>

            {/* Scopes */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Scopes
              </label>
              {SCOPES.map((s) => {
                const checked = scopes.includes(s.value)
                return (
                  <label
                    key={s.value}
                    className={[
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                      checked
                        ? 'border-brand-500 bg-brand-900/20'
                        : 'border-gray-700 bg-gray-800/40 hover:border-gray-600',
                    ].join(' ')}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleScope(s.value)}
                      className="mt-0.5 accent-brand-500 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs font-mono font-semibold text-gray-200">{s.value}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{s.desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50
                            rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 justify-end pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300
                           border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                           bg-brand-600 hover:bg-brand-500 text-white transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Spinner size="sm" />}
                Crear credencial
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Secret reveal modal (one-time, Stripe-style) ──────────────────────────────

interface SecretRevealModalProps {
  apiKey:   string
  secret:   string
  onClose:  () => void
  addToast: (msg: string, type: 'success' | 'error') => void
}

function SecretRevealModal({ apiKey, secret, onClose, addToast }: SecretRevealModalProps) {
  const [keyCopied,    setKeyCopied]    = useState(false)
  const [secretCopied, setSecretCopied] = useState(false)

  function handleCopy(
    text: string,
    label: string,
    setter: (v: boolean) => void,
  ) {
    navigator.clipboard.writeText(text)
      .then(() => {
        addToast(`${label} copiado`, 'success')
        setter(true)
        setTimeout(() => setter(false), 2500)
      })
      .catch(() => addToast('No se pudo copiar', 'error'))
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-gray-900 border border-amber-700/50 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 bg-amber-900/40 border border-amber-700/50 rounded-xl
                            flex items-center justify-center flex-shrink-0 text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-100">Guarda estas credenciales</h3>
              <p className="text-sm text-amber-400/90 mt-0.5">
                El secret no se almacena y no podrá recuperarse. Este es el único momento en que lo verás.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* API Key */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                API Key
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5
                                font-mono text-xs text-gray-200 overflow-x-auto select-all">
                  {apiKey}
                </div>
                <button
                  onClick={() => handleCopy(apiKey, 'API Key', setKeyCopied)}
                  className={[
                    'px-3 py-2.5 rounded-lg text-xs font-medium border transition-all flex-shrink-0',
                    keyCopied
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'border-gray-700 text-gray-300 hover:bg-gray-800',
                  ].join(' ')}
                >
                  {keyCopied ? '✓' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Secret */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                Secret
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-950 border border-amber-700/40 rounded-lg px-3 py-2.5
                                font-mono text-xs text-amber-200 overflow-x-auto select-all">
                  {secret}
                </div>
                <button
                  onClick={() => handleCopy(secret, 'Secret', setSecretCopied)}
                  className={[
                    'px-3 py-2.5 rounded-lg text-xs font-medium border transition-all flex-shrink-0',
                    secretCopied
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'border-amber-700/50 text-amber-400 hover:bg-amber-900/30',
                  ].join(' ')}
                >
                  {secretCopied ? '✓' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gray-800
                         hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors"
            >
              Entendido, ya lo guardé
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Credential row ────────────────────────────────────────────────────────────

interface CredentialRowProps {
  credential:       ApiCredential
  isRegenerating:   boolean
  isTogglingActive: boolean
  onRegenerate:     (id: string) => void
  onToggleActive:   (id: string, active: boolean) => void
  addToast:         (msg: string, type: 'success' | 'error') => void
}

function CredentialRow({
  credential: cred,
  isRegenerating,
  isTogglingActive,
  onRegenerate,
  onToggleActive,
  addToast,
}: CredentialRowProps) {
  const [confirmRegen,      setConfirmRegen]      = useState(false)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const busy = isRegenerating || isTogglingActive

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        {/* Top row: name + status + actions */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            {/* Name + status */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-semibold text-sm text-gray-100">{cred.name}</span>
              <span className={[
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                cred.active
                  ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40'
                  : 'bg-gray-800 text-gray-500 border-gray-700',
              ].join(' ')}>
                <span className={`w-1 h-1 rounded-full ${cred.active ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                {cred.active ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            {/* Key + copy */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-gray-500">{truncateKey(cred.key)}</span>
              <button
                onClick={() => copyText(cred.key, 'API Key', addToast)}
                title="Copiar API Key"
                className="text-gray-700 hover:text-brand-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              disabled={busy}
              onClick={() => setConfirmRegen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-gray-700
                         text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {isRegenerating ? <Spinner size="sm" /> : 'Regenerar'}
            </button>
            <button
              disabled={busy}
              onClick={() =>
                cred.active
                  ? setConfirmDeactivate(true)
                  : onToggleActive(cred.id, true)
              }
              className={[
                'px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
                'disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1',
                cred.active
                  ? 'border-gray-700 text-gray-400 hover:text-red-400 hover:bg-red-900/20 hover:border-red-800/50'
                  : 'border-gray-700 text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/20',
              ].join(' ')}
            >
              {isTogglingActive ? <Spinner size="sm" /> : cred.active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </div>

        {/* Scopes */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cred.scopes.map((s) => <ScopeBadge key={s} scope={s} />)}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-gray-600 flex-wrap">
          <span>
            Último uso: <span className="text-gray-500">{formatRelative(cred.lastUsedAt)}</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
          <span>
            Creada: <span className="text-gray-500">{formatDate(cred.createdAt)}</span>
          </span>
        </div>
      </div>

      {/* Confirm regenerate */}
      <Modal
        open={confirmRegen}
        title="Regenerar secret"
        description="Al regenerar el secret, el anterior dejará de funcionar de inmediato. Cualquier sistema que lo use perderá autenticación. ¿Continuar?"
        confirmLabel="Regenerar"
        cancelLabel="Cancelar"
        danger
        onConfirm={() => { setConfirmRegen(false); onRegenerate(cred.id) }}
        onCancel={() => setConfirmRegen(false)}
      />

      {/* Confirm deactivate */}
      <Modal
        open={confirmDeactivate}
        title="Desactivar credencial"
        description={`"${cred.name}" quedará inactiva. Las requests que usen esta credencial comenzarán a fallar. Podés reactivarla cuando quieras.`}
        confirmLabel="Desactivar"
        cancelLabel="Cancelar"
        danger
        onConfirm={() => { setConfirmDeactivate(false); onToggleActive(cred.id, false) }}
        onCancel={() => setConfirmDeactivate(false)}
      />
    </>
  )
}

// ── API credentials section ───────────────────────────────────────────────────

function ApiCredentialsSection() {
  const addToast        = useGeoStore((s) => s.addToast)
  const currentUser     = useAuthStore((s) => s.currentUser)

  // Plan-level gates — default to permissive so legacy / nil-plan users are unblocked.
  const apiAccessEnabled    = currentUser?.apiAccessEnabled    ?? true
  const apiCredentialsLimit = currentUser?.apiCredentialsLimit ?? null   // null = unlimited

  const [credentials,    setCredentials]    = useState<ApiCredential[]>([])
  const [loading,        setLoading]        = useState(true)
  const [pageError,      setPageError]      = useState<string | null>(null)
  const [showCreate,     setShowCreate]     = useState(false)
  const [revealedSecret, setRevealedSecret] = useState<{ key: string; secret: string } | null>(null)
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)
  const [togglingId,     setTogglingId]     = useState<string | null>(null)

  const activeCount = credentials.filter((c) => c.active).length
  const atLimit     = apiCredentialsLimit !== null && activeCount >= apiCredentialsLimit
  const canCreate   = apiAccessEnabled && !atLimit

  async function load() {
    setLoading(true)
    setPageError(null)
    try {
      setCredentials(await listCredentials())
    } catch {
      setPageError('No se pudo cargar las credenciales. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function handleCreateSuccess(cred: ApiCredentialWithSecret) {
    const { secret, ...credData } = cred
    setShowCreate(false)
    setCredentials((prev) => [credData, ...prev])
    setRevealedSecret({ key: cred.key, secret })
  }

  async function handleRegenerate(id: string) {
    setRegeneratingId(id)
    try {
      const { secret } = await regenerateCredentialSecret(id)
      const cred = credentials.find((c) => c.id === id)
      if (cred) setRevealedSecret({ key: cred.key, secret })
      addToast('Secret regenerado', 'success')
    } catch {
      addToast('No se pudo regenerar el secret.', 'error')
    } finally {
      setRegeneratingId(null)
    }
  }

  async function handleToggleActive(id: string, active: boolean) {
    setTogglingId(id)
    try {
      const updated = await updateCredential(id, { active })
      setCredentials((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      addToast(active ? 'Credencial activada' : 'Credencial desactivada', 'success')
    } catch {
      addToast('No se pudo actualizar la credencial.', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  // ── Usage label ──────────────────────────────────────────────────────────────
  function UsageBar() {
    if (!apiAccessEnabled) return null
    const limitLabel = apiCredentialsLimit === null ? 'ilimitadas' : String(apiCredentialsLimit)
    const pct = apiCredentialsLimit ? Math.min(100, (activeCount / apiCredentialsLimit) * 100) : 0
    return (
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>
          <span className={atLimit ? 'text-amber-400 font-semibold' : 'text-gray-400'}>
            {activeCount}
          </span>
          {' / '}
          <span className="text-gray-400">{limitLabel}</span>
          {' credenciales activas'}
        </span>
        {apiCredentialsLimit !== null && (
          <div className="flex-1 max-w-[80px] h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${atLimit ? 'bg-amber-500' : 'bg-brand-600'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-1">
          <div>
            <h2 className="text-base font-semibold text-gray-100">API de Ubyca</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Conecta aplicaciones, sitios web y sistemas propios mediante la API.
            </p>
          </div>
          <button
            onClick={() => canCreate && setShowCreate(true)}
            disabled={!canCreate}
            title={
              !apiAccessEnabled ? 'Tu plan no incluye acceso a la API' :
              atLimit           ? 'Alcanzaste el límite de credenciales de tu plan' :
              undefined
            }
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                       bg-brand-600 hover:bg-brand-500 text-white transition-colors flex-shrink-0
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva credencial
          </button>
        </div>

        {/* Plan status banners */}
        {!apiAccessEnabled ? (
          <div className="mt-3 mb-4 flex items-start gap-2.5 rounded-xl bg-gray-800/60 border
                          border-gray-700/50 px-4 py-3">
            <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-sm text-gray-300 font-medium">Tu plan no incluye acceso a la API.</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Actualizá tu plan para crear credenciales y conectar aplicaciones.
              </p>
            </div>
          </div>
        ) : atLimit ? (
          <div className="mt-3 mb-4 flex items-start gap-2.5 rounded-xl bg-amber-950/30 border
                          border-amber-700/30 px-4 py-3">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-amber-300 font-medium">Límite de credenciales alcanzado.</p>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Tu plan permite {apiCredentialsLimit} credencial{apiCredentialsLimit === 1 ? '' : 'es'} activa{apiCredentialsLimit === 1 ? '' : 's'}.
                Desactivá una existente o actualizá tu plan.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-2 mb-4">
            <UsageBar />
          </div>
        )}

        {/* Credentials list — only shown when API access is enabled */}
        {apiAccessEnabled && (
          <div className="mb-5">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner size="lg" />
              </div>
            ) : pageError ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-3">{pageError}</p>
                <button
                  onClick={load}
                  className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : credentials.length === 0 ? (
              <div className="border border-dashed border-gray-700/70 rounded-xl px-6 py-10 text-center">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-400 mb-1">Sin credenciales</p>
                <p className="text-xs text-gray-600 mb-4">
                  Crea tu primera API Key para empezar a integrar.
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="text-sm text-brand-400 hover:text-brand-300 transition-colors font-medium"
                >
                  Crear credencial →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {credentials.map((cred) => (
                  <CredentialRow
                    key={cred.id}
                    credential={cred}
                    isRegenerating={regeneratingId === cred.id}
                    isTogglingActive={togglingId === cred.id}
                    onRegenerate={handleRegenerate}
                    onToggleActive={handleToggleActive}
                    addToast={addToast}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Endpoint base */}
        <div className="border-t border-white/[0.05] pt-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Endpoint base
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-800 border border-gray-700/50 rounded-lg px-3 py-2.5
                            font-mono text-sm text-gray-300 select-all">
              {BASE_ENDPOINT}
            </div>
            <button
              onClick={() => copyText(BASE_ENDPOINT, 'Endpoint', addToast)}
              className="px-3 py-2.5 rounded-lg text-sm border border-gray-700/50
                         text-gray-400 hover:text-gray-200 hover:bg-gray-800
                         transition-all duration-150 flex-shrink-0"
            >
              Copiar
            </button>
          </div>
        </div>
      </Card>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {revealedSecret && (
        <SecretRevealModal
          apiKey={revealedSecret.key}
          secret={revealedSecret.secret}
          onClose={() => setRevealedSecret(null)}
          addToast={addToast}
        />
      )}
    </>
  )
}

// ── Documentation section ─────────────────────────────────────────────────────

const CODE_SNIPPETS = [
  {
    label: 'GET Projects',
    code:  `curl -X GET ${BASE_ENDPOINT}/projects \\\n  -H "X-Api-Key: ubk_live_xxx" \\\n  -H "X-Api-Secret: your_secret"`,
  },
  {
    label: 'GET Analytics',
    code:  `curl "${BASE_ENDPOINT}/projects/:id/analytics?from=2026-01-01&to=2026-12-31" \\\n  -H "X-Api-Key: ubk_live_xxx" \\\n  -H "X-Api-Secret: your_secret"`,
  },
  {
    label: 'POST Presence Validate',
    code:  `curl -X POST ${BASE_ENDPOINT}/presence/validate \\\n  -H "X-Api-Key: ubk_live_xxx" \\\n  -H "X-Api-Secret: your_secret" \\\n  -H "Content-Type: application/json" \\\n  -d '{"lat":-34.6037,"lng":-58.3816,"project_id":"proj_xxx"}'`,
  },
]

function DocsSection() {
  const addToast = useGeoStore((s) => s.addToast)

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-100">Documentación</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Incluí tu API Key y Secret en los headers de cada request.
        </p>
      </div>

      <div className="space-y-5">
        {CODE_SNIPPETS.map(({ label, code }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-400">{label}</span>
              <button
                onClick={() => copyText(code, label, addToast)}
                className="text-[11px] text-gray-600 hover:text-brand-400 transition-colors"
              >
                Copiar
              </button>
            </div>
            <pre className="bg-gray-950 border border-gray-800 rounded-lg px-4 py-3
                            text-[11px] font-mono text-gray-400 overflow-x-auto leading-relaxed
                            whitespace-pre">
              {code}
            </pre>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  return (
    <div className="text-gray-100 min-h-full">

      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20 hidden md:block">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-3">
          <h1 className="text-sm font-semibold text-gray-100">Integraciones</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">

        <div className="md:hidden">
          <h1 className="text-lg font-bold text-gray-100">Integraciones</h1>
          <p className="text-xs text-gray-500 mt-0.5">API, sitios web y aplicaciones</p>
        </div>

        <WebsiteCard />
        <ApiCredentialsSection />
        <DocsSection />

      </div>
    </div>
  )
}

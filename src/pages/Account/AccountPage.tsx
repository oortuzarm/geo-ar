import { useEffect, useState } from 'react'
import type { InputHTMLAttributes, FormEvent } from 'react'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import PasswordInput from '../../components/ui/PasswordInput'
import { getAccount, updateAccount, updatePassword } from '../../services/accountApi'
import type { UserProfile } from '../../types/account.types'
import SubscriptionTab from './SubscriptionTab'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'perfil' | 'seguridad' | 'suscripcion'

interface ProfileForm {
  firstName: string
  lastName:  string
  company:   string
  jobTitle:  string
  country:   string
}

interface PasswordForm {
  current: string
  next:    string
  confirm: string
}

interface PasswordErrors {
  current?: string
  next?:    string
  confirm?: string
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900/70 border border-white/[0.07] rounded-2xl px-6 py-5 ${className}`}>
      {children}
    </div>
  )
}

function SavedBadge({ message = 'Cambios guardados' }: { message?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 animate-fade-in">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </span>
  )
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-md ${className}`} />
}

// Password field — matches Input component style, wraps PasswordInput toggle
function PasswordField({
  id, label, error, ...rest
}: { id: string; label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const cls = [
    'w-full bg-gray-800 border rounded-md px-3 py-2',
    'text-sm text-gray-100 placeholder-gray-500',
    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors',
    error ? 'border-red-500' : 'border-gray-700 hover:border-gray-600',
  ].join(' ')

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <PasswordInput id={id} className={cls} {...rest} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ── Perfil tab ────────────────────────────────────────────────────────────────

function profileFromApi(p: UserProfile): ProfileForm {
  return {
    firstName: p.firstName ?? '',
    lastName:  p.lastName  ?? '',
    company:   p.company   ?? '',
    jobTitle:  p.jobTitle  ?? '',
    country:   p.country   ?? '',
  }
}

interface PerfilTabProps {
  profile:        UserProfile | null
  loading:        boolean
  loadError:      string | null
  onProfileSaved: (p: UserProfile) => void
}

function PerfilTab({ profile, loading, loadError, onProfileSaved }: PerfilTabProps) {
  const [form,    setForm]    = useState<ProfileForm>({
    firstName: '', lastName: '', company: '', jobTitle: '', country: '',
  })
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  // Populate form once the profile arrives
  useEffect(() => {
    if (profile) setForm(profileFromApi(profile))
  }, [profile])

  function set(key: keyof ProfileForm, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setSaved(false)
    setSaveErr(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveErr(null)
    try {
      const updated = await updateAccount(form)
      onProfileSaved(updated)
      setSaved(true)
    } catch {
      setSaveErr('No se pudieron guardar los cambios. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loadError) {
    return (
      <Card>
        <p className="text-sm text-red-400">{loadError}</p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-100">Información personal</h2>
        <p className="text-xs text-gray-500 mt-0.5">Tu perfil dentro de Ubyca.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              placeholder="Tu nombre"
              value={form.firstName}
              onChange={e => set('firstName', e.target.value)}
            />
            <Input
              label="Apellido"
              placeholder="Tu apellido"
              value={form.lastName}
              onChange={e => set('lastName', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Empresa"
              placeholder="Tu empresa"
              value={form.company}
              onChange={e => set('company', e.target.value)}
            />
            <Input
              label="Cargo"
              placeholder="Tu cargo"
              value={form.jobTitle}
              onChange={e => set('jobTitle', e.target.value)}
            />
          </div>

          <Input
            label="País"
            placeholder="Tu país"
            value={form.country}
            onChange={e => set('country', e.target.value)}
          />

          {/* Email — always read-only */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Email
            </label>
            <input
              readOnly
              value={profile?.email ?? ''}
              className="bg-gray-800/40 border border-gray-700/40 rounded-md px-3 py-2
                         text-sm text-gray-500 cursor-not-allowed select-none"
            />
            <p className="text-xs text-gray-600">El email no puede modificarse desde aquí.</p>
          </div>

          {saveErr && <p className="text-xs text-red-400">{saveErr}</p>}

          <div className="pt-1 flex items-center gap-4">
            <Button type="submit" loading={saving}>
              Guardar cambios
            </Button>
            {saved && <SavedBadge />}
          </div>
        </form>
      )}
    </Card>
  )
}

// ── Seguridad tab ─────────────────────────────────────────────────────────────

function SeguridadTab() {
  const [form,     setForm]     = useState<PasswordForm>({ current: '', next: '', confirm: '' })
  const [errors,   setErrors]   = useState<PasswordErrors>({})
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  function set(key: keyof PasswordForm, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
    setSaved(false)
    setApiError(null)
  }

  function validate(): boolean {
    const next: PasswordErrors = {}
    if (!form.current)              next.current = 'Ingresa tu contraseña actual.'
    if (form.next.length < 8)       next.next    = 'La nueva contraseña debe tener al menos 8 caracteres.'
    if (form.next !== form.confirm) next.confirm = 'Las contraseñas no coinciden.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setApiError(null)
    try {
      await updatePassword({
        currentPassword:      form.current,
        password:             form.next,
        passwordConfirmation: form.confirm,
      })
      setSaved(true)
      setForm({ current: '', next: '', confirm: '' })
    } catch (err: unknown) {
      const raw = (err as { message?: string })?.message ?? ''
      let msg = 'No se pudo actualizar la contraseña. Intenta de nuevo.'
      try {
        const parsed = JSON.parse(raw) as { error?: string }
        if (parsed.error) msg = parsed.error
      } catch { /* raw was not JSON */ }
      setApiError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Card 1 — Change password */}
      <Card>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-100">Cambiar contraseña</h2>
          <p className="text-xs text-gray-500 mt-0.5">Usa una contraseña segura de al menos 8 caracteres.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            id="pwd-current"
            label="Contraseña actual"
            placeholder="••••••••"
            value={form.current}
            onChange={e => set('current', e.target.value)}
            error={errors.current}
            autoComplete="current-password"
          />
          <PasswordField
            id="pwd-next"
            label="Nueva contraseña"
            placeholder="••••••••"
            value={form.next}
            onChange={e => set('next', e.target.value)}
            error={errors.next}
            autoComplete="new-password"
          />
          <PasswordField
            id="pwd-confirm"
            label="Confirmar nueva contraseña"
            placeholder="••••••••"
            value={form.confirm}
            onChange={e => set('confirm', e.target.value)}
            error={errors.confirm}
            autoComplete="new-password"
          />

          {apiError && <p className="text-xs text-red-400">{apiError}</p>}

          <div className="pt-1 flex items-center gap-4">
            <Button type="submit" loading={saving}>
              Actualizar contraseña
            </Button>
            {saved && <SavedBadge message="Contraseña actualizada correctamente." />}
          </div>
        </form>
      </Card>

      {/* Card 2 — Access info */}
      <Card>
        <h2 className="text-base font-semibold text-gray-100 mb-4">Información de acceso</h2>
        <div className="divide-y divide-white/[0.05]">
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-400">Último acceso</span>
            <span className="text-sm text-gray-200">Hoy, hace unos minutos</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-400">Método de autenticación</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-200">
              <svg className="w-3.5 h-3.5 text-brand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Email y contraseña
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ── Danger Zone ───────────────────────────────────────────────────────────────

function DangerZone() {
  const [expanded,   setExpanded]   = useState(false)
  const [deleteText, setDeleteText] = useState('')

  const confirmed = deleteText === 'ELIMINAR'

  function handleDelete() {
    if (!confirmed) return
    // TODO: implement DELETE /api/account and logout
    console.log('[ACCOUNT_DELETE] User confirmed account deletion — not yet implemented.')
  }

  return (
    <div className="rounded-2xl border border-red-900/40 bg-red-950/10 px-6 py-5">
      <h3 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h3>
      <p className="text-xs text-gray-500 mb-4">
        Acciones irreversibles que afectan permanentemente tu cuenta.
      </p>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-200">Eliminar cuenta</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Tu cuenta y todos los datos asociados serán eliminados de forma permanente.
          </p>
        </div>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-md
                       border border-red-700/50 text-red-400
                       hover:bg-red-900/20 hover:border-red-600/60 transition-colors"
          >
            Eliminar cuenta
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-5 space-y-4 animate-fade-in">
          <div className="rounded-xl border border-red-800/40 bg-red-950/20 px-4 py-3">
            <p className="text-xs text-red-300/80 leading-relaxed">
              Esta acción es <strong className="text-red-300">permanente e irreversible</strong>.
              Se eliminarán tu cuenta, workspaces, ubicaciones y todos los datos asociados
              sin posibilidad de recuperación.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Escribe ELIMINAR para confirmar
            </label>
            <input
              value={deleteText}
              onChange={e => setDeleteText(e.target.value)}
              placeholder="ELIMINAR"
              spellCheck={false}
              autoComplete="off"
              className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-md px-3 py-2
                         text-sm text-gray-100 placeholder-gray-600 font-mono tracking-wider
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                         transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={!confirmed}
              className={[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                confirmed
                  ? 'bg-red-700 hover:bg-red-600 text-white cursor-pointer'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed',
              ].join(' ')}
            >
              Confirmar eliminación
            </button>
            <button
              onClick={() => { setExpanded(false); setDeleteText('') }}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const [tab, setTab]    = useState<Tab>('perfil')
  const [profile,      setProfile]      = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError,   setProfileError]   = useState<string | null>(null)

  useEffect(() => {
    getAccount()
      .then(setProfile)
      .catch(() => setProfileError('No se pudo cargar el perfil. Recarga la página.'))
      .finally(() => setProfileLoading(false))
  }, [])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'perfil',      label: 'Perfil'       },
    { id: 'seguridad',   label: 'Seguridad'    },
    { id: 'suscripcion', label: 'Suscripción'  },
  ]

  return (
    <div className="text-gray-100 min-h-full">

      {/* ── Header ── */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-3">
          {/* Mobile logo mark */}
          <div className="flex items-center gap-2.5 md:hidden shrink-0">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h1 className="hidden md:block text-xl font-bold text-gray-100">Mi cuenta</h1>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">

        {/* Tab bar */}
        <div className="flex border-b border-gray-800">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'relative px-4 py-3 text-sm font-medium transition-colors duration-150',
                tab === t.id ? 'text-gray-100' : 'text-gray-500 hover:text-gray-300',
              ].join(' ')}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content — key forces remount so fade-in re-fires on tab switch */}
        <div key={tab} className="animate-fade-in">
          {tab === 'perfil' && (
            <PerfilTab
              profile={profile}
              loading={profileLoading}
              loadError={profileError}
              onProfileSaved={setProfile}
            />
          )}
          {tab === 'seguridad'   && <SeguridadTab />}
          {tab === 'suscripcion' && <SubscriptionTab />}
        </div>

        {/* Danger zone — only on Perfil tab */}
        {tab === 'perfil' && <DangerZone />}
      </div>
    </div>
  )
}

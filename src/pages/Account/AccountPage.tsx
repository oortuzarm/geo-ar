import { useState } from 'react'
import type { InputHTMLAttributes, FormEvent } from 'react'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import PasswordInput from '../../components/ui/PasswordInput'
import { useAuthStore } from '../../store/authStore'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'perfil' | 'seguridad'

interface ProfileForm {
  firstName: string
  lastName:  string
  company:   string
  position:  string
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

function SavedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 animate-fade-in">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Cambios guardados
    </span>
  )
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

function PerfilTab({ email }: { email: string }) {
  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName:  '',
    company:   '',
    position:  '',
    country:   '',
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  function set(key: keyof ProfileForm, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    // TODO: call profile update API
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
  }

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-100">Información personal</h2>
        <p className="text-xs text-gray-500 mt-0.5">Tu perfil dentro de Ubyca.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            placeholder="Juan"
            value={form.firstName}
            onChange={e => set('firstName', e.target.value)}
          />
          <Input
            label="Apellido"
            placeholder="Pérez"
            value={form.lastName}
            onChange={e => set('lastName', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Empresa"
            placeholder="Acme Corp"
            value={form.company}
            onChange={e => set('company', e.target.value)}
          />
          <Input
            label="Cargo"
            placeholder="Product Manager"
            value={form.position}
            onChange={e => set('position', e.target.value)}
          />
        </div>

        <Input
          label="País"
          placeholder="Argentina"
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
            value={email}
            className="bg-gray-800/40 border border-gray-700/40 rounded-md px-3 py-2
                       text-sm text-gray-500 cursor-not-allowed select-none"
          />
          <p className="text-xs text-gray-600">El email no puede modificarse desde aquí.</p>
        </div>

        <div className="pt-1 flex items-center gap-4">
          <Button type="submit" loading={saving}>
            Guardar cambios
          </Button>
          {saved && <SavedBadge />}
        </div>
      </form>
    </Card>
  )
}

// ── Seguridad tab ─────────────────────────────────────────────────────────────

function SeguridadTab() {
  const [form,   setForm]   = useState<PasswordForm>({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState<PasswordErrors>({})
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  function set(key: keyof PasswordForm, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
    setSaved(false)
  }

  function validate(): boolean {
    const next: PasswordErrors = {}
    if (!form.current)              next.current = 'Ingresá tu contraseña actual.'
    if (form.next.length < 8)       next.next    = 'La nueva contraseña debe tener al menos 8 caracteres.'
    if (form.next !== form.confirm) next.confirm = 'Las contraseñas no coinciden.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    // TODO: call change-password API
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setForm({ current: '', next: '', confirm: '' })
  }

  return (
    <div className="space-y-4">
      {/* Card 1 — Change password */}
      <Card>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-100">Cambiar contraseña</h2>
          <p className="text-xs text-gray-500 mt-0.5">Usá una contraseña segura de al menos 8 caracteres.</p>
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

          <div className="pt-1 flex items-center gap-4">
            <Button type="submit" loading={saving}>
              Actualizar contraseña
            </Button>
            {saved && <SavedBadge />}
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
    // TODO: call delete-account API and log out
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
              Escribí ELIMINAR para confirmar
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
  const { currentUser } = useAuthStore()
  const [tab, setTab]   = useState<Tab>('perfil')

  const TABS: { id: Tab; label: string }[] = [
    { id: 'perfil',    label: 'Perfil'    },
    { id: 'seguridad', label: 'Seguridad' },
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
          {tab === 'perfil'    && <PerfilTab email={currentUser?.email ?? ''} />}
          {tab === 'seguridad' && <SeguridadTab />}
        </div>

        {/* Danger zone — always visible regardless of active tab */}
        <DangerZone />
      </div>
    </div>
  )
}

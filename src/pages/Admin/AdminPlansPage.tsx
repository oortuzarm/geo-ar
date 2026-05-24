import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ApiError } from '../../lib/apiFetch'
import {
  getAdminPlans, createAdminPlan, updateAdminPlan, deleteAdminPlan,
} from '../../services/adminApi'
import { getSiteConfig, updateAdminSiteConfig } from '../../services/siteConfigApi'
import type { AdminPlan, CreatePlanPayload } from '../../types/admin.types'
import { CONTENT_TYPE_OPTIONS, BOOLEAN_FEATURES, DEFAULT_FEATURES_CONFIG } from '../../lib/planFeatureRegistry'
import type { FeaturesConfig } from '../../lib/planFeatureRegistry'

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcAnnual(monthly: number, discountPct: number): number {
  return monthly * 12 * (1 - discountPct / 100)
}

function fmtUSD(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function extractApiErrors(err: unknown): string {
  if (err instanceof ApiError) {
    try {
      const body = JSON.parse(err.message) as Record<string, unknown>
      if (Array.isArray(body.errors)) return (body.errors as string[]).join(' · ')
      if (typeof body.error === 'string') return body.error
    } catch { /* not JSON */ }
    return err.message || `Error ${err.status}`
  }
  return 'Error inesperado. Intenta de nuevo.'
}

// ── Shared UI atoms (consistent with AdminPage style) ─────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`} />
}

function Badge({ children, color }: {
  children: React.ReactNode
  color: 'green' | 'gray' | 'amber' | 'purple' | 'blue'
}) {
  const cls: Record<string, string> = {
    green:  'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    gray:   'bg-gray-500/15    text-gray-400    border-gray-500/25',
    amber:  'bg-amber-500/15   text-amber-300   border-amber-500/25',
    purple: 'bg-purple-500/15  text-purple-300  border-purple-500/25',
    blue:   'bg-sky-500/15     text-sky-300     border-sky-500/25',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium
                      leading-none whitespace-nowrap ${cls[color]}`}>
      {children}
    </span>
  )
}

function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-900',
          checked ? 'bg-brand-600' : 'bg-gray-700',
        ].join(' ')}
      >
        <span className={[
          'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0',
        ].join(' ')} />
      </button>
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
      {children}
    </span>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', min, max, step }: {
  value: string; onChange: (v: string) => void; placeholder?: string
  type?: string; min?: number; max?: number; step?: number
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                 text-sm text-gray-200 placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                 transition-colors"
    />
  )
}

// ── Plan form state ───────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name:                 '',
  slug:                 '',
  customPricing:        false,   // true = "Contact sales" / "Custom", monthlyPrice forced to 0
  monthlyPrice:         '',
  annualDiscountPercent:'0',
  unlimited:            false,
  locationLimit:        '',
  hasTrial:             false,
  trialDays:            '7',
  isVisible:            true,
  isRecommended:        false,
  isCustom:             false,
  sortOrder:            '0',
  publicDescription:    '',
  features:             [] as string[],
  ctaText:              '',
  ctaUrl:               '',
  featuresConfig:       DEFAULT_FEATURES_CONFIG as FeaturesConfig,
}
type PlanForm = typeof EMPTY_FORM

function planToForm(p: AdminPlan): PlanForm {
  return {
    name:                 p.name,
    slug:                 p.slug,
    customPricing:        p.isCustom && Number(p.monthlyPrice) === 0,
    monthlyPrice:         String(p.monthlyPrice),
    annualDiscountPercent:String(p.annualDiscountPercent),
    unlimited:            p.locationLimit === null,
    locationLimit:        p.locationLimit === null ? '' : String(p.locationLimit),
    hasTrial:             p.hasTrial,
    trialDays:            String(p.trialDays ?? 7),
    isVisible:            p.isVisible,
    isRecommended:        p.isRecommended,
    isCustom:             p.isCustom,
    sortOrder:            String(p.sortOrder),
    publicDescription:    p.publicDescription ?? '',
    features:             p.features ?? [],
    ctaText:              p.ctaText ?? '',
    ctaUrl:               p.ctaUrl ?? '',
    featuresConfig:       p.featuresConfig ?? DEFAULT_FEATURES_CONFIG,
  }
}

function formToPayload(f: PlanForm): CreatePlanPayload {
  return {
    name:                 f.name.trim(),
    slug:                 f.slug.trim(),
    monthlyPrice:         f.customPricing ? 0 : (parseFloat(f.monthlyPrice) || 0),
    annualDiscountPercent:f.customPricing ? 0 : (parseFloat(f.annualDiscountPercent) || 0),
    locationLimit:        f.unlimited ? null : (parseInt(f.locationLimit) || 0),
    hasTrial:             f.hasTrial,
    trialDays:            f.hasTrial ? (parseInt(f.trialDays) || 7) : null,
    isVisible:            f.isVisible,
    isRecommended:        f.isRecommended,
    isCustom:             f.customPricing || f.isCustom,
    sortOrder:            parseInt(f.sortOrder) || 0,
    publicDescription:    f.publicDescription.trim() || null,
    features:             f.features.filter(feat => feat.trim() !== ''),
    ctaText:              f.ctaText.trim() || null,
    ctaUrl:               f.ctaUrl.trim() || null,
    featuresConfig:       f.featuresConfig,
  }
}

// ── PlanFormModal ─────────────────────────────────────────────────────────────

interface PlanFormModalProps {
  plan:    AdminPlan | null
  saving:  boolean
  onSave:  (payload: CreatePlanPayload) => void
  onClose: () => void
}

function PlanFormModal({ plan, saving, onSave, onClose }: PlanFormModalProps) {
  const [form, setForm] = useState<PlanForm>(() => plan ? planToForm(plan) : EMPTY_FORM)
  // Track if the slug was manually edited so we stop auto-updating it
  const [slugEdited, setSlugEdited] = useState(!!plan)

  const monthly  = parseFloat(form.monthlyPrice)          || 0
  const discount = parseFloat(form.annualDiscountPercent)  || 0
  const annual   = calcAnnual(monthly, discount)

  function set<K extends keyof PlanForm>(key: K, val: PlanForm[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleNameChange(v: string) {
    set('name', v)
    if (!slugEdited) set('slug', toSlug(v))
  }

  function handleSlugChange(v: string) {
    setSlugEdited(true)
    set('slug', v.toLowerCase().replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-'))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) return
    onSave(formToPayload(form))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && !saving) onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [saving, onClose])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!saving ? onClose : undefined} />
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl
                      shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-100">
            {plan ? 'Editar plan' : 'Nuevo plan'}
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-500 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Nombre del plan *</FieldLabel>
            <TextInput
              value={form.name}
              onChange={handleNameChange}
              placeholder="Ej: Starter, Pro, Enterprise…"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Slug *</FieldLabel>
            <TextInput
              value={form.slug}
              onChange={handleSlugChange}
              placeholder="starter-pro"
            />
            <span className="text-[11px] text-gray-600">
              Solo minúsculas, números, guiones y guiones bajos. Se autogenera desde el nombre.
            </span>
          </div>

          {/* Pricing block */}
          <div className="rounded-xl border border-gray-800 bg-gray-800/30 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pricing</p>
            <Toggle
              checked={form.customPricing}
              onChange={v => setForm(f => ({
                ...f,
                customPricing: v,
                ...(v ? { monthlyPrice: '0', annualDiscountPercent: '0', isCustom: true } : {}),
              }))}
              label="Precio personalizado (contactar ventas)"
            />
            {form.customPricing ? (
              <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2.5">
                <span className="text-xs text-gray-500">El precio visible será</span>
                <span className="inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium
                                 leading-none bg-purple-500/15 text-purple-300 border-purple-500/25">
                  Custom
                </span>
                <span className="text-xs text-gray-600">· requiere contacto con ventas</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>Precio mensual (USD)</FieldLabel>
                    <TextInput
                      type="number" min={0} step={0.01}
                      value={form.monthlyPrice}
                      onChange={v => set('monthlyPrice', v)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>Descuento anual (%)</FieldLabel>
                    <TextInput
                      type="number" min={0} max={100} step={1}
                      value={form.annualDiscountPercent}
                      onChange={v => set('annualDiscountPercent', v)}
                      placeholder="0"
                    />
                  </div>
                </div>
                {/* Calculated annual */}
                <div className="flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2.5">
                  <span className="text-xs text-gray-500">Precio anual calculado</span>
                  <span className="text-sm font-semibold text-gray-100 tabular-nums">
                    ${fmtUSD(annual)} <span className="text-gray-500 font-normal text-xs">USD/año</span>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Limits */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Límites</p>
            <Toggle
              checked={form.unlimited}
              onChange={v => set('unlimited', v)}
              label="Ubicaciones ilimitadas"
            />
            {!form.unlimited && (
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Límite de ubicaciones</FieldLabel>
                <TextInput
                  type="number" min={1} step={1}
                  value={form.locationLimit}
                  onChange={v => set('locationLimit', v)}
                  placeholder="Ej: 5"
                />
              </div>
            )}
          </div>

          {/* Trial */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Trial</p>
            <Toggle
              checked={form.hasTrial}
              onChange={v => set('hasTrial', v)}
              label="Trial gratuito habilitado"
            />
            {form.hasTrial && (
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Días de trial</FieldLabel>
                <TextInput
                  type="number" min={1} step={1}
                  value={form.trialDays}
                  onChange={v => set('trialDays', v)}
                  placeholder="7"
                />
              </div>
            )}
          </div>

          {/* Flags */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Opciones</p>
            <Toggle checked={form.isVisible}     onChange={v => set('isVisible', v)}     label="Visible en pricing público" />
            <Toggle checked={form.isRecommended} onChange={v => set('isRecommended', v)} label="Marcar como recomendado" />
            <Toggle checked={form.isCustom}      onChange={v => set('isCustom', v)}      label="Plan personalizado" />
          </div>

          {/* Sort order */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Orden de visualización</FieldLabel>
            <TextInput
              type="number" min={0} step={1}
              value={form.sortOrder}
              onChange={v => set('sortOrder', v)}
              placeholder="0"
            />
          </div>

          {/* Public content */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Contenido público
            </p>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Descripción pública</FieldLabel>
              <textarea
                value={form.publicDescription}
                onChange={e => set('publicDescription', e.target.value)}
                placeholder="Breve descripción visible en la página de precios…"
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                           text-sm text-gray-200 placeholder-gray-500 resize-none
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                           transition-colors"
              />
            </div>

            {/* Features list */}
            <div className="flex flex-col gap-2">
              <FieldLabel>Features / bullets</FieldLabel>
              {form.features.length > 0 && (
                <div className="space-y-1.5">
                  {form.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={feat}
                        onChange={e => {
                          const next = [...form.features]
                          next[i] = e.target.value
                          set('features', next)
                        }}
                        placeholder={`Feature ${i + 1}`}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5
                                   text-sm text-gray-200 placeholder-gray-500
                                   focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                   transition-colors"
                      />
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => {
                          const next = [...form.features];
                          [next[i - 1], next[i]] = [next[i], next[i - 1]]
                          set('features', next)
                        }}
                        title="Subir"
                        className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-25
                                   disabled:cursor-default transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        disabled={i === form.features.length - 1}
                        onClick={() => {
                          const next = [...form.features];
                          [next[i], next[i + 1]] = [next[i + 1], next[i]]
                          set('features', next)
                        }}
                        title="Bajar"
                        className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-25
                                   disabled:cursor-default transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => set('features', form.features.filter((_, j) => j !== i))}
                        title="Eliminar feature"
                        className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => set('features', [...form.features, ''])}
                className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300
                           transition-colors py-0.5 w-fit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar feature
              </button>
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <FieldLabel>CTA text</FieldLabel>
                <TextInput
                  value={form.ctaText}
                  onChange={v => set('ctaText', v)}
                  placeholder="Comenzar gratis"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>CTA URL</FieldLabel>
                <TextInput
                  value={form.ctaUrl}
                  onChange={v => set('ctaUrl', v)}
                  placeholder="/try o /contact"
                />
              </div>
            </div>
          </div>

          {/* Funciones incluidas */}
          <div className="rounded-xl border border-gray-800 bg-gray-800/30 p-4 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Funciones incluidas</p>

            {/* content_types — multi-select */}
            <div className="flex flex-col gap-2">
              <FieldLabel>Tipos de contenido</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPE_OPTIONS.map(({ value, label }) => {
                  const allowed = (form.featuresConfig.content_types ?? []).includes(value)
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        const current = form.featuresConfig.content_types ?? []
                        const next = allowed
                          ? current.filter(t => t !== value)
                          : [...current, value]
                        set('featuresConfig', { ...form.featuresConfig, content_types: next })
                      }}
                      className={[
                        'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                        allowed
                          ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-500 hover:border-gray-600',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* boolean features */}
            <div className="flex flex-col gap-2.5">
              {BOOLEAN_FEATURES.map(({ key, label }) => (
                <Toggle
                  key={String(key)}
                  checked={Boolean(form.featuresConfig[key] ?? true)}
                  onChange={v => set('featuresConfig', { ...form.featuresConfig, [key]: v })}
                  label={label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-1">
            <button
              type="submit"
              disabled={saving || !form.name.trim() || !form.slug.trim()}
              className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-800
                         disabled:text-brand-400 text-white text-sm font-medium rounded-lg
                         transition-colors cursor-pointer disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {saving && (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
              {saving ? 'Guardando…' : plan ? 'Guardar cambios' : 'Crear plan'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300
                         text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── DeletePlanDialog ──────────────────────────────────────────────────────────

function DeletePlanDialog({ plan, deleting, onConfirm, onClose }: {
  plan: AdminPlan; deleting: boolean; onConfirm: () => void; onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && !deleting) onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [deleting, onClose])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!deleting ? onClose : undefined}
      />
      <div className="relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl
                      shadow-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-100">¿Eliminar plan?</h3>
        <p className="text-sm text-gray-400">
          Se eliminará el plan{' '}
          <span className="font-medium text-gray-200">"{plan.name}"</span>.
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-600 disabled:bg-red-900
                       disabled:text-red-400 text-white text-sm font-medium rounded-lg
                       transition-colors cursor-pointer disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {deleting && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            )}
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </button>
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50
                       text-gray-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── AdminPlansPage ────────────────────────────────────────────────────────────

export default function AdminPlansPage() {
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const [plans,    setPlans]    = useState<AdminPlan[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [formOpen,     setFormOpen]     = useState(false)
  const [editTarget,   setEditTarget]   = useState<AdminPlan | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminPlan | null>(null)

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // ── Configuración global de registro ────────────────────────────────────────
  const [regTrialDays,  setRegTrialDays]  = useState<number>(14)
  const [regTrialInput, setRegTrialInput] = useState<string>('14')
  const [regTrialSaving, setRegTrialSaving] = useState(false)

  useEffect(() => {
    getAdminPlans()
      .then(setPlans)
      .catch(() => setError('No se pudieron cargar los planes.'))
      .finally(() => setLoading(false))
    getSiteConfig()
      .then(cfg => {
        setRegTrialDays(cfg.registerTrialDays)
        setRegTrialInput(String(cfg.registerTrialDays))
      })
      .catch(() => { /* keep defaults */ })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  function openCreate() {
    setEditTarget(null)
    setFormOpen(true)
  }

  function openEdit(plan: AdminPlan) {
    setEditTarget(plan)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  async function handleSave(payload: CreatePlanPayload) {
    setSaving(true)
    try {
      if (editTarget) {
        const updated = await updateAdminPlan(editTarget.id, payload)
        setPlans(prev => prev.map(p => p.id === updated.id ? updated : p))
        setToast({ msg: `Plan "${updated.name}" actualizado.`, type: 'success' })
      } else {
        const created = await createAdminPlan(payload)
        setPlans(prev => [...prev, created])
        setToast({ msg: `Plan "${created.name}" creado.`, type: 'success' })
      }
      closeForm()
    } catch (err) {
      setToast({ msg: extractApiErrors(err), type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminPlan(deleteTarget.id)
      setPlans(prev => prev.filter(p => p.id !== deleteTarget.id))
      setToast({ msg: `Plan "${deleteTarget.name}" eliminado.`, type: 'success' })
      setDeleteTarget(null)
    } catch (err) {
      setToast({ msg: extractApiErrors(err), type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  async function handleSaveRegTrialDays() {
    const val = parseInt(regTrialInput, 10)
    if (isNaN(val) || val <= 0) {
      setToast({ msg: 'Los días de trial deben ser un entero positivo mayor que 0.', type: 'error' })
      return
    }
    setRegTrialSaving(true)
    try {
      await updateAdminSiteConfig('register_trial_days', String(val))
      setRegTrialDays(val)
      setRegTrialInput(String(val))
      setToast({ msg: 'Configuración de registro actualizada.', type: 'success' })
    } catch (err) {
      setToast({ msg: extractApiErrors(err), type: 'error' })
    } finally {
      setRegTrialSaving(false)
    }
  }

  async function handleToggle(plan: AdminPlan, field: 'isVisible' | 'isRecommended') {
    try {
      const updated = await updateAdminPlan(plan.id, { [field]: !plan[field] })
      setPlans(prev => prev.map(p => p.id === updated.id ? updated : p))
    } catch (err) {
      setToast({ msg: extractApiErrors(err), type: 'error' })
    }
  }

  const sorted = [...plans].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">

          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-100 text-sm">Panel administrador</span>
          </div>

          {/* Nav tabs */}
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => navigate('/admin')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400
                         hover:text-gray-200 hover:bg-gray-800 transition-colors"
            >
              Usuarios
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-100">
              Planes
            </button>
          </div>

          <div className="flex-1" />

          <span className="text-xs text-gray-500 hidden sm:block truncate max-w-[200px]">
            {currentUser?.email}
          </span>
          <button
            onClick={() => navigate('/app')}
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors
                       px-3 py-1.5 rounded-lg hover:bg-gray-800 hidden sm:block"
          >
            Ir al dashboard
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors
                       px-3 py-1.5 border border-gray-700 hover:border-gray-600 rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-5">

        {/* ── Configuración global de registro ── */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Configuración global de registro</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Texto que se muestra en <span className="text-gray-400">/register</span>, independiente de los días de trial por plan.
              </p>
            </div>
          </div>
          <div className="flex items-end gap-3 max-w-xs">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Días de trial en /register
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={regTrialInput}
                onChange={e => setRegTrialInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveRegTrialDays()}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                           text-sm text-gray-200 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                           transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveRegTrialDays}
              disabled={regTrialSaving}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-800
                         disabled:text-brand-400 text-white text-sm font-medium rounded-lg
                         transition-colors cursor-pointer disabled:cursor-not-allowed
                         flex items-center gap-2 flex-shrink-0"
            >
              {regTrialSaving && (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
              {regTrialSaving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Vista previa: <span className="text-gray-400">{regTrialDays} días gratis · No necesitas tarjeta</span>
          </p>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          {/* Section header */}
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Planes</h2>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         bg-brand-600 hover:bg-brand-700 text-white transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo plan
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : error ? (
            <p className="px-5 py-6 text-sm text-red-400">{error}</p>
          ) : sorted.length === 0 ? (
            <div className="px-5 py-14 text-center space-y-3">
              <p className="text-sm text-gray-500">No hay planes creados todavía.</p>
              <button
                onClick={openCreate}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                Crear el primer plan →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mensual
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anual
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicaciones
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trial
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visible
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rec.
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {sorted.map(plan => {
                    const annual = calcAnnual(plan.monthlyPrice, plan.annualDiscountPercent)
                    return (
                      <tr key={plan.id} className="hover:bg-gray-800/30 transition-colors">

                        {/* Name + slug + badges */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-100">{plan.name}</span>
                            {plan.isCustom && <Badge color="purple">Personalizado</Badge>}
                          </div>
                          <span className="text-[11px] text-gray-600 font-mono">{plan.slug}</span>
                        </td>

                        {/* Monthly price */}
                        <td className="px-4 py-3 text-right tabular-nums text-gray-300 whitespace-nowrap">
                          {plan.isCustom && Number(plan.monthlyPrice) === 0 ? (
                            <Badge color="purple">Custom</Badge>
                          ) : (
                            <>
                              ${fmtUSD(plan.monthlyPrice)}
                              <span className="text-gray-600 text-[11px] ml-0.5">/mes</span>
                            </>
                          )}
                        </td>

                        {/* Annual price */}
                        <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                          {plan.isCustom && Number(plan.monthlyPrice) === 0 ? (
                            <span className="text-gray-600">—</span>
                          ) : plan.annualDiscountPercent > 0 ? (
                            <span className="text-gray-300">
                              ${fmtUSD(annual)}
                              <span className="ml-1.5 text-emerald-400 text-[11px]">
                                -{plan.annualDiscountPercent}%
                              </span>
                            </span>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>

                        {/* Location limit */}
                        <td className="px-4 py-3 text-center">
                          {plan.locationLimit === null
                            ? <Badge color="green">Ilimitado</Badge>
                            : <span className="text-gray-300 tabular-nums">{plan.locationLimit}</span>
                          }
                        </td>

                        {/* Trial */}
                        <td className="px-4 py-3 text-center">
                          {plan.hasTrial
                            ? <Badge color="amber">{plan.trialDays}d</Badge>
                            : <span className="text-gray-600 text-xs">—</span>
                          }
                        </td>

                        {/* Visible toggle */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggle(plan, 'isVisible')}
                            title={plan.isVisible ? 'Ocultar del pricing público' : 'Mostrar en pricing público'}
                            className="cursor-pointer"
                          >
                            {plan.isVisible
                              ? <Badge color="green">Sí</Badge>
                              : <Badge color="gray">No</Badge>
                            }
                          </button>
                        </td>

                        {/* Recommended toggle */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggle(plan, 'isRecommended')}
                            title={plan.isRecommended ? 'Quitar recomendado' : 'Marcar como recomendado'}
                            className="cursor-pointer"
                          >
                            {plan.isRecommended
                              ? <Badge color="blue">Sí</Badge>
                              : <span className="text-gray-600 text-xs">—</span>
                            }
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEdit(plan)}
                              title="Editar plan"
                              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200
                                         hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteTarget(plan)}
                              title="Eliminar plan"
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400
                                         hover:bg-red-950/30 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* ── Modals ── */}
      {formOpen && (
        <PlanFormModal
          plan={editTarget}
          saving={saving}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
      {deleteTarget && (
        <DeletePlanDialog
          plan={deleteTarget}
          deleting={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={[
          'fixed bottom-5 right-5 z-[10000] flex items-center gap-3',
          'px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium animate-fade-in max-w-sm',
          toast.type === 'success'
            ? 'bg-emerald-900/90 border-emerald-700/50 text-emerald-200'
            : 'bg-red-900/90 border-red-700/50 text-red-200',
        ].join(' ')}>
          {toast.type === 'success' ? (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="leading-snug">{toast.msg}</span>
        </div>
      )}
    </div>
  )
}

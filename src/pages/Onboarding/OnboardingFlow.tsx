import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getOnboardingConfig, submitOnboarding } from '../../services/onboardingApi'
import { useAuthStore } from '../../store/authStore'
import type { OnboardingConfig, OnboardingCategory } from '../../types/onboarding.types'

// ── Common countries (LAC-first) ─────────────────────────────────────────────

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica',
  'Cuba', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'México',
  'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'República Dominicana',
  'Uruguay', 'Venezuela',
  '—',
  'Alemania', 'Australia', 'Canada', 'España', 'Estados Unidos', 'Francia',
  'Italia', 'Japón', 'México', 'Portugal', 'Reino Unido',
  'Otro',
]

// ── Shared input styles ───────────────────────────────────────────────────────

const INPUT_CLS =
  'w-full bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl px-4 py-3 ' +
  'text-sm text-gray-100 placeholder-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 ' +
  'transition-all duration-200'

const SELECT_CLS =
  'w-full bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl px-4 py-3 ' +
  'text-sm text-gray-100 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 ' +
  'transition-all duration-200 appearance-none cursor-pointer'

// ── Step-level sub-components ─────────────────────────────────────────────────

function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
      {children}
    </p>
  )
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

// ── CategoryCard ─────────────────────────────────────────────────────────────

function CategoryCard({
  category, selected, onSelect,
}: {
  category: OnboardingCategory
  selected: boolean
  onSelect: (id: number) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-2xl border text-center
        transition-all duration-150 cursor-pointer select-none
        ${selected
          ? 'bg-brand-600/20 border-brand-500/60 ring-1 ring-brand-500/40 shadow-[0_0_16px_rgba(14,165,233,0.15)]'
          : 'bg-gray-800/60 border-gray-700/60 hover:border-gray-600 hover:bg-gray-800'
        }
      `}
    >
      <span className="text-2xl leading-none" aria-hidden>
        {category.iconName ?? '•'}
      </span>
      <span className={`text-xs font-medium leading-snug ${selected ? 'text-brand-300' : 'text-gray-300'}`}>
        {category.name}
      </span>
    </button>
  )
}

// ── Progress dots ─────────────────────────────────────────────────────────────

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i + 1 === step
              ? 'w-5 h-1.5 bg-brand-500'
              : i + 1 < step
              ? 'w-1.5 h-1.5 bg-brand-700'
              : 'w-1.5 h-1.5 bg-gray-700'
          }`}
        />
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface FormState {
  workspaceTitle: string
  company:        string
  categoryId:     number | null
  industryId:     number | null
  orgTypeId:      number | null
  orgSizeId:      number | null
  objectiveId:    number | null
  country:        string
}

const EMPTY: FormState = {
  workspaceTitle: '',
  company:        '',
  categoryId:     null,
  industryId:     null,
  orgTypeId:      null,
  orgSizeId:      null,
  objectiveId:    null,
  country:        '',
}

const variants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

export default function OnboardingFlow() {
  const reloadUser = useAuthStore(s => s.reloadUser)

  const [step,        setStep]        = useState<1 | 2 | 3>(1)
  const [dir,         setDir]         = useState(1)
  const [form,        setForm]        = useState<FormState>(EMPTY)
  const [config,      setConfig]      = useState<OnboardingConfig | null>(null)
  const [configError, setConfigError] = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState(false)
  const [dismissed,   setDismissed]   = useState(false)

  function loadConfig() {
    setConfigError(false)
    getOnboardingConfig()
      .then(setConfig)
      .catch(() => setConfigError(true))
  }

  useEffect(() => { loadConfig() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (dismissed) return null

  async function finish(completed: boolean) {
    if (saving) return
    setSaving(true)
    setSaveError(false)
    try {
      await submitOnboarding({
        workspaceTitle: form.workspaceTitle || undefined,
        company:        form.company        || undefined,
        categoryId:     form.categoryId     ?? undefined,
        industryId:     form.industryId     ?? undefined,
        orgTypeId:      form.orgTypeId      ?? undefined,
        orgSizeId:      form.orgSizeId      ?? undefined,
        objectiveId:    form.objectiveId    ?? undefined,
        country:        form.country        || undefined,
        completed,
      })
      await reloadUser()
      // Redirect to plan selection if the user hasn't chosen a plan yet.
      // OnboardingFlow renders outside RouterProvider so we use location.href.
      const freshUser = useAuthStore.getState().currentUser
      if (completed && freshUser && !freshUser.planId) {
        window.location.href = '/app/plans'
        return
      }
      setDismissed(true)
    } catch {
      // Surface a brief retry hint but don't block — let the user dismiss.
      setSaveError(true)
      setSaving(false)
    }
  }

  function advance() {
    setDir(1)
    if (step === 3) {
      finish(true)
    } else {
      setStep((s) => (s + 1) as 1 | 2 | 3)
    }
  }

  function skip() {
    if (step === 1) {
      // "Completar después": dismiss locally only; onboardingCompleted stays false in DB
      // so the flow reappears on next session until actually completed.
      setDismissed(true)
    } else {
      setDir(1)
      if (step === 3) {
        finish(true)
      } else {
        setStep((s) => (s + 1) as 1 | 2 | 3)
      }
    }
  }

  const categories = config?.categories ?? []
  const allOptions = config?.options   ?? []

  // Safe per-group filter — resilient to empty/partial API responses.
  const byGroup = (group: string) =>
    allOptions.filter(o => o.group === group)

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center
                    bg-gray-950/80 backdrop-blur-sm">
      <div
        className="relative w-full sm:max-w-lg bg-gray-900 border border-white/[0.07]
                   sm:rounded-3xl rounded-t-3xl
                   shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_-8px_40px_rgba(0,0,0,0.6),0_24px_80px_rgba(0,0,0,0.7)]
                   flex flex-col max-h-[92dvh] sm:max-h-[90dvh] overflow-hidden"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0 flex-shrink-0">
          <ProgressDots step={step} total={3} />
          <span className="text-xs text-gray-600">Paso {step} de 3</span>
        </div>

        {/* Step content — scrollable on short screens */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
          <AnimatePresence mode="wait" custom={dir}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <div>
                  <StepLabel>Bienvenido a Ubyca</StepLabel>
                  <h2 className="text-xl font-semibold text-white leading-snug">
                    Vamos a configurar tu espacio de trabajo
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Solo toma 30 segundos.
                  </p>
                </div>

                <div className="space-y-4">
                  <FieldGroup label="Nombre del proyecto">
                    <input
                      type="text"
                      className={INPUT_CLS}
                      placeholder="Mi empresa, mi proyecto…"
                      value={form.workspaceTitle}
                      onChange={(e) => setForm(f => ({ ...f, workspaceTitle: e.target.value }))}
                      autoFocus
                    />
                  </FieldGroup>
                  <FieldGroup label="Empresa u organización">
                    <input
                      type="text"
                      className={INPUT_CLS}
                      placeholder="Opcional"
                      value={form.company}
                      onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))}
                    />
                  </FieldGroup>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="space-y-5"
              >
                <div>
                  <StepLabel>Caso de uso</StepLabel>
                  <h2 className="text-xl font-semibold text-white leading-snug">
                    ¿Para qué vas a usar Ubyca?
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Elige el que mejor describe tu proyecto.
                  </p>
                </div>

                {configError ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <p className="text-sm text-gray-500">No se pudieron cargar las opciones.</p>
                    <button
                      type="button"
                      onClick={loadConfig}
                      className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="h-20 rounded-2xl bg-gray-800/60 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {categories.map(cat => (
                      <CategoryCard
                        key={cat.id}
                        category={cat}
                        selected={form.categoryId === cat.id}
                        onSelect={(id) => setForm(f => ({ ...f, categoryId: id }))}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="space-y-5"
              >
                <div>
                  <StepLabel>Sobre ti</StepLabel>
                  <h2 className="text-xl font-semibold text-white leading-snug">
                    Un poco más de contexto
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Opcional — nos ayuda a personalizar tu experiencia.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Industry */}
                  <div className="col-span-2">
                    <select
                      className={SELECT_CLS}
                      value={form.industryId ?? ''}
                      onChange={(e) => setForm(f => ({ ...f, industryId: e.target.value ? Number(e.target.value) : null }))}
                    >
                      <option value="">Industria</option>
                      {byGroup('industry').map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <select
                      className={SELECT_CLS}
                      value={form.country}
                      onChange={(e) => setForm(f => ({ ...f, country: e.target.value === '—' ? '' : e.target.value }))}
                    >
                      <option value="">País</option>
                      {COUNTRIES.map((c, i) => (
                        c === '—'
                          ? <option key={i} disabled>──────────</option>
                          : <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Org type */}
                  <div>
                    <select
                      className={SELECT_CLS}
                      value={form.orgTypeId ?? ''}
                      onChange={(e) => setForm(f => ({ ...f, orgTypeId: e.target.value ? Number(e.target.value) : null }))}
                    >
                      <option value="">Tipo de org.</option>
                      {byGroup('org_type').map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Org size */}
                  <div>
                    <select
                      className={SELECT_CLS}
                      value={form.orgSizeId ?? ''}
                      onChange={(e) => setForm(f => ({ ...f, orgSizeId: e.target.value ? Number(e.target.value) : null }))}
                    >
                      <option value="">Tamaño</option>
                      {byGroup('org_size').map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Objective */}
                  <div>
                    <select
                      className={SELECT_CLS}
                      value={form.objectiveId ?? ''}
                      onChange={(e) => setForm(f => ({ ...f, objectiveId: e.target.value ? Number(e.target.value) : null }))}
                    >
                      <option value="">Objetivo principal</option>
                      {byGroup('objective').map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom actions — safe-area aware */}
        <div
          className="flex-shrink-0 px-6 flex flex-col gap-2 border-t border-white/[0.04] pt-4"
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        >
          {saveError && (
            <p className="text-xs text-red-400 text-center">
              No se pudo guardar. Intenta de nuevo.
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={skip}
              disabled={saving}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-40"
            >
              {step === 1 ? 'Completar después' : 'Saltar'}
            </button>

            <button
              type="button"
              onClick={saveError ? () => finish(step === 3) : advance}
              disabled={saving}
              className="
                px-5 py-2.5 bg-brand-600 hover:bg-brand-500 active:bg-brand-700
                text-white text-sm font-semibold rounded-xl
                shadow-[0_2px_12px_rgba(2,132,199,0.25)]
                hover:shadow-[0_4px_20px_rgba(2,132,199,0.4)] hover:-translate-y-px
                active:translate-y-0 transition-all duration-200
                disabled:opacity-50 disabled:cursor-wait
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-900
              "
            >
              {saving ? 'Guardando…' : saveError ? 'Reintentar' : step === 3 ? 'Finalizar' : 'Continuar →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

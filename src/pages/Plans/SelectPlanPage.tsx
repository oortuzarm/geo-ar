import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPlans, type PublicPlan } from '../../services/plansApi'
import { claimTemporaryPreview } from '../../services/temporaryPreviewsApi'
import { ApiError } from '../../lib/apiFetch'
import { PENDING_CLAIM_KEY } from '../../hooks/usePendingClaim'
import { DEMO_STORAGE_KEY } from '../Try/TryPage'
import { LAST_PROJECT_KEY } from '../../hooks/useWorkspace'
import { useAuthStore } from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMoney(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`
}

// ── Billing toggle — identical to PlansPage ───────────────────────────────────

function BillingToggle({
  billing, onToggle, annualDiscount,
}: {
  billing:        'monthly' | 'annual'
  onToggle:       () => void
  annualDiscount: number
}) {
  return (
    <div className="flex items-center justify-center gap-5">
      <button
        onClick={() => billing !== 'monthly' && onToggle()}
        className={`text-base font-semibold transition-colors ${
          billing === 'monthly' ? 'text-gray-100' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        Mensual
      </button>

      <button
        role="switch"
        aria-checked={billing === 'annual'}
        onClick={onToggle}
        className="relative w-11 h-6 rounded-full bg-brand-600 flex-shrink-0
                   focus:outline-none focus:ring-2 focus:ring-brand-500
                   focus:ring-offset-2 focus:ring-offset-gray-950"
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow
                      transition-transform duration-200 ${
            billing === 'annual' ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>

      <div className="text-left">
        <button
          onClick={() => billing !== 'annual' && onToggle()}
          className={`text-base font-semibold transition-colors block ${
            billing === 'annual' ? 'text-gray-100' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Anual
        </button>
        {annualDiscount > 0 && (
          <span className="text-xs font-medium text-emerald-400">
            Ahorra {annualDiscount}%
          </span>
        )}
      </div>
    </div>
  )
}

// ── Plan card — same visual structure as PlansPage, CTA adapted for onboarding ─

interface PlanCardProps {
  plan:       PublicPlan
  billing:    'monthly' | 'annual'
  isClaiming: boolean
  disabled:   boolean
  onChoose:   () => void
}

function PlanCard({ plan, billing, isClaiming, disabled, onChoose }: PlanCardProps) {
  const isCustom = plan.isCustom && Number(plan.monthlyPrice) === 0

  let displayPrice: string
  let priceLabel: string
  if (isCustom) {
    displayPrice = 'Personalizado'
    priceLabel   = ''
  } else if (billing === 'annual' && plan.yearlyPriceComputed !== null) {
    displayPrice = fmtMoney(plan.yearlyPriceComputed)
    priceLabel   = '/año'
  } else {
    displayPrice = fmtMoney(plan.monthlyPrice)
    priceLabel   = '/mes'
  }

  const locationText = plan.locationLimit === null
    ? 'Ubicaciones ilimitadas'
    : `${plan.locationLimit} ubicaciones`

  return (
    <div className={[
      'relative flex flex-col rounded-2xl p-6 transition-all duration-200',
      plan.isRecommended
        ? 'bg-gray-900 border border-brand-500 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/30'
        : 'bg-gray-900 border border-gray-800',
    ].join(' ')}>

      {/* Badge row */}
      <div className="flex items-center gap-2 mb-4 min-h-[26px]">
        {plan.isRecommended && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                           bg-brand-500/15 border border-brand-500/25
                           text-[10px] font-bold text-brand-400 uppercase tracking-wider">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Recomendado
          </span>
        )}
      </div>

      {/* Plan name */}
      <h3 className="text-xl font-bold text-gray-100 mb-4">{plan.name}</h3>

      {/* Price */}
      <div className="mb-6">
        {isCustom ? (
          <p className="text-2xl font-bold text-gray-100">Personalizado</p>
        ) : (
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tabular-nums text-gray-100">
              {displayPrice}
            </span>
            <span className="text-sm text-gray-500 leading-none">{priceLabel}</span>
          </div>
        )}
        {billing === 'annual' && !isCustom && (
          <p className="text-xs text-emerald-400 mt-1.5 font-medium">Facturado anualmente</p>
        )}
        {plan.hasTrial && plan.trialDays && (
          <p className="text-xs text-emerald-400 mt-1.5 font-medium">
            {plan.trialDays} días de prueba gratis
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mb-5" />

      {/* Feature list */}
      <ul className="space-y-3 flex-1 mb-6">
        <li className="flex items-start gap-2.5 text-sm text-gray-300">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {locationText}
        </li>
      </ul>

      {/* CTA */}
      {isCustom ? (
        <a
          href="https://www.ubyca.com/contact/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-center block
                     bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors border border-gray-700"
        >
          Contactar ventas
        </a>
      ) : (
        <button
          onClick={onChoose}
          disabled={disabled}
          className={[
            'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors',
            'disabled:opacity-50 disabled:cursor-wait',
            plan.isRecommended
              ? 'bg-brand-600 hover:bg-brand-700 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700',
          ].join(' ')}
        >
          {isClaiming ? 'Guardando...' : 'Seleccionar plan'}
        </button>
      )}
    </div>
  )
}

// ── Summary card — reinforces the user already has an experience ready ─────────

function SummaryCard({ locationCount }: { locationCount: number | null }) {
  if (locationCount === null) return null

  const label = locationCount === 1 ? 'ubicación lista para guardar' : 'ubicaciones listas para guardar'

  return (
    <div className="max-w-sm mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-5
                    flex items-center gap-4">
      <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-brand-500/10 border border-brand-500/20
                      flex items-center justify-center">
        <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-100">
          {locationCount} {label}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full
                           bg-gray-800 border border-gray-700
                           text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            Borrador
          </span>
          <span className="text-xs text-gray-600">· Listo para activar</span>
        </div>
      </div>
    </div>
  )
}

// ── Expired state ─────────────────────────────────────────────────────────────

function ExpiredScreen() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <span className="font-bold text-gray-100">Ubyca</span>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-sm space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-800 border border-gray-700
                          flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-100">La previsualización expiró</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Las previsualizaciones temporales son válidas por 30 minutos.
              Puedes crear una nueva desde el editor.
            </p>
          </div>
          <a
            href="/try"
            className="inline-block w-full py-2.5 rounded-xl text-sm font-semibold text-center
                       bg-brand-600 hover:bg-brand-700 text-white transition-colors"
          >
            Crear nueva experiencia
          </a>
        </div>
      </div>
    </div>
  )
}

// ── SelectPlanPage ─────────────────────────────────────────────────────────────

export default function SelectPlanPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const tokenFromUrl = searchParams.get('claim_preview_token')
  const token = tokenFromUrl ?? localStorage.getItem(PENDING_CLAIM_KEY)

  const [plans,          setPlans]          = useState<PublicPlan[]>([])
  const [loadingPlans,   setLoadingPlans]   = useState(true)
  const [claimingPlanId, setClaimingPlanId] = useState<string | null>(null)
  const [error,          setError]          = useState<string | null>(null)
  const [expired,        setExpired]        = useState(false)
  const [billing,        setBilling]        = useState<'monthly' | 'annual'>('monthly')
  const [locationCount,  setLocationCount]  = useState<number | null>(null)

  function loadPlans() {
    setLoadingPlans(true)
    setError(null)
    getPlans()
      .then((all) => setPlans(all.sort((a, b) => a.sortOrder - b.sortOrder)))
      .catch(() => setError('No se pudieron cargar los planes. Intenta de nuevo.'))
      .finally(() => setLoadingPlans(false))
  }

  useEffect(() => {
    if (!token) {
      navigate('/app', { replace: true })
      return
    }
    // Read location count from demo localStorage state — no extra API call
    try {
      const raw = localStorage.getItem(DEMO_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { points?: unknown[] }
        if (Array.isArray(parsed.points)) setLocationCount(parsed.points.length)
      }
    } catch {}

    loadPlans()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleChoosePlan(plan: PublicPlan) {
    if (!token || claimingPlanId) return
    setClaimingPlanId(plan.id)
    setError(null)
    try {
      // TODO: Paddle checkout goes here before claim (future)
      const result = await claimTemporaryPreview(token, plan.slug)
      // Write the claimed project ID so useWorkspace selects it on /app
      localStorage.setItem(LAST_PROJECT_KEY, result.projectId)
      // Refresh currentUser so useSubscription reflects the newly assigned plan
      await useAuthStore.getState().reloadUser()
      localStorage.removeItem(PENDING_CLAIM_KEY)
      localStorage.removeItem(DEMO_STORAGE_KEY)
      navigate('/app', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 410)) {
        setExpired(true)
      } else {
        console.error('[SelectPlanPage] Claim failed', err)
        setError('No se pudo guardar la experiencia. Intenta de nuevo.')
      }
      setClaimingPlanId(null)
    }
  }

  if (expired) return <ExpiredScreen />

  const annualDiscount = plans.find((p) => p.annualDiscountPercent > 0)?.annualDiscountPercent ?? 0
  const gridCols =
    plans.length <= 1 ? 'max-w-xs mx-auto'            :
    plans.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' :
    plans.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3'    :
                         'sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          <span className="font-bold text-gray-100">Ubyca</span>
          <span className="text-gray-700 select-none" aria-hidden>·</span>
          <span className="text-sm text-gray-500">Activa tu experiencia</span>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">

        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-100">
            Tu experiencia está lista
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Selecciona un plan para guardar tu experiencia geolocalizada y comenzar a usar Ubyca.
          </p>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                             bg-emerald-500/15 border border-emerald-500/25
                             text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Tus ubicaciones GPS ya están listas
            </span>
          </div>
        </div>

        {/* Summary card */}
        <SummaryCard locationCount={locationCount} />

        {/* Billing toggle — only shown when at least one plan has an annual discount */}
        {!loadingPlans && !error && annualDiscount > 0 && (
          <BillingToggle
            billing={billing}
            onToggle={() => setBilling((b) => b === 'monthly' ? 'annual' : 'monthly')}
            annualDiscount={annualDiscount}
          />
        )}

        {/* Loading */}
        {loadingPlans && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20 space-y-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={loadPlans}
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Plans grid */}
        {!loadingPlans && !error && plans.length > 0 && (
          <div className={`grid grid-cols-1 gap-5 ${gridCols}`}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billing={billing}
                isClaiming={claimingPlanId === plan.id}
                disabled={claimingPlanId !== null}
                onChoose={() => { void handleChoosePlan(plan) }}
              />
            ))}
          </div>
        )}

        {/* No plans */}
        {!loadingPlans && !error && plans.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No hay planes disponibles en este momento.</p>
          </div>
        )}

        {/* Disclaimer */}
        {!loadingPlans && !error && plans.length > 0 && (
          <div className="pt-2 space-y-1.5 text-xs text-gray-600 leading-relaxed">
            <p>* Todos los precios son sin impuestos.</p>
            <p>
              Si representas a una institución educativa,{' '}
              <a
                href="https://www.ubyca.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-400 underline underline-offset-2 transition-colors"
              >
                contáctanos
              </a>
              {' '}para acceder a precios preferenciales.
            </p>
          </div>
        )}

        {/* Footer */}
        {!loadingPlans && !error && plans.length > 0 && (
          <p className="text-center text-xs text-gray-600 pb-4">
            ¿Tienes dudas?{' '}
            <a
              href="https://www.ubyca.com/contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-400 transition-colors underline underline-offset-2"
            >
              Contáctanos
            </a>
          </p>
        )}

      </main>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPlans } from '../../services/plansApi'
import type { PublicPlan } from '../../services/plansApi'
import { claimTemporaryPreview } from '../../services/temporaryPreviewsApi'
import { ApiError } from '../../lib/apiFetch'
import { PENDING_CLAIM_KEY } from '../../hooks/usePendingClaim'
import { DEMO_STORAGE_KEY } from '../Try/TryPage'
import Spinner from '../../components/ui/Spinner'

function navigateToProjectUrl(url: string, navigate: ReturnType<typeof useNavigate>) {
  try {
    const parsed = new URL(url)
    if (parsed.origin === window.location.origin) {
      navigate(parsed.pathname + parsed.search, { replace: true })
    } else {
      window.location.href = url
    }
  } catch {
    navigate(url, { replace: true })
  }
}

export default function SelectPlanPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const tokenFromUrl = searchParams.get('claim_preview_token')
  const token = tokenFromUrl ?? localStorage.getItem(PENDING_CLAIM_KEY)

  const [plans, setPlans] = useState<PublicPlan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [claimingPlanId, setClaimingPlanId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/app', { replace: true })
      return
    }
    getPlans()
      .then((all) =>
        setPlans(
          all
            .filter((p) => !p.isCustom)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        ),
      )
      .catch(() => setError('No se pudieron cargar los planes. Recargá la página.'))
      .finally(() => setLoadingPlans(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleChoosePlan(plan: PublicPlan) {
    if (!token || claimingPlanId) return
    setClaimingPlanId(plan.id)
    setError(null)
    try {
      // TODO: Paddle checkout goes here before claim (future)
      const result = await claimTemporaryPreview(token)
      localStorage.removeItem(PENDING_CLAIM_KEY)
      localStorage.removeItem(DEMO_STORAGE_KEY)
      const url = result.redirect_url ?? result.redirectUrl
      if (url) {
        navigateToProjectUrl(url, navigate)
      } else {
        navigate('/app', { replace: true })
      }
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 410)) {
        setExpired(true)
      } else {
        console.error('[SelectPlanPage] Claim failed', err)
        setError('No se pudo guardar la experiencia. Intentá de nuevo.')
      }
      setClaimingPlanId(null)
    }
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-sm">
          <p className="text-4xl mb-4">⏱</p>
          <h1 className="text-xl font-semibold text-gray-100 mb-2">La previsualización expiró</h1>
          <p className="text-sm text-gray-400 mb-6">
            Las previsualizaciones temporales son válidas por 30 minutos.
            Podés crear una nueva desde el editor de demo.
          </p>
          <a
            href="/try"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500
                       text-white text-sm font-semibold transition-colors"
          >
            Crear nueva experiencia
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-start px-4 py-16">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">
            Tu experiencia está lista
          </h1>
          <p className="text-sm text-gray-400">
            Elegí un plan para guardarla en tu cuenta. Podés cambiar de plan en cualquier momento.
          </p>
        </div>

        {loadingPlans && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {!loadingPlans && error && (
          <p className="text-center text-sm text-red-400">{error}</p>
        )}

        {!loadingPlans && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isClaiming={claimingPlanId === plan.id}
                disabled={claimingPlanId !== null}
                onChoose={() => { void handleChoosePlan(plan) }}
              />
            ))}
          </div>
        )}

        {!loadingPlans && !error && plans.length === 0 && (
          <p className="text-center text-sm text-gray-500">No hay planes disponibles en este momento.</p>
        )}

        <p className="text-center text-xs text-gray-600 mt-8">
          Sin tarjeta de crédito requerida para comenzar
        </p>
      </div>
    </div>
  )
}

interface PlanCardProps {
  plan: PublicPlan
  isClaiming: boolean
  disabled: boolean
  onChoose: () => void
}

function PlanCard({ plan, isClaiming, disabled, onChoose }: PlanCardProps) {
  const price = plan.monthlyPrice === 0 ? 'Gratis' : `$${plan.monthlyPrice}/mes`
  const locations = plan.locationLimit === null
    ? 'Ubicaciones ilimitadas'
    : `Hasta ${plan.locationLimit} ubicaciones`

  return (
    <div
      className={`relative flex flex-col bg-gray-900 border rounded-2xl p-6 gap-4
        ${plan.isRecommended
          ? 'border-indigo-500 ring-1 ring-indigo-500/40'
          : 'border-gray-700/80'}`}
    >
      {plan.isRecommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2
                         bg-indigo-600 text-white text-[11px] font-semibold
                         px-3 py-0.5 rounded-full whitespace-nowrap">
          Recomendado
        </span>
      )}

      <div>
        <h2 className="text-base font-semibold text-gray-100">{plan.name}</h2>
        <p className="text-2xl font-bold text-white mt-1">{price}</p>
        {plan.monthlyPrice > 0 && plan.annualDiscountPercent > 0 && (
          <p className="text-xs text-indigo-400 mt-0.5">
            Ahorrá {plan.annualDiscountPercent}% con el plan anual
          </p>
        )}
      </div>

      <p className="text-sm text-gray-400">{locations}</p>

      {plan.hasTrial && plan.trialDays && (
        <p className="text-xs text-emerald-400">
          {plan.trialDays} días de prueba gratis
        </p>
      )}

      <button
        onClick={onChoose}
        disabled={disabled}
        className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold
                   transition-colors disabled:opacity-50 disabled:cursor-wait
                   bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white"
      >
        {isClaiming ? 'Guardando…' : 'Elegir plan'}
      </button>
    </div>
  )
}

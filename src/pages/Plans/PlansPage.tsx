import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlans, type PublicPlan } from '../../services/plansApi'
import { useSubscription } from '../../hooks/useSubscription'
import Spinner from '../../components/ui/Spinner'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMoney(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`
}

// ── Coming soon modal ─────────────────────────────────────────────────────────

function ComingSoonModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl
                      p-6 max-w-sm w-full space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500/15 border border-brand-500/25
                          flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-100">Pagos próximamente</h3>
            <p className="text-xs text-gray-500 mt-0.5">Activación de planes</p>
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          Los pagos en línea estarán disponibles muy pronto. Para activar tu plan ahora,
          contacta a nuestro equipo.
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="mailto:hola@ubyca.com?subject=Quiero%20activar%20un%20plan"
            className="w-full py-2.5 text-center bg-brand-600 hover:bg-brand-700 text-white
                       text-sm font-medium rounded-lg transition-colors"
          >
            Contactar al equipo
          </a>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300
                       text-sm font-medium rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Plan card ─────────────────────────────────────────────────────────────────

interface PlanCardProps {
  plan:      PublicPlan
  billing:   'monthly' | 'annual'
  isCurrent: boolean
  onUpgrade: () => void
}

function PlanCard({ plan, billing, isCurrent, onUpgrade }: PlanCardProps) {
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
        {isCurrent && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                           bg-emerald-500/15 border border-emerald-500/25
                           text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Plan actual
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
      {isCurrent ? (
        <button
          disabled
          className="w-full py-2.5 rounded-xl text-sm font-semibold border border-gray-700
                     text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Plan actual
        </button>
      ) : isCustom ? (
        <a
          href="mailto:hola@ubyca.com?subject=Consulta%20sobre%20plan%20Enterprise"
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-center block
                     bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors border border-gray-700"
        >
          Contactar ventas
        </a>
      ) : (
        <button
          onClick={onUpgrade}
          className={[
            'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors',
            plan.isRecommended
              ? 'bg-brand-600 hover:bg-brand-700 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700',
          ].join(' ')}
        >
          Actualizar plan
        </button>
      )}
    </div>
  )
}

// ── Billing toggle ────────────────────────────────────────────────────────────

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

// ── PlansPage ─────────────────────────────────────────────────────────────────

export default function PlansPage() {
  const navigate     = useNavigate()
  const subscription = useSubscription()

  const [plans,          setPlans]          = useState<PublicPlan[]>([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState<string | null>(null)
  const [billing,        setBilling]        = useState<'monthly' | 'annual'>('monthly')
  const [comingSoonOpen, setComingSoonOpen] = useState(false)

  function load() {
    setLoading(true)
    setError(null)
    getPlans()
      .then(setPlans)
      .catch(() => setError('No se pudieron cargar los planes. Intenta de nuevo.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const annualDiscount = plans.find((p) => p.annualDiscountPercent > 0)?.annualDiscountPercent ?? 0

  const gridCols =
    plans.length === 1 ? 'max-w-xs mx-auto' :
    plans.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' :
    plans.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' :
                         'sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className="text-gray-100 min-h-full">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1 rounded-lg text-gray-500 hover:text-gray-300
                       hover:bg-gray-800 transition-colors"
            title="Volver"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-bold text-gray-100">Planes</h1>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">

        {/* Hero */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-100 mb-3">
            Elige el plan ideal para tu proyecto
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Todos los planes incluyen acceso completo a las funciones. Sin contratos. Sin sorpresas.
          </p>
        </div>

        {/* Billing toggle — only shown when plans are loaded and discount exists */}
        {!loading && !error && annualDiscount > 0 && (
          <BillingToggle
            billing={billing}
            onToggle={() => setBilling((b) => b === 'monthly' ? 'annual' : 'monthly')}
            annualDiscount={annualDiscount}
          />
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20 space-y-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={load}
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Plans grid */}
        {!loading && !error && plans.length > 0 && (
          <div className={`grid grid-cols-1 gap-5 ${gridCols}`}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billing={billing}
                isCurrent={subscription.planSlug === plan.slug}
                onUpgrade={() => setComingSoonOpen(true)}
              />
            ))}
          </div>
        )}

        {/* No plans */}
        {!loading && !error && plans.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No hay planes disponibles en este momento.</p>
          </div>
        )}

        {/* Footer */}
        {!loading && !error && plans.length > 0 && (
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

      {/* Coming soon modal */}
      {comingSoonOpen && <ComingSoonModal onClose={() => setComingSoonOpen(false)} />}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'
import Spinner from '../../components/ui/Spinner'
import { getPlans, type PublicPlan } from '../../services/plansApi'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMoney(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`
}

// ── Plan card (marketing variant — no upgrade/downgrade actions) ──────────────

function PricingCard({ plan, billing }: { plan: PublicPlan; billing: 'monthly' | 'annual' }) {
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
    : `Hasta ${plan.locationLimit} ubicaciones`

  return (
    <div className={[
      'relative flex flex-col rounded-2xl p-6',
      plan.isRecommended
        ? 'bg-gray-900 border border-brand-500 shadow-xl shadow-brand-500/10 ring-1 ring-brand-500/30'
        : 'bg-gray-900/60 border border-white/[0.08]',
    ].join(' ')}>

      {/* Badge */}
      <div className="min-h-[26px] mb-4">
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

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-100 mb-4">{plan.name}</h3>

      {/* Price */}
      <div className="mb-6">
        {isCustom ? (
          <p className="text-2xl font-bold text-gray-100">Personalizado</p>
        ) : (
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tabular-nums text-gray-100">{displayPrice}</span>
            <span className="text-sm text-gray-500 leading-none">{priceLabel}</span>
          </div>
        )}
        {billing === 'annual' && !isCustom && plan.annualDiscountPercent > 0 && (
          <p className="text-xs text-emerald-400 mt-1.5 font-medium">
            Ahorrás {plan.annualDiscountPercent}% al año
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.06] mb-5" />

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-6">
        <li className="flex items-center gap-2.5 text-sm text-gray-300">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {locationText}
        </li>
        {plan.hasTrial && plan.trialDays && (
          <li className="flex items-center gap-2.5 text-sm text-gray-300">
            <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {plan.trialDays} días de prueba gratis
          </li>
        )}
      </ul>

      {/* CTA — informational only, no checkout */}
      {isCustom ? (
        <Link
          to="/contact"
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-center block
                     bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors border border-gray-700"
        >
          Hablar con ventas
        </Link>
      ) : (
        <a
          href="https://studio.ubyca.com/register"
          className={[
            'w-full py-2.5 rounded-xl text-sm font-semibold text-center block transition-colors',
            plan.isRecommended
              ? 'bg-brand-600 hover:bg-brand-700 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700',
          ].join(' ')}
        >
          Comenzar gratis
        </a>
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
            Ahorrá {annualDiscount}%
          </span>
        )}
      </div>
    </div>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: '¿Necesito descargar una app?',
    a: 'No. Ubyca funciona directamente desde el navegador del teléfono. Tus visitantes no necesitan instalar nada.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. Podés cancelar tu suscripción en cualquier momento desde tu panel de cuenta, sin penalidades ni compromisos mínimos.',
  },
  {
    q: '¿La prueba gratuita está incluida?',
    a: 'Todos los planes nuevos incluyen un período de prueba para que puedas explorar las funciones antes de comprometerte.',
  },
  {
    q: '¿Puedo compartir mis experiencias?',
    a: 'Sí. Podés compartir el link público de tu experiencia con cualquier persona. No necesitan una cuenta en Ubyca.',
  },
  {
    q: '¿Qué ocurre si necesito más ubicaciones?',
    a: 'Podés actualizar tu plan en cualquier momento desde el panel de configuración, o contactarnos para opciones personalizadas.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-center justify-between gap-4
                   text-sm font-medium text-gray-200 hover:text-white transition-colors"
      >
        <span>{q}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-400 leading-relaxed">{a}</p>
      )}
    </div>
  )
}

// ── PricingPage ───────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [plans,   setPlans]   = useState<PublicPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  useEffect(() => {
    document.title = 'Precios | Ubyca'
    return () => { document.title = 'Ubyca' }
  }, [])

  function load() {
    setLoading(true)
    setError(null)
    getPlans()
      .then((data) => {
        console.info('[PricingPage] plans loaded:', data.length)
        setPlans(data)
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[PricingPage] getPlans failed:', msg, err)
        setError('No se pudieron cargar los planes. Intenta de nuevo.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const annualDiscount = plans.find((p) => p.annualDiscountPercent > 0)?.annualDiscountPercent ?? 0
  const gridCols =
    plans.length <= 1 ? 'max-w-xs mx-auto' :
    plans.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' :
                         'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className="min-h-screen bg-[#050810] text-gray-100">
      <LandingNavBar />

      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-5">

          {/* ── Hero ────────────────────────────────────────────────────────── */}
          <div className="text-center mb-14 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Planes para crear<br className="hidden sm:block" /> experiencias geolocalizadas
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Elige el plan que mejor se adapte a tu proyecto.
              Puedes comenzar gratis y escalar cuando lo necesites.
            </p>
          </div>

          {/* ── Billing toggle ───────────────────────────────────────────────── */}
          {!loading && !error && annualDiscount > 0 && (
            <div className="mb-10">
              <BillingToggle
                billing={billing}
                onToggle={() => setBilling((b) => (b === 'monthly' ? 'annual' : 'monthly'))}
                annualDiscount={annualDiscount}
              />
            </div>
          )}

          {/* ── Loading ──────────────────────────────────────────────────────── */}
          {loading && (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {/* ── Error ────────────────────────────────────────────────────────── */}
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

          {/* ── Plans grid ───────────────────────────────────────────────────── */}
          {!loading && !error && plans.length > 0 && (
            <div className={`grid grid-cols-1 gap-5 ${gridCols}`}>
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} billing={billing} />
              ))}
            </div>
          )}

          {/* No plans */}
          {!loading && !error && plans.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-sm">No hay planes disponibles en este momento.</p>
            </div>
          )}

          {/* ── Disclaimer ───────────────────────────────────────────────────── */}
          {!loading && !error && plans.length > 0 && (
            <p className="text-center text-xs text-gray-600 mt-6 mb-20">
              Los precios no incluyen impuestos aplicables.
              La contratación online estará disponible próximamente.
            </p>
          )}

          {/* ── FAQ ──────────────────────────────────────────────────────────── */}
          <section className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-100 text-center mb-8">
              Preguntas frecuentes
            </h2>
            <div>
              {FAQ_ITEMS.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

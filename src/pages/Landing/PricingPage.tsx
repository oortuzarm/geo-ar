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

// ── Plan card — identical structure to PlansPage, CTA adapted for public ───────

function PlanCard({ plan, billing }: { plan: PublicPlan; billing: 'monthly' | 'annual' }) {
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

  // CTA — use admin-configured values with graceful fallback to current defaults
  const ctaLabel = plan.ctaText ?? (isCustom ? 'Contactar ventas' : 'Comenzar gratis')
  const ctaHref  = plan.ctaUrl  ?? (isCustom ? '/contact'         : 'https://studio.ubyca.com/register')
  const ctaIsExternal = ctaHref.startsWith('http')
  const ctaClassName = [
    'w-full py-2.5 rounded-xl text-sm font-semibold text-center block transition-colors',
    !isCustom && plan.isRecommended
      ? 'bg-brand-600 hover:bg-brand-700 text-white'
      : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700',
  ].join(' ')

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
      <h3 className="text-xl font-bold text-gray-100 mb-1">{plan.name}</h3>

      {/* Public description */}
      {plan.publicDescription && (
        <p className="text-sm text-gray-500 mb-4 leading-snug">{plan.publicDescription}</p>
      )}
      {!plan.publicDescription && <div className="mb-4" />}

      {/* Price — hidden for custom/enterprise plans to avoid redundant "Personalizado" heading */}
      {!isCustom && (
        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tabular-nums text-gray-100">
              {displayPrice}
            </span>
            <span className="text-sm text-gray-500 leading-none">{priceLabel}</span>
          </div>
          {billing === 'annual' && (
            <p className="text-xs text-emerald-400 mt-1.5 font-medium">Facturado anualmente</p>
          )}
          {plan.hasTrial && plan.trialDays && (
            <p className="text-xs text-emerald-400 mt-1.5 font-medium">
              {plan.trialDays} días de prueba gratis
            </p>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-800 mb-5" />

      {/* Feature list — location always first, then dynamic features */}
      <ul className="space-y-3 flex-1 mb-6">
        <li className="flex items-start gap-2.5 text-sm text-gray-300">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {locationText}
        </li>
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {ctaIsExternal ? (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className={ctaClassName}
        >
          {ctaLabel}
        </a>
      ) : (
        <Link to={ctaHref} className={ctaClassName}>
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}

// ── Static content — identical to PlansPage ───────────────────────────────────

const INCLUDED_FEATURES: { label: string; paths: string[] }[] = [
  {
    label: 'Experiencias geolocalizadas',
    paths: [
      'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
      'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    ],
  },
  {
    label: 'Analytics en tiempo real',
    paths: [
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    ],
  },
  {
    label: 'Compartir experiencias',
    paths: [
      'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
    ],
  },
  {
    label: 'Integración en sitios web',
    paths: ['M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'],
  },
  {
    label: 'Visualización pública',
    paths: [
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    ],
  },
  {
    label: 'Compatible con móviles',
    paths: ['M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'],
  },
  {
    label: 'Gestión de miembros',
    paths: [
      'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    ],
  },
  {
    label: 'Mapas interactivos',
    paths: [
      'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    ],
  },
  {
    label: 'Sin descarga de aplicaciones',
    paths: [
      'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    ],
  },
  {
    label: 'Configuración por ubicación',
    paths: [
      'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    ],
  },
]

const UNLOCKABLE_CONTENT: { label: string; paths: string[] }[] = [
  {
    label: 'Enlaces y landing pages',
    paths: [
      'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    ],
  },
  {
    label: 'Videos geolocalizados',
    paths: [
      'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
    ],
  },
  {
    label: 'Audios por ubicación',
    paths: [
      'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    ],
  },
  {
    label: 'Archivos descargables',
    paths: ['M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'],
  },
  {
    label: 'Contenido exclusivo por radio GPS',
    paths: [
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    ],
  },
  {
    label: 'Acceso por horario',
    paths: ['M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
  },
  {
    label: 'Acceso limitado por cupos',
    paths: [
      'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    ],
  },
  {
    label: 'Experiencias públicas o privadas',
    paths: [
      'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    ],
  },
  {
    label: 'Botones personalizados',
    paths: [
      'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
    ],
  },
  {
    label: 'Mapas interactivos',
    paths: [
      'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    ],
  },
]

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
      .then((data) => setPlans(data.sort((a, b) => a.sortOrder - b.sortOrder)))
      .catch(() => setError('No se pudieron cargar los planes. Intenta de nuevo.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const annualDiscount = plans.find((p) => p.annualDiscountPercent > 0)?.annualDiscountPercent ?? 0

  const gridCols =
    plans.length <= 1 ? 'max-w-xs mx-auto'                  :
    plans.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' :
    plans.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3'    :
                         'sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className="min-h-screen bg-[#050810] text-gray-100">
      <LandingNavBar />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">

          {/* ── Hero ────────────────────────────────────────────────────────── */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-100 mb-3">
              Elige el plan ideal para tu proyecto
            </h1>
            <p className="text-gray-500 text-base max-w-md mx-auto">
              Todo lo que necesitas para crear experiencias geolocalizadas.
            </p>
          </div>

          {/* ── Billing toggle ───────────────────────────────────────────────── */}
          {!loading && !error && annualDiscount > 0 && (
            <BillingToggle
              billing={billing}
              onToggle={() => setBilling((b) => b === 'monthly' ? 'annual' : 'monthly')}
              annualDiscount={annualDiscount}
            />
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
                <PlanCard key={plan.id} plan={plan} billing={billing} />
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
            <div className="pt-2 space-y-1.5 text-xs text-gray-600 leading-relaxed">
              <p>* Todos los precios son sin impuestos.</p>
              <p>
                Si representas a una institución educativa,{' '}
                <Link
                  to="/contact"
                  className="text-gray-500 hover:text-gray-400 underline underline-offset-2 transition-colors"
                >
                  contáctanos
                </Link>
                {' '}para acceder a precios preferenciales.
              </p>
            </div>
          )}

          {/* ── Included features ────────────────────────────────────────────── */}
          {!loading && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Incluido en todos los planes</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Accede a todas las funciones de Ubyca en cualquier plan.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {INCLUDED_FEATURES.map(({ label, paths }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3.5 rounded-xl
                               bg-gray-800/40 border border-gray-800
                               hover:bg-gray-800/60 hover:border-gray-700 transition-colors"
                  >
                    <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-brand-500/10 border border-brand-500/15
                                    flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {paths.map((d, i) => (
                          <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
                        ))}
                      </svg>
                    </div>
                    <span className="text-xs text-gray-300 leading-snug mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Unlockable content ───────────────────────────────────────────── */}
          {!loading && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Qué puedes desbloquear</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Activa contenido digital según la ubicación del usuario.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {UNLOCKABLE_CONTENT.map(({ label, paths }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3.5 rounded-xl
                               bg-gray-800/40 border border-gray-800
                               hover:bg-gray-800/60 hover:border-gray-700 transition-colors"
                  >
                    <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/15
                                    flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {paths.map((d, i) => (
                          <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
                        ))}
                      </svg>
                    </div>
                    <span className="text-xs text-gray-300 leading-snug mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Custom CTA ───────────────────────────────────────────────────── */}
          <section className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
              ¿Necesitas una solución más personalizada?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
              Podemos ayudarte a implementar experiencias geolocalizadas para marcas,
              espacios físicos, eventos o activaciones a gran escala.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl
                         bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                         font-semibold text-sm transition-all duration-150
                         shadow-[0_4px_20px_rgba(2,132,199,0.35)]"
            >
              Hablar con ventas
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>

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

          {/* ── Footer link ──────────────────────────────────────────────────── */}
          {!loading && !error && plans.length > 0 && (
            <p className="text-center text-xs text-gray-600 pb-4">
              ¿Tienes dudas?{' '}
              <Link
                to="/contact"
                className="text-gray-500 hover:text-gray-400 transition-colors underline underline-offset-2"
              >
                Contáctanos
              </Link>
            </p>
          )}

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

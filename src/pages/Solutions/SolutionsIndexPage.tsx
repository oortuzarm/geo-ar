import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, SectionLabel } from '../../components/landing/LandingPrimitives'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'
import FinalCTASection from './FinalCTASection'
import { INDUSTRIES } from './solutionsData'

// ─── Industry Card ────────────────────────────────────────────────────────────

function IndustryCard({ industry, index }: {
  industry: typeof INDUSTRIES[number]
  index: number
}) {
  return (
    <Reveal delay={index * 0.07}>
      <Link
        to={`/solutions/${industry.slug}`}
        className="group relative flex flex-col rounded-2xl bg-white/[0.02] border border-white/[0.06]
                   p-7 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200
                   h-full overflow-hidden"
      >
        {/* Hover accent glow */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0
                     group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${industry.accentColor}14 0%, transparent 70%)` }}
        />

        {/* Accent dot + label */}
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: industry.accentColor }}
          />
          <p
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: industry.accentColor }}
          >
            Soluciones
          </p>
        </div>

        <h2 className="text-xl font-black text-white mb-3 group-hover:text-white transition-colors">
          {industry.name}
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-6">
          {industry.shortDesc}
        </p>

        <div
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-150
                     group-hover:gap-2.5"
          style={{ color: industry.accentColor }}
        >
          Ver solución
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
          </svg>
        </div>
      </Link>
    </Reveal>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SolutionsIndexPage() {
  useEffect(() => {
    document.title = 'Soluciones por industria — Ubyca'
    return () => { document.title = 'Ubyca — Experiencias geolocalizadas' }
  }, [])

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <LandingNavBar />

      {/* Hero */}
      <section className="relative bg-[#050810] overflow-hidden pt-28 pb-16 px-5">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(14,165,233,0.07) 0%, transparent 65%)',
        }} />

        <div className="max-w-4xl mx-auto text-center relative">
          <Reveal>
            <SectionLabel>Soluciones</SectionLabel>
            <h1 className="font-black text-white tracking-tight leading-[1.05]
                           text-[2rem] sm:text-[2.8rem] lg:text-[3.2rem] mb-5">
              La persona adecuada, en el lugar correcto, en el momento exacto.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Ubyca funciona en cualquier industria donde la ubicación física sea relevante.
              Elige tu contexto y descubre cómo se aplica.
            </p>
          </Reveal>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </section>

      {/* Industries grid */}
      <section className="py-14 sm:py-20 px-5 bg-[#050810]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((industry, i) => (
              <IndustryCard key={industry.slug} industry={industry} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider callout */}
      <section className="py-12 px-5 bg-[#050810]">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-7 py-7
                            flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-brand-400 mb-2">
                  ¿No ves tu industria?
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Ubyca se adapta a cualquier caso de uso donde la ubicación física importe.
                  Hablemos de tu contexto específico.
                </p>
              </div>
              <a
                href="/contact"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl
                           bg-white/[0.06] hover:bg-white/[0.10] border border-white/10
                           text-white font-semibold text-sm transition-all duration-150
                           active:scale-[0.98] whitespace-nowrap"
              >
                Hablar con el equipo
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTASection />
      <SiteFooter />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Reveal, SectionLabel } from '../../components/landing/LandingPrimitives'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'
import FinalCTASection from './FinalCTASection'
import { getIndustry, type IndustryData, type FAQItem } from './solutionsData'

// ─── Intro ────────────────────────────────────────────────────────────────────

function IntroSection({ data }: { data: IndustryData }) {
  return (
    <section className="pt-24 pb-14 sm:pb-20 px-5 bg-[#050810]">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-5">
            {data.intro.headline}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            {data.intro.body}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Use Cases ────────────────────────────────────────────────────────────────

function UseCasesSection({ data }: { data: IndustryData }) {
  return (
    <section className="py-12 sm:py-16 px-5 relative"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #060d1c 50%, #050810 100%)' }}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12">
          <SectionLabel>Casos de uso</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Cómo Ubyca ayuda en {data.name}
          </h2>
        </Reveal>

        <div className="space-y-20">
          {data.useCases.map((uc, i) => {
            const isEven = i % 2 === 0
            return (
              <Reveal key={uc.category} delay={0.05}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center
                                 ${isEven ? '' : 'lg:[direction:rtl]'}`}>
                  {/* Text side */}
                  <div className={isEven ? '' : 'lg:[direction:ltr]'}>
                    <p
                      className="text-[10px] font-bold tracking-widest uppercase mb-3"
                      style={{ color: data.accentColor }}
                    >
                      {uc.category}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug mb-4">
                      {uc.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed mb-6">
                      {uc.description}
                    </p>
                    <a
                      href="https://studio.ubyca.com/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150"
                      style={{ color: data.accentColor }}
                    >
                      Ver cómo funciona
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                      </svg>
                    </a>
                  </div>

                  {/* Visual side */}
                  <div className={isEven ? '' : 'lg:[direction:ltr]'}>
                    {uc.visual}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </section>
  )
}

// ─── Benefits ─────────────────────────────────────────────────────────────────

function BenefitsSection({ data }: { data: IndustryData }) {
  return (
    <section className="py-14 sm:py-20 px-5 bg-[#050810]">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-10 sm:mb-12">
          <SectionLabel>Beneficios</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Lo que cambia cuando usas Ubyca
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {data.benefits.map((benefit, i) => (
            <Reveal key={benefit.title} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]
                              px-5 py-5 hover:border-white/[0.10] hover:bg-white/[0.04]
                              transition-all duration-200 h-full">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${data.accentColor}14`,
                    border: `1px solid ${data.accentColor}28`,
                    color: data.accentColor,
                  }}
                >
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQItem({ item, accentColor }: { item: FAQItem; accentColor: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/[0.06] last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left
                   group transition-colors duration-150"
      >
        <span className={`text-sm font-semibold leading-snug transition-colors duration-150
                         ${open ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
          {item.question}
        </span>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                     transition-all duration-200"
          style={open ? {
            backgroundColor: `${accentColor}18`,
            border: `1px solid ${accentColor}35`,
            color: accentColor,
            transform: 'rotate(45deg)',
          } : {
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgb(100,116,139)',
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="text-sm text-slate-400 leading-relaxed pb-5">
            {item.answer}
          </p>
        </motion.div>
      )}
    </div>
  )
}

function FAQSection({ data }: { data: IndustryData }) {
  return (
    <section className="py-14 sm:py-20 px-5 bg-[#050810] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-10">
          <SectionLabel>Preguntas frecuentes</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Preguntas sobre Ubyca en {data.name}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] px-6 sm:px-8">
            {data.faq.map((item, i) => (
              <FAQItem key={i} item={item} accentColor={data.accentColor} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IndustryPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = getIndustry(slug ?? '')

  useEffect(() => {
    if (data) document.title = data.meta.title
    return () => { document.title = 'Ubyca — Experiencias geolocalizadas' }
  }, [data])

  if (!data) return <Navigate to="/solutions" replace />

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <LandingNavBar />
      <IntroSection data={data} />
      <UseCasesSection data={data} />
      <BenefitsSection data={data} />
      <FAQSection data={data} />
      <FinalCTASection />
      <SiteFooter />
    </div>
  )
}

import { Reveal, SectionLabel } from '../../components/landing/LandingPrimitives'

const PILLARS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Sin aplicaciones adicionales',
    description: 'Tus usuarios no necesitan instalar nada. Ubyca funciona desde el navegador nativo del dispositivo móvil.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'API REST para desarrolladores',
    description: 'Integra presencia física en cualquier sistema con una API documentada en OpenAPI 3.1.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Analytics en tiempo real',
    description: 'Visualiza presencia, dwell time y flujos espaciales en Studio con datos actualizados en vivo.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    title: 'Integraciones con tus sistemas',
    description: 'Conecta Ubyca con tu CRM, plataforma de marketing o sistema de fidelización vía API o webhook.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
    title: 'Escalable desde el día uno',
    description: 'Desde una ubicación hasta miles. Mismo motor, misma API, sin cambios de arquitectura.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Privacidad y seguridad',
    description: 'Validación server-side. Las coordenadas del usuario se procesan en el servidor y nunca se exponen a terceros.',
  },
]

export default function WhyUbycaSection() {
  return (
    <section className="py-16 sm:py-24 px-5 bg-[#050810] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12">
          <SectionLabel>Por qué Ubyca</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Construido para producción desde el primer día
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-relaxed">
            No es un prototipo ni una demo. Es infraestructura de presencia física lista para integrar.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.06}>
              <div className="flex items-start gap-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]
                              px-5 py-5 hover:border-white/[0.10] hover:bg-white/[0.04]
                              transition-all duration-200 h-full">
                <div className="w-10 h-10 rounded-xl bg-brand-500/[0.12] border border-brand-500/20
                                flex items-center justify-center text-brand-400 flex-shrink-0">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{pillar.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </section>
  )
}

import { Reveal } from '../../components/landing/LandingPrimitives'

export default function FinalCTASection() {
  return (
    <section className="py-20 sm:py-28 px-5 bg-[#050810] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(14,165,233,0.07) 0%, transparent 70%)',
      }} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-2xl mx-auto text-center relative">
        <Reveal>
          <p className="text-[11px] font-bold tracking-widest uppercase text-brand-400 mb-5">
            Empieza hoy
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            La persona adecuada, el lugar correcto, el momento exacto.
          </h2>
          <p className="text-slate-400 leading-relaxed mb-10">
            Ubyca está disponible ahora. Configura tu primera ubicación en minutos y comienza a medir presencia física desde el primer día.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://studio.ubyca.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl
                         bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                         font-semibold text-sm transition-all duration-150
                         shadow-[0_4px_28px_rgba(2,132,199,0.45)] w-full sm:w-auto justify-center"
            >
              Comenzar gratis
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl
                         bg-white/[0.06] hover:bg-white/[0.10] active:scale-[0.98]
                         border border-white/10 text-white font-semibold text-sm
                         backdrop-blur-sm transition-all duration-150 w-full sm:w-auto justify-center"
            >
              Hablar con el equipo
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-600">
            Sin tarjeta de crédito requerida · Acceso inmediato al Studio · API disponible desde el primer día
          </p>
        </Reveal>
      </div>
    </section>
  )
}

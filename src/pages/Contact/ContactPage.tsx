import { useState } from 'react'
import { motion } from 'framer-motion'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'

// ─── Contact section ──────────────────────────────────────────────────────────

const USE_CASES_LIST = [
  'Promociones activadas por ubicación',
  'Rutas turísticas interactivas',
  'Activaciones urbanas',
  'Experiences GPS',
  'Contenido contextual',
]

function ContactSection() {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' })
  const [sent, setSent]       = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('No se pudo enviar el mensaje. Escribinos directamente a contacto@ubyca.com')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="relative bg-[#050810] overflow-hidden min-h-screen pt-28 pb-20 px-5">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 70% at 20% 40%, rgba(14,165,233,0.07) 0%, transparent 65%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 45% 55% at 85% 70%, rgba(139,92,246,0.04) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-14 xl:gap-20 lg:items-center">

          {/* ── Left: content ── */}
          <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest
                               uppercase text-brand-400 border border-brand-500/30
                               bg-brand-500/[0.08] px-3.5 py-1.5 rounded-full mb-6 block w-fit">
                Contacto
              </span>

              <h1 className="text-3xl sm:text-4xl xl:text-[2.6rem] font-black text-white
                             tracking-tight leading-[1.06] mb-5">
                Hablemos sobre<br />tu proyecto
              </h1>

              <p className="text-slate-400 text-base leading-relaxed mb-6">
                Ubyca te permite crear experiencias
                geolocalizadas donde el contenido se desbloquea en lugares reales.
              </p>

              <ul className="space-y-2.5 mb-8">
                {USE_CASES_LIST.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Respondemos en menos de 24 horas.
              </div>
            </motion.div>

          </div>

          {/* ── Right: form ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 w-full"
          >
            <div className="bg-gray-900/50 border border-white/[0.08] rounded-2xl p-7 sm:p-8
                            shadow-[0_24px_64px_rgba(0,0,0,0.4)]
                            backdrop-blur-sm">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25
                                  flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">¡Mensaje recibido!</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Gracias por escribirnos. Nos ponemos en contacto<br />en menos de 24 horas.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', company: '', email: '', message: '' }) }}
                    className="mt-6 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-6">Envíanos un mensaje</h2>

                  {/* Nombre */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Nombre
                    </label>
                    <input
                      id="name" name="name" type="text" required
                      value={form.name} onChange={handleChange}
                      placeholder="Tu nombre"
                      className="bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14]
                                 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600
                                 focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:border-transparent
                                 transition-all duration-150"
                    />
                  </div>

                  {/* Empresa */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Empresa o proyecto
                    </label>
                    <input
                      id="company" name="company" type="text"
                      value={form.company} onChange={handleChange}
                      placeholder="¿Con quién trabajas o qué estás construyendo?"
                      className="bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14]
                                 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600
                                 focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:border-transparent
                                 transition-all duration-150"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Email
                    </label>
                    <input
                      id="email" name="email" type="email" required
                      value={form.email} onChange={handleChange}
                      placeholder="tu@email.com"
                      className="bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14]
                                 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600
                                 focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:border-transparent
                                 transition-all duration-150"
                    />
                  </div>

                  {/* Mensaje */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Cuéntanos qué quieres crear
                    </label>
                    <textarea
                      id="message" name="message" required rows={5}
                      value={form.message} onChange={handleChange}
                      placeholder="Describe tu proyecto, caso de uso o idea..."
                      className="bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14]
                                 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600
                                 focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:border-transparent
                                 transition-all duration-150 resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40
                                  rounded-xl px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-brand-600 hover:bg-brand-500 active:scale-[0.99]
                               text-white font-semibold py-3.5 rounded-xl text-sm
                               transition-all duration-150
                               disabled:opacity-50 disabled:cursor-wait
                               shadow-[0_4px_20px_rgba(2,132,199,0.35)]
                               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                               focus:ring-offset-gray-900"
                  >
                    {sending ? 'Enviando…' : 'Enviar mensaje'}
                  </button>

                  {/* Contacto directo */}
                  <div className="pt-4 border-t border-white/[0.06] text-center">
                    <p className="text-xs text-slate-600 mb-2">
                      También puedes escribirnos directamente
                    </p>
                    <a href="mailto:contacto@ubyca.com"
                      className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
                      contacto@ubyca.com
                    </a>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <LandingNavBar />
      <ContactSection />
      <SiteFooter />
    </div>
  )
}

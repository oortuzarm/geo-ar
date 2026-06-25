import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Solutions mega menu data ─────────────────────────────────────────────────

const SOLUTIONS = [
  {
    name: 'Retail',
    slug: 'retail',
    desc: 'Activa experiencias cuando el cliente entra a la tienda',
    color: '#0ea5e9',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: 'Turismo',
    slug: 'tourism',
    desc: 'Activa contenido cuando el visitante llega al destino',
    color: '#8b5cf6',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Eventos',
    slug: 'events',
    desc: 'Conecta con los asistentes durante el evento',
    color: '#10b981',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    desc: 'Activa campañas en el lugar y momento exactos',
    color: '#f97316',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    name: 'Educación',
    slug: 'education',
    desc: 'Transforma espacios en experiencias de aprendizaje',
    color: '#f59e0b',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
  },
]

// ─── Mega menu dropdown ───────────────────────────────────────────────────────

function SolutionsMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] max-w-[calc(100vw-2rem)]
                 rounded-2xl border border-white/[0.08] bg-[#080c18]/96 backdrop-blur-2xl
                 shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]
                 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600">
          Soluciones por industria
        </p>
      </div>

      {/* Grid */}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
        {SOLUTIONS.map(s => (
          <Link
            key={s.slug}
            to={`/solutions/${s.slug}`}
            onClick={onClose}
            className="group flex items-start gap-3 rounded-xl px-3 py-3
                       hover:bg-white/[0.05] transition-all duration-150"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                         transition-colors duration-150"
              style={{
                backgroundColor: `${s.color}14`,
                border: `1px solid ${s.color}28`,
                color: s.color,
              }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white
                             transition-colors duration-150 leading-none mb-1">
                {s.name}
              </p>
              <p className="text-[11px] text-slate-500 leading-snug">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
        <p className="text-[11px] text-slate-600">
          Ubyca funciona en cualquier industria donde la ubicación importe.
        </p>
        <Link
          to="/solutions"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-400
                     hover:text-brand-300 transition-colors whitespace-nowrap"
        >
          Ver todas
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

// ─── NavBar ───────────────────────────────────────────────────────────────────

const NAV_LINKS: [string, string][] = [
  ['Studio',        '/studio'],
  ['Documentación', '/docs'],
  ['Precios',       '/precios'],
  ['Contacto',      '/contact'],
]

export default function LandingNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSolutionsEnter() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setSolutionsOpen(true)
  }

  function handleSolutionsLeave() {
    hoverTimeout.current = setTimeout(() => setSolutionsOpen(false), 120)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-white/[0.06] bg-[#050810]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-11 w-auto select-none"
              draggable={false}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">

            {/* Soluciones with mega menu */}
            <div
              className="relative"
              onMouseEnter={handleSolutionsEnter}
              onMouseLeave={handleSolutionsLeave}
            >
              <button
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                            flex items-center gap-1.5 whitespace-nowrap
                            ${solutionsOpen
                              ? 'text-white bg-white/[0.07]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                onClick={() => setSolutionsOpen(v => !v)}
                aria-expanded={solutionsOpen}
              >
                Soluciones
                <svg
                  className={`w-3 h-3 transition-transform duration-150 ${solutionsOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {solutionsOpen && (
                <SolutionsMegaMenu onClose={() => setSolutionsOpen(false)} />
              )}
            </div>

            {NAV_LINKS.map(([label, path]) => (
              <Link
                key={path}
                to={path}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-400
                           hover:text-white hover:bg-white/5 transition-all duration-150 whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <a
              href="https://studio.ubyca.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300
                         border border-white/[0.12] hover:text-white hover:border-white/25
                         hover:bg-white/[0.05] transition-all duration-150"
            >
              Iniciar sesión
            </a>
            <a
              href="https://studio.ubyca.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                         bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                         font-semibold text-sm transition-all duration-150
                         shadow-[0_4px_20px_rgba(2,132,199,0.35)]"
            >
              Comienza gratis
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg
                       text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#050810]/98 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 space-y-1">

          {/* Soluciones expandable */}
          <button
            onClick={() => setMobileSolutionsOpen(v => !v)}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium
                       text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>Soluciones</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-150 ${mobileSolutionsOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {mobileSolutionsOpen && (
            <div className="ml-3 pl-3 border-l border-white/[0.06] space-y-0.5">
              {SOLUTIONS.map(s => (
                <Link
                  key={s.slug}
                  to={`/solutions/${s.slug}`}
                  onClick={() => { setMobileOpen(false); setMobileSolutionsOpen(false) }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg
                             text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name}
                </Link>
              ))}
              <Link
                to="/solutions"
                onClick={() => { setMobileOpen(false); setMobileSolutionsOpen(false) }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                           text-brand-400 hover:text-brand-300 transition-colors"
              >
                Ver todas las soluciones →
              </Link>
            </div>
          )}

          {NAV_LINKS.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                         text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {label}
            </Link>
          ))}

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="https://studio.ubyca.com/register"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full py-3 rounded-xl
                         bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm
                         transition-colors"
            >
              Comienza gratis
            </a>
            <a
              href="https://studio.ubyca.com/login"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full py-2.5 rounded-xl
                         border border-white/[0.12] text-slate-300 hover:text-white
                         font-medium text-sm transition-colors"
            >
              Iniciar sesión
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

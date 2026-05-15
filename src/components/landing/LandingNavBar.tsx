import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const NAV_LINKS: [string, string][] = [
  ['Cómo funciona', 'v2-how'],
  ['Casos de uso',  'v2-cases'],
  ['Analytics',     'v2-concept'],
]

export default function LandingNavBar() {
  const [open, setOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  function handleNavLink(sectionId: string) {
    setOpen(false)
    if (location.pathname === '/') {
      // Already on landing — scroll directly
      setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else {
      // Navigate to landing and let its useEffect handle the hash scroll
      navigate({ pathname: '/', hash: `#${sectionId}` })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-white/[0.06] bg-[#050810]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-11 w-auto select-none"
              draggable={false}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(([label, id]) => (
              <button
                key={id}
                onClick={() => handleNavLink(id)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400
                           hover:text-white hover:bg-white/5 transition-all duration-150"
              >
                {label}
              </button>
            ))}
          </nav>

          <a
            href="https://www.ubyca.com/contact/"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                       font-semibold text-sm transition-all duration-150
                       shadow-[0_4px_20px_rgba(2,132,199,0.35)]"
          >
            Hablemos
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg
                       text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#050810]/96 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 space-y-1">
          {NAV_LINKS.map(([label, id]) => (
            <button
              key={id}
              onClick={() => handleNavLink(id)}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                         text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {label}
            </button>
          ))}
          <div className="pt-2">
            <a
              href="https://www.ubyca.com/contact/"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                         bg-brand-600 text-white font-semibold text-sm"
            >
              Hablemos →
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

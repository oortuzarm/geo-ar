import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DocsContext, DocContent, Sidebar } from './developerDocsContent'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'

interface Props {
  basePath: string
  isPublic: boolean
}

// Hash routes from old LandingDevelopersPage → new deep-link paths
const HASH_REDIRECT: Record<string, string> = {
  authentication: 'authentication',
  quickstart:     'quickstart',
  scopes:         'scopes',
  endpoints:      'resources/presence/overview',
  openapi:        'overview',
}

export default function DeveloperDocsLayout({ basePath, isPublic }: Props) {
  const { '*': wildcard = '' } = useParams()
  const section = wildcard || 'overview'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && HASH_REDIRECT[hash]) {
      navigate(`${basePath}/${HASH_REDIRECT[hash]}`, { replace: true })
    }
  }, [basePath, navigate])

  useEffect(() => { setDrawerOpen(false) }, [section])

  // ── Public layout ───────────────────────────────────────────────────────────

  if (isPublic) {
    return (
      <DocsContext.Provider value={{ basePath, isPublic }}>
        {/* Site-wide fixed nav — same as the rest of the landing site */}
        <LandingNavBar />

        {/* Push page content below the fixed nav (h-16 = 64px) */}
        <div className="flex flex-col bg-gray-950 text-gray-100 min-h-screen pt-16">

          {/* Mobile: docs-section menu trigger (separate from site nav) */}
          <div className="md:hidden flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.05] bg-gray-950">
            <button
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-colors"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir navegación de documentación"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xs text-gray-500">API Reference</span>
          </div>

          {/* Mobile drawer overlay */}
          {drawerOpen && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
              <div className="relative w-64 bg-gray-950 border-r border-white/[0.07] overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                  <span className="text-xs font-semibold text-gray-400">Documentación</span>
                  <button onClick={() => setDrawerOpen(false)} className="text-gray-600 hover:text-gray-300 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <Sidebar current={section} onNavigate={() => setDrawerOpen(false)} />
              </div>
            </div>
          )}

          {/* Docs body */}
          <div className="flex flex-1 min-h-0">

            {/* Desktop sidebar — sticky below fixed LandingNavBar */}
            <aside className="hidden md:flex w-56 flex-shrink-0 border-r border-white/[0.06] overflow-y-auto sticky top-16 self-start max-h-[calc(100vh-64px)]">
              <Sidebar current={section} />
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0 overflow-x-hidden">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <DocContent section={section} />
              </div>
            </main>

          </div>

          {/* Site-wide footer — same as the rest of the landing site */}
          <SiteFooter />
        </div>
      </DocsContext.Provider>
    )
  }

  // ── Private layout (Studio /app/developers/*) ───────────────────────────────

  return (
    <DocsContext.Provider value={{ basePath, isPublic }}>
      <div className="flex flex-col min-h-full bg-gray-950 text-gray-100">

        {/* Internal docs header */}
        <header className="h-12 flex items-center gap-3 px-4 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-sm sticky top-0 z-20">
          <button
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800/60"
            onClick={() => setDrawerOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-200">API Documentation</span>
          <span className="ml-auto text-[10px] font-mono text-gray-600 border border-gray-800 rounded px-1.5 py-0.5">v1</span>
        </header>

        {/* Mobile drawer overlay */}
        {drawerOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
            <div className="relative w-64 bg-gray-950 border-r border-white/[0.07] overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                <span className="text-xs font-semibold text-gray-400">Navigation</span>
                <button onClick={() => setDrawerOpen(false)} className="text-gray-600 hover:text-gray-300 p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Sidebar current={section} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex flex-1 min-h-0">

          {/* Desktop sidebar */}
          <aside className="hidden md:flex w-52 flex-shrink-0 border-r border-white/[0.06] overflow-y-auto sticky top-12 self-start max-h-[calc(100vh-48px)]">
            <Sidebar current={section} />
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 overflow-x-hidden">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
              <DocContent section={section} />
            </div>
          </main>

        </div>
      </div>
    </DocsContext.Provider>
  )
}

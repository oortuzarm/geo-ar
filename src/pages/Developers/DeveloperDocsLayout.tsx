import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DocsContext, DocContent, Sidebar } from './developerDocsContent'

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

  // Backwards compat: redirect old hash routes (e.g., /docs#authentication → /docs/authentication)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && HASH_REDIRECT[hash]) {
      navigate(`${basePath}/${HASH_REDIRECT[hash]}`, { replace: true })
    }
  }, [basePath, navigate])

  // Close drawer on section change (mobile)
  useEffect(() => { setDrawerOpen(false) }, [section])

  return (
    <DocsContext.Provider value={{ basePath, isPublic }}>
      <div className={`flex flex-col bg-gray-950 text-gray-100 ${isPublic ? 'min-h-screen' : 'min-h-full'}`}>

        {/* Public top bar */}
        {isPublic && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-sm sticky top-0 z-30">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-100">Ubyca</span>
              <span className="text-xs text-gray-600 border-l border-gray-700 pl-2.5">API Docs</span>
            </a>
            <a
              href="https://studio.ubyca.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors"
            >
              Open Studio
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Internal (Studio) top bar */}
        {!isPublic && (
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
        )}

        {/* Mobile hamburger (public) */}
        {isPublic && (
          <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-white/[0.05]">
            <button
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800/60"
              onClick={() => setDrawerOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xs text-gray-500">Menu</span>
          </div>
        )}

        {/* Main layout */}
        <div className="flex flex-1 min-h-0">

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

          {/* Desktop sidebar */}
          <aside className="hidden md:block w-52 flex-shrink-0 border-r border-white/[0.06] overflow-y-auto sticky top-12 self-start max-h-[calc(100vh-48px)]">
            <Sidebar current={section} />
          </aside>

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-10">
              <DocContent section={section} />
            </div>
          </main>

        </div>
      </div>
    </DocsContext.Provider>
  )
}

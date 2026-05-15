import { Link } from 'react-router-dom'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050810] text-white">

      {/* Top bar — misma estructura que NavBar de la landing */}
      <header className="sticky top-0 left-0 right-0 z-50">
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
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 py-14 md:py-20">

        {/* Page header */}
        <div className="mb-12 md:mb-16 pb-8 border-b border-white/[0.06]">
          <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-4">
            {lastUpdated}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {title}
          </h1>
        </div>

        {/* Legal content */}
        <div className="space-y-10 md:space-y-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#050810] mt-16 py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <Link to="/">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-5 w-auto select-none opacity-60"
              draggable={false}
            />
          </Link>
          <p className="text-xs text-slate-700 order-last sm:order-none">
            © 2025 Ubyca · Experiencias GPS
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/terms_and_conditions"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Términos y Condiciones
            </Link>
            <Link
              to="/privacy_policy"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Política de Privacidad
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

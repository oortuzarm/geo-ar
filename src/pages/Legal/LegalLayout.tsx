import { Link } from 'react-router-dom'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050810] text-white">

      {/* Top bar */}
      <header className="border-b border-white/[0.06] px-5 py-5 sticky top-0 z-50 bg-[#050810]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link to="/">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-6 w-auto select-none"
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

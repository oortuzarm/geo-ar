import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050810] py-10 px-5">
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
          ©2026 - Ubyca | Todos los derechos reservados
        </p>
        <div className="flex items-center gap-5">
          <Link
            to="/precios"
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Precios
          </Link>
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
  )
}

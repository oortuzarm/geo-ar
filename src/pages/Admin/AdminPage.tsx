import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function AdminPage() {
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-100 text-sm">Ubyca Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors px-3 py-1.5
                         border border-gray-700 hover:border-gray-600 rounded-lg"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800
                          border border-gray-700 rounded-2xl mb-6">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Panel administrador</h1>
          <p className="text-gray-400 leading-relaxed">
            Próximamente podrás gestionar usuarios, proyectos y métricas globales.
          </p>
          <button
            onClick={() => navigate('/app')}
            className="mt-8 text-sm text-brand-400 hover:text-brand-300 transition-colors font-medium"
          >
            ← Ir al dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

// Single source of truth for the demo point cap.
// ProjectEditor and TryPage both import from here — never define DEMO_LIMIT elsewhere.
export const DEMO_LIMIT = 10


export default function DemoLimitModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25
                        flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Límite de la demo alcanzado</h2>
        <p className="text-sm text-gray-400 mb-5 leading-relaxed">
          La demo permite hasta {DEMO_LIMIT} ubicaciones. Crea una cuenta gratuita para agregar
          más puntos GPS y guardar tu experiencia de forma permanente.
        </p>
        <button
          type="button"
          onClick={() => { window.open('/register', '_blank', 'noopener,noreferrer'); onClose() }}
          className="block w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white text-sm
                     font-semibold rounded-lg transition-colors text-center mb-2"
        >
          Crear cuenta gratuita
        </button>
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm
                     font-medium rounded-lg transition-colors"
        >
          Continuar explorando
        </button>
      </div>
    </div>
  )
}

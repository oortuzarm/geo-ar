import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface UpgradeModalProps {
  onClose: () => void
  reason?: 'limit' | 'expired' | 'general' | 'feature'
}

const COPY: Record<NonNullable<UpgradeModalProps['reason']>, { title: string; body: string }> = {
  limit: {
    title: 'Límite de ubicaciones alcanzado',
    body:  'Alcanzaste el límite de ubicaciones de tu plan. Actualiza para agregar más.',
  },
  expired: {
    title: 'Tu período de prueba venció',
    body:  'Para continuar usando Ubyca necesitás activar un plan.',
  },
  general: {
    title: 'Actualizar plan',
    body:  'Actualiza tu plan para acceder a más funciones y ubicaciones.',
  },
  feature: {
    title: 'Mejora tu plan',
    body:  'Mejora tu plan para acceder a esta función.',
  },
}

export default function UpgradeModal({ onClose, reason = 'general' }: UpgradeModalProps) {
  const { title, body } = COPY[reason]
  const navigate = useNavigate()

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl
                      shadow-2xl p-6 space-y-5">

        {/* Icon + close */}
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-brand-500/15 border border-brand-500/25
                          flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-300 transition-colors -mt-1 -mr-1 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Text */}
        <div>
          <h3 className="text-base font-semibold text-gray-100">{title}</h3>
          <p className="text-sm text-gray-400 mt-1 leading-relaxed">{body}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { onClose(); navigate('/app/plans') }}
            className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm
                       font-medium rounded-lg transition-colors"
          >
            Ver planes
          </button>
          <a
            href="https://www.ubyca.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm
                       font-medium rounded-lg transition-colors text-center block"
          >
            Hablar con nosotros
          </a>
        </div>
      </div>
    </div>
  )
}

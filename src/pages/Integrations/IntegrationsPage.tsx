import { useState } from 'react'
import { useGeoStore } from '../../store/geoStore'

const MOCK_API_KEY = 'ubk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const BASE_ENDPOINT = 'https://api.ubyca.com/v1'

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900/70 border border-white/[0.07] rounded-2xl px-6 py-5 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-gray-100">{title}</h2>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
  )
}

export default function IntegrationsPage() {
  const [keyVisible, setKeyVisible] = useState(false)
  const addToast = useGeoStore((s) => s.addToast)

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      addToast(`${label} copiado`, 'success')
    }).catch(() => {
      addToast('No se pudo copiar', 'error')
    })
  }

  return (
    <div className="text-gray-100 min-h-full">

      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-3">
          <img src="/logo-mark.png" alt="" className="h-7 w-auto md:hidden" draggable={false} />
          <h1 className="hidden md:block text-sm font-semibold text-gray-100">Integraciones</h1>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">

        {/* Page title */}
        <div>
          <h2 className="text-lg font-semibold text-gray-100">Integraciones</h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Conecta Ubyca a sitios web, aplicaciones móviles, códigos QR y sistemas propios mediante API.
          </p>
        </div>

        {/* ── API Key ──────────────────────────────────────────────────────── */}
        <Card>
          <SectionHeader
            title="API Key"
            description="Usa esta clave para autenticar tus peticiones a la API de Ubyca."
          />

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-gray-800 border border-gray-700/50 rounded-lg px-3 py-2.5
                            font-mono text-sm text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap
                            select-all">
              {keyVisible ? MOCK_API_KEY : '•'.repeat(36)}
            </div>
            <button
              onClick={() => setKeyVisible(v => !v)}
              className="px-3 py-2.5 rounded-lg text-sm border border-gray-700/50
                         text-gray-400 hover:text-gray-200 hover:bg-gray-800
                         transition-all duration-150 flex-shrink-0"
            >
              {keyVisible ? 'Ocultar' : 'Ver'}
            </button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Activa
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(MOCK_API_KEY, 'API Key')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700/50
                           text-gray-300 hover:text-gray-100 hover:bg-gray-800
                           transition-all duration-150"
              >
                Copiar
              </button>
              <button
                onClick={() => addToast('Función disponible próximamente', 'info')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700/50
                           text-gray-400 hover:text-gray-200 hover:bg-gray-800/60
                           transition-all duration-150"
              >
                Regenerar
              </button>
            </div>
          </div>
        </Card>

        {/* ── Endpoint base ─────────────────────────────────────────────────── */}
        <Card>
          <SectionHeader
            title="Endpoint base"
            description="URL raíz para todas las peticiones a la API de Ubyca."
          />
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-800 border border-gray-700/50 rounded-lg px-3 py-2.5
                            font-mono text-sm text-gray-300 select-all">
              {BASE_ENDPOINT}
            </div>
            <button
              onClick={() => copyToClipboard(BASE_ENDPOINT, 'Endpoint')}
              className="px-3 py-2.5 rounded-lg text-sm border border-gray-700/50
                         text-gray-400 hover:text-gray-200 hover:bg-gray-800
                         transition-all duration-150 flex-shrink-0"
            >
              Copiar
            </button>
          </div>
        </Card>

        {/* ── Estado del plan ───────────────────────────────────────────────── */}
        <Card>
          <SectionHeader
            title="Estado del plan"
            description="Uso de la API según tu plan actual."
          />
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-500">API incluida</dt>
              <dd className="text-sm font-medium text-gray-200">Sí</dd>
            </div>
            <div className="border-t border-white/[0.05]" />
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-500">Límite mensual</dt>
              <dd className="text-sm font-medium text-gray-200">100.000 validaciones</dd>
            </div>
            <div className="border-t border-white/[0.05]" />
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-500">Consumidas este mes</dt>
              <dd className="text-sm font-medium text-gray-200">0</dd>
            </div>
          </dl>
        </Card>

        {/* ── Documentación ─────────────────────────────────────────────────── */}
        <Card>
          <SectionHeader title="Documentación" />
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Usa la API de Ubyca para validar si un usuario está dentro de una ubicación, consultar
            reglas de acceso y desbloquear contenido desde sistemas externos.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       border border-gray-700/50 text-gray-500 opacity-50 cursor-not-allowed"
          >
            Ver documentación
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </Card>

      </div>
    </div>
  )
}

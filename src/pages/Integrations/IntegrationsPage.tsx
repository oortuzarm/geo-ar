import { useState } from 'react'
import { useGeoStore } from '../../store/geoStore'
import { useWorkspaceStore } from '../../store/workspaceStore'

const MOCK_API_KEY  = 'ubk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const BASE_ENDPOINT = 'https://api.ubyca.com/v1'

function buildIframeCode(projectId: string) {
  return [
    `<iframe`,
    `  src="${window.location.origin}/embed/${projectId}"`,
    `  width="100%"`,
    `  height="600"`,
    `  style="border:0;border-radius:16px;overflow:hidden;"`,
    `  allow="geolocation"`,
    `  allowfullscreen`,
    `></iframe>`,
  ].join('\n')
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900/70 border border-white/[0.07] rounded-2xl px-6 py-5 ${className}`}>
      {children}
    </div>
  )
}

// ── Card 1: Sitio web ─────────────────────────────────────────────────────────

function WebsiteCard() {
  const [copied, setCopied] = useState(false)
  const project = useWorkspaceStore((s) => s.project)

  const iframeCode = project ? buildIframeCode(project.id) : ''

  async function handleCopy() {
    if (!project) return
    try { await navigator.clipboard.writeText(iframeCode) }
    catch {
      const ta = document.createElement('textarea')
      ta.value = iframeCode
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus(); ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-100">Sitio web</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Inserta tu mapa interactivo en cualquier sitio web mediante un iframe.
        </p>
      </div>

      {!project ? (
        <p className="text-sm text-gray-600 py-2">
          Carga un workspace para ver el código de integración.
        </p>
      ) : (
        <>
          <textarea
            readOnly
            value={iframeCode}
            rows={8}
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3
                       text-xs font-mono text-gray-300 resize-none focus:outline-none
                       focus:ring-1 focus:ring-brand-500 leading-relaxed mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold',
                'transition-all duration-150 focus:outline-none focus:ring-2',
                'focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-900',
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-brand-600 hover:bg-brand-500 text-white',
              ].join(' ')}
            >
              {copied ? (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar código
                </>
              )}
            </button>
            <button
              onClick={() => window.open(`${window.location.origin}/embed/${project.id}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                         bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-gray-600
                         focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir preview
            </button>
          </div>
        </>
      )}
    </Card>
  )
}

// ── Card 2: API de Ubyca ──────────────────────────────────────────────────────

function ApiCard() {
  const [keyVisible, setKeyVisible] = useState(false)
  const addToast = useGeoStore((s) => s.addToast)

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
      .then(() => addToast(`${label} copiado`, 'success'))
      .catch(() => addToast('No se pudo copiar', 'error'))
  }

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-100">API de Ubyca</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Conecta aplicaciones móviles, sitios web, códigos QR y sistemas propios mediante la API de Ubyca.
        </p>
      </div>

      <div className="space-y-5 divide-y divide-white/[0.05]">

        {/* A: API Key */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">API Key</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-gray-800 border border-gray-700/50 rounded-lg px-3 py-2.5
                            font-mono text-sm text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
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
        </div>

        {/* B: Endpoint base */}
        <div className="pt-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Endpoint base</p>
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
        </div>

        {/* C: Estado del plan */}
        <div className="pt-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Estado del plan</p>
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
        </div>

        {/* D: Documentación */}
        <div className="pt-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Documentación</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Usa la API de Ubyca para validar si un usuario está dentro de una ubicación, consultar
            reglas de acceso y desbloquear contenido desde sistemas externos.
          </p>
          <button
            onClick={() => addToast('Documentación disponible próximamente', 'info')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       border border-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-800/60
                       transition-all duration-150"
          >
            Ver documentación
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>

      </div>
    </Card>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
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

        <div>
          <h2 className="text-lg font-semibold text-gray-100">Integraciones</h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Conecta Ubyca a sitios web, aplicaciones móviles, códigos QR y sistemas propios mediante API.
          </p>
        </div>

        <WebsiteCard />
        <ApiCard />

      </div>
    </div>
  )
}

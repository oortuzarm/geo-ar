import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import Spinner from '../../components/ui/Spinner'
import type { GeoPoint } from '../../types'

interface GeoPointShareModalProps {
  point:     GeoPoint
  projectId: string
  isOpen:    boolean
  onClose:   () => void
}

function toFileStem(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '') || 'ubicacion'
}

export default function GeoPointShareModal({
  point, projectId, isOpen, onClose,
}: GeoPointShareModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrError,   setQrError]   = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [copied,    setCopied]    = useState(false)

  const publicUrl = `${window.location.origin}/public/${projectId}?point=${point.id}`
  const stem      = toFileStem(point.name)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    setQrError(false)
    setQrDataUrl(null)
    setCopied(false)
    QRCode.toDataURL(publicUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
    })
      .then((url) => { setQrDataUrl(url) })
      .catch(() => { setQrError(true) })
      .finally(() => { setLoading(false) })
  }, [isOpen, publicUrl])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  function handleCopy() {
    void navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function downloadPng() {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `${stem}-qr.png`
    a.click()
  }

  async function downloadSvg() {
    try {
      const svgString = await QRCode.toString(publicUrl, { type: 'svg', width: 512, margin: 2 })
      const blob      = new Blob([svgString], { type: 'image/svg+xml' })
      const objectUrl = URL.createObjectURL(blob)
      const a         = document.createElement('a')
      a.href     = objectUrl
      a.download = `${stem}-qr.svg`
      a.click()
      URL.revokeObjectURL(objectUrl)
    } catch { /* non-critical */ }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl
                      w-full max-w-xs flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-sm font-semibold text-gray-100">Compartir ubicación</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{point.name}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg
                       text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-5 flex flex-col gap-4">

          {/* URL */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              URL pública
            </p>
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <span className="flex-1 text-[11px] text-gray-300 truncate font-mono">{publicUrl}</span>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 text-xs font-medium px-2 py-1 rounded
                           bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white
                           transition-colors min-w-[52px] text-center"
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* QR */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Código QR
            </p>
            <div className="bg-white rounded-xl p-4 shadow-md w-full flex items-center justify-center">
              {loading && (
                <div className="w-[200px] h-[200px] flex items-center justify-center">
                  <Spinner size="md" />
                </div>
              )}
              {!loading && qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR código público"
                  className="w-full max-w-[220px] h-auto block mx-auto"
                  draggable={false}
                />
              )}
              {!loading && qrError && (
                <div className="w-[200px] h-[200px] flex flex-col items-center justify-center gap-2">
                  <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-400">No se pudo generar el QR</span>
                </div>
              )}
            </div>
          </div>

          {/* Download */}
          {qrDataUrl && (
            <div className="flex gap-2">
              <button
                onClick={downloadPng}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2
                           text-xs font-medium text-gray-300
                           bg-gray-800 border border-gray-700 rounded-lg
                           hover:bg-gray-700 hover:text-gray-100 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar PNG
              </button>
              <button
                onClick={() => { void downloadSvg() }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2
                           text-xs font-medium text-gray-300
                           bg-gray-800 border border-gray-700 rounded-lg
                           hover:bg-gray-700 hover:text-gray-100 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar SVG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import Spinner from '../../components/ui/Spinner'

interface PreviewQRModalProps {
  projectId: string
  projectTitle?: string
  isOpen: boolean
  onClose: () => void
  /** When true, shows a 30-minute expiration note — for temporary/demo previews */
  temporaryNote?: boolean
}

function toFileStem(title: string | undefined): string {
  const base = (title ?? '').trim() || 'proyecto'
  return base
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '') || 'proyecto'
}

export default function PreviewQRModal({ projectId, projectTitle, isOpen, onClose, temporaryNote = false }: PreviewQRModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrError, setQrError] = useState(false)
  const [loading, setLoading] = useState(false)

  const publicUrl = `${window.location.origin}/public/${projectId}`

  // Generate QR each time the modal opens
  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    setQrError(false)
    setQrDataUrl(null)
    QRCode.toDataURL(publicUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
    })
      .then((url) => { setQrDataUrl(url) })
      .catch(() => { setQrError(true) })
      .finally(() => { setLoading(false) })
  }, [isOpen, publicUrl])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const stem = toFileStem(projectTitle)

  function downloadPng() {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `${stem}-qr.png`
    a.click()
  }

  async function downloadSvg() {
    try {
      const svgString = await QRCode.toString(publicUrl, {
        type: 'svg',
        width: 512,
        margin: 2,
      })
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `${stem}-qr.svg`
      a.click()
      URL.revokeObjectURL(objectUrl)
    } catch { /* non-critical */ }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl
                      w-full max-w-xs flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <h2 className="text-sm font-semibold text-gray-100">Previsualizar experiencia</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pt-3 pb-5 flex flex-col items-center gap-5">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Escanea el código QR para abrir la vista pública en tu teléfono.
          </p>

          {/* QR — white background for scannability */}
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
              <div className="w-[200px] h-[200px] flex flex-col items-center justify-center gap-2 text-gray-400">
                <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">No se pudo generar el QR</span>
              </div>
            )}
          </div>

          {/* Download buttons */}
          {qrDataUrl && (
            <div className="flex gap-2 w-full">
              <button
                onClick={downloadPng}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2
                           text-xs font-medium text-gray-300
                           bg-gray-800 border border-gray-700 rounded-lg
                           hover:bg-gray-700 hover:text-gray-100
                           transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PNG
              </button>
              <button
                onClick={() => { void downloadSvg() }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2
                           text-xs font-medium text-gray-300
                           bg-gray-800 border border-gray-700 rounded-lg
                           hover:bg-gray-700 hover:text-gray-100
                           transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                SVG
              </button>
            </div>
          )}

          {/* Temporary preview note — shown only for demo/guest projects */}
          {temporaryNote && (
            <p className="text-[11px] text-gray-600 text-center leading-relaxed">
              Link temporal · válido por 30 minutos
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

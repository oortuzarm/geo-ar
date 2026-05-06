import { useEffect, useState } from 'react'

interface ShareModalProps {
  url: string
  title: string
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ url, title, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => { if (!isOpen) setCopied(false) }, [isOpen])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  if (!isOpen) return null

  const encodedUrl     = encodeURIComponent(url)
  const shareMessage   = `Echa un vistazo a esta experiencia geolocalizada: ${title}`
  const encodedText    = encodeURIComponent(shareMessage)
  const encodedSubject = encodeURIComponent(title)
  const encodedBody    = encodeURIComponent(`${shareMessage}\n\n${url}`)

  const socials = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${shareMessage}\n${url}`)}`,
      bg: 'bg-[#25D366]',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      label: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      bg: 'bg-[#1DA1F2]',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.627L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: 'bg-[#1877F2]',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: 'Mail',
      href: `mailto:?subject=${encodedSubject}&body=${encodedBody}`,
      bg: 'bg-gray-600',
      mailto: true,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel — dark, compact, no title */}
      <div className="relative bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl w-full max-w-xs">

        {/* Close button — top right only */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg
                     text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors z-10"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Social icons — large circles, no labels */}
        <div className="flex items-center justify-around px-6 pt-7 pb-5">
          {socials.map((s) =>
            s.mailto ? (
              <button
                key={s.label}
                title={s.label}
                onClick={() => { window.location.href = s.href }}
                className={`w-14 h-14 rounded-full flex items-center justify-center
                            text-white hover:opacity-80 active:scale-95 transition-all ${s.bg}`}
              >
                {s.icon}
              </button>
            ) : (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className={`w-14 h-14 rounded-full flex items-center justify-center
                            text-white hover:opacity-80 active:scale-95 transition-all ${s.bg}`}
              >
                {s.icon}
              </a>
            )
          )}
        </div>

        {/* URL + Copy */}
        <div className="flex items-center gap-2 px-4 pb-5">
          <div className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 overflow-hidden">
            <span className="text-xs text-gray-400 truncate block">{url}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide
                        transition-colors ${
                          copied
                            ? 'bg-green-600 text-white'
                            : 'bg-brand-600 hover:bg-brand-500 text-white'
                        }`}
          >
            {copied ? '✓' : 'COPIAR'}
          </button>
        </div>
      </div>
    </div>
  )
}

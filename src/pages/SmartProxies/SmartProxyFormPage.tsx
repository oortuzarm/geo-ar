import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams }      from 'react-router-dom'
import Spinner                         from '../../components/ui/Spinner'
import { useGeoStore }                 from '../../store/geoStore'
import {
  getSmartProxy,
  createSmartProxy,
  updateSmartProxy,
  scanSmartProxy,
  type SmartProxy,
  type ScanResult,
} from '../../services/smartProxiesApi'

type ScanState = 'idle' | 'scanning' | 'compatible' | 'partial' | 'incompatible'

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  error,
  children,
}: {
  label:    string
  hint?:    string
  error?:   string | null
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-gray-600 leading-snug">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-400 leading-snug">{error}</p>
      )}
    </div>
  )
}

const inputCls = `
  w-full bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl
  px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600
  focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent
  transition-colors
`.trim()

// ── Compatibility Panel ───────────────────────────────────────────────────────

function CompatibilityPanel({ state, result }: { state: ScanState; result: ScanResult | null }) {
  if (state === 'idle') return null

  if (state === 'scanning') {
    return (
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                      bg-gray-800/60 border border-gray-700/60">
        <Spinner size="sm" />
        <span className="text-xs text-gray-400">Analizando compatibilidad...</span>
      </div>
    )
  }

  if (state === 'compatible') {
    return (
      <div className="px-3.5 py-3 rounded-xl bg-emerald-950/50 border border-emerald-800/40 space-y-1">
        <p className="text-xs font-semibold text-emerald-300">✅ Compatible</p>
        <p className="text-[11px] text-emerald-400/80 leading-snug">
          Este sitio es compatible con Smart Proxy y puede utilizarse normalmente.
        </p>
      </div>
    )
  }

  if (state === 'partial') {
    const items = [...(result?.notes ?? []), ...(result?.detected_risks ?? [])]
    return (
      <div className="px-3.5 py-3 rounded-xl bg-amber-950/50 border border-amber-800/40 space-y-2">
        <p className="text-xs font-semibold text-amber-300">⚠️ Compatibilidad parcial</p>
        <p className="text-[11px] text-amber-400/80 leading-snug">
          Este sitio funciona parcialmente dentro de Smart Proxy.
          Algunas funcionalidades podrían no funcionar correctamente debido a restricciones del sitio.
        </p>
        {items.length > 0 && (
          <ul className="space-y-0.5">
            {items.map((item, i) => (
              <li key={i} className="text-[11px] text-amber-500/70 flex items-start gap-1.5">
                <span className="mt-0.5 flex-shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (state === 'incompatible') {
    const risks = result?.detected_risks ?? []
    return (
      <div className="px-3.5 py-3 rounded-xl bg-red-950/50 border border-red-800/40 space-y-2">
        <p className="text-xs font-semibold text-red-300">❌ No compatible</p>
        <p className="text-[11px] text-red-400/80 leading-snug">
          Este sitio presenta restricciones importantes y podría no funcionar correctamente dentro
          de Smart Proxy. Recomendamos probarlo antes de compartirlo con usuarios finales.
        </p>
        {risks.length > 0 && (
          <ul className="space-y-0.5">
            {risks.map((risk, i) => (
              <li key={i} className="text-[11px] text-red-500/70 flex items-start gap-1.5">
                <span className="mt-0.5 flex-shrink-0">·</span>
                {risk}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return null
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SmartProxyFormPage() {
  const navigate     = useNavigate()
  const { id }       = useParams<{ id: string }>()
  const { addToast } = useGeoStore()
  const isEdit       = Boolean(id)

  const [name,           setName]           = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [slug,           setSlug]           = useState('')
  const [loading,        setLoading]        = useState(isEdit)
  const [saving,         setSaving]         = useState(false)
  const [errors,         setErrors]         = useState<Record<string, string>>({})
  const [proxy,          setProxy]          = useState<SmartProxy | null>(null)
  const [scanState,      setScanState]      = useState<ScanState>('idle')
  const [scanResult,     setScanResult]     = useState<ScanResult | null>(null)

  // Prevents firing a scan when the edit form pre-populates the URL field
  const skipNextScan = useRef(false)

  useEffect(() => {
    if (!isEdit || !id) return
    let cancelled = false
    setLoading(true)
    getSmartProxy(id)
      .then((p) => {
        if (cancelled) return
        setProxy(p)
        setName(p.name)
        setSlug(p.slug)
        skipNextScan.current = true
        setDestinationUrl(p.destinationUrl)
      })
      .catch(() => addToast('No se pudo cargar el Smart Proxy.', 'error'))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced compatibility scan
  useEffect(() => {
    if (skipNextScan.current) {
      skipNextScan.current = false
      return
    }

    const trimmed = destinationUrl.trim()
    if (!trimmed || !/^https?:\/\/.+/.test(trimmed)) {
      setScanState('idle')
      setScanResult(null)
      return
    }

    setScanState('scanning')
    setScanResult(null)

    let cancelled = false
    const timer = setTimeout(() => {
      scanSmartProxy(trimmed)
        .then((result) => {
          if (!cancelled) {
            setScanResult(result)
            setScanState(result.status)
          }
        })
        .catch(() => {
          if (!cancelled) setScanState('idle')
        })
    }, 700)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [destinationUrl])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'El nombre es obligatorio.'
    if (!destinationUrl.trim()) {
      errs.destinationUrl = 'La URL de destino es obligatoria.'
    } else if (!/^https?:\/\/.+/.test(destinationUrl.trim())) {
      errs.destinationUrl = 'Debe ser una URL válida que comience con http:// o https://.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (isEdit && id) {
        await updateSmartProxy(id, {
          name:            name.trim(),
          destination_url: destinationUrl.trim(),
          ...(slug.trim() ? { slug: slug.trim() } : {}),
        })
        addToast('Smart Proxy actualizado', 'success')
      } else {
        await createSmartProxy({
          name:            name.trim(),
          destination_url: destinationUrl.trim(),
          ...(slug.trim() ? { slug: slug.trim() } : {}),
        })
        addToast('Smart Proxy creado', 'success')
      }
      navigate('/app/smart-proxies')
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'No se pudo guardar.'
      addToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  const isScanning = scanState === 'scanning'

  return (
    <div className="text-gray-100 min-h-full">
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20 hidden md:block">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/app/smart-proxies')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ←
          </button>
          <h1 className="text-base font-semibold text-gray-100">
            {isEdit ? `Editar: ${proxy?.name ?? ''}` : 'Nuevo Smart Proxy'}
          </h1>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 md:px-6 py-6">
        {/* Mobile header */}
        <div className="flex items-center gap-3 mb-6 md:hidden">
          <button
            onClick={() => navigate('/app/smart-proxies')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-100">
            {isEdit ? 'Editar Smart Proxy' : 'Nuevo Smart Proxy'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Nombre" error={errors.name}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mi sitio web proxificado"
              className={inputCls}
              autoFocus
            />
          </Field>

          {/* URL field + compatibility panel */}
          <div className="space-y-2">
            <Field
              label="URL de destino"
              hint={scanState === 'idle' ? 'La URL original del sitio que querés proxificar.' : undefined}
              error={errors.destinationUrl}
            >
              <input
                type="url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://www.ejemplo.com"
                className={inputCls}
              />
            </Field>
            <CompatibilityPanel state={scanState} result={scanResult} />
          </div>

          <Field
            label="Slug personalizado (opcional)"
            hint="Identificador en la URL. Si lo dejás vacío se genera automáticamente."
          >
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="mi-sitio"
              className={inputCls}
            />
          </Field>

          {isEdit && (
            <div className="rounded-xl bg-gray-800/50 border border-gray-700/60 px-4 py-3">
              <p className="text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wide">URL pública</p>
              <p className="text-xs text-gray-400 font-mono break-all">{proxy?.publicUrl}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {isEdit ? (
              /* Edit mode: always show save button, just disable while scanning */
              <button
                type="submit"
                disabled={saving || isScanning}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500
                           text-white text-sm font-semibold rounded-xl transition-all
                           active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving && <Spinner size="sm" />}
                Guardar cambios
              </button>
            ) : scanState === 'partial' || scanState === 'incompatible' ? (
              /* Partial or incompatible: warn but allow creation */
              <button
                type="submit"
                disabled={saving || isScanning}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500
                           text-white text-sm font-semibold rounded-xl transition-all
                           active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving && <Spinner size="sm" />}
                Crear igualmente
              </button>
            ) : (
              /* Idle or compatible: normal create button */
              <button
                type="submit"
                disabled={saving || isScanning}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500
                           text-white text-sm font-semibold rounded-xl transition-all
                           active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {(saving || isScanning) && <Spinner size="sm" />}
                Crear Smart Proxy
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/app/smart-proxies')}
              className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-200
                         hover:bg-gray-800 rounded-xl transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

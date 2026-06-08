import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner                    from '../../components/ui/Spinner'
import { useGeoStore }            from '../../store/geoStore'
import {
  getSmartProxy,
  createSmartProxy,
  updateSmartProxy,
  type SmartProxy,
} from '../../services/smartProxiesApi'

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SmartProxyFormPage() {
  const navigate      = useNavigate()
  const { id }        = useParams<{ id: string }>()
  const { addToast }  = useGeoStore()
  const isEdit        = Boolean(id)

  const [name,           setName]           = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [slug,           setSlug]           = useState('')
  const [loading,        setLoading]        = useState(isEdit)
  const [saving,         setSaving]         = useState(false)
  const [errors,         setErrors]         = useState<Record<string, string>>({})
  const [proxy,          setProxy]          = useState<SmartProxy | null>(null)

  useEffect(() => {
    if (!isEdit || !id) return
    let cancelled = false
    setLoading(true)
    getSmartProxy(id)
      .then((p) => {
        if (cancelled) return
        setProxy(p)
        setName(p.name)
        setDestinationUrl(p.destinationUrl)
        setSlug(p.slug)
      })
      .catch(() => addToast('No se pudo cargar el Smart Proxy.', 'error'))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

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

          <Field
            label="URL de destino"
            hint="La URL original del sitio que querés proxificar."
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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500
                         text-white text-sm font-semibold rounded-xl transition-all
                         active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && <Spinner size="sm" />}
              {isEdit ? 'Guardar cambios' : 'Crear Smart Proxy'}
            </button>
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

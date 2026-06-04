import { useEffect, useState }  from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner                    from '../../components/ui/Spinner'
import { useGeoStore }            from '../../store/geoStore'
import { ApiError }               from '../../lib/apiFetch'
import { geoProjectsApi, geoPointsApi } from '../../services'
import type { GeoProject, GeoPoint }    from '../../types'
import {
  getSmartLink,
  createSmartLink,
  updateSmartLink,
  type SmartLink,
} from '../../services/smartLinksApi'

// ── Helpers ───────────────────────────────────────────────────────────────────

const SLUG_RE = /^[a-z0-9-]+$/

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')  // strip accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, hint, error, children }: {
  label:     string
  hint?:     string
  error?:    string
  children:  React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</label>
      {children}
      {hint  && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ── Scope radio ───────────────────────────────────────────────────────────────

function ScopeOption({ value, current, onChange, title, description }: {
  value:       'project' | 'geo_points'
  current:     'project' | 'geo_points'
  onChange:    (v: 'project' | 'geo_points') => void
  title:       string
  description: string
}) {
  const active = value === current
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={[
        'flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-all w-full',
        active
          ? 'border-brand-500 bg-brand-900/30 text-brand-300'
          : 'border-gray-700 bg-gray-800/40 text-gray-400 hover:border-gray-600',
      ].join(' ')}
    >
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-[11px] opacity-80 leading-snug">{description}</span>
    </button>
  )
}

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessScreen({ link, onViewList, onEdit }: {
  link:       SmartLink
  onViewList: () => void
  onEdit:     () => void
}) {
  const { addToast } = useGeoStore()
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(link.publicUrl)
      .then(() => { setCopied(true); addToast('URL copiada', 'success'); setTimeout(() => setCopied(false), 2000) })
      .catch(() => addToast('No se pudo copiar', 'error'))
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-14 text-center space-y-6">
      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20
                      flex items-center justify-center mx-auto">
        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-100">Smart Link creado correctamente</h2>
        <p className="text-sm text-gray-400 mt-1">Ya podés usarlo en QR, WhatsApp, email y campañas.</p>
      </div>

      {/* Public URL box */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 space-y-2">
        <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">URL pública</p>
        <p className="text-sm font-mono text-brand-400 break-all">{link.publicUrl}</p>
        <button
          onClick={handleCopy}
          className={`w-full py-2 rounded-lg text-sm font-semibold transition-all
            ${copied
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-600 hover:bg-brand-500 text-white'}`}
        >
          {copied ? '✓ Copiado' : 'Copiar URL'}
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onEdit}
          className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-700
                     text-gray-300 hover:border-gray-600 hover:text-gray-100 transition-all"
        >
          Editar Smart Link
        </button>
        <button
          onClick={onViewList}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-500
                     hover:text-gray-300 transition-colors"
        >
          Volver al listado
        </button>
      </div>
    </div>
  )
}

// ── Form page ─────────────────────────────────────────────────────────────────

export default function SmartLinkFormPage() {
  const { id }        = useParams<{ id: string }>()
  const isEdit        = Boolean(id)
  const navigate      = useNavigate()
  const { addToast }  = useGeoStore()

  // ── Form state ─────────────────────────────────────────────────────────────
  const [name,           setName]           = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [scopeType,      setScopeType]      = useState<'project' | 'geo_points'>('project')
  const [slug,           setSlug]           = useState('')
  const [selectedPointIds, setSelectedPointIds] = useState<Set<string>>(new Set())
  const [selectedProjectId, setSelectedProjectId] = useState('')

  // ── Remote data ────────────────────────────────────────────────────────────
  const [projects,     setProjects]     = useState<GeoProject[]>([])
  const [points,       setPoints]       = useState<GeoPoint[]>([])
  const [loadingInit,  setLoadingInit]  = useState(true)
  const [loadingPts,   setLoadingPts]   = useState(false)

  // ── Submission ─────────────────────────────────────────────────────────────
  const [submitting,   setSubmitting]   = useState(false)
  const [formError,    setFormError]    = useState<string | null>(null)
  const [createdLink,  setCreatedLink]  = useState<SmartLink | null>(null)

  // ── Validation errors ──────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ── Load initial data ──────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      setLoadingInit(true)
      try {
        const [projectList, existingLink] = await Promise.all([
          geoProjectsApi.listProjects(),
          isEdit && id ? getSmartLink(id) : Promise.resolve(null),
        ])
        setProjects(projectList)

        if (existingLink) {
          setName(existingLink.name)
          setDestinationUrl(existingLink.destinationUrl)
          setScopeType(existingLink.scopeType)
          setSlug(existingLink.slug)
          setSelectedProjectId(existingLink.projectId)
          setSelectedPointIds(new Set(existingLink.geoPointIds))
        } else if (projectList.length > 0) {
          setSelectedProjectId(projectList[0].id)
        }
      } catch {
        setFormError('No se pudo cargar la información necesaria.')
      } finally {
        setLoadingInit(false)
      }
    }
    void init()
  }, [id, isEdit])

  // ── Load GeoPoints when project changes ────────────────────────────────────
  useEffect(() => {
    if (!selectedProjectId) { setPoints([]); return }
    let cancelled = false
    setLoadingPts(true)
    geoPointsApi.listPoints(selectedProjectId)
      .then((pts) => { if (!cancelled) setPoints(pts) })
      .catch(() => { if (!cancelled) setPoints([]) })
      .finally(() => { if (!cancelled) setLoadingPts(false) })
    return () => { cancelled = true }
  }, [selectedProjectId])

  // ── Slug auto-fill from name (only when empty) ─────────────────────────────
  function handleNameChange(value: string) {
    setName(value)
    if (!isEdit && !slug) {
      setSlug(slugify(value))
    }
  }

  // ── Toggle point selection ─────────────────────────────────────────────────
  function togglePoint(ptId: string) {
    setSelectedPointIds((prev) => {
      const next = new Set(prev)
      next.has(ptId) ? next.delete(ptId) : next.add(ptId)
      return next
    })
  }

  // ── Validate ───────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!name.trim())            e.name = 'El nombre es obligatorio.'
    if (!destinationUrl.trim())  e.destinationUrl = 'La URL destino es obligatoria.'
    else if (!/^https?:\/\/.+/.test(destinationUrl))
      e.destinationUrl = 'La URL debe comenzar con http:// o https://'
    if (!selectedProjectId)      e.project = 'Seleccioná un proyecto.'
    if (slug && !SLUG_RE.test(slug))
      e.slug = 'Solo letras minúsculas, números y guiones.'
    if (scopeType === 'geo_points' && selectedPointIds.size === 0)
      e.points = 'Seleccioná al menos una ubicación.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      if (isEdit && id) {
        const patch: Parameters<typeof updateSmartLink>[1] = {
          name:            name.trim(),
          destination_url: destinationUrl.trim(),
          scope_type:      scopeType,
          ...(slug ? { slug } : {}),
          ...(scopeType === 'geo_points' ? { geo_point_ids: [...selectedPointIds] } : {}),
        }
        await updateSmartLink(id, patch)
        addToast('Smart Link actualizado', 'success')
        navigate('/app/smart-links')
      } else {
        const result = await createSmartLink({
          name:             name.trim(),
          destination_url:  destinationUrl.trim(),
          project_id:       selectedProjectId,
          scope_type:       scopeType,
          destination_type: 'external_url',
          status:           'active',
          ...(slug ? { slug } : {}),
          ...(scopeType === 'geo_points' ? { geo_point_ids: [...selectedPointIds] } : {}),
        })
        setCreatedLink(result)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        try {
          const parsed = JSON.parse(err.message) as { error?: string }
          setFormError(parsed.error ?? 'No se pudo guardar el Smart Link.')
        } catch {
          setFormError(err.message || 'No se pudo guardar el Smart Link.')
        }
      } else {
        setFormError('No se pudo conectar con el servidor.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (createdLink) {
    return (
      <div className="text-gray-100 min-h-full">
        <SuccessScreen
          link={createdLink}
          onViewList={() => navigate('/app/smart-links')}
          onEdit={() => navigate(`/app/smart-links/${createdLink.id}/edit`)}
        />
      </div>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loadingInit) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  const title = isEdit ? 'Editar Smart Link' : 'Nuevo Smart Link'

  return (
    <div className="text-gray-100 min-h-full">
      {/* Desktop sticky header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20 hidden md:block">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/app/smart-links')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-100">{title}</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Mobile back + title */}
        <div className="flex items-center gap-2 mb-5 md:hidden">
          <button onClick={() => navigate('/app/smart-links')} className="text-gray-500 hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-100">{title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Global error */}
          {formError && (
            <div className="rounded-xl bg-red-950/40 border border-red-800/50 px-4 py-3 text-sm text-red-400">
              {formError}
            </div>
          )}

          {/* Name */}
          <Field label="Nombre" error={errors.name} hint="Ej: Cupón VIP, Campaña Invierno, Menú Digital">
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Cupón VIP"
              className={`bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-gray-100
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500
                         focus:border-transparent transition-colors
                         ${errors.name ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}`}
            />
          </Field>

          {/* Destination URL */}
          <Field label="URL destino" error={errors.destinationUrl} hint="La URL a la que redireccionará el Smart Link">
            <input
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://marca.com/cupon-vip"
              className={`bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-gray-100
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500
                         focus:border-transparent transition-colors
                         ${errors.destinationUrl ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}`}
            />
          </Field>

          {/* Project selector */}
          {!isEdit && (
            <Field label="Proyecto" error={errors.project}>
              <select
                value={selectedProjectId}
                onChange={(e) => { setSelectedProjectId(e.target.value); setSelectedPointIds(new Set()) }}
                className={`bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-brand-500
                           focus:border-transparent transition-colors
                           ${errors.project ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}`}
              >
                {projects.length === 0
                  ? <option value="">Sin proyectos disponibles</option>
                  : projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)
                }
              </select>
            </Field>
          )}

          {/* Scope */}
          <Field label="Dónde debe funcionar" error={errors.points}>
            <div className="grid grid-cols-2 gap-2">
              <ScopeOption
                value="project"
                current={scopeType}
                onChange={(v) => { setScopeType(v); setSelectedPointIds(new Set()) }}
                title="Todo el proyecto"
                description="Activo en todas las ubicaciones"
              />
              <ScopeOption
                value="geo_points"
                current={scopeType}
                onChange={setScopeType}
                title="Ubicaciones específicas"
                description="Elige qué puntos participan"
              />
            </div>

            {/* GeoPoints multi-select */}
            {scopeType === 'geo_points' && (
              <div className="mt-2 space-y-1.5">
                {loadingPts ? (
                  <div className="flex items-center gap-2 py-2 text-xs text-gray-500">
                    <Spinner size="sm" /> Cargando ubicaciones…
                  </div>
                ) : points.length === 0 ? (
                  <p className="text-xs text-gray-600 py-2">
                    {selectedProjectId ? 'Este proyecto no tiene ubicaciones.' : 'Seleccioná un proyecto primero.'}
                  </p>
                ) : (
                  <>
                    <p className="text-[11px] text-gray-500">
                      {selectedPointIds.size} de {points.length} seleccionada{points.length !== 1 ? 's' : ''}
                    </p>
                    <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                      {points.map((pt) => {
                        const checked = selectedPointIds.has(pt.id)
                        return (
                          <label
                            key={pt.id}
                            className={[
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all',
                              checked
                                ? 'border-brand-500 bg-brand-900/20'
                                : 'border-gray-700 bg-gray-800/40 hover:border-gray-600',
                            ].join(' ')}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePoint(pt.id)}
                              className="accent-brand-500 flex-shrink-0"
                            />
                            <span className="text-sm text-gray-200 truncate">{pt.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </Field>

          {/* Optional slug */}
          <Field
            label="Personaliza tu URL (opcional)"
            error={errors.slug}
            hint="Si lo dejas vacío, Ubyca generará una URL automáticamente."
          >
            <div className="flex items-center bg-gray-800 border border-gray-700 hover:border-gray-600
                            rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500
                            focus-within:border-transparent transition-colors">
              <span className="px-3 py-2.5 text-[11px] text-gray-500 border-r border-gray-700 flex-shrink-0 select-none">
                go.ubyca.com/…/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="cupon-vip"
                className="bg-transparent flex-1 px-3 py-2.5 text-sm text-gray-100
                           placeholder-gray-600 focus:outline-none"
              />
            </div>
          </Field>

          {/* Status toggle (edit only) */}
          {isEdit && (
            <Field label="Estado">
              <div className="flex gap-2">
                {(['active', 'paused'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {/* handled on save */ void 0}}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 cursor-default"
                  >
                    {s === 'active' ? '● Activo' : '● Pausado'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-600">
                Para cambiar el estado, usa el botón "Pausar / Activar" desde el listado.
              </p>
            </Field>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/app/smart-links')}
              className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-200
                         border border-gray-700 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500
                         text-white text-sm font-semibold rounded-xl transition-all
                         active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-lg shadow-brand-900/40"
            >
              {submitting && <Spinner size="sm" />}
              {isEdit ? 'Guardar cambios' : 'Crear Smart Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

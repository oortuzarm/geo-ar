import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { geoProjectsApi, geoPointsApi } from '../../services'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import type { GeoProject, GeoPoint } from '../../types'
import { formatDistance } from '../../features/geolocation/haversine'

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<GeoProject | null>(null)
  const [points, setPoints] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    Promise.all([
      geoProjectsApi.fetchProject(id),
      geoPointsApi.listPoints(id),
    ]).then(([proj, pts]) => {
      if (!proj) return
      setProject(proj)
      const active = pts.filter((p) => p.active)
      setPoints(active)
      if (active.length > 0) setSelectedPointId(active[0].id)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const selectedPoint = points.find((p) => p.id === selectedPointId)
  const publicUrl = `${window.location.origin}/public/${id}`

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/project/${id}`)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al editor
            </button>
            <div className="w-px h-5 bg-gray-700" />
            <span className="text-sm font-medium text-gray-300">Previsualización</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(publicUrl, '_blank')}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir URL pública
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        {/* Phone frame */}
        <div className="flex-shrink-0 flex justify-center">
          <div className="relative w-[320px]">
            {/* Phone shell */}
            <div className="bg-gray-900 rounded-[40px] border-4 border-gray-700 shadow-2xl overflow-hidden"
              style={{ height: 620 }}>
              {/* Status bar */}
              <div className="bg-gray-800 px-6 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1.5 bg-green-400 rounded-sm" />
                  <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zM14 5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                  </svg>
                </div>
              </div>

              {/* Simulated map */}
              <div className="relative bg-gray-700 h-56 overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,255,255,0.04) 30px, rgba(255,255,255,0.04) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.04) 30px, rgba(255,255,255,0.04) 31px)',
                  }}
                />
                {/* Point markers on simulated map */}
                {points.map((pt, i) => (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedPointId(pt.id)}
                    style={{ left: `${30 + i * 50}px`, top: `${60 + (i % 2) * 40}px` }}
                    className={[
                      'absolute w-7 h-7 rounded-full border-2 border-white flex items-center justify-center',
                      'text-white text-xs font-bold shadow-lg transition-transform',
                      pt.id === selectedPointId ? 'bg-brand-500 scale-110' : 'bg-red-500',
                    ].join(' ')}
                  >
                    {i + 1}
                  </button>
                ))}
                {/* Location dot */}
                <div className="absolute" style={{ left: 120, top: 90 }}>
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow" />
                  <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-50" />
                </div>
                {/* Distance badge */}
                {selectedPoint && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900/90
                                 border border-gray-700 rounded-full px-3 py-1 text-xs text-gray-300">
                    {selectedPoint.name} · 25 m
                  </div>
                )}
              </div>

              {/* Bottom sheet */}
              <div className="bg-gray-950 h-full overflow-y-auto">
                {/* Project info */}
                <div className="px-4 pt-3 pb-2 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    {project?.coverImage && (
                      <img src={project.coverImage} alt="" className="w-8 h-8 rounded object-cover" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-200 leading-tight">
                        {project?.title}
                      </p>
                      {project?.subtitle && (
                        <p className="text-[10px] text-gray-500">{project.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Point cards */}
                <div className="p-3 space-y-2">
                  {points.map((pt, i) => {
                    const simDist = i === 0 ? 12 : i * 150
                    const withinRadius = simDist <= pt.activationRadius
                    return (
                      <div
                        key={pt.id}
                        onClick={() => setSelectedPointId(pt.id)}
                        className={[
                          'rounded-lg border p-2.5 cursor-pointer transition-colors',
                          pt.id === selectedPointId
                            ? 'border-brand-600 bg-gray-800'
                            : 'border-gray-800 bg-gray-900/60',
                        ].join(' ')}
                      >
                        <div className="flex items-start gap-2">
                          {pt.image && (
                            <img src={pt.image} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-200 truncate">{pt.name}</p>
                            <p className={`text-[10px] mt-0.5 ${withinRadius ? 'text-green-400' : 'text-gray-500'}`}>
                              {withinRadius ? `Dentro del radio · ${formatDistance(simDist)}` : `Fuera del radio · ${formatDistance(simDist)}`}
                            </p>
                            {pt.id === selectedPointId && (
                              <button
                                disabled={!withinRadius}
                                className={[
                                  'mt-1.5 w-full text-xs font-semibold py-1.5 rounded text-white transition-colors',
                                  withinRadius
                                    ? 'bg-brand-600 hover:bg-brand-700'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed',
                                ].join(' ')}
                              >
                                {withinRadius ? 'Ir a experiencia AR' : 'Acércate al punto'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {points.length === 0 && (
                    <p className="text-xs text-gray-600 text-center py-4">
                      Sin puntos activos. Agrega puntos en el editor.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1
                           bg-gray-600 rounded-full" />
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-100">{project?.title}</h2>
            {project?.subtitle && <p className="text-gray-400 mt-1">{project.subtitle}</p>}
          </div>

          {/* URL pública */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">URL pública del proyecto</h3>
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <span className="text-sm text-brand-400 truncate flex-1">{publicUrl}</span>
              <button
                onClick={() => navigator.clipboard.writeText(publicUrl)}
                className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
                title="Copiar URL"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Points summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Puntos del proyecto ({points.length})
            </h3>
            <div className="space-y-2">
              {points.map((pt) => (
                <div key={pt.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{pt.name}</p>
                    <p className="text-xs text-gray-500">
                      Radio: {pt.activationRadius} m · {pt.latitude.toFixed(4)}, {pt.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              ))}
              {points.length === 0 && (
                <p className="text-sm text-gray-500">Sin puntos activos.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-sm text-gray-400">
            <p className="font-medium text-gray-300 mb-1">Nota sobre el anclaje AR</p>
            <p>
              La geolocalización valida el acceso y define el punto inicial. Una vez iniciada la
              experiencia, el tracking local de la cámara de Lookiar mantiene el modelo anclado
              en el espacio independientemente del GPS.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

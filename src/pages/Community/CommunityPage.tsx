import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import { getCommunityProjects, type CommunityProject } from '../../services/communityApi'
import { getMapTileUrl, MAP_ATTRIBUTION } from '../../config/mapStyles'
import Spinner from '../../components/ui/Spinner'
import { useSettingsStore } from '../../store/settingsStore'

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  selected,
  onSelect,
}: {
  project:  CommunityProject
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div
      className={[
        'p-4 cursor-pointer transition-colors',
        selected ? 'bg-brand-500/10 border-l-2 border-brand-500' : 'hover:bg-gray-900/60 border-l-2 border-transparent',
      ].join(' ')}
      onClick={onSelect}
    >
      <div className="flex gap-3">
        {project.coverImage && (
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-1 ring-white/10"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-100 line-clamp-1">{project.title}</p>
          {project.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-snug">
              {project.description}
            </p>
          )}
          <p className="text-[11px] text-gray-600 mt-1">
            {project.pointsCount} {project.pointsCount === 1 ? 'ubicación' : 'ubicaciones'}
          </p>
        </div>
      </div>
      <a
        href={project.publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-3 w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-500 active:scale-[0.98]
                   text-white font-semibold text-xs text-center block transition-all duration-150
                   shadow-md shadow-brand-900/30"
      >
        Ver experiencia
      </a>
    </div>
  )
}

// ── CommunityPage ─────────────────────────────────────────────────────────────

// ── Disabled screen ───────────────────────────────────────────────────────────

function DisabledScreen({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <a href="/" className="flex items-center">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-6 w-auto object-contain select-none"
              draggable={false}
            />
          </a>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700
                        flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-semibold text-gray-200">
            {title || 'Mapa comunitario no disponible'}
          </p>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            {description || 'Esta función no está disponible por el momento.'}
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-1 px-5 py-2.5 border border-gray-700 hover:border-gray-600
                     text-gray-400 hover:text-gray-200 font-semibold text-sm rounded-xl
                     transition-colors cursor-pointer"
        >
          Volver
        </button>
      </div>
    </div>
  )
}

// ── CommunityPage ─────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const communityMapEnabled        = useSettingsStore((s) => s.communityMapEnabled)
  const communityMapDisabledTitle  = useSettingsStore((s) => s.communityMapDisabledTitle)
  const communityMapDisabledDescription = useSettingsStore((s) => s.communityMapDisabledDescription)
  const settingsLoaded             = useSettingsStore((s) => s.isLoaded)

  const [projects,   setProjects]   = useState<CommunityProject[]>([])
  const [loading,    setLoading]    = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!settingsLoaded) return
    if (!communityMapEnabled) { setLoading(false); return }
    getCommunityProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [settingsLoaded, communityMapEnabled])

  function toggleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  if (!settingsLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!communityMapEnabled) {
    return (
      <DisabledScreen
        title={communityMapDisabledTitle}
        description={communityMapDisabledDescription}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <a href="/" className="flex items-center">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-6 w-auto object-contain select-none"
              draggable={false}
            />
          </a>
          <div className="flex-1" />
          <h1 className="text-sm font-semibold text-gray-300 hidden sm:block">
            Mapa comunitario
          </h1>
          <div className="flex-1" />
          <a
            href="/login"
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors
                       px-3 py-1.5 rounded-lg hover:bg-gray-800"
          >
            Iniciar sesión
          </a>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700
                          flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <p className="text-base font-semibold text-gray-200">
              No hay experiencias en el mapa todavía
            </p>
            <p className="text-sm text-gray-500 max-w-xs">
              Pronto aparecerán proyectos geolocalizados de la comunidad de Ubyca.
            </p>
          </div>
          <a
            href="/register"
            className="mt-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white
                       font-semibold text-sm rounded-xl transition-colors"
          >
            Crear mi experiencia
          </a>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row flex-1 min-h-0" style={{ height: 'calc(100vh - 56px)' }}>

          {/* ── Map ─────────────────────────────────────────────────────── */}
          <div className="relative h-[55vh] lg:h-auto lg:flex-1">
            <MapContainer
              center={[-38.4161, -63.6167]}
              zoom={4}
              className="absolute inset-0 w-full h-full"
              zoomControl
            >
              <TileLayer url={getMapTileUrl('streets')} attribution={MAP_ATTRIBUTION} />

              {projects.flatMap((project) =>
                project.points.map((pt) => (
                  <CircleMarker
                    key={pt.id}
                    center={[pt.latitude, pt.longitude]}
                    radius={selectedId === project.id ? 10 : 7}
                    pathOptions={{
                      color:       selectedId === project.id ? '#38bdf8' : '#60a5fa',
                      fillColor:   selectedId === project.id ? '#38bdf8' : '#3b82f6',
                      fillOpacity: 0.85,
                      weight:      selectedId === project.id ? 2.5 : 1.5,
                    }}
                    eventHandlers={{ click: () => toggleSelect(project.id) }}
                  >
                    <Tooltip direction="top" offset={[0, -6]}>
                      <span className="text-xs font-medium">{project.title}</span>
                      {pt.name !== project.title && (
                        <span className="block text-xs text-gray-500">{pt.name}</span>
                      )}
                    </Tooltip>
                  </CircleMarker>
                ))
              )}
            </MapContainer>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <div className="w-full lg:w-80 xl:w-96 bg-gray-950 border-t lg:border-t-0 lg:border-l
                          border-gray-800 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
              <p className="text-xs font-medium text-gray-400">
                {projects.length}{' '}
                {projects.length === 1 ? 'experiencia disponible' : 'experiencias disponibles'}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  selected={selectedId === project.id}
                  onSelect={() => toggleSelect(project.id)}
                />
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

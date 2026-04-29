import { useRef, useState } from 'react'
import { Input, Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useGeoStore } from '../../store/geoStore'
import type { GeoProject } from '../../types'

interface ProjectInfoPanelProps {
  onClose: () => void
  onSave: () => Promise<void>
}

export default function ProjectInfoPanel({ onClose, onSave }: ProjectInfoPanelProps) {
  const { project, updateProjectField, addToast } = useGeoStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)

  if (!project) return null

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateProjectField('coverImage', reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleField<K extends keyof GeoProject>(key: K, value: GeoProject[K]) {
    updateProjectField(key, value)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await onSave()
      addToast('Información del proyecto guardada', 'success')
    } catch {
      addToast('Error al guardar la información', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-100">Información del proyecto</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Input
          label="Título*"
          placeholder="Búsqueda del tesoro"
          value={project.title}
          onChange={(e) => handleField('title', e.target.value)}
        />
        <Input
          label="Subtítulo"
          placeholder="Frase corta para contextualizar el proyecto"
          value={project.subtitle ?? ''}
          onChange={(e) => handleField('subtitle', e.target.value)}
        />
        <Input
          label="Cómo llegar"
          placeholder="Instrucciones para el usuario"
          value={project.howToGet ?? ''}
          onChange={(e) => handleField('howToGet', e.target.value)}
        />

        {/* Cover image */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Imagen</span>
          <div
            className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center
                       hover:border-gray-600 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            {project.coverImage ? (
              <div className="relative">
                <img src={project.coverImage} alt="Cover" className="w-full h-32 object-cover rounded" />
                <button
                  className="absolute top-1 right-1 bg-black/60 text-white rounded p-0.5 text-xs"
                  onClick={(e) => { e.stopPropagation(); handleField('coverImage', undefined) }}
                >✕</button>
              </div>
            ) : (
              <>
                <svg className="h-8 w-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-500">Arrastre y suelte una imagen</p>
                <button className="mt-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded transition-colors">
                  Examinar
                </button>
                <p className="text-xs text-gray-600 mt-1">Archivo: .JPG .PNG · Máx 256 KB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleImageUpload} />
        </div>

        <Textarea
          label="Descripción"
          placeholder="Describe brevemente el proyecto o qué verá el usuario al abrir la experiencia"
          value={project.description ?? ''}
          onChange={(e) => handleField('description', e.target.value)}
          rows={4}
        />

        {/* Status */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Estado</span>
          <select
            value={project.status}
            onChange={(e) => handleField('status', e.target.value as GeoProject['status'])}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="draft">Borrador</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Save button */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-800">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          loading={saving}
          onClick={handleSave}
        >
          Guardar información del proyecto
        </Button>
      </div>
    </div>
  )
}

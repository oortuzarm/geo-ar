import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  getAdminOnboardingCategories, createAdminOnboardingCategory,
  updateAdminOnboardingCategory, deleteAdminOnboardingCategory,
  getAdminOnboardingOptions, createAdminOnboardingOption,
  updateAdminOnboardingOption, deleteAdminOnboardingOption,
  reorderAdminOnboardingOptions,
} from '../../services/onboardingApi'
import type { AdminOnboardingCategory, AdminOnboardingOption } from '../../types/onboarding.types'

// ── Types ─────────────────────────────────────────────────────────────────────

type OptionGroup = 'industry' | 'org_type' | 'org_size' | 'objective'

const GROUP_LABELS: Record<OptionGroup, string> = {
  industry:  'Industria',
  org_type:  'Tipo de organización',
  org_size:  'Tamaño',
  objective: 'Objetivo principal',
}

// ── Shared atoms ──────────────────────────────────────────────────────────────

const INPUT_CLS =
  'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 ' +
  'placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ' +
  'transition-colors w-full'

const BTN_GHOST =
  'px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-700 text-gray-400 ' +
  'hover:border-gray-600 hover:text-gray-200 transition-colors'

const BTN_PRIMARY =
  'px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold ' +
  'rounded-lg transition-colors disabled:opacity-50'

const BTN_DANGER =
  'px-3 py-1.5 text-xs font-medium rounded-lg text-red-400 hover:text-red-300 ' +
  'hover:bg-red-950/30 transition-colors'

function Badge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
      active ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'
    }`}>
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
      {action}
    </div>
  )
}

// ── Category row / form ───────────────────────────────────────────────────────

interface CategoryFormState {
  name:     string
  slug:     string
  iconName: string
  position: string
  active:   boolean
}

const emptyCatForm = (): CategoryFormState => ({
  name: '', slug: '', iconName: '', position: '0', active: true,
})

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

function CategoryEditor({
  initial, onSave, onCancel, saving,
}: {
  initial?: CategoryFormState
  onSave: (f: CategoryFormState) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<CategoryFormState>(initial ?? emptyCatForm())

  function handleNameChange(name: string) {
    setForm(f => ({
      ...f,
      name,
      slug: f.slug || toSlug(name),
    }))
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-800/40 rounded-xl border border-gray-700/60">
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 block mb-1">Nombre</label>
        <input className={INPUT_CLS} value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Turismo y gastronomía" />
      </div>
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 block mb-1">Slug</label>
        <input className={INPUT_CLS} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="tourism" />
      </div>
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 block mb-1">Ícono (emoji o texto)</label>
        <input className={INPUT_CLS} value={form.iconName} onChange={e => setForm(f => ({ ...f, iconName: e.target.value }))} placeholder="🗺️" />
      </div>
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 block mb-1">Posición</label>
        <input className={INPUT_CLS} type="number" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
      </div>
      <div className="col-span-2 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
            className="w-4 h-4 rounded text-brand-600 bg-gray-800 border-gray-600"
          />
          <span className="text-sm text-gray-400">Activo</span>
        </label>
        <div className="flex gap-2">
          <button className={BTN_GHOST} onClick={onCancel} disabled={saving}>Cancelar</button>
          <button className={BTN_PRIMARY} onClick={() => onSave(form)} disabled={saving || !form.name || !form.slug}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Option row / form ─────────────────────────────────────────────────────────

interface OptionFormState {
  group:    OptionGroup
  name:     string
  slug:     string
  position: string
  active:   boolean
}

function emptyOptForm(group: OptionGroup): OptionFormState {
  return { group, name: '', slug: '', position: '0', active: true }
}

function OptionEditor({
  group, initial, onSave, onCancel, saving,
}: {
  group: OptionGroup
  initial?: OptionFormState
  onSave: (f: OptionFormState) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<OptionFormState>(initial ?? emptyOptForm(group))

  function handleNameChange(name: string) {
    setForm(f => ({ ...f, name, slug: f.slug || toSlug(name) }))
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-3 bg-gray-800/40 rounded-xl border border-gray-700/60 mt-2">
      <div>
        <input className={INPUT_CLS} value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Nombre" />
      </div>
      <div>
        <input className={INPUT_CLS} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="slug" />
      </div>
      <div className="col-span-2 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
            className="w-4 h-4 rounded text-brand-600 bg-gray-800 border-gray-600"
          />
          <span className="text-xs text-gray-400">Activo</span>
        </label>
        <div className="flex gap-2">
          <button className={BTN_GHOST} onClick={onCancel} disabled={saving}>Cancelar</button>
          <button className={BTN_PRIMARY} onClick={() => onSave(form)} disabled={saving || !form.name || !form.slug}>
            {saving ? '…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminOnboardingPage() {
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<AdminOnboardingCategory[]>([])
  const [options,    setOptions]    = useState<AdminOnboardingOption[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  const [editingCatId,  setEditingCatId]  = useState<number | 'new' | null>(null)
  const [savingCat,     setSavingCat]     = useState(false)

  const [editingOptId,  setEditingOptId]  = useState<number | null>(null)
  const [addingOptGroup,setAddingOptGroup]= useState<OptionGroup | null>(null)
  const [savingOpt,     setSavingOpt]     = useState(false)
  const [reorderingOpt, setReorderingOpt] = useState(false)

  const [activeGroup,   setActiveGroup]   = useState<OptionGroup>('industry')

  useEffect(() => {
    if (currentUser?.role !== 'admin') { navigate('/app'); return }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [cats, opts] = await Promise.all([
        getAdminOnboardingCategories(),
        getAdminOnboardingOptions(),
      ])
      setCategories(cats)
      setOptions(opts)
    } catch {
      setError('Error al cargar datos de onboarding.')
    } finally {
      setLoading(false)
    }
  }

  // ── Categories ──────────────────────────────────────────────────────────────

  async function handleSaveCat(form: CategoryFormState, id?: number) {
    setSavingCat(true)
    try {
      const payload = {
        name:     form.name,
        slug:     form.slug,
        iconName: form.iconName || null,
        position: Number(form.position),
        active:   form.active,
      }
      if (id) {
        const updated = await updateAdminOnboardingCategory(id, payload)
        setCategories(cs => cs.map(c => c.id === id ? updated : c))
      } else {
        const created = await createAdminOnboardingCategory(payload)
        setCategories(cs => [...cs, created])
      }
      setEditingCatId(null)
    } catch {
      alert('Error al guardar la categoría.')
    } finally {
      setSavingCat(false)
    }
  }

  async function handleDeleteCat(id: number) {
    if (!confirm('¿Eliminar esta categoría?')) return
    try {
      await deleteAdminOnboardingCategory(id)
      setCategories(cs => cs.filter(c => c.id !== id))
    } catch {
      alert('Error al eliminar.')
    }
  }

  // ── Options ─────────────────────────────────────────────────────────────────

  async function handleSaveOpt(form: OptionFormState, id?: number) {
    setSavingOpt(true)
    try {
      const payload = {
        group:    form.group,
        name:     form.name,
        slug:     form.slug,
        position: Number(form.position),
        active:   form.active,
      }
      if (id) {
        const updated = await updateAdminOnboardingOption(id, payload)
        setOptions(os => os.map(o => o.id === id ? updated : o))
        setEditingOptId(null)
      } else {
        const created = await createAdminOnboardingOption(payload)
        setOptions(os => [...os, created])
        setAddingOptGroup(null)
      }
    } catch {
      alert('Error al guardar la opción.')
    } finally {
      setSavingOpt(false)
    }
  }

  async function handleDeleteOpt(id: number) {
    if (!confirm('¿Eliminar esta opción?')) return
    try {
      await deleteAdminOnboardingOption(id)
      setOptions(os => os.filter(o => o.id !== id))
    } catch {
      alert('Error al eliminar.')
    }
  }

  async function handleMoveOpt(optId: number, direction: 'up' | 'down') {
    const sorted = options
      .filter(o => o.group === activeGroup)
      .sort((a, b) => a.position - b.position)

    const idx = sorted.findIndex(o => o.id === optId)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === sorted.length - 1) return

    const swapped = [...sorted]
    const neighborIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[swapped[idx], swapped[neighborIdx]] = [swapped[neighborIdx], swapped[idx]]

    const reordered = swapped.map((o, i) => ({ ...o, position: i + 1 }))

    setOptions(os => [
      ...os.filter(o => o.group !== activeGroup),
      ...reordered,
    ])

    setReorderingOpt(true)
    try {
      await reorderAdminOnboardingOptions(reordered.map(o => o.id))
    } catch {
      load()
    } finally {
      setReorderingOpt(false)
    }
  }

  const groupedOpts = options
    .filter(o => o.group === activeGroup)
    .sort((a, b) => a.position - b.position)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/60">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-semibold text-white">Configuración de onboarding</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Categorías y opciones que se muestran en el flujo de bienvenida
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

        {error && (
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* ── Categories ──────────────────────────────────────────────── */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <SectionHeader
            title="Categorías (Paso 2 — tarjetas visuales)"
            action={
              <button
                className={BTN_GHOST}
                onClick={() => setEditingCatId('new')}
                disabled={editingCatId !== null}
              >
                + Agregar
              </button>
            }
          />

          {editingCatId === 'new' && (
            <div className="mb-4">
              <CategoryEditor
                onSave={f => handleSaveCat(f)}
                onCancel={() => setEditingCatId(null)}
                saving={savingCat}
              />
            </div>
          )}

          {categories.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-6">No hay categorías. Agregá la primera.</p>
          ) : (
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.id}>
                  {editingCatId === cat.id ? (
                    <CategoryEditor
                      initial={{
                        name:     cat.name,
                        slug:     cat.slug,
                        iconName: cat.iconName ?? '',
                        position: String(cat.position),
                        active:   cat.active,
                      }}
                      onSave={f => handleSaveCat(f, cat.id)}
                      onCancel={() => setEditingCatId(null)}
                      saving={savingCat}
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/50 group">
                      <span className="text-xl w-8 text-center">{cat.iconName ?? '•'}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-200">{cat.name}</span>
                        <span className="text-xs text-gray-600 ml-2">{cat.slug}</span>
                      </div>
                      <span className="text-xs text-gray-600 tabular-nums">{cat.usageCount} usos</span>
                      <Badge active={cat.active} />
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button className={BTN_GHOST} onClick={() => setEditingCatId(cat.id)}>Editar</button>
                        <button className={BTN_DANGER} onClick={() => handleDeleteCat(cat.id)}>Eliminar</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Options ─────────────────────────────────────────────────── */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <SectionHeader title="Opciones (Paso 3 — selectores)" />

          {/* Group tabs */}
          <div className="flex gap-1 mb-5 bg-gray-800/60 rounded-lg p-1 w-fit">
            {(Object.keys(GROUP_LABELS) as OptionGroup[]).map(g => (
              <button
                key={g}
                onClick={() => { setActiveGroup(g); setEditingOptId(null); setAddingOptGroup(null) }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeGroup === g
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {GROUP_LABELS[g]}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            {groupedOpts.map((opt, index) => (
              <div key={opt.id}>
                {editingOptId === opt.id ? (
                  <OptionEditor
                    group={activeGroup}
                    initial={{
                      group:    opt.group as OptionGroup,
                      name:     opt.name,
                      slug:     opt.slug,
                      position: String(opt.position),
                      active:   opt.active,
                    }}
                    onSave={f => handleSaveOpt(f, opt.id)}
                    onCancel={() => setEditingOptId(null)}
                    saving={savingOpt}
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-800/50 group">
                    <div className="flex flex-col">
                      <button
                        onClick={() => handleMoveOpt(opt.id, 'up')}
                        disabled={index === 0 || reorderingOpt}
                        className="w-5 h-4 flex items-center justify-center text-gray-600 hover:text-gray-300 disabled:opacity-20 disabled:cursor-default transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveOpt(opt.id, 'down')}
                        disabled={index === groupedOpts.length - 1 || reorderingOpt}
                        className="w-5 h-4 flex items-center justify-center text-gray-600 hover:text-gray-300 disabled:opacity-20 disabled:cursor-default transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-xs text-gray-600 w-5 text-right tabular-nums">{opt.position}</span>
                    <span className="flex-1 text-sm text-gray-200">{opt.name}</span>
                    <span className="text-xs text-gray-600">{opt.slug}</span>
                    <span className="text-xs text-gray-600 tabular-nums">{opt.usageCount}</span>
                    <Badge active={opt.active} />
                    <div className="hidden group-hover:flex items-center gap-1">
                      <button className={BTN_GHOST} onClick={() => setEditingOptId(opt.id)}>Editar</button>
                      <button className={BTN_DANGER} onClick={() => handleDeleteOpt(opt.id)}>Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {addingOptGroup === activeGroup ? (
              <OptionEditor
                group={activeGroup}
                onSave={f => handleSaveOpt(f)}
                onCancel={() => setAddingOptGroup(null)}
                saving={savingOpt}
              />
            ) : (
              <button
                className="mt-2 w-full py-2 text-xs text-gray-600 hover:text-gray-400 border border-dashed border-gray-800 hover:border-gray-700 rounded-xl transition-colors"
                onClick={() => { setAddingOptGroup(activeGroup); setEditingOptId(null) }}
              >
                + Agregar opción
              </button>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}

// Single source of truth for plan feature keys and their shapes.
// Mirrors Plan::FEATURE_REGISTRY in app/models/plan.rb.

export interface FeaturesConfig {
  content_types?:            string[]
  availability_schedule?:    boolean
  availability_quota?:       boolean
  analytics?:                boolean
  spatial_intelligence?:     boolean
  members?:                  boolean
  dwell_time?:               boolean
  live_visits?:              boolean
  interactive_point_mode?:   boolean
  [key: string]:             unknown
}

export const CONTENT_TYPE_OPTIONS = [
  { value: 'url',   label: 'URL / Enlace' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'file',  label: 'Archivo' },
] as const

export type ContentTypeValue = typeof CONTENT_TYPE_OPTIONS[number]['value']

export interface BooleanFeatureMeta {
  key: keyof FeaturesConfig
  label: string
}

export const BOOLEAN_FEATURES: BooleanFeatureMeta[] = [
  { key: 'availability_schedule',  label: 'Horario de disponibilidad'    },
  { key: 'availability_quota',     label: 'Cupo de visitas'              },
  { key: 'analytics',              label: 'Analíticas'                   },
  { key: 'spatial_intelligence',   label: 'Inteligencia Espacial'        },
  { key: 'members',                label: 'Miembros del equipo'          },
  { key: 'dwell_time',             label: 'Permanencia'                  },
  { key: 'live_visits',            label: 'Visitas en Vivo'              },
  { key: 'interactive_point_mode', label: 'Modo del punto: Interactivo'  },
]

// Permissive defaults — users without a plan (admin, legacy) get everything.
export const DEFAULT_FEATURES_CONFIG: Required<FeaturesConfig> = {
  content_types:           ['url', 'video', 'audio', 'file'],
  availability_schedule:   true,
  availability_quota:      true,
  analytics:               true,
  spatial_intelligence:    true,
  members:                 true,
  dwell_time:              true,
  live_visits:             true,
  interactive_point_mode:  true,
}

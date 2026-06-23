import type { Capability } from '../types'

export const spatialIntelligence: Capability = {
  id: 'spatial-intelligence',
  name: 'Inteligencia espacial',
  tagline: 'Patrones de comportamiento y mapas de calor geoespaciales.',
  description:
    'Inteligencia espacial es la capa analítica avanzada de Ubyca. ' +
    'Procesa los puntos GPS históricos y en tiempo real para generar ' +
    'mapas de intensidad, detectar hotspots de concentración y revelar ' +
    'patrones de comportamiento que no son visibles en métricas simples. ' +
    'Permite entender cómo se mueven y dónde se concentran las personas ' +
    'dentro de un espacio o territorio.',
  keyFeatures: [
    'Mapas de intensidad GPS: densidad de presencia por coordenada',
    'Detección de hotspots: zonas de máxima concentración con radio estimado',
    'Modos histórico y en vivo (para Smart Proxies)',
    'Comparación de distribución espacial entre zonas',
    'Identificación de patrones por horario y zona geográfica',
    'Visualización en mapa dentro de Studio',
  ],
  whoIsItFor:
    'Equipos de operaciones, urbanismo, retail o logística que necesitan ' +
    'entender el comportamiento espacial de personas dentro de un área, ' +
    'no solo contarlas.',
  relatedCapabilities: ['analytics', 'live-visits', 'smart-proxies', 'geopoints'],
}

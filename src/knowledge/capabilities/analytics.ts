import type { Capability } from '../types'

export const analytics: Capability = {
  id: 'analytics',
  name: 'Analytics',
  tagline: 'Métricas reales de comportamiento espacial.',
  description:
    'Analytics es el módulo de métricas históricas de Ubyca. Registra cada ' +
    'interacción — entradas al área, activaciones, clics, completions de dwell ' +
    'time — y las presenta en dashboards por proyecto y por GeoPoint. ' +
    'Los datos reflejan comportamiento real: cuántas personas llegaron, ' +
    'cuánto tiempo permanecieron y qué porcentaje completó una acción. ' +
    'Son accesibles desde Studio y desde la Analytics API.',
  keyFeatures: [
    'Entradas al radio por GeoPoint: frecuencia y horarios',
    'Activaciones y clics por contenido asociado',
    'Tasa de conversión: entrada → activación',
    'Dwell time promedio por punto y por período',
    'Tendencias y comparativas entre períodos de tiempo',
    'Métricas de Smart Proxies: openings, location granted, clics, dwell completions',
    'Sesiones únicas y usuarios únicos que hicieron clic',
    'Datos exportables vía Analytics API',
  ],
  whoIsItFor:
    'Equipos de operaciones, marketing y producto que necesitan medir el ' +
    'rendimiento real de sus ubicaciones físicas para tomar decisiones basadas en datos.',
  apiEndpoints: ['GET /projects/{id}/analytics'],
  relatedCapabilities: ['geopoints', 'live-visits', 'spatial-intelligence', 'smart-proxies'],
}

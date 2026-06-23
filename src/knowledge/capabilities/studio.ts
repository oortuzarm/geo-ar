import type { Capability } from '../types'

export const studio: Capability = {
  id: 'studio',
  name: 'Studio',
  tagline: 'La interfaz visual de Ubyca para equipos sin perfil técnico.',
  description:
    'Studio es la aplicación web de Ubyca disponible en studio.ubyca.com. ' +
    'Permite crear proyectos, configurar GeoPoints y polígonos sobre el mapa, ' +
    'gestionar contenido multimedia asociado a cada zona, monitorear visitas ' +
    'en tiempo real y analizar métricas espaciales — todo sin escribir código. ' +
    'Es la contraparte visual de la API: ambas acceden al mismo motor de presencia.',
  keyFeatures: [
    'Editor visual de GeoPoints con radios y polígonos personalizados',
    'Configuración de reglas por zona: horarios, dwell time mínimo, cupos',
    'Dashboard de analytics: visitas, activaciones, conversión y tendencias',
    'Mapa de visitas en tiempo real con zona más activa y ranking',
    'Gestión de equipos con roles y permisos diferenciados',
    'Generación de códigos QR y links de compartir por proyecto',
    'Gestión centralizada de múltiples proyectos en un workspace',
    'Portal de desarrolladores para crear y gestionar API keys',
  ],
  whoIsItFor:
    'Equipos de marketing, operaciones y gestión que necesitan operar sobre ' +
    'datos de presencia física sin depender del área técnica.',
  relatedCapabilities: ['geopoints', 'analytics', 'live-visits', 'spatial-intelligence', 'smart-proxies'],
}

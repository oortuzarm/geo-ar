import type { UseCase } from '../types'

export const geolocatedCatalog: UseCase = {
  id: 'geolocated-catalog',
  vertical: 'geolocated-catalog',
  title: 'Catálogo o portafolio geolocalizado de proyectos y activos en terreno',
  problem:
    'Una empresa, consultora, municipalidad, arquitecto o profesional quiere ' +
    'mostrar su portafolio de proyectos, obras realizadas o activos distribuidos ' +
    'en el territorio de forma interactiva — no como una lista, sino como un ' +
    'mapa donde cada punto da acceso a la información del proyecto o activo ' +
    'correspondiente.',
  solution:
    'Puedes mostrar tus proyectos, obras o activos sobre un mapa interactivo: ' +
    'al acercarse a cada ubicación, el contenido asociado se activa automáticamente ' +
    '— ficha del proyecto, fotos, planos, videos o cualquier URL. Sin app nativa: ' +
    'cualquier dispositivo con navegador accede al contenido. Agregas nuevos ' +
    'proyectos desde Studio sin modificar la infraestructura existente.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
  matchKeywords: [
    // Intención de catálogo/portafolio
    'catálogo de proyectos', 'catálogo de obras', 'portafolio territorial',
    'portafolio geolocalizado', 'portafolio en mapa', 'catálogo geolocalizado',
    'catálogo interactivo', 'catálogo en mapa', 'mostrar proyectos en mapa',
    'mapa de proyectos', 'mapa de obras', 'proyectos sobre mapa',
    // Proyectos en terreno (señal fuerte)
    'proyectos en terreno', 'proyectos realizados', 'obras realizadas',
    'proyectos construidos', 'proyectos ejecutados', 'proyectos entregados',
    'trabajos realizados', 'trabajos ejecutados',
    // Activos distribuidos
    'activos distribuidos', 'activos en el territorio', 'puntos de interés mapa',
    // Verticales que usan catálogos (señales de contexto)
    'arquitectura', 'obra de arquitectura', 'proyecto de construcción',
    'municipalidad y proyectos', 'obras municipales en mapa',
    'ingeniería en terreno', 'visualizar proyectos',
  ],
}

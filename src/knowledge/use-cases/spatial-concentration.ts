import type { UseCase } from '../types'

export const spatialConcentration: UseCase = {
  id: 'spatial-concentration',
  vertical: 'spatial-analytics',
  title: 'Concentración de personas y detección de zonas de mayor afluencia',
  problem:
    'Una organización necesita saber en qué partes de un área, campus, ciudad ' +
    'o recinto se concentra la mayor cantidad de personas, en qué horarios y ' +
    'cómo varía la distribución a lo largo del tiempo — para tomar decisiones ' +
    'de diseño, operación, seguridad o inversión.',
  solution:
    'Sí. Puedes comparar el comportamiento entre ubicaciones y detectar cuáles ' +
    'concentran más personas, en qué horarios y cómo varía el patrón a lo largo ' +
    'del tiempo. El sistema genera mapas de intensidad GPS que muestran densidad ' +
    'de presencia por zona y detectan los puntos de máxima afluencia. Puedes ' +
    'identificar qué áreas quedan subutilizadas y exportar todos los datos ' +
    'vía API para análisis externos.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    // Concentración (señal fuerte)
    'concentración de personas', 'dónde se concentra', 'donde se concentra',
    'mayor cantidad de personas', 'concentración territorial',
    'qué zonas concentran', 'que zonas concentran',
    'dónde hay más gente', 'donde hay mas gente',
    'mayor afluencia', 'zona de mayor afluencia',
    // Hotspots
    'hotspot', 'zonas calientes', 'zona caliente',
    'puntos calientes', 'punto de máximo tráfico',
    // Distribución espacial
    'distribución espacial', 'distribución de personas', 'distribución territorial',
    'mapa de concentración', 'mapa de calor', 'mapa de intensidad',
    'comportamiento espacial', 'densidad de visitas', 'densidad de personas',
    // Zonas más visitadas (transversal, no vertical-específico)
    'áreas más visitadas', 'zonas más visitadas', 'zonas de mayor tráfico',
    'flujo por zona', 'intensidad de tráfico',
    // Comparación multi-local y rendimiento por punto
    'varias tiendas', 'comparar tiendas', 'comparar locales',
    'interacción de clientes', 'rendimiento por tienda',
    'qué local tiene más tráfico',
    // Comparación de comportamiento entre ubicaciones
    'comparar el comportamiento', 'entre varias ubicaciones',
    'comportamiento de visitantes', 'varias ubicaciones',
    'comparar sucursales', 'comparar zonas',
  ],
}

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
    // Valor y rendimiento por sucursal (auditoría anterior)
    'aporta más valor', 'aporta mas valor',
    'cuál aporta más', 'cual aporta mas',
    'genera mejores resultados', 'mejores resultados por sucursal',
    'comparar resultados entre sucursales', 'rendimiento de sucursales',
    // Concentración expresada con vocabulario coloquial
    'donde se junta', 'dónde se junta',
    'se junta más gente', 'se junta mas gente',
    'dónde se acumula gente', 'donde se acumula gente',
    // Performance comercial de ubicaciones — lenguaje de negocio (Tarea 1, 2)
    'cuál de mis locales', 'cual de mis locales',
    'cuál de mis sucursales', 'cual de mis sucursales',
    'cuáles de mis sucursales', 'cuales de mis sucursales',
    'cuál de mis puntos', 'cual de mis puntos',
    'recibe más visitas', 'recibe mas visitas',
    'más visitas', 'mas visitas',
    'genera más interacción', 'genera mas interaccion',
    'más interacción', 'mas interaccion',
    'funciona mejor', 'funcionan mejor',
    'mejor desempeño', 'mejor desempeno',
    'rendimiento comercial', 'mejor rendimiento',
    'aporta valor', 'genera valor', 'genera resultados',
    'sucursal más exitosa', 'sucursal mas exitosa',
    'cadena de restaurantes',
    // Lenguaje coloquial de afluencia (Tarea 5)
    'concurrido', 'qué tan concurrido', 'que tan concurrido',
    'se llena', 'se junta gente',
    'tráfico de personas', 'trafico de personas',
    'movimiento de personas', 'donde hay mas movimiento',
  ],
  subIntentions: [
    {
      id: 'comparar-ubicaciones',
      patterns: [
        'cuál de mis locales', 'cual de mis locales',
        'cuál de mis sucursales', 'cual de mis sucursales',
        'cuáles de mis sucursales', 'cuales de mis sucursales',
        'cuál de mis puntos', 'cual de mis puntos',
        'funciona mejor', 'funcionan mejor',
        'recibe más visitas', 'recibe mas visitas',
        'genera más interacción', 'genera mas interaccion',
        'aporta más valor', 'aporta mas valor',
        'genera mejores resultados', 'rendimiento de sucursales',
        'cadena de restaurantes', 'mejor desempeño', 'mejor desempeno',
        'rendimiento comercial', 'mejor rendimiento',
        'sucursal más exitosa', 'sucursal mas exitosa',
      ],
      solution:
        'Sí. Puedes comparar sucursales, locales o puntos entre sí para identificar cuáles ' +
        'reciben más visitas, en qué horarios concentran más personas y cuáles presentan mejor ' +
        'permanencia. El sistema genera métricas de tráfico por ubicación — cantidad de visitas, ' +
        'duración promedio y distribución horaria — exportables vía API para análisis comparativo ' +
        'o dashboards propios.',
    },
    {
      id: 'concurrencia-afluencia',
      patterns: [
        'concurrido', 'qué tan concurrido', 'que tan concurrido',
        'se llena', 'se junta gente',
        'se junta más gente', 'se junta mas gente',
        'tráfico de personas', 'trafico de personas',
        'movimiento de personas', 'donde hay mas movimiento',
        'dónde hay más gente', 'donde hay mas gente',
        'dónde se concentra', 'donde se concentra',
        'donde se junta', 'dónde se junta',
        'mayor afluencia', 'mapa de calor',
      ],
      solution:
        'Sí. Puedes medir cuántas personas circulan por una zona, en qué horarios se producen ' +
        'los picos de afluencia y cómo varía el patrón a lo largo del tiempo. El sistema genera ' +
        'mapas de intensidad GPS que muestran qué áreas concentran más tráfico y en qué momentos ' +
        '— sin hardware, sin sensores y sin encuestas.',
    },
  ],
}

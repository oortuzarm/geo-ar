import type { UseCase } from '../types'

export const urbanMobilityStudy: UseCase = {
  id: 'urban-mobility-study',
  vertical: 'urban-analytics',
  title: 'Análisis de movilidad urbana y evaluación territorial',
  problem:
    'Una consultora, municipalidad o desarrollador inmobiliario necesita ' +
    'entender cómo se mueven las personas en una zona específica para tomar ' +
    'decisiones sobre localización de proyectos, demanda real de servicios, ' +
    'vivienda o infraestructura urbana.',
  solution:
    'Sí. Puedes medir cuántas personas circulan por una zona, en qué horarios ' +
    'y cuánto tiempo permanecen — datos observacionales reales para tomar ' +
    'decisiones sobre apertura, expansión o inversión. Puedes comparar varias ' +
    'zonas entre sí e identificar dónde hay más movimiento y en qué momentos. ' +
    'Ubyca aporta datos de presencia y flujo georreferenciados: no genera modelos ' +
    'predictivos ni proyecciones estadísticas, pero sí los insumos concretos ' +
    'para construirlos.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'movilidad urbana', 'flujo urbano', 'estudio de movilidad',
    'análisis territorial', 'evaluación de zona', 'evaluación de sector',
    'demanda territorial', 'demanda de zona', 'demanda geográfica',
    'construir viviendas', 'proyecto de viviendas', 'sector para construir',
    'comportamiento territorial', 'densidad urbana', 'planificación urbana',
    'estudio de tráfico urbano', 'análisis de flujo urbano',
    'comportamiento en zona', 'análisis de localización',
    'buen lugar para construir', 'dónde construir',
    'flujo de personas en zona', 'movimiento en el sector',
    // Lenguaje natural — análisis antes de abrir un negocio
    'abrir un negocio', 'antes de abrir', 'suficiente movimiento',
    'movimiento de personas', 'cuánta gente pasa',
    'potencial de la zona', 'tráfico en la zona',
    'actividad en la zona', 'flujo en la zona',
    'cuánto tráfico hay', 'movimiento en la zona',
    // Evaluación para abrir nueva sucursal (Q9)
    'nueva sucursal', 'abrir una nueva sucursal', 'abrir una sucursal',
    'evaluar abrir', 'evaluar nueva sucursal',
    'abrir nuevo local', 'abrir una tienda',
    'elegir nueva ubicación', 'elegir nueva ubicacion',
  ],
}

export const fairMovementAnalysis: UseCase = {
  id: 'fair-movement-analysis',
  vertical: 'urban-analytics',
  title: 'Análisis de movimiento y distribución de visitantes en ferias y recintos',
  problem:
    'Un organizador de ferias, exposiciones, congresos o eventos en recintos ' +
    'quiere entender cómo se distribuyen los visitantes dentro del espacio, ' +
    'qué zonas o pabellones concentran más tráfico, cuánto tiempo permanecen ' +
    'en cada área y cuáles quedan con poca presencia.',
  solution:
    'Puedes saber cuántas personas pasaron por cada zona del recinto, cuánto ' +
    'tiempo permanecieron y en qué momentos del evento hubo picos de tráfico. ' +
    'Los mapas de intensidad muestran dónde se concentró la gente y cuáles ' +
    'zonas quedaron subutilizadas. Limitación importante: en recintos cerrados, ' +
    'el GPS tiene una precisión de 10 a 50 metros. Funciona bien para pabellones ' +
    'o sectores separados al menos 30-50 metros, pero no distingue con fiabilidad ' +
    'entre stands o áreas adyacentes.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'feria', 'exposición', 'expo', 'congreso', 'recinto ferial',
    'movimiento en feria', 'flujo en feria', 'dentro de una feria',
    'dentro del recinto', 'distribución de visitantes', 'distribución en evento',
    'cómo se mueven las personas', 'como se mueven las personas',
    'zonas de feria', 'stands más visitados', 'pabellón',
    'comportamiento en recinto', 'tráfico en recinto',
    'mapa de feria', 'flujo en recinto',
  ],
}

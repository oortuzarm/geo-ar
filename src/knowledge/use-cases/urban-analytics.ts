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
    'Ubyca despliega GeoPoints sobre las zonas de interés y recolecta datos ' +
    'de comportamiento espacial: cuántas personas pasan, en qué horarios, ' +
    'cuánto tiempo permanecen y qué sectores concentran mayor flujo. Los datos ' +
    'permiten comparar zonas, identificar patrones de movimiento y tomar ' +
    'decisiones basadas en demanda observada. Ubyca no genera modelos ' +
    'predictivos ni proyecciones estadísticas: aporta datos observacionales ' +
    'de presencia y flujo georreferenciados que sirven como input para el análisis.',
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
    'Ubyca define GeoPoints sobre las zonas del recinto y registra cuántas ' +
    'personas pasan por cada una, con cuánto tiempo de permanencia y cómo ' +
    'varía el flujo durante el evento. Los mapas de intensidad muestran dónde ' +
    'se concentró la gente. Limitación importante: en recintos cerrados, la ' +
    'precisión del GPS varía entre 10 y 50 metros. Ubyca funciona bien para ' +
    'mapear zonas amplias como pabellones o sectores separados al menos 30-50 ' +
    'metros, pero no permite distinguir con fiabilidad entre stands o áreas ' +
    'adyacentes más cercanas.',
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

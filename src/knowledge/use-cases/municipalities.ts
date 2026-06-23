import type { UseCase } from '../types'

export const municipalitiesPublicServices: UseCase = {
  id: 'municipalities-public-services',
  vertical: 'municipalities',
  title: 'Verificación de presencia en servicios públicos municipales',
  problem:
    'Una municipalidad necesita registrar que los ciudadanos están ' +
    'físicamente en la ventanilla o dependencia para acceder a un servicio. ' +
    'Los turnos en papel o por teléfono no evitan que alguien acuda en ' +
    'nombre de otro ni que se declaren presencias falsas.',
  solution:
    'Ubyca verifica que el ciudadano está físicamente en la dependencia ' +
    'cuando solicita el servicio. Puedes integrar la validación de presencia ' +
    'en el sistema de turnos existente vía API. El registro queda disponible ' +
    'en analytics para auditorías.',
  capabilities: ['geopoints', 'presence', 'api', 'analytics'],
  matchKeywords: [
    'municipio', 'municipalidad', 'gobierno local', 'servicio público',
    'ventanilla', 'trámite presencial', 'ciudadano', 'dependencia pública',
    'oficina municipal',
  ],
}

export const municipalitiesUrbanAnalysis: UseCase = {
  id: 'municipalities-urban-analysis',
  vertical: 'municipalities',
  title: 'Análisis de flujo peatonal en espacios públicos',
  problem:
    'Una municipalidad quiere entender cómo circulan las personas en una ' +
    'plaza, parque, mercado o centro histórico: cuántas personas hay en ' +
    'cada momento, qué zonas están saturadas y cuáles subutilizadas.',
  solution:
    'Ubyca recolecta datos de presencia en las zonas del espacio público ' +
    'y genera mapas de intensidad que muestran dónde se concentra el ' +
    'tráfico peatonal. Puedes ver el comportamiento en tiempo real y el ' +
    'histórico por hora, día y zona. Los datos informan decisiones de ' +
    'diseño urbano, eventos públicos y distribución de recursos.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'flujo peatonal', 'espacio público', 'plaza', 'parque',
    'análisis urbano', 'planificación urbana', 'centro histórico',
    'concurrencia', 'ciudad inteligente', 'smart city',
  ],
}

export const municipalitiesInspection: UseCase = {
  id: 'municipalities-inspection',
  vertical: 'municipalities',
  title: 'Control de inspectores y agentes en terreno',
  problem:
    'Una municipalidad tiene inspectores, agentes de tránsito o personal ' +
    'de mantenimiento que deben recorrer zonas asignadas. No hay forma de ' +
    'verificar que los recorridos se realizaron sin depender de partes ' +
    'escritos que pueden falsificarse.',
  solution:
    'Ubyca registra automáticamente cuando cada inspector llega a los ' +
    'puntos de su ronda asignada. El sistema verifica la presencia en el ' +
    'servidor — no es auto-declarada. El supervisor puede ver la cobertura ' +
    'real en Studio y exportar el historial a los sistemas municipales.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'inspector municipal', 'agente de tránsito', 'ronda municipal',
    'personal en terreno', 'mantenimiento urbano', 'servicio en campo',
    'control de recorridos',
  ],
}

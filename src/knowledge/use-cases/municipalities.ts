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
    'Puedes verificar que el ciudadano está físicamente en la ventanilla o ' +
    'dependencia cuando solicita un servicio — evitando que alguien acceda en ' +
    'nombre de otro o declare una presencia que no ocurrió. La validación se ' +
    'integra al sistema de turnos existente vía API y el registro queda disponible ' +
    'para auditorías.',
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
    'Puedes visualizar cómo circula la gente en plazas, parques, mercados y ' +
    'centros históricos: qué zonas están saturadas, cuáles subutilizadas y cómo ' +
    'varía el comportamiento por hora y día. Los datos informan decisiones de ' +
    'diseño urbano, organización de eventos públicos y distribución de recursos.',
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
    'Puedes verificar que inspectores y agentes cubrieron sus recorridos ' +
    'asignados, con hora y tiempo de permanencia por punto — sin partes ' +
    'escritos que pueden falsificarse. El supervisor ve la cobertura real ' +
    'en Studio y exporta el historial a los sistemas municipales.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'inspector municipal', 'agente de tránsito', 'ronda municipal',
    'personal en terreno', 'mantenimiento urbano', 'servicio en campo',
    'control de recorridos',
  ],
}

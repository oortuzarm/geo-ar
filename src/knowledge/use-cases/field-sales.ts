import type { UseCase } from '../types'

export const fieldSalesVisits: UseCase = {
  id: 'field-sales-visits',
  vertical: 'field-sales',
  title: 'Visitas de vendedores a puntos de venta',
  problem:
    'El equipo comercial debe visitar tiendas o clientes en terreno, pero no ' +
    'hay forma confiable de verificar que las visitas ocurrieron, cuánto tiempo ' +
    'duraron ni con qué frecuencia se realizan. Los reportes manuales son ' +
    'poco confiables y difíciles de auditar.',
  solution:
    'Puedes obtener un historial real de visitas comerciales — hora exacta, tiempo ' +
    'de permanencia y frecuencia por punto de venta — sin depender de reportes ' +
    'manuales que pueden alterarse. La presencia se verifica automáticamente en ' +
    'el servidor cuando el vendedor llega al área, no es auto-declarada.',
  capabilities: ['geopoints', 'presence', 'analytics'],
  matchKeywords: [
    'vendedor', 'promotor', 'punto de venta', 'fuerza de ventas',
    'visita comercial', 'cobertura comercial', 'ruta de ventas',
  ],
}

export const fieldSalesSupervision: UseCase = {
  id: 'field-sales-supervision',
  vertical: 'field-sales',
  title: 'Supervisión de equipo en terreno',
  problem:
    'Un supervisor necesita saber qué zonas está cubriendo su equipo en tiempo ' +
    'real, sin tener que llamar a cada persona ni confiar en reportes de posición ' +
    'auto-declarados.',
  solution:
    'Puedes ver en tiempo real qué zonas está cubriendo tu equipo, quién está ' +
    'presente en cada punto y cuál es la cobertura real — sin que nadie haga ' +
    'check-ins manuales. El sistema registra el historial completo de cobertura ' +
    'por persona, zona y horario para revisión posterior.',
  capabilities: ['geopoints', 'presence', 'analytics', 'live-visits', 'spatial-intelligence'],
  matchKeywords: [
    'supervisor', 'supervisar', 'supervisión', 'ronda', 'cobertura de zona',
    'equipo en terreno', 'personal en campo', 'monitorear equipo',
  ],
}

export const fieldSalesDelivery: UseCase = {
  id: 'field-sales-delivery',
  vertical: 'field-sales',
  title: 'Control de rutas de reparto y distribución',
  problem:
    'Una empresa de distribución necesita verificar que los conductores o ' +
    'repartidores pasaron efectivamente por los puntos de entrega asignados, ' +
    'con la hora exacta y el tiempo que permanecieron.',
  solution:
    'Puedes verificar que tus conductores o repartidores pasaron por los puntos ' +
    'de entrega asignados, con hora exacta y tiempo de permanencia — sin depender ' +
    'de declaraciones del propio equipo. Ves la cobertura de rutas en tiempo real ' +
    'desde Studio y exportas los datos vía API a tu sistema logístico existente.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'reparto', 'distribución', 'conductor', 'chofer', 'entrega',
    'ruta de entrega', 'logística de campo', 'cadena de distribución',
  ],
}

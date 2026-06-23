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
    'Ubyca registra automáticamente las visitas cuando el vendedor o promotor ' +
    'llega al área del GeoPoint asignado a cada punto de venta. La presencia se ' +
    'verifica en el servidor, no es auto-declarada. Obtienes un historial real ' +
    'con hora exacta, tiempo de permanencia y frecuencia por punto — sin ' +
    'reportes manuales ni posibilidad de datos alterados.',
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
    'Con Ubyca puedes definir las zonas que cada integrante del equipo debe cubrir ' +
    'y ver en tiempo real desde Studio quién está presente en qué zona. El sistema ' +
    'registra el historial de cobertura por persona, zona y horario — sin que el ' +
    'equipo tenga que hacer check-ins manuales.',
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
    'Ubyca puede verificar que los conductores o repartidores pasen por los ' +
    'puntos de entrega asignados. Cada visita queda registrada con timestamp y ' +
    'tiempo de permanencia. Puedes ver la cobertura de rutas en tiempo real ' +
    'desde Studio y exportar los datos vía API a tu sistema logístico existente.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'reparto', 'distribución', 'conductor', 'chofer', 'entrega',
    'ruta de entrega', 'logística de campo', 'cadena de distribución',
  ],
}

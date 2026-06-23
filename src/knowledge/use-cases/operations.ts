import type { UseCase } from '../types'

export const operationsSafety: UseCase = {
  id: 'operations-safety',
  vertical: 'operations',
  title: 'Control de acceso a zonas de riesgo o restringidas',
  problem:
    'Una planta industrial, obra de construcción o instalación minera ' +
    'necesita verificar que solo el personal autorizado accede a zonas ' +
    'de riesgo. Los sistemas actuales requieren hardware (torniquetes, ' +
    'lectores de tarjetas) que es caro y difícil de mover.',
  solution:
    'Ubyca define polígonos de exclusión o acceso sobre el mapa de la ' +
    'instalación. Cuando alguien intenta acceder a un recurso o sistema ' +
    'desde esa zona, la API valida si está físicamente autorizado para ' +
    'estar allí. No hay hardware que instalar: cualquier dispositivo ' +
    'móvil puede hacer la validación.',
  capabilities: ['geopoints', 'presence', 'api'],
  matchKeywords: [
    'zona de riesgo', 'área restringida', 'planta industrial',
    'obra de construcción', 'minería', 'seguridad industrial',
    'acceso a planta', 'personal autorizado', 'zona peligrosa',
  ],
}

export const operationsMaintenanceRoutes: UseCase = {
  id: 'operations-maintenance-routes',
  vertical: 'operations',
  title: 'Verificación de rondas de mantenimiento',
  problem:
    'Un equipo de mantenimiento debe realizar rondas periódicas por ' +
    'instalaciones físicas (torres, subestaciones, locales de una cadena). ' +
    'No hay forma de verificar que las rondas ocurrieron sin depender de ' +
    'partes manuales.',
  solution:
    'Ubyca define los puntos de la ronda como GeoPoints y registra cada ' +
    'visita con timestamp y tiempo de permanencia. El supervisor puede ' +
    'ver en Studio si la ronda se completó, qué puntos se saltaron y ' +
    'cuánto tiempo se tardó en cada uno. Los datos se exportan vía API ' +
    'a sistemas CMMS o ERP existentes.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api', 'integrations'],
  matchKeywords: [
    'ronda de mantenimiento', 'inspección de instalaciones',
    'mantenimiento preventivo', 'técnico en terreno',
    'torre', 'subestación', 'infraestructura física',
    'CMMS', 'control de rondas',
  ],
}

export const operationsFleetTracking: UseCase = {
  id: 'operations-fleet-tracking',
  vertical: 'operations',
  title: 'Validación de presencia de flota en puntos de parada',
  problem:
    'Una empresa con flota móvil (transporte de pasajeros, servicios urbanos, ' +
    'logística) necesita validar que los vehículos pasaron por los puntos ' +
    'asignados de la ruta, con la hora exacta de cada parada.',
  solution:
    'Ubyca define GeoPoints para cada parada o punto de ruta. La API ' +
    'valida la presencia del conductor cuando el vehículo se acerca al ' +
    'punto. El historial muestra qué puntos se completaron, a qué hora ' +
    'y si hubo desvíos. Los datos se integran al sistema de gestión de ' +
    'flota existente.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'flota', 'vehículo', 'transporte', 'parada', 'ruta vehicular',
    'servicio de transporte', 'gestión de flota', 'bus', 'camión',
    'control de ruta vehicular',
  ],
}

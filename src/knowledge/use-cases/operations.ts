import type { UseCase } from '../types'

export const operationsSafety: UseCase = {
  id: 'operations-safety',
  vertical: 'operations',
  title: 'Control de acceso a zonas industriales o restringidas',
  problem:
    'Una planta industrial, obra de construcción o instalación minera ' +
    'necesita verificar que solo el personal autorizado accede a ciertas ' +
    'zonas. Los sistemas de hardware (torniquetes, lectores de tarjetas) ' +
    'son caros, difíciles de mover y requieren infraestructura fija.',
  solution:
    'Ubyca define polígonos sobre el mapa de la instalación que representan ' +
    'las zonas autorizadas. Cuando el personal intenta acceder a un recurso ' +
    'o sistema desde su dispositivo móvil, la API de Ubyca responde si están ' +
    'físicamente dentro del área autorizada. El sistema del cliente decide qué ' +
    'acción tomar según ese resultado: habilitar o denegar el acceso. ' +
    'Ubyca no genera alertas automáticas: la lógica de autorización vive ' +
    'en el sistema integrador, no en Ubyca.',
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
    'logística) necesita verificar que los conductores pasaron por los puntos ' +
    'asignados de la ruta, con la hora exacta de cada parada.',
  solution:
    'Ubyca define GeoPoints para cada parada o punto de ruta. El conductor ' +
    'realiza la validación desde su dispositivo al llegar a cada punto. ' +
    'El historial muestra qué puntos se completaron y a qué hora; los puntos ' +
    'no validados quedan como pendientes. Ubyca registra eventos de llegada ' +
    'a puntos discretos: no registra la trayectoria del vehículo entre paradas ' +
    'ni detecta desvíos de ruta. Los datos se integran al sistema de gestión ' +
    'de flota existente vía API.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'flota', 'vehículo', 'transporte', 'parada', 'ruta vehicular',
    'servicio de transporte', 'gestión de flota', 'bus', 'camión',
    'control de ruta vehicular',
  ],
}

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
    'Puedes restringir el acceso a recursos o sistemas según si el personal ' +
    'está físicamente dentro de las zonas autorizadas — sin torniquetes ni ' +
    'lectores de tarjetas. Cuando el personal intenta acceder desde su dispositivo, ' +
    'tu sistema consulta la API para verificar si están dentro del área autorizada ' +
    'y decide si habilitar o denegar. Ubyca no genera alertas automáticas: la ' +
    'lógica de autorización vive en tu sistema, Ubyca provee la validación de presencia.',
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
    'Sí. Puedes confirmar automáticamente que tus técnicos llegaron al lugar ' +
    'asignado, a qué hora y cuánto tiempo permanecieron — sin depender de ' +
    'reportes manuales. El supervisor ve en Studio si la ronda se completó, ' +
    'qué puntos se saltaron y cuánto tiempo tomó cada uno. Los datos se ' +
    'exportan vía API a sistemas CMMS o ERP existentes.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api', 'integrations'],
  matchKeywords: [
    'ronda de mantenimiento', 'inspección de instalaciones',
    'mantenimiento preventivo', 'técnico en terreno',
    'torre', 'subestación', 'infraestructura física',
    'CMMS', 'control de rondas',
    // Lenguaje natural — técnicos y verificación de llegada
    'técnicos en terreno', 'confirmar que llegaron', 'llegaron al lugar asignado',
    'confirmar llegada', 'verificar que llegaron', 'lugar asignado',
    'personal llegó al lugar', 'confirmar visita en terreno',
    'trabajadores en terreno', 'verificar asistencia en terreno',
    // Verificar que trabajadores estuvieron donde debían (Q3)
    'mis trabajadores', 'estuvieron donde debían', 'estuvieron donde debian',
    'donde debían estar', 'donde debian estar',
    'verificar trabajadores', 'comprobar trabajadores',
    'verificar que estuvieron', 'trabajadores realmente estuvieron',
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
    'Puedes verificar que cada conductor completó sus paradas asignadas, con la ' +
    'hora exacta de cada llegada — sin llamadas de confirmación ni reportes manuales. ' +
    'Los puntos no completados quedan como pendientes en el historial. Ubyca registra ' +
    'llegadas a puntos discretos: no registra la trayectoria entre paradas ni detecta ' +
    'desvíos de ruta. Los datos se integran al sistema de gestión de flota vía API.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'flota', 'vehículo', 'transporte', 'parada', 'ruta vehicular',
    'servicio de transporte', 'gestión de flota', 'bus', 'camión',
    'control de ruta vehicular',
  ],
}

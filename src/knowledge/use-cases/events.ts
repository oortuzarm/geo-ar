import type { UseCase } from '../types'

export const eventsAccess: UseCase = {
  id: 'events-access',
  vertical: 'events',
  title: 'Control de acceso sin QR ni hardware',
  problem:
    'Un organizador de eventos necesita controlar que los asistentes estén ' +
    'físicamente presentes en el lugar antes de habilitarles acceso a ' +
    'contenido, descuentos o beneficios. Los QR son fácilmente compartibles ' +
    'y el hardware de acceso es caro y difícil de escalar.',
  solution:
    'Ubyca verifica que el asistente está físicamente en el área del evento ' +
    'antes de habilitar el acceso. No hay código QR que compartir: la validación ' +
    'es por ubicación real. Puedes configurar polígonos exactos para el perímetro ' +
    'del evento y definir reglas de horario. La respuesta llega en menos de 80 ms ' +
    'vía API, sin app nativa requerida.',
  capabilities: ['geopoints', 'presence', 'api'],
  matchKeywords: [
    'evento', 'acceso sin QR', 'control de acceso', 'asistente',
    'festival', 'conferencia', 'perímetro', 'entrada sin código',
    // Lenguaje natural — acceso sin QR
    'sin usar QR', 'sin QR', 'controlar acceso sin QR', 'sin código QR',
    'sin escanear', 'alternativa al QR', 'sin tarjeta ni QR',
    'acceso por ubicación real', 'acceso sin hardware',
    'controlar el acceso sin', 'acceso sin lector',
  ],
}

export const eventsExperience: UseCase = {
  id: 'events-experience',
  vertical: 'events',
  title: 'Experiencias geoactivadas en eventos',
  problem:
    'Un organizador quiere que los asistentes descubran contenido o actividades ' +
    'diferentes según en qué parte del evento se encuentren, sin tener que ' +
    'instalar una app dedicada.',
  solution:
    'Ubyca activa contenido diferente según el stand, zona o sala donde se ' +
    'encuentre el asistente. Cada zona tiene su propio GeoPoint con contenido ' +
    'asociado que se activa automáticamente al llegar. Puedes mapear todo el ' +
    'evento en Studio y ver en tiempo real qué zonas tienen más tráfico.',
  capabilities: ['geopoints', 'presence', 'analytics', 'live-visits', 'smart-proxies'],
  matchKeywords: [
    'stand', 'zona del evento', 'contenido por zona', 'experiencia interactiva',
    'activación por ubicación', 'gamificación evento', 'recorrido guiado',
  ],
}

export const eventsAnalytics: UseCase = {
  id: 'events-analytics',
  vertical: 'events',
  title: 'Métricas de asistencia y comportamiento en eventos',
  problem:
    'Después de un evento, el organizador no sabe cuánta gente pasó por ' +
    'cada zona, cuánto tiempo permanecieron, qué stands fueron más visitados ' +
    'ni cuál fue el flujo real de asistentes.',
  solution:
    'Ubyca registra automáticamente el flujo de asistentes por cada zona del ' +
    'evento: entradas, permanencia promedio, pico de tráfico y ranking de zonas. ' +
    'Los mapas de intensidad muestran dónde se concentró la gente. ' +
    'Puedes exportar todos los datos vía API o analizarlos directamente en Studio.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'métricas de evento', 'comportamiento de asistentes', 'zonas más visitadas',
    'flujo de personas', 'tiempo en stand', 'reporte de evento',
  ],
}

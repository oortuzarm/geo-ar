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
    'Sí. Puedes controlar el acceso a tu evento sin QR, sin tarjeta y sin hardware: ' +
    'la única condición es que el usuario esté físicamente en el área. No hay código ' +
    'que compartir ni falsificar — la validación es por ubicación real, verificada ' +
    'en el servidor. Puedes definir el perímetro exacto del evento, configurar ' +
    'horarios de activación y recibir la respuesta en menos de 80 ms vía API.',
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
    'Puedes activar contenido diferente según en qué stand, zona o sala se encuentre ' +
    'el asistente — sin QR ni personal en cada punto. Al llegar a cada área, el ' +
    'contenido correspondiente se activa automáticamente en el dispositivo. Desde ' +
    'Studio puedes ver en tiempo real qué zonas tienen más tráfico.',
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
    'Después del evento puedes saber exactamente cuánta gente pasó por cada zona, ' +
    'cuánto tiempo permanecieron, cuál fue el stand más visitado y cuál fue el pico ' +
    'de tráfico — datos reales, no estimaciones. Los mapas de intensidad muestran ' +
    'dónde se concentró la gente. Exportas todos los datos vía API o los analizas ' +
    'directamente en Studio.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'métricas de evento', 'comportamiento de asistentes', 'zonas más visitadas',
    'flujo de personas', 'tiempo en stand', 'reporte de evento',
  ],
}

import type { UseCase } from '../types'

export const tourismRoutes: UseCase = {
  id: 'tourism-routes',
  vertical: 'tourism',
  title: 'Contenido contextual en monumentos, rutas y puntos de interés',
  problem:
    'Una ciudad, organismo de patrimonio, museo u operador turístico quiere ' +
    'que los visitantes descubran información, audio o video al llegar a un ' +
    'monumento, sitio histórico o parada de circuito — sin escanear un QR ' +
    'ni abrir una app dedicada.',
  solution:
    'Sí. Puedes crear una experiencia donde el contenido — texto, audio, video, ' +
    'enlace — se activa automáticamente cuando el visitante llega a cada punto, ' +
    'sin QR ni app dedicada. Funciona tanto para un único monumento como para ' +
    'circuitos completos de múltiples paradas. Desde Studio puedes ver cuáles ' +
    'puntos generan más permanencia, cuáles se omiten y actualizar el contenido ' +
    'sin tocar la infraestructura.',
  capabilities: ['geopoints', 'presence', 'analytics', 'smart-proxies'],
  matchKeywords: [
    'monumento', 'patrimonio', 'patrimonio histórico', 'sitio histórico',
    'contenido en monumento', 'experiencia patrimonial', 'turismo cultural',
    'punto de interés histórico', 'museo', 'circuito',
    'ruta turística', 'turismo', 'guía de viaje', 'punto de interés',
    'parada turística', 'tour autoguiado', 'audio guía',
    'contenido por ubicación', 'desbloquear contenido en punto',
    'desbloquear contenido', 'cerca de monumentos',
    'contenido al acercarse a', 'activar contenido en monumento',
    // Lenguaje natural del usuario
    'recorrido turístico', 'recorrido patrimonial', 'recorrido por la ciudad',
    'paseo turístico', 'paseo cultural', 'paseo por monumentos',
    'guía turística', 'experiencia turística',
    'hacer un recorrido', 'hacer turismo',
    'tour por la ciudad', 'tour cultural',
    'visitar monumentos', 'visitar museos',
    'recorrido autoguiado', 'app de turismo', 'app para turistas',
    'información en sitios', 'información al llegar a',
    // Experiencias de ciudad con múltiples puntos
    'distintos puntos', 'puntos de una ciudad', 'distintos puntos de la ciudad',
    'visitar distintos puntos', 'puntos de interés de la ciudad',
    'experiencia ciudad puntos', 'recorrido por puntos',
  ],
}

export const tourismVerification: UseCase = {
  id: 'tourism-verification',
  vertical: 'tourism',
  title: 'Verificación de visita a atractivos turísticos',
  problem:
    'Un operador de turismo o una oficina de turismo quiere certificar ' +
    'que los visitantes realmente estuvieron en los lugares del itinerario, ' +
    'para emitir sellos digitales, certificados o habilitar beneficios ' +
    'en el siguiente punto.',
  solution:
    'Puedes emitir certificados o sellos digitales que solo se generan si el ' +
    'visitante estuvo físicamente en el lugar el tiempo mínimo requerido — ' +
    'validación objetiva, no auto-declarada. El historial de visitas queda ' +
    'disponible en analytics para reporting.',
  capabilities: ['geopoints', 'presence', 'api', 'analytics'],
  matchKeywords: [
    'certificado de visita', 'sello turístico', 'verificar itinerario',
    'comprobar presencia en atractivo', 'pasaporte turístico',
    'recorrido completado', 'check-in turístico verificado',
  ],
}

export const tourismCityAnalytics: UseCase = {
  id: 'tourism-city-analytics',
  vertical: 'tourism',
  title: 'Análisis de flujo turístico en una ciudad',
  problem:
    'Una municipalidad o ente de turismo quiere entender cómo se mueven ' +
    'los turistas: qué zonas visitan, cuánto tiempo permanecen, cuáles ' +
    'son las rutas más frecuentes y cuáles los atractivos menos visitados.',
  solution:
    'Puedes entender cómo se mueven realmente los turistas en tu ciudad: qué ' +
    'atractivos generan más visitas y permanencia, qué rutas son las más ' +
    'frecuentes y cuáles quedan subutilizadas. Los mapas de intensidad muestran ' +
    'dónde se concentran los visitantes. Puedes comparar flujo por zona, horario ' +
    'y período para identificar qué atractivos necesitan más promoción o infraestructura.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'flujo turístico', 'análisis de visitantes ciudad', 'comportamiento turista',
    'zonas más visitadas ciudad', 'destino turístico analytics',
    'planificación turística', 'municipio y turismo',
  ],
}

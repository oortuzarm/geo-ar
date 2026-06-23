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
    'Ubyca define un GeoPoint alrededor de cada monumento, sitio histórico ' +
    'o punto de interés. Al llegar al área, el contenido asociado — texto, ' +
    'audio, video, enlace — se activa en el dispositivo del visitante. ' +
    'Funciona para un único monumento o para circuitos completos de múltiples ' +
    'paradas. Puedes medir qué puntos generan más permanencia y cuáles son ' +
    'salteados, y actualizar el contenido en Studio sin tocar la infraestructura.',
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
    'Ubyca registra cada visita verificada en el servidor, con timestamp y ' +
    'tiempo de permanencia. Puedes usar la API para emitir un certificado ' +
    'o sello digital solo si el usuario completó la permanencia mínima ' +
    'requerida en el sitio. El historial de visitas queda disponible en ' +
    'analytics para reporting.',
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
    'Ubyca despliega GeoPoints en los atractivos de la ciudad y recolecta ' +
    'datos de comportamiento espacial. Los mapas de intensidad muestran ' +
    'dónde se concentran los visitantes. Puedes comparar flujo por zona, ' +
    'horario y período, e identificar qué atractivos necesitan más promoción ' +
    'o infraestructura.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'flujo turístico', 'análisis de visitantes ciudad', 'comportamiento turista',
    'zonas más visitadas ciudad', 'destino turístico analytics',
    'planificación turística', 'municipio y turismo',
  ],
}

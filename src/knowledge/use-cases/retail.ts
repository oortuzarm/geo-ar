import type { UseCase } from '../types'

export const retailDwellTime: UseCase = {
  id: 'retail-dwell-time',
  vertical: 'retail',
  title: 'Tiempo de permanencia en local comercial',
  problem:
    'Un local comercial quiere saber cuánto tiempo pasan los clientes dentro ' +
    'de la tienda y cuál es el momento del día con más tráfico real — datos ' +
    'que los sistemas de caja no capturan porque no registran quienes entran ' +
    'sin comprar.',
  solution:
    'Sí. Puedes medir cuánto tiempo permanecen tus clientes en el local, en qué ' +
    'horarios hay más tráfico y cuántas personas entran — sin hardware adicional. ' +
    'En locales de gran superficie (supermercados, showrooms, centros comerciales), ' +
    'puedes dividir el área en zonas de al menos 50 metros de separación para ' +
    'analizar cada sector por separado. En locales pequeños o medianos el análisis ' +
    'cubre el local como una unidad: el GPS en interiores no permite distinguir ' +
    'con fiabilidad entre zonas más cercanas.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'tiempo en local', 'permanencia en tienda', 'cuánto tiempo clientes',
    'tráfico de local', 'comportamiento en tienda', 'retail analytics',
    'flujo de clientes', 'mapa de calor tienda',
    // Lenguaje natural — permanencia
    'cuánto tiempo permanecen', 'tiempo de permanencia',
    'duración de visita', 'dwell time',
    'cuánto tiempo estuvieron', 'tiempo que pasan en',
    'permanencia en ubicación', 'cuánto permanecen',
  ],
}

export const retailPromotion: UseCase = {
  id: 'retail-promotion',
  vertical: 'retail',
  title: 'Promociones que se activan por presencia física',
  problem:
    'Un retailer quiere mostrar una oferta o descuento especial solo a quienes ' +
    'están físicamente en el local, sin que la promoción se comparta y use ' +
    'desde fuera de la tienda.',
  solution:
    'Puedes mostrar una promoción o descuento exclusivo solo a quienes estén ' +
    'físicamente en el local — no puede compartirse ni usarse desde casa porque ' +
    'la validación ocurre en el servidor, no es auto-declarada. Funciona sin ' +
    'app nativa: cualquier navegador web puede solicitar la validación de presencia.',
  capabilities: ['geopoints', 'presence', 'api'],
  matchKeywords: [
    'promoción en local', 'descuento presencial', 'oferta por ubicación',
    'beneficio al llegar', 'cupón por presencia', 'solo en tienda',
    // Dentro del local / validación de presencia
    'solo funcione dentro del local', 'funcione dentro del local',
    'solo dentro del local', 'solo en el local',
    'dentro de la tienda', 'que funcione dentro',
    'funcione solo dentro',
    // Clientes presentes en el momento
    'clientes que están en el local', 'están en el local en ese momento',
    'clientes en el local en ese momento', 'presentes en el local',
    'solo a los clientes que están', 'en el local en ese momento',
    // Descriptores naturales
    'promoción especial', 'oferta exclusiva en tienda',
    'descuento solo en tienda', 'beneficio solo en tienda',
  ],
}

export const retailSmartProxy: UseCase = {
  id: 'retail-smart-proxy',
  vertical: 'retail',
  title: 'Tracking de visitas a tienda online desde el local físico',
  problem:
    'Una tienda física tiene también un e-commerce. Quiere entender cuántos ' +
    'clientes visitan el sitio web mientras están en el local físico, y si ' +
    'esas visitas tienen una tasa de conversión diferente.',
  solution:
    'Puedes detectar cuántos clientes visitan tu e-commerce mientras están ' +
    'físicamente en el local, y si esas visitas tienen una tasa de conversión ' +
    'diferente. El tracking ocurre sin modificar el sitio e-commerce: un Smart ' +
    'Proxy envuelve el enlace existente y registra las sesiones que ocurrieron ' +
    'desde dentro del local.',
  capabilities: ['smart-proxies', 'analytics', 'presence'],
  matchKeywords: [
    'tienda online y física', 'e-commerce presencial', 'omnichannel',
    'cliente en local visita web', 'conversión presencial',
  ],
}

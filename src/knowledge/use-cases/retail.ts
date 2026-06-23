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
    'Ubyca define un GeoPoint que cubre el área del local y mide cuántos ' +
    'clientes entran, cuánto tiempo permanecen y la distribución horaria del ' +
    'tráfico. Para locales de gran superficie (supermercados, showrooms, centros ' +
    'comerciales con zonas de al menos 50 metros de separación), es posible ' +
    'definir múltiples GeoPoints por área amplia. En locales pequeños o medianos ' +
    'el GeoPoint cubre el local como una unidad: el GPS indoor no permite ' +
    'distinguir con fiabilidad entre zonas separadas menos de 30-50 metros.',
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
    'Ubyca valida que el cliente esté en el local antes de habilitar el ' +
    'beneficio. La validación ocurre en el servidor — no es auto-declarada — ' +
    'por lo que no puede ser compartida ni usada desde casa. Funciona sin ' +
    'app nativa: cualquier navegador web puede hacer la llamada a la API.',
  capabilities: ['geopoints', 'presence', 'api'],
  matchKeywords: [
    'promoción en local', 'descuento presencial', 'oferta por ubicación',
    'beneficio al llegar', 'cupón por presencia', 'solo en tienda',
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
    'Con un Smart Proxy, Ubyca convierte el e-commerce en un enlace con ' +
    'tracking de presencia física. Cuando el cliente accede desde el local, ' +
    'el sistema registra que la sesión ocurrió físicamente en la tienda. ' +
    'Puedes comparar la conversión de visitantes físicos vs. remotos sin ' +
    'modificar el sitio e-commerce.',
  capabilities: ['smart-proxies', 'analytics', 'presence'],
  matchKeywords: [
    'tienda online y física', 'e-commerce presencial', 'omnichannel',
    'cliente en local visita web', 'conversión presencial',
  ],
}

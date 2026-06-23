import type { UseCase } from '../types'

export const retailDwellTime: UseCase = {
  id: 'retail-dwell-time',
  vertical: 'retail',
  title: 'Tiempo de permanencia en local comercial',
  problem:
    'Un local comercial quiere saber cuánto tiempo pasan los clientes dentro ' +
    'de la tienda, si llegan hasta ciertas zonas (caja, fondo del local, probadores) ' +
    'y cuál es el momento del día con más tráfico real — no solo ingresos.',
  solution:
    'Ubyca define zonas por área dentro del local: entrada, zona de producto, ' +
    'probadores, caja. Mide cuánto tiempo pasan los clientes en cada zona, ' +
    'cuántos visitan el fondo del local vs. solo la entrada, y cuál es la ' +
    'distribución horaria. Los mapas de calor revelan qué partes del espacio ' +
    'son más transitadas y cuáles son ignoradas.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'tiempo en local', 'permanencia en tienda', 'cuánto tiempo clientes',
    'tráfico de local', 'comportamiento en tienda', 'retail analytics',
    'flujo de clientes', 'mapa de calor tienda',
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

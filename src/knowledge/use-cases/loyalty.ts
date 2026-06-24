import type { UseCase } from '../types'

export const loyaltyPhysicalVisits: UseCase = {
  id: 'loyalty-physical-visits',
  vertical: 'loyalty',
  title: 'Programa de fidelización por visitas físicas verificadas',
  problem:
    'Una marca quiere premiar a los clientes que visitan el local físico, ' +
    'pero no tiene forma de verificar que la visita ocurrió realmente. ' +
    'Los check-ins en redes sociales son voluntarios y auto-declarados. ' +
    'Los cupones en papel o QR son fácilmente falsificables.',
  solution:
    'Puedes verificar en tiempo real que el cliente está físicamente en el ' +
    'local antes de otorgarle un beneficio o recompensa — sin QR ni tarjeta. ' +
    'La validación ocurre en el servidor en menos de 80 ms, lo que permite ' +
    'integrarla al flujo de compra o al momento de la caja. Cada visita queda ' +
    'registrada con hora y duración para auditoría.',
  capabilities: ['geopoints', 'presence', 'api', 'analytics'],
  matchKeywords: [
    'fidelización', 'puntos por visita', 'loyalty', 'programa de lealtad',
    'premiar visita', 'recompensa presencial', 'beneficio por ir al local',
  ],
}

export const loyaltyMultiLocation: UseCase = {
  id: 'loyalty-multi-location',
  vertical: 'loyalty',
  title: 'Fidelización en cadena de locales',
  problem:
    'Una cadena de restaurantes, farmacias o tiendas quiere implementar un ' +
    'sistema de fidelización unificado que reconozca cuando el cliente ' +
    'visita cualquier sucursal, acumule visitas y entregue beneficios ' +
    'de forma centralizada.',
  solution:
    'Sí. Puedes registrar eventos de presencia verificada en cualquier sucursal de ' +
    'la cadena — sin que el usuario tenga que declarar dónde está ni escanear nada. ' +
    'Cuando tu sistema de loyalty gestiona la identidad de tus usuarios (login propio), ' +
    'puede asociar cada evento de presencia al perfil correspondiente via API: cuántas ' +
    'visitas se registraron en cada sucursal, con qué frecuencia y en qué horarios. ' +
    'Eso permite premiar la frecuencia y la amplitud de visitas según criterios ' +
    'configurables en tu plataforma. Ubyca registra el evento de presencia; ' +
    'tu sistema determina a quién pertenece y actúa en consecuencia.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api', 'integrations'],
  matchKeywords: [
    'cadena de locales', 'sucursales', 'multi-local', 'franquicia',
    'fidelización cadena', 'visita a cualquier sucursal',
    // Lenguaje natural — visitas a múltiples locales
    'visitar varios locales', 'tres locales', 'locales distintos',
    'distintos locales', 'completar visitas a locales',
    'recorrido entre locales', 'premiar por visitar varios',
    'visitas a varios puntos', 'diferentes sucursales',
    // Premiar clientes que visiten más de una tienda (Q5)
    'premiar a los clientes', 'visiten más de una', 'visiten mas de una',
    'visiten varias', 'visitar más de una tienda', 'visitar mas de una tienda',
    'clientes que visiten', 'premiar visitas',
  ],
}

export const loyaltyEngagement: UseCase = {
  id: 'loyalty-engagement',
  vertical: 'loyalty',
  title: 'Contenido exclusivo por presencia física',
  problem:
    'Una marca quiere entregar contenido exclusivo (videos, descuentos, ' +
    'material de lanzamiento) solo a clientes que estén presentes en ' +
    'un evento o local, como refuerzo de la experiencia física.',
  solution:
    'Puedes entregar contenido exclusivo (videos, descuentos, material de ' +
    'lanzamiento) solo a quienes estén físicamente en el lugar — el link no ' +
    'funciona fuera del área, no puede compartirse ni usarse desde casa. El ' +
    'contenido puede estar en una URL existente envuelta con Smart Proxy o ' +
    'detrás de una llamada a la API que valida presencia.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'api'],
  matchKeywords: [
    'contenido exclusivo presencial', 'material solo en local',
    'acceso por ubicación', 'beneficio por estar presente',
    'experiencia física exclusiva', 'lanzamiento presencial',
  ],
}

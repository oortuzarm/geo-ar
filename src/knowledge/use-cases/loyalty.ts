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
    'Ubyca valida en el servidor que el cliente estaba físicamente en el ' +
    'local cuando solicitó el beneficio. El sistema puede responder en ' +
    'menos de 80 ms, lo que permite integrarlo al flujo de compra o al ' +
    'momento de la caja. Cada visita queda registrada con su hora y duración ' +
    'para auditoría posterior.',
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
    'Ubyca permite crear un proyecto con GeoPoints para cada sucursal. ' +
    'Desde el mismo proyecto puedes ver las visitas a todas las sucursales ' +
    'y exportar vía API los datos de visita a tu CRM o sistema de loyalty. ' +
    'El cliente no necesita saber en qué sucursal está: la validación ' +
    'ocurre automáticamente por su ubicación.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api', 'integrations'],
  matchKeywords: [
    'cadena de locales', 'sucursales', 'multi-local', 'franquicia',
    'fidelización cadena', 'visita a cualquier sucursal',
    // Lenguaje natural — visitas a múltiples locales
    'visitar varios locales', 'tres locales', 'locales distintos',
    'distintos locales', 'completar visitas a locales',
    'recorrido entre locales', 'premiar por visitar varios',
    'visitas a varios puntos', 'diferentes sucursales',
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
    'Ubyca activa el acceso al contenido solo cuando el usuario está ' +
    'físicamente en la zona definida. El contenido puede estar en ' +
    'una URL existente envuelta con Smart Proxy o detrás de una llamada ' +
    'a la API que valida presencia. El contenido no puede ser compartido: ' +
    'la validación falla fuera del área.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'api'],
  matchKeywords: [
    'contenido exclusivo presencial', 'material solo en local',
    'acceso por ubicación', 'beneficio por estar presente',
    'experiencia física exclusiva', 'lanzamiento presencial',
  ],
}

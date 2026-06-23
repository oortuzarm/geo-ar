import type { UseCase } from '../types'

export const realEstateVisits: UseCase = {
  id: 'real-estate-visits',
  vertical: 'real-estate',
  title: 'Registro de visitas a propiedades en venta o alquiler',
  problem:
    'Una inmobiliaria necesita saber cuántas personas visitaron cada propiedad, ' +
    'cuánto tiempo permanecieron y si regresaron. Los registros manuales ' +
    'del corredor son incompletos y no permiten comparar el interés real ' +
    'entre propiedades.',
  solution:
    'Ubyca registra automáticamente cuando un potencial comprador o arrendatario ' +
    'llega a la propiedad y cuánto tiempo permanece. La presencia se verifica ' +
    'en el servidor. Puedes comparar el tráfico real entre propiedades y ver ' +
    'cuáles generan más visitas repetidas — datos que informan el precio y la ' +
    'estrategia de marketing.',
  capabilities: ['geopoints', 'presence', 'analytics'],
  matchKeywords: [
    'inmobiliaria', 'propiedad', 'visita a propiedad', 'open house',
    'comprador', 'arrendatario', 'interesado en propiedad',
    'corredora de propiedades', 'real estate',
  ],
}

export const realEstateOpenHouse: UseCase = {
  id: 'real-estate-open-house',
  vertical: 'real-estate',
  title: 'Open house con contenido activado en el lugar',
  problem:
    'Una desarrolladora inmobiliaria organiza jornadas de puertas abiertas ' +
    'y quiere entregar información detallada de cada unidad, planos y ' +
    'beneficios de compra solo a quienes estén físicamente en el proyecto.',
  solution:
    'Ubyca activa el acceso al catálogo, planos y precios solo cuando el ' +
    'visitante está físicamente en el proyecto inmobiliario. El material ' +
    'no puede ser consultado fuera del radio definido, lo que genera ' +
    'exclusividad. Puedes usar Smart Proxy sobre tu catálogo online ' +
    'existente sin modificar el sitio.',
  capabilities: ['geopoints', 'presence', 'smart-proxies'],
  matchKeywords: [
    'open house', 'puertas abiertas', 'proyecto inmobiliario',
    'catálogo presencial', 'material de venta en sitio',
    'showroom', 'sala de ventas',
  ],
}

export const realEstateBuilding: UseCase = {
  id: 'real-estate-building',
  vertical: 'real-estate',
  title: 'Control de acceso y presencia en edificios comerciales',
  problem:
    'Una administración de edificio u oficina comercial necesita registrar ' +
    'quién accede a qué áreas, con qué frecuencia y cuánto tiempo permanece, ' +
    'sin instalar hardware costoso.',
  solution:
    'Ubyca define GeoPoints para las áreas del edificio (lobby, piso, sala ' +
    'de reuniones, terraza). Registra quién entra, cuándo y cuánto tiempo ' +
    'permanece. La presencia se valida vía API sin hardware adicional. ' +
    'Los datos de uso de espacios informan decisiones sobre amenities, ' +
    'seguridad y mantenimiento.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'edificio', 'oficina comercial', 'control de acceso edificio',
    'área restringida', 'uso de espacios', 'gestión de instalaciones',
    'facility management',
  ],
}

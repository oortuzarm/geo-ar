import type { UseCase } from '../types'

export const realEstateVisits: UseCase = {
  id: 'real-estate-visits',
  vertical: 'real-estate',
  title: 'Registro de visitas a propiedades en venta o alquiler',
  problem:
    'Una inmobiliaria necesita saber cuántos eventos de visita ocurrieron en cada ' +
    'propiedad, cuánto tiempo permanecieron los interesados y qué propiedades ' +
    'generan más interés real. Los registros manuales del corredor son incompletos ' +
    'y no permiten comparar el interés real entre propiedades.',
  solution:
    'Puedes saber cuántos eventos de visita se registraron en cada propiedad, ' +
    'cuánto tiempo permanecieron los interesados y qué propiedades acumulan mayor ' +
    'interés — datos reales que informan el precio y la estrategia de marketing, ' +
    'sin depender del corredor. La presencia se verifica automáticamente en el servidor.',
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
  title: 'Sala de ventas y open house con experiencia digital contextual',
  problem:
    'Una desarrolladora inmobiliaria organiza jornadas de puertas abiertas ' +
    'o mantiene una sala de ventas activa y quiere entregar catálogo, planos ' +
    'y precios de forma contextual y medible, con o sin requerir que el ' +
    'visitante esté físicamente en el proyecto como condición.',
  solution:
    'Sí. Puedes crear una experiencia para tu sala de ventas u open house donde ' +
    'el catálogo, planos y precios se activan automáticamente cuando el visitante ' +
    'llega al proyecto — sin que el material circule fuera del sitio ni llegue a ' +
    'quien no estuvo presente. Registras cuántos eventos de visita se produjeron, ' +
    'cuánto tiempo permaneció cada uno y en qué jornadas hubo mayor afluencia — ' +
    'datos reales, no reportes del corredor. Todo se configura desde Studio sin ' +
    'modificar tu sitio web actual y sin que el visitante tenga que instalar nada.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
  matchKeywords: [
    'open house', 'puertas abiertas', 'proyecto inmobiliario',
    'catálogo presencial', 'material de venta en sitio',
    'showroom', 'sala de ventas', 'visita a sala de ventas',
    'planos en proyecto', 'precios en sitio', 'catálogo inmobiliario',
    'desarrollo inmobiliario', 'unidades en venta',
    // Se activan al llegar
    'planos y precios', 'planos y precios se activen',
    'se activen automáticamente', 'se activen al llegar',
    'activen cuando llegue', 'activen cuando llega',
    'cuando un interesado llega', 'interesado llega al proyecto',
    'cuando llegue al proyecto', 'cuando lleguen al proyecto',
    // Material que circule solo en el proyecto
    'material circule fuera', 'material exclusivo',
    'circule fuera del proyecto', 'que no circule fuera',
    'material de open house', 'contenido del open house',
  ],
}

export const realEstatePortfolio: UseCase = {
  id: 'real-estate-portfolio',
  vertical: 'real-estate',
  title: 'Portafolio inmobiliario geolocalizado de proyectos construidos',
  problem:
    'Una constructora o desarrolladora inmobiliaria quiere mostrar su historial ' +
    'de proyectos entregados sobre un mapa — que potenciales clientes, socios o ' +
    'inversores puedan explorar las obras realizadas por zona geográfica y ' +
    'acceder a la información de cada una.',
  solution:
    'Puedes mostrar tu historial de proyectos entregados como un catálogo ' +
    'territorial interactivo: se navega por mapa, no por lista. Al acercarse a ' +
    'cada ubicación, el contenido del proyecto — ficha técnica, renders, dossier ' +
    'o video — se activa en el dispositivo. Sin app nativa, sin modificar el sitio ' +
    'web existente. Se actualiza desde Studio al agregar nuevos proyectos.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
  matchKeywords: [
    // Señales de portafolio inmobiliario específico (fuertes)
    'portafolio inmobiliario', 'portafolio de proyectos inmobiliarios',
    'catálogo inmobiliario', 'catálogo inmobiliario de proyectos',
    'catálogo de desarrollos inmobiliarios',
    'proyectos de la constructora', 'proyectos de la desarrolladora',
    'mapa de proyectos inmobiliarios', 'portafolio de obras',
    'obras de la constructora', 'catálogo de desarrollos',
    // Proyectos completados (compartidas para ganar por combinación)
    'proyectos construidos', 'proyectos entregados', 'obras entregadas',
    'desarrollos realizados', 'historial de proyectos', 'proyectos realizados',
    'catálogo de proyectos construidos', 'obras realizadas inmobiliarias',
  ],
}

export const realEstateBuilding: UseCase = {
  id: 'real-estate-building',
  vertical: 'real-estate',
  title: 'Control de acceso y presencia en edificios comerciales',
  problem:
    'Una administración de edificio u oficina comercial necesita registrar ' +
    'qué áreas registran actividad, con qué frecuencia y cuánto tiempo permanecen ' +
    'los ocupantes — sin instalar hardware costoso.',
  solution:
    'Puedes registrar eventos de presencia en cada área del edificio, cuándo ' +
    'ocurren y cuánto tiempo duran — sin hardware de acceso, lectores de tarjetas ' +
    'ni infraestructura fija. La presencia se valida vía API directamente desde el ' +
    'dispositivo del usuario. Para saber a quién corresponde cada evento, el sistema ' +
    'del edificio debe gestionar la autenticación de los usuarios e incluir el ' +
    'identificador al llamar la API. Los datos de uso informan decisiones sobre ' +
    'amenities, seguridad y mantenimiento.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'edificio', 'oficina comercial', 'control de acceso edificio',
    'área restringida', 'uso de espacios', 'gestión de instalaciones',
    'facility management',
  ],
}

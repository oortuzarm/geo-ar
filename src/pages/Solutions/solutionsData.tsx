import React from 'react'
import {
  RetailEntryVisual,
  RetailLoyaltyVisual,
  RetailCompetitorVisual,
  RetailAnalyticsVisual,
} from './visuals/RetailVisuals'
import {
  TourismContentVisual,
  TourismRouteVisual,
  TourismDwellVisual,
  TourismAnalyticsVisual,
} from './visuals/TourismVisuals'
import {
  EventsEntryVisual,
  EventsZoneVisual,
  EventsDwellVisual,
  EventsAnalyticsVisual,
} from './visuals/EventsVisuals'
import {
  SectorPublicoInfoVisual,
  SectorPublicoRouteVisual,
  SectorPublicoDwellVisual,
  SectorPublicoAnalyticsVisual,
} from './visuals/SectorPublicoVisuals'
import {
  RealEstateEntryVisual,
  RealEstateZoneVisual,
  RealEstateDwellVisual,
  RealEstateAnalyticsVisual,
} from './visuals/RealEstateVisuals'
import {
  BrandActivationEntryVisual,
  BrandActivationDwellVisual,
  BrandActivationConquestVisual,
  BrandActivationAnalyticsVisual,
} from './visuals/ActivacionesMarcaVisuals'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string
  answer: string
}

export interface UseCase {
  category: string
  title: string
  description: string
  visual: React.ReactNode
}

export interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
}

export interface IndustryData {
  slug: string
  name: string
  shortDesc: string
  accentColor: string
  meta: {
    title: string
    description: string
  }
  hero?: {
    label: string
    title: string
    subtitle: string
  }
  intro: {
    headline: string
    body: string
  }
  useCases: [UseCase, UseCase, UseCase, UseCase]
  benefits: Benefit[]
  faq: FAQItem[]
}

// ─── Benefit Icons ────────────────────────────────────────────────────────────

const BenefitIcon = {
  NoApp: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Chart: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Link: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Expand: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  Map: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
}

// ─── Industry Data ────────────────────────────────────────────────────────────

const retail: IndustryData = {
  slug: 'retail',
  name: 'Retail',
  shortDesc: 'Activa experiencias cuando el cliente entra a la tienda',
  accentColor: '#0ea5e9',
  meta: {
    title: 'Ubyca para Retail — Activa experiencias cuando tus clientes están en tienda',
    description: 'Detecta la presencia de tus clientes en el punto de venta y activa mensajes, beneficios y experiencias en el momento de mayor intención de compra. Sin hardware. Sin apps.',
  },
  intro: {
    headline: 'El canal más efectivo para el retail no es digital. Es físico.',
    body: 'Cuando un cliente entra a tu tienda, su intención de compra ya está activa. Es el momento más valioso de su recorrido, y hoy pasa sin que tu marca haga nada. Ubyca convierte ese instante físico en una interacción medible: un mensaje, un beneficio, un motivo para comprar más o para volver.',
  },
  useCases: [
    {
      category: 'ACTIVACIÓN DE ENTRADA',
      title: 'Activa una experiencia en el momento exacto de la visita',
      description: 'Define el radio de cobertura de tu tienda en Studio. Cada vez que un dispositivo entra en esa área, Ubyca activa automáticamente la experiencia que configuraste: un mensaje de bienvenida, un botón para ver la promoción del día, un acceso directo al menú o un enlace a WhatsApp. Sin hardware. Sin apps. Sin fricciones.',
      visual: <RetailEntryVisual />,
    },
    {
      category: 'PERMANENCIA MÍNIMA',
      title: 'Activa la experiencia solo cuando el cliente realmente está en tienda',
      description: 'Agrega una condición de permanencia mínima —por ejemplo, 5 minutos— y Ubyca solo dispara la experiencia si el cliente se queda el tiempo suficiente. Ideal para activar un beneficio cuando alguien está explorando, no al pasar de largo. Configura el botón de acción para abrir WhatsApp, un formulario o cualquier URL que elijas.',
      visual: <RetailLoyaltyVisual />,
    },
    {
      category: 'ZONAS DE CONQUISTA',
      title: 'Activa tu oferta cuando alguien está cerca de la competencia',
      description: 'Define las áreas de tus principales competidores directamente en Studio. Cuando un dispositivo entra en esa zona, Ubyca dispara tu experiencia de forma automática: un mensaje con tu propuesta y un botón directo a tu tienda, tu oferta o tu WhatsApp. El momento de influir es antes de que decidan.',
      visual: <RetailCompetitorVisual />,
    },
    {
      category: 'INTELIGENCIA DE VISITANTES',
      title: 'Visualiza en tiempo real quién está en cada zona de tu tienda',
      description: 'Studio muestra cuántos dispositivos están activos en cada zona, el tiempo de permanencia promedio y los horarios de mayor afluencia. Datos reales, actualizados en vivo, sin encuestas ni estimaciones. Información que hoy no tienes y que cambia cómo planificas el espacio, el equipo y las campañas.',
      visual: <RetailAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Chart />,
      title: 'Más conversión en el momento que más importa',
      description: 'Un mensaje relevante en el instante de mayor intención. Ningún canal digital puede competir con la precisión del momento físico.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Mayor frecuencia de visitas',
      description: 'Cuando una visita activa una experiencia, la tienda se vuelve memorable. El cliente vuelve porque sabe que hay algo esperándolo. Sin necesidad de apps ni tarjetas de fidelización.',
    },
    {
      icon: <BenefitIcon.Link />,
      title: 'Campañas con resultados medibles',
      description: 'Cada activación entrega métricas reales: cuántos clientes activaron la experiencia, cuánto tiempo permanecieron, cuántos convirtieron. Resultados concretos, no estimaciones.',
    },
    {
      icon: <BenefitIcon.Clock />,
      title: 'Decisiones operacionales con datos reales',
      description: 'Flujos de visita por tienda, zonas de mayor permanencia, comportamiento por horario. Información que hoy no tienes y que cambia cómo planificas el espacio y el equipo.',
    },
  ],
  faq: [
    {
      question: '¿Necesito instalar algo en la tienda?',
      answer: 'No. No hay hardware, balizas ni dispositivos que instalar. Ubyca trabaja con el GPS del smartphone del cliente. Solo necesitas crear las zonas en Studio, lo cual toma minutos.',
    },
    {
      question: '¿Tengo que cambiar mi app actual?',
      answer: 'No necesariamente. Ubyca puede integrarse en tu app existente a través de la API REST, o funcionar de forma independiente desde el navegador del cliente sin ninguna descarga adicional.',
    },
    {
      question: '¿El cliente necesita hacer algo para recibir la experiencia?',
      answer: 'Solo necesita haber autorizado el acceso a su ubicación una vez. A partir de ahí, la experiencia se activa automáticamente cada vez que entra a la tienda. Sin fricciones, sin escaneos.',
    },
    {
      question: '¿Cómo mido si las activaciones están funcionando?',
      answer: 'Studio entrega métricas por activación y por tienda: clientes alcanzados, tiempo de permanencia en tienda y frecuencia de visita. Si integras tu sistema de ventas vía API, también puedes medir la conversión directa de cada campaña.',
    },
    {
      question: '¿Funciona con múltiples sucursales?',
      answer: 'Sí. Cada tienda tiene su propia configuración —radio, horario, reglas de activación— pero todas se gestionan desde un único proyecto en Studio. Puedes ver el desempeño global o desglosado por tienda.',
    },
    {
      question: '¿Cuánto tarda en estar operativo?',
      answer: 'El primer GeoPoint puede estar activo en menos de 10 minutos. Defines la zona, configuras la experiencia y comienzas a medir desde el mismo día. Sin semanas de integración ni equipos técnicos dedicados.',
    },
  ],
}

const tourism: IndustryData = {
  slug: 'tourism',
  name: 'Turismo',
  shortDesc: 'Activa contenido cuando el visitante llega al punto de interés',
  accentColor: '#8b5cf6',
  meta: {
    title: 'Ubyca para Turismo — Experiencias geolocalizadas para destinos y rutas',
    description: 'Crea rutas turísticas interactivas donde el contenido se activa al llegar a cada punto. Ideal para destinos, museos, parques naturales y patrimonio cultural.',
  },
  intro: {
    headline: 'El lugar tiene la historia. Ubyca activa el momento.',
    body: 'Los destinos turísticos invierten en contenido que el visitante nunca llega a ver porque no sabe que existe o porque el contexto ya pasó. Ubyca sincroniza el contenido con la ubicación del visitante: el audio que corresponde, el video correcto, la información exacta. Todo en el momento en que está parado frente al lugar.',
  },
  useCases: [
    {
      category: 'ACTIVACIÓN EN PUNTO DE INTERÉS',
      title: 'El contenido se activa al llegar al lugar',
      description: 'Define el radio de cada punto de interés en Studio. Cuando el visitante llega al área, Ubyca activa automáticamente el contenido asignado: audio, video, información o un botón de acción. Sin escanear códigos. Sin buscar en mapas. El lugar es el activador.',
      visual: <TourismContentVisual />,
    },
    {
      category: 'RUTAS CON PARADAS DESBLOQUEABLES',
      title: 'Cada parada del recorrido tiene su propio contenido',
      description: 'Crea un recorrido con múltiples puntos de interés y asocia contenido diferente a cada uno. El visitante avanza por la ruta y recibe lo que corresponde exactamente al llegar a cada lugar. Sin instrucciones previas. Sin abrir mapas adicionales.',
      visual: <TourismRouteVisual />,
    },
    {
      category: 'PERMANENCIA MÍNIMA',
      title: 'Contenido que se desbloquea después de estar en el lugar',
      description: 'Algunos contenidos tienen más valor cuando el visitante ya lleva un rato en el lugar. Configura una permanencia mínima —por ejemplo, 3 minutos— y Ubyca solo activa el video o el audio si el visitante realmente se detuvo. No al pasar. No de camino.',
      visual: <TourismDwellVisual />,
    },
    {
      category: 'INTELIGENCIA DE VISITA',
      title: 'Entiende cómo se mueve el visitante por el recorrido',
      description: 'Studio muestra cuántos dispositivos están activos en cada punto del recorrido y cuánto tiempo permanecen en cada parada. Datos para mejorar la señalización, redistribuir recursos y optimizar la experiencia sin encuestas ni estimaciones.',
      visual: <TourismAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin apps que instalar',
      description: 'El visitante accede desde el navegador de su teléfono. Sin fricciones de descarga, compatible con cualquier dispositivo móvil.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Cualquier tipo de contenido',
      description: 'Audio, video, PDF, sitio web o WhatsApp. Configura la acción que mejor se adapta a cada punto del recorrido.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'Datos del flujo turístico',
      description: 'Permanencia por punto de interés, horarios de mayor afluencia y tasas de recorrido completado para optimizar la experiencia.',
    },
    {
      icon: <BenefitIcon.Expand />,
      title: 'Escala sin infraestructura',
      description: 'Agrega o modifica puntos de interés sin instalar nada en el espacio. Todo se configura desde Studio en minutos.',
    },
  ],
  faq: [
    {
      question: '¿Funciona en zonas sin cobertura de datos?',
      answer: 'La validación de presencia requiere conexión a internet. En zonas sin señal, el contenido puede pre-cargarse cuando el visitante tiene cobertura y estar disponible de forma local durante el recorrido.',
    },
    {
      question: '¿Se puede configurar una ruta con paradas en un orden específico?',
      answer: 'Sí. Puedes definir que cada parada solo se desbloquea al llegar al área correspondiente, o permitir que el visitante recorra libremente y reciba el contenido de cada punto cuando llegue.',
    },
    {
      question: '¿Cómo accede el visitante a la ruta?',
      answer: 'El organizador genera un enlace desde Studio. El visitante lo abre en su navegador, autoriza la ubicación y comienza. Sin descargas adicionales.',
    },
    {
      question: '¿Funciona para audio guías en museos?',
      answer: 'Sí. Cada punto puede tener asociado un archivo de audio. Cuando el visitante entra en el radio del punto, el audio se activa automáticamente desde el navegador.',
    },
    {
      question: '¿Cuántos puntos puede tener una ruta?',
      answer: 'No hay un límite técnico en la cantidad de GeoPoints por proyecto. Puedes crear recorridos cortos de 3 paradas o rutas extensas con decenas de puntos de interés.',
    },
  ],
}

const events: IndustryData = {
  slug: 'events',
  name: 'Eventos',
  shortDesc: 'Activa contenido en cada zona del recinto sin hardware adicional',
  accentColor: '#10b981',
  meta: {
    title: 'Ubyca para Eventos — Experiencias geolocalizadas por zona del recinto',
    description: 'Activa contenido diferente en cada zona del evento, valida presencia en sesiones y mide el comportamiento espacial de los asistentes en tiempo real. Sin beacons ni infraestructura.',
  },
  intro: {
    headline: 'El evento ocurre en un espacio físico. La experiencia también puede serlo.',
    body: 'Los eventos reúnen personas en un lugar durante un tiempo definido. Cada zona del recinto, cada stand y cada sesión es una oportunidad de activar contenido relevante en el momento exacto. Ubyca conecta el espacio con la experiencia, sin hardware adicional y sin que el asistente instale nada.',
  },
  useCases: [
    {
      category: 'ACTIVACIÓN AL INGRESAR AL RECINTO',
      title: 'Activa la bienvenida cuando el asistente llega al evento',
      description: 'Define el perímetro del recinto en Studio. Cuando un dispositivo entra en esa área, Ubyca activa automáticamente la experiencia: el programa del día, un botón para abrir el mapa del recinto o un acceso directo al WhatsApp del equipo de producción.',
      visual: <EventsEntryVisual />,
    },
    {
      category: 'CONTENIDO POR ZONA',
      title: 'Cada zona del evento activa su propio contenido',
      description: 'Define áreas específicas dentro del recinto —un escenario, un stand, una sala— y configura qué experiencia se activa en cada una. El contenido del patrocinador aparece solo en su zona. El material de la sesión aparece solo en esa sala. Sin fricciones para el asistente.',
      visual: <EventsZoneVisual />,
    },
    {
      category: 'PERMANENCIA EN SESIÓN',
      title: 'Desbloquea el material solo si el asistente estuvo presente',
      description: 'Configura una permanencia mínima para cada sesión. Si el asistente estuvo el tiempo suficiente, Ubyca activa automáticamente el acceso al material: la presentación, un archivo descargable o un enlace. La presencia es el requisito, no un formulario.',
      visual: <EventsDwellVisual />,
    },
    {
      category: 'INTELIGENCIA DE RECINTO',
      title: 'Visualiza en tiempo real cómo se distribuye el recinto',
      description: 'Studio muestra cuántos dispositivos están activos en cada zona del evento, el tiempo de permanencia promedio y los horarios de mayor concentración. Datos para el equipo de producción sin instalar sensores ni infraestructura adicional.',
      visual: <EventsAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin hardware',
      description: 'No se necesitan balizas, torniquetes ni lectores. La presencia GPS del dispositivo es suficiente para activar contenido en cada zona.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'Métricas por zona',
      description: 'Cada área del evento entrega datos reales de visitantes, permanencia y comportamiento para el equipo de producción y los patrocinadores.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Contenido contextual',
      description: 'El asistente recibe lo que corresponde a su zona actual, en el momento en que está ahí. No una notificación genérica enviada a todos.',
    },
    {
      icon: <BenefitIcon.Link />,
      title: 'Integración con tus sistemas',
      description: 'Conecta los eventos de presencia con tu plataforma de gestión de eventos vía API o webhook.',
    },
  ],
  faq: [
    {
      question: '¿Funciona en espacios cerrados como salas de conferencia?',
      answer: 'Sí, con precisión variable según la estructura del edificio. El GPS funciona en la mayoría de recintos. Para espacios muy cerrados o con paredes de gran espesor, Ubyca puede combinarse con mecanismos de activación complementarios.',
    },
    {
      question: '¿Los patrocinadores tienen acceso a los datos de sus zonas?',
      answer: 'Puedes generar reportes por zona con métricas agregadas: dispositivos únicos, tiempo promedio de permanencia y distribución horaria. Los datos son agregados y no incluyen información personal de los asistentes.',
    },
    {
      question: '¿Cuántos asistentes simultáneos puede gestionar?',
      answer: 'El motor de presencia está diseñado para escalar. Para eventos de gran magnitud, conversemos sobre la arquitectura específica y los volúmenes esperados.',
    },
    {
      question: '¿Cómo acceden los asistentes a la experiencia?',
      answer: 'El organizador comparte un enlace previo al evento —por email, en la app o mediante QR en la entrada. El asistente lo abre en su navegador, autoriza la ubicación y la experiencia comienza de forma automática.',
    },
    {
      question: '¿Se puede limitar la activación por horario?',
      answer: 'Sí. Cada GeoPoint puede configurarse con días y horarios específicos de activación. Una sala solo activa contenido durante la sesión correspondiente, por ejemplo.',
    },
  ],
}

const sectorPublico: IndustryData = {
  slug: 'sector-publico',
  name: 'Sector Público',
  shortDesc: 'Digitaliza espacios públicos y entrega información contextual a ciudadanos y visitantes',
  accentColor: '#06b6d4',
  meta: {
    title: 'Ubyca para Sector Público — Digitaliza espacios y experiencias ciudadanas',
    description: 'Conecta municipalidades, parques, centros históricos y espacios públicos con experiencias digitales activadas por ubicación. Entrega información contextual y mide el comportamiento de ciudadanos y visitantes.',
  },
  intro: {
    headline: 'Los espacios públicos tienen historia. Los ciudadanos no siempre saben cómo acceder a ella.',
    body: 'Municipalidades, parques, centros históricos y oficinas de turismo generan contenido que los visitantes nunca llegan a consumir porque no saben que existe o llega sin contexto. Ubyca sincroniza la información con el lugar: el aviso correcto en la plaza que corresponde, la guía del centro histórico cuando el visitante está frente a él, la campaña pública en el espacio donde realmente importa.',
  },
  useCases: [
    {
      category: 'INFORMACIÓN EN EL LUGAR',
      title: 'La información llega cuando el ciudadano está en el espacio',
      description: 'Define el área de cada punto de interés —una plaza, un monumento, un acceso de parque— y configura el contenido que cada persona verá al llegar. Un mensaje de bienvenida, un mapa interactivo, las reglas del espacio o el programa de actividades. Sin aplicaciones adicionales. Sin señalética que actualizar.',
      visual: <SectorPublicoInfoVisual />,
    },
    {
      category: 'RECORRIDOS PATRIMONIALES',
      title: 'Cada parada del recorrido tiene su propio contenido',
      description: 'Crea rutas con múltiples puntos de interés y asocia contenido diferente a cada uno: audio guía, historia del lugar, información visual, acceso a fichas patrimoniales. El visitante avanza por el recorrido y recibe lo que corresponde al llegar a cada punto. Sin instrucciones previas. Sin buscar en el teléfono.',
      visual: <SectorPublicoRouteVisual />,
    },
    {
      category: 'PERMANENCIA EN PUNTO DE INTERÉS',
      title: 'El contenido completo se activa cuando el visitante realmente se detiene',
      description: 'Algunos contenidos tienen más valor cuando el visitante ya lleva un tiempo en el lugar. Configura una permanencia mínima —por ejemplo, 3 minutos— y Ubyca activa el audio guía extendido, el video documental o el acceso al material descargable solo si la persona realmente se detuvo. No al pasar de largo.',
      visual: <SectorPublicoDwellVisual />,
    },
    {
      category: 'ANALÍTICA DE FLUJO CIUDADANO',
      title: 'Entiende cómo se distribuyen los visitantes en el espacio público',
      description: 'Studio muestra cuántos dispositivos están activos en cada zona, cuánto tiempo permanecen y en qué horarios se concentra la afluencia. Información para planificar recursos, optimizar la señalética y tomar decisiones sobre el uso del espacio sin encuestas ni conteos manuales.',
      visual: <SectorPublicoAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Expand />,
      title: 'Sin inversión en infraestructura',
      description: 'No se instalan pantallas, balizas ni dispositivos en el espacio. El contenido vive en la nube y se gestiona completamente desde Studio.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Cualquier tipo de contenido',
      description: 'Audio, video, PDF, formularios o sitios web. Configura el formato que mejor se adapta a cada punto del recorrido o espacio público.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'Datos del comportamiento ciudadano',
      description: 'Flujo de visitas por zona, horarios de mayor afluencia y tiempo promedio de permanencia para mejorar la planificación del espacio.',
    },
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin apps que descargar',
      description: 'Los ciudadanos y visitantes acceden desde el navegador de su teléfono. Sin instalaciones. Sin barreras de entrada para nadie.',
    },
  ],
  faq: [
    {
      question: '¿Se necesita una app oficial del municipio para funcionar?',
      answer: 'No. El ciudadano accede desde el navegador de su teléfono. Si ya existe una app municipal, Ubyca también puede integrarse en ella vía API para mantener la identidad institucional.',
    },
    {
      question: '¿Cómo se garantiza la privacidad de los ciudadanos?',
      answer: 'Ubyca solo valida si un dispositivo está dentro de una zona definida. No almacena trayectorias individuales ni historial de movimiento. Los datos de analytics son agregados y anónimos.',
    },
    {
      question: '¿Funciona en espacios abiertos como parques y plazas?',
      answer: 'Sí. Los espacios al aire libre ofrecen la mayor precisión GPS. El sistema puede definir zonas desde un pequeño kiosco hasta un parque completo o un centro histórico extenso.',
    },
    {
      question: '¿Puede usarse en recorridos patrimoniales o culturales?',
      answer: 'Sí, es uno de los casos más comunes. Puedes crear rutas con múltiples paradas, cada una con su propio contenido, sin instalar nada en el espacio ni en los monumentos.',
    },
    {
      question: '¿Cuánto tiempo tarda en configurarse una nueva zona?',
      answer: 'Un nuevo GeoPoint puede estar activo en minutos. Define el área en el mapa, configura el contenido y publica. No se requieren equipos técnicos ni permisos de instalación en el terreno.',
    },
  ],
}

const realEstate: IndustryData = {
  slug: 'real-estate',
  name: 'Real Estate',
  shortDesc: 'Activa experiencias cuando el interesado llega al proyecto o sala de ventas',
  accentColor: '#ef4444',
  meta: {
    title: 'Ubyca para Real Estate — Activa experiencias cuando el interesado está en el proyecto',
    description: 'Entrega información del proyecto, fichas técnicas y materiales de venta cuando el interesado llega físicamente al lugar. Mide las visitas a cada sala de ventas y toma decisiones con datos reales.',
  },
  intro: {
    headline: 'El interesado ya está en el proyecto. Es el momento más valioso de la venta.',
    body: 'Cuando alguien se toma el tiempo de llegar físicamente a un proyecto inmobiliario, su intención de compra está activa. Ese momento —estar parado frente al edificio, recorrer una sala de ventas, visitar los departamentos modelo— es el de mayor receptividad. Ubyca lo aprovecha para entregar la información correcta en el lugar exacto, sin depender de que el asesor esté disponible o de que el interesado encuentre el material por su cuenta.',
  },
  useCases: [
    {
      category: 'ACTIVACIÓN EN EL PROYECTO',
      title: 'La información del proyecto se activa cuando el interesado llega',
      description: 'Define el área de la sala de ventas o del proyecto en Studio. Cuando un dispositivo entra en esa zona, Ubyca activa automáticamente la experiencia: la ficha técnica del proyecto, un botón para agendar una visita guiada o el acceso directo al asesor por WhatsApp. Sin que el interesado tenga que buscar nada.',
      visual: <RealEstateEntryVisual />,
    },
    {
      category: 'ZONAS DEL PROYECTO',
      title: 'Cada área del proyecto activa su propio contenido',
      description: 'Define zonas dentro del proyecto —sala de ventas, departamentos modelo, áreas comunes— y configura qué contenido se activa en cada una. Los renders del proyecto cuando el interesado está en la sala, las especificaciones técnicas cuando recorre la unidad modelo, el reglamento en las áreas comunes.',
      visual: <RealEstateZoneVisual />,
    },
    {
      category: 'PERMANENCIA EN SALA DE VENTAS',
      title: 'Activa el material completo solo cuando el interesado realmente visitó',
      description: 'Configura una permanencia mínima en la sala de ventas para distinguir a quienes realmente recorrieron el proyecto de quienes pasaron de largo. Cuando se cumple el tiempo, Ubyca activa automáticamente el material completo: cotizaciones, plantas o un formulario de contacto.',
      visual: <RealEstateDwellVisual />,
    },
    {
      category: 'ANALÍTICA DE VISITAS',
      title: 'Conoce el comportamiento real de los interesados en el proyecto',
      description: 'Studio entrega métricas reales de cada punto de venta: dispositivos que visitaron, tiempo promedio de permanencia y distribución horaria. Datos que hoy no tienes y que cambian cómo planificas el equipo de ventas, los horarios de atención y las campañas de captación.',
      visual: <RealEstateAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Clock />,
      title: 'Información disponible las 24 horas',
      description: 'La experiencia se activa cuando el interesado llega, incluso fuera del horario de atención. El proyecto nunca está cerrado para quien llega.',
    },
    {
      icon: <BenefitIcon.Shield />,
      title: 'Datos de visita verificados',
      description: 'Cada entrada registrada corresponde a una presencia física real en el proyecto, no a un clic o una visualización de anuncio digital.',
    },
    {
      icon: <BenefitIcon.Link />,
      title: 'Integración con tu CRM',
      description: 'Conecta los eventos de visita con tu sistema de gestión comercial vía API para enriquecer el seguimiento de cada interesado.',
    },
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin hardware en el proyecto',
      description: 'No se necesitan tablets, terminales ni dispositivos adicionales. Todo funciona con el GPS del smartphone del interesado.',
    },
  ],
  faq: [
    {
      question: '¿Funciona para proyectos en preventa o en obra?',
      answer: 'Sí. Puedes activar una experiencia desde el inicio de la venta, antes incluso de que exista una sala de ventas física. El GeoPoint puede definirse en el terreno del futuro proyecto.',
    },
    {
      question: '¿Cómo accede el interesado a la información?',
      answer: 'El equipo comercial comparte el enlace por cualquier canal previo a la visita —WhatsApp, email, avisos de campaña digital. El interesado lo abre al llegar y la experiencia comienza de forma automática.',
    },
    {
      question: '¿El interesado necesita instalar algo?',
      answer: 'No. Todo funciona desde el navegador del teléfono. Sin descargas, sin fricciones de onboarding previo a la visita.',
    },
    {
      question: '¿Puedo gestionar múltiples proyectos desde el mismo panel?',
      answer: 'Sí. Cada proyecto tiene su propia configuración en Studio, pero todos se administran desde la misma cuenta. Puedes ver métricas globales o desglosadas por proyecto.',
    },
    {
      question: '¿Puedo conectar los datos de visita con mi CRM?',
      answer: 'Sí, vía API. Los eventos de presencia pueden enviarse a tu sistema de gestión comercial para enriquecer el historial de cada interesado y disparar flujos de seguimiento automáticos.',
    },
  ],
}

const activacionesMarca: IndustryData = {
  slug: 'brand-activations',
  name: 'Activaciones de Marca',
  shortDesc: 'Activa experiencias cuando el público llega a la zona de tu activación',
  accentColor: '#f97316',
  meta: {
    title: 'Ubyca para Activaciones de Marca — Experiencias geolocalizadas en terreno',
    description: 'Activa contenido, beneficios y experiencias cuando el público llega a tu zona. Mide la participación real de cada activación de marca, pop-up, lanzamiento o evento patrocinado.',
  },
  intro: {
    headline: 'La activación ocurre en un lugar. La experiencia también debería hacerlo.',
    body: 'Una activación de marca reúne personas en un espacio durante un tiempo definido. Cada segundo que alguien pasa en tu zona es una oportunidad de entregar algo memorable: contenido exclusivo, una dinámica de participación, un acceso a tu producto o simplemente información que el público no esperaba. Ubyca conecta el espacio físico con la experiencia digital sin que el equipo en terreno tenga que hacer nada adicional.',
  },
  useCases: [
    {
      category: 'ACTIVACIÓN DE ZONA',
      title: 'La experiencia se activa cuando el público llega a tu zona',
      description: 'Define el perímetro de tu activación en Studio —un pop-up, un stand, una zona de sampling, un lanzamiento— y configura la experiencia que se activa al entrar. Un mensaje de bienvenida, acceso a contenido exclusivo, un botón de participación o el enlace directo a tu plataforma. Sin que el equipo tenga que acercarse a cada persona.',
      visual: <BrandActivationEntryVisual />,
    },
    {
      category: 'CONTENIDO POR PERMANENCIA',
      title: 'El contenido premium se desbloquea para quienes realmente se quedan',
      description: 'Separa a quienes pasan de largo de quienes realmente participan de tu activación. Configura una permanencia mínima y activa el contenido exclusivo solo para quienes se quedaron el tiempo suficiente: un descuento especial, acceso a un material único o la participación en una dinámica. Mayor relevancia, menor dilución del impacto.',
      visual: <BrandActivationDwellVisual />,
    },
    {
      category: 'ZONAS DE CONQUISTA',
      title: 'Alcanza al público cuando está cerca de la competencia',
      description: 'Define zonas en puntos de alta concentración de tu público objetivo o cerca de la competencia. Cuando un dispositivo entra en esa área, Ubyca activa tu experiencia: tu propuesta, tu oferta o una invitación directa a tu activación. El momento de influir es antes de que se forme la decisión.',
      visual: <BrandActivationConquestVisual />,
    },
    {
      category: 'MEDICIÓN DE PARTICIPACIÓN',
      title: 'Mide el alcance real de cada activación con datos verificables',
      description: 'Studio muestra cuántos dispositivos estuvieron en tu zona, durante cuánto tiempo y en qué momentos se concentró la afluencia. Datos reales de presencia para reportes de campaña sin depender de estimaciones. Comparte métricas concretas con tu cliente o el equipo de marketing.',
      visual: <BrandActivationAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Shield />,
      title: 'Participación verificada',
      description: 'Cada contacto registrado corresponde a alguien que estuvo físicamente en la zona de la activación. No a una estimación de alcance ni a un impacto publicitario.',
    },
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin personal de activación permanente',
      description: 'La experiencia se activa automáticamente. El equipo en terreno puede enfocarse en la interacción directa con el público, no en distribuir materiales.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Cualquier tipo de contenido',
      description: 'Video, audio, enlace, formulario o acceso directo a WhatsApp. Configura la acción que mejor funciona para tu activación y tu público.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'Reportes de campaña con datos reales',
      description: 'Comparte métricas de presencia verificadas con el cliente o el equipo de marketing. Alcance real, tiempo en zona y comportamiento horario, no proyecciones.',
    },
  ],
  faq: [
    {
      question: '¿Funciona para activaciones de un solo día?',
      answer: 'Sí. Cada GeoPoint puede configurarse con fechas específicas de activación. Un lanzamiento de un día, una sampling de fin de semana o una campaña de un mes: el período de activación lo defines tú desde Studio.',
    },
    {
      question: '¿Se requiere personal en la zona para que funcione?',
      answer: 'No. La experiencia se activa de forma automática cuando el dispositivo entra en la zona. El equipo en terreno puede concentrarse en la interacción directa con el público.',
    },
    {
      question: '¿Cómo accede el público a la experiencia?',
      answer: 'A través de un enlace que se comparte antes o durante la activación: en redes sociales, por WhatsApp, impreso en el material de la activación o mediante un QR en el espacio.',
    },
    {
      question: '¿Puedo medir la diferencia entre quienes entraron a la zona y quienes interactuaron?',
      answer: 'Sí. Studio distingue dispositivos que entraron en la zona, tiempo de permanencia e interacciones con la experiencia. Métricas que separan el alcance geográfico del compromiso real con la activación.',
    },
    {
      question: '¿Ubyca reemplaza las plataformas de gestión de eventos?',
      answer: 'No necesariamente. Ubyca se enfoca en la capa de presencia y activación geolocalizada. Puede funcionar de forma complementaria a cualquier plataforma de gestión de eventos o CRM vía API.',
    },
  ],
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const INDUSTRIES: IndustryData[] = [
  retail,
  tourism,
  events,
  sectorPublico,
  realEstate,
  activacionesMarca,
]

export function getIndustry(slug: string): IndustryData | undefined {
  return INDUSTRIES.find(i => i.slug === slug)
}
